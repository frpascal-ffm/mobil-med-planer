
import { Booking, Vehicle, User, TimeSlot, AvailableDay } from "@/types";

// Generate time slots from 8:00 to 18:00 in 30-minute intervals
export const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 8; hour <= 18; hour++) {
    for (let minute of [0, 30]) {
      if (hour === 18 && minute === 30) continue; // Skip 18:30
      
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push({
        time,
        available: Math.random() > 0.3, // 70% chance of being available
      });
    }
  }
  return slots;
};

// Generate available days for the current month
export const generateAvailableDays = (year: number, month: number): AvailableDay[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: AvailableDay[] = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    
    // Skip days in the past
    if (date < new Date()) continue;
    
    days.push({
      date: date.toISOString().split('T')[0],
      unavailable: Math.random() < 0.2, // 20% chance of being unavailable
      available: Math.random() > 0.2, // 80% chance of being available
    });
  }
  
  return days;
};

// Mock bookings
export const mockBookings: Booking[] = [
  {
    id: '1',
    date: '2025-04-29',
    time: '09:00',
    customerName: 'Maria Schmidt',
    phoneNumber: '0151-12345678',
    email: 'maria@example.com',
    transportType: 'wheelchair',
    careLevel: '3',
    pickupAddress: 'Berliner Straße 45, Berlin',
    destinationAddress: 'Klinikum Mitte, Charitestraße 1, Berlin',
    roundTrip: true,
    vehicleId: '1',
    status: 'assigned',
  },
  {
    id: '2',
    date: '2025-04-29',
    time: '10:30',
    customerName: 'Hans Meyer',
    phoneNumber: '0170-87654321',
    transportType: 'sitting',
    careLevel: '2',
    pickupAddress: 'Münchener Allee 78, Berlin',
    destinationAddress: 'Praxis Dr. Weber, Friedrichstraße 123, Berlin',
    roundTrip: false,
    status: 'pending',
  },
  {
    id: '3',
    date: '2025-04-30',
    time: '14:00',
    customerName: 'Elise Fischer',
    phoneNumber: '0176-55443322',
    email: 'elise@example.com',
    transportType: 'carryingChair',
    careLevel: '4',
    pickupAddress: 'Hamburger Weg 12, Berlin',
    destinationAddress: 'Krankenhaus Nord, Nordstraße 55, Berlin',
    roundTrip: true,
    vehicleId: '2',
    status: 'assigned',
  },
];

// Mock vehicles
export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    licensePlate: 'B-KT 1234',
    type: 'KTW',
    seats: 3,
    wheelchairSpaces: 1,
    status: 'active',
    maintenanceDate: '2025-06-15',
    inspectionDate: '2025-08-20',
  },
  {
    id: '2',
    licensePlate: 'B-RT 5678',
    type: 'RTW',
    seats: 4,
    wheelchairSpaces: 1,
    status: 'active',
    maintenanceDate: '2025-07-10',
    inspectionDate: '2025-09-05',
  },
  {
    id: '3',
    licensePlate: 'B-TX 9012',
    type: 'Taxi',
    seats: 4,
    wheelchairSpaces: 0,
    status: 'active',
    maintenanceDate: '2025-05-25',
    inspectionDate: '2025-11-15',
  },
  {
    id: '4',
    licensePlate: 'B-KT 3456',
    type: 'KTW',
    seats: 3,
    wheelchairSpaces: 1,
    status: 'inactive',
    maintenanceDate: '2025-04-30',
    inspectionDate: '2025-10-10',
  },
];

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@medtransport.com',
    role: 'admin',
    active: true,
  },
  {
    id: '2',
    name: 'Dispatcher User',
    email: 'dispatcher@medtransport.com',
    role: 'dispatcher',
    active: true,
  },
  {
    id: '3',
    name: 'Driver 1',
    email: 'driver1@medtransport.com',
    role: 'driver',
    active: true,
  },
  {
    id: '4',
    name: 'Driver 2',
    email: 'driver2@medtransport.com',
    role: 'driver',
    active: false,
  },
];
