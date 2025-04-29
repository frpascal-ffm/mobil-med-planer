
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockUsers } from "@/services/mockData";
import { Users, Check, AlertCircle, Info, UserPlus, Settings, FileEdit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Staff = () => {
  const [activeTab, setActiveTab] = useState<string>("active");
  
  // Filter users by active status
  const activeUsers = mockUsers.filter(user => user.active);
  const inactiveUsers = mockUsers.filter(user => !user.active);
  
  // Get the displayed users based on the active tab
  const displayedUsers = activeTab === "active" ? activeUsers : inactiveUsers;
  
  // Get badge for user role
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-medical-700">Administrator</Badge>;
      case "dispatcher":
        return <Badge className="bg-medical-500">Disponent</Badge>;
      case "driver":
        return <Badge variant="secondary">Fahrer</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Mitarbeiterverwaltung</h2>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Mitarbeiter und deren Zugriffsrechte
          </p>
        </div>
        
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Neuer Mitarbeiter
        </Button>
      </div>
      
      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Aktive Mitarbeiter ({activeUsers.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inaktive Mitarbeiter ({inactiveUsers.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {displayedUsers.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead>E-Mail</TableHead>
                    <TableHead className="w-[120px]">Rolle</TableHead>
                    <TableHead className="w-[250px]">Berechtigungen</TableHead>
                    <TableHead className="w-[100px] text-center">Status</TableHead>
                    <TableHead className="text-right">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        <div className="text-xs">
                          {user.role === "admin" && (
                            <span>Vollzugriff auf alle Funktionen</span>
                          )}
                          {user.role === "dispatcher" && (
                            <span>Termine buchen und zuweisen, Fahrzeuge verwalten</span>
                          )}
                          {user.role === "driver" && (
                            <span>Nur Lesezugriff, eigene Fahrten einsehen</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={user.active ? "default" : "secondary"}>
                          {user.active ? (
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
                            <FileEdit className="h-3 w-3 mr-1" />
                            Bearbeiten
                          </Button>
                          <Button 
                            variant={user.active ? "destructive" : "default"} 
                            size="sm"
                          >
                            {user.active ? "Deaktivieren" : "Aktivieren"}
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
                <Users className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="font-medium">Keine Mitarbeiter gefunden</h3>
              <p className="text-sm text-gray-500 mt-1">
                {activeTab === "active" 
                  ? "Es sind keine aktiven Mitarbeiter vorhanden." 
                  : "Es sind keine inaktiven Mitarbeiter vorhanden."}
              </p>
              
              <Button className="mt-4">
                Mitarbeiter hinzufügen
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start">
        <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-blue-800">Benutzerrollen</h3>
          <p className="text-sm text-blue-700 mt-1">
            <strong>Administrator:</strong> Vollzugriff auf alle Funktionen des Systems.<br />
            <strong>Disponent:</strong> Kann Termine zuweisen und Fahrzeuge verwalten.<br />
            <strong>Fahrer:</strong> Sieht nur zugewiesene Fahrten (nur Lesezugriff).
          </p>
        </div>
      </div>
    </div>
  );
};

export default Staff;
