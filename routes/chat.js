const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const chatController = require("../controllers/chat.js");

// Get chat for a booking
router.get("/booking/:bookingId", isLoggedIn, wrapAsync(chatController.getChat));

// Send message in chat
router.post("/booking/:bookingId/message", isLoggedIn, wrapAsync(chatController.sendMessage));

// Get unread message count
router.get("/unread-count", isLoggedIn, wrapAsync(chatController.getUnreadCount));

module.exports = router;
