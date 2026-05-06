# 🏗️ WANDERLUST - COMPLETE TECHNICAL DOCUMENTATION

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Tech Stack](#tech-stack)
3. [Feature: User Authentication & Profiles](#feature-user-authentication--profiles)
4. [Feature: Listings Management](#feature-listings-management)
5. [Feature: Bookings System](#feature-bookings-system)
6. [Feature: Chat System](#feature-chat-system)
7. [Feature: Payment System](#feature-payment-system)
8. [Feature: Reviews System](#feature-reviews-system)
9. [Feature: Recommendation Bot](#feature-recommendation-bot)
10. [Feature: Admin Dashboard](#feature-admin-dashboard)
11. [Database Models](#database-models)
12. [Middleware & Security](#middleware--security)

---

## Architecture Overview

**Architecture Type:** MERN Stack (Monolithic Backend + Frontend)

### Request Flow:
```
Frontend (EJS Templates) 
    ↓
Express Routes (/routes/*.js)
    ↓
Controllers (/controllers/*.js)
    ↓
MongoDB Models (/models/*.js)
    ↓
MongoDB Database
```

### Main Entry Point: `app.js`
- Port: 10000 (configurable via ENV)
- Session Management: MongoDB with connect-mongo
- Authentication: Passport.js with LocalStrategy

---

## Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Backend** | Node.js + Express.js | Server & API |
| **Frontend** | EJS Templates | Server-side rendering |
| **Database** | MongoDB + Mongoose | Data persistence |
| **Authentication** | Passport.js (LocalStrategy) | User authentication |
| **File Upload** | Multer + Cloudinary | Image storage |
| **Maps** | Mapbox SDK | Geocoding & location |
| **Email** | Brevo REST API | Email notifications |
| **QR Code** | qrcode (npm) | UPI QR generation |
| **Session** | express-session + MongoDB Store | Session persistence |
| **Validation** | Joi Schema | Data validation |
| **Unique ID** | uuid (v4) | Session ID generation |
| **Styling** | Bootstrap | UI Framework |

---

## Feature: User Authentication & Profiles

### Overview
Complete user authentication system with profile management, including mobile numbers, UPI IDs, and profile photos.

### How It Works:

#### 1. **Signup Process**
**Route:** `POST /users/signup`  
**Controller:** `controllers/users.js` → `signup()`  
**Code Reference:** users.js:12-30

**Flow:**
1. User submits username, email, password
2. Passport-Mongoose creates user with hashed password
3. Automatic login after signup
4. Redirect to `/listings`

**Tech Used:**
- `passport-local-mongoose`: Password hashing (salting + bcrypt)
- `express-session`: Session creation
- Mongoose middleware: `User.register()`

**Key Code:**
```javascript
const newUser = new User({ email, username });
const registeredUser = await User.register(newUser, password);
req.login(registeredUser, (err) => { ... });
```

#### 2. **Login Process**
**Route:** `POST /users/login`  
**Middleware:** `passport.authenticate("local")`  
**Code Reference:** routes/user.js:18-27

**Flow:**
1. Passport validates credentials against stored hash
2. Session created in MongoDB
3. User object stored in `req.user`
4. Redirected to original URL or `/listings`

**Tech Used:**
- `passport-local`: Credential verification
- `connect-mongo`: Session storage
- Passport session serialization

**Key Code:**
```javascript
passport.authenticate("local", { 
  failureRedirect: '/login', 
  failureFlash: true
})
```

#### 3. **User Profiles**
**Routes:**
- `GET /users/profile` - View own profile
- `GET /users/profile/edit` - Edit form
- `POST /users/profile/edit` - Update profile
- `GET /users/view/:userId` - View other profiles

**Controller:** `controllers/userProfiles.js`

**Profile Fields:**
- Mobile Number (10 digits validation)
- Bio (text)
- Address (text)
- UPI ID (validation: `name@bank` format)
- Profile Photo (image upload)

**Tech Used:**
- Multer: Image file handling
- Cloudinary: Image storage & optimization
- Joi Schema: Validation

**Update Logic:**
```javascript
// Mobile validation: 10 digits only
if (mobileNumber && !/^\d{10}$/.test(mobileNumber.replace(/\D/g, '')))

// UPI validation: name@bank format
if (upiId && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiId))
```

#### 4. **User Deletion (Admin)**
**Route:** `DELETE /users/admin/users/:id`  
**Code Reference:** controllers/users.js:61-92

**Cascade Delete:**
```
User Deleted
    ├── User's Listings Deleted
    │   └── Bookings for those listings Deleted
    ├── User's Bookings (as customer) Deleted
    ├── User's Reviews Deleted
    └── User document removed from DB
```

---

## Feature: Listings Management

### Overview
Create, read, update, delete (CRUD) operations for property listings with image hosting, geocoding, and category filtering.

### How It Works:

#### 1. **Create Listing**
**Route:** `POST /listings`  
**Controller:** `controllers/listings.js` → `createListing()`  
**Code Reference:** listings.js:56-84

**Process:**
1. User uploads image → Multer saves to Cloudinary
2. Location text → Mapbox Geocoding API converts to coordinates
3. Listing document created with:
   - Title, description, price, location
   - Owner ID (current user)
   - Image URL & filename
   - Geometry (lat/long from Mapbox)
   - availableGuests = maxGuests (booking management)

**Tech Used:**
```javascript
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
}).send();
// response.body.features[0].geometry contains coordinates
```

**Image Upload Flow:**
```
User selects file
    ↓
Multer processes with Cloudinary storage
    ↓
File stored in Cloudinary
    ↓
URL saved: listing.image = { url, filename }
```

#### 2. **List All Listings with Filters**
**Route:** `GET /listings`  
**Code Reference:** listings.js:8-29

**Filters Available:**
```javascript
// By Category
filter.category = category  // "Trending", "Beach House", etc.

// Trending (2+ bookings)
filter.bookingCount = { $gte: 2 }

// Search by Country
filter.country = { $regex: search, $options: 'i' }  // Case-insensitive
```

**Query:**
```javascript
const allListings = await Listing.find(filter);
```

#### 3. **Show Single Listing**
**Route:** `GET /listings/:id`  
**Code Reference:** listings.js:37-53

**Data Populated:**
```javascript
const listing = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate: { path: "author" }  // Nested populate for author details
  })
  .populate("owner");
```

**Renders:**
- Listing details (title, description, price, location)
- Owner information (username, profile)
- All reviews with author names
- Booking form for guests

#### 4. **Update Listing**
**Route:** `PUT /listings/:id`  
**Middleware:** `isLoggedIn`, `isOwner`, `validateListing`  
**Code Reference:** listings.js:102-138

**Update Logic:**
1. Re-geocode location if changed (new coordinates)
2. Handle maxGuests changes:
   ```javascript
   const newMax = parseInt(req.body.listing.maxGuests);
   const oldMax = listing.maxGuests;
   const bookedGuests = oldMax - listing.availableGuests;
   listing.maxGuests = newMax;
   listing.availableGuests = Math.max(0, newMax - bookedGuests);
   ```
3. Update image if new file uploaded
4. Save updated listing

#### 5. **Delete Listing**
**Route:** `DELETE /listings/:id`  
**Code Reference:** listings.js:141-147

Simply deletes listing (cascade handled elsewhere if needed)

#### 6. **Admin View - All Listings**
**Route:** `GET /listings/admin/all-listings`  
**Code Reference:** listings.js:150-172

**Features:**
- Filter by trending (bookingCount >= 2) or inactive (bookingCount = 0)
- Sorted by creation date (newest first)
- Populated with owner and reviews

---

## Feature: Bookings System

### Overview
Multi-role booking system with guest capacity management, confirmation workflow, and guest spot reservation.

### How It Works:

#### 1. **Create Booking (Customer)**
**Route:** `POST /bookings/listings/:id/book`  
**Code Reference:** controllers/bookings.js:22-93

**Booking Flow:**

Step 1: Validation
```javascript
// Check listing exists
if (!listing) { redirect("/listings") }

// Prevent owner self-booking
if (listing.owner._id.equals(req.user._id)) { 
  throw error "You cannot book your own listing"
}

// Validate guest count
if (guestCount > listing.availableGuests) { 
  throw error "Not enough spots"
}
```

Step 2: Date Validation
```javascript
const checkInDate = new Date(checkIn);
const checkOutDate = new Date(checkOut);
const today = new Date();

// Check-in must be today or future
if (checkInDate < today) throw error

// Check-out must be after check-in
if (checkOutDate <= checkInDate) throw error
```

Step 3: Price Calculation
```javascript
const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
const totalPrice = days * listing.price;
```

Step 4: Create Booking & Reserve Spots
```javascript
const newBooking = new Booking({
  listing: id,
  customer: req.user._id,
  checkIn, checkOut, guests: guestCount,
  totalPrice,
  status: "pending"  // Awaiting owner/admin confirmation
});

// IMMEDIATE: Reserve guest spots
listing.availableGuests = Math.max(0, listing.availableGuests - guestCount);
```

**Database State:**
```
Booking.status = "pending"    // Awaiting approval
Listing.availableGuests --    // Spots reserved immediately
Payment.status = "unpaid"     // Payment pending
```

#### 2. **View My Bookings (Customer)**
**Route:** `GET /bookings/my-bookings`  
**Code Reference:** controllers/bookings.js:96-101

```javascript
const bookings = await Booking.find({ customer: req.user._id })
  .populate("listing")
  .sort({ createdAt: -1 });
```

#### 3. **Owner Manage Bookings**
**Route:** `GET /bookings/manage`  
**Code Reference:** controllers/bookings.js:284-355

**Process:**
1. Find all listings owned by current user
2. Find all bookings for those listings
3. Filter out invalid bookings (deleted listing/customer)
4. Display with status tabs (pending, confirmed, rejected)

**Key Code:**
```javascript
const ownerListings = await Listing.find({ owner: req.user._id });
const listingIds = ownerListings.map(listing => listing._id);

let bookings = await Booking.find({ listing: { $in: listingIds } })
  .populate("listing")
  .populate("customer")
  .sort({ createdAt: -1 });
```

#### 4. **Owner Confirm/Reject Booking**
**Routes:**
- `POST /bookings/:id/owner-confirm`
- `POST /bookings/:id/owner-reject`

**Confirm Logic:**
```javascript
// Update status
await Booking.findByIdAndUpdate(id, { status: "confirmed" });

// Increment booking count (for trending logic)
listing.bookingCount = (listing.bookingCount || 0) + 1;

// Send confirmation email
await sendBookingConfirmation({
  to: booking.customer.email,
  username: booking.customer.username,
  listing: booking.listing,
  booking: booking,
  paid: booking.paymentStatus === 'completed'
});
```

**Reject Logic:**
```javascript
// Restore guest spots if still pending
if (booking.status === "pending") {
  listing.availableGuests = Math.min(
    listing.maxGuests, 
    listing.availableGuests + booking.guests
  );
  await listing.save();
}

await Booking.findByIdAndUpdate(id, { status: "rejected" });
```

#### 5. **Admin: All Bookings**
**Route:** `GET /bookings/admin/bookings`  
**Code Reference:** controllers/bookings.js:104-171

**Features:**
- View all bookings (all users, all listings)
- Filter valid vs invalid bookings
- Console logging for debugging
- Confirm/Reject/Delete capabilities

**Booking States:**
```javascript
status: "pending" | "confirmed" | "rejected"
paymentStatus: "unpaid" | "completed"
paymentMethod: "upi" | "cash" | "pending"
```

#### 6. **Cancel Booking (Customer)**
**Route:** `DELETE /bookings/:id`  
**Code Reference:** controllers/bookings.js:265-281

```javascript
// Restore guest spots
if (booking && (booking.status === "pending" || booking.status === "confirmed")) {
  listing.availableGuests = Math.min(
    listing.maxGuests, 
    listing.availableGuests + booking.guests
  );
}

// Delete booking
await Booking.findByIdAndDelete(id);
```

### Guest Capacity Management
**Key Concept:** availableGuests decreases when booking created, increases when booking cancelled/rejected

```javascript
Listing.maxGuests = 4          // Total capacity
Listing.availableGuests = 2    // Currently available

User books 2 guests:
Listing.availableGuests = 0    // All booked (2 reserved by user)

User cancels:
Listing.availableGuests = 2    // Restored
```

---

## Feature: Chat System

### Overview
Real-time messaging between customers and listing owners for confirmed bookings only.

### How It Works:

#### 1. **Get/Create Chat**
**Route:** `GET /chat/booking/:bookingId`  
**Controller:** `controllers/chat.js` → `getChat()`  
**Code Reference:** chat.js:6-76

**Process:**

Step 1: Validate Access
```javascript
// Only customer or owner can access
const isCustomer = booking.customer._id.equals(req.user._id);
const isOwner = booking.listing.owner._id.equals(req.user._id);

if (!isCustomer && !isOwner && !req.user.isAdmin) {
  throw error "No permission"
}

// Only for confirmed bookings
if (booking.status !== "confirmed") {
  throw error "Chat only for confirmed bookings"
}
```

Step 2: Find or Create Chat
```javascript
let chat = await Chat.findOne({ booking: bookingId })
  .populate("participants")
  .populate("messages.sender");

if (!chat) {
  chat = new Chat({
    booking: bookingId,
    participants: [booking.customer._id, booking.listing.owner._id],
    messages: []
  });
  await chat.save();
}
```

Step 3: Mark Messages as Read
```javascript
// For current user, mark all messages from other participant as read
chat.messages.forEach(msg => {
  if (!msg.isRead && !msg.sender._id.equals(req.user._id)) {
    msg.isRead = true;
  }
});
```

#### 2. **Send Message**
**Route:** `POST /chat/booking/:bookingId/message`  
**Code Reference:** chat.js:79-145

**Process:**

Step 1: Validation
```javascript
if (!message || message.trim() === "") {
  return res.status(400).json({ error: "Message cannot be empty" })
}

// Verify user is participant
const isCustomer = booking.customer.equals(req.user._id);
const isOwner = booking.listing.owner.equals(req.user._id);

if (!isCustomer && !isOwner) {
  return res.status(403).json({ error: "No permission" })
}

// Only for confirmed bookings
if (booking.status !== "confirmed") {
  return res.status(403).json({ error: "Chat restricted" })
}
```

Step 2: Add Message to Chat
```javascript
let chat = await Chat.findOne({ booking: bookingId });

chat.messages.push({
  sender: req.user._id,
  content: message.trim(),
  timestamp: new Date(),
  isRead: false
});

chat.lastMessage = new Date();
await chat.save();
```

Step 3: Return JSON Response
```javascript
res.json({
  success: true,
  message: {
    id: newMessage._id,
    sender: { id: newMessage.sender._id, username: ... },
    content: newMessage.content,
    timestamp: newMessage.timestamp
  }
});
```

#### 3. **Get Unread Count**
**Route:** `GET /chat/unread-count`  
**Code Reference:** chat.js:148-161

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

### Chat Database Schema
```javascript
Chat Document:
{
  booking: ObjectId,                    // Unique per booking
  participants: [ObjectId, ObjectId],   // [customer, owner]
  messages: [
    {
      sender: ObjectId,
      content: String,
      timestamp: Date,
      isRead: Boolean
    }
  ],
  lastMessage: Date
}
```

**Tech Used:**
- Socket.io Alternative: REST API calls (not real-time WebSocket)
- Message persistence: MongoDB embedded array
- Read status: Boolean flag per message

---

## Feature: Payment System

### Overview
Payment processing with two methods: UPI (with QR code) and Cash on Arrival.

### How It Works:

#### 1. **Render Payment Form**
**Route:** `GET /payments/booking/:bookingId`  
**Code Reference:** controllers/payments.js:9-37

**Validation:**
```javascript
// Only customer can pay for their booking
if (!booking.customer._id.equals(req.user._id)) {
  throw error "Can only pay for own bookings"
}

// Payment only after booking confirmed
if (booking.status !== "confirmed") {
  throw error "Booking must be confirmed first"
}
```

**Data Passed:**
- Booking details (checkIn, checkOut, guests, totalPrice)
- Listing owner's UPI ID (for payment)
- Customer info

#### 2. **Process Payment - Cash on Arrival**
**Route:** `POST /payments/booking/:bookingId/process`  
**Code Reference:** controllers/payments.js:149-217

**Flow:**
```javascript
if (paymentMethod === "cash") {
  // Create payment record
  const payment = new Payment({
    booking: bookingId,
    customer: req.user._id,
    amount: booking.totalPrice,
    paymentMethod: "cash",
    status: "pending"  // Pending until arrival
  });

  // Generate unique transaction ID
  payment.transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

  // Update booking
  booking.paymentStatus = "unpaid";
  booking.paymentMethod = "cash";

  // Send email receipt
  await sendPaymentReceipt({
    to: booking.customer.email,
    booking: booking,
    listing: booking.listing
  });

  // Redirect to success page
  res.redirect(`/payments/success/${bookingId}`);
}
```

#### 3. **Process Payment - UPI**
**Route:** `POST /payments/booking/:bookingId/process` (redirects)  
**Then:** `GET /payments/upi-scanner/:bookingId`  
**Code Reference:** controllers/payments.js:40-74

**UPI String Format:**
```javascript
const upiString = `upi://pay?receiver=${listingOwner.upiId}&amount=${booking.totalPrice}&tr=Wanderlust Booking`;
```

**QR Code Generation:**
```javascript
import QRCode from 'qrcode';

const qrCode = await QRCode.toDataURL(upiString);
// Returns data URL: "data:image/png;base64,..."
```

**Tech Used:**
- qrcode npm package
- Canvas/DOM for QR rendering
- UPI protocol linking

#### 4. **Complete UPI Payment**
**Route:** `POST /payments/upi-scanner/:bookingId/complete`  
**Code Reference:** controllers/payments.js:77-146

**Process:**
```javascript
// Create payment record with completed status
const payment = new Payment({
  booking: bookingId,
  customer: req.user._id,
  amount: booking.totalPrice,
  paymentMethod: "upi",
  status: "completed"  // Immediate confirmation
});

// Store transaction details
payment.transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
payment.completedAt = new Date();
payment.upiId = listingOwner.upiId;
payment.qrCode = qrCodeDataUrl;

// Update booking
booking.paymentStatus = "completed";
booking.paymentMethod = "upi";

// Send receipt email
await sendPaymentReceipt({
  to: booking.customer.email,
  username: booking.customer.username,
  booking: booking,
  listing: booking.listing
});
```

#### 5. **Payment Success Page**
**Route:** `GET /payments/success/:bookingId`  
**Code Reference:** controllers/payments.js:220-235

**Data Retrieved:**
- Booking details
- Payment record (if exists)
- Shows payment status and method

#### 6. **Payment History (Customer)**
**Route:** `GET /payments/history`  
**Code Reference:** controllers/payments.js:238-244

```javascript
const payments = await Payment.find({ customer: req.user._id })
  .populate("booking")
  .sort({ createdAt: -1 });
```

**Displays:**
- All payments made by user
- Transaction IDs, amounts, methods
- Associated bookings

#### 7. **Admin: View All Payments**
**Route:** `GET /payments/admin/payments`  
**Code Reference:** controllers/payments.js:247-268

**Statistics Calculated:**
```javascript
const stats = {
  totalAmount: sum of all payments,
  completedPayments: count,
  upiPayments: count by method,
  cashPayments: count by method
};
```

### Payment Database Schema
```javascript
Payment Document:
{
  booking: ObjectId,
  customer: ObjectId,
  amount: Number,
  paymentMethod: "upi" | "cash",
  status: "completed" | "pending",
  transactionId: String (unique),
  upiId: String (UPI ID of receiver),
  qrCode: String (Data URL),
  completedAt: Date,
  createdAt: Date
}
```

---

## Feature: Reviews System

### Overview
User reviews for listings with author tracking and deletion.

### How It Works:

#### 1. **Create Review**
**Route:** `POST /listings/:id/reviews`  
**Controller:** `controllers/reviews.js` → `createReview()`  
**Code Reference:** reviews.js:5-30

**Process:**
```javascript
// Verify logged in
if (!req.user || !req.user._id) {
  throw error "Must be logged in"
}

// Create review
let newReview = new Review(req.body.review);
newReview.author = req.user._id;

// Add to listing's reviews array
let listing = await Listing.findById(req.params.id);
listing.reviews.push(newReview);

// Save both
await newReview.save();
await listing.save();
```

**Fields in Review:**
```javascript
{
  author: ObjectId,     // User who wrote it
  rating: Number (1-5), // Star rating
  comment: String,      // Text review
  createdAt: Date
}
```

#### 2. **Display Reviews**
**Route:** `GET /listings/:id` (show listing)  
**Code Reference:** controllers/listings.js:37-53

**Nested Population:**
```javascript
const listing = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate: {
      path: "author"  // Get author details for each review
    }
  })
  .populate("owner");
```

**Data Available:**
- Author username, profile photo
- Review rating and comment
- Created date

#### 3. **Delete Review**
**Route:** `DELETE /listings/:id/reviews/:reviewId`  
**Middleware:** `isLoggedIn`, `isReviewAuthor`  
**Code Reference:** reviews.js:33-40

**Process:**
```javascript
// Remove review reference from listing
await Listing.findByIdAndUpdate(id, { 
  $pull: { reviews: reviewId } 
});

// Delete review document
await Review.findByIdAndDelete(reviewId);
```

### Review Validation
**Tech Used:** Joi Schema (defined in schema.js)

```javascript
reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required()
  }).required()
});
```

---

## Feature: Recommendation Bot

### Overview
AI-like recommendation system using rule-based intent detection and filtering.

### How It Works:

#### 1. **Intent Detection**
**Code Reference:** controllers/recommendationBot.js:6-49

**Intent Types:**
```javascript
'greeting'   // "hi", "hello", "hey"
'price'      // Budget info: "under 5000", "3000-8000"
'guests'     // "2 people", "for 4"
'location'   // "in Mumbai", "Delhi", place names
'recommend'  // "show", "find", "search"
'restart'    // Start conversation over
'unknown'    // Fallback
```

**Intent Detection Rules:**
```javascript
// Price patterns
/(price|cost|budget|cheap|expensive|affordablebudget|₹|rs)/i
// OR just a number: /^\d+$/

// Guests patterns (word boundaries)
/\b(guest|people|person|persons|travelers|family|group)\b/i

// Location patterns
locationKeywords = ['in', 'at', 'near', 'location', 'place', 'city', 'country', 'area'];
knownLocations = ['mumbai', 'delhi', 'goa', 'kashmir', 'bali', 'london', ...];
```

#### 2. **Extract Information from Message**
**Code Reference:** controllers/recommendationBot.js:51-134

**Extract Location:**
```javascript
function extractLocation(message) {
  // Pattern: "in Mumbai" → "Mumbai"
  const match = message.match(/(?:in|at|near)\s+([a-z\s,]+)/i);
  if (match) return match[1].trim();
  
  // Or just words > 2 chars
  const words = message.split(' ').filter(w => w.length > 2);
  return words.join(' ');
}
```

**Extract Price Range:**
```javascript
// "under 5000" → { min: 0, max: 5000 }
const underMatch = lowerMsg.match(/(?:under|below|less than|max|maximum)\s*₹?\s*(\d+)/);

// "3000 to 8000" → { min: 3000, max: 8000 }
const betweenMatch = lowerMsg.match(/(?:between|from)\s*₹?\s*(\d+)\s*(?:and|to|-)\s*₹?\s*(\d+)/);
```

**Extract Guest Count:**
```javascript
// Extract first number: "2 people" → 2
const match = message.match(/(\d+)/);

// Or word numbers: "three guests" → 3
const wordNumbers = {'one': 1, 'two': 2, 'three': 3, ...};
```

#### 3. **Generate Response Based on Context**
**Code Reference:** controllers/recommendationBot.js:137-300

**Conversation Context Stored:**
```javascript
context: {
  step: 'greeting' | 'location' | 'price' | 'guests' | 'ready',
  location: String,
  minPrice: Number,
  maxPrice: Number,
  guests: Number
}
```

**Example Flow:**
```
User: "Show properties in Mumbai"
  ↓
Intent: 'location'
Extract: location = "Mumbai"
Response: "Great! Looking for properties in Mumbai. What's your budget?"
Update: context.step = 'price'

User: "under 5000"
  ↓
Intent: 'price'
Extract: priceRange = { min: 0, max: 5000 }
Location exists: Search with both filters!
Response: "Here are my top recommendations: 🎯"
Recommendations: [found listings]
```

#### 4. **Find Recommendations**
**Code Reference:** controllers/recommendationBot.js:303-336

**MongoDB Query:**
```javascript
let query = {};

// Location search (regex in location, country, or title)
if (context.location) {
  query.$or = [
    { location: new RegExp(context.location, 'i') },
    { country: new RegExp(context.location, 'i') },
    { title: new RegExp(context.location, 'i') }
  ];
}

// Price range filter
if (context.minPrice !== undefined || context.maxPrice !== undefined) {
  query.price = {};
  if (context.minPrice !== undefined) query.price.$gte = context.minPrice;
  if (context.maxPrice !== undefined) query.price.$lte = context.maxPrice;
}

const listings = await Listing.find(query)
  .populate('owner', 'username')
  .limit(5)
  .sort({ price: 1 })  // Cheapest first
  .lean();
```

#### 5. **Chat Endpoint**
**Route:** `POST /bot/chat`  
**Code Reference:** controllers/recommendationBot.js:339-476

**Request:**
```javascript
{
  message: "String to process",
  sessionId: "UUID (optional - generated if not provided)"
}
```

**Response:**
```javascript
{
  success: true,
  sessionId: "UUID",
  botMessage: "Bot's response text",
  recommendations: [
    {
      id: ObjectId,
      title: String,
      location: String,
      country: String,
      price: Number,
      image: String (URL),
      owner: String (username)
    }
  ],
  context: { step, location, minPrice, maxPrice, guests }
}
```

#### 6. **Conversation History**
**Route:** `GET /bot/history/:sessionId`  
**Code Reference:** controllers/recommendationBot.js:479-503

```javascript
// Returns all messages in conversation
const conversation = await BotConversation.findOne({ sessionId });
res.json({
  success: true,
  messages: [
    { sender: 'user', message: String, timestamp: Date },
    { sender: 'bot', message: String, timestamp: Date },
    ...
  ],
  context: { ... }
});
```

#### 7. **Reset Conversation**
**Route:** `POST /bot/reset`  
**Code Reference:** controllers/recommendationBot.js:506-526

```javascript
// Delete old conversation
if (sessionId) {
  await BotConversation.findOneAndDelete({ sessionId });
}

// Generate new sessionId
const newSessionId = uuidv4();

res.json({
  success: true,
  sessionId: newSessionId,
  message: "Conversation reset successfully"
});
```

### Bot Database Schema
```javascript
BotConversation Document:
{
  sessionId: String (UUID),
  user: ObjectId (optional),
  messages: [
    {
      sender: 'user' | 'bot',
      message: String,
      timestamp: Date
    }
  ],
  context: {
    step: String,
    location: String,
    minPrice: Number,
    maxPrice: Number,
    guests: Number
  },
  lastActivity: Date
}
```

---

## Feature: Admin Dashboard

### Overview
Admin functions to manage users, listings, bookings, and payments.

### Admin Features:

#### 1. **Admin User Management**
**Route:** `GET /users/admin/users`  
**Code:** controllers/users.js:55-58

```javascript
const users = await User.find({});
// Display all users with delete option
```

**Delete User:**
**Route:** `DELETE /users/admin/users/:id`  
**Code:** controllers/users.js:61-92

**Cascading Delete:**
```
LAPU (admin) ↛ Cannot delete admin account

Regular User Deletion:
  ├── Get all listings by user
  │   └── Delete all bookings for those listings
  ├── Delete all user's listings
  ├── Delete all user's bookings (as customer)
  ├── Delete all user's reviews
  └── Delete user document
```

#### 2. **Admin Listing Management**
**Route:** `GET /listings/admin/all-listings`  
**Code:** controllers/listings.js:150-172

**Filters:**
```javascript
// By status
status = 'trending'   // bookingCount >= 2
status = 'inactive'   // bookingCount = 0
status = undefined    // All listings
```

#### 3. **Admin Booking Management**
**Route:** `GET /bookings/admin/bookings`  
**Code:** controllers/bookings.js:104-171

**Features:**
- View all bookings (all users)
- Identify invalid bookings (deleted listing/customer)
- Confirm bookings (→ "confirmed", send email)
- Reject bookings (→ "rejected", restore spots)
- Delete bookings (remove from DB, restore spots)

#### 4. **Admin Payment Management**
**Route:** `GET /payments/admin/payments`  
**Code:** controllers/payments.js:247-268

**Statistics:**
```javascript
{
  totalAmount: sum,
  completedPayments: count,
  upiPayments: count,
  cashPayments: count
}
```

### Admin Middleware
**Code Reference:** middleware.js:46-53

```javascript
module.exports.isAdmin = (req, res, next) => {
  if (!req.isAuthenticated() || !req.user.isAdmin) {
    req.flash("error", "Admin access required");
    return res.redirect("/listings");
  }
  next();
};
```

**User Creation (in app.js):**
```javascript
// Admin user "LAPU" created on app startup
const adminUser = new User({
  email: "admin@wanderlust.com",
  username: "LAPU",
  isAdmin: true
});
await User.register(adminUser, "LAPU");
```

---

## Database Models

### 1. User Model
**File:** models/user.js

```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed, via passport-local-mongoose),
  isAdmin: Boolean (default: false),
  mobileNumber: String,
  bio: String,
  address: String,
  upiId: String,
  profilePhoto: {
    url: String,
    filename: String
  },
  createdAt: Date (default: now)
}
```

**Methods (from passport-local-mongoose):**
- `User.register(user, password)` - Hash password & save
- `User.authenticate()` - Validate credentials

### 2. Listing Model
**File:** models/listing.js

```javascript
{
  title: String,
  description: String,
  image: {
    url: String (Cloudinary URL),
    filename: String
  },
  price: Number (per night),
  location: String,
  country: String,
  category: String,
  owner: ObjectId (ref: User),
  reviews: [ObjectId] (ref: Review),
  geometry: {
    type: Point,
    coordinates: [longitude, latitude]  // Mapbox format
  },
  maxGuests: Number,
  availableGuests: Number (remaining slots),
  bookingCount: Number (for trending calculation),
  createdAt: Date
}
```

### 3. Booking Model
**File:** models/booking.js

```javascript
{
  listing: ObjectId (ref: Listing),
  customer: ObjectId (ref: User),
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  totalPrice: Number,
  status: "pending" | "confirmed" | "rejected",
  paymentStatus: "unpaid" | "completed",
  paymentMethod: "upi" | "cash" | "pending",
  createdAt: Date
}
```

### 4. Payment Model
**File:** models/payment.js

```javascript
{
  booking: ObjectId (ref: Booking),
  customer: ObjectId (ref: User),
  amount: Number,
  paymentMethod: "upi" | "cash",
  status: "completed" | "pending",
  transactionId: String (unique),
  upiId: String,
  qrCode: String (Data URL),
  completedAt: Date,
  createdAt: Date
}
```

### 5. Review Model
**File:** models/review.js

```javascript
{
  rating: Number (1-5),
  comment: String,
  author: ObjectId (ref: User),
  createdAt: Date
}
```

### 6. Chat Model
**File:** models/chat.js

```javascript
{
  booking: ObjectId (ref: Booking, unique),
  participants: [ObjectId] (ref: User),
  messages: [
    {
      sender: ObjectId (ref: User),
      content: String,
      timestamp: Date,
      isRead: Boolean
    }
  ],
  lastMessage: Date
}
```

### 7. BotConversation Model
**File:** models/botConversation.js

```javascript
{
  sessionId: String (UUID, unique),
  user: ObjectId (ref: User, optional),
  messages: [
    {
      sender: 'user' | 'bot',
      message: String,
      timestamp: Date
    }
  ],
  context: Object,
  lastActivity: Date
}
```

---

## Middleware & Security

### Authentication Middleware
**File:** middleware.js:7-15

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

**Redirect URL Saving:**
```javascript
// Save original URL before login
req.session.redirectUrl = req.originalUrl;

// After login, redirect to original URL
res.redirect(res.locals.redirectUrl || "/listings");
```

### Authorization Middleware

#### isOwner (for Listings)
**Code:** middleware.js:25-44

```javascript
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  // Allow admin to edit any listing
  if (res.locals.currUser && res.locals.currUser.isAdmin) {
    return next();
  }

  // Check ownership
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
```

#### isReviewAuthor
**Code:** middleware.js:86-105

```javascript
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);

  // Admin can delete any review
  if (res.locals.currUser && res.locals.currUser.isAdmin) {
    return next();
  }

  // Check authorship
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
```

#### isBookingCustomer
**Code:** middleware.js:108-128

```javascript
// Customer can only cancel their own bookings
module.exports.isBookingCustomer = async (req, res, next) => {
  let { id } = req.params;
  let booking = await Booking.findById(id);

  // Admin override
  if (res.locals.currUser && res.locals.currUser.isAdmin) {
    return next();
  }

  if (!booking.customer.equals(res.locals.currUser._id)) {
    req.flash("error", "Not authorized");
    return res.redirect("/bookings/my-bookings");
  }
  next();
};
```

#### isListingOwner
**Code:** middleware.js:131-151

```javascript
// Owner can only manage bookings for their listings
module.exports.isListingOwner = async (req, res, next) => {
  let { id } = req.params;
  let booking = await Booking.findById(id).populate("listing");

  if (res.locals.currUser && res.locals.currUser.isAdmin) {
    return next();
  }

  if (!booking.listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "Not authorized");
    return res.redirect("/bookings/manage");
  }
  next();
};
```

### Data Validation Middleware

**Listing Validation:**
```javascript
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(detail => detail.message).join(", ");
    throw new ExpressError(400, msg);
  }
  next();
};
```

**Review Validation:**
```javascript
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    const err = new Error(msg);
    err.statusCode = 400;
    next(err);
  } else {
    next();
  }
};
```

**Profile Validation:**
```javascript
module.exports.validateProfile = (req, res, next) => {
  let { error } = profileSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(detail => detail.message).join(", ");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};
```

### Session Management
**Code:** app.js:45-52

```javascript
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600  // Lazy session update
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true  // Prevent XSS
  }
};
```

### Global Middleware
**Code:** app.js:97-131

```javascript
// Flash messages
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Booking management availability
app.use(async (req, res, next) => {
  res.locals.currUser = req.user;
  
  if (req.user) {
    const ownerListings = await Listing.find({ owner: req.user._id });
    res.locals.hasListings = ownerListings.length > 0;
    
    const hasBookingsToManage = await Booking.countDocuments({ 
      listing: { $in: listingIds },
      status: "pending"
    });
    res.locals.hasBookingsToManage = hasBookingsToManage > 0;
  }
  next();
});
```

### Error Handling
**Code:** app.js:190-195

```javascript
app.use((err, req, res, next) => {
  let { statusCode = 400, message = "Something went wrong" } = err;
  console.log("Error:", err.message);
  res.status(statusCode).render("err.ejs", { err });
});
```

---

## 🔐 Security Features

| Feature | Implementation | Benefit |
|---------|----------------|---------|
| **Password Hashing** | passport-local-mongoose (bcrypt) | Passwords never stored in plain text |
| **Session Tokens** | express-session + MongoDB | Secure session tracking |
| **CSRF Protection** | (implicit in form submissions) | Prevents cross-site attacks |
| **Input Validation** | Joi Schema | Prevents invalid/malicious data |
| **Authorization** | Middleware checks (isOwner, isAdmin) | Users can't access others' data |
| **HTTPOnly Cookies** | httpOnly: true in session config | Prevents XSS attacks |
| **Admin Override** | isAdmin checks in authorization | Admin can manage all resources |
| **Booking Validation** | Date checks, capacity validation | Prevents overbooking |
| **Payment Authorization** | Customer ID verification | Only own payments can be made |

---

## 📊 Data Flow Diagrams

### Booking Workflow
```
Customer Creates Booking
├── Validate dates & capacity
├── Reserve guest spots (availableGuests --)
├── Set booking.status = "pending"
└── Redirect to my-bookings

Owner Reviews Booking
├── View all bookings for their listings
├── Confirm / Reject
│   ├── Confirm: 
│   │   ├── booking.status = "confirmed"
│   │   ├── Send email
│   │   └── Now eligible for chat & payment
│   └── Reject:
│       ├── booking.status = "rejected"
│       └── Restore guest spots

Customer Pays
├── Confirm booking first
├── Choose payment method
├── UPI: Generate QR → Scan → Complete
└── Cash: Mark as pending, pay on arrival

Chat Available
└── Only after booking confirmed
    ├── Between customer & owner
    └── Track read/unread messages
```

### Recommendation Bot Flow
```
User Message
    ↓
Detect Intent
    ├── Greeting → Explain capabilities
    ├── Location → Extract location name
    ├── Price → Extract price range
    ├── Guests → Extract guest count
    ├── Recommend → Search with current filters
    └── Restart → Reset context
    ↓
Update Context (save preferences)
    ↓
Search Database if enough filters
    ↓
Generate Response
    ├── If no matches: suggest alternatives
    └── If matches: return listings
    ↓
Save to BotConversation history
    ↓
Return JSON response
```

---

## 📞 API Response Examples

### Chat Send Message
```json
POST /chat/booking/123/message
Body: { message: "Hi, can we discuss timing?" }

Response:
{
  "success": true,
  "message": {
    "id": "msg_id",
    "sender": {
      "id": "user_id",
      "username": "john_doe"
    },
    "content": "Hi, can we discuss timing?",
    "timestamp": "2024-05-05T10:30:00Z"
  }
}
```

### Bot Chat
```json
POST /bot/chat
Body: {
  "message": "Show me properties under 5000 in Mumbai",
  "sessionId": "uuid-1234"
}

Response:
{
  "success": true,
  "sessionId": "uuid-1234",
  "botMessage": "Here are my top recommendations: 🎯",
  "recommendations": [
    {
      "id": "listing_id",
      "title": "Luxury Beach House",
      "location": "Juhu",
      "country": "India",
      "price": 4500,
      "image": "https://...",
      "owner": "mumbai_host"
    }
  ],
  "context": {
    "step": "ready",
    "location": "Mumbai",
    "minPrice": 0,
    "maxPrice": 5000,
    "guests": null
  }
}
```

### Payment Success
```json
GET /payments/success/booking_id

Renders:
- Booking details (check-in, check-out, guests, price)
- Payment confirmation (method, transaction ID)
- Next steps (chat with host, download receipt)
```

---

## 🚀 Performance Optimizations

| Optimization | Implementation |
|--------------|-----------------|
| **Image Optimization** | Cloudinary with height parameter: `/upload/h_300` |
| **Database Indexing** | Chat participants indexed for faster queries |
| **Lean Queries** | Bot recommendations use `.lean()` (read-only) |
| **Population Limits** | Only populate needed fields in queries |
| **Session Timeout** | 7 days configured in sessionOptions |
| **Lazy Session Update** | touchAfter: 24 hours prevents constant DB writes |

---

## 🔧 Environment Variables Required

```env
PORT=10000
ATLASDB_URL=mongodb+srv://...
SECRET=your_secret_key
MAP_TOKEN=your_mapbox_token
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
BREVO_API_KEY=your_brevo_key (for emails)
NODE_ENV=production|development
```

---

## 📝 Summary

**Wanderlust** is a full-featured MERN vacation rental platform with:

✅ Complete user authentication & profiles  
✅ Property listing management with geocoding  
✅ Multi-role booking system with capacity management  
✅ Real-time chat between customers & owners  
✅ Flexible payment methods (UPI + Cash)  
✅ Review & rating system  
✅ AI-like recommendation bot  
✅ Admin dashboard for system management  
✅ Email notifications for bookings & payments  
✅ Security through middleware & validation  

**Key Technologies:** Node.js, Express, MongoDB, Mongoose, Passport.js, Mapbox, Cloudinary, Brevo

---

**Document Created:** 2026-05-05  
**Last Updated:** 2026-05-05  
**Version:** 1.0
