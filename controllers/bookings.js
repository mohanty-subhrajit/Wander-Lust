const Booking = require("../models/booking");
const Listing = require("../models/listing");

// Show booking form
module.exports.renderBookingForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("bookings/new.ejs", { listing });
};

// Create booking
module.exports.createBooking = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("owner");
  
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Prevent owner from booking their own listing
  if (listing.owner._id.equals(req.user._id)) {
    req.flash("error", "You cannot book your own listing!");
    return res.redirect(`/listings/${id}`);
  }

  const { checkIn, checkOut, guests } = req.body.booking;
  
  // Calculate total price
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  const totalPrice = days * listing.price;

  const newBooking = new Booking({
    listing: id,
    customer: req.user._id,
    checkIn,
    checkOut,
    guests,
    totalPrice,
    status: "pending"
  });

  await newBooking.save();
  req.flash("success", "Booking request submitted! Waiting for confirmation.");
  res.redirect("/bookings/my-bookings");
};

// Show user's bookings
module.exports.myBookings = async (req, res) => {
  const bookings = await Booking.find({ customer: req.user._id })
    .populate("listing")
    .sort({ createdAt: -1 });
  res.render("bookings/myBookings.ejs", { bookings });
};

// Admin: Show all bookings
module.exports.allBookings = async (req, res) => {
  const bookings = await Booking.find({})
    .populate("listing")
    .populate("customer")
    .sort({ createdAt: -1 });
  res.render("bookings/adminBookings.ejs", { bookings });
};

// Admin: Confirm booking
module.exports.confirmBooking = async (req, res) => {
  let { id } = req.params;
  await Booking.findByIdAndUpdate(id, { status: "confirmed" });
  req.flash("success", "Booking confirmed!");
  res.redirect("/bookings/admin/bookings");
};

// Admin: Reject booking
module.exports.rejectBooking = async (req, res) => {
  let { id } = req.params;
  await Booking.findByIdAndUpdate(id, { status: "rejected" });
  req.flash("success", "Booking rejected!");
  res.redirect("/bookings/admin/bookings");
};

// Admin: Delete booking
module.exports.deleteBooking = async (req, res) => {
  let { id } = req.params;
  await Booking.findByIdAndDelete(id);
  req.flash("success", "Booking deleted permanently!");
  res.redirect("/bookings/admin/bookings");
};

// Cancel booking
module.exports.cancelBooking = async (req, res) => {
  let { id } = req.params;
  await Booking.findByIdAndDelete(id);
  req.flash("success", "Booking cancelled!");
  res.redirect("/bookings/my-bookings");
};

// Owner: Show bookings for owner's listings
module.exports.ownerBookings = async (req, res) => {
  // Find all listings owned by the current user
  const ownerListings = await Listing.find({ owner: req.user._id });
  const listingIds = ownerListings.map(listing => listing._id);
  
  // Find all bookings for those listings
  const bookings = await Booking.find({ listing: { $in: listingIds } })
    .populate("listing")
    .populate("customer")
    .sort({ createdAt: -1 });
  
  res.render("bookings/ownerBookings.ejs", { bookings });
};

// Owner: Confirm booking for their listing
module.exports.ownerConfirmBooking = async (req, res) => {
  let { id } = req.params;
  const booking = await Booking.findById(id).populate("listing");
  
  // Check if the current user owns the listing
  if (!booking.listing.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission to manage this booking");
    return res.redirect("/bookings/manage");
  }
  
  await Booking.findByIdAndUpdate(id, { status: "confirmed" });
  req.flash("success", "Booking confirmed!");
  res.redirect("/bookings/manage");
};

// Owner: Reject booking for their listing
module.exports.ownerRejectBooking = async (req, res) => {
  let { id } = req.params;
  const booking = await Booking.findById(id).populate("listing");
  
  // Check if the current user owns the listing
  if (!booking.listing.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission to manage this booking");
    return res.redirect("/bookings/manage");
  }
  
  await Booking.findByIdAndUpdate(id, { status: "rejected" });
  req.flash("success", "Booking rejected!");
  res.redirect("/bookings/manage");
};
