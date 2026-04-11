require('dotenv').config();
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const Booking = require('./models/booking');
const Listing = require('./models/listing');
const User = require('./models/user');

async function testAdminPanelUI() {
  try {
    console.log('🔗 Connecting to MongoDB...\n');
    
    await mongoose.connect(process.env.ATLASDB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB\n');
    
    // Fetch all bookings
    console.log('📋 Fetching all bookings...\n');
    let bookings = await Booking.find({})
      .populate("listing")
      .populate("customer")
      .sort({ createdAt: -1 });
    
    console.log(`📊 Found ${bookings.length} total bookings`);
    
    // Filter out invalid bookings
    let validBookings = [];
    bookings.forEach(booking => {
      if (booking.listing && booking.customer) {
        validBookings.push(booking);
      }
    });
    
    console.log(`✅ ${validBookings.length} valid bookings\n`);
    
    // Prepare data for EJS
    const data = {
      bookings: validBookings,
      totalBookings: bookings.length,
      invalidCount: bookings.length - validBookings.length,
      currUser: { _id: 'admin', username: 'admin', isAdmin: true },
      layout: false // Prevent layout wrapping for this test
    };
    
    // Read and render just the table rows
    const templatePath = path.join(__dirname, 'views', 'bookings', 'adminBookings.ejs');
    
    console.log('🎨 Rendering EJS template...\n');
    
    ejs.renderFile(templatePath, data, { filename: templatePath }, (err, html) => {
      if (err) {
        console.error('❌ Error rendering template:', err.message);
      } else {
        console.log('✅ Template rendered successfully\n');
        
        // Count table rows
        const tableRowMatches = html.match(/<tr>/g) || [];
        const headerRows = html.match(/<thead>[\s\S]*?<\/thead>/g) || [];
        const bodyRows = tableRowMatches.length - (headerRows[0]?.match(/<tr>/g) || []).length;
        
        console.log('📊 HTML ANALYSIS:\n');
        console.log(`   Total <tr> tags: ${tableRowMatches.length}`);
        console.log(`   Header <tr> tags: ${(headerRows[0]?.match(/<tr>/g) || []).length}`);
        console.log(`   Body <tr> tags (booking rows): ${bodyRows}`);
        console.log(`   Expected rows: ${validBookings.length}`);
        
        if (bodyRows === validBookings.length) {
          console.log(`\n✅ ALL BOOKINGS ARE RENDERED IN HTML!`);
        } else if (bodyRows < validBookings.length) {
          console.log(`\n❌ MISSING ROWS! Expected ${validBookings.length}, got ${bodyRows}`);
        }
        
        // Extract and display first 5 booking customer names from HTML
        console.log('\n📋 First 5 bookings in rendered HTML:\n');
        const custMatches = html.match(/<strong>([^<]+)<\/strong>/g);
        if (custMatches) {
          for (let i = 0; i < Math.min(5, custMatches.length); i++) {
            const name = custMatches[i].replace(/<strong>|<\/strong>/g, '');
            console.log(`   ${i + 1}. ${name}`);
          }
        }
        
        // Check if test2 bookings are in HTML
        const test2Count = (html.match(/test2/g) || []).length;
        console.log(`\n🔍 test2 mentions in HTML: ${test2Count}`);
        if (test2Count >= 7) {
          console.log('✅ test2 bookings ARE in the HTML!');
        } else {
          console.log(`⚠️  test2 bookings not fully present (expected 7+, found ${test2Count})`);
        }
        
        // Save HTML to file for inspection
        const outputPath = path.join(__dirname, 'admin-bookings-render.html');
        fs.writeFileSync(outputPath, html);
        console.log(`\n📄 Full HTML saved to: admin-bookings-render.html`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    // Keep connection open for rendering to complete
    setTimeout(async () => {
      await mongoose.connection.close();
      process.exit(0);
    }, 3000);
  }
}

testAdminPanelUI();
