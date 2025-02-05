//Open the folder C:\Users\%UserName%\AppData\Roaming\Gres\ScreenTranslator\assets\translators
//Create a file named deepseek_api.js and copy this code into it
//Replace YOUR_API_KEY_HERE with your DeepSeek API key
//Go to Setting > Translation > deepseek_api.js

const API_KEY = 'YOUR_API_KEY_HERE';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const MODEL = 'deepseek-chat';  // You can change to another model if desired

function translate(text, from, to) {
    console.log('Start translate (DeepSeek API):', text, 'from:', from, 'to:', to, 'using model:', MODEL);

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