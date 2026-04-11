const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/user.js');
const Booking = require('./models/booking.js');

async function checkAdminAndBookings() {
  try {
    await mongoose.connect(process.env.ATLASDB_URL);
    console.log('✅ DB Connected\n');
    
    // Check all admin users
    const admins = await User.find({ isAdmin: true });
    console.log('👨‍💼 ADMIN ACCOUNTS:', admins.length);
    admins.forEach(a => console.log(`  • ${a.username} (isAdmin: ${a.isAdmin})`));
    
    console.log('\n📊 BOOKINGS:');
    const totalBookings = await Booking.countDocuments({});
    console.log(`  Total in DB: ${totalBookings}`);
    
    if(totalBookings > 0) {
      const bookings = await Booking.find({}).populate('listing').populate('customer').limit(3);
      bookings.forEach((b, i) => {
        const customer = b.customer?.username || 'DELETED_CUSTOMER';
        const listing = b.listing?.title || 'DELETED_LISTING';
        console.log(`  [${i}] ${customer} → ${listing}`);
      });
    }
    
    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

checkAdminAndBookings();
