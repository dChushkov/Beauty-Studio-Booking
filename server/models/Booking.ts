import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  serviceId: {
    type: String,
    required: true,
    enum: ['bridal', 'evening', 'daily']
  },
  date: {
    type: Date,
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
  notes: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Booking = mongoose.model('Booking', bookingSchema);