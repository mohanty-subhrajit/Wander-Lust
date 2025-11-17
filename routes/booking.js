const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isAdmin, isBookingCustomer, isListingOwner } = require("../middleware.js");
const bookingController = require("../controllers/bookings.js");

// User routes
router.get("/listings/:id/book", isLoggedIn, wrapAsync(bookingController.renderBookingForm));
router.post("/listings/:id/book", isLoggedIn, wrapAsync(bookingController.createBooking));
router.get("/my-bookings", isLoggedIn, wrapAsync(bookingController.myBookings));
router.delete("/:id", isLoggedIn, isBookingCustomer, wrapAsync(bookingController.cancelBooking));

// Owner routes - Manage bookings for their listings
router.get("/manage", isLoggedIn, wrapAsync(bookingController.ownerBookings));
router.post("/:id/owner-confirm", isLoggedIn, isListingOwner, wrapAsync(bookingController.ownerConfirmBooking));
router.post("/:id/owner-reject", isLoggedIn, isListingOwner, wrapAsync(bookingController.ownerRejectBooking));

// Admin routes
router.get("/admin/bookings", isLoggedIn, isAdmin, wrapAsync(bookingController.allBookings));
router.post("/:id/confirm", isLoggedIn, isAdmin, wrapAsync(bookingController.confirmBooking));
router.post("/:id/reject", isLoggedIn, isAdmin, wrapAsync(bookingController.rejectBooking));
router.delete("/:id/admin-delete", isLoggedIn, isAdmin, wrapAsync(bookingController.deleteBooking));

module.exports = router;
