
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockBookings, mockVehicles } from "@/services/mockData";
import { Booking, Vehicle } from "@/types";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

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
          
          <TabsContent value={activeDate} className="space-y-8">
            {/* Unassigned bookings */}
            <Card>
              <CardHeader className="bg-amber-50 border-b">
                <CardTitle className="flex items-center text-amber-900">
                  <Calendar className="h-5 w-5 mr-2 text-amber-600" />
                  Buchungen ohne Fahrzeug
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {unassignedBookings.length > 0 ? (
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {unassignedBookings.map(booking => (
                      <div
                        key={booking.id}
                        className="border rounded-md p-3 bg-white shadow-sm draggable-item"
                        draggable
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium">{booking.time} Uhr</span>
                          {booking.transportType === "wheelchair" && (
                            <span className="bg-amber-100 text-amber-800 p-1 rounded text-xs flex items-center">
                              <span className="mr-1">♿</span>
                              Rollstuhl
                            </span>
                          )}
                          {booking.transportType === "carryingChair" && (
                            <span className="bg-red-100 text-red-800 p-1 rounded text-xs">Tragstuhl</span>
                          )}
                        </div>
                        
                        <h4 className="font-medium truncate">{booking.customerName}</h4>
                        <p className="text-xs text-gray-500 truncate">{booking.pickupAddress}</p>
                        <p className="text-xs text-gray-500 truncate">{booking.destinationAddress}</p>
                        
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                            Pflegegrad {booking.careLevel}
                          </span>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    Keine unzugewiesenen Buchungen für diesen Tag
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Vehicles */}
            <div className="grid gap-6 md:grid-cols-2">
              {vehiclesWithBookings.map((vehicle) => (
                <Card key={vehicle.id}>
                  <CardHeader className="bg-medical-50 border-b">
                    <CardTitle className="flex justify-between">
                      <span>{vehicle.licensePlate} ({vehicle.type})</span>
                      <span className="text-sm font-normal">
                        Sitze: {vehicle.seats} | Rollstuhlplätze: {vehicle.wheelchairSpaces}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="drop-area min-h-32 can-drop">
                      {vehicle.bookings.length > 0 ? (
                        <div className="grid gap-2">
                          {vehicle.bookings.map(booking => (
                            <div
                              key={booking.id}
                              className="border rounded-md p-3 bg-white shadow-sm"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-medium">{booking.time} Uhr</span>
                                {booking.transportType === "wheelchair" && (
                                  <span className="bg-amber-100 text-amber-800 p-1 rounded text-xs flex items-center">
                                    <span className="mr-1">♿</span>
                                    Rollstuhl
                                  </span>
                                )}
                                {booking.transportType === "carryingChair" && (
                                  <span className="bg-red-100 text-red-800 p-1 rounded text-xs">Tragstuhl</span>
                                )}
                              </div>
                              
                              <h4 className="font-medium truncate">{booking.customerName}</h4>
                              <p className="text-xs text-gray-500 truncate">{booking.pickupAddress}</p>
                              <p className="text-xs text-gray-500 truncate">{booking.destinationAddress}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          Fahrzeug nicht zugeteilt. Ziehen Sie Buchungen hierher.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <p className="text-sm text-muted-foreground">
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
