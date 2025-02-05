//Open the folder C:\Users\%UserName%\AppData\Roaming\Gres\ScreenTranslator\assets\translators
//Create a file named openrouter_api.js and copy this code into it
//Replace YOUR_API_KEY_HERE with your OpenRouter API key
//Go to Setting > Translation > openrouter_api.js

const API_KEY = 'YOUR_API_KEY_HERE';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'meta-llama/llama-3.2-3b-instruct:free'; // You can change the model here

function translate(text, from, to) {
    console.log('Start translate (OpenRouter):', text, 'from:', from, 'to:', to, 'using model:', MODEL);

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
            'Authorization': `Bearer ${API_KEY}`,
            //'HTTP-Referer': 'https://your-app-name.com', 
            //'X-Title': 'Your App Name' // Thay thế bằng tên ứng dụng của bạn
        },
        body: JSON.stringify(requestBody),
    })
        .then(response => {
            if (!response.ok) {
                console.error('Error from OpenRouter API:', response.status, response.statusText);
                proxy.setFailed(`OpenRouter API Error: ${response.status} ${response.statusText}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
         .then(data => {
            if (data && data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
                const translatedText = data.choices[0].message.content.trim();
                console.log('Translated text (OpenRouter):', translatedText);
                proxy.setTranslated(translatedText);
            } else {
                console.error('Unexpected response from OpenRouter API:', data);
                proxy.setFailed('Unexpected response from OpenRouter API');
            }
         })
        .catch(error => {
            console.error('Error fetching from OpenRouter API:', error);
            proxy.setFailed(`Error fetching from OpenRouter API: ${error.message}`);
        });
}


function init() {
    proxy.translate.connect(translate);
}