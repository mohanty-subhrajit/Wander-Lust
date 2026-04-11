require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🧪 EMAIL CONFIGURATION TEST\n');
console.log('Configuration:');
console.log('  GMAIL_USER:', process.env.GMAIL_USER);
console.log('  GMAIL_PASSWORD:', process.env.GMAIL_PASSWORD ? '***' + process.env.GMAIL_PASSWORD.slice(-4) : 'NOT SET');
console.log('  SMTP_HOST:', process.env.SMTP_HOST);
console.log('  SMTP_PORT:', process.env.SMTP_PORT);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER || 'mohantysubhrajit22@gmail.com',
    pass: process.env.GMAIL_PASSWORD || '',
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 5000,
  socketTimeout: 5000,
});

// Test connection
console.log('\n🔗 Testing SMTP connection...\n');

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ CONNECTION FAILED');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('Command:', error.command);
    process.exit(1);
  } else {
    console.log('✅ CONNECTION SUCCESSFUL\n');
    console.log('Sending test email...\n');
    
    const mailOptions = {
      from: process.env.GMAIL_USER || 'mohantysubhrajit22@gmail.com',
      to: 'subhrajit578mohanty@gmail.com',
      subject: '🧪 Test Email from WanderLust',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from WanderLust application.</p>
        <p><strong>From:</strong> ${process.env.GMAIL_USER}</p>
        <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
        <p>If you received this, email configuration is working! ✅</p>
      `
    };
    
    console.log('📤 From:', mailOptions.from);
    console.log('📧 To:', mailOptions.to);
    console.log('📝 Subject:', mailOptions.subject);
    console.log('');
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ EMAIL SEND FAILED');
        console.error('Error:', error.message);
        console.error('Code:', error.code);
        console.error('Command:', error.command);
        console.error('Stack:', error.stack);
        process.exit(1);
      } else {
        console.log('✅ EMAIL SENT SUCCESSFULLY');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
        console.log('\n✨ Email configuration is working correctly!');
        process.exit(0);
      }
    });
  }
});

// Timeout after 15 seconds
setTimeout(() => {
  console.error('\n⏱️  Test timeout - no response from SMTP server');
  process.exit(1);
}, 15000);
