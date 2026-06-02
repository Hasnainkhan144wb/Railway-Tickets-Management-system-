import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am your Railway Assistant. How can I help you today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const sendMessage = async (textToSend) => {
    const text = textToSend || message;
    if (!text.trim()) return;

    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chatbot/ask", {
        message: text,
        userId: user?.id,
      });

      setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I am facing connectivity issues. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const quickActions = [
    { label: "🔍 Lahore to Karachi", text: "Train Lahore to Karachi" },
    { label: "🎫 My Bookings", text: "Show my bookings" },
    { label: "💳 Pending Payments", text: "Show my pending payments" },
    { label: "❌ Cancel Ticket", text: "How can I cancel my ticket?" },
    { label: "⚠️ Delayed trains?", text: "Any delayed trains today?" },
    { label: "🔔 Notifications", text: "Show my notifications" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[99999] flex flex-col items-end">
      {/* CHAT PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-96 h-[500px] bg-white rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.2)] border border-blue-50 flex flex-col mb-4 overflow-hidden"
          >
            {/* HEADER */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 p-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <FaRobot className="text-xl text-blue-200" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">🤖 Railway Assistant</h3>
                  <p className="text-[10px] text-blue-200">Online | Powered by AI</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm whitespace-pre-line leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-blue-900 text-white rounded-tr-none"
                        : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-500 max-w-[80%] p-3 rounded-2xl rounded-tl-none border border-gray-100 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* QUICK ACTIONS */}
            <div className="px-4 py-2.5 border-t border-gray-50 bg-gray-50 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-200">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(action.text)}
                  className="bg-white hover:bg-blue-50 text-blue-900 border border-blue-100 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* INPUT */}
            <div className="p-3 border-t border-gray-100 flex items-center gap-2 bg-white">
              <input
                type="text"
                placeholder="Ask me anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border border-gray-200 focus:border-blue-950 focus:outline-none p-2.5 px-4 rounded-full text-sm"
              />
              <button
                onClick={() => sendMessage()}
                className="bg-blue-900 hover:bg-blue-800 text-white p-3 rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <FaPaperPlane size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING ACTION BUTTON */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 text-white p-4 rounded-full shadow-[0_10px_30px_rgba(30,58,138,0.4)] flex items-center justify-center cursor-pointer border border-white/10 hover:shadow-[0_15px_40px_rgba(30,58,138,0.5)] transition-all"
      >
        <FaRobot className="text-2xl" />
      </motion.button>
    </div>
  );
};

export default Chatbot;