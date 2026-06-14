import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
    FaMoon,
    FaSun,
    FaBars,
    FaTimes,
} from "react-icons/fa";

import {
    useTheme,
} from "../context/ThemeContext";
import StaffLoginModal from "./StaffLoginModal";

const Navbar = () => {
    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const {
        darkMode,
        toggleTheme,
    } = useTheme();

    return (

        <nav
            className={`fixed top-0 left-0 w-full z-50 shadow-lg transition-all duration-300
            ${darkMode
                    ? "bg-gray-900/95 text-white backdrop-blur-md border-b border-gray-800"
                    : "bg-green-900/95 text-white backdrop-blur-md border-b border-green-800"
                }`}
        >

            <div className="flex items-center justify-between px-6 md:px-10 py-4 max-w-7xl mx-auto">

                <NavLink to="/" className="text-2xl font-bold flex items-center gap-2 hover:opacity-95 transition">
                    <span className="text-3xl">🚄</span>
                    <span className="tracking-wide bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent font-extrabold">
                        RailWay
                    </span>
                </NavLink>


                {/* DESKTOP MENU */}
                <div className="hidden md:flex space-x-6 items-center">

                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive
                                ? "text-yellow-300 font-semibold"
                                : "hover:text-yellow-300 transition"
                        }
                    >
                        Home
                    </NavLink>


                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            isActive
                                ? "text-yellow-300 font-semibold"
                                : "hover:text-yellow-300 transition"
                        }
                    >
                        About
                    </NavLink>


                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            isActive
                                ? "text-yellow-300 font-semibold"
                                : "hover:text-yellow-300 transition"
                        }
                    >
                        Login
                    </NavLink>


                    <NavLink
                        to="/register"
                        className={({ isActive }) =>
                            isActive
                                ? "text-yellow-300 font-semibold"
                                : "hover:text-yellow-300 transition"
                        }
                    >
                        Register
                    </NavLink>





                    {/* DARK / LIGHT MODE BUTTON */}

                    <button
                        onClick={toggleTheme}
                        className="bg-white text-black p-2 rounded-full hover:scale-110 transition flex items-center justify-center w-9 h-9"
                        aria-label="Toggle dark mode"
                    >

                        {darkMode
                            ? <FaSun className="text-yellow-500" />
                            : <FaMoon className="text-indigo-900" />
                        }

                    </button>

                </div>

                {/* MOBILE HAMBURGER BUTTON */}
                <div className="flex items-center md:hidden gap-3">
                    <button
                        onClick={toggleTheme}
                        className="bg-white text-black p-2 rounded-full hover:scale-110 transition flex items-center justify-center w-8 h-8"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode
                            ? <FaSun className="text-yellow-500 text-sm" />
                            : <FaMoon className="text-indigo-900 text-sm" />
                        }
                    </button>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-2xl text-white hover:text-yellow-300 focus:outline-none transition p-1"
                        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    >
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

            </div>

            {/* MOBILE DRAWER */}
            {isMobileMenuOpen && (
                <div className={`md:hidden border-t ${darkMode ? "bg-gray-950/98 border-gray-800" : "bg-green-950/98 border-green-800"
                    } px-6 py-4 flex flex-col space-y-4 animate-fade-in-scale`}>
                    <NavLink
                        to="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                            isActive ? "text-yellow-300 font-semibold py-2" : "hover:text-yellow-300 transition py-2"
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/about"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                            isActive ? "text-yellow-300 font-semibold py-2" : "hover:text-yellow-300 transition py-2"
                        }
                    >
                        About
                    </NavLink>
                    <NavLink
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                            isActive ? "text-yellow-300 font-semibold py-2" : "hover:text-yellow-300 transition py-2"
                        }
                    >
                        Login
                    </NavLink>
                    <NavLink
                        to="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                            isActive ? "text-yellow-300 font-semibold py-2" : "hover:text-yellow-300 transition py-2"
                        }
                    >
                        Register
                    </NavLink>
                    <button
                        onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsStaffModalOpen(true);
                        }}
                        className="text-left hover:text-yellow-300 transition py-2 font-medium"
                    >
                        Staff
                    </button>
                </div>
            )}

            <StaffLoginModal
                isOpen={isStaffModalOpen}
                onClose={() => setIsStaffModalOpen(false)}
            />

        </nav>
    );
};

export default Navbar;