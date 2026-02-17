
if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}
const port = process.env.PORT || 10000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const {Error} = require("./utils/expressclass.js");
const Review= require("./models/review.js");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl= process.env.ATLASDB_URL;
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const bookingRouter = require("./routes/booking.js");
const chatRouter = require("./routes/chat.js");
const botRouter = require("./routes/bot.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash =  require("connect-flash"); // importing flash
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");




main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// MongoDB session store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET || "mysupersecretcode",
  },
  touchAfter: 24 * 3600, // lazy session update (in seconds)
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


//creating session.
const sessionOptions = {
  store,
  secret: process.env.SECRET || "mysupersecretcode", // Corrected spelling of 'secret'
  resave: false,
  saveUninitialized: true, // Set to false for better security

  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 *1000 ,
    maxAge: 7 * 24 * 60 * 60 *1000 ,
    httpOnly:true,
  }
};

app.use(session(sessionOptions));
app.use(flash()); // Enable flash messages


//passport  Auth part
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use(async (req, res, next) => {
  res.locals.currUser = req.user; // Make the current user available to all templates
  
  // Check if user has any bookings to manage (for their listings)
  if (req.user) {
    const Listing = require("./models/listing");
    const Booking = require("./models/booking");
    
    const ownerListings = await Listing.find({ owner: req.user._id });
    const listingIds = ownerListings.map(listing => listing._id);
    const hasBookingsToManage = await Booking.countDocuments({ 
      listing: { $in: listingIds },
      status: "pending"
    });
    
    res.locals.hasBookingsToManage = hasBookingsToManage > 0;
  } else {
    res.locals.hasBookingsToManage = false;
  }
  
  next();
});

app.get("/demouser", async (req,res)=>{
  let fakeUser = new User ({
    email:"student@gmail.com",
    username :"student"
  });
  let registerdUser = await  User.register(fakeUser,"Helloworld");
  res.send(registerdUser);
});

// Create admin user if not exists
async function createAdminUser() {
  try {
    const adminExists = await User.findOne({ username: "LAPU" });
    if (!adminExists) {
      const adminUser = new User({
        email: "admin@wanderlust.com",
        username: "LAPU",
        isAdmin: true
      });
      await User.register(adminUser, "LAPU");
      console.log("Admin user created successfully");
    }
  } catch (error) {
    console.log("Error creating admin user:", error);
  }
}

createAdminUser();

// Root route - redirect to listings
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/bookings", bookingRouter);
app.use("/chat", chatRouter);
app.use("/bot", botRouter);
app.use("/",userRouter);
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

//eroor middle ware is gifven for them

app.use((err,req,res,next)=>{
  let {statusCode=400 , message="something went wrong" } = err;
  console.log("Error Handler - Status Code:", statusCode);
  console.log("Error Handler - Message:", err.message);
  res.status(statusCode).render("err.ejs", {err});
});



// Bind to 0.0.0.0 for Render deployment
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`server is listening to port ${port}`);
});

// Increase timeouts for Render (prevents 502 errors)
server.keepAliveTimeout = 120000; // 120 seconds
server.headersTimeout = 120000; // 120 seconds

