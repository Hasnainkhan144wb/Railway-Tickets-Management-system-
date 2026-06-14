import { useTheme } from "../context/ThemeContext";
import { FaTicketAlt, FaMapMarkedAlt, FaShieldAlt } from "react-icons/fa";

const Features = () => {
  const { darkMode } = useTheme();

  const featuresList = [
    {
      icon: <FaTicketAlt className="text-4xl text-yellow-500" />,
      title: "Instant Ticket Booking",
      description: "Select your route, choose your seats in real-time, and get your digital ticket immediately. No long queues, no hassle.",
    },
    {
      icon: <FaMapMarkedAlt className="text-4xl text-yellow-500" />,
      title: "Real-Time Train Tracking",
      description: "Stay updated with live tracking of your trains. Monitor delays, station arrivals, and schedule changes instantly.",
    },
    {
      icon: <FaShieldAlt className="text-4xl text-yellow-500" />,
      title: "100% Secure Payments",
      description: "Multiple verified payment methods with industry-grade SSL encryption. Your financial data is completely safe with us.",
    },
  ];

  return (
    <section
      id="features"
      className={`py-20 px-6 transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
        }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-extrabold text-yellow-500 tracking-wider uppercase mb-3">
            Why Choose RailWay?
          </h2>
          <p className="text-3xl md:text-4xl font-bold leading-tight">
            Designed for Modern & Seamless Rail Travel
          </p>
          <div className="h-1 w-20 bg-yellow-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuresList.map((feature, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-2xl shadow-md border hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ${darkMode
                  ? "bg-gray-800/50 border-gray-700/80 text-white"
                  : "bg-white border-gray-100 text-gray-800"
                }`}
            >
              <div className="p-4 bg-yellow-500/10 rounded-2xl inline-block mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
