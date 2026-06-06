import { useTheme } from "../context/ThemeContext";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const StatsTestimonials = () => {
  const { darkMode } = useTheme();

  const stats = [
    { value: "15M+", label: "Happy Passengers" },
    { value: "500+", label: "Daily Active Trains" },
    { value: "99.9%", label: "On-Time Departures" },
    { value: "24/7", label: "Customer Assistance" },
  ];

  const testimonials = [
    {
      name: "Ayesha Khan",
      role: "Frequent Traveler",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop",
      quote: "Booking train tickets used to be a nightmare with long queues and crashy websites. RailWay is incredibly fast and responsive! The dark mode is extremely easy on the eyes.",
      rating: 5,
    },
    {
      name: "Zain Ahmed",
      role: "Business Consultant",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop",
      quote: "I travel across cities weekly for client meetings. The real-time train status tool is highly accurate. Recommending this system to all my business associates.",
      rating: 5,
    },
    {
      name: "Sarah Jenkins",
      role: "Tourist",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop",
      quote: "As a foreign traveler, this MERN system was a lifesaver. The payment checkout was ultra secure, and I downloaded my PDF ticket in seconds. Five stars!",
      rating: 5,
    },
  ];

  return (
    <section
      id="testimonials"
      className={`py-20 px-6 transition-colors duration-300 ${
        darkMode ? "bg-gray-950 text-white" : "bg-white text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* STATS STRIP */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 text-center p-8 rounded-3xl mb-24 ${
          darkMode ? "bg-gray-900 border border-gray-800" : "bg-green-900 text-white"
        }`}>
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-2">
              <p className="text-4xl md:text-5xl font-extrabold text-yellow-400">{stat.value}</p>
              <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-green-100"}`}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* TESTIMONIALS SECTION */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-extrabold text-yellow-500 tracking-wider uppercase mb-3">
            Passenger Feedback
          </h2>
          <p className="text-3xl md:text-4xl font-bold leading-tight">
            What Our Travelers Say About Us
          </p>
          <div className="h-1 w-20 bg-yellow-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-2xl relative shadow-md border flex flex-col justify-between ${
                darkMode
                  ? "bg-gray-900/50 border-gray-800 text-white"
                  : "bg-gray-50 border-gray-100 text-gray-800"
              }`}
            >
              <div>
                <FaQuoteLeft className="text-3xl text-yellow-500/20 absolute top-6 left-6" />
                <div className="flex gap-1 mb-4">
                  {[...Array(test.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm" />
                  ))}
                </div>
                <p className={`text-sm italic leading-relaxed mb-6 relative z-10 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                  "{test.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 mt-auto pt-4 border-t border-dashed border-gray-700/20">
                <img
                  src={test.avatar}
                  alt={test.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-yellow-500"
                />
                <div>
                  <h4 className="font-bold text-base">{test.name}</h4>
                  <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                    {test.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsTestimonials;
