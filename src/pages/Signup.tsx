import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useTheme } from "../context/ThemeContext";

export default function Signup() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await api.registerUser(formData);
      if (res.user_id) {
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(res.detail || "Failed to register.");
      }
    } catch (err: any) {
      setError("Server not reachable or registration failed.");
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
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create an Account 🚀
        </h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className={`w-full mb-4 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full mb-4 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full mb-6 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputBg}`}
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-3">{success}</p>}

        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
        >
          Sign Up
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
