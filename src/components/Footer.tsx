
import { Link } from "react-router-dom";
import { Ambulance } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Ambulance className="h-5 w-5 text-medical-600" />
              <span className="font-bold text-lg text-medical-800">MobilMedPlaner</span>
            </Link>
            <p className="text-sm text-gray-600">
              Professionelle Krankentransporte für Ihre Bedürfnisse. Zuverlässig, pünktlich und fürsorglich.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Schnellzugriff</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-medical-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-gray-600 hover:text-medical-600 transition-colors">
                  Termin buchen
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-medical-600 transition-colors">
                  Mitarbeiterlogin
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Kontakt</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Musterstraße 123</li>
              <li>10115 Berlin</li>
              <li>Tel: 030 123456789</li>
              <li>E-Mail: info@mobilmedplaner.de</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Rechtliches</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-medical-600 transition-colors">
                  Datenschutz
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-medical-600 transition-colors">
                  Impressum
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-medical-600 transition-colors">
                  AGB
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} MobilMedPlaner. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
