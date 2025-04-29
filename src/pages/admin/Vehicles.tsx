
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockVehicles } from "@/services/mockData";
import { Truck, AlertCircle, Check, Info } from "lucide-react";
import { format, isPast, parseISO, addDays } from "date-fns";
import { de } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Vehicles = () => {
  const [activeTab, setActiveTab] = useState<string>("active");
  
  // Filter vehicles by status
  const activeVehicles = mockVehicles.filter(vehicle => vehicle.status === "active");
  const inactiveVehicles = mockVehicles.filter(vehicle => vehicle.status === "inactive");
  
  // Get the displayed vehicles based on the active tab
  const displayedVehicles = activeTab === "active" ? activeVehicles : inactiveVehicles;
  
  // Check if maintenance/inspection is due soon
  const isDueSoon = (dateStr?: string) => {
    if (!dateStr) return false;
    const date = parseISO(dateStr);
    const today = new Date();
    const inThirtyDays = addDays(today, 30);
    return date <= inThirtyDays && date >= today;
  };
  
  // Check if maintenance/inspection is overdue
  const isOverdue = (dateStr?: string) => {
    if (!dateStr) return false;
    const date = parseISO(dateStr);
    return isPast(date);
  };
  
  // Get status badge color
  const getDateStatusColor = (dateStr?: string) => {
    if (isOverdue(dateStr)) return "bg-red-50 text-red-800";
    if (isDueSoon(dateStr)) return "bg-amber-50 text-amber-800";
    return "bg-gray-50";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Fahrzeugverwaltung</h2>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Fahrzeugflotte
          </p>
        </div>
        
        <Button>
          <Truck className="mr-2 h-4 w-4" />
          Neues Fahrzeug
        </Button>
      </div>
      
      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Aktive Fahrzeuge ({activeVehicles.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inaktive Fahrzeuge ({inactiveVehicles.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {displayedVehicles.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Kennzeichen</TableHead>
                    <TableHead>Fahrzeugtyp</TableHead>
                    <TableHead className="text-center">Sitze</TableHead>
                    <TableHead className="text-center">Rollstuhlplätze</TableHead>
                    <TableHead className="text-center">TÜV</TableHead>
                    <TableHead className="text-center">Wartung</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                      <TableCell>{vehicle.type}</TableCell>
                      <TableCell className="text-center">{vehicle.seats}</TableCell>
                      <TableCell className="text-center">{vehicle.wheelchairSpaces}</TableCell>
                      <TableCell className={`text-center ${getDateStatusColor(vehicle.inspectionDate)}`}>
                        {vehicle.inspectionDate 
                          ? format(parseISO(vehicle.inspectionDate), 'dd.MM.yyyy') 
                          : "Nicht geplant"}
                      </TableCell>
                      <TableCell className={`text-center ${getDateStatusColor(vehicle.maintenanceDate)}`}>
                        {vehicle.maintenanceDate 
                          ? format(parseISO(vehicle.maintenanceDate), 'dd.MM.yyyy') 
                          : "Nicht geplant"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={vehicle.status === "active" ? "default" : "secondary"}>
                          {vehicle.status === "active" ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              Aktiv
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Inaktiv
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                          <Button 
                            variant={vehicle.status === "active" ? "destructive" : "default"} 
                            size="sm"
                          >
                            {vehicle.status === "active" ? "Deaktivieren" : "Aktivieren"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border">
              <div className="bg-gray-100 p-4 rounded-full inline-block mx-auto mb-4">
                <Truck className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="font-medium">Keine Fahrzeuge gefunden</h3>
              <p className="text-sm text-gray-500 mt-1">
                {activeTab === "active" 
                  ? "Es sind keine aktiven Fahrzeuge vorhanden." 
                  : "Es sind keine inaktiven Fahrzeuge vorhanden."}
              </p>
              
              <Button className="mt-4">
                Fahrzeug hinzufügen
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start">
        <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-blue-800">Fahrzeugstatus</h3>
          <p className="text-sm text-blue-700 mt-1">
            Aktive Fahrzeuge stehen für Transporte zur Verfügung. Inaktive Fahrzeuge werden bei der Planung nicht berücksichtigt (z.B. wegen Werkstattaufenthalt oder TÜV).
          </p>
        </div>
      </div>
    </div>
  );
};

export default Vehicles;
