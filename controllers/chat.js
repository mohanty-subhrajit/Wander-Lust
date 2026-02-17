const Chat = require("../models/chat");
const Booking = require("../models/booking");
const Listing = require("../models/listing");

// Get or create chat for a booking
module.exports.getChat = async (req, res) => {
  const { bookingId } = req.params;
  
  // Find the booking and populate necessary fields
  const booking = await Booking.findById(bookingId)
    .populate("listing")
    .populate("customer");
  
  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect("/bookings/my-bookings");
  }

  // Populate the listing owner
  await booking.listing.populate("owner");
  
  // Check if user is either the customer or the owner
  const isCustomer = booking.customer._id.equals(req.user._id);
  const isOwner = booking.listing.owner._id.equals(req.user._id);
  
  if (!isCustomer && !isOwner && !req.user.isAdmin) {
    req.flash("error", "You don't have permission to access this chat");
    return res.redirect("/listings");
  }

  // Only allow chat for confirmed bookings
  if (booking.status !== "confirmed") {
    req.flash("error", "Chat is only available for confirmed bookings");
    return res.redirect("/bookings/my-bookings");
  }

  // Find or create chat
  let chat = await Chat.findOne({ booking: bookingId })
    .populate("participants")
    .populate("messages.sender");

  if (!chat) {
    chat = new Chat({
      booking: bookingId,
      participants: [booking.customer._id, booking.listing.owner._id],
      messages: []
    });
    await chat.save();
    await chat.populate("participants");
  }

  // Mark messages as read for current user
  let hasUnread = false;
  chat.messages.forEach(msg => {
    if (!msg.isRead && !msg.sender._id.equals(req.user._id)) {
      msg.isRead = true;
      hasUnread = true;
    }
  });
  
  if (hasUnread) {
    await chat.save();
  }

  // Determine other participant
  const otherParticipant = chat.participants.find(
    p => !p._id.equals(req.user._id)
  );

  res.render("bookings/chat.ejs", { 
    chat, 
    booking,
    otherParticipant,
    currentUser: req.user
  });
};

// Send a message
module.exports.sendMessage = async (req, res) => {
  const { bookingId } = req.params;
  const { message } = req.body;
  
  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message cannot be empty" });
  }

  const booking = await Booking.findById(bookingId).populate("listing");
  
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  // Check if user is participant
  const isCustomer = booking.customer.equals(req.user._id);
  const isOwner = booking.listing.owner.equals(req.user._id);
  
  if (!isCustomer && !isOwner) {
    return res.status(403).json({ error: "You don't have permission" });
  }

  // Check if booking is confirmed
  if (booking.status !== "confirmed") {
    return res.status(403).json({ error: "Chat is only available for confirmed bookings" });
  }

  // Find or create chat
  let chat = await Chat.findOne({ booking: bookingId });
  
  if (!chat) {
    chat = new Chat({
      booking: bookingId,
      participants: [booking.customer, booking.listing.owner],
      messages: []
    });
  }

  // Add message
  chat.messages.push({
    sender: req.user._id,
    content: message.trim(),
    timestamp: new Date(),
    isRead: false
  });
  
  chat.lastMessage = new Date();
  await chat.save();
  
  // Populate sender for response
  await chat.populate("messages.sender");
  
  const newMessage = chat.messages[chat.messages.length - 1];
  
  res.json({
    success: true,
    message: {
      id: newMessage._id,
      sender: {
        id: newMessage.sender._id,
        username: newMessage.sender.username
      },
      content: newMessage.content,
      timestamp: newMessage.timestamp
    }
  });
};

// Get unread message count for user
module.exports.getUnreadCount = async (req, res) => {
  const chats = await Chat.find({ participants: req.user._id });
  
  let unreadCount = 0;
  chats.forEach(chat => {
    chat.messages.forEach(msg => {
      if (!msg.isRead && !msg.sender.equals(req.user._id)) {
        unreadCount++;
      }
    });
  });
  
  res.json({ unreadCount });
};
