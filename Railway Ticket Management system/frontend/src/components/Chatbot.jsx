import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaTimes, FaMinus } from "react-icons/fa";
import { MdTrain } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";

/* ─── constants ─────────────────────────────────────── */
const MAX_LEN = 500;

const INJECTION_PATTERNS = [
  /ignore previous instructions/i,
  /disregard (all|your|the) (previous|above|prior)/i,
  /you are now/i,
  /act as (a|an|if)/i,
  /pretend (you are|to be)/i,
  /forget (you are|your instructions)/i,
  /system prompt/i,
  /jailbreak/i,
];

const QUICK_ACTIONS = [
  { label: "🎫 Book Ticket",       text: "How do I book a ticket?" },
  { label: "📅 Check Schedule",    text: "Show me available train schedules" },
  { label: "❌ Cancel Ticket",     text: "How can I cancel my ticket?" },
  { label: "💰 Refund Status",     text: "What is the refund policy?" },
  { label: "💺 Seat Availability", text: "Show available seats on trains" },
  { label: "📞 Contact Support",   text: "I need to contact support" },
];

const WELCOME =
  "Hello! I'm your Railway Assistant 👋\n\nAsk me about ticket booking, train schedules, cancellations, refunds, or seat availability.";

/* ─── helpers ───────────────────────────────────────── */
const sanitize = (t) =>
  t.replace(/[<>]/g, "").replace(/\\/g, "").replace(/`{3,}/g, "").trim();

const isInjection = (t) => INJECTION_PATTERNS.some((p) => p.test(t));

const ts = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/* ─── TypingDots ────────────────────────────────────── */
const TypingDots = () => (
  <div className="flex items-end gap-2">
    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow flex-shrink-0">
      <MdTrain className="text-white text-sm" />
    </div>
    <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
      {[0, 150, 300].map((d) => (
        <span
          key={d}
          style={{ animationDelay: `${d}ms` }}
          className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
        />
      ))}
    </div>
  </div>
);

/* ─── Message bubble ────────────────────────────────── */
const Message = ({ msg }) => {
  const isUser = msg.sender === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* bot avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow flex-shrink-0 mb-4">
          <MdTrain className="text-white text-sm" />
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
            isUser
              ? "bg-gradient-to-br from-blue-700 to-indigo-700 text-white rounded-2xl rounded-br-none"
              : "bg-white text-gray-800 border border-slate-100 rounded-2xl rounded-bl-none"
          }`}
        >
          {msg.text}
        </div>
        <span className="text-[10px] text-slate-400 px-1">{msg.time}</span>
      </div>
    </motion.div>
  );
};

/* ─── Chatbot ───────────────────────────────────────── */
const Chatbot = () => {
  const [isOpen, setIsOpen]           = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage]         = useState("");
  const [loading, setLoading]         = useState(false);
  const [messages, setMessages]       = useState([
    { sender: "bot", text: WELCOME, time: ts() },
  ]);

  const endRef   = useRef(null);
  const inputRef = useRef(null);
  const user     = JSON.parse(localStorage.getItem("user") || "null");

  const charCount = message.length;
  const overLimit = charCount > MAX_LEN;

  /* scroll to bottom whenever messages update */
  useEffect(() => {
    if (isOpen && !isMinimized) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  /* focus input when panel opens */
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, isMinimized]);

  const addMsg = (sender, text) =>
    setMessages((p) => [...p, { sender, text, time: ts() }]);

  const sendMessage = async (textToSend) => {
    const raw = textToSend || message;
    if (!raw.trim() || loading) return;

    const cleaned = sanitize(raw).slice(0, MAX_LEN);
    if (!cleaned) return;

    if (isInjection(cleaned)) {
      addMsg("user", cleaned);
      if (!textToSend) setMessage("");
      addMsg("bot", "I am a Railway Assistant and can only help with railway services, ticket booking, train schedules, and passenger support.");
      return;
    }

    addMsg("user", cleaned);
    if (!textToSend) setMessage("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/chatbot/ask`,
        { message: cleaned, userId: user?.id }
      );
      addMsg("bot", data.reply);
    } catch (err) {
      addMsg(
        "bot",
        err?.response?.data?.message ||
          "Sorry, I'm having connectivity issues. Please try again shortly."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const openChat  = () => { setIsOpen(true);  setIsMinimized(false); };
  const closeChat = () => { setIsOpen(false); setIsMinimized(false); };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[99999] flex flex-col items-end">

      {/* ══════════════════════════════════════
          CHAT PANEL
          Height is capped so header always fits:
          - Mobile:  fills available height above FAB
          - Desktop: fixed 520px, never taller than viewport-minus-offset
      ════════════════════════════════════════ */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: 20, scale: 0.95  }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="
              mb-3 flex flex-col overflow-hidden
              w-[calc(100vw-2.5rem)] sm:w-[380px]
              rounded-2xl
              bg-white
              border border-slate-200/70
              shadow-[0_24px_64px_-8px_rgba(15,23,42,0.28),0_0_0_1px_rgba(99,102,241,0.07)]
            "
            style={{
              /* Never taller than viewport minus space for FAB + margin */
              maxHeight: "min(520px, calc(100vh - 6rem))",
              height:    "min(520px, calc(100vh - 6rem))",
            }}
          >

            {/* ── HEADER ── */}
            <div className="relative flex-shrink-0 flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 overflow-hidden">
              {/* ambient glows */}
              <div className="pointer-events-none absolute -top-8 -right-8 w-32 h-32 rounded-full bg-indigo-500/25 blur-3xl" />
              <div className="pointer-events-none absolute bottom-0 left-8  w-20 h-20 rounded-full bg-blue-400/20  blur-2xl" />

              {/* left: avatar + name */}
              <div className="relative z-10 flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/10 ring-2 ring-white/20 flex items-center justify-center">
                    <MdTrain className="text-blue-200 text-xl" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">Railway Assistant</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <HiSparkles className="text-indigo-300 text-[10px]" />
                    <p className="text-blue-300 text-[10px] font-medium">Powered by Gemini AI</p>
                  </div>
                </div>
              </div>

              {/* right: controls */}
              <div className="relative z-10 flex items-center gap-0.5">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                  title="Minimize"
                >
                  <FaMinus size={11} />
                </button>
                <button
                  onClick={closeChat}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                  title="Close"
                >
                  <FaTimes size={13} />
                </button>
              </div>
            </div>

            {/* ── MESSAGES ── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-slate-50/60">
              {messages.map((msg, i) => <Message key={i} msg={msg} />)}
              {loading && <TypingDots />}
              <div ref={endRef} />
            </div>

            {/* ── QUICK ACTIONS ── */}
            <div className="flex-shrink-0 px-3 pt-2 pb-2 bg-white border-t border-slate-100">
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 px-0.5">
                Quick actions
              </p>
              <div
                className="flex gap-1.5 overflow-x-auto pb-0.5"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {QUICK_ACTIONS.map((a, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(a.text)}
                    disabled={loading}
                    className="
                      flex-shrink-0 whitespace-nowrap
                      text-[11px] font-medium
                      px-3 py-1.5 rounded-full
                      bg-slate-100 hover:bg-indigo-50
                      text-slate-600 hover:text-indigo-700
                      border border-transparent hover:border-indigo-200
                      transition-all duration-150 active:scale-95
                      disabled:opacity-40 disabled:cursor-not-allowed
                    "
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── INPUT ── */}
            <div className="flex-shrink-0 px-3 pt-2 pb-3 bg-white border-t border-slate-100">
              <div
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-200 ${
                  overLimit
                    ? "border-red-400 bg-red-50/60"
                    : "border-slate-200 bg-slate-50 focus-within:border-indigo-400 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
                }`}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKey}
                  disabled={loading}
                  maxLength={MAX_LEN + 10}
                  placeholder="Ask about tickets, trains, schedules…"
                  className="flex-1 bg-transparent text-sm text-gray-700 placeholder-slate-400 outline-none min-w-0"
                />

                {charCount > MAX_LEN * 0.8 && (
                  <span className={`text-[10px] font-medium flex-shrink-0 ${overLimit ? "text-red-500" : "text-slate-400"}`}>
                    {charCount}/{MAX_LEN}
                  </span>
                )}

                <motion.button
                  onClick={() => sendMessage()}
                  disabled={loading || !message.trim() || overLimit}
                  whileTap={{ scale: 0.88 }}
                  className="
                    w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    bg-gradient-to-br from-blue-700 to-indigo-700
                    text-white shadow
                    disabled:opacity-40 disabled:cursor-not-allowed
                    hover:from-blue-600 hover:to-indigo-600
                    transition-colors
                  "
                >
                  <FaPaperPlane size={12} />
                </motion.button>
              </div>

              <p className="text-center text-[9px] text-slate-300 mt-1.5 tracking-wide">
                Railway AI · For railway queries only
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          MINIMIZED PILL
      ════════════════════════════════════════ */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.button
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1   }}
            exit={{   opacity: 0, y: 8, scale: 0.9  }}
            onClick={() => setIsMinimized(false)}
            className="
              mb-3 flex items-center gap-2.5
              bg-gradient-to-r from-slate-900 to-indigo-900
              text-white rounded-2xl pl-3.5 pr-2 py-2.5
              shadow-[0_8px_24px_rgba(15,23,42,0.35)]
              border border-white/10
              transition-shadow hover:shadow-[0_12px_32px_rgba(15,23,42,0.45)]
            "
          >
            <MdTrain className="text-blue-300 text-base" />
            <span className="text-sm font-semibold">Railway Assistant</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 mx-1" />
            <button
              onClick={(e) => { e.stopPropagation(); closeChat(); }}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <FaTimes size={11} />
            </button>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          FLOATING ACTION BUTTON
      ════════════════════════════════════════ */}
      <div className="relative">
        {/* Pulse rings — only when chat is closed */}
        {!isOpen && (
          <>
            <span className="absolute inset-0 rounded-full bg-indigo-400/30 animate-ping" />
            <span className="absolute inset-0 rounded-full bg-blue-400/20  animate-ping [animation-delay:0.5s]" />
          </>
        )}

        <motion.button
          onClick={() =>
            isOpen
              ? isMinimized ? setIsMinimized(false) : closeChat()
              : openChat()
          }
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          className="
            relative z-10 w-14 h-14 rounded-full
            bg-gradient-to-br from-blue-700 via-indigo-700 to-indigo-800
            text-white flex items-center justify-center
            shadow-[0_8px_28px_rgba(67,56,202,0.5)]
            border border-white/10
            hover:shadow-[0_12px_36px_rgba(67,56,202,0.65)]
            transition-shadow
          "
          title="Railway Assistant"
        >
          <AnimatePresence mode="wait">
            {isOpen && !isMinimized ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0,   opacity: 1 }}
                exit={{   rotate:  90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <FaTimes size={18} />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 90,  opacity: 0 }}
                animate={{ rotate: 0,   opacity: 1 }}
                exit={{   rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <MdTrain size={26} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};

export default Chatbot;
