// Recommendation Bot JavaScript
(function() {
  'use strict';

  let sessionId = localStorage.getItem('botSessionId') || null;
  let isOpen = false;

  // DOM Elements
  const botToggle = document.getElementById('botToggle');
  const botWindow = document.getElementById('botWindow');
  const botClose = document.getElementById('botClose');
  const botMinimize = document.getElementById('botMinimize');
  const botRestart = document.getElementById('botRestart');
  const botForm = document.getElementById('botForm');
  const botInput = document.getElementById('botInput');
  const botSend = document.getElementById('botSend');
  const botMessages = document.getElementById('botMessages');
  const botRecommendations = document.getElementById('botRecommendations');
  const recommendationsList = document.getElementById('recommendationsList');
  const closeRecommendations = document.getElementById('closeRecommendations');

  // Initialize bot
  function init() {
    botToggle.addEventListener('click', toggleBot);
    botClose.addEventListener('click', closeBot);
    botMinimize.addEventListener('click', closeBot);
    botRestart.addEventListener('click', restartConversation);
    botForm.addEventListener('submit', handleSubmit);
    closeRecommendations.addEventListener('click', hideRecommendations);

    // Quick action buttons
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('bot-quick-btn')) {
        const message = e.target.getAttribute('data-message');
        if (message) {
          sendMessage(message);
        }
      }
    });

    // Load conversation if exists
    if (sessionId) {
      loadHistory();
    }
  }

  // Toggle bot window
  function toggleBot() {
    isOpen = !isOpen;
    if (isOpen) {
      botWindow.style.display = 'flex';
      botToggle.style.display = 'none';
      botInput.focus();
    } else {
      closeBot();
    }
  }

  // Close bot window
  function closeBot() {
    isOpen = false;
    botWindow.style.display = 'none';
    botToggle.style.display = 'flex';
  }

  // Handle form submit
  function handleSubmit(e) {
    e.preventDefault();
    const message = botInput.value.trim();
    if (message) {
      sendMessage(message);
      botInput.value = '';
    }
  }

  // Send message to bot
  async function sendMessage(message) {
    // Add user message to UI
    addUserMessage(message);

    // Disable input
    botSend.disabled = true;
    botInput.disabled = true;

    // Show typing indicator
    showTypingIndicator();

    try {
      const response = await fetch('/bot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: sessionId,
          message: message
        })
      });

      const data = await response.json();

      // Hide typing indicator
      hideTypingIndicator();

      if (data.success) {
        // Save session ID
        sessionId = data.sessionId;
        localStorage.setItem('botSessionId', sessionId);

        // Add bot response
        addBotMessage(data.botMessage);

        // Show recommendations if any
        if (data.recommendations && data.recommendations.length > 0) {
          showRecommendations(data.recommendations);
        }

        // Show quick suggestions based on context
        showQuickSuggestions(data.context);
      } else {
        addBotMessage('Sorry, I encountered an error. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      hideTypingIndicator();
      addBotMessage('Network error. Please check your connection and try again.');
    } finally {
      // Re-enable input
      botSend.disabled = false;
      botInput.disabled = false;
      botInput.focus();
    }
  }

  // Add user message to UI
  function addUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'bot-message user-msg';
    messageDiv.innerHTML = `
      <div class="bot-bubble">
        <p>${escapeHtml(message)}</p>
      </div>
    `;
    botMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  // Add bot message to UI
  function addBotMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'bot-message bot-msg';
    
    // Convert line breaks to paragraphs
    const paragraphs = message.split('\n').filter(p => p.trim());
    const paragraphsHtml = paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');
    
    messageDiv.innerHTML = `
      <div class="bot-avatar">
        <i class="fa-solid fa-robot"></i>
      </div>
      <div class="bot-bubble">
        ${paragraphsHtml}
      </div>
    `;
    botMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  // Show typing indicator
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'bot-message bot-msg';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
      <div class="bot-avatar">
        <i class="fa-solid fa-robot"></i>
      </div>
      <div class="bot-bubble">
        <div class="bot-typing">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    botMessages.appendChild(typingDiv);
    scrollToBottom();
  }

  // Hide typing indicator
  function hideTypingIndicator() {
    const typingDiv = document.getElementById('typingIndicator');
    if (typingDiv) {
      typingDiv.remove();
    }
  }

  // Show recommendations
  function showRecommendations(recommendations) {
    recommendationsList.innerHTML = '';
    
    recommendations.forEach(listing => {
      const card = document.createElement('a');
      card.href = `/listings/${listing.id}`;
      card.className = 'bot-recommendation-card';
      card.innerHTML = `
        <img src="${listing.image}" alt="${escapeHtml(listing.title)}">
        <div class="bot-recommendation-title">${escapeHtml(listing.title)}</div>
        <div class="bot-recommendation-location">
          <i class="fa-solid fa-location-dot"></i> ${escapeHtml(listing.location)}, ${escapeHtml(listing.country)}
        </div>
        <div class="bot-recommendation-price">₹${listing.price.toLocaleString('en-IN')}/night</div>
      `;
      recommendationsList.appendChild(card);
    });

    botRecommendations.style.display = 'block';
  }

  // Hide recommendations
  function hideRecommendations() {
    botRecommendations.style.display = 'none';
  }

  // Show quick suggestions
  function showQuickSuggestions(context) {
    const suggestions = document.getElementById('botSuggestions');
    suggestions.innerHTML = '';

    const quickReplies = [];

    if (!context.location) {
      quickReplies.push('Goa', 'Mumbai', 'Delhi');
    } else if (context.minPrice === undefined) {
      quickReplies.push('Under ₹5000', '₹3000-₹8000', 'Under ₹10000');
    } else if (!context.guests) {
      quickReplies.push('2 guests', '4 guests', '6 guests');
    } else {
      quickReplies.push('Show properties', 'Restart', 'Help');
    }

    quickReplies.forEach(reply => {
      const chip = document.createElement('button');
      chip.className = 'bot-suggestion-chip';
      chip.textContent = reply;
      chip.addEventListener('click', () => {
        sendMessage(reply);
      });
      suggestions.appendChild(chip);
    });
  }

  // Load conversation history
  async function loadHistory() {
    try {
      const response = await fetch(`/bot/history/${sessionId}`);
      const data = await response.json();

      if (data.success && data.messages.length > 0) {
        // Clear initial message
        botMessages.innerHTML = '';

        // Load all messages
        data.messages.forEach(msg => {
          if (msg.sender === 'bot') {
            addBotMessage(msg.message);
          } else {
            addUserMessage(msg.message);
          }
        });
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  }

  // Restart conversation
  async function restartConversation() {
    if (!confirm('Start a new conversation? Your current chat will be cleared.')) {
      return;
    }

    try {
      const response = await fetch('/bot/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId })
      });

      const data = await response.json();

      if (data.success) {
        sessionId = data.sessionId;
        localStorage.setItem('botSessionId', sessionId);
        
        // Clear UI
        botMessages.innerHTML = '';
        hideRecommendations();
        
        // Show welcome message
        addBotMessage("Hi! 👋 I'm your property recommendation assistant.\n\nI can help you find the perfect place to stay!\n\nWhere would you like to stay?");
        
        // Clear suggestions
        document.getElementById('botSuggestions').innerHTML = '';
      }
    } catch (error) {
      console.error('Error restarting conversation:', error);
      alert('Error restarting conversation. Please try again.');
    }
  }

  // Scroll to bottom of messages
  function scrollToBottom() {
    setTimeout(() => {
      botMessages.scrollTop = botMessages.scrollHeight;
    }, 100);
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
