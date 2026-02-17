const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const botMessageSchema = new Schema({
  sender: {
    type: String,
    enum: ["bot", "user"],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const botConversationSchema = new Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  messages: [botMessageSchema],
  context: {
    location: String,
    minPrice: Number,
    maxPrice: Number,
    guests: Number,
    country: String,
    step: {
      type: String,
      default: "greeting"
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
});

// Auto-delete conversations older than 7 days
botConversationSchema.index({ lastActivity: 1 }, { expireAfterSeconds: 604800 });

const BotConversation = mongoose.model("BotConversation", botConversationSchema);
module.exports = BotConversation;
