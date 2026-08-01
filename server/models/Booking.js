import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    partySize: { type: Number, required: true, min: 1 },
    seatingPreference: { type: String },
    occasion: { type: String },
    specialRequests: { type: String },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
