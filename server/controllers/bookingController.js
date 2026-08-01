import Booking from '../models/Booking.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import restaurantConfig from '../config/restaurantConfig.js';
import { sendBookingConfirmation, sendBookingCancellation } from '../services/emailService.js';

// Get available time slots for a given date
export const getAvailableSlots = asyncHandler(async (req, res) => {
  const { date } = req.params;

  if (!date) {
    throw new ApiError(400, 'Date parameter is required');
  }

  // Get all non-cancelled bookings for the requested date
  const existingBookings = await Booking.find({
    date,
    status: { $nin: ['Cancelled'] }
  });

  // Calculate covers already booked per slot
  const bookedCoversPerSlot = {};
  existingBookings.forEach(booking => {
    const slot = booking.time;
    bookedCoversPerSlot[slot] = (bookedCoversPerSlot[slot] || 0) + booking.partySize;
  });

  // Generate availability for all slots
  const allSlots = restaurantConfig.getTimeSlots();
  const maxCovers = restaurantConfig.maxCoversPerSlot;

  const availability = allSlots.map(slot => {
    const booked = bookedCoversPerSlot[slot] || 0;
    const remaining = Math.max(0, maxCovers - booked);
    return {
      time: slot,
      booked,
      remaining,
      available: remaining > 0,
    };
  });

  res.status(200).json({
    date,
    maxCoversPerSlot: maxCovers,
    totalCapacity: restaurantConfig.getTotalCapacity(),
    slots: availability,
  });
});

export const createBooking = asyncHandler(async (req, res) => {
  const { date, time, partySize } = req.body;

  // Check slot availability before creating
  const existingBookings = await Booking.find({
    date,
    time,
    status: { $nin: ['Cancelled'] }
  });

  const currentCovers = existingBookings.reduce((sum, b) => sum + b.partySize, 0);
  const remaining = restaurantConfig.maxCoversPerSlot - currentCovers;

  if (partySize > remaining) {
    throw new ApiError(400, remaining <= 0
      ? `Sorry, the ${time} slot on ${date} is fully booked. Please select a different time.`
      : `Only ${remaining} seats remaining for ${time} on ${date}. Please reduce party size or choose another slot.`
    );
  }

  const booking = await Booking.create(req.body);

  // Emit real-time event if socket.io is available
  const io = req.app.get('io');
  if (io) {
    io.emit('booking:new', booking);
  }

  res.status(201).json(booking);
});

export const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({}).sort({ createdAt: -1 });
  res.status(200).json(bookings);
});

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }
  res.status(200).json(booking);
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const oldBooking = await Booking.findById(req.params.id);
  if (!oldBooking) {
    throw new ApiError(404, 'Booking not found');
  }

  const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });

  // Emit real-time event
  const io = req.app.get('io');
  if (io) {
    io.emit('booking:statusUpdate', booking);
  }

  // Send email notifications asynchronously (don't await so we don't block response)
  if (status === 'Confirmed' && oldBooking.status !== 'Confirmed') {
    sendBookingConfirmation(booking).catch(err => console.error('Failed to send confirmation email', err));
    
    // Award loyalty points
    if (booking.user) {
      const user = await User.findById(booking.user);
      if (user) {
        user.loyaltyPoints += 100;
        await user.save();
      }
    }
  } else if (status === 'Cancelled' && oldBooking.status !== 'Cancelled') {
    sendBookingCancellation(booking).catch(err => console.error('Failed to send cancellation email', err));
  }

  res.status(200).json(booking);
});
