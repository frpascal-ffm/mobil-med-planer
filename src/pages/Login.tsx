
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Ambulance, LockKeyhole } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real app, this would authenticate with a backend service
    // For demo purposes, we'll use hardcoded credentials
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === "admin@medtransport.com" && password === "password") {
        toast.success("Erfolgreich angemeldet");
        navigate("/admin");
      } else if (email === "dispatcher@medtransport.com" && password === "password") {
        toast.success("Erfolgreich angemeldet");
        navigate("/admin");
      } else {
        toast.error("Ungültige Anmeldedaten");
      }
    } catch (error) {
      toast.error("Ein Fehler ist aufgetreten");
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
                  {isLoading ? "Wird angemeldet..." : "Anmelden"}
                </Button>
              </div>
            </form>
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
