export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export interface Booking {
  id: string;
  serviceId: string;
  date: Date;
  clientName: string;
  clientEmail: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface User {
  id: string;
  email: string;
  role: 'client' | 'admin';
}