/**
 * Database Cleanup Script
 * Run this script to clean up the database before performing actions
 * 
 * Usage: node cleanDB.js
 */

// Load environment variables
if (process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

const mongoose = require("mongoose");

// Import models
const Listing = require("./models/listing");
const Review = require("./models/review");
const User = require("./models/user");
const Booking = require("./models/booking");

// Database connection URL - Use Atlas if available, otherwise local
const dbUrl = process.env.ATLASDB_URL ;

// Connect to database
async function connectDB() {
  try {
    await mongoose.connect(dbUrl);
    console.log(`✅ Connected to MongoDB`);
    console.log(`   Database: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

// Cleanup functions
async function cleanupBookings() {
  try {
    const result = await Booking.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} bookings`);
  } catch (err) {
    console.error("❌ Error cleaning bookings:", err);
  }
}

async function cleanupReviews() {
  try {
    const result = await Review.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} reviews`);
    
    // Also clear reviews array in all listings
    await Listing.updateMany({}, { $set: { reviews: [] } });
    console.log("✅ Cleared reviews from all listings");
  } catch (err) {
    console.error("❌ Error cleaning reviews:", err);
  }
}

async function cleanupListings() {
  try {
    const result = await Listing.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} listings`);
  } catch (err) {
    console.error("❌ Error cleaning listings:", err);
  }
}

async function cleanupUsers() {
  try {
    // Delete all users except admin
    const result = await User.deleteMany({ username: { $ne: "LAPU" } });
    console.log(`✅ Deleted ${result.deletedCount} users (kept admin)`);
  } catch (err) {
    console.error("❌ Error cleaning users:", err);
  }
}

async function cleanupRejectedBookings() {
  try {
    const result = await Booking.deleteMany({ status: "rejected" });
    console.log(`✅ Deleted ${result.deletedCount} rejected bookings`);
  } catch (err) {
    console.error("❌ Error cleaning rejected bookings:", err);
  }
}

async function cleanupOldBookings() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const result = await Booking.deleteMany({
      checkOut: { $lt: thirtyDaysAgo },
      status: "confirmed"
    });
    console.log(`✅ Deleted ${result.deletedCount} old completed bookings`);
  } catch (err) {
    console.error("❌ Error cleaning old bookings:", err);
  }
}

// Main cleanup function
async function cleanDatabase() {
  console.log("\n🧹 Starting Database Cleanup...\n");

  await connectDB();

  // Choose what to clean (uncomment what you need)
  
  // Clean bookings
  // await cleanupBookings();
  
  // Clean reviews
  // await cleanupReviews();
  
  // Clean listings (WARNING: This will delete all listings!)
  // await cleanupListings();
  
  // Clean users (except admin)
  // await cleanupUsers();
  
  // Clean only rejected bookings
  // await cleanupRejectedBookings();
  
  // Clean old completed bookings (older than 30 days)
  // await cleanupOldBookings();

  console.log("\n⚠️  All cleanup functions are commented out. Uncomment the ones you need to run.");

  console.log("\n✨ Database cleanup completed!\n");
  
  // Close connection
  await mongoose.connection.close();
  console.log("✅ Database connection closed");
  process.exit(0);
}

// Run cleanup
cleanDatabase();
