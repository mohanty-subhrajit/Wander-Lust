const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isAdmin } = require("../middleware.js");
const paymentController = require("../controllers/payments.js");

// Payment routes
router.get("/booking/:bookingId", isLoggedIn, wrapAsync(paymentController.renderPaymentForm));
router.post("/booking/:bookingId/process", isLoggedIn, wrapAsync(paymentController.processPayment));
router.get("/upi-scanner/:bookingId", isLoggedIn, wrapAsync(paymentController.showUpiScanner));
router.post("/upi-scanner/:bookingId/complete", isLoggedIn, wrapAsync(paymentController.completeUpiPayment));
router.get("/success/:bookingId", isLoggedIn, wrapAsync(paymentController.paymentSuccess));
router.get("/history", isLoggedIn, wrapAsync(paymentController.paymentHistory));

// Admin routes
router.get("/admin/payments", isLoggedIn, isAdmin, wrapAsync(paymentController.adminPayments));

module.exports = router;
