
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockBookings, mockVehicles } from "@/services/mockData";
import { Booking, Vehicle } from "@/types";
import { Calendar, Info, ChevronDown } from "lucide-react";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { WheelchairIcon } from "@/components/Icons";
import { Separator } from "@/components/ui/separator";

const Schedule = () => {
  const [activeDate, setActiveDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Get bookings for the active date
  const dateBookings = mockBookings.filter(booking => booking.date === activeDate);
  const unassignedBookings = dateBookings.filter(booking => !booking.vehicleId);
  
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
  
  // Simulate moving a booking to a vehicle
  const moveBookingToVehicle = (bookingId: string, vehicleId: string) => {
    // In a real app, this would update the database
    console.log(`Moving booking ${bookingId} to vehicle ${vehicleId}`);
  };
  
  // Check if a vehicle can handle a booking
  const canHandleBooking = (booking: Booking, vehicle: Vehicle): boolean => {
    // Check if vehicle has wheelchair spaces if needed
    if (booking.transportType === "wheelchair" && vehicle.wheelchairSpaces === 0) {
      return false;
    }
    
    return true;
  };
  
  // Generate dates for the tabs
  const generateDateTabs = () => {
    const dates = [];
    for (let i = -1; i < 6; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: i === 0 
          ? 'Heute' 
          : i === 1 
            ? 'Morgen' 
            : format(date, 'E, d. MMM', { locale: de }),
      });
    }
    return dates;
  };
  
  const dateTabs = generateDateTabs();
  
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
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Fahrtenplanung</h2>
        <p className="text-muted-foreground">
          Weisen Sie Buchungen den passenden Fahrzeugen zu
        </p>
      </div>
      
      <div>
        <Tabs 
          defaultValue={dateTabs[1].value} 
          value={activeDate}
          onValueChange={setActiveDate}
        >
          <TabsList className="mb-4">
            {dateTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeDate}>
            <div className="bg-white rounded-lg border shadow">
              <div className="grid grid-cols-[auto_1fr]">
                {/* Time blocks column */}
                <div className="min-w-[60px] border-r bg-gray-50">
                  <div className="h-12 border-b flex items-center justify-center font-semibold bg-medical-50 text-medical-900">
                    Zeit
                  </div>
                  {timeBlocks.map((time) => (
                    <div key={time} className="h-20 px-2 border-b flex items-center justify-center text-sm text-gray-500">
                      {time}
                    </div>
                  ))}
                </div>
                
                {/* Schedule grid */}
                <div className="overflow-x-auto">
                  <div className="min-w-full grid" style={{ gridTemplateColumns: `repeat(${vehiclesWithBookings.length + 1}, minmax(220px, 1fr))` }}>
                    {/* Header row with vehicle names */}
                    <div className="grid" style={{ gridTemplateColumns: `repeat(${vehiclesWithBookings.length + 1}, minmax(220px, 1fr))` }}>
                      {vehiclesWithBookings.map((vehicle) => (
                        <div key={vehicle.id} className="h-12 border-b border-r px-3 bg-medical-50 flex items-center justify-between">
                          <div className="font-semibold text-medical-900">
                            {vehicle.licensePlate}
                          </div>
                          <div className="text-xs text-medical-600">
                            {vehicle.type} • Sitze: {vehicle.seats} • RS: {vehicle.wheelchairSpaces}
                          </div>
                        </div>
                      ))}
                      
                      <div className="h-12 border-b px-3 bg-gray-100 flex items-center justify-between">
                        <div className="font-semibold">
                          Ohne Fahrzeug
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 flex items-center">
                          <ChevronDown className="h-4 w-4 mr-1" />
                          Filter
                        </Button>
                      </div>
                    </div>
                    
                    {/* Time blocks grid */}
                    {timeBlocks.map((time) => (
                      <div key={time} className="grid" style={{ gridTemplateColumns: `repeat(${vehiclesWithBookings.length + 1}, minmax(220px, 1fr))` }}>
                        {vehiclesWithBookings.map((vehicle) => {
                          const bookings = getBookingsForTimeBlock(vehicle.id, time);
                          return (
                            <div key={`${vehicle.id}-${time}`} className="h-20 border-b border-r p-1 drop-area can-drop">
                              {bookings.map((booking) => (
                                <div 
                                  key={booking.id} 
                                  className="p-1 text-xs bg-medical-100 border-l-4 border-medical-500 rounded mb-1 shadow-sm"
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
                                  <div className="truncate text-gray-600">{booking.destinationAddress}</div>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                        
                        <div key={`unassigned-${time}`} className="h-20 border-b p-1 bg-gray-50">
                          {getBookingsForTimeBlock(null, time).map((booking) => (
                            <div 
                              key={booking.id}
                              className="p-1 text-xs bg-red-50 border-l-4 border-red-500 rounded mb-1 shadow-sm"
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
                              <div className="truncate text-gray-600">{booking.destinationAddress}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mt-4 text-sm">
              <div className="flex items-center">
                <span className="w-4 h-4 bg-red-50 border-l-4 border-red-500 mr-2"></span>
                <span className="text-gray-700 mr-4">Unzugewiesene Buchung</span>
                
                <span className="w-4 h-4 bg-medical-100 border-l-4 border-medical-500 mr-2"></span>
                <span className="text-gray-700 mr-4">Zugewiesene Buchung</span>
                
                <span className="w-4 h-4 bg-amber-100 mr-2 flex items-center justify-center text-amber-800 text-xs">♿</span>
                <span className="text-gray-700">Rollstuhlfahrt</span>
              </div>
              
              <div>
                <span className="text-gray-500">Raster:</span>
                <select className="ml-2 border rounded p-1 text-sm">
                  <option value="5">5 Min.</option>
                  <option value="10">10 Min.</option>
                  <option value="15">15 Min.</option>
                  <option value="30">30 Min.</option>
                  <option value="60">60 Min.</option>
                </select>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4">
              <span className="font-medium">Hinweis:</span> In dieser Demo-Version ist Drag & Drop noch nicht funktional. 
              In der vollständigen Anwendung können Sie Buchungen per Drag & Drop auf Fahrzeuge ziehen.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Schedule;
