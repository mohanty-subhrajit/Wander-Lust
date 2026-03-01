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
  // Check if listing has available guest capacity
  if (listing.availableGuests <= 0) {
    req.flash("error", "Sorry, this property is fully booked! No guest spots available.");
    return res.redirect(`/listings/${id}`);
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
  const guestCount = parseInt(guests);

  // Validate guest count against available capacity
  if (guestCount > listing.availableGuests) {
    req.flash("error", `Only ${listing.availableGuests} guest spot(s) available! You requested ${guestCount}.`);
    return res.redirect(`/bookings/listings/${id}/book`);
  }

  if (listing.availableGuests <= 0) {
    req.flash("error", "Sorry, this property is fully booked! No guest spots available.");
    return res.redirect(`/listings/${id}`);
  }
  
  // Validate dates
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkInDateStart = new Date(checkInDate);
  checkInDateStart.setHours(0, 0, 0, 0);
  
  // Check if check-in date is in the past
  if (checkInDateStart < today) {
    req.flash("error", "Check-in date cannot be in the past!");
    return res.redirect(`/bookings/listings/${id}/book`);
  }
  
  // Check if check-out date is after check-in date
  if (checkOutDate <= checkInDate) {
    req.flash("error", "Check-out date must be after check-in date!");
    return res.redirect(`/bookings/listings/${id}/book`);
  }
  
  // Calculate total price
  const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  const totalPrice = days * listing.price;

  const newBooking = new Booking({
    listing: id,
    customer: req.user._id,
    checkIn,
    checkOut,
    guests: guestCount,
    totalPrice,
    status: "pending"
  });

  await newBooking.save();

  // Reserve guest spots immediately on booking creation
  listing.availableGuests = Math.max(0, listing.availableGuests - guestCount);
  await listing.save();

  req.flash("success", "Booking request submitted! Your guest spots have been reserved.");
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
  const booking = await Booking.findById(id);

  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect("/bookings/admin/bookings");
  }

  // Guests already reserved at booking time, just confirm
  await Booking.findByIdAndUpdate(id, { status: "confirmed" });
  req.flash("success", "Booking confirmed!");
  res.redirect("/bookings/admin/bookings");
};

// Admin: Reject booking — restore guest spots
module.exports.rejectBooking = async (req, res) => {
  let { id } = req.params;
  const booking = await Booking.findById(id);

  if (booking && booking.status === "pending") {
    // Restore guest spots since booking was pending (reserved on creation)
    const listing = await Listing.findById(booking.listing);
    if (listing) {
      listing.availableGuests = Math.min(listing.maxGuests, listing.availableGuests + booking.guests);
      await listing.save();
    }
  }

  await Booking.findByIdAndUpdate(id, { status: "rejected" });
  req.flash("success", "Booking rejected! Guest spots have been restored.");
  res.redirect("/bookings/admin/bookings");
};

// Admin: Delete booking
module.exports.deleteBooking = async (req, res) => {
  let { id } = req.params;
  const booking = await Booking.findById(id);

  // Restore guest spots if booking was pending or confirmed
  if (booking && (booking.status === "pending" || booking.status === "confirmed")) {
    const listing = await Listing.findById(booking.listing);
    if (listing) {
      listing.availableGuests = Math.min(listing.maxGuests, listing.availableGuests + booking.guests);
      await listing.save();
    }
  }

  await Booking.findByIdAndDelete(id);
  req.flash("success", "Booking deleted permanently! Guest spots restored.");
  res.redirect("/bookings/admin/bookings");
};

// Cancel booking — restore guest spots
module.exports.cancelBooking = async (req, res) => {
  let { id } = req.params;
  const booking = await Booking.findById(id);

  // Restore guest spots if booking was pending or confirmed
  if (booking && (booking.status === "pending" || booking.status === "confirmed")) {
    const listing = await Listing.findById(booking.listing);
    if (listing) {
      listing.availableGuests = Math.min(listing.maxGuests, listing.availableGuests + booking.guests);
      await listing.save();
    }
  }

  await Booking.findByIdAndDelete(id);
  req.flash("success", "Booking cancelled! Guest spots restored.");
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

  // Guests already reserved at booking time, just confirm
  await Booking.findByIdAndUpdate(id, { status: "confirmed" });
  req.flash("success", "Booking confirmed successfully! View it in the 'Confirmed' tab or start chatting with your guest.");
  res.redirect("/bookings/manage#confirmed");
};

// Owner: Reject booking for their listing — restore guest spots
module.exports.ownerRejectBooking = async (req, res) => {
  let { id } = req.params;
  const booking = await Booking.findById(id).populate("listing");
  
  // Check if the current user owns the listing
  if (!booking.listing.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission to manage this booking");
    return res.redirect("/bookings/manage");
  }

  // Restore guest spots since booking is being rejected
  if (booking.status === "pending") {
    const listing = await Listing.findById(booking.listing._id);
    if (listing) {
      listing.availableGuests = Math.min(listing.maxGuests, listing.availableGuests + booking.guests);
      await listing.save();
    }
  }
  
  await Booking.findByIdAndUpdate(id, { status: "rejected" });
  req.flash("success", "Booking rejected. Guest spots have been restored.");
  res.redirect("/bookings/manage#rejected");
};
