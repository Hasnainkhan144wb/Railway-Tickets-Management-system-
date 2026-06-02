import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const StaffLoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert(res.data.message);
      onClose();

      if (res.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (res.data.user.role === "staff") {
        navigate("/staff-dashboard");
      } else {
        navigate("/passenger-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-opacity duration-300"
    >
      {/* Modal Container */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full flex flex-col md:flex-row relative animate-fade-in-scale max-h-[90vh] md:max-h-[85vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full z-50 transition-colors"
          title="Close Modal"
        >
          <FaTimes className="text-lg" />
        </button>

        {/* Left Column (White Background) */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white overflow-y-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-600 text-white p-2 rounded-xl text-lg font-bold">
                🚂
              </span>
              <span className="font-bold text-xl text-gray-800">Railway Staff</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Staff Portal
            </h2>
            <p className="text-gray-500 mt-2">
              Please enter your credentials to access the staff dashboard.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Email/Username
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="staff@railwaysystem.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-900 text-white py-3.5 rounded-xl font-bold hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 transition-all shadow-md mt-6 flex justify-center items-center"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {/* Right Column (Light Gray Background) */}
        <div className="w-full md:w-1/2 bg-gray-50 p-8 md:p-12 flex flex-col justify-between items-center text-center border-t md:border-t-0 md:border-l border-gray-100 overflow-y-auto">
          <div className="text-gray-400 text-xs tracking-wider uppercase font-semibold">
            Railway Management Systems
          </div>

          <div className="my-auto py-8">
            <div className="relative inline-block mb-4">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200"
                alt="Sajid Khan"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
              />
              <span className="absolute bottom-0 right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></span>
            </div>

            <h3 className="font-bold text-gray-800 text-lg">Sajid Khan</h3>
            <p className="text-blue-600 text-sm font-semibold mb-6">Chief Station Master</p>

            <blockquote className="text-gray-600 italic text-base leading-relaxed max-w-sm mx-auto">
              "Operational efficiency is key. Managing train schedules and passenger bookings has never been smoother. A state-of-the-art management tool for staff."
            </blockquote>
          </div>

          <div className="flex gap-6 text-gray-500 text-xs">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
              <span className="text-green-500 font-bold">✓</span> Trusted Platform
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
              <span className="text-green-500 font-bold">✓</span> 100% Secure
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLoginModal;
