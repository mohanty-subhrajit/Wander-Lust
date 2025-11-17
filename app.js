
if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const {Error} = require("./utils/expressclass.js");
const Review= require("./models/review.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const session = require("express-session");
const flash =  require("connect-flash"); // importing flash
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js")




main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


//creating session.
const sessionOptions = {
  secret: "mysupersecretcode", // Corrected spelling of 'secret'
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

app.use((req, res, next) => {
  res.locals.currUser = req.user; // Make the current user available to all templates
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



app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
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



app.listen(8080, () => {
  console.log("server is listening to port 8080");
});

