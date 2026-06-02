const { GoogleGenAI } = require('@google/genai');

// 1. Client initialize karein
const ai = new GoogleGenAI({ apiKey: "AQ.Ab8RN6JGQohjyLSixHcjnI97Yc3nmtp-41iiptZ9FPHvbIaWXw" });

async function askGemini(message) {
    try {
        // 2. Naye SDK ke mutabiq direct model aur content generate karein
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
        });

        // 3. Response text return karein
        return response.text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
}

// Apne routes mein use karne ke liye export zaroor karein
module.exports = { askGemini };