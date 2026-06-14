import {
    Link,
    useNavigate,
    useLocation
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
    const location = useLocation();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const currentPath = location.pathname;
    const searchParams = new URLSearchParams(location.search);

    const isActive = (path, tab = null) => {
        if (tab !== null) {
            const activeTab = searchParams.get("tab") || "dashboard";
            return currentPath === path && activeTab === tab;
        }
        return currentPath === path;
    };

    const getLinkClass = (path, tab = null) => {
        const active = isActive(path, tab);
        return `flex items-center gap-3 transition font-bold ${active ? 'text-yellow-400' : 'text-white hover:text-yellow-300'}`;
    };

    const getPassengerLinkClass = (path) => {
        const active = isActive(path);
        return `flex items-center gap-3 transition ${active ? 'text-yellow-400 font-bold' : 'text-white hover:text-yellow-300'}`;
    };


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
                                to="/admin-dashboard?tab=dashboard"
                                className={getLinkClass("/admin-dashboard", "dashboard")}
                            >
                                <FaHome />
                                Dashboard
                            </Link>

                        </li>


                        <li>

                            <Link
                                to="/admin-dashboard?tab=trains"
                                className={getLinkClass("/admin-dashboard", "trains")}
                            >
                                <FaTrain />
                                Manage Trains
                            </Link>

                        </li>


                        <li>

                            <Link
                                to="/admin-dashboard?tab=users"
                                className={getLinkClass("/admin-dashboard", "users")}
                            >
                                <FaUsers />
                                Manage Users
                            </Link>

                        </li>


                        <li>

                            <Link
                                to="/admin-dashboard?tab=bookings"
                                className={getLinkClass("/admin-dashboard", "bookings")}
                            >
                                <FaClipboardList />
                                All Bookings
                            </Link>

                        </li>
                        <li>

                            <Link
                                to="/admin-dashboard?tab=reports"
                                className={getLinkClass("/admin-dashboard", "reports")}
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
                                className={getPassengerLinkClass("/passenger-dashboard")}
                            >
                                <FaHome />
                                Dashboard
                            </Link>
                        </li>


                        {/* BOOK TICKET */}

                        <li>
                            <Link
                                to="/book-ticket"
                                className={getPassengerLinkClass("/book-ticket")}
                            >
                                <FaTicketAlt />
                                Book Ticket
                            </Link>
                        </li>


                        {/* MY BOOKINGS */}

                        <li>
                            <Link
                                to="/my-bookings"
                                className={getPassengerLinkClass("/my-bookings")}
                            >
                                <FaTicketAlt />
                                My Bookings
                            </Link>
                        </li>


                        {/* BOOKING HISTORY */}

                        <li>
                            <Link
                                to="/booking-history"
                                className={getPassengerLinkClass("/booking-history")}
                            >
                                <FaClipboardList />
                                Booking History
                            </Link>
                        </li>

                        {/* NOTIFICATIONS */}

                        <li>
                            <Link
                                to="/notifications"
                                className={getPassengerLinkClass("/notifications")}
                            >
                                <FaBell />
                                Notifications
                            </Link>
                        </li>

                        <li>

                            <Link
                                to="/support"
                                className={getPassengerLinkClass("/support")}
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
                                to="/staff-dashboard?tab=dashboard"
                                className={getLinkClass("/staff-dashboard", "dashboard")}
                            >
                                <FaHome />
                                Dashboard
                            </Link>

                        </li>


                        <li>

                            <Link
                                to="/staff-dashboard?tab=bookings"
                                className={getLinkClass("/staff-dashboard", "bookings")}
                            >
                                <FaClipboardList />
                                Manage Bookings
                            </Link>

                        </li>


                        <li>

                            <Link
                                to="/staff-dashboard?tab=records"
                                className={getLinkClass("/staff-dashboard", "records")}
                            >

                                <FaTicketAlt />

                                Booking Records

                            </Link>

                        </li>
                        <li>

                            <Link
                                to="/staff-dashboard?tab=verify"
                                className={getLinkClass("/staff-dashboard", "verify")}
                            >

                                <FaCheckCircle />

                                Verify Tickets

                            </Link>

                        </li>
                        <li>
                            <Link
                                to="/staff-dashboard?tab=seats"
                                className={getLinkClass("/staff-dashboard", "seats")}
                            >
                                <FaTrain />
                                Manage Seats
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/staff-dashboard?tab=status"
                                className={getLinkClass("/staff-dashboard", "status")}
                            >
                                <FaTrain />
                                Train Status
                            </Link>
                        </li>
                        <li>

                            <Link
                                to="/staff-dashboard?tab=support"
                                className={getLinkClass("/staff-dashboard", "support")}
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