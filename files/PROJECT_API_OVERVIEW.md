# 🏨 WANDERLUST - Complete API & Technical Overview
**Session Date:** 2026-05-05  
**Project:** Wanderlust (Air-Bnb MERN Clone)

---

## 📋 Table of Contents

1. [Project Statistics](#project-statistics)
2. [Complete Route List](#complete-route-list)
3. [Chat System - Detailed](#chat-system---detailed)
4. [Mapbox & Location Services](#mapbox--location-services)
5. [Authentication & Authorization](#authentication--authorization)
6. [Database Relations](#database-relations)
7. [Cloudinary - Image Management](#cloudinary---image-management)
8. [Browser Geolocation](#browser-geolocation)

---

## 📊 Project Statistics

### **Total Routes/Endpoints: 47**

**Breakdown by Feature:**
- Main App: 2 endpoints
- Listings: 8 endpoints
- Reviews: 2 endpoints
- Bookings: 11 endpoints
- Payments: 7 endpoints
- Chat: 3 endpoints
- Bot: 3 endpoints
- Users: 11 endpoints

**Total Files:**
- Routes: 7 files
- Controllers: 6 files
- Models: 7 files
- Middleware: 1 file

---

## 📍 Complete Route List

### **Main Routes (app.js)**
```
GET  /                    → Redirect to /listings
GET  /demouser           → Create demo user
```

### **Listings Routes** (/listings)
```
GET    /                    → Index/List all listings
POST   /                    → Create new listing
GET    /new                 → Show create form
GET    /admin/all-listings  → Admin view all listings
GET    /:id                 → Show single listing
PUT    /:id                 → Update listing
DELETE /:id                 → Delete listing
GET    /:id/edit           → Show edit form
```

### **Reviews Routes** (/listings/:id/reviews)
```
POST   /                    → Create review
DELETE /:reviewId          → Delete review
```

### **Bookings Routes** (/bookings)
```
GET    /listings/:id/book          → Show booking form
POST   /listings/:id/book          → Create booking
GET    /my-bookings                → User's bookings
DELETE /:id                        → Cancel booking
GET    /manage                     → Owner manage bookings
POST   /:id/owner-confirm          → Owner confirm booking
POST   /:id/owner-reject           → Owner reject booking
GET    /admin/bookings             → Admin view all
POST   /:id/confirm                → Admin confirm
POST   /:id/reject                 → Admin reject
DELETE /:id/admin-delete           → Admin delete
```

### **Payments Routes** (/payments)
```
GET    /booking/:bookingId                    → Show payment form
POST   /booking/:bookingId/process            → Process payment
GET    /upi-scanner/:bookingId                → Show UPI QR
POST   /upi-scanner/:bookingId/complete       → Complete UPI payment
GET    /success/:bookingId                    → Payment success
GET    /history                               → Payment history
GET    /admin/payments                        → Admin payments
```

### **Chat Routes** (/chat)
```
GET    /booking/:bookingId                    → Get/Create chat
POST   /booking/:bookingId/message            → Send message
GET    /unread-count                          → Get unread count
```

### **Bot Routes** (/bot)
```
POST   /chat                  → Chat with bot
GET    /history/:sessionId    → Get conversation history
POST   /reset                 → Reset conversation
```

### **User Routes** (/users)
```
GET    /signup                      → Show signup form
POST   /signup                      → Register user
GET    /login                       → Show login form
POST   /login                       → Authenticate user
GET    /logout                      → Logout user
GET    /profile                     → View own profile
GET    /profile/edit                → Edit profile form
POST   /profile/edit                → Update profile
GET    /view/:userId               → View other profile
GET    /admin/users                 → Admin user list
DELETE /admin/users/:id             → Admin delete user
```

---

# 💬 Chat System - Detailed Explanation

## **How Chat Works - Complete Flow**

### **Step 1: Access Chat (Validation)**

**Route:** `GET /chat/booking/:bookingId`  
**Controller:** `controllers/chat.js:6-76`

**Validation Checks:**
```javascript
// Check 1: Find booking
const booking = await Booking.findById(bookingId)
  .populate("listing")
  .populate("customer");

if (!booking) {
  ❌ Redirect to /bookings/my-bookings
}

// Check 2: Is user involved?
const isCustomer = booking.customer._id.equals(req.user._id);
const isOwner = booking.listing.owner._id.equals(req.user._id);

if (!isCustomer && !isOwner && !req.user.isAdmin) {
  ❌ Redirect - "No permission"
}

// Check 3: Is booking confirmed?
if (booking.status !== "confirmed") {
  ❌ Redirect - "Chat only for confirmed bookings"
}
```

### **Step 2: Find or Create Chat Room**

```javascript
// One chat per booking (unique)
let chat = await Chat.findOne({ booking: bookingId })
  .populate("participants")
  .populate("messages.sender");

if (!chat) {
  // Create new chat with 2 participants
  chat = new Chat({
    booking: bookingId,
    participants: [booking.customer._id, booking.listing.owner._id],
    messages: []
  });
  await chat.save();
}
```

### **Step 3: Mark Messages as Read**

```javascript
// For current user, mark messages from other person as read
chat.messages.forEach(msg => {
  if (!msg.isRead && !msg.sender._id.equals(req.user._id)) {
    msg.isRead = true;
  }
});

if (hasUnread) {
  await chat.save();
}
```

### **Step 4: Render Chat Page**

```javascript
res.render("bookings/chat.ejs", { 
  chat,                 // All messages
  booking,              // Booking details
  otherParticipant,     // Other user info
  currentUser: req.user // Current user
});
```

---

## **Sending a Message**

**Route:** `POST /chat/booking/:bookingId/message`  
**Controller:** `controllers/chat.js:79-145`

### **Validation:**
```javascript
// 1. Message not empty
if (!message || message.trim() === "") {
  ❌ return 400 error
}

// 2. User is participant
const isCustomer = booking.customer.equals(req.user._id);
const isOwner = booking.listing.owner.equals(req.user._id);

if (!isCustomer && !isOwner) {
  ❌ return 403 error
}

// 3. Booking confirmed
if (booking.status !== "confirmed") {
  ❌ return 403 error
}
```

### **Add Message to Chat:**
```javascript
chat.messages.push({
  sender: req.user._id,
  content: message.trim(),
  timestamp: new Date(),
  isRead: false
});

chat.lastMessage = new Date();
await chat.save();
```

### **Return JSON Response:**
```javascript
res.json({
  success: true,
  message: {
    id: newMessage._id,
    sender: { id: newMessage.sender._id, username: newMessage.sender.username },
    content: newMessage.content,
    timestamp: newMessage.timestamp
  }
});
```

---

## **Get Unread Count**

**Route:** `GET /chat/unread-count`

```javascript
const chats = await Chat.find({ participants: req.user._id });

let unreadCount = 0;
chats.forEach(chat => {
  chat.messages.forEach(msg => {
    if (!msg.isRead && !msg.sender.equals(req.user._id)) {
      unreadCount++;
    }
  });
});

res.json({ unreadCount });
```

---

## **Chat Database Schema**

```javascript
Chat {
  booking: ObjectId,           // One chat per booking (unique)
  participants: [ObjectId],    // [customer, owner]
  messages: [
    {
      sender: ObjectId,        // Who sent it
      content: String,         // Message text
      timestamp: Date,         // When sent
      isRead: Boolean          // Read status
    }
  ],
  lastMessage: Date            // For sorting
}
```

---

## **Chat System Features**

✅ **One-to-One Messaging** - Only customer & owner  
✅ **Confirmed Bookings Only** - Security feature  
✅ **Read/Unread Tracking** - Know who read what  
✅ **REST API** - No WebSocket needed  
✅ **Persistent** - All messages in MongoDB  
✅ **Permission Checks** - Can't access others' chats  

---

# 🗺️ Mapbox & Location Services

## **Why Mapbox?**

**Problem:** We need BOTH text locations and coordinates
- Text: "Goa" (human-readable)
- Coordinates: [73.8243, 15.2993] (for maps)

**Solution:** Mapbox provides two services:
1. **Forward Geocoding** - Text to coordinates
2. **Reverse Geocoding** - Coordinates to text

---

## **1. Forward Geocoding (Create Listing)**

**File:** `controllers/listings.js:57-61`

```javascript
// User enters location name
let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,  // "Goa"
  limit: 1
}).send();

// Mapbox returns:
// response.body.features[0].geometry
// Result: { type: "Point", coordinates: [73.8243, 15.2993] }
```

**Saved to Database:**
```javascript
{
  location: "Goa",                    // Text
  geometry: {
    type: "Point",
    coordinates: [73.8243, 15.2993]  // Coordinates
  }
}
```

---

## **2. Update Listing - Re-geocode**

**File:** `controllers/listings.js:102-138`

```javascript
// If location changed, get new coordinates
let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
}).send();

// Handle maxGuests changes
if (req.body.listing.maxGuests) {
  const newMax = parseInt(req.body.listing.maxGuests);
  const oldMax = listing.maxGuests;
  const bookedGuests = oldMax - listing.availableGuests;
  listing.maxGuests = newMax;
  listing.availableGuests = Math.max(0, newMax - bookedGuests);
}

// Update geometry
if (response.body.features.length > 0) {
  listing.geometry = response.body.features[0].geometry;
}
```

---

## **3. Display Map (Show Listing)**

**File:** `public/js/map.js:10-41`

```javascript
// Get coordinates from database
let coordinates = listing.geometry.coordinates;
// [73.8243, 15.2993]

// Initialize Mapbox map
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: coordinates,  // [longitude, latitude]
  zoom: 10
});

// Add marker
const marker = new mapboxgl.Marker({ color: "#fe424d" })
  .setLngLat(coordinates)
  .setPopup(new mapboxgl.Popup().setHTML(`
    <h4>${listing.title}</h4>
    <p>${listing.location}</p>
  `))
  .addTo(map);
```

---

## **4. Use Current Location (Browser)**

**File:** `public/js/locationPicker.js:37-96`

**Process:**
```
User clicks "Use Current Location"
    ↓
navigator.geolocation.getCurrentPosition()
    ↓
Browser requests permission
    ↓
User allows
    ↓
Device returns: {latitude, longitude}
    ↓
Call Mapbox Reverse Geocoding:
  fetch(`/geocoding/v5/mapbox.places/${lon},${lat}.json`)
    ↓
Mapbox returns: "Indore, India"
    ↓
Auto-fill location field
    ↓
Save coordinates globally: window.listingCoordinates
```

---

## **Mapbox Environment Variables**

```env
MAP_TOKEN=your_mapbox_token
```

Get from: mapbox.com → Account → Tokens

---

# 🔐 Authentication & Authorization

## **1. isLoggedIn Middleware**

**File:** `middleware.js:7-15`

```javascript
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};
```

**Usage:**
```javascript
// All protected routes need this
router.post("/listings", isLoggedIn, createListing);
```

---

## **2. isOwner - Ownership Check**

**File:** `middleware.js:25-44`

### **How It Works:**

```javascript
module.exports.isOwner = async (req, res, next) => {
  // Step 1: Get listing ID from URL
  let { id } = req.params;
  
  // Step 2: Fetch listing from database
  let listing = await Listing.findById(id);
  
  if (!listing) {
    ❌ Redirect - "Listing not found"
  }
  
  // Step 3: Admin override
  if (res.locals.currUser && res.locals.currUser.isAdmin) {
    return next();  // Skip ownership check!
  }
  
  // Step 4: Compare ownership
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    ❌ Redirect - "You are not the owner"
  }
  
  next();  // Ownership verified ✅
};
```

### **Example Scenarios:**

**Scenario A: Owner Edits Own Listing ✅**
```
DB: { owner: user_456 }
Current User: user_456 (not admin)

Check: user_456 === user_456? YES ✅
Result: Edit allowed
```

**Scenario B: Different User Tries to Edit ❌**
```
DB: { owner: user_456 }
Current User: user_789 (not admin)

Check: user_789 === user_456? NO ❌
Result: Error - redirected with message
```

**Scenario C: Admin Edits Any Listing ✅**
```
DB: { owner: user_456 }
Current User: LAPU (isAdmin: true)

Check: Is admin? YES ✅
Result: Edit allowed (skip ownership check)
```

---

## **3. isAdmin Middleware**

**File:** `middleware.js:47-53`

```javascript
module.exports.isAdmin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    ❌ Redirect - "Admin required"
  }
  
  if (!req.user.isAdmin) {
    ❌ Redirect - "Admin required"
  }
  
  next();  // Admin verified ✅
};
```

**Routes using isAdmin:**
```javascript
router.get("/admin/users", isLoggedIn, isAdmin, userController.allUsers);
router.get("/listings/admin/all-listings", isLoggedIn, isAdmin, listingController.adminListings);
router.post("/:id/confirm", isLoggedIn, isAdmin, bookingController.confirmBooking);
```

---

## **4. Other Authorization Checks**

### **isReviewAuthor** - Check review ownership
```javascript
module.exports.isReviewAuthor = async (req, res, next) => {
  let { reviewId } = req.params;
  let review = await Review.findById(reviewId);
  
  if (res.locals.currUser && res.locals.currUser.isAdmin) {
    return next();  // Admin can delete any review
  }
  
  if (!review.author.equals(res.locals.currUser._id)) {
    ❌ "You are not the author"
  }
  
  next();
};
```

### **isBookingCustomer** - Check booking ownership
```javascript
module.exports.isBookingCustomer = async (req, res, next) => {
  let { id } = req.params;
  let booking = await Booking.findById(id);
  
  if (res.locals.currUser && res.locals.currUser.isAdmin) {
    return next();  // Admin can manage any booking
  }
  
  if (!booking.customer.equals(res.locals.currUser._id)) {
    ❌ "Not authorized"
  }
  
  next();
};
```

### **isListingOwner** - Check if user owns listing (for bookings)
```javascript
module.exports.isListingOwner = async (req, res, next) => {
  let { id } = req.params;
  let booking = await Booking.findById(id).populate("listing");
  
  if (res.locals.currUser && res.locals.currUser.isAdmin) {
    return next();  // Admin can manage
  }
  
  if (!booking.listing.owner.equals(res.locals.currUser._id)) {
    ❌ "Not authorized"
  }
  
  next();
};
```

---

## **Admin User Creation**

**File:** `app.js:143-160`

```javascript
async function createAdminUser() {
  const adminExists = await User.findOne({ username: "LAPU" });
  if (!adminExists) {
    const adminUser = new User({
      email: "admin@wanderlust.com",
      username: "LAPU",
      isAdmin: true  // ← This makes them admin
    });
    await User.register(adminUser, "LAPU");
  }
}

createAdminUser();  // Runs on server startup
```

**Default Admin:**
- Username: LAPU
- Email: admin@wanderlust.com
- Password: LAPU

---

## **Admin Access Chart**

| Action | Regular User | Owner | Admin |
|--------|--------------|-------|-------|
| Edit own listing | ❌ | ✅ | ✅ |
| Edit others' listing | ❌ | ❌ | ✅ |
| Delete own listing | ❌ | ✅ | ✅ |
| Delete others' listing | ❌ | ❌ | ✅ |
| Delete own review | ✅ | ✅ | ✅ |
| Delete others' review | ❌ | ❌ | ✅ |
| Cancel own booking | ✅ | ❌ | ✅ |
| Manage all bookings | ❌ | ❌ | ✅ |
| View all users | ❌ | ❌ | ✅ |
| Delete any user | ❌ | ❌ | ✅ |
| View all payments | ❌ | ❌ | ✅ |

---

# 🗄️ Database Relations

## **Relation Type 1: User → Listing (One-to-Many)**

```javascript
// Listing has ONE owner
Listing {
  owner: ObjectId (ref: User)
}

// User can own MANY listings
User → [Listing1, Listing2, Listing3]
```

**Example:**
```javascript
// Find all listings by user
const listings = await Listing.find({ owner: userId });

// Get listing with owner details
const listing = await Listing.findById(id)
  .populate("owner");

// Result:
{
  title: "Beach House",
  owner: {
    username: "john_doe",
    email: "john@example.com"
  }
}
```

---

## **Relation Type 2: Listing → Review (One-to-Many)**

```javascript
Listing {
  reviews: [ObjectId]  // Array of review IDs
}

Review {
  // Listing reference is stored in Listing.reviews array
}

// One listing has MANY reviews
Listing → [Review1, Review2, Review3]
```

**Example:**
```javascript
// Get listing with all reviews and authors
const listing = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate: { path: "author" }
  });

// Result:
{
  title: "Beach House",
  reviews: [
    {
      comment: "Amazing!",
      rating: 5,
      author: { username: "jane" }
    },
    {
      comment: "Great view",
      rating: 4,
      author: { username: "bob" }
    }
  ]
}
```

---

## **Relation Type 3: Booking (Many-to-One Links)**

```javascript
Booking {
  listing: ObjectId (ref: Listing),    // Links to property
  customer: ObjectId (ref: User)       // Links to customer
}

// One listing can have MANY bookings
// One user can make MANY bookings

Listing → [Booking1, Booking2, Booking3]
User → [Booking1, Booking2, Booking3]
```

**Example:**
```javascript
// Get user's bookings
const bookings = await Booking.find({ customer: userId })
  .populate("listing")
  .populate("customer");

// Result:
[
  {
    checkIn: 2024-05-05,
    checkOut: 2024-05-10,
    listing: {
      title: "Beach House",
      price: 5000
    },
    customer: {
      username: "john"
    }
  }
]
```

---

## **Relation Type 4: Chat (One-to-One + Embedded)**

```javascript
Chat {
  booking: ObjectId (unique),      // ONE chat per booking
  participants: [ObjectId],        // Two users
  messages: [                       // Embedded array
    {
      sender: ObjectId,
      content: String,
      timestamp: Date,
      isRead: Boolean
    }
  ]
}

// Booking → Chat (one-to-one)
// Chat → Messages (embedded)
```

**Example:**
```javascript
const chat = await Chat.findOne({ booking: bookingId })
  .populate("participants")
  .populate("messages.sender");

// Result:
{
  booking: "booking_123",
  participants: [
    { username: "customer_name" },
    { username: "owner_name" }
  ],
  messages: [
    {
      sender: { username: "customer" },
      content: "Hi!",
      timestamp: 2024-05-05T10:30:00Z,
      isRead: true
    }
  ]
}
```

---

## **Relation Type 5: Payment (Many-to-One)**

```javascript
Payment {
  booking: ObjectId (ref: Booking),
  customer: ObjectId (ref: User)
}

// One booking → One payment
// One user → Many payments
```

**Example:**
```javascript
const payments = await Payment.find({ customer: userId })
  .populate("booking");

// Result:
[
  {
    amount: 25000,
    paymentMethod: "upi",
    status: "completed",
    booking: { checkIn: 2024-05-05 }
  }
]
```

---

## **All Relations Summary**

```
User
├── Listings (owner)
│   └── Reviews (contains)
│   └── Bookings (listing)
│       └── Chat (booking)
│           └── Messages (embedded)
│       └── Payment (booking)
├── Reviews (author)
├── Bookings (customer)
├── Chats (participant)
└── Payments (customer)
```

---

# ☁️ Cloudinary - Image Management

## **What is Cloudinary?**

Cloud service for storing images + automatic optimizations + CDN for fast loading

---

## **Setup: cloudConfig.js**

```javascript
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats: ["png","jpg","jpeg"],
  },
});

module.exports = { cloudinary, storage };
```

**Environment Variables:**
```env
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
```

---

## **Multer Setup: Routes**

### **For Listing Images**

**File:** `routes/listing.js:6-13`

```javascript
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });  // Use Cloudinary storage

router.post(
  "/listings",
  isLoggedIn,
  validateListing,
  upload.single("listing[image]"),  // ← Single file upload
  createListing
);
```

### **For Profile Photos**

**File:** `routes/user.js:34`

```javascript
router.post(
  "/profile/edit",
  isLoggedIn,
  validateProfile,
  upload.single("profile[profilePhoto]"),  // ← Profile photo
  updateProfile
);
```

---

## **Photo Upload Flow**

### **Step 1: HTML Form**

```html
<form action="/listings" method="POST" enctype="multipart/form-data">
  <input type="file" name="listing[image]" required />
  <input type="text" name="listing[title]" />
  <button type="submit">Create</button>
</form>
```

**Key:** `enctype="multipart/form-data"` - Allows file upload

---

### **Step 2: Submit to Server**

```
POST /listings
Content-Type: multipart/form-data

Body:
- listing[title]: "Beach House"
- listing[image]: [binary file data]
```

---

### **Step 3: Multer Middleware**

**File:** `routes/listing.js`

```javascript
upload.single("listing[image]")
```

**What happens:**
1. Intercepts request
2. Finds file in form field
3. **Sends to Cloudinary** ☁️
4. Cloudinary returns URL
5. Stores in `req.file`:
   ```javascript
   req.file = {
     path: "https://res.cloudinary.com/.../file.jpg",
     filename: "wanderlust_DEV/file_xyz"
   }
   ```

---

### **Step 4: Controller Saves**

**File:** `controllers/listings.js:66-74`

```javascript
if (!req.file) {
  ❌ Redirect - "No file uploaded"
}

const { path: url, filename } = req.file;

const newListing = new Listing(req.body.listing);
newListing.image = { url, filename };
newListing.owner = req.user._id;

await newListing.save();
```

---

### **Step 5: Saved in Database**

```javascript
Listing {
  title: "Beach House",
  image: {
    url: "https://res.cloudinary.com/wanderlust/image/upload/v1234567890/wanderlust_DEV/house_xyz.jpg",
    filename: "wanderlust_DEV/house_xyz"
  }
}
```

---

### **Step 6: Display on Frontend**

**EJS Template:**
```html
<img src="<%= listing.image.url %>" alt="<%= listing.title %>" />
```

**Rendered HTML:**
```html
<img src="https://res.cloudinary.com/.../house_xyz.jpg" alt="Beach House" />
```

---

## **Image Optimization Examples**

Cloudinary URLs can include transformations:

```
Original: .../h_300/...
  → Returns image with height 300px

Original: .../q_80/...
  → Returns image with 80% quality (smaller file size)

Original: .../c_fill,h_400,w_600/...
  → Returns 600x400 image, cropped to fill
```

**Used in Edit Form:**
```javascript
let originalImageurl = listing.image.url;
originalImageurl = originalImageurl.replace("/upload","/upload/h_300");
// Show thumbnail in edit form
```

---

## **Profile Photo Upload**

**File:** `controllers/userProfiles.js:40-46`

```javascript
if (typeof req.file !== "undefined") {
  updateData.profilePhoto = {
    url: req.file.path,
    filename: req.file.filename
  };
}

const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
```

**Saved in DB:**
```javascript
User {
  username: "john_doe",
  profilePhoto: {
    url: "https://res.cloudinary.com/.../profile_xyz.jpg",
    filename: "wanderlust_DEV/profile_xyz"
  }
}
```

---

## **Photo Upload Diagram**

```
┌─────────────┐
│   Browser   │ User selects file
└──────┬──────┘
       │ Form submit (multipart/form-data)
       ↓
┌─────────────────────────┐
│   Express Server        │
├─────────────────────────┤
│ upload.single()         │
│ (Multer middleware)     │
└──────┬──────────────────┘
       │ File data sent
       ↓
┌─────────────────────────┐
│  Cloudinary Cloud ☁️     │
├─────────────────────────┤
│ - Store file            │
│ - Optimize image        │
│ - Generate URL          │
└──────┬──────────────────┘
       │ Return { path, filename }
       ↓
┌─────────────────────────┐
│  Express Server         │
├─────────────────────────┤
│ req.file = {            │
│   path: "https://...",  │
│   filename: "..."       │
│ }                       │
└──────┬──────────────────┘
       │ Save to MongoDB
       ↓
┌─────────────────────────┐
│  MongoDB Database       │
├─────────────────────────┤
│ Listing {               │
│   image: {              │
│     url: "https://...", │
│     filename: "..."     │
│   }                     │
│ }                       │
└──────┬──────────────────┘
       │ When displaying
       ↓
┌─────────────────────────┐
│   Frontend HTML         │
├─────────────────────────┤
│ <img src="{url}" />     │
└──────┬──────────────────┘
       │ Download from CDN
       ↓
┌─────────────────────────┐
│   Browser Shows Photo   │
│         📸              │
└─────────────────────────┘
```

---

# 📍 Browser Geolocation

## **How It Works**

Browser can access device location if user permits

```
Browser Geolocation API
    ↓
Accesses: GPS (mobile), IP (desktop), WiFi signals
    ↓
Returns: { latitude, longitude }
```

---

## **Step-by-Step: Get Current Location**

**File:** `public/js/locationPicker.js:8-97`

### **Step 1: User Clicks Button**

```html
<button id="useCurrentLocation">Use Current Location</button>
```

```javascript
document.getElementById('useCurrentLocation').addEventListener('click', function() {
  // Disable button during request
  this.disabled = true;
  this.textContent = 'Getting location...';
```

### **Step 2: Check Browser Support**

```javascript
if (!navigator.geolocation) {
  alert('❌ Geolocation not supported');
  ❌ return
}

if (!mapboxToken) {
  alert('❌ Map service not configured');
  ❌ return
}
```

### **Step 3: Request with Timeout**

```javascript
const timeoutId = setTimeout(() => {
  alert('⏱️ Request timed out (10 seconds)');
}, 10000);  // 10 seconds max
```

### **Step 4: Get Location from Device**

```javascript
navigator.geolocation.getCurrentPosition(
  async (position) => {  // ← SUCCESS
    clearTimeout(timeoutId);
    
    const { latitude, longitude } = position.coords;
    // Example: latitude = 20.5937, longitude = 78.9629
    
    // Continue to next step...
  },
  (error) => {  // ← ERROR
    // Handle errors
  }
);
```

### **Step 5: Browser Shows Permission Popup**

```
┌─────────────────────────────────┐
│ wanderlust.com wants to access  │
│ your precise location            │
│                                 │
│ [Allow]    [Deny]               │
└─────────────────────────────────┘
```

**If user clicks "Allow":**
- Browser accesses GPS/WiFi
- Returns coordinates

**If user clicks "Deny":**
- Error callback triggered
- Show permission denied message

---

### **Step 6: Reverse Geocode (Coordinates → Text)**

```javascript
const response = await fetch(
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}`
);

const data = await response.json();

if (data.features && data.features.length > 0) {
  const locationName = data.features[0].place_name;
  // Example: "Indore, Madhya Pradesh, India"
  
  // Auto-fill location field
  document.getElementById('location').value = locationName;
  
  // Save coordinates globally
  window.listingCoordinates = [longitude, latitude];
  
  alert('✓ Location found: ' + locationName);
}
```

### **Step 7: Handle Errors**

```javascript
(error) => {
  clearTimeout(timeoutId);
  
  let errorMsg = '⚠️ Unable to get location.';
  
  if (error.code === error.PERMISSION_DENIED) {
    errorMsg += '\n\nLocation access was denied.\n\n' +
               'To enable:\n' +
               '1. Click lock icon in address bar\n' +
               '2. Select "Manage site settings"\n' +
               '3. Change location to "Allow"';
  }
  else if (error.code === error.POSITION_UNAVAILABLE) {
    errorMsg += '\n\nYour location is unavailable.\n\n' +
               'Please try:\n' +
               '• Turning on GPS\n' +
               '• Moving to open area';
  }
  else if (error.code === error.TIMEOUT) {
    errorMsg += '\n\nRequest timed out. Try again.';
  }
  
  alert(errorMsg);
}
```

---

## **Complete Geolocation Flow Diagram**

```
User clicks "Use Current Location"
    ↓
Check: Browser supports geolocation?
├─ YES → Continue
└─ NO → Show error ❌
    ↓
Check: Mapbox token available?
├─ YES → Continue
└─ NO → Show error ❌
    ↓
navigator.geolocation.getCurrentPosition()
    ↓
Browser displays permission popup
    ↓
User clicks "Allow"
    ↓
Device returns:
{
  latitude: 20.5937,
  longitude: 78.9629,
  accuracy: 50  (meters)
}
    ↓
Call Mapbox Reverse Geocoding:
GET /geocoding/v5/mapbox.places/78.9629,20.5937.json
    ↓
Mapbox returns:
{
  features: [{
    place_name: "Indore, Madhya Pradesh, India"
  }]
}
    ↓
Auto-fill form:
<input id="location" value="Indore, Madhya Pradesh, India" />
    ↓
Save coordinates globally:
window.listingCoordinates = [78.9629, 20.5937]
    ↓
User submits form:
├─ location text: "Indore, Madhya Pradesh, India"
└─ coordinates: [78.9629, 20.5937]
    ↓
Backend Forward Geocodes:
"Indore" → [78.9629, 20.5937]
    ↓
Listing saved with both text and coordinates
```

---

## **Alternative: Google Maps URL Input**

**File:** `public/js/locationPicker.js:100-191`

### **Supported Formats:**

```
1. Direct coordinates:
   20.1234, -85.8246

2. Google Maps URL:
   https://www.google.com/maps/@20.1234,-85.8246

3. Google Maps place search:
   https://maps.google.com/?q=Goa

4. Shortened link (requires expansion):
   maps.app.goo.gl/...
```

### **Example:**

```javascript
document.getElementById('useGoogleLocation')?.addEventListener('click', function() {
  const googleInput = document.getElementById('googleLocationInput').value;
  
  // Parse coordinates from input
  const coordMatch = googleInput.match(/(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
  if (coordMatch) {
    latitude = parseFloat(coordMatch[1]);
    longitude = parseFloat(coordMatch[2]);
  }
  
  // Validate coordinates
  if (latitude < -90 || latitude > 90) {
    alert('❌ Invalid latitude');
    return;
  }
  
  // Reverse geocode to get location name
  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}`)
    .then(response => response.json())
    .then(data => {
      const locationName = data.features[0].place_name;
      document.getElementById('location').value = locationName;
    });
});
```

---

## **Geolocation Permissions Error Handling**

| Error Code | Meaning | Solution |
|-----------|---------|----------|
| PERMISSION_DENIED | User blocked access | Show browser permission instructions |
| POSITION_UNAVAILABLE | GPS/WiFi unavailable | Advise to use GPS, move to open area |
| TIMEOUT | Request took > 10 seconds | Retry or use manual entry |

---

# 📝 Summary

## **Session Topics Covered:**

1. ✅ **Route Count:** 47 total endpoints
2. ✅ **Chat System:** Real-time messaging with ownership checks
3. ✅ **Mapbox:** Forward/Reverse geocoding for location services
4. ✅ **Authentication:** isLoggedIn, isOwner, isAdmin middleware
5. ✅ **Authorization:** Role-based access control with admin override
6. ✅ **Database Relations:** 5 types with examples
7. ✅ **Cloudinary:** Cloud image storage with Multer integration
8. ✅ **Geolocation:** Browser location API with Mapbox reverse geocoding

---

**Document Created:** 2026-05-05  
**Last Updated:** 2026-05-05  
**Version:** 1.0  
**Status:** Complete Session Summary
