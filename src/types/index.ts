
export type TransportType = "sitting" | "wheelchair" | "carryingChair";
export type CareLevel = "1" | "2" | "3" | "4" | "5" | "6";
export type VehicleType = "KTW" | "RTW" | "Taxi";
export type VehicleStatus = "active" | "inactive";
export type UserRole = "admin" | "dispatcher" | "driver";

export interface Booking {
  id: string;
  date: string;
  time: string;
  customerName: string;
  phoneNumber: string;
  email?: string;
  transportType: TransportType;
  careLevel: CareLevel;
  pickupAddress: string;
  destinationAddress: string;
  roundTrip: boolean;
  vehicleId?: string;
  status: "pending" | "assigned" | "completed" | "cancelled";
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  type: VehicleType;
  seats: number;
  wheelchairSpaces: number;
  status: VehicleStatus;
  maintenanceDate?: string;
  inspectionDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AvailableDay {
  date: string;
  urgent: boolean;
  available: boolean;
}
