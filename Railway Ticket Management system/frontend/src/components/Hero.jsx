import { Link } from "react-router-dom";
const Hero = () => {
    return (

        <section
            className="min-h-screen flex items-center justify-center px-6 bg-cover bg-center relative"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1474487548417-781cb71495f3')",
            }}
        >

            {/* DARK OVERLAY */}

            <div className="absolute inset-0 bg-black/60"></div>


            {/* CONTENT */}

            <div className="text-center max-w-3xl relative z-10">

                <h1 className="text-6xl font-bold text-white leading-tight">

                    Railway Tickets
                    <br />
                    Management System

                </h1>

                <p className="text-gray-200 text-lg mt-6">

                    Book train tickets online easily, securely, and quickly.
                    Manage schedules, reservations, and passengers with a modern MERN stack platform.

                </p>


                <div className="mt-8 flex justify-center gap-4">

                    <button className="bg-green-900 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-700 transition w-48">

                        <Link
                            to="/login"
                        >
                            Book Ticket
                        </Link>

                    </button>


                    <Link
                        to="/about"
                        className="bg-green-900 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-700 transition w-48 flex items-center justify-center"
                    >

                        Learn More

                    </Link>

                </div>

            </div>

        </section>
    );
};

export default Hero;