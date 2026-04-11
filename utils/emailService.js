const nodemailer = require('nodemailer');
const axios = require('axios');
const dns = require('dns');

// Check which email service to use
const USE_BREVO_API = !!process.env.BREVO_API_KEY;
const USE_BREVO_SMTP = !!process.env.BREVO_SMTP_USER && !USE_BREVO_API;
const USE_GMAIL = !!process.env.GMAIL_PASSWORD && !USE_BREVO_API && !USE_BREVO_SMTP;

// Configure email service
let transporter = null;

if (USE_BREVO_API) {
  // Brevo API Configuration (Recommended - works on Render)
  console.log('\n📧 [EMAIL SERVICE] Using BREVO API');
  console.log('   Mode: HTTP REST API');
  console.log('   Status: Ready to send emails\n');
  
} else if (USE_BREVO_SMTP) {
  // Brevo SMTP Configuration
  transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_SERVER || 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASSWORD,
    },
    connectionTimeout: 10000,
    socketTimeout: 10000,
  });
  
  console.log('\n📧 [EMAIL SERVICE] Using BREVO SMTP');
  console.log('   Host:', process.env.BREVO_SMTP_SERVER || 'smtp-relay.brevo.com');
  console.log('   Port: 587');
  console.log('   From:', process.env.BREVO_FROM_EMAIL || 'noreply@wanderlust.com');
  console.log('   Status: Ready to send emails\n');
  
} else if (USE_GMAIL) {
  // Gmail SMTP Configuration (Fallback)
  // Force DNS to use IPv4 only on Render
  dns.setDefaultResultOrder('ipv4first');

  // Create transporter with Gmail configuration
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    family: 4, // Force IPv4 only
    auth: {
      user: process.env.GMAIL_USER || 'mohantysubhrajit22@gmail.com',
      pass: process.env.GMAIL_PASSWORD || '', // Use app-specific password
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2' // Enforce TLS 1.2+
    },
    connectionTimeout: 10000, // 10 seconds
    socketTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    pool: {
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 5
    },
    logger: true,
    debug: true
  });
  
  console.log('\n📧 [EMAIL SERVICE] Using GMAIL SMTP');
  console.log('   Status: Configured');
  console.log('   From:', process.env.GMAIL_USER || 'mohantysubhrajit22@gmail.com');
  
} else {
  console.error('\n❌ [EMAIL SERVICE] No email provider configured!');
  console.error('   Please set either:');
  console.error('   - BREVO_SMTP_USER and BREVO_SMTP_PASSWORD');
  console.error('   - Or GMAIL_USER and GMAIL_PASSWORD');
}

// Verify transporter connection on startup
if (transporter) {
  console.log('\n📧 [EMAIL SERVICE] Initializing...');
  console.log('   Environment Variables:');
  console.log('   - BREVO_SMTP_USER:', process.env.BREVO_SMTP_USER ? '✅ Set' : '❌ NOT SET');
  console.log('   - GMAIL_USER:', process.env.GMAIL_USER ? '✅ Set' : '❌ NOT SET');
  console.log('   - GMAIL_PASSWORD:', process.env.GMAIL_PASSWORD ? '✅ Set' : '❌ NOT SET');
  
  if (USE_GMAIL && transporter.verify) {
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ [EMAIL SERVICE] Connection FAILED');
        console.error('   Error:', error.message);
        console.error('   Code:', error.code);
        console.error('   Command:', error.command);
        console.log('\n   🔧 Fix:');
        console.log('   1. Consider using Brevo instead (more reliable on Render)');
        console.log('   2. Or verify GMAIL_USER and GMAIL_PASSWORD are correct');
        console.log('   3. Use app-specific password, not regular Gmail password\n');
      } else {
        console.log('✅ [EMAIL SERVICE] Connection SUCCESSFUL');
        console.log('   SMTP:', process.env.SMTP_HOST || 'smtp.gmail.com:587');
        console.log('   Status: Ready to send emails\n');
      }
    });
  }
}

/**
 * Send email via Brevo API
 */
const sendWithBrevoAPI = async (mailOptions) => {
  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          email: process.env.BREVO_FROM_EMAIL || 'mohantysubhrajit22@gmail.com',
          name: 'Wanderlust',
        },
        to: [
          {
            email: mailOptions.to,
            name: mailOptions.to.split('@')[0],
          },
        ],
        subject: mailOptions.subject,
        htmlContent: mailOptions.html,
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    console.log(`✅ [EMAIL API] Email sent via Brevo API`);
    console.log(`   Message ID: ${response.data.messageId}`);
    return { success: true, messageId: response.data.messageId };
  } catch (error) {
    console.error(`❌ [EMAIL API] Failed to send email via Brevo API`);
    console.error(`   Error:`, error.response?.data?.message || error.message);
    throw error;
  }
};

/**
 * Send email via SMTP (Nodemailer)
 */
const sendWithSMTP = async (mailOptions) => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      console.error(`⏱️  [EMAIL] Timeout waiting for SMTP response`);
      reject(new Error('Email send timeout after 10 seconds'));
    }, 10000);

    console.log(`📨 [EMAIL] Sending via SMTP...`);
    transporter.sendMail(mailOptions, (error, info) => {
      clearTimeout(timeout);
      if (error) {
        console.error(`❌ [EMAIL] SMTP Error: ${error.message}`);
        console.error(`   Code: ${error.code}`);
        reject(error);
      } else {
        console.log(`✅ [EMAIL] Accepted by SMTP server`);
        console.log(`   Message-ID: ${info.messageId}`);
        resolve(info);
      }
    });
  });
};

/**
 * Validate email address
 * @param {String} email - Email to validate
 * @returns {Object} - { isValid: boolean, message: string }
 */
const validateEmail = (email) => {
  // Simple email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || typeof email !== 'string') {
    return { isValid: false, message: 'Email is required' };
  }
  
  email = email.trim();
  
  // Just check basic format, allow all emails
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Invalid email format' };
  }
  
  return { isValid: true, message: 'Email is valid' };
};

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
  
  // Validate email first
  const emailValidation = validateEmail(to);
  if (!emailValidation.isValid) {
    console.log(`⚠️ Email not sent (Invalid email): ${to} - ${emailValidation.message}`);
    return { success: false, message: emailValidation.message, sent: false };
  }
  
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
    const mailOptions = {
      from: process.env.BREVO_FROM_EMAIL || process.env.GMAIL_USER || 'mohantysubhrajit22@gmail.com',
      to: to,
      subject: `Booking Confirmed - ${listing.title}`,
      html: htmlContent
    };
    
    console.log(`📤 [EMAIL] Preparing booking confirmation`);
    console.log(`   From: ${mailOptions.from}`);
    console.log(`   To: ${to}`);
    console.log(`   Environment: ${process.env.NODE_ENV === 'production' ? '🌐 RENDER (Production)' : '💻 Local'}`);
    
    let result;
    if (USE_BREVO_API) {
      result = await sendWithBrevoAPI(mailOptions);
    } else if (transporter) {
      result = await sendWithSMTP(mailOptions);
    } else {
      throw new Error('No email service configured');
    }
    
    console.log(`✅ [EMAIL] Booking confirmation sent successfully to: ${to}`);
    return { success: true, message: 'Booking confirmation email sent successfully', sent: true };
  } catch (error) {
    console.error(`❌ [EMAIL] Failed to send booking confirmation to: ${to}`);
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    
    // Provide helpful suggestions based on error type
    if (error.code === 'ENOTFOUND' || error.code === 'ENETUNREACH') {
      console.error(`\n   📍 NETWORK ERROR on Render:`);
      console.error(`   - Add GMAIL_USER and GMAIL_PASSWORD to Render Environment Variables`);
      console.error(`   - Or consider using SendGrid as email provider`);
    } else if (error.code === 'EAUTH') {
      console.error(`\n   🔐 AUTHENTICATION ERROR:`);
      console.error(`   - Check GMAIL_USER and GMAIL_PASSWORD are correct`);
      console.error(`   - Use app-specific password, not regular Gmail password`);
    }
    
    // Return graceful failure - booking is still confirmed
    return { success: false, message: `Email not sent: ${error.message}`, sent: false };
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
  
  // Validate email first
  const emailValidation = validateEmail(to);
  if (!emailValidation.isValid) {
    console.log(`⚠️ Email not sent (Invalid email): ${to} - ${emailValidation.message}`);
    return { success: false, message: emailValidation.message, sent: false };
  }
  
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
    const mailOptions = {
      from: process.env.BREVO_FROM_EMAIL || process.env.GMAIL_USER || 'mohantysubhrajit22@gmail.com',
      to: to,
      subject: `Payment Receipt - ${listing.title}`,
      html: htmlContent
    };
    
    console.log(`📧 Sending payment receipt email to: ${to}`);
    
    let result;
    if (USE_BREVO_API) {
      result = await sendWithBrevoAPI(mailOptions);
    } else if (transporter) {
      result = await sendWithSMTP(mailOptions);
    } else {
      throw new Error('No email service configured');
    }
    
    return { success: true, message: 'Payment receipt sent successfully', sent: true };
  } catch (error) {
    console.error('⚠️  Error sending payment receipt email to:', to);
    console.error('   Error message:', error.message);
    return { success: false, message: error.message, sent: false };
  }
};

module.exports = {
  sendBookingConfirmation,
  sendPaymentReceipt,
  validateEmail
};
