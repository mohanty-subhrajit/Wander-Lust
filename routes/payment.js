const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const paymentController = require("../controllers/payments.js");

// Payment routes
router.get("/booking/:bookingId", isLoggedIn, wrapAsync(paymentController.renderPaymentForm));
router.post("/booking/:bookingId/process", isLoggedIn, wrapAsync(paymentController.processPayment));
router.get("/success/:bookingId", isLoggedIn, wrapAsync(paymentController.paymentSuccess));
router.get("/history", isLoggedIn, wrapAsync(paymentController.paymentHistory));

module.exports = router;
