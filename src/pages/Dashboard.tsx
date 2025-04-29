
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockBookings, mockVehicles } from "@/services/mockData";
import { Calendar, Clock, Truck, AlertCircle, Check } from "lucide-react";
import { Booking } from "@/types";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { WheelchairIcon } from "@/components/Icons";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("today");
  
  // Filter bookings for today and tomorrow
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  const todayBookings = mockBookings.filter(booking => booking.date === today);
  const tomorrowBookings = mockBookings.filter(booking => booking.date === tomorrow);
  const upcomingBookings = mockBookings.filter(booking => 
    booking.date !== today && booking.date !== tomorrow && new Date(booking.date) > new Date()
  );
  
  // Count statistics
  const totalBookings = mockBookings.length;
  const pendingBookings = mockBookings.filter(booking => booking.status === "pending").length;
  const activeVehicles = mockVehicles.filter(vehicle => vehicle.status === "active").length;
  
  // Get active bookings based on tab
  const getActiveBookings = (): Booking[] => {
    switch (activeTab) {
      case "today": return todayBookings;
      case "tomorrow": return tomorrowBookings;
      case "upcoming": return upcomingBookings;
      default: return todayBookings;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">
            Übersicht aller aktuellen Transporte und Fahrzeuge
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link to="/admin/schedule">
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Zur Fahrtenplanung
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamte Buchungen</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              Alle geplanten Transporte
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offene Buchungen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBookings}</div>
            <p className="text-xs text-muted-foreground">
              Buchungen ohne zugewiesenes Fahrzeug
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Fahrzeuge</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVehicles}</div>
            <p className="text-xs text-muted-foreground">
              Von insgesamt {mockVehicles.length} Fahrzeugen
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-medical-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-medical-900">Heutige Transporte</CardTitle>
            <AlertCircle className="h-4 w-4 text-medical-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-medical-900">{todayBookings.length}</div>
            <p className="text-xs text-medical-700">
              {format(new Date(), "EEEE, d. MMMM yyyy", { locale: de })}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Bookings Tabs */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Transportübersicht</CardTitle>
          <CardDescription>
            Alle anstehenden Transporte im Überblick
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="today">Heute ({todayBookings.length})</TabsTrigger>
              <TabsTrigger value="tomorrow">Morgen ({tomorrowBookings.length})</TabsTrigger>
              <TabsTrigger value="upcoming">Kommende ({upcomingBookings.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {getActiveBookings().length > 0 ? (
                <div className="space-y-4">
                  {getActiveBookings().map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex gap-3">
                        <div className={`p-3 rounded-full ${
                          booking.transportType === "wheelchair" 
                            ? "bg-amber-100 text-amber-600" 
                            : booking.transportType === "carryingChair"
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                        }`}>
                          {booking.transportType === "wheelchair" ? (
                            <WheelchairIcon className="h-5 w-5" />
                          ) : booking.transportType === "carryingChair" ? (
                            <AlertCircle className="h-5 w-5" />
                          ) : (
                            <Check className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{booking.customerName}</h4>
                          <p className="text-sm text-gray-600">{booking.time} Uhr • Pflegegrad {booking.careLevel}</p>
                        </div>
                      </div>
                      
                      <div className="md:text-right text-sm">
                        <p className="font-medium">Von: {booking.pickupAddress}</p>
                        <p className="font-medium">Nach: {booking.destinationAddress}</p>
                        {booking.roundTrip && <span className="text-xs bg-gray-100 px-2 py-1 rounded">+ Rückfahrt</span>}
                      </div>
                      
                      <div className="flex gap-2 md:ml-auto">
                        <Button variant="outline" size="sm">Details</Button>
                        {booking.status === "pending" ? (
                          <Link to="/admin/schedule">
                            <Button size="sm">Zuweisen</Button>
                          </Link>
                        ) : (
                          <Button size="sm" variant="secondary" disabled>Zugewiesen</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gray-100 p-4 rounded-full inline-block mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="font-medium">Keine Transporte gefunden</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {activeTab === "today" 
                      ? "Es sind keine Transporte für heute geplant." 
                      : activeTab === "tomorrow" 
                        ? "Es sind keine Transporte für morgen geplant."
                        : "Es sind keine weiteren Transporte geplant."}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-6 py-3">
          <Link to="/admin/schedule">
            <Button variant="link" className="p-0">
              Zur detaillierten Fahrtenplanung
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Dashboard;
