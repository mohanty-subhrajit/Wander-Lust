const Listing = require("./models/listing");
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

  module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    
    if(!listing){
      req.flash("error","Listing not found!");
      return res.redirect("/listings");
    }
    
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","You are not the owner of this listing");
      return res.redirect(`/listings/${id}`);
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
    
    if (!review.author || !review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the author of this review");
      return res.redirect(`/listings/${id}`);
    }

    next();
  };