
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Ambulance, LockKeyhole, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      toast.success("Erfolgreich angemeldet");
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error.message === "Invalid login credentials") {
        toast.error("Ungültige Anmeldedaten");
      } else {
        toast.error("Ein Fehler ist aufgetreten");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`,
          scopes: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Google login error:", error);
      toast.error("Fehler bei der Anmeldung mit Google");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="bg-medical-100 p-3 rounded-full">
                <Ambulance className="h-8 w-8 text-medical-600" />
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Mitarbeiterlogin</h2>
            <p className="mt-2 text-sm text-gray-600">
              Melden Sie sich mit Ihren Zugangsdaten an
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Passwort</Label>
                  <a href="#" className="text-sm text-medical-600 hover:text-medical-700">
                    Passwort vergessen?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wird angemeldet...
                    </>
                  ) : (
                    "Anmelden"
                  )}
                </Button>
              </div>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Oder anmelden mit
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.787-1.676-4.188-2.701-6.735-2.701-5.518 0-9.99 4.473-9.99 9.99s4.473 9.99 9.99 9.99c8.485 0 10.527-7.899 9.75-11.648h-9.75z"
                    />
                  </svg>
                  Mit Google anmelden
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex justify-center mb-2">
              <LockKeyhole className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="text-sm font-medium text-blue-800">Demo-Zugangsdaten</h3>
            <p className="text-xs text-blue-600 mt-1">
              Admin: admin@medtransport.com / password<br />
              Disponent: dispatcher@medtransport.com / password
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
