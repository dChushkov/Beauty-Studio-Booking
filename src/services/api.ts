import { z } from 'zod';

// Define booking type using Zod schema
export const BookingSchema = z.object({
  serviceId: z.enum(['bridal', 'evening', 'daily']),
  date: z.string(),
  time: z.string(),
  clientName: z.string().min(2),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(6),
  notes: z.string().optional()
});

// Extended type for bookings from the database that include MongoDB fields
export type BookingType = Omit<z.infer<typeof BookingSchema>, 'date'> & {
  date: string | Date;
  _id?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: string;
};

const API_URL = 'http://localhost:5000/api';

// Format a date as YYYY-MM-DD
export const formatDateYMD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Parse a YYYY-MM-DD string to a Date object (at noon to avoid timezone issues)
export const parseYMDString = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
};

// Helper to check if two dates represent the same day
export const isSameYMDDate = (date1: string | Date, date2: string | Date): boolean => {
  // Convert both to YYYY-MM-DD strings
  const str1 = date1 instanceof Date ? formatDateYMD(date1) : date1;
  const str2 = date2 instanceof Date ? formatDateYMD(date2) : date2;
  // Compare the strings
  return str1 === str2;
};

// Helper to format date for email and display
export const formatDateForEmail = (date: string | Date): string => {
  if (typeof date === 'string') {
    // If ISO string with T, extract date part
    if (date.includes('T')) {
      date = date.split('T')[0];
    }
    // Parse YYYY-MM-DD
    const [year, month, day] = date.split('-').map(Number);
    date = new Date(year, month - 1, day);
  }
  
  // Format date: "April 8, 2025"
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const api = {
  // Get all bookings
  getBookings: async (): Promise<BookingType[]> => {
    try {
      const response = await fetch(`${API_URL}/bookings`);
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const bookings = await response.json();
      return bookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
  },

  // Create a new booking
  createBooking: async (booking: BookingType): Promise<BookingType> => {
    try {
      // Ensure date is in YYYY-MM-DD format
      let dateStr = booking.date;
      if (typeof booking.date !== 'string' && booking.date instanceof Date) {
        dateStr = formatDateYMD(booking.date);
      }
      
      console.log(`Creating booking with date: ${dateStr}`);
      
      const bookingData = {
        ...booking,
        date: dateStr
      };
      
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to create booking');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Check if a time slot is available
  checkAvailability: async (date: Date, time: string): Promise<boolean> => {
    try {
      // Format date as YYYY-MM-DD
      const formattedDate = formatDateYMD(date);
      
      console.log(`Checking availability for: ${formattedDate} at ${time}`);
      
      // Build URL with proper encoding of parameters
      const url = `${API_URL}/bookings/availability?date=${formattedDate}&time=${encodeURIComponent(time)}`;
      console.log('Request URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('Availability check failed:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to check availability');
      }
      
      const data = await response.json();
      console.log('Availability response:', data);
      
      return data.available;
    } catch (error) {
      console.error('Error checking availability:', error);
      // In case of error, return false (assume the slot is not available)
      // to prevent booking conflicts
      return false;
    }
  },

  // Get bookings for a specific date range (for admin calendar)
  getBookingsInRange: async (startDate: Date, endDate: Date): Promise<BookingType[]> => {
    try {
      // Format dates as YYYY-MM-DD
      const start = formatDateYMD(startDate);
      const end = formatDateYMD(endDate);
      
      console.log(`Fetching bookings from ${start} to ${end}`);
      
      // In a real implementation, we would add an auth token here
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/bookings/range?start=${start}&end=${end}`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings in range');
      }
      
      const bookings = await response.json();
      return bookings;
    } catch (error) {
      console.error('Error fetching bookings in range:', error);
      return [];
    }
  },

  // Update booking status (for admin)
  updateBookingStatus: async (id: string, status: 'pending' | 'confirmed' | 'cancelled'): Promise<BookingType> => {
    try {
      // Add authentication token
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/bookings/${id}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },
  
  // Send confirmation email to client
  sendConfirmationEmail: async (booking: BookingType): Promise<boolean> => {
    try {
      console.log('Sending confirmation email to:', booking.clientEmail);

      // In a real app, we would make an API call to a server that sends the email
      // For demo purposes, we'll simulate this with a console log
      const formattedDate = formatDateForEmail(booking.date);
      
      // Example email content
      const emailContent = {
        to: booking.clientEmail,
        subject: 'Your Appointment Confirmation',
        body: `
          <h1>Appointment Confirmed</h1>
          <p>Dear ${booking.clientName},</p>
          <p>Your appointment has been confirmed for <strong>${formattedDate} at ${booking.time}</strong>.</p>
          <p>Service: <strong>${booking.serviceId} Makeup</strong></p>
          <p>If you need to make any changes to your appointment, please contact us.</p>
          <p>Thank you for choosing our services!</p>
          <p>Best regards,<br/>Beauty Style Team</p>
        `
      };
      
      console.log('Email content:', emailContent);
      
      // In a production app, you would make an API call to your backend:
      /*
      const response = await fetch(`${API_URL}/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          booking_id: booking._id,
          email_type: 'confirmation'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send confirmation email');
      }
      
      const result = await response.json();
      return result.success;
      */
      
      // For demo, always return success
      return true;
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      return false;
    }
  },
  
  // Admin authentication - uses hardcoded demo credentials for testing
  login: async (email: string, password: string) => {
    try {
      // Demo admin user - hardcoded for testing
      if (email === 'admin@makeupstudio.com' && password === 'admin123') {
        // Simulate successful login response
        console.log('Demo admin login successful');
        return { 
          success: true, 
          user: {
            id: 'admin123',
            name: 'Admin User',
            email: 'admin@makeupstudio.com',
            role: 'admin'
          },
          token: 'demo-admin-jwt-token'
        };
      }
      
      // If credentials don't match, return error
      console.log('Login failed: Invalid credentials');
      return { 
        success: false, 
        error: 'Invalid credentials'
      };
      
      // Real API call is commented out for demo purposes
      /*
      // Send request to API for authentication
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      // Process the response
      const data = await response.json();
      
      if (!response.ok) {
        return { 
          success: false, 
          error: data.message || 'Authentication failed' 
        };
      }
      
      // Return successful result with user data and token
      return { 
        success: true, 
        user: data.user,
        token: data.token 
      };
      */
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Connection error' 
      };
    }
  },
  
  // Register admin (only for initial setup)
  registerAdmin: async (email: string, password: string, name: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email, 
          password, 
          name,
          role: 'admin' 
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { 
          success: false, 
          error: data.message || 'Registration failed' 
        };
      }
      
      return { 
        success: true, 
        user: data.user
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: 'Connection error' 
      };
    }
  },
  
  // Check token and get current user
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user');
      
      if (!token || !storedUser) {
        return { success: false };
      }
      
      // For demo purposes, trust the stored user data
      try {
        const user = JSON.parse(storedUser);
        return {
          success: true,
          user
        };
      } catch (e) {
        console.error('Error parsing stored user:', e);
        return { success: false };
      }
      
      // Real API call is commented out for demo purposes
      /*
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        return { success: false };
      }
      
      const data = await response.json();
      
      return {
        success: true,
        user: data.user
      };
      */
    } catch (error) {
      console.error('Error fetching current user:', error);
      return { success: false };
    }
  }
};