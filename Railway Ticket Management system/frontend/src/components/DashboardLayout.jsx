import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import StaffDashboardContent from "./StaffDashboardContent";
import AdminDashboardContent from "./AdminDashboardContent";
import PassengerDashboardContent from "./PassengerDashboardContent";
import Chatbot from "./Chatbot";

const OverlayWrapper = ({
    children,
    onClose,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
        >
            <motion.div
                initial={{
                    scale: 0.9,
                    opacity: 0,
                }}
                animate={{
                    scale: 1,
                    opacity: 1,
                }}
                transition={{
                    type: "spring",
                    duration: 0.4,
                }}
                className="
                    bg-white
                    rounded-3xl
                    shadow-2xl
                    w-full
                    max-w-7xl
                    h-[90vh]
                    border
                    border-gray-100
                    flex
                    flex-col
                    relative
                "
            >
                {/* FIXED CLOSE BUTTON */}

                <div className="sticky top-0 z-[9999] flex justify-end p-5 bg-white rounded-t-3xl">
                    <button
                        onClick={onClose}
                        className="
                            bg-red-500
                            hover:bg-red-600
                            text-white
                            p-3
                            rounded-full
                            shadow-lg
                            transition-all
                            duration-200
                            hover:scale-110
                            cursor-pointer
                        "
                        title="Close Page"
                    >
                        <FaTimes size={18} />
                    </button>
                </div>

                {/* ONLY CONTENT SCROLLS */}

                <div className="flex-1 overflow-y-auto px-8 pb-8">
                    {children}
                </div>
            </motion.div>
        </motion.div>
    );
};

const DashboardLayout = ({
    children,
}) => {
    const { pathname } =
        useLocation();

    const navigate =
        useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") ||
        "null"
    );

    const staffOverlayRoutes = [
        "/staff-bookings",
        "/booking-records",
        "/verify-tickets",
        "/manage-seats",
        "/manage-train-status",
        "/support-requests",
    ];

    const adminOverlayRoutes = [
        "/manage-trains",
        "/manage-users",
        "/bookings",
        "/reports-analytics",
    ];

    const passengerOverlayRoutes = [
        "/book-ticket",
        "/my-bookings",
        "/booking-history",
        "/support",
        "/notifications",
    ];

    const isStaff =
        user?.role === "staff";

    const isAdmin =
        user?.role === "admin";

    const isPassenger =
        user?.role === "passenger";

    const isStaffOverlay =
        isStaff &&
        staffOverlayRoutes.includes(
            pathname
        );

    const isAdminOverlay =
        isAdmin &&
        adminOverlayRoutes.includes(
            pathname
        );

    const isPassengerOverlay =
        isPassenger &&
        passengerOverlayRoutes.includes(
            pathname
        );

    const isOverlayRoute = false;

    const renderBackgroundContent =
        () => {

            if (isStaffOverlay) {
                return (
                    <StaffDashboardContent />
                );
            }

            if (isAdminOverlay) {
                return (
                    <AdminDashboardContent />
                );
            }

            if (isPassengerOverlay) {
                return (
                    <PassengerDashboardContent />
                );
            }

            return null;
        };

    const getDashboardPath =
        () => {

            if (isStaff) {
                return "/staff-dashboard";
            }

            if (isAdmin) {
                return "/admin-dashboard";
            }

            if (isPassenger) {
                return "/passenger-dashboard";
            }

            return "/";
        };

    return (
        <div className="bg-gray-100 min-h-screen">

            {/* FIXED SIDEBAR */}

            <div className="fixed left-0 top-0 h-screen z-40">
                <Sidebar />
            </div>

            {/* FIXED TOPBAR */}

            <div className="fixed top-0 left-64 right-0 z-30">
                <Topbar />
            </div>

            {/* MAIN CONTENT */}

            <div className="ml-64 pt-20 p-6">

                {isOverlayRoute ? (
                    <>
                        {/* Dashboard Background */}

                        {renderBackgroundContent()}

                        {/* Popup Overlay */}

                        <OverlayWrapper
                            onClose={() =>
                                navigate(
                                    getDashboardPath()
                                )
                            }
                        >
                            {children}
                        </OverlayWrapper>
                    </>
                ) : (
                    children
                )}

            </div>

            {isPassenger && <Chatbot />}

        </div>
    );
};

export default DashboardLayout;