import asyncHandler from '../utils/asyncHandler.js';
import { getChatResponse } from '../services/aiService.js';
import Booking from '../models/Booking.js';

export const chat = asyncHandler(async (req, res) => {
  const { messages, mode } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ message: 'Messages array is required' });
  }

  const { reply, action } = await getChatResponse(messages, mode || 'support');

  // Execute action if AI triggered one
  let actionResult = null;
  if (action) {
    if (action.action === 'create_booking' && action.data) {
      try {
        const booking = await Booking.create({
          ...action.data,
          partySize: parseInt(action.data.partySize) || 2,
          status: 'Pending',
        });

        // Emit socket event
        const io = req.app.get('io');
        if (io) io.emit('booking:new', booking);

        actionResult = {
          type: 'booking_created',
          booking: {
            id: booking._id,
            date: booking.date,
            time: booking.time,
            partySize: booking.partySize,
          }
        };
      } catch (err) {
        console.error('AI Booking creation failed:', err);
        actionResult = { type: 'booking_failed', error: err.message };
      }
    } else if (action.action === 'add_to_cart' && action.data) {
      actionResult = {
        type: 'add_to_cart',
        items: action.data.items,
      };
    }
  }

  res.json({ reply, action: actionResult });
});
