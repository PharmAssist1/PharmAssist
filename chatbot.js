document.addEventListener('DOMContentLoaded', () => {
  const sendButton = document.getElementById('sendButton');
  const userInput = document.getElementById('userInput');
  const messagesDiv = document.getElementById('messages');

  sendButton.addEventListener('click', async () => {
    const userMessage = userInput.value;
    if (userMessage.trim() === '') return;

    displayMessage('User', userMessage);
    userInput.value = '';

    const botResponse = await getBotResponse(userMessage);
    displayMessage('Bot', botResponse);
  });

  async function getBotResponse(message) {
    const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk-proj-6muneZyCyKjMgRqXFDWsT3BlbkFJEt4YMthdTcTENKZGzAze`
      },
      body: JSON.stringify({
        prompt: message,
        max_tokens: 150
      })
    });
    const data = await response.json();
    return data.choices[0].text.trim();
  }

  function displayMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `${sender}: ${message}`;
    messagesDiv.appendChild(messageDiv);
  }
});
