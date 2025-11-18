const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// Create Review
module.exports.createReview = async (req, res) => {
  console.log("Creating review - req.user:", req.user);
  
  if (!req.user || !req.user._id ) {
    req.flash("error", "You must be logged in to create a review");
    return res.redirect("/login");
  }


  
  let listing = await Listing.findById(req.params.id); 
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  
  console.log("Review author set to:", newReview.author);
  
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  
  console.log("Review saved:", newReview);
  
  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${listing._id}`);
};

// Delete Review
module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted");

  res.redirect(`/listings/${id}`);
};
