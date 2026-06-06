import { useTheme } from "../context/ThemeContext";

const AuthLayout = ({ children, title }) => {
  const { darkMode } = useTheme();

  return (
    <div
      className="min-h-screen flex justify-center items-center px-4 bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=1600')",
      }}
    >
      <div className="absolute inset-0 bg-black/55"></div>

      <div className={`relative z-10 shadow-2xl rounded-2xl p-8 w-full max-w-md transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white border border-gray-800" : "bg-white text-gray-800"
      }`}>

        <h1 className={`text-3xl font-extrabold text-center mb-6 tracking-wide ${
          darkMode ? "text-yellow-400" : "text-green-900"
        }`}>
          {title}
        </h1>

        {children}

      </div>

    </div>
  );
};

export default AuthLayout;