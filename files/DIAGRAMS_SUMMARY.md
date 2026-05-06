# Air-BnB MERN Application - ER Diagram & DFD Summary

## 📊 Entity Relationship Diagram (ER Diagram)

### Database Entities & Relationships:

**1. USER Entity**
- Primary Key: email
- Attributes: googleId, isAdmin, mobileNumber, profilePhoto, bio, address, upiId, password
- Relationships:
  - One-to-Many: owns LISTING
  - One-to-Many: makes BOOKING
  - One-to-Many: writes REVIEW
  - One-to-Many: participates in CHAT
  - One-to-Many: makes PAYMENT

**2. LISTING Entity**
- Primary Key: _id
- Attributes: title, description, image, price, location, country, geometry (geo-coordinates)
- References: owner → USER, reviews → [REVIEW]
- Relationships:
  - Many-to-One: owned by USER
  - One-to-Many: has BOOKING
  - One-to-Many: has REVIEW

**3. BOOKING Entity**
- Primary Key: _id
- Attributes: checkIn, checkOut, guests, totalPrice, status, createdAt
- References: listing → LISTING, customer → USER
- Relationships:
  - Many-to-One: from USER (customer)
  - Many-to-One: for/on LISTING
  - One-to-One: has PAYMENT
  - One-to-One: has CHAT

**4. PAYMENT Entity**
- Primary Key: _id
- Attributes: amount, status (pending/completed/failed), paymentMethod (upi/cash), upiId, transactionId, qrCode, createdAt, completedAt
- References: booking → BOOKING, customer → USER
- Relationships:
  - Many-to-One: for BOOKING
  - Many-to-One: by USER

**5. REVIEW Entity**
- Primary Key: _id
- Attributes: comment, rating (1-5), createdAt
- References: author → USER
- Relationships:
  - Many-to-One: written by USER
  - Many-to-One: for LISTING

**6. CHAT Entity**
- Primary Key: _id
- Attributes: messages (array of message objects), lastMessage
- References: booking → BOOKING (unique), participants → [USER]
- Relationships:
  - One-to-One: for BOOKING
  - Many-to-Many: involving USERS

---

## 📈 Data Flow Diagram (DFD - Level 1)

### Main Processes:

**Process 1: User Management**
- 1.1 Authentication (Login/Signup with Google OAuth or Local)
- 1.2 User Profile Management (Update profile, upload photo)
- Data Flows: User credentials → MongoDB, Profile data ↔ MongoDB, Photos → File Storage

**Process 2: Listing Management**
- 2.1 Create/Edit Listings
- 2.2 View Listings (Search & Filter by location)
- 2.3 Image Upload to Cloudinary
- Data Flows: Listing data → MongoDB, Images → Cloudinary, Query results → Client

**Process 3: Booking Management**
- 3.1 Create Booking (with date validation)
- 3.2 View Bookings (Owner view / Customer view)
- 3.3 Cancel Booking
- Data Flows: Booking request → Validate availability → MongoDB → Payment initiation

**Process 4: Payment Processing**
- 4.1 Process Payment (UPI Scanner / Cash payment)
- 4.2 View Payment History
- 4.3 Refund Processing
- Data Flows: Payment request → UPI Gateway → Update status in MongoDB → Email notification

**Process 5: Review System**
- 5.1 Add Review (Rating + Comment on completed bookings)
- 5.2 View Reviews (On listing page)
- Data Flows: Review input → Validation → MongoDB → Listing update

**Process 6: Chat & Messaging**
- 6.1 Send Message (Between guest and host)
- 6.2 View Messages (Chat history)
- Data Flows: Message → MongoDB → Real-time Socket.io update

**Process 7: Admin Operations**
- 7.1 Manage Users (View, Suspend, Delete)
- 7.2 Monitor Listings (View, Approve, Remove)
- 7.3 View All Bookings (System-wide)
- 7.4 Payment Dashboard (Revenue analytics)
- Data Flows: Admin queries → MongoDB → Reports/Analytics

### Data Stores:

1. **MongoDB** - Primary database
   - collections: users, listings, bookings, payments, reviews, chats

2. **File Storage** - Cloudinary
   - Listing images
   - User profile photos

### External Entities:

1. **Guest/Customer** - Browses listings, makes bookings, pays
2. **Host/Property Owner** - Creates listings, views bookings
3. **Admin** - Manages system, users, and payments
4. **Payment Gateway (UPI)** - Processes payments
5. **Email Service (Brevo)** - Sends confirmations & notifications

---

## 🔄 Data Flow Summary by User Type:

### Guest Flow:
```
Login → Search Listings → View Details → Make Booking → Process Payment → 
Leave Review → Chat with Host → View History
```

### Host Flow:
```
Login → Create/Edit Listings → Upload Images → View Bookings → 
Check Payments → Chat with Guests → View Reviews
```

### Admin Flow:
```
Login → Dashboard → Manage Users → Monitor Listings → View All Bookings → 
Check Payments → Analytics
```

---

## 📁 Code Organization:

- **Models/** - Database schemas (User, Listing, Booking, Payment, Review, Chat)
- **Controllers/** - Business logic and request handlers
- **Routes/** - Express route definitions
- **Views/** - EJS templates for rendering
- **Utils/** - Helper functions (Email service, Error handling)
- **Public/** - Frontend JS, CSS, images
- **Middleware/** - Authentication, validation, error handling
