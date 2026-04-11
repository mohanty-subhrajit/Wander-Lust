# Troubleshooting: Bookings Not Showing in Admin Panel

## If Bookings Still Aren't Showing

Use this guide to debug the issue.

---

## Step 1: Check Server Logs When Loading Admin Bookings

When you go to `/bookings/admin/bookings`, you should see logs like:

```
✓ Booking confirmation email sent to: user@example.com
  Message ID: <xyz@mail.gmail.com>
📊 Total bookings in database: 5
📊 Valid bookings to display: 5
```

### If You See:
```
⚠️ 3 bookings have missing references and won't be displayed
  Booking 507f1... has missing references - listing: false, customer: true
  Booking 508f2... has missing references - listing: true, customer: false
  Booking 509f3... has missing references - listing: false, customer: false
📊 Valid bookings: 2 out of 5
```

**This means:** 3 bookings have deleted listings or customers
- **Solution:** The database has corrupted references. These bookings can't be displayed safely.
- **Action:** You may need to manually delete these bookings from MongoDB or fix the references.

---

## Step 2: Check Browser Developer Tools

Press `F12` and check:

1. **Network Tab**
   - Go to `/bookings/admin/bookings`
   - Look for network request to this route
   - Check response status: Should be `200 OK`
   - If it's `500`, there's a server error

2. **Console Tab**
   - Look for JavaScript errors
   - Look for error messages from server

3. **Elements Tab**
   - Inspect the page
   - Check if booking table is in HTML
   - If HTML is empty, bookings aren't being rendered

---

## Step 3: Direct Database Query

If logs show 0 bookings but you created bookings:

### Check MongoDB Collection
```bash
# In your MongoDB/Atlas console:
db.bookings.countDocuments()  # Should show number of bookings
db.bookings.find({}).limit(5)  # Show first 5 bookings
```

If there are 0 documents, bookings weren't saved.

### Check if References Are Populated
```javascript
// In browser console or MongoDB query:
db.bookings.findOne({}, {
  listing: 1,
  customer: 1,
  status: 1
})
// Should show:
{
  _id: ObjectId(...),
  listing: ObjectId(...),      // ← Should exist
  customer: ObjectId(...),     // ← Should exist
  status: "pending"
}
```

---

## Step 4: Test the allBookings Function Directly

Add temporary logging to verify the function is being called:

In `controllers/bookings.js`, add at the start of `allBookings()`:

```javascript
console.log("🔍 allBookings() called");
console.log("👤 Admin user ID:", req.user._id);
console.time("booking-fetch");

// ... existing code ...

console.log(`📊 Found ${bookings.length} total bookings`);
console.log(`✅ Displaying ${validBookings.length} valid bookings`);
console.timeEnd("booking-fetch");
```

Then reload `/bookings/admin/bookings` and check server console.

---

## Step 5: Check if Routes are Correct

Verify booking routes in `routes/booking.js`:

```javascript
router.get("/admin/bookings", isLoggedIn, isAdmin, wrapAsync(bookingController.allBookings));
```

- Route should be: `/bookings/admin/bookings`
- Function should be: `allBookings`
- Authentication: `isLoggedIn` ✓
- Authorization: `isAdmin` ✓

If you're getting 403 or 404, check route configuration.

---

## Step 6: Verify Admin Permission

Make sure user is actually admin:

In browser console:
```javascript
// Check current user
fetch('/api/user/profile')  // If you have this endpoint
  .then(r => r.json())
  .then(user => console.log("Role:", user.role))
```

Or in MongoDB:
```javascript
db.users.findOne({ _id: ObjectId("your-user-id") })
// Check if isAdmin: true
```

If not admin, you'll get 403 Forbidden error.

---

## Step 7: Check If Bookings Created Properly

Go to `/bookings/my-bookings` (as customer who created bookings):

- Can you see your bookings there?
- If yes: Bookings were created properly
- If no: Bookings aren't being saved to database

If your own bookings don't show, the problem is in booking creation, not the admin view.

---

## Step 8: Clear Browser Cache

Sometimes old views are cached:

1. **Hard refresh:**
   - `Ctrl + Shift + R` (Windows)
   - `Cmd + Shift + R` (Mac)

2. **Clear cache completely:**
   - DevTools > Application > Storage > Clear Site Data

3. **Then reload the page**

---

## Common Issues & Solutions

| Symptom | Possible Cause | Fix |
|---------|----------------|-----|
| "No bookings yet" message | No bookings in database | Create a booking first |
| Page loads but no data | 500 server error | Check server logs for error |
| 403 Forbidden error | Not logged in or not admin | Login as admin user |
| Table shows but empty | Populate failed | Check if listing/customer deleted |
| Only 1 booking shows | Others have missing references | Check database for orphaned data |
| Page hangs/spinning | Async issue or database slow | Wait or check MongoDB connection |

---

## Debug Script

Add this temporarily to `controllers/bookings.js` at the start of `allBookings()`:

```javascript
module.exports.allBookings = async (req, res) => {
  console.log("\n=== ADMIN BOOKINGS DEBUG ===");
  console.log("User ID:", req.user._id);
  console.log("User is Admin:", req.user.isAdmin);
  
  try {
    const totalCount = await Booking.countDocuments({});
    console.log("Total bookings in DB:", totalCount);
    
    const bookings = await Booking.find({})
      .populate("listing")
      .populate("customer")
      .sort({ createdAt: -1 });
    
    console.log("Bookings fetched:", bookings.length);
    
    let validCount = 0;
    let invalidCount = 0;
    
    bookings.forEach(booking => {
      if (booking.listing && booking.customer) {
        validCount++;
      } else {
        invalidCount++;
        console.warn("Invalid booking:", {
          _id: booking._id,
          hasListing: !!booking.listing,
          hasCustomer: !!booking.customer,
          status: booking.status
        });
      }
    });
    
    console.log(`✅ Valid: ${validCount}, ❌ Invalid: ${invalidCount}`);
    console.log("=== END DEBUG ===\n");
    
    const validBookings = bookings.filter(b => b.listing && b.customer);
    res.render("bookings/adminBookings.ejs", { bookings: validBookings });
  } catch (error) {
    console.error("ERROR:", error.message);
    res.redirect("/listings");
  }
};
```

This will show you exactly what's happening when you load the page.

---

## If You Still Can't Find the Issue

1. **Check MongoDB directly:**
   - How many bookings exist?
   - Do they have listing and customer IDs?
   - Are those IDs valid?

2. **Check routes:**
   - Are routes defined correctly?
   - Is your URL exactly `/bookings/admin/bookings`?

3. **Check authentication:**
   - Are you logged in?
   - Are you an admin user?
   - Check browser console for errors

4. **Restart server:**
   - Sometimes Node.js caches old code
   - Kill server and restart

5. **Check view file:**
   - Is `adminBookings.ejs` file present?
   - Does it have any syntax errors?
   - Check browser's View Source to see actual HTML

---

## Quick Test

Run these commands in MongoDB to verify data:

```javascript
// Count total bookings
db.bookings.countDocuments()

// Count bookings with valid references
db.bookings.countDocuments({
  listing: { $exists: true, $ne: null },
  customer: { $exists: true, $ne: null }
})

// Show first booking details
db.bookings.findOne({}, { 
  listing: 1, 
  customer: 1, 
  status: 1, 
  createdAt: 1 
})
```

If both counts match, all bookings should show in admin panel.
If second count is lower, some bookings have missing references.
