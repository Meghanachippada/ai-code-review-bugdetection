// src/AppShell.tsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import { useAuth } from "./context/AuthContext";

export default function AppShell() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const linkBase =
    "px-4 py-3 rounded-md text-base font-semibold transition-all duration-200";
  const linkActive = ({ isActive }: any) =>
    `${linkBase} ${
      isActive
        ? "bg-white text-indigo-600 dark:bg-indigo-700 dark:text-white"
        : "text-white hover:bg-indigo-500/30"
    }`;

  const disabledLink =
    "px-4 py-3 rounded-md text-base font-semibold opacity-40 cursor-not-allowed";

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-[#0d1117] via-[#10131b] to-[#161b22] text-gray-100"
          : "bg-gradient-to-br from-gray-50 via-white to-slate-100 text-gray-800"
      }`}
    >
      {/* 🔹 Top Navbar */}
      <header className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md">
        <div className="mx-auto max-w-7xl flex items-center justify-between py-4 px-6">
          {/* Brand */}
          <div
            onClick={() => navigate("/")}
            className="font-extrabold text-2xl tracking-wide cursor-pointer"
          >
            AI<span className="text-blue-200">Code</span>Review
          </div>

          {/* Nav Links */}
          <nav className="flex gap-6 text-lg items-center">
            {user ? (
              <>
                <NavLink to="/dashboard" className={linkActive}>
                  Dashboard
                </NavLink>
                <NavLink to="/review" className={linkActive}>
                  Code Review
                </NavLink>
                <NavLink to="/analytics" className={linkActive}>
                  Analytics
                </NavLink>
                <NavLink to="/settings" className={linkActive}>
                  Settings
                </NavLink>
              </>
            ) : (
              <>
                <span className={disabledLink}>Dashboard</span>
                <NavLink to="/review" className={linkActive}>
                  Code Review
                </NavLink>
                <span className={disabledLink}>Analytics</span>
                <NavLink to="/settings" className={linkActive}>
                  Settings
                </NavLink>
              </>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex gap-3 items-center">
            {user ? (
              <>
                <span className="text-sm font-medium">
                  👋 Hi, <strong>{user.username}</strong>
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-semibold text-base shadow-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-2 bg-white text-indigo-600 rounded-md hover:bg-gray-100 font-semibold text-base shadow-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-5 py-2 bg-indigo-800 rounded-md hover:bg-indigo-700 text-white font-semibold text-base shadow-sm"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 🔹 Page Content */}
      <main
        className={`mx-auto max-w-6xl p-8 text-[1.1rem] transition-colors duration-500 ${
          theme === "dark"
            ? "bg-transparent text-gray-200"
            : "bg-transparent text-gray-800"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
