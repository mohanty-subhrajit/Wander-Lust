// Chat functionality
document.addEventListener('DOMContentLoaded', function() {
  const chatForm = document.getElementById('chatForm');
  const messageInput = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');
  const chatMessages = document.getElementById('chatMessages');
  const errorMessage = document.getElementById('errorMessage');

  // Scroll to bottom of messages
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Initial scroll to bottom
  scrollToBottom();

  // Format timestamp
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return date.toLocaleString('en-US', options);
  }

  // Add message to chat
  function addMessage(message, isCurrentUser) {
    // Remove empty state if it exists
    const emptyState = chatMessages.querySelector('.text-center.text-muted');
    if (emptyState) {
      emptyState.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isCurrentUser ? 'message-sent' : 'message-received'}`;
    
    messageDiv.innerHTML = `
      <div class="message-content">
        <div class="message-header">
          <strong>${message.sender.username}</strong>
          <small class="text-muted ms-2">${formatTimestamp(message.timestamp)}</small>
        </div>
        <div class="message-text">${escapeHtml(message.content)}</div>
      </div>
    `;

    chatMessages.appendChild(messageDiv);
    scrollToBottom();
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
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  // Show error message
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
      errorMessage.style.display = 'none';
    }, 5000);
  }

  // Handle form submission
  chatForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const message = messageInput.value.trim();
    if (!message) return;

    // Disable form while sending
    sendBtn.disabled = true;
    messageInput.disabled = true;

    try {
      const response = await fetch(`/chat/booking/${bookingId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Add message to chat
        addMessage(data.message, true);
        
        // Clear input
        messageInput.value = '';
        messageInput.focus();
      } else {
        showError(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showError('Network error. Please check your connection and try again.');
    } finally {
      // Re-enable form
      sendBtn.disabled = false;
      messageInput.disabled = false;
    }
  });

  // Auto-focus on message input
  messageInput.focus();

  // Poll for new messages every 3 seconds
  let lastMessageCount = chatMessages.querySelectorAll('.message').length;
  
  setInterval(async function() {
    try {
      // Reload page to get new messages
      // In a production app, you'd use WebSockets or a proper polling endpoint
      const response = await fetch(window.location.href);
      const html = await response.text();
      
      // Parse the response to count messages
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newMessageCount = doc.querySelectorAll('.message').length;
      
      // If there are new messages, reload the page
      if (newMessageCount > lastMessageCount) {
        location.reload();
      }
    } catch (error) {
      console.error('Error checking for new messages:', error);
    }
  }, 3000);

  // Handle Enter key (without Shift) to send message
  messageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event('submit'));
    }
  });
});
