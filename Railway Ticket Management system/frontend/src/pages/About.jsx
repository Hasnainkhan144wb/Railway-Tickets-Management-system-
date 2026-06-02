import Navbar from "../components/Navbar";

import {
    FaTrain,
    FaTicketAlt,
    FaShieldAlt,
    FaClock,
    FaHeadset,
    FaMapMarkedAlt,
} from "react-icons/fa";

const About = () => {

    return (

<div className="min-h-screen bg-gray-100 pt-20">
            {/* NAVBAR */}

            <Navbar />

            {/* HERO SECTION */}

            <div className="bg-green-900 text-white py-20 px-6">

                <div className="max-w-7xl mx-auto text-center">

                    <h1 className="text-5xl font-bold mb-6">
                        About Railway Management System
                    </h1>

                    <p className="text-lg text-gray-200 max-w-3xl mx-auto">
                        Our Railway Ticket Management System provides
                        passengers with an easy, secure, and modern
                        platform to book railway tickets online,
                        manage bookings, track schedules, and receive
                        real-time support services.
                    </p>

                </div>

            </div>


            {/* FEATURES SECTION */}

            <div className="max-w-7xl mx-auto py-16 px-6">

                <h2 className="text-4xl font-bold text-center text-gray-800 mb-14">
                    Our Features
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* FEATURE 1 */}

                    <div className="bg-green-900 rounded-2xl shadow-lg p-8">

                        <FaTicketAlt className="text-5xl text-white mb-5" />

                        <h3 className="text-white font-bold mb-3">
                            Online Ticket Booking
                        </h3>

                        <p className="text-white">
                            Passengers can easily search trains,
                            reserve seats, and manage bookings
                            online within seconds.
                        </p>

                    </div>


                    {/* FEATURE 2 */}

                    <div className="bg-green-900 rounded-2xl shadow-lg p-8">

                        <FaShieldAlt className="text-5xl text-white mb-5" />

                        <h3 className="text-white font-bold mb-3">
                            Safe & Secure System
                        </h3>

                        <p className="text-white">
                            Our platform ensures secure login,
                            protected passenger information,
                            and safe ticket management.
                        </p>

                    </div>


                    {/* FEATURE 3 */}

                    <div className="bg-green-900 rounded-2xl shadow-lg p-8">

                        <FaClock className="text-5xl text-white mb-5" />

                        <h3 className="text-white font-bold mb-3">
                            Train Schedule Management
                        </h3>

                        <p className="text-white">
                            View train schedules, departure timings,
                            destinations, and real-time booking updates.
                        </p>

                    </div>


                    {/* FEATURE 4 */}

                    <div className="bg-green-900 rounded-2xl shadow-lg p-8">

                        <FaHeadset className="text-white text-blue-900 mb-5" />

                        <h3 className="text-white font-bold mb-3">
                            24/7 Customer Support
                        </h3>

                        <p className="text-white">
                            Passengers can submit complaints,
                            get support feedback, and resolve
                            issues quickly through our support system.
                        </p>

                    </div>


                    {/* FEATURE 5 */}

                    <div className="bg-green-900 rounded-2xl shadow-lg p-8">

                        <FaTrain className="text-5xl text-white mb-5" />

                        <h3 className="text-white font-bold mb-3">
                            Railway Services
                        </h3>

                        <p className="text-white">
                            Multiple train services are available
                            for passengers including economy,
                            business, and express railway options.
                        </p>

                    </div>


                    {/* FEATURE 6 */}

                    <div className="bg-green-900 rounded-2xl shadow-lg p-8">

                        <FaMapMarkedAlt className="text-5xl text-white mb-5" />

                        <h3 className="text-white font-bold mb-3">
                            Easy Route Tracking
                        </h3>

                        <p className="text-white">
                            Search trains by source, destination,
                            and departure timing with a simple
                            and user-friendly interface.
                        </p>

                    </div>

                </div>

            </div>


            {/* WHY CHOOSE US */}

            <div className="bg-white py-20 px-6">

                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

                    <div>

                        <h2 className="text-4xl font-bold text-gray-800 mb-6">
                            Why Choose Our Railway System?
                        </h2>

                        <p className="text-gray-600 text-lg leading-8">
                            We provide a complete railway management
                            solution that improves passenger experience
                            through digital booking, fast support,
                            train management, and secure ticket verification.
                        </p>

                        <ul className="mt-8 space-y-4 text-gray-700">

                            <li>
                                ✅ Fast Online Booking
                            </li>

                            <li>
                                ✅ Real-Time Ticket Management
                            </li>

                            <li>
                                ✅ Passenger Support System
                            </li>

                            <li>
                                ✅ Secure Authentication
                            </li>

                            <li>
                                ✅ Modern Dashboard Interface
                            </li>

                        </ul>

                    </div>


                    <div>

                        <img
                            src="https://images.unsplash.com/photo-1474487548417-781cb71495f3"
                            alt="Railway"
                            className="rounded-2xl shadow-xl"
                        />

                    </div>

                </div>

            </div>


            {/* CONTACT SECTION */}

            <div className="bg-green-900 text-white py-16 px-6">

                <div className="max-w-4xl mx-auto text-center">

                    <h2 className="text-4xl font-bold mb-6">
                        Contact Us
                    </h2>

                    <p className="text-lg text-gray-200 mb-8">
                        Need help regarding train booking or support?
                        Contact our railway management team anytime.
                    </p>

                    <div className="space-y-3 text-lg">

                        <p>
                            📧 Email:
                            support@railwaysystem.com
                        </p>

                        <p>
                            📞 Phone:
                            +92 300 1234567
                        </p>

                        <p>
                            📍 Location:
                            Vehari, Pakistan
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default About;