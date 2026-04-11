require('dotenv').config();
const axios = require('axios');

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║         Testing Brevo API Email Configuration             ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

if (!process.env.BREVO_API_KEY) {
  console.error('❌ BREVO_API_KEY not found in .env');
  process.exit(1);
}

const testBrevoAPI = async () => {
  try {
    console.log('📧 Brevo API Key Found:', process.env.BREVO_API_KEY.substring(0, 20) + '...');
    console.log('\n🔄 Sending test email via Brevo API...\n');

    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          email: process.env.BREVO_FROM_EMAIL || 'mohantysubhrajit22@gmail.com',
          name: 'Wanderlust Test',
        },
        to: [
          {
            email: 'subhrajit578mohanty@gmail.com',
            name: 'Test User',
          },
        ],
        subject: '✅ Brevo API Integration Test - WanderLust',
        htmlContent: `
          <h2>Test Email from Brevo API</h2>
          <p>This is a test email sent via Brevo REST API.</p>
          <p>If you received this, the Brevo API integration is working!</p>
        `,
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    console.log('✅ SUCCESS! Email sent via Brevo API');
    console.log(`📧 Message ID: ${response.data.messageId}`);
    console.log(`🎉 Response Status: ${response.status} ${response.statusText}\n`);
    console.log('📧 Check your inbox at: subhrajit578mohanty@gmail.com');
    console.log('   The email should arrive in 1-2 minutes\n');

  } catch (error) {
    console.error('❌ FAILED to send email via Brevo API');
    console.error(`\n🔴 Error: ${error.message}`);
    
    if (error.response) {
      console.error(`📊 Status: ${error.response.status}`);
      console.error(`📋 Data:`, error.response.data);
    }
    
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Verify BREVO_API_KEY is correct');
    console.error('2. Check the API key has email sending permissions');
    console.error('3. Ensure the sender email is authorized in Brevo\n');
    
    process.exit(1);
  }
};

testBrevoAPI();
