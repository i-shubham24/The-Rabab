import Booking from '../models/Booking.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { sendBookingConfirmation, sendBookingCancellation } from '../services/emailService.js';

export const createBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.create(req.body);
  res.status(201).json(booking);
});

export const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({});
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
