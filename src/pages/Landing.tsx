import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Landing() {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-[80vh] grid place-content-center text-center relative overflow-hidden px-6 transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-b from-[#0d1117] via-[#10131b] to-[#161b22] text-gray-200"
          : "bg-gradient-to-b from-indigo-50 via-white to-slate-100 text-gray-800"
      }`}
    >
      {/* Background accent */}
      <div
        className={`absolute inset-0 ${
          theme === "dark"
            ? "bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.08),_transparent_70%)]"
            : "bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.15),_transparent_70%)]"
        }`}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Headline */}
        <h1 className="text-5xl font-extrabold mb-6 leading-tight drop-shadow-sm">
          <span className="bg-gradient-to-r from-indigo-500 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            Smarter Code Reviews. Faster Deployments
          </span>
        </h1>

        {/* Short tagline lines */}
        <p
          className={`text-lg mb-8 leading-relaxed ${
            theme === "dark" ? "text-gray-400" : "text-gray-700"
          }`}
        >
          Empower your workflow with AI-powered insights
          <br />
          <span className="text-indigo-500 font-semibold">
            Review smarter – Deploy faster
          </span>
        </p>

        {/* Call to Action Button */}
        <Link
          to="/review"
          className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white text-lg font-semibold rounded-xl shadow-lg shadow-indigo-300/30 transition-all duration-200"
        >
          🚀 Open the Editor
        </Link>

        {/* Footer Accent */}
        <div className="mt-10 opacity-90 flex justify-center items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="rgb(99,102,241)"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M12 20.5a8.5 8.5 0 100-17 8.5 8.5 0 000 17z"
            />
          </svg>
          <span
            className={`text-sm ${
              theme === "dark" ? "text-gray-500" : "text-gray-500"
            }`}
          >
            AI Code Review Platform
          </span>
        </div>
      </div>
    </div>
  );
}
