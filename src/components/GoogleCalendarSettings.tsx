
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CalendarCheck2, Loader2, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Calendar {
  id: string;
  calendar_name: string;
  is_primary: boolean;
  is_selected: boolean;
}

const GoogleCalendarSettings = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string | null>(null);

  // Check if the user has connected their Google account
  useEffect(() => {
    const checkConnection = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_google_accounts')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) throw error;
        setIsConnected(!!data);
        
        if (data) {
          await fetchCalendars();
        }
      } catch (error) {
        console.error("Error checking Google connection:", error);
        toast.error("Fehler beim Prüfen der Google-Verbindung");
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, [user]);

  // Fetch user's Google calendars
  const fetchCalendars = async () => {
    if (!user) return;

    try {
      setIsRefreshing(true);
      const response = await fetch('https://gczkuolrxmwfwhcgllva.supabase.co/functions/v1/google-calendars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch calendars');
      }

      const { calendars } = await response.json();
      setCalendars(calendars);

      // Set the selected calendar
      const selected = calendars.find((cal: Calendar) => cal.is_selected);
      if (selected) {
        setSelectedCalendarId(selected.id);
      }
    } catch (error) {
      console.error('Error fetching calendars:', error);
      toast.error('Fehler beim Abrufen der Kalender');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Connect to Google
  const handleConnect = async () => {
    if (!user) return;

    try {
      const response = await fetch('https://gczkuolrxmwfwhcgllva.supabase.co/functions/v1/google-auth/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to get authorization URL');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error connecting to Google:', error);
      toast.error('Fehler bei der Verbindung mit Google');
    }
  };

  // Select a calendar
  const handleSelectCalendar = async (calendarId: string) => {
    if (!user) return;

    setSelectedCalendarId(calendarId);
    try {
      const response = await fetch('https://gczkuolrxmwfwhcgllva.supabase.co/functions/v1/select-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          calendarId 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to select calendar');
      }

      toast.success('Kalender erfolgreich ausgewählt');
    } catch (error) {
      console.error('Error selecting calendar:', error);
      toast.error('Fehler beim Auswählen des Kalenders');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-medical-600" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-medium">Google Kalender-Integration</h3>
            <p className="text-sm text-gray-500">
              Verbinden Sie Ihren Google-Kalender, um Fahrten automatisch zu synchronisieren
            </p>
          </div>
          {isConnected ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchCalendars}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Aktualisieren
            </Button>
          ) : null}
        </div>

        {!isConnected ? (
          <div className="flex flex-col items-center p-4 space-y-4">
            <CalendarCheck2 className="h-16 w-16 text-gray-300" />
            <p className="text-center text-gray-500">
              Verbinden Sie Ihren Google-Kalender, um Fahrten automatisch zu synchronisieren.
            </p>
            <Button onClick={handleConnect}>
              Mit Google verbinden
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="font-medium mb-2">Google-Konto verbunden</h4>
              <p className="text-sm text-gray-600 mb-2">
                Wählen Sie einen Kalender aus, in dem Ihre Fahrten gespeichert werden sollen:
              </p>
              
              {calendars.length > 0 ? (
                <RadioGroup 
                  value={selectedCalendarId || ''} 
                  onValueChange={handleSelectCalendar}
                  className="space-y-2"
                >
                  {calendars.map((calendar) => (
                    <div key={calendar.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={calendar.id} id={`calendar-${calendar.id}`} />
                      <Label htmlFor={`calendar-${calendar.id}`} className="cursor-pointer">
                        {calendar.calendar_name}
                        {calendar.is_primary && (
                          <span className="text-xs text-gray-500 ml-1">(Primär)</span>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <p className="text-sm text-gray-600">
                  Keine Kalender gefunden. Bitte aktualisieren Sie die Liste.
                </p>
              )}
            </div>
            
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                <strong>Hinweis:</strong> Alle neuen Fahrten werden automatisch mit dem ausgewählten Kalender synchronisiert.
              </p>
              <p>
                Wenn Sie später einen anderen Kalender auswählen, werden neue und aktualisierte Fahrten im neuen Kalender gespeichert.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default GoogleCalendarSettings;
