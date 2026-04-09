const nodemailer = require('nodemailer');

// Create transporter with Gmail configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER || 'mohantysubhrajit22@gmail.com',
    pass: process.env.GMAIL_PASSWORD || '', // Use app-specific password
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.log('Email service error:', error);
  } else {
    console.log('Email service ready');
  }
});

/**
 * Send booking confirmation email
 * @param {Object} options - Email options
 * @param {String} options.to - Recipient email
 * @param {String} options.username - User's name
 * @param {Object} options.listing - Listing object with location details
 * @param {Object} options.booking - Booking object with dates
 * @param {Boolean} options.paid - Payment status
 */
const sendBookingConfirmation = async (options) => {
  const { to, username, listing, booking, paid } = options;
  
  const checkInDate = new Date(booking.checkIn).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const checkOutDate = new Date(booking.checkOut).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const mapLink = `https://maps.mapbox.com/?q=${encodeURIComponent(listing.location)}`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #333; text-align: center;">Booking Confirmation ✓</h2>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #555; margin-top: 0;">Welcome ${username}!</h3>
        <p style="color: #666;">Your booking has been confirmed. Here are your booking details:</p>
      </div>
      
      <div style="margin: 20px 0;">
        <h3 style="color: #333; border-bottom: 2px solid #ff6b6b; padding-bottom: 10px;">Booking Details</h3>
        
        <table style="width: 100%; margin: 15px 0;">
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; font-weight: bold; color: #555;">Property Name:</td>
            <td style="padding: 10px; color: #333;">${listing.title}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #555;">Location:</td>
            <td style="padding: 10px; color: #333;">
              <a href="${mapLink}" style="color: #ff6b6b; text-decoration: none;">${listing.location}</a>
            </td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; font-weight: bold; color: #555;">Check-in Date:</td>
            <td style="padding: 10px; color: #333;">${checkInDate}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #555;">Check-out Date:</td>
            <td style="padding: 10px; color: #333;">${checkOutDate}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; font-weight: bold; color: #555;">Number of Guests:</td>
            <td style="padding: 10px; color: #333;">${booking.guests}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #555;">Total Price:</td>
            <td style="padding: 10px; color: #333; font-size: 18px; color: #ff6b6b;">₹${booking.totalPrice}</td>
          </tr>
        </table>
      </div>
      
      ${paid ? `
        <div style="background-color: #e8f5e9; padding: 15px; border-left: 4px solid #4caf50; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #2e7d32; margin-top: 0;">Payment Successful ✓</h3>
          <p style="color: #555; margin: 0;">Your payment has been processed successfully.</p>
          <p style="color: #555; margin: 5px 0;"><strong>Receipt ID:</strong> #${booking._id}</p>
        </div>
      ` : `
        <div style="background-color: #fff3e0; padding: 15px; border-left: 4px solid #ff9800; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #e65100; margin-top: 0;">Payment Pending</h3>
          <p style="color: #555;">Your booking is confirmed but payment is pending. Please complete the payment to finalize your reservation.</p>
        </div>
      `}
      
      <div style="background-color: #f0f4ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #1976d2; margin-top: 0;">Important Information</h3>
        <ul style="color: #555; padding-left: 20px;">
          <li>Please arrive by 3 PM on your check-in date</li>
          <li>Check-out time is 11 AM on your check-out date</li>
          <li>Keep this email for your reference</li>
          <li>For any queries, contact the property owner through the Wanderlust platform</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #999; font-size: 12px;">
        <p>This is an automated email from Wanderlust. Please do not reply to this email.</p>
        <p>© 2026 Wanderlust. All rights reserved.</p>
      </div>
    </div>
  `;
  
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER || 'mohantysubhrajit22@gmail.com',
      to: to,
      subject: `Booking Confirmed - ${listing.title}`,
      html: htmlContent
    });
    console.log('Booking confirmation email sent to:', to);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

/**
 * Send payment receipt email
 * @param {Object} options - Email options
 * @param {String} options.to - Recipient email
 * @param {String} options.username - User's name
 * @param {Object} options.booking - Booking object
 * @param {Object} options.listing - Listing object
 */
const sendPaymentReceipt = async (options) => {
  const { to, username, booking, listing } = options;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #4caf50; text-align: center;">Payment Receipt ✓</h2>
      
      <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #2e7d32; margin-top: 0;">Payment Successful</h3>
        <p style="color: #555;">Thank you ${username}! Your payment has been processed successfully.</p>
      </div>
      
      <div style="margin: 20px 0;">
        <h3 style="color: #333; border-bottom: 2px solid #4caf50; padding-bottom: 10px;">Receipt Details</h3>
        
        <table style="width: 100%; margin: 15px 0;">
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; font-weight: bold; color: #555;">Receipt ID:</td>
            <td style="padding: 10px; color: #333;">#${booking._id}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #555;">Property:</td>
            <td style="padding: 10px; color: #333;">${listing.title}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; font-weight: bold; color: #555;">Amount Paid:</td>
            <td style="padding: 10px; color: #333; font-size: 16px; font-weight: bold; color: #4caf50;">₹${booking.totalPrice}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #555;">Date:</td>
            <td style="padding: 10px; color: #333;">${new Date().toLocaleDateString()}</td>
          </tr>
        </table>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="color: #555; margin: 0;">Keep this receipt for your records. You will receive further communication about your booking through the Wanderlust platform.</p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #999; font-size: 12px;">
        <p>This is an automated email from Wanderlust. Please do not reply to this email.</p>
        <p>© 2026 Wanderlust. All rights reserved.</p>
      </div>
    </div>
  `;
  
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER || 'mohantysubhrajit22@gmail.com',
      to: to,
      subject: `Payment Receipt - ${listing.title}`,
      html: htmlContent
    });
    console.log('Payment receipt email sent to:', to);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = {
  sendBookingConfirmation,
  sendPaymentReceipt
};
