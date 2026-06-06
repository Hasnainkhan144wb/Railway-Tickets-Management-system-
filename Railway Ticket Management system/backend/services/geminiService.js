const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.gemini_api_key });

async function askGemini(systemPrompt, userMessage) {
    try {
        const fullPrompt = `${systemPrompt}\n\nUser message: ${userMessage}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        throw error;
    }
}

module.exports = { askGemini };