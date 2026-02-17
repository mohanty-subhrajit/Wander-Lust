const BotConversation = require("../models/botConversation");
const Listing = require("../models/listing");
const { v4: uuidv4 } = require('uuid');

// Rule-based intent detection
function detectIntent(message) {
  const lowerMsg = message.toLowerCase().trim();
  
  // Greeting patterns
  if (/(hi|hello|hey|start|help|assist)/i.test(lowerMsg)) {
    return 'greeting';
  }
  
  // Location patterns
  if (/(in|at|near|location|place|city|country|area)/i.test(lowerMsg)) {
    return 'location';
  }
  
  // Price patterns
  if (/(price|cost|budget|cheap|expensive|affordable|₹|rs)/i.test(lowerMsg)) {
    return 'price';
  }
  
  // Guests patterns
  if (/(guest|people|person|persons|travelers|family|group)/i.test(lowerMsg)) {
    return 'guests';
  }
  
  // Show recommendations
  if (/(show|find|search|recommend|suggest|list|properties|listings)/i.test(lowerMsg)) {
    return 'recommend';
  }
  
  // Restart
  if (/(restart|reset|start over|begin again)/i.test(lowerMsg)) {
    return 'restart';
  }
  
  return 'unknown';
}

// Extract location from message
function extractLocation(message) {
  const lowerMsg = message.toLowerCase();
  
  // Common location patterns
  const locationMatch = lowerMsg.match(/(?:in|at|near)\s+([a-z\s,]+)/i);
  if (locationMatch) {
    return locationMatch[1].trim();
  }
  
  // Just the location name
  const words = message.split(' ').filter(w => w.length > 2);
  if (words.length > 0) {
    return words.join(' ');
  }
  
  return null;
}

// Extract price range from message
function extractPrice(message) {
  const lowerMsg = message.toLowerCase();
  
  // Pattern: "under 5000" or "below 5000"
  const underMatch = lowerMsg.match(/(?:under|below|less than|max|maximum)\s*₹?\s*(\d+)/);
  if (underMatch) {
    return { min: 0, max: parseInt(underMatch[1]) };
  }
  
  // Pattern: "above 3000" or "over 3000"
  const aboveMatch = lowerMsg.match(/(?:above|over|more than|min|minimum)\s*₹?\s*(\d+)/);
  if (aboveMatch) {
    return { min: parseInt(aboveMatch[1]), max: 999999 };
  }
  
  // Pattern: "between 3000 and 5000"
  const betweenMatch = lowerMsg.match(/(?:between|from)\s*₹?\s*(\d+)\s*(?:and|to|-)\s*₹?\s*(\d+)/);
  if (betweenMatch) {
    return { min: parseInt(betweenMatch[1]), max: parseInt(betweenMatch[2]) };
  }
  
  // Pattern: "3000 to 5000" or "3000-5000"
  const rangeMatch = lowerMsg.match(/(\d+)\s*(?:to|-)\s*(\d+)/);
  if (rangeMatch) {
    return { min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) };
  }
  
  // Single number
  const singleMatch = lowerMsg.match(/₹?\s*(\d+)/);
  if (singleMatch) {
    const price = parseInt(singleMatch[1]);
    return { min: 0, max: price };
  }
  
  return null;
}

// Extract number of guests
function extractGuests(message) {
  const match = message.match(/(\d+)/);
  if (match) {
    return parseInt(match[1]);
  }
  
  // Word numbers
  const wordNumbers = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
  };
  
  for (const [word, num] of Object.entries(wordNumbers)) {
    if (message.toLowerCase().includes(word)) {
      return num;
    }
  }
  
  return null;
}

// Generate bot response based on context
async function generateResponse(conversation, userMessage) {
  const intent = detectIntent(userMessage);
  let botResponse = "";
  let recommendations = null;
  
  switch (intent) {
    case 'greeting':
      botResponse = "Hi! 👋 I'm your property recommendation assistant. I can help you find the perfect place to stay!\n\n" +
        "Tell me:\n" +
        "🌍 Where would you like to stay?\n" +
        "💰 What's your budget?\n" +
        "👥 How many guests?\n\n" +
        "Or just tell me what you're looking for!";
      conversation.context.step = 'gathering_info';
      break;
      
    case 'location':
      const location = extractLocation(userMessage);
      if (location) {
        conversation.context.location = location;
        botResponse = `Great! Looking for properties in ${location}. 🏠\n\n` +
          "What's your budget per night? (e.g., 'under 5000' or '3000 to 8000')";
        conversation.context.step = 'price';
      } else {
        botResponse = "I didn't catch the location. Could you specify the city or area? (e.g., 'Goa', 'Mumbai', 'Delhi')";
      }
      break;
      
    case 'price':
      const priceRange = extractPrice(userMessage);
      if (priceRange) {
        conversation.context.minPrice = priceRange.min;
        conversation.context.maxPrice = priceRange.max;
        botResponse = `Perfect! Budget: ₹${priceRange.min.toLocaleString('en-IN')} - ₹${priceRange.max.toLocaleString('en-IN')} per night. 💰\n\n` +
          "How many guests? (e.g., '2 people' or '4')";
        conversation.context.step = 'guests';
      } else {
        botResponse = "Could you specify your budget? For example:\n" +
          "• 'under 5000'\n" +
          "• '3000 to 8000'\n" +
          "• 'maximum 10000'";
      }
      break;
      
    case 'guests':
      const guests = extractGuests(userMessage);
      if (guests) {
        conversation.context.guests = guests;
        botResponse = `Got it! ${guests} guest${guests > 1 ? 's' : ''}. 👥\n\n` +
          "Let me find the best properties for you... 🔍";
        conversation.context.step = 'ready';
        recommendations = await findRecommendations(conversation.context);
      } else {
        botResponse = "How many guests? Please specify a number (e.g., '2' or '4 people')";
      }
      break;
      
    case 'recommend':
      if (conversation.context.location || conversation.context.minPrice !== undefined || conversation.context.guests) {
        recommendations = await findRecommendations(conversation.context);
        botResponse = "Here are my recommendations based on your preferences: 🎯";
      } else {
        botResponse = "I need more information to recommend properties. Let's start:\n\n" +
          "Where would you like to stay? (e.g., 'Goa', 'Mumbai')";
        conversation.context.step = 'location';
      }
      break;
      
    case 'restart':
      conversation.context = { step: 'greeting' };
      conversation.messages = [];
      botResponse = "Let's start fresh! 🔄\n\n" +
        "Where would you like to stay?";
      break;
      
    default:
      // Try to extract any useful information
      const loc = extractLocation(userMessage);
      const price = extractPrice(userMessage);
      const gst = extractGuests(userMessage);
      
      if (loc || price || gst) {
        if (loc) conversation.context.location = loc;
        if (price) {
          conversation.context.minPrice = price.min;
          conversation.context.maxPrice = price.max;
        }
        if (gst) conversation.context.guests = gst;
        
        const missing = [];
        if (!conversation.context.location) missing.push("📍 location");
        if (conversation.context.minPrice === undefined) missing.push("💰 budget");
        if (!conversation.context.guests) missing.push("👥 number of guests");
        
        if (missing.length === 0) {
          recommendations = await findRecommendations(conversation.context);
          botResponse = "Perfect! Here are my recommendations: 🎯";
        } else {
          botResponse = `Got it! I still need: ${missing.join(', ')}\n\n` +
            `Please provide the ${missing[0]}.`;
        }
      } else {
        botResponse = "I'm here to help you find properties! You can tell me:\n\n" +
          "🌍 Location (e.g., 'in Goa')\n" +
          "💰 Budget (e.g., 'under 5000')\n" +
          "👥 Guests (e.g., '2 people')\n\n" +
          "Or type 'restart' to begin again.";
      }
  }
  
  return { botResponse, recommendations };
}

// Find listings based on criteria
async function findRecommendations(context) {
  let query = {};
  
  if (context.location) {
    query.$or = [
      { location: new RegExp(context.location, 'i') },
      { country: new RegExp(context.location, 'i') },
      { title: new RegExp(context.location, 'i') }
    ];
  }
  
  if (context.minPrice !== undefined || context.maxPrice !== undefined) {
    query.price = {};
    if (context.minPrice !== undefined) query.price.$gte = context.minPrice;
    if (context.maxPrice !== undefined) query.price.$lte = context.maxPrice;
  }
  
  try {
    console.log('[BOT] Searching listings with query:', JSON.stringify(query));
    
    const listings = await Listing.find(query)
      .populate('owner', 'username')
      .limit(5)
      .sort({ price: 1 })
      .lean();
    
    console.log('[BOT] Found', listings.length, 'listings');
    return listings;
  } catch (error) {
    console.error('[BOT] Error finding recommendations:', error.message);
    console.error('[BOT] Stack:', error.stack);
    return [];
  }
}

// Get or create conversation
module.exports.chat = async (req, res) => {
  try {
    let { sessionId } = req.body;
    const { message } = req.body;
    
    // Validate message
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid message.'
      });
    }
    
    // Generate or validate sessionId
    if (!sessionId) {
      sessionId = uuidv4();
    }
    
    console.log('[BOT] Processing message:', message, 'Session:', sessionId);
    
    let conversation = await BotConversation.findOne({ sessionId });
    
    if (!conversation) {
      conversation = new BotConversation({
        sessionId,
        user: req.user ? req.user._id : null,
        messages: [],
        context: { step: 'greeting' }
      });
    }
    
    // Add user message
    conversation.messages.push({
      sender: 'user',
      message: message,
      timestamp: new Date()
    });
    
    // Generate bot response
    let botResponse = '';
    let recommendations = null;
    
    try {
      const response = await generateResponse(conversation, message);
      botResponse = response.botResponse;
      recommendations = response.recommendations;
      console.log('[BOT] Generated response:', botResponse.substring(0, 50) + '...');
    } catch (generateError) {
      console.error('[BOT] Error generating response:', generateError.message);
      botResponse = "I'm having trouble processing your request. Could you try rephrasing that?";
    }
    
    // Add bot response
    conversation.messages.push({
      sender: 'bot',
      message: botResponse,
      timestamp: new Date()
    });
    
    conversation.lastActivity = new Date();
    await conversation.save();
    
    console.log('[BOT] Response generated successfully');
    
    // Safely map recommendations
    let mappedRecommendations = null;
    if (recommendations && Array.isArray(recommendations) && recommendations.length > 0) {
      try {
        mappedRecommendations = recommendations.map(listing => {
          const id = listing._id ? listing._id.toString() : null;
          const title = listing.title || 'Untitled Property';
          const location = listing.location || 'Location not specified';
          const country = listing.country || 'Country not specified';
          const price = listing.price || 0;
          
          // Handle image safely
          let imageUrl = 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=400';
          if (listing.image && typeof listing.image === 'object') {
            imageUrl = listing.image.url || imageUrl;
          } else if (typeof listing.image === 'string') {
            imageUrl = listing.image;
          }
          
          // Handle owner safely
          let ownerName = 'Host';
          if (listing.owner) {
            if (typeof listing.owner === 'object') {
              ownerName = listing.owner.username || 'Host';
            } else if (typeof listing.owner === 'string') {
              ownerName = listing.owner;
            }
          }
          
          return {
            id,
            title,
            location,
            country,
            price,
            image: imageUrl,
            owner: ownerName
          };
        });
        console.log('[BOT] Mapped', mappedRecommendations.length, 'recommendations');
      } catch (mapError) {
        console.error('[BOT] Error mapping recommendations:', mapError.message);
        mappedRecommendations = null;
      }
    }
    
    res.json({
      success: true,
      sessionId: conversation.sessionId,
      botMessage: botResponse,
      recommendations: mappedRecommendations,
      context: conversation.context
    });
    
  } catch (error) {
    console.error('[BOT] ❌ Fatal error:', error);
    console.error('[BOT] Error name:', error.name);
    console.error('[BOT] Error message:', error.message);
    console.error('[BOT] Stack trace:', error.stack);
    
    // Send detailed error in development, generic in production
    const isDev = process.env.NODE_ENV === 'development';
    
    res.status(500).json({ 
      success: false, 
      error: 'Sorry, I encountered an error. Please try again.',
      details: isDev ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : undefined
    });
  }
};

// Get conversation history
module.exports.getHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const conversation = await BotConversation.findOne({ sessionId });
    
    if (!conversation) {
      return res.json({
        success: true,
        messages: [],
        context: { step: 'greeting' }
      });
    }
    
    res.json({
      success: true,
      messages: conversation.messages,
      context: conversation.context
    });
    
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ success: false, error: 'Error fetching history' });
  }
};

// Reset conversation
module.exports.reset = async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (sessionId) {
      await BotConversation.findOneAndDelete({ sessionId });
    }
    
    const newSessionId = uuidv4();
    
    res.json({
      success: true,
      sessionId: newSessionId,
      message: 'Conversation reset successfully'
    });
    
  } catch (error) {
    console.error('Error resetting conversation:', error);
    res.status(500).json({ success: false, error: 'Error resetting conversation' });
  }
};
