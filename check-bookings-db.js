require('dotenv').config();
const mongoose = require('mongoose');

const Booking = require('./models/booking');
const Listing = require('./models/listing');
const User = require('./models/user');

async function checkBookings() {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...\n');
    
    await mongoose.connect(process.env.ATLASDB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB\n');
    
    // Count bookings
    const totalCount = await Booking.countDocuments({});
    console.log(`📊 Total Bookings in Database: ${totalCount}\n`);
    
    // Fetch all bookings with populate
    console.log('📋 Fetching all bookings with details...\n');
    
    const bookings = await Booking.find({})
      .populate({
        path: 'listing',
        select: 'title location owner price'
      })
      .populate({
        path: 'customer',
        select: 'username email'
      })
      .sort({ createdAt: -1 });
    
    console.log(`Found ${bookings.length} bookings after populate:\n`);
    console.log('=' .repeat(80));
    
    if (bookings.length === 0) {
      console.log('⚠️  NO BOOKINGS FOUND');
    } else {
      bookings.forEach((booking, index) => {
        const listingTitle = booking.listing?.title || '❌ MISSING LISTING';
        const customerName = booking.customer?.username || '❌ MISSING CUSTOMER';
        const customerEmail = booking.customer?.email || 'N/A';
        
        console.log(`\n[${index + 1}] Booking ID: ${booking._id}`);
        console.log(`    Listing: ${listingTitle}`);
        console.log(`    Customer: ${customerName} <${customerEmail}>`);
        console.log(`    Status: ${booking.status}`);
        console.log(`    Payment: ${booking.paymentStatus}`);
        console.log(`    Guests: ${booking.guests}`);
        console.log(`    Dates: ${new Date(booking.checkIn).toLocaleDateString()} → ${new Date(booking.checkOut).toLocaleDateString()}`);
        console.log(`    Price: ₹${booking.totalPrice}`);
        console.log(`    Created: ${new Date(booking.createdAt).toLocaleString()}`);
      });
    }
    
    console.log('\n' + '='.repeat(80));
    
    // Count by customer
    console.log('\n📊 Bookings by Customer:\n');
    const bookingsByCustomer = await Booking.aggregate([
      {
        $group: {
          _id: '$customer',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      }
    ]);
    
    bookingsByCustomer.forEach(item => {
      const username = item.user[0]?.username || 'Unknown';
      console.log(`  ${username}: ${item.count} booking(s)`);
    });
    
    // Count by status
    console.log('\n📊 Bookings by Status:\n');
    const statuses = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    statuses.forEach(item => {
      console.log(`  ${item._id}: ${item.count}`);
    });
    
    console.log('\n✅ Database check complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

checkBookings();
