require('dotenv').config();
const mongoose = require('mongoose');

const Booking = require('./models/booking');
const User = require('./models/user');
const Listing = require('./models/listing');

async function testAdminBookingsDisplay() {
  try {
    console.log('🔗 Connecting to MongoDB...\n');
    
    await mongoose.connect(process.env.ATLASDB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected\n');
    
    // Fetch all bookings
    console.log('📋 Fetching admin bookings...\n');
    let bookings = await Booking.find({})
      .populate("listing")
      .populate("customer")
      .sort({ createdAt: -1 });
    
    console.log(`📊 Total in DB: ${bookings.length}`);
    
    // Filter like the controller does
    let validBookings = [];
    let invalidBookings = [];
    
    for (let i = 0; i < bookings.length; i++) {
      const booking = bookings[i];
      if (!booking.listing) {
        invalidBookings.push(booking._id);
      } else if (!booking.customer) {
        invalidBookings.push(booking._id);
      } else {
        validBookings.push(booking);
      }
    }
    
    console.log(`✅ Valid: ${validBookings.length}`);
    console.log(`❌ Invalid: ${invalidBookings.length}\n`);
    
    // Display what would be rendered in admin panel
    console.log('═'.repeat(100));
    console.log('📊 ADMIN BOOKINGS - MANAGE BOOKING SECTION');
    console.log('═'.repeat(100));
    
    if (validBookings.length === 0) {
      console.log('\n❌ No bookings to display\n');
    } else {
      console.log(`\n✅ Displaying ${validBookings.length} bookings:\n`);
      
      // Create a table-like display
      console.log('Customer'.padEnd(30) + '| Listing'.padEnd(25) + '| Check-in' + '| Status');
      console.log('─'.repeat(100));
      
      validBookings.forEach((booking, index) => {
        const customerName = booking.customer.username.slice(0, 25).padEnd(30);
        const listingTitle = booking.listing.title.slice(0, 25).padEnd(25);
        const checkIn = new Date(booking.checkIn).toLocaleDateString().padEnd(10);
        const status = booking.status;
        
        console.log(`${index + 1}. ${customerName}| ${listingTitle}| ${checkIn}| ${status}`);
      });
      
      console.log('\n' + '─'.repeat(100));
    }
    
    // Group by customer
    console.log('\n📊 BREAKDOWN BY CUSTOMER:\n');
    
    const customerMap = {};
    validBookings.forEach(booking => {
      const username = booking.customer.username;
      if (!customerMap[username]) {
        customerMap[username] = [];
      }
      customerMap[username].push(booking);
    });
    
    Object.entries(customerMap).forEach(([username, bookings]) => {
      const count = bookings.length;
      const statuses = bookings.map(b => b.status).join(', ');
      const marker = username === 'test2' ? '⭐' : '  ';
      console.log(`${marker} ${username.padEnd(20)} : ${count} booking(s) [${statuses}]`);
    });
    
    // Specific check for test2
    console.log('\n' + '═'.repeat(100));
    const test2Bookings = validBookings.filter(b => b.customer.username === 'test2');
    console.log(`\n🔍 test2 BOOKINGS STATUS:\n`);
    console.log(`   Total bookings for test2: ${test2Bookings.length}`);
    console.log(`   Expected: 7`);
    
    if (test2Bookings.length === 7) {
      console.log(`   ✅ ALL 7 test2 bookings ARE showing in admin panel!\n`);
    } else {
      console.log(`   ❌ Missing test2 bookings! Got ${test2Bookings.length}, expected 7\n`);
    }
    
    // Show test2 details
    if (test2Bookings.length > 0) {
      console.log('   test2 Bookings:');
      test2Bookings.forEach((booking, i) => {
        const dates = `${new Date(booking.checkIn).toLocaleDateString()} → ${new Date(booking.checkOut).toLocaleDateString()}`;
        console.log(`   ${i + 1}. ${booking.listing.title} | ${dates} | ${booking.status}`);
      });
    }
    
    console.log('\n' + '═'.repeat(100));
    console.log('\n✨ Test complete!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

testAdminBookingsDisplay();
