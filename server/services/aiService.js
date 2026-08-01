import { GoogleGenerativeAI } from '@google/generative-ai';
import env from '../config/env.js';
import MenuItem from '../models/MenuItem.js';
import Booking from '../models/Booking.js';
import restaurantConfig from '../config/restaurantConfig.js';

let genAI = null;
let menuCache = null;
let menuCacheTime = 0;

const getGenAI = () => {
  if (!genAI && env.geminiApiKey) {
    genAI = new GoogleGenerativeAI(env.geminiApiKey);
  }
  return genAI;
};

// Cache menu for 10 minutes
const getMenuData = async () => {
  const now = Date.now();
  if (menuCache && now - menuCacheTime < 10 * 60 * 1000) return menuCache;
  
  try {
    const items = await MenuItem.find({ isAvailable: true }).lean();
    menuCache = items.map(i => ({
      name: i.name,
      price: i.price,
      category: i.category,
      isVeg: i.isVeg,
      description: i.description
    }));
    menuCacheTime = now;
  } catch (err) {
    menuCache = [];
  }
  return menuCache;
};

const SYSTEM_PROMPT = `You are the AI concierge for "Majestic Rabab", a premium fine-dining Indian restaurant.

RESTAURANT INFO:
- Cuisine: Authentic North Indian, Mughal-inspired fine dining
- Hours: 12:00 PM to 10:30 PM daily
- Address: Main Market, Hazratganj, Lucknow
- Phone: +91 7900324000
- Specialties: Tandoor, Biryani, Royal Thalis, Kebabs
- Seating: Indoor, Outdoor, Private Dining
- Dress Code: Smart Casual
- Parking: Valet parking available
- Reservation Deposit: ₹500 (adjustable against bill)

YOUR CAPABILITIES:
1. ORDER MODE: Help customers browse the menu, suggest dishes, and build orders. When the customer confirms, output a JSON action.
2. BOOKING MODE: Help customers make reservations. Collect date, time, party size, name, email, phone. When ready, output a JSON action.
3. SUPPORT MODE: Answer questions about the restaurant, hours, location, policies, etc.

RULES:
- Be warm, elegant, and helpful — match the restaurant's royal brand voice
- Keep responses concise (2-3 sentences max unless listing menu items)
- Use ₹ for prices
- When the customer wants to finalize a booking, output EXACTLY this JSON on its own line:
  {"action":"create_booking","data":{"name":"...","email":"...","phone":"...","date":"YYYY-MM-DD","time":"HH:MM","partySize":N,"seating":"Indoor/Outdoor/Private Dining"}}
- When the customer wants to add items to cart, output EXACTLY this JSON on its own line:
  {"action":"add_to_cart","data":{"items":[{"name":"...","price":N,"quantity":N}]}}
- Only output action JSON when the customer has explicitly confirmed
- For availability questions, use the slot data provided in context
- If you don't know something, politely say so and suggest calling the restaurant`;

export const getChatResponse = async (messages, mode = 'support') => {
  const ai = getGenAI();
  if (!ai) {
    return { reply: "I'm currently unavailable. Please call us at +91 7900324000 for assistance.", action: null };
  }

  try {
    const menu = await getMenuData();
    
    // Build context based on mode
    let contextInfo = '';
    if (mode === 'order') {
      contextInfo = `\n\nCURRENT MENU:\n${menu.map(i => `- ${i.name} (${i.isVeg ? 'Veg' : 'Non-Veg'}, ${i.category}) — ₹${i.price}: ${i.description}`).join('\n')}`;
    } else if (mode === 'booking') {
      // Get today's availability
      const today = new Date().toISOString().split('T')[0];
      const todayBookings = await Booking.find({ date: today, status: { $nin: ['Cancelled'] } });
      const bookedSlots = {};
      todayBookings.forEach(b => {
        bookedSlots[b.time] = (bookedSlots[b.time] || 0) + b.partySize;
      });
      const slots = restaurantConfig.getTimeSlots();
      const availInfo = slots.map(s => {
        const booked = bookedSlots[s] || 0;
        const remaining = restaurantConfig.maxCoversPerSlot - booked;
        return `${s}: ${remaining > 0 ? remaining + ' seats available' : 'FULL'}`;
      }).join(', ');
      contextInfo = `\n\nTODAY'S AVAILABILITY (${today}):\n${availInfo}\nMax capacity per slot: ${restaurantConfig.maxCoversPerSlot} covers`;
    }

    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const chat = model.startChat({
      history: messages.slice(0, -1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
      systemInstruction: SYSTEM_PROMPT + contextInfo,
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();

    // Parse action from response if present
    let action = null;
    const actionMatch = text.match(/\{[\s]*"action"[\s]*:[\s]*"(create_booking|add_to_cart)".*\}/s);
    if (actionMatch) {
      try {
        action = JSON.parse(actionMatch[0]);
      } catch (e) {
        // ignore parse errors
      }
    }

    // Clean the reply text (remove action JSON from display)
    let reply = text;
    if (actionMatch) {
      reply = text.replace(actionMatch[0], '').trim();
    }

    return { reply: reply || "I've processed your request!", action };
  } catch (error) {
    console.error('Gemini AI Error:', error);
    return { reply: "I apologize, I'm having trouble right now. Please call us at +91 7900324000.", action: null };
  }
};
