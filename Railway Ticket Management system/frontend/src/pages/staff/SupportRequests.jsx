import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";
import { FaHeadset, FaPaperPlane, FaRegCalendarAlt, FaStar, FaTimes } from "react-icons/fa";

const SupportRequests = ({ isSubView }) => {
  const [supports, setSupports] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [feedbackNotes, setFeedbackNotes] = useState("");

  const fetchSupports = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/supports");
      setSupports(res.data);
      if (selectedTicket) {
        const updated = res.data.find((t) => t._id === selectedTicket._id);
        if (updated) setSelectedTicket(updated);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSupports();
  }, []);

  // RESOLVE TICKET
  const resolveHandler = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/supports/resolve/${id}`, {
        feedback: feedbackNotes || "Resolved by support staff"
      });
      alert("Ticket Status Marked as Resolved!");
      setFeedbackNotes("");
      fetchSupports();
    } catch (error) {
      console.log(error);
    }
  };

  // SEND CHAT MESSAGE REPLY
  const sendReplyHandler = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    try {
      await axios.put(`http://localhost:5000/api/supports/${selectedTicket._id}/message`, {
        sender: "staff",
        senderName: "Support Agent",
        text: replyText.trim(),
      });
      setReplyText("");
      fetchSupports();
    } catch (error) {
      console.log(error);
    }
  };

  const getPriorityColor = (p) => {
    switch (p?.toLowerCase()) {
      case "high": return "bg-red-100 text-red-700 border border-red-200";
      case "medium": return "bg-amber-100 text-amber-700 border border-amber-200";
      default: return "bg-blue-100 text-blue-750 border border-blue-200";
    }
  };

  const renderContent = () => (
    <>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Passenger Support Center</h1>
        <p className="text-gray-500 mt-2 font-medium">Manage passenger issues, view screenshots, and chat with passengers in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TICKET LIST TABLE */}
        <div className="bg-white shadow-md rounded-3xl p-6 border lg:col-span-2 overflow-hidden flex flex-col h-[600px]">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Inbox Support Tickets</h3>
          <div className="overflow-y-auto flex-1 pr-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-xs font-bold text-gray-600 uppercase">
                  <th className="p-3 sticky top-0 bg-gray-100 z-10">Passenger</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-10">Subject</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-10">Category</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-10">Priority</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-10">Status</th>
                </tr>
              </thead>
              <tbody>
                {supports.map((t) => (
                  <tr
                    key={t._id}
                    onClick={() => setSelectedTicket(t)}
                    className={`border-b hover:bg-gray-50 text-sm cursor-pointer transition ${
                      selectedTicket?._id === t._id ? "bg-green-50/40" : ""
                    }`}
                  >
                    <td className="p-3 font-semibold text-gray-850">
                      {t.user?.name || "Passenger"}
                    </td>
                    <td className="p-3 font-medium text-gray-700">{t.subject}</td>
                    <td className="p-3 text-xs text-gray-500">{t.category || "General"}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getPriorityColor(t.priority)}`}>
                        {t.priority || "Low"}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                          t.status === "resolved"
                            ? "bg-green-100 text-green-700"
                            : t.status === "closed"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-yellow-100 text-yellow-750"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DETAILS & LIVE CHAT CONSOLE */}
        <div className="bg-white shadow-md rounded-3xl p-6 border flex flex-col h-[600px]">
          {selectedTicket ? (
            <div className="flex flex-col h-full">
              {/* TICKET DETAILS HEADER */}
              <div className="flex justify-between items-start border-b pb-4 mb-4">
                <div>
                  <h4 className="font-bold text-gray-850 text-base">{selectedTicket.subject}</h4>
                  <p className="text-xs text-gray-400 font-medium">Passenger: {selectedTicket.user?.name || "Anonymous"}</p>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <FaTimes />
                </button>
              </div>

              {/* ATTACHMENT VIEW */}
              {selectedTicket.attachment && (
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Attachment:</span>
                  <a href={selectedTicket.attachment} download="ticket_attachment.png" className="block border rounded-xl overflow-hidden hover:opacity-90 transition">
                    <img src={selectedTicket.attachment} alt="Attachment" className="max-h-24 w-full object-cover" />
                  </a>
                </div>
              )}

              {/* CHAT MESSAGES DISPLAY */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 bg-gray-50 p-3 rounded-2xl mb-4 text-xs">
                {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                  selectedTicket.messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex flex-col max-w-[85%] rounded-2xl p-2.5 ${
                        msg.sender === "staff"
                          ? "bg-green-900 text-white ml-auto"
                          : "bg-white text-gray-800 border"
                      }`}
                    >
                      <span className="text-[9px] font-bold opacity-75 block mb-0.5">
                        {msg.senderName || (msg.sender === "staff" ? "Support Agent" : "Passenger")}
                      </span>
                      <p className="font-medium whitespace-pre-wrap break-words">{msg.text}</p>
                      <span className="text-[8px] opacity-60 mt-1 block text-right">
                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic text-center py-4">No message threads found.</p>
                )}
              </div>

              {/* REPLY FORM */}
              {selectedTicket.status === "pending" ? (
                <form onSubmit={sendReplyHandler} className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Type support reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="border p-2.5 rounded-xl flex-grow focus:outline-none focus:border-green-900 text-xs"
                  />
                  <button
                    type="submit"
                    className="bg-green-900 hover:bg-green-800 text-white p-2.5 rounded-xl transition"
                  >
                    <FaPaperPlane size={14} />
                  </button>
                </form>
              ) : (
                <div className="bg-gray-150 p-2.5 rounded-xl text-center text-[10px] text-gray-550 font-bold uppercase mb-4">
                  Ticket Closed / Resolved
                </div>
              )}

              {/* RESOLVE BUTTON / ACTIONS */}
              {selectedTicket.status === "pending" && (
                <div className="border-t pt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Resolve Ticket:</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Notes (e.g. refund approved)..."
                      value={feedbackNotes}
                      onChange={(e) => setFeedbackNotes(e.target.value)}
                      className="border p-2 rounded-xl flex-grow text-xs focus:outline-none"
                    />
                    <button
                      onClick={() => resolveHandler(selectedTicket._id)}
                      className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              )}

              {selectedTicket.status === "resolved" && selectedTicket.feedback && (
                <div className="border-t pt-3 text-xs text-gray-500">
                  <span className="font-bold text-gray-700 block">Resolution Feedback:</span>
                  <p className="italic mt-1">{selectedTicket.feedback}</p>
                </div>
              )}

              {selectedTicket.status === "closed" && selectedTicket.rating && (
                <div className="border-t pt-3 text-xs text-yellow-650 flex items-center gap-1.5 font-bold">
                  <span>Passenger Service Rating:</span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FaStar key={s} className={s <= selectedTicket.rating ? "text-amber-400" : "text-gray-200"} size={11} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-center text-gray-300">
              <FaHeadset size={48} className="mb-2" />
              <p className="text-xs text-gray-400 font-semibold">Select a ticket from the list to view attachments and live chat</p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (isSubView) return renderContent();

  return <DashboardLayout>{renderContent()}</DashboardLayout>;
};

export default SupportRequests;