// DOM elements
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Conversation history array to maintain context for API
let conversationHistory = [];

// Event listener for form submission
form.addEventListener('submit', handleSubmit);

/**
 * Main handler for form submission
 * Orchestrates the entire chat flow
 */
async function handleSubmit(e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  
  // Validate user input
  if (!userMessage) {
    return;
  }

  // Clear input field
  input.value = '';
  
  // Add user message to chat display and history
  appendMessage('user', userMessage);
  conversationHistory.push({
    role: 'user',
    text: userMessage
  });

  // Show loading animation placeholder
  const thinkingMessageElement = appendMessage('bot', 'Thinking');
  thinkingMessageElement.classList.add('loading');
  
  try {
    // Send request to backend API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        conversation: conversationHistory
      })
    });

    // Handle HTTP errors
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    // Parse response JSON
    const data = await response.json();

    // Validate response structure
    if (!data.result) {
      throw new Error('No result in server response');
    }

    const aiMessage = data.result;

    // Add AI response to conversation history
    conversationHistory.push({
      role: 'model',
      text: aiMessage
    });

    // Strip markdown formatting and replace "Thinking..." with actual AI response
    const cleanMessage = stripMarkdown(aiMessage);
    thinkingMessageElement.textContent = cleanMessage;
    thinkingMessageElement.classList.remove('loading');

  } catch (error) {
    // Handle errors and provide user feedback
    console.error('Chat error:', error);
    
    const errorMessage = error instanceof TypeError 
      ? 'Failed to get response from server.'
      : 'Sorry, no response received.';
    
    thinkingMessageElement.textContent = errorMessage;
    thinkingMessageElement.classList.add('error');
  }
}

/**
 * Strips markdown formatting symbols from text
 * Removes *, **, /, ##, etc. to make responses look natural
 * @param {string} text - The text to clean
 * @returns {string} Cleaned text without markdown symbols
 */
function stripMarkdown(text) {
  return text
    .replaceAll('**', '')      // Remove ** (bold)
    .replaceAll('*', '')       // Remove * (italic)
    .replaceAll('_', '')       // Remove _ (underline)
    .replaceAll('`', '')       // Remove ` (inline code)
    .replaceAll('# ', '')      // Remove # (headers)
    .replaceAll('## ', '')     // Remove ## (subheaders)
    .replaceAll('### ', '')    // Remove ### (sub-subheaders)
    .replaceAll('- ', '')      // Remove - (list items)
    .replaceAll('* ', '')      // Remove * (bullet points)
    .trim();
}

/**
 * Appends a message to the chat display
 * @param {string} sender - Either 'user' or 'bot'
 * @param {string} text - The message text to display
 * @returns {HTMLElement} The created message element
 */
function appendMessage(sender, text) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender);
  
  // Convert newlines to <br> tags for proper line breaks
  const formattedText = text.replace(/\n/g, '<br>');
  messageElement.innerHTML = formattedText;
  
  chatBox.appendChild(messageElement);
  
  // Auto-scroll to bottom to show latest message
  chatBox.scrollTop = chatBox.scrollHeight;
  
  return messageElement;
}
