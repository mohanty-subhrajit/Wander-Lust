const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  listing: {
    type: Schema.Types.ObjectId,
    ref: "Listing",
    required: true
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  checkIn: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        // Set time to start of day for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkInDate = new Date(value);
        checkInDate.setHours(0, 0, 0, 0);
        return checkInDate >= today;
      },
      message: "Check-in date must be today or a future date"
    }
  },
  checkOut: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        // Check-out must be after check-in
        return value > this.checkIn;
      },
      message: "Check-out date must be after check-in date"
    }
  },
  guests: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "rejected"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
