import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  serviceId: {
    type: String,
    enum: ['bridal', 'evening', 'daily'],
    required: true
  },
  date: {
    type: String, // Change to String to avoid timezone issues
    required: true
  },
  time: {
    type: String,
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  clientEmail: {
    type: String,
    required: true
  },
  clientPhone: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

export const Booking = mongoose.model('Booking', bookingSchema); 