
import { useState, useEffect } from "react";
import { format, addMonths, subMonths, addHours, isBefore, isAfter, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { generateAvailableDays, generateTimeSlots } from "@/services/mockData";
import { AvailableDay, TimeSlot } from "@/types";
import { WheelchairIcon } from "@/components/Icons";

const BookingCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDays, setAvailableDays] = useState<AvailableDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  
  // Form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [transportType, setTransportType] = useState<string>("sitting");
  const [careLevel, setCareLevel] = useState<string>("1");
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [roundTrip, setRoundTrip] = useState(false);
  
  // Load available days for the current month
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const days = generateAvailableDays(year, month);
    setAvailableDays(days);
  }, [currentMonth]);
  
  // Go to previous month
  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };
  
  // Go to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };
  
  // Check if a date is within the 24-hour window
  const isWithin24Hours = (dateStr: string) => {
    const now = new Date();
    const nextDay = addHours(now, 24);
    const checkDate = parseISO(dateStr);
    return !isBefore(checkDate, now) && !isAfter(checkDate, nextDay);
  };
  
  // Handle date selection
  const handleDateSelect = (day: AvailableDay) => {
    if (day.available) {
      setSelectedDate(day.date);
      
      // Generate time slots and apply 24-hour rule
      const slots = generateTimeSlots();
      const filteredSlots = slots.map(slot => {
        const [hours, minutes] = slot.time.split(':');
        const slotDate = new Date(day.date);
        slotDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        return {
          ...slot,
          available: slot.available && isWithin24Hours(slotDate.toISOString())
        };
      });
      
      setTimeSlots(filteredSlots);
      setSelectedTime(null);
    }
  };
  
  // Handle time selection
  const handleTimeSelect = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedTime(slot.time);
      setBookingDialogOpen(true);
    }
  };
  
  // Handle booking form submission
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send data to the backend
    toast.success("Ihr Termin wurde erfolgreich gebucht!");
    
    // Reset form and selections
    setName("");
    setPhone("");
    setEmail("");
    setTransportType("sitting");
    setCareLevel("1");
    setPickupAddress("");
    setDestinationAddress("");
    setRoundTrip(false);
    
    setBookingDialogOpen(false);
    setSelectedDate(null);
    setSelectedTime(null);
  };
  
  // Generate calendar days
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first day of the month
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // Get number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Create day elements
    const days = [];
    
    // Add leading empty cells for days before the first of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day opacity-0"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const dayData = availableDays.find(d => d.date === dateString);
      
      const isAvailable = dayData?.available || false;
      const isUnavailable = dayData?.unavailable || false;
      const isSelected = dateString === selectedDate;
      const isPast = date < new Date();
      
      let className = "calendar-day";
      
      if (isPast) {
        className += " disabled";
      } else if (isSelected) {
        className += " selected";
      } else if (isUnavailable) {
        className += " unavailable";
      } else if (isAvailable) {
        className += " available";
      } else {
        className += " disabled";
      }
      
      days.push(
        <div
          key={day}
          className={className}
          onClick={() => !isPast && isAvailable && handleDateSelect({
            date: dateString,
            available: true
          })}
        >
          <span>{day}</span>
          {isUnavailable && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-gray-500"></span>}
          {dayData?.available && isAvailable && <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-emerald-500"></span>}
        </div>
      );
    }
    
    return days;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Termin buchen</h1>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-medical-600" />
                <span className="text-medical-600 font-medium">Wählen Sie einen Termin</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Calendar */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={previousMonth}
                    className="p-2 rounded-md hover:bg-gray-100"
                    aria-label="Vorheriger Monat"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  <div className="text-lg font-medium">
                    {format(currentMonth, 'MMMM yyyy', { locale: de })}
                  </div>
                  
                  <button 
                    onClick={nextMonth}
                    className="p-2 rounded-md hover:bg-gray-100"
                    aria-label="Nächster Monat"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
                    <div key={day} className="text-center font-medium text-sm">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendar()}
                </div>
                
                <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                    <span>Verfügbar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-gray-500"></span>
                    <span>Nicht verfügbar</span>
                  </div>
                </div>
              </div>
              
              {/* Time slots */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  {selectedDate ? `Uhrzeiten für ${format(new Date(selectedDate), 'dd.MM.yyyy')}` : 'Bitte wählen Sie einen Tag'}
                </h3>
                
                {selectedDate ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {timeSlots.map((slot, index) => (
                      <div
                        key={index}
                        className={`time-slot ${slot.available ? 'available' : 'disabled'} ${selectedTime === slot.time ? 'selected' : ''}`}
                        onClick={() => slot.available && handleTimeSelect(slot)}
                      >
                        {slot.time}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>Bitte wählen Sie zuerst einen Tag im Kalender aus</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-medical-50 rounded-lg p-6 border border-medical-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <WheelchairIcon className="h-5 w-5 text-medical-600" />
              <span>Hinweise zur Buchung</span>
            </h2>
            
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Bitte wählen Sie einen Tag und eine Uhrzeit für Ihren Transport.</li>
              <li>Tage mit einem grünen Punkt sind verfügbar für Buchungen.</li>
              <li>Tage mit einem grauen Punkt sind nicht verfügbar.</li>
              <li>Sie können Termine nur bis zu 24 Stunden im Voraus buchen.</li>
              <li>Sie können einen Transport mit verschiedenen Beförderungsarten buchen: Sitzend, Rollstuhl oder Tragestuhl.</li>
              <li>Bei Fragen oder für kurzfristige Buchungen rufen Sie uns bitte direkt an: 030 123456789.</li>
            </ul>
          </div>
        </div>
      </main>
      
      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transport buchen</DialogTitle>
            <DialogDescription>
              {selectedDate && selectedTime && 
                `Termin am ${format(new Date(selectedDate), 'dd.MM.yyyy')} um ${selectedTime} Uhr`
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Name*</Label>
                <Input 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Telefonnummer*</Label>
                <Input 
                  id="phone" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="email">E-Mail (optional)</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="transportType">Beförderungsart*</Label>
                <Select value={transportType} onValueChange={setTransportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Beförderungsart" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sitting">Sitzend</SelectItem>
                    <SelectItem value="wheelchair">Rollstuhl</SelectItem>
                    <SelectItem value="carryingChair">Tragestuhl</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="careLevel">Pflegegrad*</Label>
                <Select value={careLevel} onValueChange={setCareLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pflegegrad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="pickupAddress">Abholadresse*</Label>
                <Input 
                  id="pickupAddress" 
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Straße, Hausnummer, PLZ, Ort"
                  required 
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="destinationAddress">Zieladresse*</Label>
                <Input 
                  id="destinationAddress" 
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  placeholder="Straße, Hausnummer, PLZ, Ort"
                  required 
                />
              </div>
              
              <div className="col-span-2 flex items-center space-x-2">
                <Checkbox 
                  id="roundTrip" 
                  checked={roundTrip}
                  onCheckedChange={(checked: boolean) => setRoundTrip(checked)}
                />
                <Label htmlFor="roundTrip" className="text-sm">Hin- und Rückfahrt buchen</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setBookingDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button type="submit">Termin buchen</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default BookingCalendar;
