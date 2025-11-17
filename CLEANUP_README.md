# Database Cleanup Script Usage

## Overview
The `cleanDB.js` script helps you clean up your MongoDB database before performing important actions or testing.

## How to Use

1. **Basic Usage** - Run the script:
   ```bash
   node cleanDB.js
   ```

2. **Choose What to Clean** - Edit `cleanDB.js` and uncomment the functions you want to run:

   ```javascript
   // Clean all bookings
   await cleanupBookings();
   
   // Clean all reviews
   await cleanupReviews();
   
   // Clean all listings (WARNING: Deletes everything!)
   await cleanupListings();
   
   // Clean all users except admin (LAPU)
   await cleanupUsers();
   
   // Clean only rejected bookings
   await cleanupRejectedBookings();
   
   // Clean old completed bookings (30+ days old)
   await cleanupOldBookings();
   ```

## Available Cleanup Functions

### 1. `cleanupBookings()`
- Deletes ALL bookings from the database
- Use before testing booking system

### 2. `cleanupReviews()`
- Deletes ALL reviews
- Clears reviews array from all listings
- Use before testing review system

### 3. `cleanupListings()`
- ⚠️ **WARNING**: Deletes ALL listings
- Use only when you want to start fresh

### 4. `cleanupUsers()`
- Deletes all users EXCEPT admin (LAPU)
- Keeps admin account safe
- Use before testing user system

### 5. `cleanupRejectedBookings()`
- Deletes only rejected bookings
- Keeps pending and confirmed bookings
- Good for regular maintenance

### 6. `cleanupOldBookings()`
- Deletes confirmed bookings older than 30 days
- Keeps recent bookings
- Good for database optimization

## Safety Features

✅ Admin user (LAPU) is never deleted
✅ You choose what to clean by uncommenting
✅ Shows count of deleted items
✅ Closes database connection properly

## Example Scenarios

### Before Testing Bookings
```javascript
await cleanupBookings();
```

### Clean Everything Except Users
```javascript
await cleanupBookings();
await cleanupReviews();
await cleanupListings();
```

### Regular Maintenance
```javascript
await cleanupRejectedBookings();
await cleanupOldBookings();
```

### Fresh Start (⚠️ Nuclear Option)
```javascript
await cleanupBookings();
await cleanupReviews();
await cleanupListings();
await cleanupUsers();
```

## Important Notes

1. **Always backup** your database before running cleanup
2. **Test first** on development database
3. **Admin user** (LAPU) is always preserved
4. Script shows what was deleted
5. Database connection closes automatically

## Output Example

```
🧹 Starting Database Cleanup...

✅ Connected to MongoDB
✅ Deleted 15 bookings
✅ Deleted 23 reviews
✅ Cleared reviews from all listings

✨ Database cleanup completed!

✅ Database connection closed
```
