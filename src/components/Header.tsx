
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Ambulance } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Ambulance className="h-6 w-6 text-medical-600" />
          <span className="font-bold text-xl text-medical-800">MobilMedPlaner</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-medical-600 transition-colors">
            Home
          </Link>
          <Link to="/booking" className="text-gray-700 hover:text-medical-600 transition-colors">
            Termin buchen
          </Link>
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
        </nav>
        
        <Button variant="outline" size="icon" className="md:hidden">
          <span className="sr-only">Menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </Button>
      </div>
    </header>
  );
};

export default Header;
