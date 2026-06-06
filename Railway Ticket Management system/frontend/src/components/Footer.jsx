import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPaperPlane
} from "react-icons/fa";

const Footer = () => {
  const { darkMode } = useTheme();

  return (
    <footer
      className={`border-t transition-colors duration-300 ${
        darkMode
          ? "bg-gray-950 text-gray-300 border-gray-800"
          : "bg-green-950 text-gray-200 border-green-900"
      }`}
    >
      {/* Upper Footer: Multi-column links and Newsletter */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Column 1: Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-2xl font-bold text-white">
            <span>🚄</span>
            <span className="bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
              RailWay
            </span>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Simplifying travel for millions of passengers. Book your train tickets online with confidence, ease, and absolute security.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-yellow-400 hover:text-green-950 transition-colors" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-yellow-400 hover:text-green-950 transition-colors" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-yellow-400 hover:text-green-950 transition-colors" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-yellow-400 hover:text-green-950 transition-colors" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white tracking-wider uppercase">Quick Links</h2>
          <ul className="space-y-2.5 text-sm">
            <li>
              <NavLink to="/" className="hover:text-yellow-300 transition-colors">Home</NavLink>
            </li>
            <li>
              <NavLink to="/about" className="hover:text-yellow-300 transition-colors">About Us</NavLink>
            </li>
            <li>
              <NavLink to="/login" className="hover:text-yellow-300 transition-colors">Book a Ticket</NavLink>
            </li>
            <li>
              <NavLink to="/register" className="hover:text-yellow-300 transition-colors">Create Account</NavLink>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white tracking-wider uppercase">Contact Support</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <FaEnvelope className="mt-1 text-yellow-400 flex-shrink-0" />
              <span>support@railwaysystem.com</span>
            </li>
            <li className="flex items-start gap-3">
              <FaPhone className="mt-1 text-yellow-400 flex-shrink-0" />
              <span>+92 300 1234567</span>
            </li>
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 text-yellow-400 flex-shrink-0" />
              <span>Vehari, Punjab, Pakistan</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white tracking-wider uppercase">Newsletter</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Subscribe to receive travel alerts, timetable updates, and exclusive discount coupons.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-2.5 rounded-l-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-yellow-400 flex-grow text-sm transition-all"
              required
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-300 text-green-950 font-bold px-4 rounded-r-lg transition-colors flex items-center justify-center"
              aria-label="Subscribe"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>

      </div>

      {/* Bottom Footer: Copyright and system version */}
      <div className={`border-t py-6 text-center text-xs ${
        darkMode ? "border-gray-800 text-gray-500" : "border-green-900 text-gray-400"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} RailWay Tickets Management System. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;