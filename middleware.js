const Listing = require("./models/listing");
const Booking = require("./models/booking");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const  Review = require("./models/review.js");

  module.exports.isLoggedIn=(req,res,next) =>{
     if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","You must be Logged in Before Creating New Lsiting");
    return res.redirect("/login");
  }
next();

  };

  module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
  };

  //chekiing the owners of the listing to
  module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    
    if(!listing){
      req.flash("error","Listing not found!");
      return res.redirect("/listings");
    }
    
    // Allow admin to edit/delete any listing
    if(res.locals.currUser && res.locals.currUser.isAdmin){
      return next();
    }
    
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","You are not the owner of this listing");
      return res.redirect(`/listings/${id}`);
    }
    next();
  };

  // Check if user is admin
  module.exports.isAdmin = (req, res, next) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      req.flash("error", "You must be an admin to access this page");
      return res.redirect("/listings");
    }
    next();
  };


  //validate listing
  
  module.exports. validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
      const msg = error.details.map(detail => detail.message).join(", ");
    //   console.log("Validation Error:", msg);
    //   const err = new Error(msg);
    //   err.statusCode = 400;
    //   next(err);

    throw new ExpressError(400,msg);
    } else {
      next();
    }  
  };

//joi validaction of reviews
  module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      const err = new Error(errMsg);
      err.statusCode = 400;
      next(err);
    }else{
      next();
    }
  };

  module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    
    if (!review) {
      req.flash("error", "Review not found!");
      return res.redirect(`/listings/${id}`);
    }

    if (res.locals.currUser && res.locals.currUser.isAdmin) {
    return next();
    }
    
    if (!review.author || !review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the author of this review");
      return res.redirect(`/listings/${id}`);
    }

    next();
  };

  // Check if user is the customer of the booking
  module.exports.isBookingCustomer = async (req, res, next) => {
    let { id } = req.params;
    let booking = await Booking.findById(id);
    
    if (!booking) {
      req.flash("error", "Booking not found!");
      return res.redirect("/bookings/my-bookings");
    }
    
    // Allow admin to manage any booking
    if (res.locals.currUser && res.locals.currUser.isAdmin) {
      return next();
    }
    
    if (!booking.customer.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not authorized to manage this booking");
      return res.redirect("/bookings/my-bookings");
    }

    next();
  };

  // Check if user is the owner of the listing for the booking
  module.exports.isListingOwner = async (req, res, next) => {
    let { id } = req.params;
    let booking = await Booking.findById(id).populate("listing");
    
    if (!booking) {
      req.flash("error", "Booking not found!");
      return res.redirect("/bookings/manage");
    }
    
    // Allow admin to manage any booking
    if (res.locals.currUser && res.locals.currUser.isAdmin) {
      return next();
    }
    
    if (!booking.listing.owner.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not authorized to manage this booking");
      return res.redirect("/bookings/manage");
    }

    next();
  };