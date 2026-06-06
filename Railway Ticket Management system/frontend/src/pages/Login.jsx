import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../layouts/AuthLayout";
import { FaTimes, FaEye, FaEyeSlash, FaLock, FaShieldAlt, FaInfoCircle } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [selectedRole, setSelectedRole] = useState("passenger");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // 1. PREVENT LOGGED-IN USERS FROM ACCESSING LOGIN PAGE & LOAD REMEMBERED EMAIL
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === "admin") navigate("/admin-dashboard");
        else if (user.role === "staff") navigate("/staff-dashboard");
        else navigate("/passenger-dashboard");
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData((prev) => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear validation error when typing
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
  };

  // PASSWORD STRENGTH EVALUATOR
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "", color: "bg-gray-200 dark:bg-gray-700" };
    let score = 0;
    if (pass.length >= 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 25, label: "Weak", color: "bg-red-500" };
    if (score === 2 || score === 3) return { score: 60, label: "Medium", color: "bg-yellow-500" };
    return { score: 100, label: "Strong", color: "bg-green-500" };
  };

  const strength = getPasswordStrength(formData.password);

  // FORM VALIDATION
  const validateForm = () => {
    const tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      const userRole = res.data.user?.role;

      // 2. VERIFY THAT THE RETURNED ROLE MATCHES THE SELECTED ROLE
      if (userRole !== selectedRole) {
        setErrors({
          general: `Unauthorized. This account is registered as a ${userRole?.toUpperCase()}, not ${selectedRole.toUpperCase()}. Please select the correct login role.`,
        });
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Handle Remember Me
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      if (userRole === "admin") {
        navigate("/admin-dashboard");
      } else if (userRole === "staff") {
        navigate("/staff-dashboard");
      } else {
        navigate("/passenger-dashboard");
      }
    } catch (error) {
      const serverMessage = error.response?.data?.message || "Invalid email or password.";
      setErrors({
        general: serverMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Login">
      <div className="relative">
        {/* CLOSE BUTTON */}
        <button
          onClick={() => navigate("/")}
          className={`absolute -top-16 right-0 p-2 rounded-full hover:scale-110 transition-all ${
            darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-red-600"
          }`}
          aria-label="Close and return to Home"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* ROLE TABS SELECTOR */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6 border border-gray-200/50 dark:border-gray-700/50">
          {["passenger", "staff", "admin"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => {
                setSelectedRole(role);
                setErrors({});
              }}
              className={`flex-1 py-2 text-xs font-bold capitalize rounded-lg transition-all ${
                selectedRole === role
                  ? darkMode
                    ? "bg-gray-700 text-yellow-400 shadow-md"
                    : "bg-white text-green-950 shadow"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* GENERAL ERROR BANNER */}
        {errors.general && (
          <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-start gap-2.5 animate-fade-in-scale">
            <FaInfoCircle className="mt-0.5 flex-shrink-0 text-base" />
            <p className="leading-relaxed">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* EMAIL */}
          <div className="mb-4">
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder={`e.g. ${selectedRole}@railwaysystem.com`}
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                errors.email
                  ? "border-red-500 bg-red-50/10"
                  : darkMode
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Password
              </label>
              {/* FORGOT PASSWORD PLACEHOLDER */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Password recovery feature is under maintenance. Please contact support.");
                }}
                className="text-xs text-yellow-500 hover:text-yellow-400 transition-colors"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full border rounded-xl pl-4 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                  errors.password
                    ? "border-red-500 bg-red-50/10"
                    : darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-yellow-500 transition-colors text-lg"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password}</p>
            )}

            {/* PASSWORD STRENGTH INDICATOR */}
            {formData.password && (
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Strength:</span>
                  <span className="font-semibold">{strength.label}</span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color} transition-all duration-300`}
                    style={{ width: `${strength.score}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* REMEMBER ME CHECKBOX */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-yellow-500 focus:ring-yellow-500 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 w-4 h-4"
              />
              <span>Remember me</span>
            </label>
          </div>

          {/* SUBMIT BUTTON WITH LOADING STATE */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-green-900 hover:bg-green-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
              isLoading ? "opacity-75 cursor-not-allowed" : "hover:-translate-y-0.5"
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Secure Login"
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          Don’t have an account?
          <Link
            to="/register"
            className="text-yellow-500 font-bold ml-1.5 hover:underline"
          >
            Register
          </Link>
        </p>

        {/* SECURITY CREDENTIALS STRIP */}
        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <FaShieldAlt className="text-sm text-green-600 dark:text-green-500" />
          <span>Secured with SSL 256-bit encryption</span>
          <FaLock className="text-xs" />
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;