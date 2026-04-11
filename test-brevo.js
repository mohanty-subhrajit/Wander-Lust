require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('\n✅ Testing Brevo SMTP Configuration...\n');

// Check if Brevo credentials are set
if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASSWORD) {
  console.error('❌ ERROR: Brevo SMTP credentials not found in environment variables');
  console.error('Please add to your .env file:');
  console.error('  - BREVO_SMTP_USER');
  console.error('  - BREVO_SMTP_PASSWORD');
  console.error('  - BREVO_SMTP_SERVER (optional, defaults to smtp-relay.brevo.com)');
  console.error('  - BREVO_SMTP_PORT (optional, defaults to 587)');
  console.error('  - BREVO_FROM_EMAIL (optional, defaults to mohantysubhrajit22@gmail.com)');
  process.exit(1);
}

console.log('📧 Configuration Found:');
console.log(`   BREVO_SMTP_SERVER: ${process.env.BREVO_SMTP_SERVER || 'smtp-relay.brevo.com'}`);
console.log(`   BREVO_SMTP_PORT: ${process.env.BREVO_SMTP_PORT || 587}`);
console.log(`   BREVO_SMTP_USER: ${process.env.BREVO_SMTP_USER}`);
console.log(`   BREVO_FROM_EMAIL: ${process.env.BREVO_FROM_EMAIL || 'mohantysubhrajit22@gmail.com'}\n`);

// Create Brevo transporter
const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_SERVER || 'smtp-relay.brevo.com',
  port: process.env.BREVO_SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASSWORD,
  },
  connectionTimeout: 10000,
  socketTimeout: 10000,
});

const msg = {
  to: 'subhrajit578mohanty@gmail.com',
  from: process.env.BREVO_FROM_EMAIL || 'mohantysubhrajit22@gmail.com',
  subject: '✅ Brevo SMTP Integration Test - WanderLust',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #ff6b6b; text-align: center;">🎉 Brevo SMTP Integration Working!</h2>
      
      <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4caf50;">
        <h3 style="color: #2e7d32; margin-top: 0;">✅ Test Email Successfully Delivered</h3>
        <p style="color: #555;">Your Brevo SMTP configuration is working perfectly!</p>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h4 style="color: #333;">Email Details:</h4>
        <table style="width: 100%; color: #555; font-size: 14px;">
          <tr>
            <td style="padding: 8px; font-weight: bold;">Service:</td>
            <td style="padding: 8px;">Brevo SMTP</td>
          </tr>
          <tr style="background-color: #f0f0f0;">
            <td style="padding: 8px; font-weight: bold;">Server:</td>
            <td style="padding: 8px;">smtp-relay.brevo.com</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Port:</td>
            <td style="padding: 8px;">587</td>
          </tr>
          <tr style="background-color: #f0f0f0;">
            <td style="padding: 8px; font-weight: bold;">From:</td>
            <td style="padding: 8px;">${process.env.BREVO_FROM_EMAIL || 'mohantysubhrajit22@gmail.com'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Timestamp:</td>
            <td style="padding: 8px;">${new Date().toLocaleString()}</td>
          </tr>
        </table>
      </div>
      
      <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2196f3;">
        <h4 style="color: #1565c0; margin-top: 0;">✅ Next Steps:</h4>
        <ol style="color: #555; padding-left: 20px;">
          <li>Verify this email was received successfully</li>
          <li>Add Brevo credentials to Render Environment Variables</li>
          <li>Test booking confirmation emails on your live site</li>
          <li>Enjoy automatic email notifications! 🎉</li>
        </ol>
      </div>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      
      <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
        WanderLust Booking System | Powered by Brevo<br>
        © 2026 WanderLust. All rights reserved.
      </p>
    </div>
  `,
};

console.log('📧 Sending test email...');
console.log(`   To: ${msg.to}`);
console.log(`   From: ${msg.from}`);
console.log(`   Subject: ${msg.subject}\n`);

transporter
  .sendMail(msg)
  .then((response) => {
    console.log('✅ SUCCESS! Email sent via Brevo SMTP');
    console.log(`   Message ID: ${response.messageId}`);
    console.log(`   Response: ${response.response}`);
    console.log(`\n📧 Check your inbox at: ${msg.to}`);
    console.log(`   The email should arrive in 1-2 minutes\n`);
    console.log('🚀 Next: Add Brevo credentials to Render Environment Variables\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ FAILED! Email could not be sent');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code}\n`);
    
    if (error.code === 'EAUTH') {
      console.error('   🔐 Authentication Error:');
      console.error('   - Check BREVO_SMTP_USER is correct');
      console.error('   - Check BREVO_SMTP_PASSWORD is correct');
    } else if (error.code === 'ENOTFOUND') {
      console.error('   🌐 DNS Resolution Error:');
      console.error('   - Check internet connection');
      console.error('   - Check BREVO_SMTP_SERVER is: smtp-relay.brevo.com');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      console.error('   ⏱️  Connection Timeout:');
      console.error('   - Verify BREVO_SMTP_PORT is 587');
      console.error('   - Check firewall settings');
    }
    
    process.exit(1);
  });
