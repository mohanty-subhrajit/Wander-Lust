require('dotenv').config();
const { sendBookingConfirmation } = require('./utils/emailService');

console.log('🧪 BOOKING CONFIRMATION EMAIL TEST\n');

// Mock booking data
const mockBooking = {
  _id: '507f1f77bcf86cd799439011',
  checkIn: new Date('2026-04-20'),
  checkOut: new Date('2026-04-25'),
  guests: 2,
  totalPrice: 5000,
  status: 'confirmed',
  paymentStatus: 'completed'
};

const mockListing = {
  _id: '507f191e810c19729de860ea',
  title: 'Beautiful Beachside Villa',
  location: 'Goa, India',
  price: 1000,
  maxGuests: 4,
  description: 'A beautiful villa by the beach with amazing views'
};

const mockCustomer = {
  username: 'testuser',
  email: 'subhrajit578mohanty@gmail.com'
};

console.log('Test Details:');
console.log('  Listing:', mockListing.title);
console.log('  Customer:', mockCustomer.username, `<${mockCustomer.email}>`);
console.log('  Check-in:', mockBooking.checkIn.toLocaleDateString());
console.log('  Check-out:', mockBooking.checkOut.toLocaleDateString());
console.log('  Guests:', mockBooking.guests);
console.log('  Total Price: ₹' + mockBooking.totalPrice);
console.log('  Payment Status:', mockBooking.paymentStatus);

console.log('\n📧 Sending booking confirmation email...\n');

sendBookingConfirmation({
  to: mockCustomer.email,
  username: mockCustomer.username,
  listing: mockListing,
  booking: mockBooking,
  paid: mockBooking.paymentStatus === 'completed'
})
  .then((result) => {
    console.log('\n✅ RESULT:');
    console.log('  Success:', result.success);
    console.log('  Sent:', result.sent);
    console.log('  Message:', result.message);
    
    if (result.sent) {
      console.log('\n✨ Booking confirmation email sent successfully!');
      console.log('Check your inbox at: subhrajit578mohanty@gmail.com');
    } else {
      console.log('\n❌ Email failed to send!');
      console.log('Check Render environment variables (GMAIL_USER, GMAIL_PASSWORD)');
    }
    
    process.exit(result.sent ? 0 : 1);
  })
  .catch((error) => {
    console.error('\n❌ ERROR:');
    console.error('  Message:', error.message);
    console.error('  Stack:', error.stack);
    process.exit(1);
  });

// Timeout after 15 seconds
setTimeout(() => {
  console.error('\n⏱️  Test timeout - no response from email service');
  process.exit(1);
}, 15000);
