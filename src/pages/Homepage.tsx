
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Ambulance, Calendar, PhoneCall, Clock } from "lucide-react";

const Homepage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-medical-800 to-medical-600 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold mb-6">
                  Ihr zuverlässiger Partner für Krankentransporte
                </h1>
                <p className="text-lg md:text-xl mb-8">
                  Buchen Sie Ihren Transporttermin online und unkompliziert. Wir kümmern uns um einen sicheren und komfortablen Transport.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/booking">
                    <Button className="bg-white text-medical-700 hover:bg-gray-100">
                      Termin buchen
                    </Button>
                  </Link>
                  <a href="tel:+4930123456789">
                    <Button variant="outline" className="border-white hover:bg-white/10">
                      <PhoneCall className="mr-2 h-4 w-4" />
                      030 123456789
                    </Button>
                  </a>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 rounded-lg p-8">
                  <Ambulance className="h-40 w-40 mx-auto text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Unsere Leistungen</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
                <div className="bg-medical-100 p-4 rounded-full mb-4">
                  <Ambulance className="h-8 w-8 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Professioneller Transport</h3>
                <p className="text-gray-600">
                  Mit unserem qualifizierten Personal und modernen Fahrzeugen bieten wir professionelle Krankentransporte für alle Pflegegrade.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
                <div className="bg-medical-100 p-4 rounded-full mb-4">
                  <Calendar className="h-8 w-8 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Einfache Buchung</h3>
                <p className="text-gray-600">
                  Mit unserem Online-Buchungssystem können Sie jederzeit und überall Ihren Termin vereinbaren – schnell und unkompliziert.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
                <div className="bg-medical-100 p-4 rounded-full mb-4">
                  <Clock className="h-8 w-8 text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Pünktlichkeit</h3>
                <p className="text-gray-600">
                  Wir legen großen Wert auf Pünktlichkeit. Unsere Fahrer sorgen dafür, dass Sie rechtzeitig an Ihrem Ziel ankommen.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link to="/booking">
                <Button>
                  Jetzt Termin buchen
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-medical-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Bereit für Ihren Transporttermin?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Buchen Sie noch heute Ihren Krankentransport und verlassen Sie sich auf unsere professionelle Betreuung.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/booking">
                <Button className="bg-white text-medical-700 hover:bg-gray-100">
                  Online buchen
                </Button>
              </Link>
              <a href="tel:+4930123456789">
                <Button variant="outline" className="border-white hover:bg-white/10">
                  <PhoneCall className="mr-2 h-4 w-4" />
                  Telefonisch buchen
                </Button>
              </a>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Homepage;
