//Open the folder C:\Users\%UserName%\AppData\Roaming\Gres\ScreenTranslator\assets\translators
//Create a file named gemini_api.js and copy this code into it
//Replace YOUR_API_KEY_HERE with your Gemini API key
//Go to Setting > Translation > gemini_api.js

const API_KEY = 'YOUR_API_KEY_HERE';
const MODEL_NAME = 'gemini-1.5-flash'; // You can change to another model if desired
const TEMPERATURE = 1;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

function translate(text, from, to) {
    console.log('Start translate (Gemini):', text, 'from:', from, 'to:', to, 'using model:', MODEL_NAME, 'temperature:', TEMPERATURE);

    if (text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    const prompt = `Translate the following text from ${from} to ${to}, do not include quotation marks "", do not reply, without further explanation: "${text}"`;

    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }],
      generationConfig: {
        temperature: TEMPERATURE
      },
        safetySettings: [
            {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_NONE",
            },
            {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_NONE",
            },
            {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_NONE",
            },
            {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_NONE",
            }
        ],
    };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
        .then(response => {
            if (!response.ok) {
                console.error('Error from Gemini API:', response.status, response.statusText);
                proxy.setFailed(`Gemini API Error: ${response.status} ${response.statusText}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                const translatedText = data.candidates[0].content.parts[0].text.trim();
                console.log('Translated text (Gemini):', translatedText);
                proxy.setTranslated(translatedText);
            } else {
                console.error('Unexpected response from Gemini API:', data);
                proxy.setFailed('Unexpected response from Gemini API');
            }
        })
        .catch(error => {
            console.error('Error fetching from Gemini API:', error);
            proxy.setFailed(`Error fetching from Gemini API: ${error.message}`);
        });
}


function init() {
    proxy.translate.connect(translate);
}