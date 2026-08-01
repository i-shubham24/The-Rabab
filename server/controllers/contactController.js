import Contact from '../models/Contact.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendContactAutoReply } from '../services/emailService.js';

export const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  
  const contact = await Contact.create({
    name,
    email,
    phone,
    subject,
    message
  });

  // Send auto-reply asynchronously
  sendContactAutoReply(contact).catch(err => console.error('Failed to send contact auto-reply', err));

  res.status(201).json({ success: true, data: contact, message: 'Contact form submitted successfully' });
});

export const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({}).sort({ createdAt: -1 });
  res.status(200).json(contacts);
});

export const updateContactStatus = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (contact) {
    contact.isRead = req.body.isRead;
    const updatedContact = await contact.save();
    res.json(updatedContact);
  } else {
    res.status(404);
    throw new Error('Contact not found');
  }
});
