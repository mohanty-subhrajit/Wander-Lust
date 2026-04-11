require('dotenv').config();
const sgMail = require('@sendgrid/mail');

// Check if SendGrid API key is set
if (!process.env.SENDGRID_API_KEY) {
  console.error('❌ ERROR: SENDGRID_API_KEY not found in environment variables');
  console.error('Please add SENDGRID_API_KEY to your .env file');
  process.exit(1);
}

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'mohantysubhrajit22@gmail.com', // Changed to main email
  from: process.env.SENDGRID_FROM_EMAIL || 'noreply@wanderlust.com', // SendGrid verified sender
  subject: '✅ SendGrid Integration Test - WanderLust',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #ff6b6b;">🎉 SendGrid Integration Successful!</h2>
      
      <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #2e7d32; margin-top: 0;">✅ Test Email Verified</h3>
        <p style="color: #555;">Your SendGrid integration is working correctly!</p>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h4 style="color: #333;">Details:</h4>
        <ul style="color: #555;">
          <li><strong>Service:</strong> SendGrid API</li>
          <li><strong>From:</strong> ${process.env.SENDGRID_FROM_EMAIL || 'noreply@wanderlust.com'}</li>
          <li><strong>To:</strong> subhrajit578mohanty@gmail.com</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
          <li><strong>Status:</strong> Successfully sent ✅</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
        <p style="color: #999; font-size: 12px;">WanderLust Booking System | SendGrid Email Service</p>
      </div>
    </div>
  `,
};

console.log('\n📧 [SENDGRID TEST] Sending test email...');
console.log(`   To: ${msg.to}`);
console.log(`   From: ${msg.from}`);

sgMail
  .send(msg)
  .then((response) => {
    console.log('\n✅ [SENDGRID TEST] Email sent successfully!');
    console.log(`   Message ID: ${response[0].headers['x-message-id']}`);
    console.log(`   Status Code: ${response[0].statusCode}`);
    console.log(`\n📍 Next Step: Check your inbox at subhrajit578mohanty@gmail.com`);
    console.log(`   Then go back to SendGrid and click "Verify Integration"\n`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ [SENDGRID TEST] Failed to send email');
    console.error(`   Error: ${error.message}`);
    
    if (error.code === 401) {
      console.error(`\n   🔐 Authentication Error:`);
      console.error(`   - Check SENDGRID_API_KEY is correct`);
      console.error(`   - Verify the API key hasn't expired`);
    } else if (error.response) {
      console.error(`   Response:`, error.response.body);
    }
    
    process.exit(1);
  });
