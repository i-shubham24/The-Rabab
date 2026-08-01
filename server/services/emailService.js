import nodemailer from 'nodemailer';
import env from '../config/env.js';

let transporter = null;

const createTransporter = async () => {
  if (transporter) return transporter;

  if (env.smtp.user && env.smtp.pass) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port == 465, // true for 465, false for other ports
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
    });
  } else {
    // Generate test SMTP service account from ethereal.email if no real credentials exist
    console.log('No SMTP credentials found in env. Generating Ethereal test account...');
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
  return transporter;
};

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const t = await createTransporter();
    
    const info = await t.sendMail({
      from: '"Majestic Rabab" <reservations@majesticrabab.com>',
      to,
      subject,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    if (!env.smtp.user) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

const baseTemplate = (content) => `
  <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #0a0a0a; color: #f5f0e8;">
    <div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #c9a84c; padding-bottom: 20px;">
      <h1 style="color: #c9a84c; margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase;">RABAB</h1>
      <p style="color: #a0a0a0; margin: 5px 0 0; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">Fine Indian Dining</p>
    </div>
    <div style="font-size: 16px; line-height: 1.6; color: #e0e0e0;">
      ${content}
    </div>
    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; font-size: 12px; color: #888;">
      <p>Majestic Rabab Restaurant</p>
      <p>123 Royal Heritage Marg, New Delhi</p>
      <p>+91 98765 43210 | www.majesticrabab.com</p>
    </div>
  </div>
`;

export const sendBookingConfirmation = async (booking) => {
  const html = baseTemplate(`
    <h2 style="color: #c9a84c;">Your Reservation is Confirmed!</h2>
    <p>Dear ${booking.name},</p>
    <p>We are delighted to confirm your table reservation at Majestic Rabab.</p>
    <div style="background: rgba(201, 168, 76, 0.1); padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #333;">
      <p style="margin: 5px 0;"><strong>Date:</strong> ${booking.date}</p>
      <p style="margin: 5px 0;"><strong>Time:</strong> ${booking.time}</p>
      <p style="margin: 5px 0;"><strong>Guests:</strong> ${booking.partySize}</p>
      <p style="margin: 5px 0;"><strong>Seating:</strong> ${booking.seating}</p>
    </div>
    <p>We look forward to serving you a royal feast.</p>
  `);
  
  return sendEmail({
    to: booking.email,
    subject: 'Reservation Confirmed - Majestic Rabab',
    html,
  });
};

export const sendBookingCancellation = async (booking) => {
  const html = baseTemplate(`
    <h2 style="color: #c9a84c;">Reservation Cancelled</h2>
    <p>Dear ${booking.name},</p>
    <p>We wanted to let you know that your reservation for <strong>${booking.partySize} guests</strong> on <strong>${booking.date} at ${booking.time}</strong> has been cancelled.</p>
    <p>If this was a mistake or you wish to reschedule, please contact us or reply to this email.</p>
    <p>We hope to welcome you at Majestic Rabab in the future.</p>
  `);
  
  return sendEmail({
    to: booking.email,
    subject: 'Reservation Update - Majestic Rabab',
    html,
  });
};

export const sendContactAutoReply = async (contact) => {
  const html = baseTemplate(`
    <h2 style="color: #c9a84c;">We've received your message</h2>
    <p>Dear ${contact.name},</p>
    <p>Thank you for reaching out to Majestic Rabab. This email is to confirm that we have received your inquiry regarding <em>"${contact.subject}"</em>.</p>
    <p>Our management team will review your message and get back to you shortly, typically within 24 hours.</p>
    <p>Warm regards,<br>The Majestic Rabab Team</p>
  `);
  
  return sendEmail({
    to: contact.email,
    subject: 'Thank you for contacting Majestic Rabab',
    html,
  });
};
