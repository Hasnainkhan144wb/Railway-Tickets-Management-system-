import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
    FaMoon,
    FaSun,
} from "react-icons/fa";

import {
    useTheme,
} from "../context/ThemeContext";
import StaffLoginModal from "./StaffLoginModal";

const Navbar = () => {
    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

    const {
        darkMode,
        toggleTheme,
    } = useTheme();

    return (

        <nav
            className={`fixed top-0 left-0 w-full z-50 shadow-md transition-all duration-300
            ${darkMode
                    ? "bg-gray-900 text-white"
                    : "bg-green-900 text-white"
                }`}
        >

            <div className="flex items-center px-10 py-5">

                <h1 className="text-2xl font-bold">
                    Railway System
                </h1>


                <div className="space-x-6 flex items-center ml-auto">

                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive
                                ? "text-yellow-300"
                                : "hover:text-yellow-300 transition"
                        }
                    >
                        Home
                    </NavLink>


                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            isActive
                                ? "text-yellow-300"
                                : "hover:text-yellow-300 transition"
                        }
                    >
                        About
                    </NavLink>


                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            isActive
                                ? "text-yellow-300"
                                : "hover:text-yellow-300 transition"
                        }
                    >
                        Login
                    </NavLink>


                    <NavLink
                        to="/register"
                        className={({ isActive }) =>
                            isActive
                                ? "text-yellow-300"
                                : "hover:text-yellow-300 transition"
                        }
                    >
                        Register
                    </NavLink>


                    <button
                        onClick={() => setIsStaffModalOpen(true)}
                        className="hover:text-yellow-300 transition font-medium"
                    >
                        Staff
                    </button>


                    {/* DARK / LIGHT MODE BUTTON */}

                    <button
                        onClick={toggleTheme}
                        className="bg-white text-black p-2 rounded-full hover:scale-110 transition"
                    >

                        {darkMode
                            ? <FaSun />
                            : <FaMoon />
                        }

                    </button>

                </div>

            </div>

            <StaffLoginModal
                isOpen={isStaffModalOpen}
                onClose={() => setIsStaffModalOpen(false)}
            />

        </nav>
    );
};

export default Navbar;