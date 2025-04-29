
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockUsers } from "@/services/mockData";
import { Users, Check, AlertCircle, Info, UserPlus } from "lucide-react";

const Staff = () => {
  const [activeTab, setActiveTab] = useState<string>("active");
  
  // Filter users by active status
  const activeUsers = mockUsers.filter(user => user.active);
  const inactiveUsers = mockUsers.filter(user => !user.active);
  
  // Get the displayed users based on the active tab
  const displayedUsers = activeTab === "active" ? activeUsers : inactiveUsers;
  
  // Get badge variant based on user role
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedUsers.map((user) => (
              <Card key={user.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{user.name}</CardTitle>
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
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">E-Mail</span>
                        <span className="text-sm font-medium">{user.email}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Rolle</span>
                        <div>{getRoleBadge(user.role)}</div>
                      </div>
                    </div>
                    
                    <div className="rounded-md bg-gray-50 p-3">
                      <h4 className="text-sm font-medium mb-2">Zugriffsrechte</h4>
                      <ul className="space-y-1 text-sm">
                        {user.role === "admin" && (
                          <>
                            <li className="flex items-center">
                              <Check className="h-3 w-3 text-green-600 mr-2" />
                              Vollzugriff auf alle Funktionen
                            </li>
                            <li className="flex items-center">
                              <Check className="h-3 w-3 text-green-600 mr-2" />
                              Mitarbeiter- und Fahrzeugverwaltung
                            </li>
                            <li className="flex items-center">
                              <Check className="h-3 w-3 text-green-600 mr-2" />
                              Einstellungen bearbeiten
                            </li>
                          </>
                        )}
                        
                        {user.role === "dispatcher" && (
                          <>
                            <li className="flex items-center">
                              <Check className="h-3 w-3 text-green-600 mr-2" />
                              Termine buchen und zuweisen
                            </li>
                            <li className="flex items-center">
                              <Check className="h-3 w-3 text-green-600 mr-2" />
                              Fahrzeuge verwalten
                            </li>
                            <li className="flex items-center">
                              <AlertCircle className="h-3 w-3 text-gray-400 mr-2" />
                              Keine Mitarbeiterverwaltung
                            </li>
                          </>
                        )}
                        
                        {user.role === "driver" && (
                          <>
                            <li className="flex items-center">
                              <Check className="h-3 w-3 text-green-600 mr-2" />
                              Eigene Fahrten einsehen
                            </li>
                            <li className="flex items-center">
                              <AlertCircle className="h-3 w-3 text-gray-400 mr-2" />
                              Nur Lesezugriff
                            </li>
                            <li className="flex items-center">
                              <AlertCircle className="h-3 w-3 text-gray-400 mr-2" />
                              Keine Bearbeitungsfunktionen
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0 flex justify-between">
                  <Button variant="outline" size="sm">
                    Bearbeiten
                  </Button>
                  <Button 
                    variant={user.active ? "destructive" : "default"} 
                    size="sm"
                  >
                    {user.active ? "Deaktivieren" : "Aktivieren"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {displayedUsers.length === 0 && (
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
