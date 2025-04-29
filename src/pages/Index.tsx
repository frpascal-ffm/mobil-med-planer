
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the Homepage component which is our actual landing page
    navigate('/');
  }, [navigate]);
  
  // This will only be shown briefly before the redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">MobilMedPlaner</h1>
        <p className="text-xl text-gray-600 mb-6">Wird geladen...</p>
        <Button onClick={() => navigate('/')}>
          Zur Startseite
        </Button>
      </div>
    </div>
  );
};

export default Index;
