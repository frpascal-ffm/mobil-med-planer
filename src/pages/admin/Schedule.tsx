
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockBookings, mockVehicles } from "@/services/mockData";
import { Booking, Vehicle } from "@/types";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { format, addDays, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Schedule = () => {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const activeDate = selectedDate.toISOString().split('T')[0];
  
  // Get bookings for the active date
  const dateBookings = mockBookings.filter(booking => booking.date === activeDate);
  
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
      </div>
      
      <Card className="overflow-hidden">
        <div className="grid grid-cols-[auto_1fr]">
          {/* Time blocks column */}
          <div className="min-w-[50px] border-r bg-gray-50">
            <div className="h-10 border-b flex items-center justify-center text-xs font-medium bg-gray-100 text-gray-700">
              Zeit
            </div>
            <ScrollArea className="h-[calc(100vh-280px)]">
              {timeBlocks.map((time) => (
                <div 
                  key={time} 
                  className="h-16 px-1 border-b flex items-center justify-center text-xs text-gray-500"
                >
                  {time}
                </div>
              ))}
            </ScrollArea>
          </div>
          
          {/* Schedule grid */}
          <div className="overflow-x-auto">
            <div className="min-w-full grid" style={{ gridTemplateColumns: `repeat(${vehiclesWithBookings.length + 1}, minmax(180px, 1fr))` }}>
              {/* Header row with vehicle names */}
              <div className="grid" style={{ gridTemplateColumns: `repeat(${vehiclesWithBookings.length + 1}, minmax(180px, 1fr))` }}>
                {vehiclesWithBookings.map((vehicle) => (
                  <div key={vehicle.id} className="h-10 border-b border-r px-2 bg-gray-100 flex items-center justify-center">
                    <div className="font-medium text-sm text-gray-700">
                      {vehicle.licensePlate}
                    </div>
                  </div>
                ))}
                
                <div className="h-10 border-b px-2 bg-gray-100 flex items-center justify-between">
                  <div className="font-medium text-sm text-gray-700">
                    Ohne Fahrzeug
                  </div>
                </div>
              </div>
              
              {/* Time blocks grid with scrolling */}
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div>
                  {timeBlocks.map((time) => (
                    <div key={time} className="grid" style={{ gridTemplateColumns: `repeat(${vehiclesWithBookings.length + 1}, minmax(180px, 1fr))` }}>
                      {vehiclesWithBookings.map((vehicle) => {
                        const bookings = getBookingsForTimeBlock(vehicle.id, time);
                        return (
                          <div key={`${vehicle.id}-${time}`} className="h-16 border-b border-r p-1">
                            {bookings.map((booking) => (
                              <div 
                                key={booking.id} 
                                className="p-1 text-xs bg-medical-100 border-l-2 border-medical-500 rounded mb-1 shadow-sm"
                              >
                                <div className="flex justify-between items-start">
                                  <span className="font-medium">{booking.time} Uhr</span>
                                  {booking.transportType === "wheelchair" && (
                                    <span className="bg-amber-100 text-amber-800 px-1 rounded flex items-center">
                                      <span className="mr-1">♿</span>
                                    </span>
                                  )}
                                </div>
                                <div className="font-medium truncate">{booking.customerName}</div>
                                <div className="truncate text-gray-600">{booking.pickupAddress}</div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                      
                      <div key={`unassigned-${time}`} className="h-16 border-b p-1 bg-gray-50">
                        {getBookingsForTimeBlock(null, time).map((booking) => (
                          <div 
                            key={booking.id}
                            className="p-1 text-xs bg-red-50 border-l-2 border-red-500 rounded mb-1 shadow-sm"
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-medium">{booking.time} Uhr</span>
                              {booking.transportType === "wheelchair" && (
                                <span className="bg-amber-100 text-amber-800 px-1 rounded flex items-center">
                                  <span className="mr-1">♿</span>
                                </span>
                              )}
                            </div>
                            <div className="font-medium truncate">{booking.customerName}</div>
                            <div className="truncate text-gray-600">{booking.pickupAddress}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
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
