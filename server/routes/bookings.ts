import express from 'express';
import { z } from 'zod';
import { Booking } from '../models/Booking.js';

const router = express.Router();

// Schema validation for booking data
const BookingSchema = z.object({
  serviceId: z.enum(['bridal', 'evening', 'daily']),
  date: z.string(), // Keep as string all the way through
  time: z.string(),
  clientName: z.string().min(2),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(6),
  notes: z.string().optional()
});

// Helper function to ensure date format is YYYY-MM-DD
const ensureYMDFormat = (dateStr: string): string => {
  // If it's already in YYYY-MM-DD format, return it
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  // If it's a full ISO string, extract just the date part
  if (dateStr.includes('T')) {
    return dateStr.split('T')[0];
  }
  
  // For any other format, parse and reformat
  try {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error('Invalid date string:', dateStr);
    return dateStr; // Return original if parsing fails
  }
};

// Check availability for a specific date and time
router.get('/availability', async (req, res) => {
  try {
    const { date, time } = req.query;
    
    if (!date || !time) {
      return res.status(400).json({ error: 'Date and time parameters are required' });
    }
    
    // Format date as YYYY-MM-DD
    const formattedDate = ensureYMDFormat(date as string);
    
    console.log(`Checking availability for date: ${formattedDate}, time: ${time}`);
    
    // Find bookings with the same time and date (string comparison)
    const existingBooking = await Booking.findOne({
      date: formattedDate,
      time: time as string,
      status: { $in: ['pending', 'confirmed'] }
    });
    
    // If a booking exists for this slot, it's not available
    const available = !existingBooking;
    
    console.log(`Slot available: ${available}`);
    
    res.json({ available });
  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

// Get bookings in a date range (for calendar view)
router.get('/range', async (req, res) => {
  try {
    const { start, end } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({ error: 'Start and end date parameters are required' });
    }
    
    // Format dates as YYYY-MM-DD
    const startDate = ensureYMDFormat(start as string);
    const endDate = ensureYMDFormat(end as string);
    
    console.log(`Fetching bookings from ${startDate} to ${endDate}`);
    
    // Find bookings in the date range using string comparison
    const bookings = await Booking.find({
      date: { $gte: startDate, $lte: endDate },
      status: { $in: ['pending', 'confirmed'] }
    }).sort({ date: 1, time: 1 });
    
    console.log(`Found ${bookings.length} bookings in range`);
    
    res.json(bookings);
  } catch (error) {
    console.error('Range bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings in date range' });
  }
});

// Create booking
router.post('/', async (req, res) => {
  try {
    console.log('Received booking request:', req.body);
    
    // Validate incoming data
    const validatedData = BookingSchema.parse(req.body);
    
    // Ensure date is in YYYY-MM-DD format
    const formattedDate = ensureYMDFormat(validatedData.date);
    
    // Update the validated data with the formatted date
    const bookingData = {
      ...validatedData,
      date: formattedDate
    };
    
    // Check if the time slot is already booked
    const existingBooking = await Booking.findOne({
      date: formattedDate,
      time: bookingData.time,
      status: { $in: ['pending', 'confirmed'] }
    });
    
    if (existingBooking) {
      console.log('Time slot already booked:', existingBooking);
      return res.status(409).json({ error: 'This time slot is already booked.' });
    }
    
    // Create the booking
    const booking = new Booking(bookingData);
    await booking.save();
    
    console.log('Booking created:', booking);
    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(400).json({ error: 'Invalid booking data' });
  }
});

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

export const bookingRouter = router;