import Contact from '../models/Contact.js';
import asyncHandler from '../utils/asyncHandler.js';

export const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  
  const contact = await Contact.create({
    name,
    email,
    phone,
    subject,
    message
  });

  res.status(201).json({ success: true, data: contact, message: 'Contact form submitted successfully' });
});
