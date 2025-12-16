// src/pages/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext"; // ✅ added

export default function Login() {
  const { theme } = useTheme();
  const { login } = useAuth(); // ✅ use login from context
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.loginUser({ username, password });
      if (res.access_token) {
        // ✅ store token in context and fetch user
        await login(res.access_token);
        navigate("/"); // redirect to home after login
      } else {
        setError(res.detail || "Invalid credentials");
      }
    } catch {
      setError("Server not reachable or invalid credentials");
    }
  };

  const bgGradient =
    theme === "dark"
      ? "bg-gradient-to-b from-[#0d1117] via-[#10131b] to-[#161b22] text-gray-200"
      : "bg-gradient-to-b from-indigo-50 via-white to-slate-100 text-gray-800";

  const cardBg =
    theme === "dark"
      ? "bg-[#1c2128] border border-gray-700 text-gray-200"
      : "bg-white border border-gray-200 text-gray-800";

  const inputBg =
    theme === "dark"
      ? "bg-[#0d1117] border border-gray-700 placeholder-gray-500 text-gray-200"
      : "bg-gray-50 border border-gray-300 placeholder-gray-400 text-gray-800";

  return (
    <div
      className={`min-h-[80vh] flex items-center justify-center px-6 transition-colors duration-500 ${bgGradient}`}
    >
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-sm p-8 rounded-2xl shadow-lg ${cardBg}`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back 👋</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`w-full mb-4 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full mb-6 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
        >
          Login
        </button>

        <p className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
