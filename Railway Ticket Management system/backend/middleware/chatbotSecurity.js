const rateLimit = require("express-rate-limit");

// Allow 20 requests per minute per IP
const chatbotRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests. Please wait a moment before asking again.",
    },
});

// Patterns that indicate prompt injection attempts
const INJECTION_PATTERNS = [
    /ignore previous instructions/i,
    /disregard (all|your|the) (previous|above|prior)/i,
    /you are now/i,
    /act as (a|an|if)/i,
    /pretend (you are|to be)/i,
    /forget (you are|your instructions)/i,
    /system prompt/i,
    /\[INST\]/i,
    /<\|.*?\|>/,
    /###\s*instruction/i,
    /override (your|the) (instructions|rules|guidelines)/i,
    /jailbreak/i,
    /DAN mode/i,
];

const sanitizeMessage = (message) => {
    if (typeof message !== "string") return "";

    return message
        .replace(/[<>]/g, "")          // strip HTML angle brackets
        .replace(/\\/g, "")            // strip backslashes
        .replace(/`{3,}/g, "")        // strip triple backticks
        .trim()
        .slice(0, 500);                // hard cap at 500 chars
};

const validateChatbotInput = (req, res, next) => {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ message: "Message is required." });
    }

    if (message.length > 500) {
        return res.status(400).json({ message: "Message too long. Please keep it under 500 characters." });
    }

    const sanitized = sanitizeMessage(message);

    for (const pattern of INJECTION_PATTERNS) {
        if (pattern.test(sanitized)) {
            return res.status(400).json({
                message: "Invalid request. I can only help with railway-related queries.",
            });
        }
    }

    req.body.message = sanitized;
    next();
};

module.exports = { chatbotRateLimiter, validateChatbotInput };
