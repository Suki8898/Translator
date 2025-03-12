const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your xAI API key https://console.x.ai/
const MODEL = 'grok-2-latest'; // Models and pricing https://console.x.ai/
const API_URL = 'https://api.x.ai/v1/chat/completions';
const MAX_TOKENS = 2000;
const TEMPERATURE = 0.5; // Controls the randomness of the output, lower values are more deterministic and higher values are more random (0 - 2)

function translate(text, from, to) {
    console.log('Start translate (xAI API):', text, 'from:', from, 'to:', to, 'using model:', MODEL);

    if (text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    const prompt = `Translate everything inside the angle brackets <<>> from ${from} to ${to} and return only the translated text, without the angle brackets: << ${text} >>`;
    
    const requestBody = {
        model: MODEL,
        temperature: TEMPERATURE, 
        max_tokens: MAX_TOKENS,
        messages: [{
            role: "user",
            content: prompt
        }]
    };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(requestBody),
    })
    .then(response => {
        if (!response.ok) {
            console.error('Error from xAI API:', response.status, response.statusText);
            proxy.setFailed(`xAI API Error: ${response.status} ${response.statusText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data && data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
            const translatedText = data.choices[0].message.content.trim();
            console.log('Translated text (xAI API):', translatedText);
            proxy.setTranslated(translatedText);
        } else {
            console.error('Unexpected response from xAI API:', data);
            proxy.setFailed('Unexpected response from xAI API');
        }
    })
    .catch(error => {
        console.error('Error fetching from xAI API:', error);
        proxy.setFailed(`Error fetching from xAI API: ${error.message}`);
    });
}

function init() {
    proxy.translate.connect(translate);
}
