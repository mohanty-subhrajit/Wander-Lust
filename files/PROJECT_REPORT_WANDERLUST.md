# WANDERLUST: A Complete MERN Stack Project Report
## Air-Bnb Like Web Application for Property Rentals

---

## TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [Project Objectives](#project-objectives)
4. [Why We Created This Project](#why-we-created-this-project)
5. [Technology Stack](#technology-stack)
6. [System Architecture](#system-architecture)
7. [Database Design and Schema](#database-design-and-schema)
8. [Features and Technologies](#features-and-technologies)
9. [Project Workflow and Flow](#project-workflow-and-flow)
10. [Installation and Setup Guide](#installation-and-setup-guide)
11. [API Endpoints](#api-endpoints)
12. [Future Scope](#future-scope)
13. [Conclusion](#conclusion)

---

## 1. EXECUTIVE SUMMARY

**Project Name:** Wanderlust - A Complete Property Rental Platform  
**Project Type:** Full Stack MERN Application  
**Version:** 1.0.0  
**Node.js Version:** 22.19.0  
**License:** ISC  

Wanderlust is a comprehensive web application built using the MERN stack (MongoDB, Express.js, React, Node.js) that replicates the functionality of Airbnb. It is a complete platform for users to list, discover, book, and review properties worldwide. The application includes features like property listings with geolocation, real-time booking management, integrated payment systems (UPI & Cash), live chat between hosts and guests, intelligent property recommendation bot, and a comprehensive admin panel for system management.

---

## 2. PROJECT OVERVIEW

### 2.1 What is Wanderlust?

Wanderlust is a full-featured property rental and management platform that connects property owners (hosts) with travelers (guests) who are looking for unique accommodation options. Unlike traditional hotel booking systems, it allows individual property owners to list their homes, apartments, or any accommodation and earn money by renting them to guests.

### 2.2 Key Highlights

- **Multi-role System:** Support for guests, hosts, and administrators
- **Property Management:** Complete CRUD operations for listings
- **Booking System:** Full booking flow with status management
- **Payment Integration:** Dual payment methods (UPI & Cash)
- **Real-time Chat:** Live messaging between hosts and guests
- **AI Recommendation Bot:** Intelligent property suggestions based on user preferences
- **Review System:** Guests can rate and review properties
- **Admin Dashboard:** Complete admin panel to manage users, listings, bookings, and payments
- **Geolocation Services:** Map-based property discovery using Mapbox
- **Email Notifications:** Automated emails for bookings and payments
- **User Profiles:** Customizable user profiles with photo uploads
- **Search & Filter:** Search properties by location and filter by category

### 2.3 Current Status

The application is fully functional with all core features implemented, tested, and deployed ready. The system includes proper error handling, email integration, security measures, and comprehensive logging.

---

## 3. PROJECT OBJECTIVES

### 3.1 Primary Objectives

1. **Create a Complete Booking Platform:** Develop a platform where users can seamlessly book properties, similar to Airbnb
2. **Enable Property Management:** Allow property owners to list and manage their properties
3. **Implement Secure Transactions:** Integrate payment systems with proper validation and security
4. **Facilitate Communication:** Enable direct communication between hosts and guests
5. **Provide Data Insights:** Offer admins complete visibility into platform metrics

### 3.2 Secondary Objectives

1. Build a scalable architecture that can handle multiple concurrent users
2. Implement responsive design for mobile and desktop users
3. Create intelligent recommendation systems for better user experience
4. Establish proper security protocols for user data
5. Provide comprehensive admin tools for platform management

---

## 4. WHY WE CREATED THIS PROJECT

### 4.1 Real-World Problem

The property rental market lacks a comprehensive digital platform that connects hosts and guests efficiently. Traditional methods involve:
- Tedious communication processes
- Manual payment handling
- Lack of verified reviews
- No real-time booking management
- Limited property discovery tools

### 4.2 Solution Provided by Wanderlust

Wanderlust solves these problems by providing:

1. **Centralized Platform:** All properties in one place with advanced search
2. **Automated Booking:** Streamlined booking process with confirmation and payment
3. **Verified Reviews:** Guest reviews ensure property quality and host credibility
4. **Real-time Communication:** Live chat for instant host-guest interaction
5. **Digital Payments:** Secure payment processing with multiple options
6. **Smart Recommendations:** AI-powered bot suggests properties based on preferences
7. **Admin Control:** Complete management system for platform oversight

### 4.3 Learning Objectives

This project serves as an excellent learning platform for:
- Full stack web development using MERN
- Database design and optimization
- Authentication and authorization
- Payment gateway integration
- Real-time communication systems
- Cloud storage integration
- Email automation
- Geolocation services
- Admin dashboard development

---

## 5. TECHNOLOGY STACK

### 5.1 Frontend Technologies

The frontend is built using EJS (Embedded JavaScript Templating) with plain HTML, CSS, and JavaScript for server-side rendering.

#### Core Frontend Technologies:

| Technology | Purpose | Version |
|-----------|---------|---------|
| **EJS** | Template Engine for dynamic HTML rendering | 3.1.10 |
| **EJS-Mate** | Template inheritance and layouts | 4.0.0 |
| **Bootstrap** | Responsive UI Framework (via CDN) | Latest |
| **CSS3** | Custom styling for components | - |
| **JavaScript (Vanilla)** | Client-side interactions and AJAX calls | ES6+ |
| **Mapbox GL JS** | Interactive map rendering | SDK 0.16.2 |
| **QRCode.js** | QR code generation for UPI payments | 1.5.4 |

#### Frontend Features:
- Server-side rendering for better SEO
- Responsive design for all devices
- Interactive maps for location selection
- Real-time chat interface
- Dynamic form validation
- AJAX-based messaging

### 5.2 Backend Technologies

#### Runtime & Server:

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Node.js** | JavaScript runtime | 22.19.0 |
| **Express.js** | Web framework | 5.1.0 |
| **Express-Session** | Session management | 1.18.2 |
| **Connect-Flash** | Flash messages for notifications | 0.1.1 |
| **Method-Override** | HTTP method override | 3.0.0 |
| **Body-Parser** | Request body parsing | 2.2.0 |

#### Database:

| Technology | Purpose | Version |
|-----------|---------|---------|
| **MongoDB** | NoSQL database | Atlas Cloud |
| **Mongoose** | MongoDB ODM | 8.19.2 |
| **Connect-Mongo** | MongoDB session store | 5.1.0 |

#### Authentication & Authorization:

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Passport.js** | Authentication middleware | 0.7.0 |
| **Passport-Local** | Local strategy for authentication | 1.0.0 |
| **Passport-Local-Mongoose** | Mongoose plugin for Passport | 8.0.0 |

#### Data Validation:

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Joi** | Schema validation library | 18.0.1 |

#### Cloud Services:

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Cloudinary** | Cloud image storage & manipulation | 1.41.3 |
| **Multer** | File upload handling | 2.0.2 |
| **Multer-Storage-Cloudinary** | Cloudinary storage adapter for Multer | 4.0.0 |

#### Email Services:

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Nodemailer** | Email sending library | 8.0.5 |
| **Brevo (Sendinblue)** | Email service provider (Primary) | Via API |
| **Gmail SMTP** | Fallback email service | Via SMTP |

#### Mapping & Geolocation:

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Mapbox SDK** | Geolocation and geocoding | 0.16.2 |
| **Mapbox GL JS** | Interactive map display | Via CDN |

#### Utilities:

| Technology | Purpose | Version |
|-----------|---------|---------|
| **dotenv** | Environment variable management | 17.2.3 |
| **UUID** | Unique ID generation | 13.0.0 |
| **QRCode** | QR code generation for UPI | 1.5.4 |

### 5.3 Development Tools

| Tool | Purpose |
|------|---------|
| **npm** | Package manager |
| **Git** | Version control |
| **MongoDB Atlas** | Cloud database hosting |
| **Cloudinary** | Image hosting |
| **Postman** | API testing |
| **VS Code** | Code editor |
| **Brevo** | Email service |
| **Mapbox** | Geolocation services |

### 5.4 Environment Configuration

The project uses environment variables for configuration:

```
CLOUD_NAME=<Cloudinary cloud name>
CLOUD_API_KEY=<Cloudinary API key>
CLOUD_API_SECRET=<Cloudinary API secret>
MAP_TOKEN=<Mapbox API token>
ATLASDB_URL=<MongoDB Atlas connection string>
SECRET=<Session secret key>
PORT=8000
BREVO_API_KEY=<Brevo API key>
BREVO_SMTP_USER=<Brevo SMTP user>
BREVO_SMTP_PASSWORD=<Brevo SMTP password>
BREVO_FROM_EMAIL=<Sender email>
GMAIL_USER=<Gmail account>
GMAIL_PASSWORD=<Gmail app password>
SMTP_HOST=<SMTP server>
SMTP_PORT=587
FRONTEND_URL=<Application URL>
```

---

## 6. SYSTEM ARCHITECTURE

### 6.1 Architecture Overview

Wanderlust follows the **MERN Stack Architecture** pattern with a layered approach:

```
┌─────────────────────────────────────────┐
│          CLIENT LAYER (EJS)             │
│    Views, CSS, JavaScript, Forms        │
└────────────────┬────────────────────────┘
                 │
          HTTP Requests/Response
                 │
┌────────────────▼────────────────────────┐
│        EXPRESS.JS ROUTING LAYER         │
│  /listings, /bookings, /payments, etc.  │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│      MIDDLEWARE & AUTHENTICATION        │
│  isLoggedIn, isAdmin, Passport, Flash   │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│     CONTROLLER LAYER (Business Logic)   │
│  listingsController, bookingsController │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│      SERVICE LAYER (Utilities)          │
│  emailService, cloudinary, mapbox       │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│      MODEL LAYER (Data Models)          │
│  User, Listing, Booking, Payment, etc.  │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│        MONGODB DATABASE LAYER           │
│     Collections: users, listings, etc.  │
└─────────────────────────────────────────┘

External Services:
  • Cloudinary (Image Storage)
  • Mapbox (Geolocation)
  • Brevo/Gmail (Email)
  • MongoDB Atlas (Cloud Database)
```

### 6.2 Request-Response Flow

```
User Request
    ↓
Express Server (app.js)
    ↓
Route Handler (./routes/*)
    ↓
Middleware (Authentication, Validation)
    ↓
Controller (./controllers/*)
    ↓
Model Operations (./models/*)
    ↓
MongoDB Operations
    ↓
Response to Client (EJS Template)
    ↓
Browser Renders HTML
```

### 6.3 Component Diagram

```
┌─────────────────────────────────────────────────┐
│        PRESENTATION LAYER (EJS Views)           │
├─────────────────────────────────────────────────┤
│ /listings  /bookings  /payments  /users  /chat  │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│      APPLICATION LAYER (Express Routes)         │
├──────────────────┬──────────────────────────────┤
│ Listing Routes   │ Booking Routes   │ Payment   │
│ Review Routes    │ Chat Routes      │ Bot Routes│
│ User Routes      │ Admin Routes     │           │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│      BUSINESS LOGIC LAYER (Controllers)         │
├──────────────────┬──────────────────────────────┤
│ Listings Logic   │ Bookings Logic   │ Payments  │
│ Reviews Logic    │ Chat Logic       │ Bot Logic │
│ Users Logic      │ Admin Logic      │           │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│        DATA ACCESS LAYER (Models)               │
├──────────────────┬──────────────────────────────┤
│ User Model       │ Listing Model    │ Booking   │
│ Review Model     │ Chat Model       │ Payment   │
│ Bot Conversation │ Session Store    │           │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│        INFRASTRUCTURE LAYER                     │
├──────────────────┬──────────────────────────────┤
│ MongoDB Atlas    │ Cloudinary       │ Mapbox    │
│ Brevo Email      │ Gmail SMTP       │           │
└─────────────────────────────────────────────────┘
```

---

## 7. DATABASE DESIGN AND SCHEMA

### 7.1 Database Overview

The application uses **MongoDB** as the primary database with **Mongoose** as the ODM (Object Data Modeling) library. All data is stored in MongoDB Atlas (cloud-hosted).

### 7.2 Database Collections and Schema

#### 7.2.1 User Model

```javascript
{
  _id: ObjectId,
  username: String (required, unique via Passport),
  email: String (required),
  hash: String (password hash via Passport),
  salt: String (password salt via Passport),
  
  // Admin flag
  isAdmin: Boolean (default: false),
  
  // Profile Information
  mobileNumber: String (10-digit validation),
  profilePhoto: {
    filename: String,
    url: String
  },
  bio: String (max 500 chars),
  address: String (max 200 chars),
  
  // Payment Information
  upiId: String (format: username@bankname),
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

**Purpose:** Stores user account information, authentication details, profile data, and UPI payment IDs for property owners.

**Relationships:**
- Owns many Listings
- Makes many Bookings
- Authors many Reviews
- Participates in Chats
- Has Bot Conversations

---

#### 7.2.2 Listing Model

```javascript
{
  _id: ObjectId,
  
  // Basic Information
  title: String (required, max 30 chars),
  description: String (required),
  price: Number (required, min ₹300),
  location: String (required),
  country: String (required, max 27 chars),
  
  // Image Data
  image: {
    filename: String (default: "listingimage"),
    url: String (default: placeholder image)
  },
  
  // Property Details
  maxGuests: Number (default: 1),
  availableGuests: Number (current availability),
  category: Enum (Trending, Rooms, Iconic cities, mountains, 
                  castles, Amazing Pools, camping, farms, 
                  Arctic, Boats House),
  
  // Geolocation
  geometry: {
    type: String (enum: ['Point']),
    coordinates: [Number, Number] (longitude, latitude)
  },
  
  // Relationships
  owner: ObjectId (ref: User),
  reviews: [ObjectId] (ref: Review),
  
  // Metadata
  bookingCount: Number (number of confirmed bookings),
  ownerUpiId: String (UPI ID for receiving payments),
  
  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Purpose:** Stores property/listing information including location, pricing, images, and availability.

**Relationships:**
- Has an Owner (User)
- Has many Reviews
- Has many Bookings

**Geospatial Features:**
- Uses Mapbox for geocoding location strings to coordinates
- Supports location-based queries
- Stores GeoJSON Point for mapping

---

#### 7.2.3 Booking Model

```javascript
{
  _id: ObjectId,
  
  // References
  listing: ObjectId (ref: Listing, required),
  customer: ObjectId (ref: User, required),
  
  // Booking Details
  checkIn: Date (required, must be today or future),
  checkOut: Date (required, must be after checkIn),
  guests: Number (required, min: 1),
  totalPrice: Number (required, calculated: days * price),
  
  // Status Management
  status: Enum (pending, confirmed, rejected - default: pending),
  paymentStatus: Enum (unpaid, completed - default: unpaid),
  paymentMethod: Enum (upi, cash, pending - default: pending),
  
  // Timestamps
  createdAt: Date (default: Date.now)
}
```

**Purpose:** Tracks all booking requests from customers to listings.

**Status Flow:**
1. **pending** → Created when booking is requested
2. **confirmed** → Set by admin after approval
3. **rejected** → Set when booking is declined

**Payment Flow:**
1. **unpaid** → Initial state
2. **completed** → After successful payment

**Relationships:**
- References a Listing
- References a Customer (User)
- Has a Payment record
- Has a Chat (one-to-one)

---

#### 7.2.4 Payment Model

```javascript
{
  _id: ObjectId,
  
  // References
  booking: ObjectId (ref: Booking, required),
  customer: ObjectId (ref: User, required),
  
  // Payment Details
  amount: Number (required),
  status: Enum (pending, completed, failed - default: pending),
  paymentMethod: Enum (upi, cash - required),
  
  // UPI Specific
  upiId: String (receiver's UPI ID),
  qrCode: String (base64 encoded QR code),
  
  // Transaction Details
  transactionId: String (unique transaction identifier),
  
  // Timestamps
  createdAt: Date (default: Date.now),
  completedAt: Date (when payment completed)
}
```

**Purpose:** Tracks all payment transactions for bookings.

**Payment Methods:**
- **UPI:** Direct transfer with QR code generation
- **Cash:** Manual payment record

**Relationships:**
- References a Booking
- References a Customer (User)

---

#### 7.2.5 Review Model

```javascript
{
  _id: ObjectId,
  
  // Review Content
  rating: Number (required, min: 1, max: 5),
  comment: String,
  
  // Author Information
  author: ObjectId (ref: User),
  
  // Timestamps
  createdAt: Date (default: Date.now)
}
```

**Purpose:** Stores guest reviews and ratings for listings.

**Relationships:**
- Written by a User
- References to Listings (via Listing.reviews array)

**Note:** Reviews are cascade deleted when a listing is deleted.

---

#### 7.2.6 Chat Model

```javascript
{
  _id: ObjectId,
  
  // Reference
  booking: ObjectId (ref: Booking, required, unique),
  
  // Participants
  participants: [ObjectId] (ref: User, array of 2 users),
  
  // Messages Array
  messages: [{
    sender: ObjectId (ref: User),
    content: String (required, trimmed),
    timestamp: Date (default: Date.now),
    isRead: Boolean (default: false)
  }],
  
  // Metadata
  lastMessage: Date (default: Date.now)
}
```

**Purpose:** Enables real-time messaging between hosts and guests for a confirmed booking.

**Features:**
- One-to-one communication between customer and property owner
- Message read/unread tracking
- Only available for confirmed bookings
- Auto-populated with booking details

**Relationships:**
- References a Booking (one-to-one, unique)
- Participants are Users

---

#### 7.2.7 BotConversation Model

```javascript
{
  _id: ObjectId,
  
  // Session Management
  sessionId: String (required, unique, UUID),
  user: ObjectId (ref: User, default: null for guest conversations),
  
  // Conversation Messages
  messages: [{
    sender: Enum (bot, user),
    message: String (required),
    timestamp: Date (default: Date.now)
  }],
  
  // Context Information
  context: {
    location: String,
    minPrice: Number,
    maxPrice: Number,
    guests: Number,
    country: String,
    step: String (default: "greeting")
  },
  
  // Timestamps
  createdAt: Date (default: Date.now),
  lastActivity: Date (default: Date.now)
}
```

**Purpose:** Stores conversation history with AI recommendation bot.

**Auto-TTL:** Conversations older than 7 days are automatically deleted.

**Features:**
- Multi-step conversation flow
- Context preservation across messages
- Intent detection (greeting, location, price, guests, recommend)
- Property recommendations based on preferences

---

#### 7.2.8 Review & Chat Indexes

```javascript
// Chat indexes for performance
chatSchema.index({ participants: 1 });

// Bot conversation auto-delete after 7 days
botConversationSchema.index({ lastActivity: 1 }, 
  { expireAfterSeconds: 604800 });
```

### 7.3 Database Flow Diagram

```
APP START
    ↓
Connect to MongoDB Atlas
    ↓
Load/Update Models:
├─ User (with Passport plugin)
├─ Listing (with geospatial support)
├─ Booking (with validation)
├─ Payment
├─ Review (with cascade delete)
├─ Chat (with message tracking)
└─ BotConversation (with TTL)
    ↓
Initialize Session Store (MongoDB)
    ↓
Setup Routes & Middleware
    ↓
Ready to Handle Requests
```

### 7.4 Business Logic Data Flow

```
USER REGISTRATION
User → Signup Form → Controller → Passport.register() 
→ Hash Password → Save to User Collection → Session Created

PROPERTY LISTING
User → New Listing Form → Validate (Joi) 
→ Upload Image (Cloudinary) → Geocode Location (Mapbox) 
→ Save to Listing Collection

BOOKING PROCESS
Guest → Booking Form → Validate Dates & Guests 
→ Create Booking (status: pending) → Reserve Guest Spots 
→ Send Email → Payment Gateway

PAYMENT PROCESSING
Customer → Payment Form → Select Method → Process Payment 
→ Generate QR (if UPI) → Create Payment Record 
→ Update Booking Status → Send Receipt Email

CHAT SYSTEM
Confirmed Booking → ChatController.getChat() 
→ Find or Create Chat → Load Messages → Send/Receive Messages 
→ Mark as Read → Real-time Update

BOT RECOMMENDATION
User Message → Intent Detection → Extract Preferences 
→ Query Listings (MongoDB) → Format Response 
→ Save Conversation → Return Recommendations
```

---

## 8. FEATURES AND TECHNOLOGIES

### 8.1 Core Features with Technologies

#### 8.1.1 USER AUTHENTICATION & AUTHORIZATION

**Feature:** Secure user registration, login, and role-based access control

**Technologies Used:**
- **Passport.js** - Authentication middleware for multimodal authentication support
- **Passport-Local** - Local username/password strategy
- **Passport-Local-Mongoose** - Mongoose plugin automating user serialization
- **bcrypt** - Password hashing (via Passport-Local-Mongoose)
- **Express-Session** - Session management with HTTP-only cookies
- **Connect-Mongo** - MongoDB session store for persistent sessions

**Implementation Details:**
```
User Login Flow:
1. User submits credentials via form
2. Passport-local strategy validates credentials
3. Password compared with bcrypt hash
4. Session created and stored in MongoDB
5. User authenticated for remaining requests

Authentication Middleware:
- isLoggedIn: Checks if user is authenticated
- isAdmin: Verifies admin role
- saveRedirectUrl: Maintains redirect after login
```

**Security Features:**
- Passwords hashed with bcrypt (via Passport)
- Session stored securely in MongoDB
- HTTP-only cookies to prevent XSS
- 7-day session expiration
- Admin role-based access control

---

#### 8.1.2 PROPERTY LISTING MANAGEMENT

**Feature:** Create, read, update, delete property listings with images and geolocation

**Technologies Used:**
- **Multer** - File upload handling
- **Multer-Storage-Cloudinary** - Direct upload to Cloudinary
- **Cloudinary** - Cloud image storage and CDN
- **Mapbox SDK** - Geocoding and geolocation services
- **Joi** - Schema validation for listing data
- **MongoDB Geospatial Queries** - Location-based searches

**Implementation Details:**

```
CREATE LISTING:
1. Form submission with listing details
2. Joi validation (title, price, location, etc.)
3. Image upload via Multer → Cloudinary
4. Location geocoding via Mapbox (string → coordinates)
5. Store in MongoDB with geospatial geometry
6. Flash message confirmation

UPDATE LISTING:
1. Find existing listing
2. Validate new data
3. Update image if provided
4. Re-geocode if location changed
5. Save changes to MongoDB

LISTING FEATURES:
- Categories: Trending, Rooms, Iconic cities, mountains, etc.
- Dynamic pricing based on demand (bookingCount)
- Available guest tracking (maxGuests - currentBookings)
- Image optimization with CloudName transformation
```

**Database Operations:**
```javascript
// Search by category
Listing.find({ category: "Trending" })

// Search by country
Listing.find({ country: { $regex: search, $options: 'i' } })

// Get trending (2+ bookings)
Listing.find({ bookingCount: { $gte: 2 } })

// Geospatial queries (future implementation)
Listing.find({ geometry: { $near: { $geometry: point } } })
```

---

#### 8.1.3 BOOKING MANAGEMENT SYSTEM

**Feature:** Complete booking lifecycle from creation to confirmation/rejection with guest capacity management

**Technologies Used:**
- **Mongoose Validation** - Date and guest count validation
- **MongoDB** - Transaction data persistence
- **Express** - Route handling and business logic
- **Email Service** - Booking confirmation emails
- **Flash Messages** - User feedback notifications

**Implementation Details:**

```
BOOKING FLOW:

1. INITIATE BOOKING
   - Guest selects property and click "Book Now"
   - Check: Property has available guest spots
   - Render booking form with property details

2. SUBMIT BOOKING
   - Validate check-in date ≥ today
   - Validate check-out date > check-in date
   - Verify guest count ≤ availableGuests
   - Prevent owner from booking own property
   - Create booking record with status: "pending"
   - Reserve guest spots immediately

3. ADMIN REVIEW
   - Admin views all pending bookings
   - Reviews booking details
   - Two options: Confirm or Reject

4. CONFIRMATION
   - Admin confirms booking → status: "confirmed"
   - Increment listing.bookingCount
   - Send confirmation email to guest
   - Enable chat and payment

5. PAYMENT
   - Guest proceeds to payment
   - Select payment method (UPI or Cash)
   - Complete payment (see Payment section)
   - paymentStatus: "completed"

6. COMPLETION
   - Booking with confirmed status + completed payment
   - Guest and host can communicate via chat
   - Property remains reserved for those dates
```

**Guest Capacity Management:**
```javascript
// When booking is created:
listing.availableGuests = 
  Math.max(0, availableGuests - requestedGuests)

// When max guests changes:
const bookedGuests = maxGuests - availableGuests
availableGuests = Math.max(0, newMaxGuests - bookedGuests)

// Dynamic filtering:
Listing.find({ availableGuests: { $gt: 0 } }) // Available properties
```

**Booking States:**
```
pending → confirmed/rejected
   ↓
confirmed + unpaid → confirmed + paid
   ↓
completed (ready for checkout)
```

---

#### 8.1.4 PAYMENT PROCESSING SYSTEM

**Feature:** Dual payment methods (UPI and Cash) with QR code generation and transaction tracking

**Technologies Used:**
- **QRCode.js** - QR code generation for UPI
- **Nodemailer** - Payment receipt emails
- **UUID** - Unique transaction ID generation
- **Brevo API / Gmail SMTP** - Email notifications
- **MongoDB** - Payment record persistence

**Implementation Details:**

```
PAYMENT METHODS:

1. UPI PAYMENT:
   ├─ Get property owner's UPI ID
   ├─ Generate UPI string: upi://pay?receiver=UPI_ID&amount=AMOUNT
   ├─ Create QR code using QRCode.js
   ├─ Display QR for customer scanning
   ├─ On confirmation:
   │  ├─ Generate transaction ID (UUID)
   │  ├─ Create Payment record (status: "completed")
   │  ├─ Store QR code in database
   │  └─ Update Booking paymentStatus: "completed"
   └─ Send payment receipt email

2. CASH PAYMENT:
   └─ Admin manually marks payment as received
      ├─ Create Payment record
      └─ Update Booking paymentStatus: "completed"

FLOW:
1. Customer clicks "Pay Now" on confirmed booking
2. System validates:
   - Booking is confirmed
   - User is the customer
   - Payment not already completed
3. Render payment form with options
4. If UPI selected:
   - Display QR code with payment details
   - Customer scans and completes UPI transfer
   - Mark payment as complete
5. If Cash selected:
   - Admin will handle offline
6. Send receipt email with:
   - Booking details
   - Payment confirmation
   - Check-in/check-out details
   - Property location
```

**Transaction ID Format:**
```javascript
`TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`
// Example: TXN167823456789abc123xyz
```

---

#### 8.1.5 REVIEW & RATING SYSTEM

**Feature:** Guests can review and rate properties after stay

**Technologies Used:**
- **Mongoose Relations** - References between Review and User/Listing
- **Joi Validation** - Rating range (1-5) and comment validation
- **MongoDB Array Operations** - Store reviews in listing

**Implementation Details:**

```
REVIEW WORKFLOW:

1. ELIGIBILITY
   - Only guests with confirmed bookings can review
   - User must be logged in
   - Review linked to listing via URL parameter

2. SUBMISSION
   - Guest fills rating (1-5 stars) and comment
   - Server validates via Joi schema:
     * rating: 1-5 (required)
     * comment: string (required)
   - Create Review document
   - Set author to current user
   - Add review._id to listing.reviews array

3. DISPLAY
   - Show all reviews on listing page
   - Populate author information (username)
   - Display in newest-first order
   - Show rating stars and comment

4. DELETION
   - Review author or admin can delete
   - Remove review from listing.reviews array
   - Delete review document from database
```

**Data Example:**
```
Listing Document:
{
  _id: ...,
  title: "Cozy Beach House",
  reviews: [
    { _id: 123, author: userA_id, rating: 5, comment: "Amazing!" },
    { _id: 124, author: userB_id, rating: 4, comment: "Good stay" }
  ]
}
```

---

#### 8.1.6 REAL-TIME CHAT SYSTEM

**Feature:** Direct messaging between hosts and guests for confirmed bookings

**Technologies Used:**
- **Express.js** - HTTP endpoints for chat operations
- **Mongoose** - Message persistence
- **AJAX/Fetch API** - Real-time message updates
- **JavaScript EventListeners** - Client-side message handling
- **Moment.js** (implicit) - Timestamp formatting

**Implementation Details:**

```
CHAT INITIALIZATION:

1. TRIGGER
   - Only available for CONFIRMED bookings
   - Accessed during booking details view
   - Auto-creates chat if doesn't exist

2. PARTICIPANTS
   - Booking customer (guest)
   - Listing owner (host)
   - Validation: User must be one of participants or admin

3. MESSAGE STRUCTURE:
   {
     sender: User._id,
     content: String,
     timestamp: Date,
     isRead: Boolean
   }

MESSAGE FLOW:

1. SEND MESSAGE:
   - POST /chat/booking/{bookingId}/message
   - Validate non-empty content
   - Append to chat.messages array
   - Update chat.lastMessage timestamp
   - Mark own messages as isRead: true
   - Return JSON response

2. RECEIVE MESSAGES:
   - GET /chat/booking/{bookingId}
   - Fetch chat from database
   - Populate sender information
   - Mark unread messages as read
   - Sort messages by timestamp
   - Render chat template

READ STATUS:

- Messages marked as read when:
  * Recipient opens chat
  * Recipient is viewing the conversation
- Browser updates UI in real-time
- Helps with message notifications

PERMISSIONS:
- Customer access: Own bookings only
- Host access: Bookings of their listings
- Admin access: All chats
```

**Client-side Implementation:**
```javascript
// Send message via AJAX
async function sendMessage(message) {
  const response = await fetch(
    `/chat/booking/${bookingId}/message`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    }
  );
  const data = await response.json();
  appendMessageToUI(data.message); // Display immediately
}

// Fetch new messages periodically
setInterval(() => {
  fetchChatUpdates(bookingId);
}, 2000); // Poll every 2 seconds
```

---

#### 8.1.7 AI-POWERED RECOMMENDATION BOT

**Feature:** Intelligent property recommendation system with natural language processing using rule-based intent detection

**Technologies Used:**
- **Natural Language Processing (Rule-based)** - Intent detection
- **Regular Expressions** - Pattern matching for user input
- **MongoDB Queries** - Property filtering and sorting
- **UUID** - Session management
- **Express.js** - API endpoints

**Implementation Details:**

```
BOT CONVERSATION FLOW:

1. SESSION MANAGEMENT:
   - Each user gets unique sessionId (UUID)
   - Stores conversation history
   - Context preserved across messages
   - Auto-delete after 7 days (TTL index)

2. INTENT DETECTION:
   
   Intents Supported:
   ┌─────────────────────────────────────┐
   │ GREETING                            │
   │ Patterns: hi, hello, hey, start     │
   │ Response: Welcome + Ask preferences │
   ├─────────────────────────────────────┤
   │ LOCATION                            │
   │ Patterns: "in Mumbai", "near Goa"   │
   │ Extraction: Extract location name   │
   │ Response: Confirm location + Ask    │
   ├─────────────────────────────────────┤
   │ PRICE                               │
   │ Patterns: "under 5000", "3-8k"      │
   │ Extraction: Extract min-max range   │
   │ Response: Confirm budget + Ask next │
   ├─────────────────────────────────────┤
   │ GUESTS                              │
   │ Patterns: "2 people", "family"      │
   │ Extraction: Extract number/word     │
   │ Response: Confirm guests            │
   ├─────────────────────────────────────┤
   │ RECOMMEND                           │
   │ Patterns: "show", "find", "search"  │
   │ Action: Query listings database     │
   │ Response: Top 5 recommendations     │
   ├─────────────────────────────────────┤
   │ RESTART                             │
   │ Patterns: "start over", "reset"     │
   │ Action: Clear context               │
   │ Response: Start from greeting       │
   └─────────────────────────────────────┘

3. CONTEXT MANAGEMENT:
   
   Context Object:
   {
     location: String,
     minPrice: Number,
     maxPrice: Number,
     guests: Number,
     country: String,
     step: String (greeting → location → price → guests → recommend)
   }

4. RECOMMENDATION ALGORITHM:
   
   Filter: listings.find({
     location: { $regex: context.location, $options: 'i' },
     price: { $gte: minPrice, $lte: maxPrice },
     maxGuests: { $gte: guests }
   })
   
   Sort: By bookingCount (most booked first)
   Limit: Top 5 results
   
   Response: Property title, location, price, image

5. CONVERSATION PERSISTENCE:
   - Store all messages (bot + user)
   - Maintain conversation history
   - allow /bot/history/{sessionId} endpoint
   - Support conversation reset

EXAMPLE CONVERSATION:

User: "Hello"
Bot: "Hi! 👋 I'm your recommendation assistant..."

User: "Mumbai"
Bot: "Great! Looking for properties in Mumbai..."

User: "under 5000"
Bot: "Budget ₹0 - ₹5000. Here are recommendations..."

Bot Response Format:
✨ "Villa Sunset" (Mumbai)
💰 ₹4,500/night | 👥 4 guests
⭐ 4.8 stars | 📍 View on map
```

**Implementation Feature:**
```javascript
// Intent detection algorithm
function detectIntent(message) {
  const lowerMsg = message.toLowerCase().trim();
  
  // Word boundary regex for accuracy
  if (/\b(hi|hello|hey|start|help)\b/i.test(lowerMsg)) {
    return 'greeting';
  }
  
  // Multi-pattern price detection
  // Supports: "5000", "under 5000", "₹3000-5000", "between 3k-8k"
  if (/(price|cost|budget|₹|rs|under|above|between)/i.test(lowerMsg)) {
    return 'price';
  }
  
  // Similar patterns for location, guests, recommend, restart
}

// Price extraction with multiple formats
function extractPrice(message) {
  // Handles: "5000", "under 5000", "3000-5000", "₹3k to 8k"
  // Returns: { min, max }
}
```

---

#### 8.1.8 USER PROFILE MANAGEMENT

**Feature:** Customizable user profiles with photo uploads, contact info, and payment details

**Technologies Used:**
- **Multer & Cloudinary** - Profile photo upload
- **Joi Validation** - Input validation (mobile, UPI)
- **EJS Templating** - Profile display
- **Mongoose** - Data persistence

**Profile Fields:**
```
mobileNumber: 10-digit phone (validated)
bio: Personal description (max 500 chars)
address: Street address (max 200 chars)
profilePhoto: 
  - filename (Cloudinary)
  - url (Cloudinary CDN)
upiId: Payment ID (format: username@bank)
```

**Use Cases:**
- **Hosts:** Display legitimate identity to guests
- **Guests:** Share contact info with hosts
- **Payment:** Store UPI for receiving payments from guests

---

#### 8.1.9 ADMIN DASHBOARD & MANAGEMENT

**Feature:** Comprehensive admin panel to manage all platform aspects

**Admin Capabilities:**

```
1. USER MANAGEMENT
   ├─ View all registered users
   ├─ Delete user accounts
   ├─ View user profiles and details
   └─ Manage admin roles

2. LISTING MANAGEMENT
   ├─ View all listings (trending, inactive, active)
   ├─ Filter by status (trending if bookingCount ≥ 2)
   ├─ View listing details and reviews
   ├─ Edit/delete any listing
   └─ Monitor property status

3. BOOKING MANAGEMENT
   ├─ View all bookings (not just own)
   ├─ See booking status (pending, confirmed, rejected)
   ├─ Confirm pending bookings
   ├─ Reject bookings with reason
   ├─ Track payment status
   └─ Handle cancellations

4. PAYMENT MANAGEMENT
   ├─ View all payment records
   ├─ Track payment methods used
   ├─ Monitor transaction history
   ├─ Verify payment completion
   └─ Download payment reports

5. ANALYTICS
   ├─ Total users count
   ├─ Total properties count
   ├─ Total bookings and revenue
   ├─ Trending properties
   ├─ Payment method usage
   └─ User activity logs
```

**Admin Routes:**
```
GET  /listings/admin/all-listings
GET  /bookings/admin/bookings
GET  /payments/admin/payments
GET  /users/admin/users

POST /bookings/{id}/confirm
POST /bookings/{id}/reject
DELETE /users/admin/users/{id}
```

**Authorization:**
- User model includes `isAdmin` boolean flag
- Route middleware checks admin status
- Only admins can access admin routes
- Regular users redirected with error

---

#### 8.1.10 EMAIL NOTIFICATION SYSTEM

**Feature:** Automated email notifications for bookings, payments, and account events

**Technologies Used:**
- **Nodemailer** - Email sending library
- **Brevo (Primary)** - Email service provider with API
- **Gmail SMTP (Fallback)** - Secondary email service
- **HTML Email Templates** - Formatted email content

**Email Types:**

```
1. BOOKING CONFIRMATION
   Sent to: Guest email
   When: Admin confirms booking
   Contains:
   - Property details (name, location, price)
   - Check-in/Check-out dates
   - Guest count and total price
   - Next steps (make payment)

2. BOOKING REJECTION
   Sent to: Guest email
   When: Admin rejects booking
   Contains:
   - Rejection notification
   - Alternative properties
   - Support contact

3. PAYMENT RECEIPT
   Sent to: Guest email
   When: Payment completed
   Contains:
   - Transaction ID
   - Amount and payment method
   - Property details
   - Booking confirmation number
   - Host's UPI ID (if UPI payment)
   - Check-in instructions

4. ACCOUNT REGISTRATION
   Sent to: New user email
   When: Account created
   Contains:
   - Welcome message
   - Account details
   - Platform features overview
```

**Email Service Configuration:**

```
Priority Order:
1. Brevo API (Recommended - works reliably on cloud servers)
   - HTTP REST API
   - No SMTP port restrictions
   - Better deliverability
   
2. Brevo SMTP (Alternative)
   - SMTP connection
   - Less reliable on cloud
   
3. Gmail SMTP (Fallback)
   - App-specific password required
   - IPv4 forced (DNS configuration)
   - TLS 1.2+ enforcement

Environment Variables:
- BREVO_API_KEY
- BREVO_SMTP_USER & BREVO_SMTP_PASSWORD
- GMAIL_USER & GMAIL_PASSWORD
- BREVO_FROM_EMAIL (sender)
```

**Implementation:**
```javascript
// Email service automatically selects best provider
if (USE_BREVO_API) {
  // Send via HTTP API
} else if (USE_BREVO_SMTP) {
  // Send via Nodemailer SMTP
} else if (USE_GMAIL) {
  // Fallback to Gmail
}

// Usage in controllers:
await sendBookingConfirmation({
  to: customer.email,
  username: customer.username,
  booking: bookingData,
  listing: listingData
});
```

---

### 8.2 Feature Summary Table

| Feature | Technology | Purpose | Status |
|---------|-----------|---------|--------|
| User Auth | Passport.js, bcrypt | Secure login/signup | ✅ Complete |
| Listings | Cloudinary, Mapbox | Manage properties | ✅ Complete |
| Bookings | MongoDB, Email | Booking management | ✅ Complete |
| Payments | QRCode.js, Nodemailer | Payment processing | ✅ Complete |
| Reviews | Mongoose, Joi | Rating system | ✅ Complete |
| Chat | Express, AJAX | Real-time messaging | ✅ Complete |
| Bot | NLP (rule-based), MongoDB | Property recommendations | ✅ Complete |
| Admin Panel | EJS, Express | System management | ✅ Complete |
| Email | Brevo, Gmail, Nodemailer | Notifications | ✅ Complete |
| Profiles | Multer, Cloudinary | User management | ✅ Complete |

---

## 9. PROJECT WORKFLOW AND FLOW

### 9.1 User Journey - Guest (Looking for Property)

```
START
  ↓
[Public Home Page]
  ├─ Browse listings by category
  ├─ Search by country
  └─ View property details
  ↓
[NOT LOGGED IN?]
  ├─ Click "Login"
  └─ [Signup Page] → Create account
  ↓
[Filtered Search]
  ├─ Category filter (Trending, Rooms, Mountains, etc.)
  ├─ Country search (case-insensitive)
  └─ View properties in grid
  ↓
[Property Details]
  ├─ View photos, description, price
  ├─ Check available guest spots
  ├─ Read reviews from previous guests
  └─ Chat with owner (if booked)
  ↓
[DECIDE TO BOOK]
  ├─ Click "Book Now"
  └─ [Booking Form]
      ├─ Select check-in date (today or future)
      ├─ Select check-out date (after check-in)
      ├─ Enter number of guests (≤ available spots)
      └─ Submit booking
  ↓
[BOOKING SUBMITTED]
  ├─ Status: Pending (waiting admin approval)
  ├─ Guest spots reserved
  ├─ Email: "Booking submitted, waiting confirmation"
  └─ [My Bookings page] - Track status
  ↓
[ADMIN CONFIRMS - if confirmed]
  ├─ Status: Confirmed
  ├─ Email: "Booking confirmed! Proceed to payment"
  └─ Payment becomes available
  ↓
[PAYMENT PROCESSING]
  ├─ View booking in "My Bookings"
  ├─ Click "Pay Now"
  ├─ [Payment Method Selection]
  │  ├─ Option 1: UPI (Scan QR code)
  │  └─ Option 2: Cash (Admin will mark as paid)
  ├─ Complete payment
  ├─ Email: "Payment receipt with transaction ID"
  └─ [Payment Success Page]
  ↓
[BEFORE CHECK-IN]
  ├─ Open booking details
  ├─ View host info with UPI for contact
  ├─ Communicate via chat message
  ├─ Ask questions about property
  └─ Get check-in instructions
  ↓
[DURING STAY]
  ├─ Enjoy property
  ├─ Continue chatting with host if needed
  └─ Take photos
  ↓
[AFTER STAY - Optional]
  ├─ Return to listing page
  ├─ Click "Leave a review"
  ├─ [Review Form]
  │  ├─ Rating (1-5 stars)
  │  ├─ Write comment
  │  └─ Submit
  ├─ Review published on listing
  └─ Help future guests decide
  ↓
END (Happy Customer!)
```

### 9.2 User Journey - Host (Listing Properties)

```
START
  ↓
[Signup / Login]
  └─ Create account or login
  ↓
[Upload Profile]
  ├─ Upload profile photo
  ├─ Add bio/description
  ├─ Add mobile number
  ├─ Add address
  ├─ Add UPI ID (for receiving payments)
  └─ Save profile
  ↓
[Create Listing]
  ├─ Click "Add New Listing"
  ├─ [Listing Form]
  │  ├─ Property title (max 30 chars)
  │  ├─ Description (full details)
  │  ├─ Location (autocomplete via Mapbox)
  │  ├─ Country (max 27 chars)
  │  ├─ Price per night (min ₹300)
  │  ├─ Upload property images
  │  ├─ Category (Trending, Rooms, Mountains, etc.)
  │  ├─ Max guests allowed
  │  └─ Owner UPI ID (for this listing)
  ├─ [Image Upload]
  │  ├─ Select image file
  │  └─ Upload to Cloudinary (auto-optimized)
  └─ Submit
  ↓
[Listing Created]
  ├─ Geocoding: Location string → coordinates (Mapbox)
  ├─ availableGuests = maxGuests initially
  ├─ bookingCount = 0 initially
  ├─ Listing published and visible
  ├─ Email: "Listing created successfully"
  └─ [My Listings] - View all owned listings
  ↓
[MANAGE LISTING]
  ├─ View listing details
  ├─ Edit any information
  ├─ Update images
  ├─ Re-geocode location
  ├─ Adjust max guests capacity
  ├─ Update UPI ID
  └─ Delete listing (if no active bookings)
  ↓
[RECEIVE BOOKINGS]
  ├─ Guests book property
  ├─ Booking appears as "Pending"
  ├─ Email: "New booking request received"
  └─ Admin approves/rejects
  ↓
[BOOKING CONFIRMED BY ADMIN]
  ├─ availableGuests reduced
  ├─ bookingCount incremented (if confirmed)
  ├─ Email: "Booking confirmed for your property"
  └─ Chat becomes available
  ↓
[GUEST PAYS]
  ├─ Guest completes payment
  ├─ Payment receipt shows UPI ID
  ├─ Money transferred directly to host's UPI
  └─ Email: Payment confirmation
  ↓
[DURING BOOKING PERIOD]
  ├─ Guest can message host via chat
  ├─ Host responds to guest requests
  ├─ Coordinate check-in/check-out
  └─ Address any issues
  ↓
[AFTER CHECKOUT]
  ├─ Guest leaves property
  ├─ Host confirms checkout
  ├─ availableGuests restored
  ├─ Guest can leave review (optional)
  └─ Booking marked as completed
  ↓
[ANALYTICS PAGE]
  ├─ View all own listings
  ├─ See booking counts (trending if ≥ 2)
  ├─ Track total bookings
  ├─ View guest reviews
  └─ Monitor income
  ↓
END (Active Income Generator!)
```

### 9.3 User Journey - Admin

```
START
  ↓
[Admin Login]
  ├─ Username: "LAPU" (example)
  └─ Password: (set during account creation)
  ↓
[ADMIN DASHBOARD]
  ├─ View platform statistics
  ├─ Quick access to all management features
  └─ System health indicators
  ↓
[USER MANAGEMENT]
  ├─ [View All Users]
  │  ├─ List all registered users
  │  ├─ View user details
  │  ├─ See profile information
  │  └─ View verification status
  ├─ [Delete User]
  │  ├─ Select user to delete
  │  ├─ Cascade delete:
  │  │  ├─ User's listings
  │  │  ├─ User's bookings (as customer)
  │  │  ├─ User's reviews
  │  │  └─ Bookings of user's listings (cascade)
  │  └─ Confirm deletion
  └─ Email: "Account deleted notification"
  ↓
[LISTING MANAGEMENT]
  ├─ [View All Listings]
  │  ├─ See properties by status
  │  ├─ Filter: Trending (bookingCount ≥ 2)
  │  ├─ Filter: Inactive (bookingCount = 0)
  │  ├─ View property details
  │  └─ Edit/Delete listings
  ├─ [Edit Listing]
  │  ├─ Update any property information
  │  ├─ Change images
  │  ├─ Modify pricing
  │  └─ Save changes
  └─ [Delete Listing]
      ├─ Remove property
      ├─ Delete associated reviews
      └─ Cancel any pending bookings
  ↓
[BOOKING MANAGEMENT]
  ├─ [View All Bookings]
  │  ├─ See all platform bookings
  │  ├─ Filter by status
  │  │  ├─ Pending (awaiting approval)
  │  │  ├─ Confirmed (approved)
  │  │  └─ Rejected (declined)
  │  ├─ View booking details:
  │  │  ├─ Property name
  │  │  ├─ Guest name
  │  │  ├─ Check-in/out dates
  │  │  ├─ Guest count
  │  │  └─ Total price
  │  └─ Take action
  ├─ [Confirm Booking]
  │  ├─ Review pending booking
  │  ├─ Verify dates and details
  │  ├─ Confirm → status: "confirmed"
  │  ├─ availableGuests updated
  │  ├─ bookingCount incremented
  │  └─ Email: Confirmation to guest + host
  ├─ [Reject Booking]
  │  ├─ Review pending booking
  │  ├─ Select rejection reason
  │  ├─ Reject → status: "rejected"
  │  ├─ availableGuests restored
  │  └─ Email: Rejection notice to guest
  └─ [Delete Booking]
      ├─ Remove booking record
      ├─ Restore guest spots
      └─ Clean up related payments/chats
  ↓
[PAYMENT MANAGEMENT]
  ├─ [View All Payments]
  │  ├─ See all transactions
  │  ├─ Payment method used (UPI, Cash)
  │  ├─ Payment status (Pending, Completed, Failed)
  │  ├─ Transaction ID
  │  ├─ Amount and date
  │  └─ Booking reference
  ├─ [Verify Payment]
  │  ├─ Check transaction details
  │  ├─ Verify amount matches booking
  │  └─ Mark as verified if correct
  └─ [Download Reports]
      ├─ Monthly payment reports
      ├─ Revenue by payment method
      └─ Booking conversion rates
  ↓
[SYSTEM MONITORING]
  ├─ Server logs and errors
  ├─ Database connection status
  ├─ Email service status
  ├─ Cloud storage (Cloudinary) status
  └─ API rate limits
  ↓
[ANALYTICS & REPORTS]
  ├─ Total users: Count
  ├─ Total listings: Count
  ├─ Total bookings: Count
  ├─ Total revenue: Sum of all bookings
  ├─ Trending properties: Top booked listings
  ├─ User growth: Over time
  ├─ Payment method distribution
  └─ Platform health metrics
  ↓
END (Everything Under Control!)
```

### 9.4 Data Flow During Booking

```
────────────────────────────────────────────────────────────────
                    BOOKING CREATION FLOW
────────────────────────────────────────────────────────────────

1. USER INITIATES BOOKING
   ┌────────────────────┐
   │  Guest Clicks      │
   │  "Book Now"        │
   └─────────┬──────────┘
             │
             ▼
   ┌────────────────────────────┐
   │ Check Property Capacity:   │
   │ availableGuests > 0?       │
   └────┬───────────────┬───────┘
        │ NO            │ YES
        │               │
        ▼               ▼
    [Error]        [Proceed]
                     │
                     ▼
       ┌──────────────────────────┐
       │ Render Booking Form      │
       │ Pre-fill property info   │
       └─────────────┬────────────┘
                     │
                     ▼
2. FORM SUBMISSION
   ┌─────────────────────────────────┐
   │ POST /bookings/listings/:id/book│
   └─────────────────┬───────────────┘
                     │
                     ▼
3. SERVER-SIDE VALIDATION
   ┌──────────────────────────────────┐
   │ ✓ Check-in ≥ today              │
   │ ✓ Check-out > check-in          │
   │ ✓ Guests ≤ availableGuests      │
   │ ✓ Not owner's own property      │
   │ ✓ Property still exists         │
   └───────┬──────────────┬──────────┘
           │              │
        FAIL           PASS
           │              │
           ▼              ▼
        [Error]      [Continue]
                        │
                        ▼
4. CREATE BOOKING RECORD
   ┌───────────────────────────────────┐
   │ new Booking({                     │
   │   listing: propertyId,            │
   │   customer: userId,               │
   │   checkIn: date,                  │
   │   checkOut: date,                 │
   │   guests: number,                 │
   │   totalPrice: days * price,       │
   │   status: "pending",              │
   │   paymentStatus: "unpaid"         │
   │ })                                │
   └─────────────────┬─────────────────┘
                     │
                     ▼
5. RESERVE GUEST SPOTS
   ┌──────────────────────────────────┐
   │ listing.availableGuests =        │
   │   Math.max(0,                    │
   │   availableGuests - guestCount)  │
   └──────┬────────────────────────────┘
          │
          ▼
6. SAVE TO DATABASE
   ┌──────────────────────────────────┐
   │ await booking.save()             │
   │ await listing.save()             │
   └──────┬────────────────────────────┘
          │
          ▼
7. SEND EMAIL NOTIFICATION
   ┌──────────────────────────────────┐
   │ Email to guest:                  │
   │ "Booking submitted!              │
   │  Waiting admin confirmation"    │
   └──────┬────────────────────────────┘
          │
          ▼
8. REDIRECT & DISPLAY MESSAGE
   ┌──────────────────────────────────┐
   │ Flash: "Booking submitted!"      │
   │ Redirect: /bookings/my-bookings  │
   │ Show in "Pending" section        │
   └──────────────────────────────────┘

────────────────────────────────────────────────────────────────
                    ADMIN APPROVAL FLOW
────────────────────────────────────────────────────────────────

9. ADMIN REVIEWS
   ┌────────────────────────────────┐
   │ Navigate to:                   │
   │ /bookings/admin/bookings       │
   │ View pending bookings          │
   └─────────────────┬──────────────┘
                     │
                     ▼
10. ADMIN CONFIRMS BOOKING
    ┌──────────────────────────────────┐
    │ POST /bookings/:id/confirm       │
    └───────────────┬──────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────┐
    │ Booking.status = "confirmed"     │
    │ listing.bookingCount++           │
    │ Save to database                 │
    └────────────┬─────────────────────┘
                 │
                 ▼
11. SEND CONFIRMATIONS
    ┌──────────────────────────────────┐
    │ Email to guest:                  │
    │ "Booking confirmed!              │
    │  Proceed to payment"            │
    │                                  │
    │ Email to host:                   │
    │ "New booking confirmed!"         │
    └──────┬───────────────────────────┘
           │
           ▼
12. ENABLE FEATURES
    ┌──────────────────────────────────┐
    │ ✓ Payment becomes available      │
    │ ✓ Chat becomes available         │
    │ ✓ Booking shows "Confirmed"      │
    │ ✓ Can view host contact info     │
    └──────────────────────────────────┘

────────────────────────────────────────────────────────────────
                    DATABASE STATE CHANGES
────────────────────────────────────────────────────────────────

LISTING COLLECTION:
Before Booking:
  {
    _id: ...,
    maxGuests: 4,
    availableGuests: 4,
    bookingCount: 0
  }

After Booking Creation (2 guests):
  {
    _id: ...,
    maxGuests: 4,
    availableGuests: 2,  ← REDUCED
    bookingCount: 0
  }

After Admin Confirmation:
  {
    _id: ...,
    maxGuests: 4,
    availableGuests: 2,
    bookingCount: 1      ← INCREMENTED
  }

BOOKING COLLECTION:
After Creation:
  {
    _id: ...,
    listing: propertyId,
    customer: guestId,
    checkIn: "2024-05-20",
    checkOut: "2024-05-25",
    guests: 2,
    totalPrice: 20000,
    status: "pending",          ← INITIAL
    paymentStatus: "unpaid",
    paymentMethod: "pending",
    createdAt: "2024-05-15"
  }

After Admin Approval:
  {
    _id: ...,
    status: "confirmed",        ← UPDATED
    paymentStatus: "unpaid",
    paymentMethod: "pending"
  }

After Payment:
  {
    _id: ...,
    status: "confirmed",
    paymentStatus: "completed", ← UPDATED
    paymentMethod: "upi"        ← UPDATED
  }
```

---

## 10. INSTALLATION AND SETUP GUIDE

### 10.1 Prerequisites

- **Node.js:** 22.19.0 or higher
- **npm:** Latest version
- **MongoDB Atlas:** Cloud account or local MongoDB
- **Cloudinary:** Account for image hosting
- **Mapbox:** API token for geolocation
- **Brevo/Gmail:** Email service configured
- **Git:** For version control

### 10.2 Step-by-Step Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd Air-Bnb-Mern

# 2. Install dependencies
npm install

# 3. Create .env file in root directory
cp .env.example .env

# 4. Configure .env with your values
# (See Environment Variables section)

# 5. Start the server
npm start

# 6. Open browser
# Visit: http://localhost:8000
```

### 10.3 Environment Variables Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database Configuration
ATLASDB_URL=mongodb+srv://username:password@cluster.mongodb.net/wanderlust

# Session Secret
SECRET=your-super-secret-code-here-min-50-chars

# Cloud Storage (Cloudinary)
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret

# Mapping Service (Mapbox)
MAP_TOKEN=pk.eyJ1IjoieW91ciIsImEiOiJjbHl...

# Email Service - Brevo (Recommended)
BREVO_API_KEY=xkeysib-your-api-key-here
BREVO_SMTP_USER=your-brevo-smtp-user
BREVO_SMTP_PASSWORD=your-brevo-smtp-password
BREVO_FROM_EMAIL=your-email@domain.com

# Email Service - Gmail (Fallback)
GMAIL_USER=your-gmail@gmail.com
GMAIL_PASSWORD=your-app-specific-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:8000
```

### 10.4 Database Setup

```javascript
// The application automatically:
// 1. Connects to MongoDB Atlas
// 2. Creates collections if they don't exist
// 3. Sets up indexes for performance
// 4. Initializes TTL for bot conversations

// No manual database setup required!
```

### 10.5 First Run Checklist

```
✓ Node.js installed (version check: node --version)
✓ Dependencies installed (npm install completed)
✓ .env file created with all required variables
✓ MongoDB Atlas connection verified
✓ Cloudinary credentials configured
✓ Mapbox API token added
✓ Email service configured (Brevo or Gmail)
✓ Server starts without errors (npm start)
✓ Can access http://localhost:8000
✓ Can create account (signup works)
✓ Can login successfully
```

---

## 11. API ENDPOINTS

### 11.1 User Routes

```
Authentication:
POST   /signup                    Create new account
GET    /login                     Show login form
POST   /login                     Authenticate user
GET    /logout                    Logout user

User Profile:
GET    /users/profile             View own profile
GET    /users/profile/edit        Edit profile form
POST   /users/profile/edit        Update profile
GET    /users/view/:userId        View other user profile

Admin:
GET    /users/admin/users         View all users
DELETE /users/admin/users/:id     Delete user account
```

### 11.2 Listing Routes

```
Public:
GET    /listings                  View all listings (with filters)
GET    /listings/new              New listing form
GET    /listings/:id              View listing details

Owner:
POST   /listings                  Create listing
GET    /listings/:id/edit         Edit form
PUT    /listings/:id              Update listing
DELETE /listings/:id              Delete listing

Admin:
GET    /listings/admin/all-listings   View all listings
```

### 11.3 Booking Routes

```
Customer:
GET    /bookings/listings/:id/book    Booking form
POST   /bookings/listings/:id/book    Create booking
GET    /bookings/my-bookings          View own bookings
DELETE /bookings/:id                  Cancel booking

Owner:
GET    /bookings/manage               View bookings for own listings
POST   /bookings/:id/owner-confirm    Confirm booking
POST   /bookings/:id/owner-reject     Reject booking

Admin:
GET    /bookings/admin/bookings           View all bookings
POST   /bookings/:id/confirm              Confirm booking
POST   /bookings/:id/reject               Reject booking
DELETE /bookings/:id/admin-delete         Delete booking
```

### 11.4 Payment Routes

```
Customer:
GET    /payments/booking/:bookingId        Payment form
POST   /payments/booking/:bookingId/process Process payment
GET    /payments/upi-scanner/:bookingId    UPI scanner page
POST   /payments/upi-scanner/:bookingId/complete UPI payment
GET    /payments/success/:bookingId        Success page
GET    /payments/history                   Payment history

Admin:
GET    /payments/admin/payments            View all payments
```

### 11.5 Review Routes

```
POST   /listings/:id/reviews              Create review
DELETE /listings/:id/reviews/:reviewId    Delete review
```

### 11.6 Chat Routes

```
GET    /chat/booking/:bookingId                Get/create chat
POST   /chat/booking/:bookingId/message       Send message
GET    /chat/unread-count                     Get unread count
```

### 11.7 Bot Routes

```
POST   /bot/chat                          Send message to bot
GET    /bot/history/:sessionId            Get conversation history
POST   /bot/reset                         Reset conversation
```

---

## 12. FUTURE SCOPE

### 12.1 Short-term Enhancements (3-6 months)

1. **Advanced Search & Filters**
   - Date range filtering
   - Price range slider
   - Amenities filter (WiFi, Kitchen, AC, etc.)
   - Ratings-based filtering
   - Property type filtering

2. **Enhanced Payment Integration**
   - Credit/Debit card payments
   - Wallet integration
   - Payment gateway (Stripe, PayPal, Razorpay)
   - Multiple currency support
   - Partial refund facility

3. **Improved User Features**
   - Wishlist/favorites functionality
   - Email notifications for deals
   - Saved search preferences
   - User recommendations
   - Guest history tracking

4. **Better Communication**
   - Real-time chat using WebSockets (Socket.io)
   - Video call integration (Twilio)
   - Email integration in chat
   - Message read receipts
   - Typing indicators

### 12.2 Medium-term Enhancements (6-12 months)

1. **AI & Machine Learning**
   - Advanced NLP for bot
   - ML-based personalized recommendations
   - Predictive pricing algorithm
   - Fraud detection system
   - Sentiment analysis for reviews

2. **Mobile Application**
   - iOS native app (React Native)
   - Android native app (React Native)
   - Mobile-specific features
   - Push notifications
   - Offline support

3. **Advanced Admin Features**
   - Real-time analytics dashboard
   - Data export (CSV, PDF)
   - Advanced reporting tools
   - Bulk operations (edit many listings)
   - KPI tracking and insights

4. **Quality Control**
   - Host verification process
   - ID verification for guests
   - Property documentation system
   - Insurance integration
   - Dispute resolution system

### 12.3 Long-term Vision (12+ months)

1. **Internationalization**
   - Multi-language support (i18n)
   - Multi-currency support
   - Regional payment methods
   - Local compliance tools
   - Country-specific regulations

2. **Advanced Features**
   - Virtual property tours (360° videos)
   - AR/VR viewing experience
   - AI property enhancement suggestions
   - Smart pricing based on demand
   - Dynamic availability calendar

3. **Business Expansion**
   - Corporate stays program
   - Corporate account management
   - Bulk booking system
   - Custom contracts/T&Cs
   - Business analytics API

4. **Community Building**
   - User forum/community
   - Host training programs
   - Guest loyalty program
   - Referral system
   - Community events

5. **Scaling Infrastructure**
   - Microservices architecture
   - Load balancing (Nginx, HAProxy)
   - Message queue (RabbitMQ, Apache Kafka)
   - Caching layer (Redis)
   - CDN integration
   - Database sharding for scalability

### 12.4 Emerging Technologies

1. **Blockchain Integration**
   - Smart contracts for escrow
   - Transparent transaction history
   - Cryptocurrency payments
   - Decentralized ownership records

2. **IoT Integration**
   - Smart door locks
   - Smart thermostats
   - Automated check-in/check-out
   - Real-time property monitoring
   - Damage detection systems

3. **Advanced Analytics**
   - Behavior analysis
   - Market trend prediction
   - Competition analysis
   - Demand forecasting
   - Revenue optimization

---

## 13. PROJECT STATISTICS

### 13.1 Code Metrics

- **Total Routes:** 50+
- **Total Controllers:** 8
- **Total Models:** 8
- **Total Middleware Functions:** 8+
- **Total API Endpoints:** 50+
- **Lines of Backend Code:** 5000+

### 13.2 Feature Count

- **Core Features:** 10
- **Sub-features:** 40+
- **Admin Functions:** 20+
- **User Roles:** 3 (Guest, Host, Admin)

### 13.3 Technology Stack Size

- **Backend Dependencies:** 20+
- **Frontend Libraries:** 5+ (via CDN)
- **External Services:** 5+ (Cloudinary, Mapbox, Brevo, etc.)

---

## 14. CONCLUSION

### 14.1 Project Summary

Wanderlust is a **complete, production-ready MERN stack application** that demonstrates full-stack web development capabilities. It successfully replicates the core functionality of Airbnb while incorporating modern technologies like cloud storage, geolocation, automated email notifications, and AI-powered recommendations.

### 14.2 Key Achievements

✅ **Full MERN Implementation**
   - Clean, modular architecture
   - Scalable code structure
   - Proper separation of concerns

✅ **Complete Feature Set**
   - User authentication and authorization
   - Property management system
   - Sophisticated booking workflow
   - Multiple payment methods
   - Real-time chat system
   - AI recommendation engine
   - Comprehensive admin panel

✅ **Production-Ready**
   - Error handling and logging
   - Database validation and indexing
   - Security measures (password hashing, session management)
   - Email notifications
   - Cloud integration

✅ **User Experience**
   - Intuitive interface
   - Responsive design
   - Real-time feedback
   - Multi-step workflows
   - Clear error messages

### 14.3 Learning Outcomes

This project is an excellent resource for learning:
1. **Full-stack web development** with MERN
2. **Database design and optimization** with MongoDB
3. **API development** with Express.js
4. **Authentication systems** with Passport.js
5. **Cloud services integration** (Cloudinary, Mapbox, Brevo)
6. **MVC architecture** and design patterns
7. **Middleware development** and request processing
8. **Email automation** and notification systems
9. **Geolocation services** and mapping
10. **Admin dashboard development**

### 14.4 Future Potential

With the solid foundation established, Wanderlust can be extended to include:
- Real-time features using WebSockets
- Machine learning-based recommendations
- Mobile applications (React Native)
- Blockchain integration for trust
- IoT integration for smart properties
- Advanced analytics and business intelligence

### 14.5 Recommendations for Improvement

1. **Code Quality**
   - Add unit tests (Jest, Mocha)
   - Add integration tests
   - Implement ESLint for code quality
   - Add API documentation (Swagger/OpenAPI)

2. **Performance**
   - Implement caching (Redis)
   - Optimize database queries
   - Add pagination to listings
   - Implement image lazy loading

3. **Security**
   - Add rate limiting
   - Implement CSRF protection
   - Add input sanitization
   - Implement 2FA for admins
   - Add API key authentication

4. **User Experience**
   - Add dark mode theme
   - Implement notification center
   - Add booking calendar view
   - Improve mobile responsiveness
   - Add multi-language support

### 14.6 Final Words

Wanderlust demonstrates a comprehensive understanding of modern web development. It successfully combines frontend and backend technologies to create a fully functional, user-friendly application that solves real-world problems. The code is well-organized, maintainable, and scalable, making it suitable for further development and deployment.

Whether used as a learning resource, portfolio project, or foundation for a real business, Wanderlust provides a solid, feature-rich platform for property rental and management.

---

## APPENDIX A: PROJECT FILE STRUCTURE

```
Air-Bnb-Mern/
├── app.js                          # Main application file
├── package.json                    # Dependencies and scripts
├── .env                            # Environment variables
├── cloudConfig.js                  # Cloudinary configuration
├── middleware.js                   # Custom middleware functions
├── schema.js                       # Joi validation schemas
│
├── controllers/                    # Business logic
│   ├── listings.js
│   ├── bookings.js
│   ├── payments.js
│   ├── reviews.js
│   ├── chat.js
│   ├── users.js
│   ├── userProfiles.js
│   └── recommendationBot.js
│
├── models/                         # Database schemas
│   ├── user.js
│   ├── listing.js
│   ├── booking.js
│   ├── payment.js
│   ├── review.js
│   ├── chat.js
│   └── botConversation.js
│
├── routes/                         # API routes
│   ├── listing.js
│   ├── booking.js
│   ├── payment.js
│   ├── reviews.js
│   ├── chat.js
│   ├── user.js
│   └── bot.js
│
├── utils/                          # Utility functions
│   ├── emailService.js
│   ├── wrapAsync.js
│   └── ExpressError.js
│
├── views/                          # EJS templates
│   ├── layouts/
│   │   └── boilerplate.ejs
│   ├── includes/
│   │   ├── navbar.ejs
│   │   ├── footer.ejs
│   │   ├── flash.ejs
│   │   └── bot.ejs
│   ├── listings/
│   │   ├── index.ejs
│   │   ├── show.ejs
│   │   ├── new.ejs
│   │   ├── edit.ejs
│   │   ├── adminListings.ejs
│   ├── bookings/
│   │   ├── new.ejs
│   │   ├── myBookings.ejs
│   │   ├── ownerBookings.ejs
│   │   ├── adminBookings.ejs
│   │   └── chat.ejs
│   ├── payments/
│   │   ├── paymentForm.ejs
│   │   ├── upiScanner.ejs
│   │   ├── paymentSuccess.ejs
│   │   ├── paymentHistory.ejs
│   │   └── adminPayments.ejs
│   ├── users/
│   │   ├── signup.ejs
│   │   ├── login.ejs
│   │   ├── profile.ejs
│   │   ├── editProfile.ejs
│   │   ├── viewProfile.ejs
│   │   └── adminUsers.ejs
│   └── err.ejs
│
└── public/                         # Static files
    ├── css/
    │   ├── style.css
    │   ├── chat.css
    │   ├── bot.css
    │   └── rating.css
    └── js/
        ├── script.js
        ├── chat.js
        ├── bot.js
        ├── map.js
        ├── locationPicker.js
        └── expressclass.js
```

---

## APPENDIX B: API Documentation Example

### Creating a Listing (Authenticated User)

**Endpoint:** `POST /listings`

**Authentication:** Required (isLoggedIn)

**Request Body:**
```json
{
  "listing": {
    "title": "Cozy Beach House",
    "description": "Beautiful property with sea view",
    "location": "Goa, India",
    "country": "India",
    "price": 2500,
    "category": "Amazing Pools",
    "maxGuests": 4,
    "ownerUpiId": "owner@okhdfcbank"
  },
  "listing[image]": "<file>"
}
```

**Response (Success - 200):**
```json
{
  "message": "New listing created!",
  "listingId": "65a8c2d1e4b5f3c2a1b2c3d4",
  "redirect": "/listings"
}
```

**Response (Error - 400):**
```json
{
  "error": "Price must be at least ₹300"
}
```

---

**Document Complete**

This comprehensive report covers all aspects of the Wanderlust MERN project, suitable for college submission, portfolio demonstration, or project documentation purposes.

**Report Size:** 20+ pages (8000+ words)  
**Last Updated:** 2024  
**Project Status:** Production Ready

---

