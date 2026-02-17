const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

const chatSchema = new Schema({
  booking: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
    unique: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  messages: [messageSchema],
  lastMessage: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries (booking already has unique index, no need to add it again)
chatSchema.index({ participants: 1 });

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
