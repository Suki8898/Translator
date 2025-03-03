const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your DeepSeek API key https://platform.deepseek.com/api_keys
const MODEL = 'deepseek-chat'; // Models and pricing https://api-docs.deepseek.com/quick_start/pricing
const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const MAX_TOKENS = 2000;
const TEMPERATURE = 0.5; // Controls the randomness of the output, lower values are more deterministic and higher values are more random (0 - 2)

function translate(text, from, to) {
    console.log('Start translate (DeepSeek API):', text, 'from:', from, 'to:', to, 'using model:', MODEL);

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
            console.error('Error from DeepSeek API:', response.status, response.statusText);
            proxy.setFailed(`DeepSeek API Error: ${response.status} ${response.statusText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data && data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
            const translatedText = data.choices[0].message.content.trim();
            console.log('Translated text (DeepSeek API):', translatedText);
            proxy.setTranslated(translatedText);
        } else {
            console.error('Unexpected response from DeepSeek API:', data);
            proxy.setFailed('Unexpected response from DeepSeek API');
        }
    })
    .catch(error => {
        console.error('Error fetching from DeepSeek API:', error);
        proxy.setFailed(`Error fetching from DeepSeek API: ${error.message}`);
    });
}

function init() {
    proxy.translate.connect(translate);
}