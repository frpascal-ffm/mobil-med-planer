
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import GoogleCalendarSettings from "@/components/GoogleCalendarSettings";

const Settings = () => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Einstellungen</h2>
        <p className="text-muted-foreground">
          Verwalten Sie die Systemeinstellungen und Integrationen
        </p>
      </div>
      
      <Tabs defaultValue="integrations" className="w-full">
        <TabsList>
          <TabsTrigger value="general">Allgemein</TabsTrigger>
          <TabsTrigger value="integrations">Integrationen</TabsTrigger>
          <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
          <TabsTrigger value="users">Benutzerverwaltung</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Allgemeine Einstellungen</h3>
            <p className="text-gray-500">
              Diese Einstellungen werden in einer späteren Version verfügbar sein.
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <div className="space-y-6">
            <GoogleCalendarSettings />
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-2">Weitere Integrationen</h3>
              <p className="text-gray-500">
                Zusätzliche Integrationen werden in einer späteren Version verfügbar sein.
              </p>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Benachrichtigungseinstellungen</h3>
            <p className="text-gray-500">
              Benachrichtigungseinstellungen werden in einer späteren Version verfügbar sein.
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Benutzerverwaltung</h3>
            <p className="text-gray-500">
              Benutzerverwaltung wird in einer späteren Version verfügbar sein.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
