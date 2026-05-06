# 🔒 JOI & PASSPORT - Complete Explanation

## 📋 Table of Contents
1. [What is Joi?](#what-is-joi)
2. [Why Joi is Used](#why-joi-is-used)
3. [Joi in Wanderlust](#joi-in-wanderlust)
4. [What is Passport?](#what-is-passport)
5. [Why Passport is Used](#why-passport-is-used)
6. [Passport in Wanderlust](#passport-in-wanderlust)
7. [Authentication Flow](#authentication-flow)

---

# 🔍 Part 1: JOI - Data Validation Library

## What is Joi?

**Joi** is a validation library that checks if data meets certain requirements.

```
Without Joi:
User submits form → Save directly to database ❌
Problems: Invalid data saved, hacks possible

With Joi:
User submits form → Joi validates → Save if valid ✅
Benefits: Clean data, security, error messages
```

---

## Why Joi is Used?

### **Problem 1: Invalid Data**

```javascript
// Without Joi validation
User submits:
{
  title: "",                    // Empty title (invalid!)
  price: "abc",                 // Text instead of number
  maxGuests: -5                 // Negative guests (invalid!)
}
// Gets saved to DB ❌
```

### **Problem 2: Security Issues**

```javascript
// User could submit:
{
  title: "<script>alert('hack')</script>",  // XSS attack
  price: 999999999,                         // Huge price
  email: "invalid-email"                    // Bad format
}
// Without validation, all saved ❌
```

### **Problem 3: No Error Messages**

```javascript
// Without validation:
if (req.body.title === "") {
  // Check title
}
if (typeof req.body.price !== 'number') {
  // Check price type
}
if (req.body.price < 300) {
  // Check price minimum
}
// Lots of code ❌

// With Joi:
joi.object({
  title: joi.string().required(),
  price: joi.number().required().min(300)
})
// Clean, reusable ✅
```

---

## Joi in Wanderlust

### **File: schema.js**

```javascript
const joi = require('joi');

module.exports.listingSchema = joi.object({
    listing : joi.object({
        title: joi.string().required().max(30),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required().max(27),
        price: joi.number().required().min(300),
        image: joi.string().allow("", null),
        category: joi.string().allow("", null).invalid("Trending"),
        maxGuests: joi.number().integer().min(1).default(1),
        ownerUpiId: joi.string().allow("", null).pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/).messages({
            "string.pattern.base": "Please enter a valid UPI ID (e.g., yourname@bankname)"
        })
    }).required()
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required(),
    }).required()
});

module.exports.profileSchema = joi.object({
    profile: joi.object({
        mobileNumber: joi.string().allow("", null).pattern(/^\d{10}$/).messages({
            "string.pattern.base": "Mobile number must be 10 digits"
        }),
        bio: joi.string().allow("", null).max(500),
        address: joi.string().allow("", null).max(200),
        upiId: joi.string().allow("", null).pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/).messages({
            "string.pattern.base": "Please enter a valid UPI ID (e.g., yourname@bankname)"
        })
    }).required()
});
```

---

## Joi Rules Explained

### **Listing Schema Breakdown**

```javascript
title: joi.string().required().max(30)
├─ joi.string()         → Must be text
├─ .required()          → Cannot be empty
└─ .max(30)             → Maximum 30 characters

price: joi.number().required().min(300)
├─ joi.number()         → Must be number
├─ .required()          → Cannot be empty
└─ .min(300)            → Minimum ₹300

maxGuests: joi.number().integer().min(1).default(1)
├─ joi.number()         → Must be number
├─ .integer()           → Must be whole number (not 1.5)
├─ .min(1)              → At least 1 guest
└─ .default(1)          → Default is 1 if not provided

ownerUpiId: joi.string().allow("", null).pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/)
├─ joi.string()         → Text
├─ .allow("", null)     → Can be empty or null
└─ .pattern(regex)      → Must match: name@bank format
   Example: john@upi ✅, invalid@format ❌

category: joi.string().allow("", null).invalid("Trending")
├─ joi.string()         → Text
├─ .allow("", null)     → Can be empty
└─ .invalid("Trending") → Cannot be "Trending" (reserved for algorithm)
```

### **Review Schema**

```javascript
rating: joi.number().required().min(1).max(5)
├─ Must be number
├─ Must be provided
├─ Must be 1, 2, 3, 4, or 5

comment: joi.string().required()
├─ Must be text
└─ Must be provided
```

### **Profile Schema**

```javascript
mobileNumber: joi.string().allow("", null).pattern(/^\d{10}$/)
├─ Must be 10 digits
└─ Pattern: 9876543210 ✅, 98765 ❌, abc1234567 ❌

bio: joi.string().allow("", null).max(500)
├─ Can be any text
└─ Maximum 500 characters

address: joi.string().allow("", null).max(200)
├─ Can be any text
└─ Maximum 200 characters

upiId: joi.string().allow("", null).pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/)
└─ Pattern: john.doe@upi ✅, invalid format ❌
```

---

## How Joi is Used in Middleware

### **File: middleware.js:58-71**

```javascript
module.exports.validateListing = (req, res, next) => {
  // Validate request body against listingSchema
  let { error } = listingSchema.validate(req.body);
  
  if (error) {
    // Extract error messages
    const msg = error.details.map(detail => detail.message).join(", ");
    
    // Throw error with custom code
    throw new ExpressError(400, msg);
  } else {
    // Validation passed, continue
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    const err = new Error(errMsg);
    err.statusCode = 400;
    next(err);
  } else {
    next();
  }
};

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

---

## How Routes Use Joi Validation

### **Listing Routes with Joi**

**File: routes/listing.js:13**

```javascript
router.post(
  "/listings",
  isLoggedIn,
  validateListing,     // ← Joi validation middleware
  upload.single("listing[image]"),
  createListing
);
```

**Flow:**
```
User submits form
    ↓
Express receives POST /listings
    ↓
1. isLoggedIn check → User logged in?
    ↓
2. validateListing (Joi) → Data valid?
    ├─ Title required? ✅
    ├─ Price >= 300? ✅
    ├─ Country max 27 chars? ✅
    ├─ If any fails ❌
    │   └─ Throw 400 error
    │   └─ Show error message
    │   └─ Stop! Don't continue!
    │
    └─ If all pass ✅
        └─ Continue to next middleware

    ↓
3. File upload (Multer)
    ↓
4. Create listing
```

---

## Example: Validation in Action

### **Valid Request ✅**

```javascript
POST /listings
Body: {
  listing: {
    title: "Beach House",        // ✅ String, < 30 chars
    description: "Nice beach",   // ✅ String
    location: "Goa",             // ✅ String
    country: "India",            // ✅ String, < 27 chars
    price: 5000,                 // ✅ Number, >= 300
    maxGuests: 4,                // ✅ Integer, >= 1
    category: "Beach House"      // ✅ String (not "Trending")
  }
}

Result:
Joi validation passes ✅
→ Continue to controller
→ Listing saved to database
```

### **Invalid Request ❌**

```javascript
POST /listings
Body: {
  listing: {
    title: "",                   // ❌ Empty (required)
    description: "Nice beach",   // ✅
    location: "Goa",             // ✅
    country: "India",            // ✅
    price: 100,                  // ❌ Less than min(300)
    maxGuests: -1,               // ❌ Less than min(1)
    category: "Trending"         // ❌ Invalid("Trending")
  }
}

Result:
Joi validation fails ❌
→ Errors found:
   - "title" is required
   - "price" must be >= 300
   - "maxGuests" must be >= 1
   - "category" contains invalid value
→ Status 400 sent to frontend
→ Listing NOT saved
→ User sees error messages
```

---

## Joi Error Message Example

```javascript
// Custom error message for UPI ID
ownerUpiId: joi.string().allow("", null).pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/).messages({
  "string.pattern.base": "Please enter a valid UPI ID (e.g., yourname@bankname)"
})

// If user enters "invalid-format"
Error: "Please enter a valid UPI ID (e.g., yourname@bankname)"
       ^ Custom message instead of technical error
```

---

# 🔑 Part 2: PASSPORT - Authentication Library

## What is Passport?

**Passport** is an authentication library that handles user login/logout using strategies.

```
Without Passport:
Manual password hashing, session management, serialization ❌
Lots of code, error-prone

With Passport:
Built-in password hashing, session handling, strategies ✅
Clean, secure, reusable
```

---

## Why Passport is Used?

### **Problem 1: Password Security**

```javascript
// Without Passport (WRONG ❌):
if (req.body.password === storedPassword) {
  // User logged in
}
// Problem: Passwords stored in plain text = HUGE SECURITY RISK!

// With Passport:
User.authenticate(password)  // Automatically hashes & compares
// Problem solved ✅
```

### **Problem 2: Session Management**

```javascript
// Without Passport:
// Manually create session, store user ID, serialize/deserialize
// Lots of code ❌

// With Passport:
app.use(passport.initialize());
app.use(passport.session());
// Automatic session management ✅
```

### **Problem 3: User Identification**

```javascript
// Without Passport:
// Manually check if user in session, load user data
// Complex logic ❌

// With Passport:
req.user  // Automatically populated after login
// Available everywhere ✅
```

---

## Passport in Wanderlust

### **Step 1: Setup in Models**

**File: models/user.js:1-55**

```javascript
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: { type: String, required: true },
  googleId: { type: String, default: null },
  isAdmin: { type: Boolean, default: false },
  mobileNumber: { type: String, default: null },
  profilePhoto: {
    filename: { type: String, default: null },
    url: { type: String, default: null }
  },
  bio: { type: String, default: null },
  address: { type: String, default: null },
  upiId: { type: String, default: null }
}, { timestamps: true });

// Add Passport plugin - adds password hashing & methods
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
```

**What `passportLocalMongoose` plugin adds:**

```javascript
// Methods automatically added to User model:

User.register(user, password)    // Hash password & save user
User.authenticate(password)      // Verify password
User.serializeUser()             // Store user in session
User.deserializeUser()           // Load user from session

// Fields automatically added:
User.username                    // Username (unique)
User.password                    // Hashed password (never plain text)
User.salt                        // Salt for hashing
```

---

### **Step 2: Configuration in app.js**

**File: app.js:22-90**

```javascript
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// ========== SESSION SETUP ==========
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,  // Lazy session update
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,  // Prevent XSS
  }
};

app.use(session(sessionOptions));

// ========== PASSPORT SETUP ==========
app.use(passport.initialize());           // Initialize Passport
app.use(passport.session());              // Use sessions for persistence

// Use LocalStrategy (username/password)
passport.use(new LocalStrategy(User.authenticate()));

// Serialize user (store in session)
passport.serializeUser(User.serializeUser());

// Deserialize user (load from session)
passport.deserializeUser(User.deserializeUser());
```

**What each line does:**

```javascript
app.use(passport.initialize())
└─ Initialize Passport.js middleware

app.use(passport.session())
└─ Enable persistent login sessions

passport.use(new LocalStrategy(User.authenticate()))
└─ Strategy: username + password authentication
└─ User.authenticate() = Built-in Passport-Mongoose method

passport.serializeUser(User.serializeUser())
└─ When user logs in:
   └─ Store minimal data in session (usually user ID)
   └─ Result: req.session.passport.user = userId

passport.deserializeUser(User.deserializeUser())
└─ On each request:
   └─ Load full user from database using stored ID
   └─ Result: req.user = Full user object
```

---

### **Step 3: Signup Controller**

**File: controllers/users.js:12-30**

```javascript
module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    
    // Create new user object
    const newUser = new User({ email, username });
    
    // Register user - Passport-Mongoose handles:
    // 1. Hashes password
    // 2. Stores username (unique)
    // 3. Saves to database
    const registeredUser = await User.register(newUser, password);
    
    // Automatically login after signup
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      // req.user is now populated
      // Session is created automatically
      
      req.flash("success", "Welcome to Wanderlust");
      return res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("/signup");
  }
};
```

**What happens:**

```
1. User submits signup form:
   {
     username: "john_doe",
     email: "john@example.com",
     password: "MySecret123"
   }

2. User.register() (Passport-Mongoose):
   └─ Hash password: "MySecret123" → "bcrypt_hash_abc123xyz"
   └─ Save to DB:
      {
        username: "john_doe",
        email: "john@example.com",
        password: "bcrypt_hash_abc123xyz",
        salt: "salt_value"
      }

3. req.login() (Passport):
   └─ Serialize user: store user ID in session
   └─ Result: req.session.passport.user = userId

4. req.user is available:
   └─ On all future requests from this user
   └─ Automatically deserialized from session

5. Redirect to /listings
   └─ User is now logged in
```

---

### **Step 4: Login Controller**

**File: controllers/users.js:38-41**

```javascript
module.exports.login = (req, res) => {
  req.flash("success", "Welcome Back!");
  res.redirect(res.locals.redirectUrl || "/listings");
};
```

**But the real login happens in the route:**

**File: routes/user.js:18-27**

```javascript
router.post(
  "/login",
  saveRedirectUrl,                              // Save original URL
  passport.authenticate("local", {              // ← Passport middleware
    failureRedirect: '/login',
    failureFlash: true
  }),
  userController.login
);
```

**What `passport.authenticate("local")` does:**

```
1. Middleware intercepts POST /login

2. Extracts username & password from req.body

3. Calls User.authenticate():
   └─ Finds user by username in database
   └─ Hashes submitted password
   └─ Compares with stored hash
   
4. If matches:
   └─ Calls req.login() automatically
   └─ Creates session
   └─ Continues to next middleware
   └─ loginController.login() runs
   └─ Redirects to /listings

5. If doesn't match:
   └─ Redirects to /login (failureRedirect)
   └─ Shows error flash message
   └─ User not logged in
```

---

### **Step 5: Logout Controller**

**File: controllers/users.js:44-52**

```javascript
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out");
    return res.redirect("/listings");
  });
};
```

**What `req.logout()` does:**

```
1. Clears req.user object
   └─ req.user = undefined

2. Destroys session data
   └─ Session removed from MongoDB

3. Clears session cookie
   └─ Browser cookie deleted

Result: User is logged out
```

---

## How Passport Maintains Login State

### **After User Logs In**

```
1. Session Created in MongoDB:
   {
     _id: "session_id_xyz",
     session: {
       passport: {
         user: ObjectId("user_123")  ← User ID stored
       }
     },
     expires: 2024-05-12T10:00:00Z
   }

2. Browser Cookie Set:
   Set-Cookie: connect.sid=session_id_xyz

3. Every Request:
   ├─ Browser sends: Cookie: connect.sid=session_id_xyz
   ├─ Express retrieves session from MongoDB
   ├─ Passport deserializes user:
   │  └─ Looks up user_123 in database
   │  └─ Sets req.user = Full user object
   └─ req.user available in controller!

4. Login State Example:

   GET /listings
   ├─ Cookie: connect.sid=xyz
   ├─ Session lookup: { user: ObjectId("user_123") }
   ├─ Deserialize: req.user = { username: "john", ... }
   └─ Controller can access req.user!

   GET /profile
   ├─ Cookie: connect.sid=xyz
   ├─ Session lookup: { user: ObjectId("user_123") }
   ├─ Deserialize: req.user = { username: "john", ... }
   └─ isLoggedIn check passes ✅

   After req.logout():
   ├─ Session deleted from MongoDB
   ├─ Cookie deleted from browser
   ├─ req.user = undefined
   └─ isLoggedIn check fails ❌
```

---

## Passport Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                  PASSPORT FLOW                              │
└─────────────────────────────────────────────────────────────┘

=== SIGNUP ===

User submits signup form
├─ username: "john"
├─ email: "john@example.com"
└─ password: "Secret123"

    ↓
POST /users/signup
    ↓
User.register(user, password)
├─ Hash password: "Secret123" → "bcrypt_xyz"
├─ Save: {
│    username: "john",
│    email: "john@example.com",
│    password: "bcrypt_xyz"
│  }
└─ Return registered user
    ↓
req.login(registeredUser)
├─ Serialize user
├─ Store user ID in session
└─ Set cookie
    ↓
req.user = user object
    ↓
Redirect to /listings ✅


=== LOGIN ===

User submits login form
├─ username: "john"
└─ password: "Secret123"

    ↓
POST /login
    ↓
passport.authenticate("local")
├─ Find user by username
├─ Hash submitted password
├─ Compare with stored hash
│  ├─ If match ✅
│  │  └─ Continue
│  └─ If no match ❌
│     └─ Redirect /login
    ↓
req.login()
├─ Serialize user
├─ Store user ID in session
└─ Set cookie
    ↓
req.user = user object
    ↓
loginController.login()
    ↓
Redirect to /listings ✅


=== EACH REQUEST (Logged In User) ===

GET /listings
    ↓
Browser sends:
Cookie: connect.sid=session_id_xyz
    ↓
Express retrieves session from MongoDB
    ↓
Passport deserializes:
├─ Get user ID from session
├─ Query database
└─ Set req.user = User object
    ↓
Controller can use req.user ✅


=== LOGOUT ===

GET /logout
    ↓
req.logout()
├─ Delete session from MongoDB
├─ Delete cookie from browser
└─ req.user = undefined
    ↓
Redirect to /listings
    ↓
All req.user checks fail ❌
```

---

## Joi vs Passport - Quick Comparison

| Feature | Joi | Passport |
|---------|-----|----------|
| **Purpose** | Data validation | User authentication |
| **When Used** | Before saving data | During login/signup |
| **Checks** | Format, type, rules | Username/password |
| **Example** | Price >= 300? | Password correct? |
| **Output** | Error messages | Session token |
| **Security** | Prevents bad data | Prevents unauthorized access |

---

## Environment Variables Required

```env
# For Passport Sessions
SECRET=your_secret_key_for_sessions

# For Database
ATLASDB_URL=mongodb+srv://user:pass@cluster.mongodb.net/wanderlust

# For Multer/Cloudinary (separate)
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret

# For Maps
MAP_TOKEN=your_mapbox_token
```

---

## Summary

### **Joi:**
✅ **Validates form data** before saving to database  
✅ Checks: required fields, type, length, format, min/max  
✅ Prevents invalid/malicious data entry  
✅ Provides user-friendly error messages  

### **Passport:**
✅ **Handles user authentication** (login/signup/logout)  
✅ Manages sessions with MongoDB store  
✅ Hashes passwords using bcrypt  
✅ Maintains login state across requests  
✅ Provides req.user object automatically  

### **Together:**
1. **Joi** validates the signup data (username format, etc.)
2. **Passport** registers the user securely
3. **Joi** validates the login data
4. **Passport** authenticates the user
5. **Passport** maintains the session
6. **Joi** validates form submissions from logged-in users

---

**Document Created:** 2026-05-05  
**Project:** Wanderlust  
**Version:** 1.0
