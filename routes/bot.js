const express = require("express");
const router = express.Router();
const botController = require("../controllers/recommendationBot.js");

// Chat with bot (no wrapAsync - controller handles its own errors)
router.post("/chat", botController.chat);

// Get conversation history
router.get("/history/:sessionId", botController.getHistory);

// Reset conversation
router.post("/reset", botController.reset);

module.exports = router;
