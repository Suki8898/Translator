const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your Perplexity API key https://www.perplexity.ai/account/api/keys
const MODEL = 'sonar'; // Models and pricing https://docs.perplexity.ai/models/model-cards
const API_URL = 'https://api.perplexity.ai/chat/completions';
const MAX_TOKENS = 2000;
const TEMPERATURE = 0.5; // Controls the randomness of the output, lower values are more deterministic and higher values are more random (0 - 2)

function translate(text, from, to) {
    console.log('Start translate (Perplexity):', text, 'from:', from, 'to:', to);
    
    if (text.trim().length === 0) {
        proxy.setTranslated('');
        return;
    }

    const prompt = `Translate from ${from} to ${to} and return only the translated text`;

    const requestBody = {
        model: MODEL,
        temperature: TEMPERATURE, 
        max_tokens: MAX_TOKENS,
        messages: [{
            role: "system",
            content: prompt
            }, {
            role: "user",
            content: text
        }] 
    };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(requestBody),
    })
    .then(response => {
        if (!response.ok) {
            console.error('Error from Perplexity API:', response.status, response.statusText);
            proxy.setFailed(`Perplexity API Error: ${response.status} ${response.statusText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data && data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
            const translatedText = data.choices[0].message.content.trim();
            console.log('Translated text (Perplexity):', translatedText);
            proxy.setTranslated(translatedText);
        } else {
            console.error('Unexpected response from Perplexity API:', data);
            proxy.setFailed('Unexpected response from Perplexity API');
        }
    })
    .catch(error => {
        console.error('Error fetching from Perplexity API:', error);
        proxy.setFailed(`Error fetching from Perplexity API: ${error.message}`);
    });
}
    
function init() {
    proxy.translate.connect(translate);
}

