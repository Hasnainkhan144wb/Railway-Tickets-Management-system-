import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    FaTrain,
    FaUsers,
    FaTicketAlt,
    FaHome,
    FaSignOutAlt,
    FaClipboardList,
    FaCheckCircle,
    FaChartBar,
    FaHeadset,
    FaBell
} from "react-icons/fa";

const Sidebar = () => {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );


    // LOGOUT

    const logoutHandler = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/login");
    };


    return (

        <div className="w-64 bg-green-900 text-white h-screen p-5 flex flex-col fixed left-0 top-0">

            {/* LOGO */}

            <h1 className="text-2xl font-bold mb-10">
                Railway System
            </h1>


            <ul className="space-y-5 flex flex-col flex-1">

                {/* ================= ADMIN ================= */}

                {user?.role === "admin" && (
                    <>

                        <li>

                            <Link
                                to="/admin-dashboard"
                                className="flex items-center gap-3 hover:text-yellow-300 transition"
                            >
                                <FaHome />
                                Dashboard
                            </Link>

                        </li>


                        <li>

                            <Link
                                to="/manage-trains"
                                className="flex items-center gap-3 hover:text-yellow-300 transition"
                            >
                                <FaTrain />
                                Manage Trains
                            </Link>

                        </li>


                        <li>

                            <Link
                                to="/manage-users"
                                className="flex items-center gap-3 hover:text-yellow-300 transition"
                            >
                                <FaUsers />
                                Manage Users
                            </Link>

                        </li>


                        <li>

                            <Link
                                to="/bookings"
                                className="flex items-center gap-3 hover:text-yellow-300 transition"
                            >
                                <FaClipboardList />
                                All Bookings
                            </Link>

                        </li>
                        <li>

                            <Link
                                to="/reports-analytics"
                                className="flex items-center gap-3 hover:text-yellow-300 transition"
                            >

                                <FaChartBar />

                                Reports & Analytics

                            </Link>

                        </li>
                    </>
                )}



                {/* ================= PASSENGER ================= */}

                {/* PASSENGER */}

                {user?.role === "passenger" && (
                    <>

                        {/* DASHBOARD */}

                        <li>
                            <Link
                                to="/passenger-dashboard"
                                className="flex items-center gap-3 hover:text-yellow-300 transition"
                            >
                                <FaHome />
                                Dashboard
                            </Link>
                        </li>


                        {/* BOOK TICKET */}

                        <li>
                            <Link
                                to="/book-ticket"
                                className="flex items-center gap-3 hover:text-yellow-300 transition"
                            >
                                <FaTicketAlt />
                                Book Ticket
                            </Link>
                        </li>


                        {/* MY BOOKINGS */}

                        <li>
                            <Link
                                to="/my-bookings"
                                className="flex items-center gap-3 hover:text-yellow-300 transition"
                            >
                                <FaTicketAlt />
                                My Bookings
                            </Link>
                        </li>


                        {/* BOOKING HISTORY */}

                        <li>
                            <Link
                                to="/booking-history"
                                className="flex items-center gap-3 hover:text-yellow-300 transition"
                            >
                                <FaClipboardList />
                                Booking History
                            </Link>
                        </li>

                        {/* NOTIFICATIONS */}

                        <li>
                            <Link
                                to="/notifications"
                                className="flex items-center gap-3 hover:text-yellow-300 transition"
                            >
                                <FaBell />
                                Notifications
                            </Link>
                        </li>

                        <li>

                            <Link
                                to="/support"
                                className="flex items-center gap-3 hover:text-yellow-300 transition"
                            >

                                <FaHeadset />

                                Support

                            </Link>

                        </li>

                    </>
                )}
                {/* ================= STAFF ================= */}

                {user?.role === "staff" && (
                    <>

                        <li>

                            <Link
                                to="/staff-dashboard"
                                className="flex items-center gap-3 hover:text-yellow-300 transition"
                            >
                                <FaHome />
                                Dashboard
                            </Link>

                        </li>


                        <li>

                            <Link
                                to="/staff-bookings"
                                className="flex items-center gap-3 hover:text-yellow-300 transition"
                            >
                                <FaClipboardList />
                                Manage Bookings
                            </Link>

                        </li>


                        <li>

                            <Link
                                to="/booking-records"
                                className="flex items-center gap-3 hover:text-yellow-300 transition"
                            >

                                <FaTicketAlt />

                                Booking Records

                            </Link>

                        </li>
                        <li>

                            <Link
                                to="/verify-tickets"
                                className="flex items-center gap-3 hover:text-yellow-300 transition"
                            >

                                <FaCheckCircle />

                                Verify Tickets

                            </Link>

                        </li>
                        <li>
                            <Link
                                to="/manage-seats"
                                className="flex items-center gap-3 hover:text-yellow-300"
                            >
                                <FaTrain />
                                Manage Seats
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/manage-train-status"
                                className="flex items-center gap-3 hover:text-yellow-300"
                            >
                                <FaTrain />
                                Train Status
                            </Link>
                        </li>
                        <li>

                            <Link
                                to="/support-requests"
                                className="flex items-center gap-3 hover:text-yellow-300 transition"
                            >

                                <FaHeadset />

                                Support Requests

                            </Link>

                        </li>

                    </>
                )}



                {/* ================= LOGOUT ================= */}

                <li className="mt-auto">

                    <button
                        onClick={logoutHandler}
                        className="flex items-center gap-3 hover:text-red-400 transition"
                    >

                        <FaSignOutAlt />

                        Logout

                    </button>

                </li>

            </ul>

        </div>
    );
};

export default Sidebar;