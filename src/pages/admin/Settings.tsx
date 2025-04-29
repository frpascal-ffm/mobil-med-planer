
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { MapPin, Key, Shield, Bell } from "lucide-react";

const Settings = () => {
  const handleSaveGeneral = () => {
    toast.success("Allgemeine Einstellungen gespeichert");
  };
  
  const handleSaveAPI = () => {
    toast.success("API-Einstellungen gespeichert");
  };
  
  const handleSaveSecurity = () => {
    toast.success("Sicherheitseinstellungen gespeichert");
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Einstellungen</h2>
        <p className="text-muted-foreground">
          Verwalten Sie die Systemeinstellungen und Konfigurationen
        </p>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Allgemein</TabsTrigger>
          <TabsTrigger value="api">API-Integration</TabsTrigger>
          <TabsTrigger value="security">Sicherheit</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Unternehmensdetails</CardTitle>
              <CardDescription>
                Diese Informationen werden in der Anwendung und in Benachrichtigungen verwendet.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Unternehmensname</Label>
                  <Input id="companyName" defaultValue="MobilMedPlaner GmbH" />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Kontakt-E-Mail</Label>
                  <Input id="contactEmail" type="email" defaultValue="info@mobilmedplaner.de" />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Kontakttelefon</Label>
                  <Input id="contactPhone" defaultValue="030 123456789" />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue="https://mobilmedplaner.de" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneral}>Speichern</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Benachrichtigungseinstellungen</CardTitle>
              <CardDescription>
                Legen Sie fest, wie und wann Benachrichtigungen gesendet werden.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">E-Mail-Benachrichtigungen</Label>
                    <p className="text-sm text-muted-foreground">
                      Senden Sie automatische E-Mail-Benachrichtigungen bei Buchungen.
                    </p>
                  </div>
                  <Switch id="emailNotifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="smsNotifications">SMS-Benachrichtigungen</Label>
                    <p className="text-sm text-muted-foreground">
                      Senden Sie SMS-Benachrichtigungen für Terminerinnerungen.
                    </p>
                  </div>
                  <Switch id="smsNotifications" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenanceAlerts">Wartungserinnerungen</Label>
                    <p className="text-sm text-muted-foreground">
                      Benachrichtigungen für anstehende Fahrzeugwartungen und TÜV-Termine.
                    </p>
                  </div>
                  <Switch id="maintenanceAlerts" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneral}>Speichern</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="mr-4 bg-blue-100 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Google Maps API</CardTitle>
                <CardDescription>
                  Konfigurieren Sie die Google Maps API für die Adressautovervollständigung.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="googleMapsApiKey">Google Maps API-Schlüssel</Label>
                <Input 
                  id="googleMapsApiKey" 
                  type="password" 
                  defaultValue="•••••••••••••••••••••••••••••••"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Dieser Schlüssel wird für die Adressautovervollständigung in Buchungsformularen verwendet.
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableAutocomplete">Adressautovervollständigung aktivieren</Label>
                  <p className="text-sm text-muted-foreground">
                    Aktivieren Sie die Autovervollständigung für Adressen im Buchungsformular.
                  </p>
                </div>
                <Switch id="enableAutocomplete" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">API-Schlüssel testen</Button>
              <Button onClick={handleSaveAPI}>Speichern</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="mr-4 bg-amber-100 p-3 rounded-full">
                <Key className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <CardTitle>Anmeldungseinstellungen</CardTitle>
                <CardDescription>
                  Konfigurieren Sie die Sicherheitseinstellungen für Benutzeranmeldungen.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="twoFactorAuth">Zwei-Faktor-Authentifizierung</Label>
                  <p className="text-sm text-muted-foreground">
                    Erfordern Sie die Zwei-Faktor-Authentifizierung für Administratoren.
                  </p>
                </div>
                <Switch id="twoFactorAuth" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoLogout">Automatische Abmeldung</Label>
                  <p className="text-sm text-muted-foreground">
                    Melden Sie Benutzer nach 30 Minuten Inaktivität automatisch ab.
                  </p>
                </div>
                <Switch id="autoLogout" defaultChecked />
              </div>
              
              <div>
                <Label htmlFor="passwordPolicy">Passwortrichtlinie</Label>
                <select 
                  id="passwordPolicy" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="strong"
                >
                  <option value="basic">Grundlegend (nur Mindestlänge)</option>
                  <option value="medium">Mittel (Großbuchstaben + Zahlen)</option>
                  <option value="strong">Stark (Groß-/Kleinbuchstaben + Zahlen + Sonderzeichen)</option>
                </select>
                <p className="text-sm text-muted-foreground mt-1">
                  Definieren Sie die Stärke der erforderlichen Passwörter für Benutzerkonten.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSecurity}>Speichern</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="mr-4 bg-red-100 p-3 rounded-full">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <CardTitle>Datenschutz und Datensicherheit</CardTitle>
                <CardDescription>
                  Verwalten Sie, wie personenbezogene Daten gespeichert werden.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dataEncryption">Datenverschlüsselung</Label>
                  <p className="text-sm text-muted-foreground">
                    Verschlüsseln Sie sensible Kundendaten in der Datenbank.
                  </p>
                </div>
                <Switch id="dataEncryption" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dataRetention">Datenspeicherrichtlinie</Label>
                  <p className="text-sm text-muted-foreground">
                    Löschen Sie automatisch alte Daten nach einem Zeitraum.
                  </p>
                </div>
                <Switch id="dataRetention" />
              </div>
              
              <div>
                <Label htmlFor="retentionPeriod">Aufbewahrungszeitraum</Label>
                <select 
                  id="retentionPeriod" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="1year"
                >
                  <option value="6months">6 Monate</option>
                  <option value="1year">1 Jahr</option>
                  <option value="2years">2 Jahre</option>
                  <option value="3years">3 Jahre</option>
                  <option value="never">Niemals löschen</option>
                </select>
                <p className="text-sm text-muted-foreground mt-1">
                  Wie lange Transportdaten nach Abschluss aufbewahrt werden sollen.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSecurity}>Speichern</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
