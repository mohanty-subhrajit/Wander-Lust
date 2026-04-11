const Payment = require("../models/payment");
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const User = require("../models/user");
const QRCode = require('qrcode');
const { sendPaymentReceipt } = require("../utils/emailService");

// Render payment form
module.exports.renderPaymentForm = async (req, res) => {
  const { bookingId } = req.params;
  
  const booking = await Booking.findById(bookingId)
    .populate("listing")
    .populate("customer");
  
  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect("/bookings/my-bookings");
  }
  
  // Check if user is the customer
  if (!booking.customer._id.equals(req.user._id)) {
    req.flash("error", "You can only pay for your own bookings!");
    return res.redirect("/bookings/my-bookings");
  }
  
  // Check if booking is confirmed
  if (booking.status !== "confirmed") {
    req.flash("error", "Booking must be confirmed before payment!");
    return res.redirect("/bookings/my-bookings");
  }
  
  // Get listing owner's UPI ID
  const listingOwner = await User.findById(booking.listing.owner);
  
  res.render("payments/paymentForm.ejs", { booking, listingOwner });
};

// Show UPI Scanner (Dummy Page)
module.exports.showUpiScanner = async (req, res) => {
  const { bookingId } = req.params;
  const { paymentMethod } = req.query;
  
  const booking = await Booking.findById(bookingId)
    .populate("listing")
    .populate("customer");
  
  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect("/bookings/my-bookings");
  }
  
  // Check if user is the customer
  if (!booking.customer._id.equals(req.user._id)) {
    req.flash("error", "You can only pay for your own bookings!");
    return res.redirect("/bookings/my-bookings");
  }
  
  // Get listing owner's UPI ID
  const listingOwner = await User.findById(booking.listing.owner);
  
  // Generate QR code for UPI
  let qrCode = null;
  if (paymentMethod === "upi" && listingOwner && listingOwner.upiId) {
    try {
      const upiString = `upi://pay?receiver=${listingOwner.upiId}&amount=${booking.totalPrice}&tr=Wanderlust Booking`;
      qrCode = await QRCode.toDataURL(upiString);
    } catch (err) {
      console.error("QR Code generation error:", err);
    }
  }
  
  res.render("payments/upiScanner.ejs", { booking, paymentMethod, qrCode, listingOwner });
};

// Complete UPI Payment (from scanner page)
module.exports.completeUpiPayment = async (req, res) => {
  const { bookingId } = req.params;
  
  const booking = await Booking.findById(bookingId)
    .populate("listing")
    .populate("customer");
  
  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect("/bookings/my-bookings");
  }
  
  // Check if user is the customer
  if (!booking.customer._id.equals(req.user._id)) {
    req.flash("error", "You can only pay for your own bookings!");
    return res.redirect("/bookings/my-bookings");
  }
  
  try {
    // Create payment record
    const payment = new Payment({
      booking: bookingId,
      customer: req.user._id,
      amount: booking.totalPrice,
      paymentMethod: "upi",
      status: "completed"
    });
    
    // Generate QR code
    const listingOwner = await User.findById(booking.listing.owner);
    if (listingOwner && listingOwner.upiId) {
      const upiString = `upi://pay?receiver=${listingOwner.upiId}&amount=${booking.totalPrice}&tr=Wanderlust Booking`;
      const qrCode = await QRCode.toDataURL(upiString);
      payment.qrCode = qrCode;
      payment.upiId = listingOwner.upiId;
    }
    
    // Generate unique transaction ID
    payment.transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    payment.completedAt = new Date();
    
    await payment.save();
    
    // Update booking payment status
    booking.paymentStatus = "completed";
    booking.paymentMethod = "upi";
    await booking.save();
    
    // Send payment receipt email (with proper await)
    try {
      const emailResult = await sendPaymentReceipt({
        to: booking.customer.email,
        username: booking.customer.username,
        booking: booking,
        listing: booking.listing
      });
      
      console.log(`📧 Payment receipt email:`, emailResult.sent ? '✅ Sent' : '⚠️ Failed');
    } catch (emailError) {
      console.error(`⚠️ Email error (continuing anyway):`, emailError.message);
    }
    
    req.flash("success", "Payment completed successfully!");
    res.redirect(`/payments/success/${bookingId}`);
  } catch (error) {
    console.error("Payment error:", error);
    req.flash("error", "Error processing payment. Please try again.");
    res.redirect(`/payments/booking/${bookingId}`);
  }
};

// Process payment (for Cash on Arrival)
module.exports.processPayment = async (req, res) => {
  const { bookingId } = req.params;
  const { paymentMethod } = req.body;
  
  const booking = await Booking.findById(bookingId)
    .populate("listing")
    .populate("customer");
  
  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect("/bookings/my-bookings");
  }
  
  // Check if user is the customer
  if (!booking.customer._id.equals(req.user._id)) {
    req.flash("error", "You can only pay for your own bookings!");
    return res.redirect("/bookings/my-bookings");
  }
  
  // For UPI, redirect to scanner page
  if (paymentMethod === "upi") {
    return res.redirect(`/payments/upi-scanner/${bookingId}?paymentMethod=upi`);
  }
  
  // For Cash on Arrival, just mark as pending and redirect
  if (paymentMethod === "cash") {
    try {
      // Create payment record with pending status for cash
      const payment = new Payment({
        booking: bookingId,
        customer: req.user._id,
        amount: booking.totalPrice,
        paymentMethod: "cash",
        status: "pending"
      });
      
      // Generate unique transaction ID
      payment.transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      
      await payment.save();
      
      // Update booking payment status
      booking.paymentStatus = "unpaid";
      booking.paymentMethod = "cash";
      await booking.save();
      
      // Send payment receipt email for cash payment
      try {
        const emailResult = await sendPaymentReceipt({
          to: booking.customer.email,
          username: booking.customer.username,
          booking: booking,
          listing: booking.listing
        });
        
        console.log(`📧 Cash payment email:`, emailResult.sent ? '✅ Sent' : '⚠️ Failed');
      } catch (emailError) {
        console.error(`⚠️ Email error (continuing anyway):`, emailError.message);
      }
      
      req.flash("success", "Payment method set to Cash on Arrival. Please pay at property check-in.");
      res.redirect(`/payments/success/${bookingId}`);
    } catch (error) {
      console.error("Payment error:", error);
      req.flash("error", "Error processing payment. Please try again.");
      res.redirect(`/payments/booking/${bookingId}`);
    }
  }
};

// Payment success page
module.exports.paymentSuccess = async (req, res) => {
  const { bookingId } = req.params;
  
  const booking = await Booking.findById(bookingId)
    .populate("listing")
    .populate("customer");
  
  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect("/listings");
  }
  
  const payment = await Payment.findOne({ booking: bookingId });
  
  res.render("payments/paymentSuccess.ejs", { booking, payment });
};

// View payment history
module.exports.paymentHistory = async (req, res) => {
  const payments = await Payment.find({ customer: req.user._id })
    .populate("booking")
    .sort({ createdAt: -1 });
  
  res.render("payments/paymentHistory.ejs", { payments });
};

// Admin: View all payments
module.exports.adminPayments = async (req, res) => {
  try {
    const payments = await Payment.find({})
      .populate("booking")
      .populate("customer")
      .sort({ createdAt: -1 });
    
    // Calculate statistics
    const stats = {
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      completedPayments: payments.length,
      upiPayments: payments.filter(p => p.paymentMethod === 'upi').length,
      cashPayments: payments.filter(p => p.paymentMethod === 'cash').length
    };
    
    res.render("payments/adminPayments.ejs", { payments, stats });
  } catch (error) {
    console.error('Admin payments error:', error);
    req.flash('error', 'Error loading payments');
    res.redirect('/listings');
  }
};
