const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  booking: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },
  paymentMethod: {
    type: String,
    enum: ["upi", "cash"],
    required: true
  },
  upiId: {
    type: String,
    default: null
  },
  transactionId: {
    type: String,
    default: null
  },
  qrCode: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
