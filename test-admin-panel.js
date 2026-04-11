require('dotenv').config();
const mongoose = require('mongoose');

const Booking = require('./models/booking');
const Listing = require('./models/listing');
const User = require('./models/user');
const bookingController = require('./controllers/bookings');

// Mock req and res objects
const mockReq = {
  user: { _id: 'admin-test', username: 'admin' },
  flash: function(type, message) {
    console.log(`[FLASH] ${type}: ${message}`);
  }
};

const mockRes = {
  render: function(template, data) {
    console.log(`\n✅ [RENDER] Template: ${template}`);
    console.log(`   Total bookings passed: ${data.bookings.length}`);
    console.log(`   Total in DB: ${data.totalBookings}`);
    console.log(`   Invalid: ${data.invalidCount || 0}`);
    
    if (data.bookings.length > 0) {
      console.log(`\n📋 BOOKINGS LIST (Sorted by newest first):\n`);
      data.bookings.forEach((booking, index) => {
        const status = booking.status === 'confirmed' ? '✅' : booking.status === 'pending' ? '⏳' : '❌';
        const payment = booking.paymentStatus === 'completed' ? '💰' : '💸';
        console.log(`${index + 1}. ${status} ${payment} ${booking.listing.title}`);
        console.log(`   Customer: ${booking.customer.username} <${booking.customer.email}>`);
        console.log(`   Dates: ${new Date(booking.checkIn).toLocaleDateString()} → ${new Date(booking.checkOut).toLocaleDateString()}`);
        console.log(`   Status: ${booking.status} | Payment: ${booking.paymentStatus}`);
        console.log('');
      });
    }
  },
  redirect: function(path) {
    console.log(`[REDIRECT] ${path}`);
  }
};

async function testAdminPanel() {
  try {
    console.log('🔗 Connecting to MongoDB...\n');
    
    await mongoose.connect(process.env.ATLASDB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected\n');
    
    console.log('🔄 Calling allBookings controller (admin panel)...\n');
    console.log('=' .repeat(80));
    
    // Call the controller
    await bookingController.allBookings(mockReq, mockRes);
    
    console.log('=' .repeat(80));
    console.log('\n✨ Admin panel test complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

testAdminPanel();
