import { useEffect, useState, useRef } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";
import {
  FaQuestionCircle,
  FaTicketAlt,
  FaPaperPlane,
  FaStar,
  FaFileImage,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaClock,
  FaInfoCircle,
  FaUser,
  FaHeadset
} from "react-icons/fa";

const Support = () => {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("ticket_issue");
  const [priority, setPriority] = useState("medium");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentError, setAttachmentError] = useState("");
  
  const [supports, setSupports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Selected ticket for chat
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  
  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);
  
  // Rating feedback
  const [ratingHover, setRatingHover] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  
  const chatEndRef = useRef(null);

  // FAQ List
  const faqs = [
    {
      q: "How can I request a refund for a cancelled train?",
      a: "Refunds for cancelled trains are automatically processed to your original payment method within 3-5 business days. If you paid via Challan, you can collect the refund cash from any railway counter by presenting your booking ID and CNIC."
    },
    {
      q: "Can I change my seats after booking confirmation?",
      a: "No, seat reservations cannot be modified once confirmed. You will need to cancel your booking and place a new reservation for the desired seats."
    },
    {
      q: "What is the policy for baggage allowances?",
      a: "Passengers are allowed up to 40kg of personal luggage in AC classes and 25kg in Economy class. Dangerous materials, fuel canister, or commercial freight are strictly prohibited on passenger coaches."
    },
    {
      q: "My payment failed but amount was deducted. What should I do?",
      a: "This is usually a pending bank authorization. Submit a support ticket under the 'Payment Issue' category with a screenshot of your bank transaction receipt, and our audit team will confirm your seat manually within 2 hours."
    }
  ];

  // Fetch support history
  const fetchSupports = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/supports");
      // Filter for current passenger only
      const userSupports = res.data.filter(
        (item) => item.user?._id?.toString() === user?.id?.toString() || item.user === user?.id
      );
      setSupports(userSupports);
      
      // Update selected ticket in real time if open
      if (selectedTicket) {
        const updated = userSupports.find(t => t._id === selectedTicket._id);
        if (updated) setSelectedTicket(updated);
      }
    } catch (error) {
      console.error("Error fetching support tickets:", error);
    }
  };

  useEffect(() => {
    fetchSupports();
  }, []);

  // Poll for message updates every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSupports();
    }, 8000);
    return () => clearInterval(interval);
  }, [selectedTicket]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket?.messages]);

  // Handle image upload and base64 conversion
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAttachmentError("");
    if (!file) return;

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setAttachmentError("File size must be under 2MB.");
      return;
    }

    // Validate type (images/pdf only)
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setAttachmentError("Only PNG, JPG, JPEG, and PDF documents are supported.");
      return;
    }

    setAttachmentName(file.name);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setAttachment(reader.result);
    };
  };

  // Submit new ticket
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    try {
      await axios.post("http://localhost:5000/api/supports", {
        user: user.id,
        subject,
        category,
        priority,
        attachment,
        message,
      });

      alert("Support ticket created successfully! An agent will respond shortly.");
      setSubject("");
      setMessage("");
      setAttachment("");
      setAttachmentName("");
      setCategory("ticket_issue");
      setPriority("medium");
      fetchSupports();
    } catch (error) {
      console.error("Error creating support ticket:", error);
    }
  };

  // Close Support Ticket
  const handleCloseTicket = async (ticketId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/supports/${ticketId}/close`);
      setSelectedTicket(res.data.support);
      fetchSupports();
    } catch (error) {
      console.error("Error closing support ticket:", error);
    }
  };

  // Submit Chat Message
  const sendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedTicket) return;

    try {
      const res = await axios.put(`http://localhost:5000/api/supports/${selectedTicket._id}/message`, {
        sender: "passenger",
        senderName: user?.name || "Passenger",
        text: chatMessage,
      });

      setSelectedTicket(res.data.support);
      setChatMessage("");
      fetchSupports();

      // Trigger automatic simulation reply from Agent after 2.5 seconds to mock live chat response
      setTimeout(async () => {
        try {
          const autoReplies = [
            "We are checking your ticket details on our database. Please wait a moment while I review the logs.",
            "I have escalated your request to our technical team. They will resolve it within 1 hour.",
            "Thank you for the update. I have updated the status for you.",
            "This payment has been successfully matched. I will mark this ticket as resolved. Please rate our service!"
          ];
          const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];

          const autoRes = await axios.put(`http://localhost:5000/api/supports/${selectedTicket._id}/message`, {
            sender: "staff",
            senderName: "Support Agent",
            text: randomReply,
          });
          
          setSelectedTicket(autoRes.data.support);
          fetchSupports();
        } catch (autoErr) {
          console.log("Agent reply error:", autoErr);
        }
      }, 2500);

    } catch (error) {
      console.error("Error sending chat message:", error);
    }
  };

  // Submit Rating Satisfaction
  const handleRateTicket = async (ticketId, score) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/supports/${ticketId}/rate`, {
        rating: score
      });
      setSelectedTicket(res.data.support);
      fetchSupports();
    } catch (error) {
      console.error("Error rating support ticket:", error);
    }
  };

  // Helper formatting values
  const getPriorityETA = (level) => {
    switch (level) {
      case "high": return "2-4 hours (Emergency)";
      case "medium": return "12-24 hours";
      default: return "48 hours";
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "resolved": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800 animate-pulse";
      case "closed": return "bg-gray-150 text-gray-700";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  // Filter and Search tickets
  const filteredTickets = supports.filter((ticket) => {
    const matchesSearch = 
      ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.message?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === "all") return matchesSearch;
    return ticket.status === filterStatus && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Support Desk</h1>
        <p className="text-gray-500 mt-2">
          Have an issue with your ticket, payment, or schedule? File a ticket or chat with support agent.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Left Grid: New Ticket & FAQ Accordion */}
        <div className="xl:col-span-1 space-y-8">
          {/* CREATE COMPLAINT FORM */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
              <FaTicketAlt className="text-blue-900" /> Submit Ticket
            </h2>

            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Subject / Summary *</label>
                <input
                  type="text"
                  placeholder="e.g. Failed transaction refund request"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-gray-250 p-3 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-50 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-255 p-3 rounded-xl focus:outline-none bg-white text-sm"
                  >
                    <option value="ticket_issue">Ticket Issue</option>
                    <option value="payment_issue">Payment Issue</option>
                    <option value="train_delay">Train Delay</option>
                    <option value="refund_request">Refund Request</option>
                    <option value="technical_bug">Technical Bug</option>
                    <option value="general_inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Priority *</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full border border-gray-255 p-3 rounded-xl focus:outline-none bg-white text-sm"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              {/* ETA Indicator */}
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-center gap-2 text-xs text-blue-900 leading-snug">
                <FaClock className="text-blue-800 flex-shrink-0" />
                <span>Estimated Response Time: <strong>{getPriorityETA(priority)}</strong></span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Detailed Description *</label>
                <textarea
                  placeholder="Elaborate on the issue or complaint. Provide Train name, seat numbers if relevant..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-gray-255 p-3 rounded-xl h-32 resize-none focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-50 transition"
                  required
                />
              </div>

              {/* FILE UPLOAD ATTACHMENT */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Attach Image Receipt/File</label>
                <div className="flex items-center gap-3">
                  <label className="border-2 border-dashed border-gray-300 hover:border-blue-900 rounded-xl px-4 py-3 cursor-pointer transition flex items-center gap-2 text-sm text-gray-500 font-semibold bg-gray-50">
                    <FaFileImage className="text-gray-400" />
                    <span>Upload Screenshot</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {attachmentName && (
                    <span className="text-xs text-blue-900 bg-blue-50 px-2 py-1 rounded border border-blue-100 font-semibold truncate max-w-[150px]">
                      {attachmentName}
                    </span>
                  )}
                </div>
                {attachmentError && (
                  <p className="text-xs text-red-500 mt-1 font-semibold">{attachmentError}</p>
                )}
                {attachment && (
                  <div className="mt-2.5 relative w-20 h-20 rounded-lg overflow-hidden border">
                    <img src={attachment} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setAttachment("");
                        setAttachmentName("");
                      }}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-[8px]"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3.5 px-4 rounded-xl transition shadow-md text-sm mt-3"
              >
                Submit Support Ticket
              </button>
            </form>
          </div>

          {/* FAQ SECTION */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-5 flex items-center gap-2">
              <FaQuestionCircle className="text-blue-900" /> FAQ Desk
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b pb-3">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex justify-between items-center text-left text-sm font-bold text-gray-700 hover:text-blue-900 transition focus:outline-none py-1"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                  </button>
                  {openFaq === idx && (
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed animate-fadeIn pl-1">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Grid: Ticket list & Active Chat conversation */}
        <div className="xl:col-span-2 space-y-6">
          {/* TICKET HISTORY LIST */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6">Support Ticket History</h2>

            {/* Filter and Search controls */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search subject or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-blue-900 transition"
                />
                <FaSearch className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
              </div>

              <div className="flex gap-1.5 flex-wrap">
                {["all", "pending", "in-progress", "resolved", "closed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                      filterStatus === status
                        ? "bg-blue-900 text-white shadow"
                        : "bg-white hover:bg-gray-50 text-gray-500 border-gray-200"
                    }`}
                  >
                    {status.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Support List Items */}
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                  No tickets match this filter. Create one to begin.
                </div>
              ) : (
                filteredTickets.map((ticket) => (
                  <div
                    key={ticket._id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-start ${
                      selectedTicket?._id === ticket._id
                        ? "border-blue-900 bg-blue-50/20 shadow-sm"
                        : "border-gray-200 hover:border-blue-200 hover:bg-gray-50/50"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-gray-100 text-gray-700 font-extrabold uppercase px-2 py-0.5 rounded">
                          {ticket.category?.replace("_", " ")}
                        </span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          ticket.priority === "high" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                        }`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-gray-800 text-sm">{ticket.subject}</h4>
                      <p className="text-xs text-gray-550 line-clamp-1">{ticket.message}</p>
                      <span className="text-[10px] text-gray-400 block mt-1">
                        Submitted: {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-right space-y-2 flex flex-col items-end">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${getStatusStyle(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      {ticket.rating > 0 && (
                        <div className="flex text-yellow-500 text-[10px] gap-0.5">
                          {Array.from({ length: ticket.rating }).map((_, i) => (
                            <FaStar key={i} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CHAT INTERFACE - Displayed if a ticket is selected */}
          {selectedTicket && (
            <div className="bg-white rounded-3xl shadow-sm border overflow-hidden flex flex-col h-[75vh] animate-fadeIn">
              {/* Chat Header */}
              <div className="bg-blue-900 text-white p-4 flex justify-between items-center">
                <div className="space-y-0.5">
                  <h3 className="text-base font-extrabold truncate max-w-md">{selectedTicket.subject}</h3>
                  <p className="text-[11px] text-blue-200 flex items-center gap-2">
                    <span>Category: <strong>{selectedTicket.category?.replace("_", " ").toUpperCase()}</strong></span>
                    <span>•</span>
                    <span>Status: <strong className="uppercase">{selectedTicket.status}</strong></span>
                  </p>
                </div>
                <div className="flex gap-2">
                  {selectedTicket.status !== "closed" && selectedTicket.status !== "resolved" && (
                    <button
                      onClick={() => handleCloseTicket(selectedTicket._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      Close Ticket
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="bg-blue-800 hover:bg-blue-700 p-2 rounded-lg text-sm"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
                {/* Initial Ticket Message */}
                <div className="flex gap-3 items-start max-w-[85%] bg-white p-4 rounded-2xl border shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    <FaUser size={12} />
                  </div>
                  <div>
                    <div className="flex justify-between items-center gap-4">
                      <strong className="text-xs text-gray-800">Passenger</strong>
                      <span className="text-[10px] text-gray-400">{new Date(selectedTicket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{selectedTicket.message}</p>
                    {selectedTicket.attachment && (
                      <div className="mt-2 max-w-xs border rounded-lg overflow-hidden">
                        <img src={selectedTicket.attachment} alt="Attachment" className="max-h-40 object-contain" />
                      </div>
                    )}
                  </div>
                </div>

                {/* dialogue thread messages */}
                {(selectedTicket.messages || []).map((msg, i) => {
                  const isPassenger = msg.sender === "passenger";
                  return (
                    <div
                      key={i}
                      className={`flex gap-3 items-start max-w-[85%] ${
                        isPassenger ? "ml-auto flex-row-reverse" : ""
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        isPassenger ? "bg-blue-100 text-blue-900" : "bg-green-100 text-green-800"
                      }`}>
                        {isPassenger ? <FaUser size={12} /> : <FaHeadset size={12} />}
                      </div>

                      <div className={`p-4 rounded-2xl border shadow-sm ${
                        isPassenger ? "bg-blue-900 text-white border-blue-900" : "bg-white text-gray-600"
                      }`}>
                        <div className="flex justify-between items-center gap-4 border-b border-gray-100/10 pb-1 mb-1 text-[10px]">
                          <strong className={isPassenger ? "text-blue-100" : "text-gray-500"}>
                            {msg.senderName}
                          </strong>
                          <span className={isPassenger ? "text-blue-200" : "text-gray-400"}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* RATING WIDGET (Displays if ticket is resolved/closed and rating is 0) */}
              {selectedTicket.status === "resolved" && selectedTicket.rating === 0 && (
                <div className="bg-yellow-50 p-4 border-t border-yellow-100 text-center space-y-2 animate-fadeIn">
                  <p className="text-xs font-bold text-yellow-800 uppercase tracking-wider">
                    🎉 This ticket is marked as resolved. Please rate your support experience!
                  </p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRateTicket(selectedTicket._id, star)}
                        onMouseEnter={() => setRatingHover(star)}
                        onMouseLeave={() => setRatingHover(0)}
                        className="text-2xl transition focus:outline-none"
                      >
                        <FaStar
                          className={
                            star <= (ratingHover || selectedTicket.rating)
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input form */}
              {selectedTicket.status !== "closed" && (
                <form onSubmit={sendChatMessage} className="p-3 bg-white border-t flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Type support reply message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-grow border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-900 transition"
                  />
                  <button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 text-white p-3.5 rounded-xl transition cursor-pointer"
                  >
                    <FaPaperPlane />
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Support;