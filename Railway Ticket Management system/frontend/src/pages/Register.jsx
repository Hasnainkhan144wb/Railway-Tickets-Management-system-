import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../layouts/AuthLayout";
import {
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaShieldAlt,
  FaInfoCircle,
  FaCheck,
  FaUser,
  FaEnvelope,
  FaKey,
  FaCheckCircle,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const Register = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "passenger",
    accessCode: "",
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [emailStatus, setEmailStatus] = useState({
    checking: false,
    exists: false,
    error: "",
  });

  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // 1. PREVENT LOGGED-IN USERS FROM ACCESSING REGISTER PAGE
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
  }, [navigate]);

  // 2. REAL-TIME EMAIL DUPLICATION CHECK (DEBOUNCED)
  useEffect(() => {
    if (!formData.email) {
      setEmailStatus({ checking: false, exists: false, error: "" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailStatus({ checking: false, exists: false, error: "Invalid email format" });
      return;
    }

    setEmailStatus((prev) => ({ ...prev, checking: true, error: "" }));

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/auth/check-email", {
          email: formData.email,
        });
        if (res.data.exists) {
          setEmailStatus({ checking: false, exists: true, error: "Email is already registered" });
        } else {
          setEmailStatus({ checking: false, exists: false, error: "" });
        }
      } catch (err) {
        setEmailStatus({ checking: false, exists: false, error: "Failed to check email availability" });
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [formData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // PASSWORD REQUIREMENTS EVALUATOR
  const getPasswordRequirements = (pass) => {
    return {
      minLength: pass.length >= 8,
      hasUppercase: /[A-Z]/.test(pass),
      hasNumber: /[0-9]/.test(pass),
      hasSpecialChar: /[^A-Za-z0-9]/.test(pass),
    };
  };

  const requirements = getPasswordRequirements(formData.password);
  const reqCount = Object.values(requirements).filter(Boolean).length;

  const getPasswordStrength = () => {
    if (!formData.password) return { score: 0, label: "", color: "bg-gray-200 dark:bg-gray-700" };
    if (formData.password.length < 8) return { score: 25, label: "Weak (too short)", color: "bg-red-500" };
    
    switch (reqCount) {
      case 1:
        return { score: 25, label: "Weak", color: "bg-red-500" };
      case 2:
        return { score: 50, label: "Medium", color: "bg-yellow-500" };
      case 3:
        return { score: 75, label: "Good", color: "bg-blue-500" };
      case 4:
        return { score: 100, label: "Strong", color: "bg-green-500" };
      default:
        return { score: 0, label: "", color: "bg-gray-200" };
    }
  };

  const strength = getPasswordStrength();

  // FORM VALIDATION
  const validateForm = () => {
    const tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      tempErrors.name = "Full Name is required";
    }

    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Invalid email format";
    } else if (emailStatus.exists) {
      tempErrors.email = "Email is already registered";
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters";
    } else if (reqCount < 4) {
      tempErrors.password = "Password does not meet all security requirements";
    }

    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    if ((formData.role === "admin" || formData.role === "staff") && !formData.accessCode) {
      tempErrors.accessCode = `${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} Access Code is required`;
    }

    if (!acceptTerms) {
      tempErrors.terms = "You must accept the terms & conditions";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || emailStatus.checking) return;

    setIsLoading(true);
    setErrors({});

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        ...(formData.role !== "passenger" && { accessCode: formData.accessCode }),
      };

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        payload
      );

      // Save credentials for auto-login
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setRegistrationSuccess(true);

      // Auto-redirect to dashboard after 2 seconds
      setTimeout(() => {
        const userRole = res.data.user.role;
        if (userRole === "admin") {
          navigate("/admin-dashboard");
        } else if (userRole === "staff") {
          navigate("/staff-dashboard");
        } else {
          navigate("/passenger-dashboard");
        }
      }, 2000);

    } catch (error) {
      const serverMessage = error.response?.data?.message || "Registration failed. Please try again.";
      setErrors({
        general: serverMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <AuthLayout title="Account Created!">
        <div className="text-center py-8 px-4 flex flex-col items-center justify-center animate-fade-in-scale">
          <FaCheckCircle className="text-green-500 text-7xl mb-4 animate-bounce" />
          <h2 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Welcome Aboard, {formData.name}!
          </h2>
          <p className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Your account has been registered successfully.
          </p>
          <div className="flex items-center gap-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 p-4 rounded-xl text-green-700 dark:text-green-300 text-xs w-full justify-center">
            <svg
              className="animate-spin h-4 w-4 text-green-700 dark:text-green-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Auto-logging you in and redirecting to your dashboard...</span>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create Account">
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
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-5 border border-gray-200/50 dark:border-gray-700/50">
          {["passenger", "staff"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => {
                setFormData((prev) => ({ ...prev, role }));
                setErrors((prev) => ({ ...prev, accessCode: null }));
              }}
              className={`flex-1 py-2 text-xs font-bold capitalize rounded-lg transition-all cursor-pointer ${
                formData.role === role
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

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* NAME */}
          <div>
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-gray-400">
                <FaUser className="text-sm" />
              </span>
              <input
                type="text"
                name="name"
                placeholder="Enter Full Name"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                  errors.name
                    ? "border-red-500 bg-red-50/10"
                    : darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-gray-400">
                <FaEnvelope className="text-sm" />
              </span>
              <input
                type="email"
                name="email"
                placeholder="e.g. user@railway.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full border rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                  errors.email || emailStatus.exists
                    ? "border-red-500 bg-red-50/10"
                    : emailStatus.error
                    ? "border-amber-500 bg-amber-50/10"
                    : formData.email && !emailStatus.checking && !emailStatus.exists
                    ? "border-green-500 bg-green-50/10"
                    : darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              />
              {/* Spinner & Availability Indicator */}
              <div className="absolute right-3.5 top-3.5 flex items-center justify-center">
                {emailStatus.checking && (
                  <svg className="animate-spin h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {formData.email && !emailStatus.checking && !emailStatus.exists && !emailStatus.error && (
                  <FaCheck className="text-green-500 text-sm animate-pulse" title="Email is available" />
                )}
              </div>
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email}</p>
            )}
            {emailStatus.exists && !errors.email && (
              <p className="text-red-500 text-xs mt-1.5 ml-1">{emailStatus.error || "This email is already registered"}</p>
            )}
            {formData.email && !emailStatus.checking && !emailStatus.exists && !emailStatus.error && !errors.email && (
              <p className="text-green-500 text-xs mt-1.5 ml-1">✓ Email is available</p>
            )}
          </div>

          {/* ROLE ACCESS CODE (ONLY SHOWN FOR STAFF / ADMIN) */}
          {(formData.role === "admin" || formData.role === "staff") && (
            <div className="animate-fade-in-scale">
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
                {formData.role.toUpperCase()} ACCESS CODE
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-yellow-600 dark:text-yellow-400">
                  <FaKey className="text-sm" />
                </span>
                <input
                  type="password"
                  name="accessCode"
                  placeholder={`Enter ${formData.role} registration passcode`}
                  value={formData.accessCode}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                    errors.accessCode
                      ? "border-red-500 bg-red-50/10"
                      : darkMode
                      ? "bg-gray-800 border-yellow-700/60 text-white placeholder-gray-500"
                      : "bg-white border-yellow-600/60 text-gray-800"
                  }`}
                />
              </div>
              {errors.accessCode && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.accessCode}</p>
              )}
              <p className="text-gray-400 text-[10px] mt-1 ml-1">
                * Entering staff or admin credentials requires a predefined security access code.
              </p>
            </div>
          )}

          {/* PASSWORD */}
          <div>
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-gray-400">
                <FaLock className="text-sm" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create secure password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full border rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
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

            {/* PASSWORD REQUIREMENTS & STRENGTH */}
            {formData.password && (
              <div className="mt-3.5 space-y-2.5 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-200/50 dark:border-gray-700/30">
                {/* Strength Meter */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Password Strength:</span>
                    <span className="font-bold">{strength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${strength.score}%` }}
                    ></div>
                  </div>
                </div>

                {/* Requirements Checklist */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px]">
                  <div className={`flex items-center gap-1.5 ${requirements.minLength ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
                    <FaCheck className="text-[9px]" />
                    <span>Min 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${requirements.hasUppercase ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
                    <FaCheck className="text-[9px]" />
                    <span>Uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${requirements.hasNumber ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
                    <FaCheck className="text-[9px]" />
                    <span>At least one number</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${requirements.hasSpecialChar ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
                    <FaCheck className="text-[9px]" />
                    <span>Special character</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-gray-400">
                <FaLock className="text-sm" />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full border rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors ${
                  errors.confirmPassword
                    ? "border-red-500 bg-red-50/10"
                    : darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-yellow-500 transition-colors text-lg"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* TERMS & CONDITIONS CHECKBOX */}
          <div className="py-1">
            <label className="flex items-start gap-2.5 text-xs text-gray-500 dark:text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  if (errors.terms) setErrors((prev) => ({ ...prev, terms: null }));
                }}
                disabled={isLoading}
                className="rounded text-yellow-500 focus:ring-yellow-500 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 w-4.5 h-4.5 mt-0.5 flex-shrink-0"
              />
              <span className="leading-tight">
                I read and accept the{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Terms and conditions description: Please use our railway ticket management app responsibly. We protect your privacy and encrypt all data securely.");
                  }}
                  className="text-yellow-500 hover:underline font-semibold"
                >
                  Terms & Conditions
                </a>{" "}
                and Privacy Policy.
              </span>
            </label>
            {errors.terms && (
              <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.terms}</p>
            )}
          </div>

          {/* SUBMIT BUTTON WITH LOADING STATE */}
          <button
            type="submit"
            disabled={isLoading || emailStatus.checking}
            className={`w-full bg-green-900 hover:bg-green-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
              isLoading || emailStatus.checking ? "opacity-75 cursor-not-allowed" : "hover:-translate-y-0.5"
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
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          Already have an account?
          <Link
            to="/login"
            className="text-yellow-500 font-bold ml-1.5 hover:underline"
          >
            Login
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

export default Register;