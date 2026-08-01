import asyncHandler from '../utils/asyncHandler.js';

export const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  // TODO: Add nodemailer logic to send email
  res.status(200).json({ message: 'Contact form submitted successfully' });
});
