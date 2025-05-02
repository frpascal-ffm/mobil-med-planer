
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockBookings, mockVehicles } from "@/services/mockData";
import { Booking, Vehicle } from "@/types";
import { Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import { format, addDays } from "date-fns";
import { de } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Schedule = () => {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const { user } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const activeDate = selectedDate.toISOString().split('T')[0];
  
  // Get bookings for the active date
  const [bookings, setBookings] = useState(mockBookings);
  const [syncingBooking, setSyncingBooking] = useState<string | null>(null);
  const [hasGoogleCalendarSelected, setHasGoogleCalendarSelected] = useState(false);
  const dateBookings = bookings.filter(booking => booking.date === activeDate);
  
  // Get vehicles with associated bookings
  const vehiclesWithBookings = mockVehicles
    .filter(vehicle => vehicle.status === "active")
    .map(vehicle => {
      const vehicleBookings = dateBookings.filter(booking => booking.vehicleId === vehicle.id);
      return {
        ...vehicle,
        bookings: vehicleBookings,
      };
    });
  
  // Check if user has Google Calendar connected and selected
  useEffect(() => {
    const checkGoogleCalendarSetup = async () => {
      if (!user) return;
      
      try {
        const { data: calendar, error } = await supabase
          .from('user_google_calendars')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_selected', true)
          .maybeSingle();
        
        setHasGoogleCalendarSelected(!!calendar);
      } catch (error) {
        console.error('Error checking Google Calendar setup:', error);
      }
    };
    
    checkGoogleCalendarSetup();
  }, [user]);
  
  // Timeblocks for the schedule
  const timeBlocks = [];
  for (let hour = 0; hour < 24; hour++) {
    timeBlocks.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  
  // Find bookings for a specific vehicle and hour
  const getBookingsForTimeBlock = (vehicleId: string | null, timeBlock: string) => {
    const hour = parseInt(timeBlock.split(':')[0]);
    
    // Filter bookings that fall within this hour
    return dateBookings.filter(booking => {
      const bookingHour = parseInt(booking.time.split(':')[0]);
      return (vehicleId === null && !booking.vehicleId && bookingHour === hour) || 
             (booking.vehicleId === vehicleId && bookingHour === hour);
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // Handle drag and drop
  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) return;

    // If dropped in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the booking that was dragged
    const booking = bookings.find(booking => booking.id === draggableId);
    if (!booking) return;

    // Create a new array of bookings
    const newBookings = bookings.map(b => {
      if (b.id === draggableId) {
        // Update the booking's vehicleId
        return {
          ...b,
          vehicleId: destination.droppableId === "no-vehicle" ? null : destination.droppableId,
        };
      }
      return b;
    });

    setBookings(newBookings);

    // Sync with Google Calendar if connected
    if (user && hasGoogleCalendarSelected) {
      const updatedBooking = newBookings.find(b => b.id === draggableId);
      if (updatedBooking) {
        await syncBookingWithGoogleCalendar(updatedBooking.id, "update");
      }
    }
  };

  // Sync a booking with Google Calendar
  const syncBookingWithGoogleCalendar = async (bookingId: string, action: 'create' | 'update' | 'delete') => {
    if (!user) return;
    
    try {
      setSyncingBooking(bookingId);
      
      const response = await fetch('https://gczkuolrxmwfwhcgllva.supabase.co/functions/v1/sync-calendar-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          bookingId,
          action,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync with Google Calendar');
      }
      
      const result = await response.json();
      
      if (action === 'create') {
        toast.success('Fahrt zum Google Kalender hinzugefügt');
      } else if (action === 'update') {
        toast.success('Fahrt im Google Kalender aktualisiert');
      } else if (action === 'delete') {
        toast.success('Fahrt aus dem Google Kalender entfernt');
      }
      
      return result;
    } catch (error) {
      console.error(`Error ${action}ing booking in Google Calendar:`, error);
      toast.error(`Fehler beim ${action === 'create' ? 'Erstellen' : action === 'update' ? 'Aktualisieren' : 'Löschen'} im Google Kalender`);
    } finally {
      setSyncingBooking(null);
    }
  };

  // Sync all unassigned bookings with Google Calendar
  const syncAllBookingsWithGoogleCalendar = async () => {
    if (!user || !hasGoogleCalendarSelected) return;
    
    toast.info('Synchronisiere Fahrten mit Google Kalender...');
    
    for (const booking of dateBookings) {
      await syncBookingWithGoogleCalendar(booking.id, booking.google_event_id ? 'update' : 'create');
    }
    
    toast.success('Alle Fahrten wurden mit Google Kalender synchronisiert');
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Fahrtenplanung</h2>
        <p className="text-muted-foreground">
          Übersicht aller Buchungen und Fahrzeuge
        </p>
      </div>
      
      <div className="flex items-center space-x-4 mb-2">
        <Button
          variant={selectedDate.toDateString() === today.toDateString() ? "default" : "outline"}
          onClick={() => setSelectedDate(today)}
          size="sm"
        >
          Heute
        </Button>
        <Button
          variant={selectedDate.toDateString() === tomorrow.toDateString() ? "default" : "outline"}
          onClick={() => setSelectedDate(tomorrow)}
          size="sm"
        >
          Morgen
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {format(selectedDate, "dd.MM.yyyy", { locale: de })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {hasGoogleCalendarSelected && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={syncAllBookingsWithGoogleCalendar}
            disabled={syncingBooking !== null}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncingBooking ? 'animate-spin' : ''}`} />
            Mit Google Kalender synchronisieren
          </Button>
        )}
      </div>
      
      <Card className="overflow-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-[auto_1fr]">
            {/* Time blocks column */}
            <div className="min-w-[50px] border-r bg-gray-50">
              <div className="h-10 border-b flex items-center justify-center text-xs font-medium bg-gray-100 text-gray-700">
                Zeit
              </div>
              <div className="h-[calc(100vh-280px)] overflow-auto">
                {timeBlocks.map((time) => (
                  <div 
                    key={time} 
                    className="h-12 px-1 border-b flex items-center justify-center text-xs text-gray-500"
                  >
                    {time}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Schedule grid */}
            <div className="overflow-auto">
              <div className="min-w-max">
                {/* Header row with vehicle names */}
                <div className="flex">
                  {vehiclesWithBookings.map((vehicle) => (
                    <div 
                      key={vehicle.id} 
                      className="h-10 border-b border-r px-2 bg-gray-100 flex items-center justify-center min-w-[180px]"
                    >
                      <div className="font-medium text-sm text-gray-700">
                        {vehicle.licensePlate}
                      </div>
                    </div>
                  ))}
                  
                  <div className="h-10 border-b px-2 bg-gray-100 flex items-center justify-center min-w-[180px]">
                    <div className="font-medium text-sm text-gray-700">
                      Ohne Fahrzeug
                    </div>
                  </div>
                </div>
                
                {/* Time blocks grid with scrolling */}
                <div className="h-[calc(100vh-280px)] overflow-auto">
                  {timeBlocks.map((time) => (
                    <div key={time} className="flex">
                      {vehiclesWithBookings.map((vehicle) => (
                        <Droppable key={`${vehicle.id}`} droppableId={vehicle.id}>
                          {(provided, snapshot) => (
                            <div 
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              key={`${vehicle.id}-${time}`} 
                              className={`h-12 border-b border-r p-1 min-w-[180px] ${snapshot.isDraggingOver ? 'bg-gray-50' : ''}`}
                            >
                              {getBookingsForTimeBlock(vehicle.id, time).map((booking, index) => (
                                <Draggable key={booking.id} draggableId={booking.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div 
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        ...provided.draggableProps.style,
                                        opacity: snapshot.isDragging ? 0.8 : 1
                                      }}
                                      className="p-1 text-xs bg-medical-100 border-l-2 border-medical-500 rounded mb-1 shadow-sm cursor-grab active:cursor-grabbing"
                                    >
                                      <div className="flex justify-between items-start">
                                        <span className="font-medium">{booking.time} Uhr</span>
                                        {booking.transportType === "wheelchair" && (
                                          <span className="bg-amber-100 text-amber-800 px-1 rounded flex items-center">
                                            <span className="mr-1">♿</span>
                                          </span>
                                        )}
                                        {syncingBooking === booking.id && (
                                          <RefreshCw className="h-3 w-3 animate-spin ml-1 text-gray-500" />
                                        )}
                                      </div>
                                      <div className="font-medium truncate">{booking.customerName}</div>
                                      <div className="truncate text-gray-600">{booking.pickupAddress}</div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      ))}
                      
                      <Droppable droppableId="no-vehicle" key="no-vehicle">
                        {(provided, snapshot) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            key={`unassigned-${time}`} 
                            className={`h-12 border-b p-1 min-w-[180px] ${snapshot.isDraggingOver ? 'bg-gray-100' : 'bg-gray-50'}`}
                          >
                            {getBookingsForTimeBlock(null, time).map((booking, index) => (
                              <Draggable key={booking.id} draggableId={booking.id} index={index}>
                                {(provided, snapshot) => (
                                  <div 
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      ...provided.draggableProps.style,
                                      opacity: snapshot.isDragging ? 0.8 : 1
                                    }}
                                    className="p-1 text-xs bg-red-50 border-l-2 border-red-500 rounded mb-1 shadow-sm cursor-grab active:cursor-grabbing"
                                  >
                                    <div className="flex justify-between items-start">
                                      <span className="font-medium">{booking.time} Uhr</span>
                                      {booking.transportType === "wheelchair" && (
                                        <span className="bg-amber-100 text-amber-800 px-1 rounded flex items-center">
                                          <span className="mr-1">♿</span>
                                        </span>
                                      )}
                                      {syncingBooking === booking.id && (
                                        <RefreshCw className="h-3 w-3 animate-spin ml-1 text-gray-500" />
                                      )}
                                    </div>
                                    <div className="font-medium truncate">{booking.customerName}</div>
                                    <div className="truncate text-gray-600">{booking.pickupAddress}</div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DragDropContext>
      </Card>
      
      <div className="flex items-center bg-gray-50 rounded-lg p-2 text-xs">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-red-50 border-l-2 border-red-500 mr-2"></span>
          <span className="text-gray-700 mr-4">Unzugewiesene Buchung</span>
          
          <span className="w-3 h-3 bg-medical-100 border-l-2 border-medical-500 mr-2"></span>
          <span className="text-gray-700 mr-4">Zugewiesene Buchung</span>
          
          <span className="w-3 h-3 bg-amber-100 mr-2 flex items-center justify-center text-amber-800 text-xs">♿</span>
          <span className="text-gray-700">Rollstuhlfahrt</span>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
