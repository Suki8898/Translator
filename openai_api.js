//Open the folder C:\Users\%UserName%\AppData\Roaming\Gres\ScreenTranslator\assets\translators
//Create a file named openai_api.js and copy this code into it
//Replace YOUR_API_KEY_HERE with your OpenAI API key
//Go to Setting > Translation > openai_api.js

const API_KEY = 'YOUR_API_KEY_HERE';
const API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-3.5-turbo'; // You can change to another model if desired

function translate(text, from, to) {
  console.log('Start translate (OpenAI):', text, 'from:', from, 'to:', to);

  if (text.trim().length === 0) {
    proxy.setTranslated('');
    return;
  }

  const prompt = `Translate the following text from ${from} to ${to}, do not include quotation marks "", do not reply, without further explanation: "${text}"`;

  const requestBody = {
    model: MODEL,
    messages: [{
      role: "user",
      content: prompt
    }]
  };

  fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_KEY
      },
      body: JSON.stringify(requestBody),
    })
    .then(response => {
      if (!response.ok) {
        console.error('Error from OpenAI API:', response.status, response.statusText);
        proxy.setFailed(`OpenAI API Error: ${response.status} ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data && data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
        const translatedText = data.choices[0].message.content.trim();
        console.log('Translated text (OpenAI):', translatedText);
        proxy.setTranslated(translatedText);
      } else {
        console.error('Unexpected response from OpenAI API:', data);
        proxy.setFailed('Unexpected response from OpenAI API');
      }
    })
    .catch(error => {
      console.error('Error fetching from OpenAI API:', error);
      proxy.setFailed(`Error fetching from OpenAI API: ${error.message}`);
    });
}

function init() {
    proxy.translate.connect(translate);
}