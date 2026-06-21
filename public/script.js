// DOM elements
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const clearChatButton = document.getElementById('clear-chat');
const sendButton = document.getElementById('send-button');
const charCount = document.getElementById('char-count');
const emptyState = document.getElementById('empty-state');
const promptChips = document.querySelectorAll('.prompt-chip');

// Conversation history array to maintain context for API
let conversationHistory = [];
let isSending = false;

// Event listeners
form.addEventListener('submit', handleSubmit);
input.addEventListener('input', handleInputChange);
input.addEventListener('keydown', handleInputKeydown);
clearChatButton.addEventListener('click', resetChat);
promptChips.forEach((chip) => chip.addEventListener('click', fillPromptFromChip));

handleInputChange();

/**
 * Main handler for form submission.
 * Keeps the existing backend contract: POST /api/chat with { conversation }.
 */
async function handleSubmit(e) {
  e.preventDefault();

  if (isSending) return;

  const userMessage = input.value.trim();
  if (!userMessage) return;

  hideEmptyState();
  appendMessage('user', userMessage);
  conversationHistory.push({
    role: 'user',
    text: userMessage
  });

  input.value = '';
  handleInputChange();
  setBusyState(true);

  const thinkingMessageElement = appendMessage('bot', 'Sedang memproses jawaban', {
    loading: true
  });

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        conversation: conversationHistory
      })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || typeof data.result !== 'string' || !data.result.trim()) {
      throw new Error('No result in server response');
    }

    const aiMessage = data.result.trim();
    conversationHistory.push({
      role: 'model',
      text: aiMessage
    });

    updateMessage(thinkingMessageElement, stripMarkdown(aiMessage));
  } catch (error) {
    console.error('Chat error:', error);

    const errorMessage = error instanceof TypeError
      ? 'Gagal terhubung ke server. Periksa koneksi atau endpoint API.'
      : 'Maaf, respons belum berhasil diterima. Silakan coba lagi.';

    updateMessage(thinkingMessageElement, errorMessage, {
      error: true
    });
  } finally {
    setBusyState(false);
    input.focus();
  }
}

/**
 * Handles textarea auto-resize and character counter.
 */
function handleInputChange() {
  autoResizeInput();
  updateCharacterCount();
}

/**
 * Sends message on Enter, and keeps Shift + Enter for new line.
 */
function handleInputKeydown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
}

/**
 * Inserts a sample prompt from chips into the input.
 */
function fillPromptFromChip(event) {
  const prompt = event.currentTarget.dataset.prompt || '';
  input.value = prompt;
  handleInputChange();
  input.focus();
}

/**
 * Clears the current conversation and restores the welcome state.
 */
function resetChat() {
  conversationHistory = [];

  Array.from(chatBox.querySelectorAll('.message')).forEach((message) => {
    message.remove();
  });

  emptyState.classList.remove('is-hidden');
  input.value = '';
  handleInputChange();
  input.focus();
}

/**
 * Adds or removes the loading state while waiting for the API.
 */
function setBusyState(isBusy) {
  isSending = isBusy;
  input.disabled = isBusy;
  sendButton.disabled = isBusy;
  sendButton.querySelector('.button-text').textContent = isBusy ? 'Proses' : 'Kirim';
}

/**
 * Hides the welcome panel after the first message.
 */
function hideEmptyState() {
  emptyState.classList.add('is-hidden');
}

/**
 * Keeps the textarea height natural as users type multi-line prompts.
 */
function autoResizeInput() {
  input.style.height = 'auto';
  input.style.height = `${input.scrollHeight}px`;
}

/**
 * Updates lightweight character count near the input.
 */
function updateCharacterCount() {
  charCount.textContent = input.value.length.toLocaleString('id-ID');
}

/**
 * Strips common markdown symbols while keeping the answer readable.
 * @param {string} text - Raw model response.
 * @returns {string} Cleaned text for safe textContent rendering.
 */
function stripMarkdown(text) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)]\(([^)]+)\)/g, '$1 ($2)')
    .replace(/^\s*[-*_]{3,}\s*$/gm, '')
    .replace(/^\s*[-*]\s+/gm, '• ')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .trim();
}

/**
 * Appends a message to the chat display.
 * @param {string} sender - Either 'user' or 'bot'.
 * @param {string} text - The message text to display.
 * @param {object} options - Additional state, such as loading.
 * @returns {HTMLElement} The created message element.
 */
function appendMessage(sender, text, options = {}) {
  const messageElement = document.createElement('article');
  messageElement.classList.add('message', sender);

  if (options.loading) {
    messageElement.classList.add('loading');
  }

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = sender === 'user' ? 'U' : 'AI';

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';

  const content = document.createElement('div');
  content.className = 'message-content';
  content.textContent = text;

  const meta = document.createElement('div');
  meta.className = 'message-meta';
  meta.textContent = formatTime(new Date());

  bubble.append(content, meta);
  messageElement.append(avatar, bubble);
  chatBox.appendChild(messageElement);
  scrollToLatestMessage();

  return messageElement;
}

/**
 * Replaces an existing message content and clears temporary states.
 */
function updateMessage(messageElement, text, options = {}) {
  const content = messageElement.querySelector('.message-content');
  content.textContent = text;

  messageElement.classList.remove('loading', 'error');

  if (options.error) {
    messageElement.classList.add('error');
  }

  scrollToLatestMessage();
}

/**
 * Formats the visible timestamp inside every bubble.
 */
function formatTime(date) {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Auto-scrolls the conversation to the newest message.
 */
function scrollToLatestMessage() {
  chatBox.scrollTop = chatBox.scrollHeight;
}