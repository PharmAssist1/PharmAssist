document.addEventListener('DOMContentLoaded', () => {
  const sendButton = document.getElementById('sendButton');
  const userInput = document.getElementById('userInput');
  const messagesDiv = document.getElementById('messages');

  sendButton.addEventListener('click', async () => {
    const userMessage = userInput.value;
    if (userMessage.trim() === '') return;

    displayMessage('User', userMessage);
    userInput.value = '';

    try {
      const botResponse = await getBotResponse(userMessage);
      displayMessage('Bot', botResponse);
    } catch (error) {
      console.error('Error fetching bot response:', error);
      displayMessage('Bot', 'Sorry, I am having trouble responding right now.');
    }
  });

  async function getBotResponse(message) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer sk-proj-vSHx1V4C28LhuMjvPDdZT3BlbkFJibfRv401sJNPAkFh3rGd`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: message
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response:', data);  // Add debugging info
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error in getBotResponse:', error);
      throw error;
    }
  }

  function displayMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `${sender}: ${message}`;
    messagesDiv.appendChild(messageDiv);
  }
});
