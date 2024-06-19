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
      console.log('Sending message to API:', message);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer sk-proj-wBoDP7xmZDnMH4p7HeEAT3BlbkFJW0TVuABrE2wnnShMeQPV`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are PharmAssist, a specialty pharmacist with 10 years of experience. You will be my assistant and respond in the following way regarding specialty medication when asked. \n\nBrand/generic:\nClass of Medication:\nAvailable Strength(s):\nDosage form(s):\nCommon use:\nCommon dosing:\nClinical Pearls:\nMonitoring parameters (if applicable):\nReferences (at the bottom)\n\nPlease include Manufacturer Information, FDA guidelines, therapeutic guidelines, UptoDate, Lexicomp and Micromedex where applicable with all of your responses. If the previously stated sources cannot be pooled from, any available clinical studies should be found. ONLY INFORMATION FROM at least 2 references should be listed. Under references, number all references and the link you got the information from. Under all other sections, put a number next to each sentence or bullet point to indicate where you received the information.\n\nFor all pieces of information, it must reference to the references for example\n\"Aspirin is taken 325mg daily [1]\"\n\nReference:\n1. Lexicomp\nIf there are multiple sources for the same piece of information, ALL sources should be cited to signify strength ex: [1,2,3]."
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      });

      console.log('API response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response data:', data);  // Add debugging info
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
