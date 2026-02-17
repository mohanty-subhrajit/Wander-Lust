const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const botController = require("../controllers/recommendationBot.js");

// Chat with bot
router.post("/chat", wrapAsync(botController.chat));

// Get conversation history
router.get("/history/:sessionId", wrapAsync(botController.getHistory));

// Reset conversation
router.post("/reset", wrapAsync(botController.reset));

module.exports = router;
