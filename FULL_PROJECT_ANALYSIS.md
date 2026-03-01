# 🏠 WanderLust – Full Stack Property Booking Platform

## Complete Project Analysis & Documentation

---

## 📌 Opening Introduction

**WanderLust** is a full-stack web application inspired by Airbnb, built using the **MERN stack (MongoDB, Express.js, React-flavored EJS Templates, Node.js)**. This project demonstrates a real-world property listing, booking, and management platform where users can list their properties, book stays at other properties, communicate via live chat, and get smart property recommendations through an AI-powered chatbot.

The application implements **role-based access control** with three distinct user types — **Guest (unauthenticated), Logged-in User, and Admin** — each with tailored permissions. It features a robust booking lifecycle (pending → confirmed/rejected), live chat between property owners and guests, an intelligent recommendation bot, geolocation-powered interactive maps, cloud-based image management, and a responsive UI built with Bootstrap 5.

**Key Highlights:**
- Full CRUD operations on Listings, Reviews, Bookings, and Users
- Room availability management with slot-based booking prevention
- Authentication & Authorization using Passport.js
- Cloud image uploads via Cloudinary
- Interactive maps with Mapbox
- Live chat system between guests and hosts
- AI-powered property recommendation chatbot
- Admin panel with full management controls
- Responsive design (mobile + desktop)
- Deployed on Render with MongoDB Atlas

---

## 🛠️ Technology Stack

| Technology | Purpose | Where Used |
|---|---|---|
| **Node.js** (v22.19.0) | Runtime environment | Server-side execution (`app.js`) |
| **Express.js** (v5.1.0) | Web framework | Routing, middleware, HTTP handling (`app.js`, `routes/`) |
| **MongoDB** | NoSQL Database | Data persistence via MongoDB Atlas (`models/`) |
| **Mongoose** (v8.19.2) | ODM for MongoDB | Schema definition, queries, validation (`models/`) |
| **EJS** (v3.1.10) | Templating engine | Server-side HTML rendering (`views/`) |
| **ejs-mate** (v4.0.0) | EJS layout support | Boilerplate layout system (`views/layouts/boilerplate.ejs`) |
| **Passport.js** (v0.7.0) | Authentication | User login/signup/session (`app.js`, `routes/user.js`) |
| **passport-local** | Local auth strategy | Username/password authentication |
| **passport-local-mongoose** (v8.0.0) | Mongoose-Passport plugin | Auto password hashing, user methods (`models/user.js`) |
| **Cloudinary** (v1.41.3) | Cloud image storage | Image uploads for listings (`cloudConfig.js`) |
| **multer** (v2.0.2) | File upload middleware | Handling multipart form data (`routes/listing.js`) |
| **multer-storage-cloudinary** | Cloudinary storage engine for multer | Direct Cloudinary uploads (`cloudConfig.js`) |
| **Mapbox SDK** (v0.16.2) | Geocoding & Maps | Forward geocoding, interactive maps (`controllers/listings.js`, `public/js/map.js`) |
| **Joi** (v18.0.1) | Schema validation | Server-side input validation (`schema.js`) |
| **connect-flash** (v0.1.1) | Flash messages | Success/error notifications (`app.js`, `views/includes/flash.ejs`) |
| **express-session** (v1.18.2) | Session management | User sessions, cookies (`app.js`) |
| **connect-mongo** (v5.1.0) | MongoDB session store | Persistent sessions in MongoDB (`app.js`) |
| **method-override** (v3.0.0) | HTTP method override | PUT/DELETE support in forms (`app.js`) |
| **dotenv** (v17.2.3) | Environment variables | Secret management (`.env`) |
| **uuid** (v13.0.0) | Unique ID generation | Bot conversation session IDs (`controllers/recommendationBot.js`) |
| **Bootstrap 5.3.8** | CSS framework | Responsive UI, components (CDN in `boilerplate.ejs`) |
| **Font Awesome 6.5.1** | Icon library | Icons throughout UI (CDN in `boilerplate.ejs`) |
| **Mapbox GL JS** (v3.17.0) | Interactive maps | Map rendering on listing show page (`public/js/map.js`) |

---

## 📁 Project Structure – Detailed File Analysis

### Root Files

| File | Purpose |
|---|---|
| `app.js` | Main entry point — configures Express, middleware, database, sessions, Passport, routes, and starts the server on port 10000 |
| `middleware.js` | Custom middleware — `isLoggedIn`, `isOwner`, `isAdmin`, `isBookingCustomer`, `isListingOwner`, `validateListing`, `validateReview`, `isReviewAuthor` |
| `schema.js` | Joi validation schemas for server-side validation of Listings (title, description, location, country, price, image, category, availableSlots) and Reviews (rating, comment) |
| `cloudConfig.js` | Configures Cloudinary cloud storage and Multer-Cloudinary storage engine for image uploads |
| `package.json` | Dependencies, scripts, Node.js engine version |
| `.env` | Environment variables (ATLASDB_URL, SECRET, CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET, MAP_TOKEN) |
| `cleanDB.js` | Database cleanup utility |
| `fixImageUrls.js` | Utility to fix image URL inconsistencies |

---

### 📂 models/ — Database Schemas (Mongoose)

#### `models/listing.js` — Listing Model
- **Fields:** `title` (String, required, max 30), `description` (String), `image` (Object with filename and url, has default), `price` (Number, required, min ₹300), `location` (String), `country` (String), `reviews` (Array of Review ObjectIds), `owner` (User ObjectId), `geometry` (GeoJSON Point with coordinates), `category` (String enum: Trending, Rooms, Iconic cities, mountains, castles, Amazing Pools, camping, farms, Arctic, Boats House), `availableSlots` (Number, required, min 0, default 1)
- **Post-delete hook:** When a listing is deleted (`findOneAndDelete`), all associated reviews are cascade-deleted
- **Used in:** `controllers/listings.js`, `controllers/bookings.js`, `controllers/recommendationBot.js`, `app.js`

#### `models/user.js` — User Model
- **Fields:** `email` (String, required), `googleId` (String, default null), `isAdmin` (Boolean, default false)
- **Plugin:** `passport-local-mongoose` — automatically adds `username`, `password` (hashed), `salt` fields and authentication methods (`authenticate()`, `register()`, `serializeUser()`, `deserializeUser()`)
- **Timestamps:** enabled (`createdAt`, `updatedAt`)
- **Used in:** `app.js` (Passport config), `controllers/users.js`, `middleware.js`

#### `models/booking.js` — Booking Model
- **Fields:** `listing` (Listing ObjectId, required), `customer` (User ObjectId, required), `checkIn` (Date, required, must be today or future), `checkOut` (Date, required, must be after checkIn), `guests` (Number, required, min 1), `totalPrice` (Number, required), `status` (String enum: pending/confirmed/rejected, default "pending"), `createdAt` (Date, default now)
- **Validation:** Custom validators for date logic
- **Used in:** `controllers/bookings.js`, `controllers/chat.js`, `app.js`

#### `models/review.js` — Review Model
- **Fields:** `comment` (String), `rating` (Number, min 1, max 5), `createAt` (Date, default now), `author` (User ObjectId)
- **Used in:** `controllers/reviews.js`, `controllers/listings.js` (populated), `models/listing.js` (cascade delete)

#### `models/chat.js` — Chat Model
- **Fields:** `booking` (Booking ObjectId, required, unique), `participants` (Array of User ObjectIds), `messages` (Array of subdocuments: sender, content, timestamp, isRead), `lastMessage` (Date)
- **Index:** on `participants` for faster queries
- **Used in:** `controllers/chat.js`

#### `models/botConversation.js` — Bot Conversation Model
- **Fields:** `sessionId` (String, required, unique), `user` (User ObjectId, optional), `messages` (Array of subdocuments: sender [bot/user], message, timestamp), `context` (Object: location, minPrice, maxPrice, guests, country, step), `createdAt` (Date), `lastActivity` (Date)
- **TTL Index:** Auto-deletes conversations older than 7 days
- **Used in:** `controllers/recommendationBot.js`

---

### 📂 controllers/ — Business Logic

#### `controllers/listings.js` — Listing Controller
| Function | Route | Description |
|---|---|---|
| `index` | GET `/listings` | Fetches all listings with optional category filter and country search (?category=X&search=Y) |
| `renderNewForm` | GET `/listings/new` | Renders the create listing form |
| `showListing` | GET `/listings/:id` | Shows listing details with populated reviews (with authors) and owner |
| `createListing` | POST `/listings` | Geocodes location via Mapbox, uploads image to Cloudinary, saves listing with owner, geometry, and available slots |
| `renderEditForm` | GET `/listings/:id/edit` | Shows edit form with current listing data and resized preview image |
| `updateListing` | PUT `/listings/:id` | Updates listing fields, re-geocodes location, updates image if new file uploaded, saves available slots |
| `deleteListing` | DELETE `/listings/:id` | Deletes listing (triggers cascade review delete) |

#### `controllers/bookings.js` — Booking Controller
| Function | Route | Description |
|---|---|---|
| `renderBookingForm` | GET `/bookings/listings/:id/book` | Shows booking form; blocks if no slots available |
| `createBooking` | POST `/bookings/listings/:id/book` | Creates booking with date/guest validation, price calculation; prevents self-booking and blocks if no slots available |
| `myBookings` | GET `/bookings/my-bookings` | Shows current user's bookings sorted by newest |
| `allBookings` | GET `/bookings/admin/bookings` | Admin: shows all bookings with customer & listing details |
| `confirmBooking` | POST `/bookings/:id/confirm` | Admin: confirms booking, decrements available slots |
| `rejectBooking` | POST `/bookings/:id/reject` | Admin: rejects booking |
| `deleteBooking` | DELETE `/bookings/:id/admin-delete` | Admin: permanently deletes booking, restores slot if confirmed |
| `cancelBooking` | DELETE `/bookings/:id` | User cancels own booking, restores slot if confirmed |
| `ownerBookings` | GET `/bookings/manage` | Owner: shows bookings for all their listings |
| `ownerConfirmBooking` | POST `/bookings/:id/owner-confirm` | Owner: confirms booking for their listing, decrements available slots |
| `ownerRejectBooking` | POST `/bookings/:id/owner-reject` | Owner: rejects booking for their listing |

#### `controllers/users.js` — User Controller
| Function | Route | Description |
|---|---|---|
| `renderSignupForm` | GET `/signup` | Renders signup page |
| `signup` | POST `/signup` | Registers user, auto-logs in, redirects to listings |
| `renderLoginForm` | GET `/login` | Renders login page |
| `login` | POST `/login` | Handles login redirect |
| `logout` | GET `/logout` | Logs out user, destroys session |
| `allUsers` | GET `/users/admin/users` | Admin: lists all users |
| `deleteUser` | DELETE `/users/admin/users/:id` | Admin: cascade-deletes user + their listings, bookings, reviews |

#### `controllers/reviews.js` — Review Controller
| Function | Route | Description |
|---|---|---|
| `createReview` | POST `/listings/:id/reviews` | Creates review with rating and comment, links to listing |
| `deleteReview` | DELETE `/listings/:id/reviews/:reviewId` | Removes review from listing and deletes review document |

#### `controllers/chat.js` — Live Chat Controller
| Function | Route | Description |
|---|---|---|
| `getChat` | GET `/chat/booking/:bookingId` | Gets or creates chat for confirmed booking; marks messages as read; checks auth (customer/owner/admin) |
| `sendMessage` | POST `/chat/booking/:bookingId/message` | Adds message to chat; validates sender is participant; returns JSON response |
| `getUnreadCount` | GET `/chat/unread-count` | Returns total unread message count for current user (JSON) |

#### `controllers/recommendationBot.js` — AI Recommendation Bot
- **Rule-based NLP system** with intent detection for: greeting, location, price, guests, recommend, restart
- **Entity extraction functions:**
  - `extractLocation()` — Parses location from natural language ("in Mumbai", "near Delhi")
  - `extractPrice()` — Parses price ranges ("under 5000", "3000 to 8000", numbers)
  - `extractGuests()` — Parses guest count including word numbers ("three", "4 people")
- **`findRecommendations()`** — Queries MongoDB with regex location match and price range filter, returns top 5 sorted by price
- **Conversation context** tracks: location, minPrice, maxPrice, guests, step
- **Endpoints:** `POST /bot/chat` (send message), `GET /bot/history/:sessionId` (get history), `POST /bot/reset` (reset conversation)
- **Sessions** stored in MongoDB with 7-day auto-expiry (TTL index)

---

### 📂 routes/ — Express Routers

#### `routes/listing.js`
- Uses `multer` middleware for image upload to Cloudinary
- **Routes:**
  - `GET /listings` → index (all listings)
  - `POST /listings` → create listing (isLoggedIn, validateListing, upload)
  - `GET /listings/new` → new form (isLoggedIn)
  - `GET /listings/:id` → show
  - `PUT /listings/:id` → update (isLoggedIn, isOwner, upload, validateListing)
  - `DELETE /listings/:id` → delete (isLoggedIn, isOwner)
  - `GET /listings/:id/edit` → edit form (isLoggedIn, isOwner)

#### `routes/booking.js`
- **User routes:** Book form, create booking, my bookings, cancel booking
- **Owner routes:** Manage bookings, confirm/reject
- **Admin routes:** All bookings view, confirm/reject/delete
- **Middleware:** isLoggedIn, isAdmin, isBookingCustomer, isListingOwner

#### `routes/reviews.js`
- `POST /listings/:id/reviews` → create review (isLoggedIn, validateReview)
- `DELETE /listings/:id/reviews/:reviewId` → delete review (isLoggedIn, isReviewAuthor)
- Uses `mergeParams: true` for accessing parent route params

#### `routes/user.js`
- `GET/POST /signup` → signup
- `GET/POST /login` → login (with Passport authenticate)
- `GET /logout` → logout
- `GET /users/admin/users` → admin user list
- `DELETE /users/admin/users/:id` → admin delete user

#### `routes/chat.js`
- `GET /chat/booking/:bookingId` → get/create chat
- `POST /chat/booking/:bookingId/message` → send message
- `GET /chat/unread-count` → get unread count

#### `routes/bot.js`
- `POST /bot/chat` → chat with bot
- `GET /bot/history/:sessionId` → get conversation history
- `POST /bot/reset` → reset conversation

---

### 📂 middleware.js — Custom Middleware Functions

| Middleware | Purpose | Used In |
|---|---|---|
| `isLoggedIn` | Checks if user is authenticated via Passport; saves redirect URL for post-login redirect | All protected routes |
| `saveRedirectUrl` | Preserves redirect URL from session to `res.locals` after Passport auth clears session | Login route |
| `isOwner` | Checks if current user owns the listing OR is admin; restricts edit/delete | Listing update/delete routes |
| `isAdmin` | Checks if user has `isAdmin: true`; restricts admin-only routes | Admin routes |
| `validateListing` | Validates listing data against Joi schema; throws 400 error if invalid | Create/update listing |
| `validateReview` | Validates review data against Joi schema | Create review |
| `isReviewAuthor` | Checks if current user is review author OR admin | Delete review |
| `isBookingCustomer` | Checks if current user is the booking's customer OR admin | Cancel booking |
| `isListingOwner` | Checks if current user owns the listing associated with a booking OR admin | Owner confirm/reject booking |

---

### 📂 views/ — EJS Templates

#### Layout System
- **`views/layouts/boilerplate.ejs`** — Master layout with HTML head (Bootstrap 5 CSS, Font Awesome, Google Fonts, Mapbox GL CSS/JS), navbar, flash messages, content body, footer, bot widget, Bootstrap JS bundle, and custom script.js

#### Includes (Partials)
| File | Description |
|---|---|
| `views/includes/navbar.ejs` | Responsive navigation bar with: brand logo, Explore link, My Bookings, Manage Bookings (with "New" badge for pending), Admin links (All Bookings, All Users), search bar (country search), "WanderLust your home" (create listing), Signup/Login/Logout |
| `views/includes/flash.ejs` | Dismissible Bootstrap alerts for success (green) and error (red) flash messages |
| `views/includes/footer.ejs` | Footer with social icons (Instagram, Facebook, LinkedIn), copyright, Privacy/Terms links |
| `views/includes/bot.ejs` | Recommendation bot floating widget — toggle button, chat window with header/messages/input, quick actions, recommendations panel. Loads `bot.css` and `bot.js` |

#### Listing Views
| File | Description |
|---|---|
| `views/listings/index.ejs` | Listings grid with category filter bar (Trending, Rooms, Mountains, etc. with icons), tax toggle switch, responsive card grid showing images and titles |
| `views/listings/new.ejs` | Create listing form with: title, description, image upload, price (min ₹300), country, location, category dropdown, **available slots/rooms field** |
| `views/listings/edit.ejs` | Edit listing form with pre-filled values, original image preview, same fields as new + **editable available slots** |
| `views/listings/show.ejs` | Listing detail page with: image, owner name, description, price, location, country, **availability badge** (green for available / red for fully booked), Book Now button (disabled if no slots), Edit/Delete (for owner/admin), Review form with star rating, All reviews section, Mapbox interactive map |

#### Booking Views
| File | Description |
|---|---|
| `views/bookings/new.ejs` | Booking form with: listing preview card (image, title, location, price, **available rooms badge**), check-in date, check-out date, guest count, client-side date validation |
| `views/bookings/myBookings.ejs` | User's bookings with listing images, dates, guests, price, status badges (Pending/Confirmed/Rejected), cancel button, chat link for confirmed bookings |
| `views/bookings/ownerBookings.ejs` | Owner booking management with tabs (All, Pending, Confirmed, Rejected), confirm/reject actions, chat link for confirmed, responsive table + mobile cards |
| `views/bookings/adminBookings.ejs` | Admin view of all bookings with customer details, confirm/reject/delete actions, responsive table + mobile cards |
| `views/bookings/chat.ejs` | Live chat interface with: property info, other participant name, message thread (sent/received styling), message input form, auto-scroll, 3-second polling for new messages |

#### User Views
| File | Description |
|---|---|
| `views/users/signup.ejs` | Signup form with username, email, password validation |
| `views/users/login.ejs` | Login form with username, password |
| `views/users/adminUsers.ejs` | Admin user management table with username, email, admin status, join date, delete button (protected admin account) |

---

### 📂 public/ — Static Assets

#### `public/js/script.js`
- Bootstrap form validation — prevents submission of invalid forms, adds `was-validated` class for visual feedback

#### `public/js/map.js`
- Initializes Mapbox GL JS map on listing show page
- Centers on listing's geocoded coordinates
- Adds red marker with popup showing listing title

#### `public/js/chat.js`
- Live chat client-side logic
- Sends messages via `fetch()` POST to `/chat/booking/:bookingId/message`
- Renders messages dynamically with sender name, timestamp, sent/received styling
- Polls for new messages every 3 seconds (page reload)
- XSS prevention with HTML escaping

#### `public/js/bot.js`
- Recommendation bot client-side logic
- Manages bot window toggle, minimize, close
- Sends messages via `fetch()` POST to `/bot/chat`
- Renders bot/user messages with typing indicator animation
- Displays property recommendation cards with images, links, prices
- Quick suggestion buttons for contextual prompts
- Session persistence via `localStorage`

#### `public/css/style.css` — Main stylesheet
#### `public/css/rating.css` — Starability star rating styles
#### `public/css/chat.css` — Chat interface styles
#### `public/css/bot.css` — Recommendation bot widget styles

---

### 📂 init/ — Database Initialization

#### `init/data.js`
- Contains sample listing data (20 properties across multiple countries)
- Each listing has: title, description, image (Unsplash URL), price, location, country

#### `init/index.js`
- Connects to local MongoDB
- Clears all existing listings
- Seeds database with sample data, assigning a default owner

---

### 📂 utils/ — Utility Functions

#### `utils/ExpressError.js`
- Custom error class extending `Error`
- Properties: `statusCode`, `message`
- Used throughout controllers for error handling

#### `utils/wrapAsync.js`
- Higher-order function that wraps async route handlers
- Catches rejected promises and passes to Express error handler via `next()`
- Eliminates try/catch blocks in every async route

---

## 🔐 Authentication & Authorization System

### Authentication Flow
1. **Signup:** Username + Email + Password → `passport-local-mongoose` hashes password → auto login → redirect to listings
2. **Login:** Passport `LocalStrategy` authenticates → session created → stored in MongoDB via `connect-mongo`
3. **Session:** Cookies valid for 7 days (`httpOnly: true`), stored in MongoDB Atlas
4. **Logout:** Session destroyed, redirect to listings

### Authorization Levels

| Role | Permissions |
|---|---|
| **Guest** | View listings, view listing details, search/filter listings |
| **Logged-in User** | All Guest + Create listings, Book listings, Leave reviews, View own bookings, Cancel bookings, Chat (confirmed bookings), Use recommendation bot |
| **Listing Owner** | All User + Edit/Delete own listings, Manage bookings for own listings, Confirm/Reject bookings, Chat with guests, **Edit available slots** |
| **Admin (LAPU)** | All Owner + Edit/Delete ANY listing, Delete ANY review, Manage ALL bookings (confirm/reject/delete), View/Delete ALL users, **Edit available slots for any listing** |

### Admin Account
- Username: `LAPU`, auto-created on server start if not exists
- Has `isAdmin: true` in database
- Protected from deletion

---

## 🏗️ Application Flow

### 1. Listing Creation Flow
```
User clicks "WanderLust your home" → Login check → New listing form (title, description, image, price, country, location, category, available slots) → Image uploaded to Cloudinary → Location geocoded via Mapbox → Listing saved to MongoDB with owner reference
```

### 2. Booking Flow
```
User views listing → Clicks "Book Now" (blocked if no slots) → Booking form → Date/guest validation → Booking created (status: pending) → Owner/Admin sees in Manage Bookings → Confirm (available slots decremented) or Reject → User sees status in My Bookings → If confirmed, Chat enabled
```

### 3. Available Slots Flow (NEW FEATURE)
```
Owner sets available rooms when creating listing → 
When booking is Confirmed → Slot count decremented by 1 →
When slot count reaches 0 → "Fully Booked" shown, "Book Now" disabled →
Owner/Admin can edit listing to increase slots →
Cancelled/Deleted confirmed bookings restore slot count
```

### 4. Review Flow
```
User visits listing page → Star rating + Comment → Review saved with author → Displayed on listing page → Owner/Admin can delete reviews
```

### 5. Chat Flow
```
Booking confirmed → Chat button appears → Click opens chat room → Messages sent via AJAX fetch → Stored in MongoDB → Other party sees messages (polled every 3s) → Messages marked as read
```

### 6. Bot Recommendation Flow
```
User clicks bot icon → Greeting message → User provides location/budget/guests → Bot detects intent via NLP → Extracts entities → Queries MongoDB → Returns top 5 listings as cards → User can restart or refine search
```

---

## 🔑 Environment Variables (`.env`)

| Variable | Purpose |
|---|---|
| `ATLASDB_URL` | MongoDB Atlas connection string |
| `SECRET` | Session encryption secret |
| `CLOUD_NAME` | Cloudinary cloud name |
| `CLOUD_API_KEY` | Cloudinary API key |
| `CLOUD_API_SECRET` | Cloudinary API secret |
| `MAP_TOKEN` | Mapbox access token for geocoding and maps |

---

## 🌐 API Endpoints Summary

### Listings
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/listings` | No | All listings (filter: ?category=X&search=Y) |
| GET | `/listings/new` | Yes | New listing form |
| POST | `/listings` | Yes | Create listing |
| GET | `/listings/:id` | No | Show listing |
| GET | `/listings/:id/edit` | Yes (Owner/Admin) | Edit form |
| PUT | `/listings/:id` | Yes (Owner/Admin) | Update listing (inc. available slots) |
| DELETE | `/listings/:id` | Yes (Owner/Admin) | Delete listing |

### Reviews
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/listings/:id/reviews` | Yes | Create review |
| DELETE | `/listings/:id/reviews/:reviewId` | Yes (Author/Admin) | Delete review |

### Bookings
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/bookings/listings/:id/book` | Yes | Booking form (blocked if no slots) |
| POST | `/bookings/listings/:id/book` | Yes | Create booking |
| GET | `/bookings/my-bookings` | Yes | My bookings |
| DELETE | `/bookings/:id` | Yes (Customer/Admin) | Cancel booking |
| GET | `/bookings/manage` | Yes (Owner) | Owner's booking management |
| POST | `/bookings/:id/owner-confirm` | Yes (Owner) | Owner confirm (decrements slot) |
| POST | `/bookings/:id/owner-reject` | Yes (Owner) | Owner reject |
| GET | `/bookings/admin/bookings` | Yes (Admin) | All bookings |
| POST | `/bookings/:id/confirm` | Yes (Admin) | Admin confirm (decrements slot) |
| POST | `/bookings/:id/reject` | Yes (Admin) | Admin reject |
| DELETE | `/bookings/:id/admin-delete` | Yes (Admin) | Admin delete (restores slot if confirmed) |

### Chat
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/chat/booking/:bookingId` | Yes (Participant/Admin) | Open chat |
| POST | `/chat/booking/:bookingId/message` | Yes (Participant) | Send message (JSON) |
| GET | `/chat/unread-count` | Yes | Unread message count (JSON) |

### Bot
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/bot/chat` | No | Send message to bot (JSON) |
| GET | `/bot/history/:sessionId` | No | Get conversation history |
| POST | `/bot/reset` | No | Reset conversation |

### Users
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET/POST | `/signup` | No | Register |
| GET/POST | `/login` | No | Login |
| GET | `/logout` | Yes | Logout |
| GET | `/users/admin/users` | Yes (Admin) | All users |
| DELETE | `/users/admin/users/:id` | Yes (Admin) | Delete user |

---

## 🏨 Available Slots / Room Availability Feature

### How It Works
1. **When creating a listing**, the owner specifies the number of available rooms/slots (minimum 1)
2. The `availableSlots` field is stored in the Listing model in MongoDB
3. **When a booking is confirmed** (by owner or admin), the slot count is decremented by 1
4. **When slots reach 0:**
   - The listing show page displays "Fully Booked" badge (red)
   - The "Book Now" button is disabled and shows "Fully Booked"
   - New booking attempts are blocked at both form render and form submission
   - Flash error message: "Sorry, this property is fully booked!"
5. **When a confirmed booking is cancelled or deleted**, the slot is restored (+1)
6. **Owner and Admin can edit** the available slots count from the Edit Listing page to increase capacity

### Technical Implementation
- **Model:** `availableSlots` field in `models/listing.js` (Number, required, min 0, default 1)
- **Validation:** Joi schema in `schema.js` validates `availableSlots` as integer ≥ 0
- **Booking creation check:** `controllers/bookings.js` → `renderBookingForm()` and `createBooking()` check `availableSlots > 0`
- **Slot decrement:** On confirm in `confirmBooking()` and `ownerConfirmBooking()`
- **Slot restore:** On cancel in `cancelBooking()` and admin delete in `deleteBooking()`
- **UI:** Show page badge, booking form badge, disabled button when fully booked

---

## 🗄️ Database Design (MongoDB Collections)

### Entity Relationship
```
User (1) ──────── owns ──────── (N) Listing
User (1) ──────── writes ─────── (N) Review
User (1) ──────── makes ──────── (N) Booking
Listing (1) ───── has ──────── (N) Review
Listing (1) ───── has ──────── (N) Booking
Booking (1) ───── has ──────── (1) Chat
Chat (1) ──────── has ──────── (N) Message
User (1) ──────── participates ─ (N) Chat
BotConversation ── independent ── session-based
```

---

## 🔒 Security Features

1. **Password Hashing** — Passport-local-mongoose uses PBKDF2 with salt
2. **Session Security** — `httpOnly: true` cookies, MongoDB-backed sessions, encrypted with secret
3. **Input Validation** — Joi schema validation on all listing and review inputs
4. **XSS Prevention** — EJS auto-escapes `<%= %>` output; manual HTML escaping in chat/bot JS
5. **CSRF-like Protection** — Method override requires `_method` query parameter
6. **Authorization Checks** — Every protected route has middleware verification
7. **Admin Protection** — Admin account (LAPU) cannot be deleted
8. **Owner Verification** — Listings can only be edited/deleted by their owner or admin
9. **Booking Self-Protection** — Users cannot book their own listings

---

## 📱 Responsive Design

- **Bootstrap 5** grid system (col-12, col-md-*, col-lg-*)
- **Desktop:** Table views for admin/owner booking management
- **Mobile:** Card-based views for bookings, listings in single column
- **Category filters:** Horizontal scrollable on mobile
- **Navbar:** Collapsible with hamburger menu on mobile
- **Chat:** Full-width on all devices

---

## 🚀 Deployment Configuration

- **Platform:** Render (cloud hosting)
- **Bind address:** `0.0.0.0` (required for Render)
- **Port:** `process.env.PORT || 10000`
- **Keep-alive timeout:** 120 seconds (prevents 502 errors)
- **Headers timeout:** 120 seconds
- **Database:** MongoDB Atlas (cloud)
- **Images:** Cloudinary (cloud)
- **Sessions:** Stored in MongoDB Atlas via `connect-mongo`
- **Node.js:** v22.19.0

---

## 📊 Feature Summary Table

| Feature | Technology Used | Files Involved |
|---|---|---|
| User Registration/Login | Passport.js, passport-local-mongoose | `models/user.js`, `controllers/users.js`, `routes/user.js`, `views/users/` |
| Listing CRUD | Express, Mongoose, Cloudinary, Mapbox | `models/listing.js`, `controllers/listings.js`, `routes/listing.js`, `views/listings/` |
| Image Upload | Multer, Cloudinary | `cloudConfig.js`, `routes/listing.js` |
| Interactive Maps | Mapbox GL JS, Mapbox Geocoding SDK | `controllers/listings.js`, `public/js/map.js`, `views/listings/show.ejs` |
| Review System | Mongoose, Joi validation, Starability CSS | `models/review.js`, `controllers/reviews.js`, `routes/reviews.js`, `views/listings/show.ejs` |
| Booking System | Mongoose, date validation | `models/booking.js`, `controllers/bookings.js`, `routes/booking.js`, `views/bookings/` |
| Room Availability | Mongoose, slot management | `models/listing.js`, `controllers/bookings.js`, `views/listings/show.ejs`, `views/bookings/new.ejs` |
| Live Chat | Express, Mongoose, Fetch API, Polling | `models/chat.js`, `controllers/chat.js`, `routes/chat.js`, `public/js/chat.js`, `views/bookings/chat.ejs` |
| Recommendation Bot | Rule-based NLP, UUID, Mongoose | `models/botConversation.js`, `controllers/recommendationBot.js`, `routes/bot.js`, `public/js/bot.js`, `views/includes/bot.ejs` |
| Admin Panel | Express middleware, EJS | `middleware.js` (isAdmin), `controllers/users.js`, `controllers/bookings.js`, `views/users/adminUsers.ejs`, `views/bookings/adminBookings.ejs` |
| Category Filtering | Express query params, Mongoose regex | `controllers/listings.js`, `views/listings/index.ejs` |
| Country Search | Express query params, Mongoose regex | `controllers/listings.js`, `views/includes/navbar.ejs` |
| Flash Messages | connect-flash, Bootstrap alerts | `app.js`, `views/includes/flash.ejs` |
| Form Validation (Client) | Bootstrap 5 validation, custom JS | `public/js/script.js`, form `novalidate` + `needs-validation` classes |
| Form Validation (Server) | Joi schemas | `schema.js`, `middleware.js` |
| Tax Toggle | Vanilla JS | `views/listings/index.ejs` |
| Session Management | express-session, connect-mongo | `app.js` |

---

## 🎓 Concepts & Patterns Used

1. **MVC Architecture** — Models, Views, Controllers separated
2. **RESTful Routing** — Standard REST conventions for all CRUD operations
3. **Middleware Pattern** — Custom authentication/authorization middleware chain
4. **Template Engine** — Server-side rendering with EJS + ejs-mate layouts
5. **ODM Pattern** — Mongoose schemas with validation, hooks, and virtuals
6. **Error Handling** — Centralized error handler with custom ExpressError class
7. **Async/Await** — All database operations use async/await with wrapAsync
8. **Cloud Storage** — Cloudinary for image hosting (no local storage)
9. **Geocoding** — Mapbox forward geocoding for location coordinates
10. **Session-based Auth** — Server-side sessions with MongoDB store
11. **Role-Based Access Control** — Guest, User, Owner, Admin hierarchy
12. **Flash Messages** — Server-to-client notification pattern
13. **Method Override** — PUT/DELETE from HTML forms via query param
14. **Schema Validation** — Double validation (Joi server-side + Bootstrap client-side)
15. **Cascade Deletes** — Listing delete removes reviews; User delete removes listings, bookings, reviews
16. **Intent-based Chatbot** — Rule-based NLP with entity extraction
17. **AJAX Communication** — Fetch API for chat and bot (no page reload)
18. **Polling** — 3-second interval polling for chat message updates
19. **GeoJSON** — Standard format for geospatial data (Point type)
20. **TTL Index** — Auto-expiry for bot conversations (7 days)

---

## ⚡ How to Run Locally

```bash
# 1. Clone the repository
git clone <repo-url>
cd Air-Bnb-Mern

# 2. Install dependencies
npm install

# 3. Create .env file with:
ATLASDB_URL=<your-mongodb-atlas-url>
SECRET=<your-session-secret>
CLOUD_NAME=<your-cloudinary-name>
CLOUD_API_KEY=<your-cloudinary-key>
CLOUD_API_SECRET=<your-cloudinary-secret>
MAP_TOKEN=<your-mapbox-token>

# 4. (Optional) Seed database
cd init && node index.js

# 5. Start the server
npm start
# Server runs on http://localhost:10000
```

---

*This document was generated as a complete project analysis for major project presentation.*
*WanderLust — Full Stack Property Booking Platform | Built with MERN Stack*
