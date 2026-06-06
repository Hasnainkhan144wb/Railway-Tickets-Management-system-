import { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaTrain, FaExchangeAlt, FaInfoCircle } from "react-icons/fa";

const Hero = () => {
    const [fromStation, setFromStation] = useState("Lahore");
    const [toStation, setToStation] = useState("Karachi");
    const [travelDate, setTravelDate] = useState("");
    const [ticketClass, setTicketClass] = useState("Economy");
    const [searchClicked, setSearchClicked] = useState(false);

    const stations = ["Lahore", "Karachi", "Rawalpindi", "Islamabad", "Multan", "Faisalabad", "Vehari", "Peshawar", "Quetta"];

    const handleSwapStations = () => {
        const temp = fromStation;
        setFromStation(toStation);
        setToStation(temp);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchClicked(true);
        // Automatically hide notification after 5 seconds
        setTimeout(() => setSearchClicked(false), 6000);
    };

    return (
        <section
            className="min-h-screen flex flex-col items-center justify-center px-4 md:px-6 pt-24 pb-16 bg-cover bg-center relative"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=1600')",
            }}
        >
            {/* DARK OVERLAY FOR OPTIMAL READABILITY */}
            <div className="absolute inset-0 bg-black/65"></div>

            {/* MAIN CONTENT WRAPPER */}
            <div className="w-full max-w-5xl relative z-10 flex flex-col items-center text-center mt-6">
                
                {/* VALUE PROPOSITION HEADLINE */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight max-w-4xl">
                    Your Journey Begins Here
                    <br />
                    <span className="text-yellow-400">Book Train Tickets Online</span>
                </h1>

                <p className="text-gray-300 text-base sm:text-lg md:text-xl mt-6 max-w-2xl leading-relaxed">
                    Instantly book seats, track timetables, and manage reservations with our secure, fast, and modern railway ticketing platform.
                </p>

                {/* CALL TO ACTION BUTTONS */}
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md">
                    <Link
                        to="/login"
                        className="bg-yellow-400 hover:bg-yellow-300 text-green-950 font-bold px-8 py-3.5 rounded-xl text-base shadow-lg hover:shadow-yellow-400/20 hover:-translate-y-0.5 transition-all text-center"
                    >
                        Book Ticket
                    </Link>
                    <a
                        href="#features"
                        className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl text-base border border-white/20 backdrop-blur-sm transition-all text-center"
                    >
                        Learn More
                    </a>
                </div>

                {/* TICKET SEARCH BAR PREVIEW CARD */}
                <div className="w-full mt-12 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 md:p-8 text-left border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                        <FaTrain className="text-yellow-500 text-xl" />
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Quick Ticket Search</h2>
                        <span className="ml-auto text-xs px-2.5 py-1 bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 rounded-full font-medium">
                            Preview Only
                        </span>
                    </div>

                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end relative">
                        {/* FROM STATION */}
                        <div className="space-y-2 relative">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                From Station
                            </label>
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
                                <select
                                    value={fromStation}
                                    onChange={(e) => setFromStation(e.target.value)}
                                    className="w-full pl-9 pr-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors cursor-pointer text-sm"
                                >
                                    {stations.map((st) => (
                                        <option key={st} value={st} disabled={st === toStation}>
                                            {st}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* SWAP BUTTON */}
                        <div className="hidden md:flex justify-center pb-2 relative z-20">
                            <button
                                type="button"
                                onClick={handleSwapStations}
                                className="p-3 bg-yellow-400 hover:bg-yellow-300 text-green-950 rounded-full shadow-md hover:scale-110 active:scale-95 transition-all"
                                aria-label="Swap departure and destination stations"
                            >
                                <FaExchangeAlt className="rotate-90 md:rotate-0" />
                            </button>
                        </div>

                        {/* TO STATION */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                To Station
                            </label>
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
                                <select
                                    value={toStation}
                                    onChange={(e) => setToStation(e.target.value)}
                                    className="w-full pl-9 pr-3 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors cursor-pointer text-sm"
                                >
                                    {stations.map((st) => (
                                        <option key={st} value={st} disabled={st === fromStation}>
                                            {st}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* TRAVEL DATE */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Departure Date
                            </label>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                                <input
                                    type="date"
                                    required
                                    value={travelDate}
                                    onChange={(e) => setTravelDate(e.target.value)}
                                    min={new Date().toISOString().split("T")[0]}
                                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-100 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors cursor-pointer text-sm"
                                />
                            </div>
                        </div>

                        {/* SEARCH SUBMIT */}
                        <div className="md:col-span-4 lg:col-span-1 mt-4 md:mt-0">
                            <button
                                type="submit"
                                className="w-full bg-green-900 hover:bg-green-800 text-white font-bold py-3.5 px-6 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-sm"
                            >
                                <FaSearch />
                                Search Trains
                            </button>
                        </div>
                    </form>

                    {/* SEARCH INTERACTION NOTICE */}
                    {searchClicked && (
                        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-900 rounded-xl text-sm text-yellow-900 dark:text-yellow-200 flex items-start gap-3 animate-fade-in-scale">
                            <FaInfoCircle className="mt-0.5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 text-base" />
                            <div>
                                <span className="font-bold">Ready to book ticket? </span>
                                Simulated search from <span className="font-semibold">{fromStation}</span> to <span className="font-semibold">{toStation}</span>. Please{" "}
                                <Link to="/login" className="underline font-bold hover:text-yellow-700 dark:hover:text-yellow-300">
                                    Login
                                </Link>{" "}
                                or{" "}
                                <Link to="/register" className="underline font-bold hover:text-yellow-700 dark:hover:text-yellow-300">
                                    Register
                                </Link>{" "}
                                to check active timetables, view empty seat layouts, and make a secure checkout booking.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Hero;