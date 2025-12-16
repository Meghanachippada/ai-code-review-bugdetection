// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSessions,
  clearSessions,
  deleteSession,
  type ReviewSession,
} from "../lib/storage";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

export default function Dashboard() {
  const [sessions, setSessions] = useState<ReviewSession[]>([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, token } = useAuth();

  // 🧩 Load sessions (from backend if logged in)
  useEffect(() => {
    const loadSessions = async () => {
      try {
        if (token) {
          const serverData = await api.getUserSessions(token);
          if (Array.isArray(serverData)) setSessions(serverData);
          else setSessions([]);
        } else {
          setSessions(getSessions());
        }
      } catch (err) {
        console.error("Error loading sessions:", err);
        setSessions(getSessions()); // fallback to local
      }
    };
    loadSessions();
  }, [token]);

  const handleClearAll = () => {
    if (window.confirm("Clear all saved sessions?")) {
      if (token) {
        alert("Bulk deletion for server sessions not yet supported.");
      } else {
        clearSessions();
        setSessions([]);
      }
    }
  };

  const handleDelete = async (id: any) => {
    if (window.confirm("Delete this session?")) {
      if (token) await api.deleteUserSession(token, id);
      else deleteSession(id);
      setSessions(token ? await api.getUserSessions(token) : getSessions());
    }
  };

  const filtered = sessions.filter((s) =>
    filter === "all" ? true : s.language?.toLowerCase() === filter
  );

  // 🔒 Not logged in
  if (!user) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center text-center ${
          theme === "dark"
            ? "bg-[#0d1117] text-gray-300"
            : "bg-gray-50 text-gray-800"
        }`}
      >
        <div className="p-8 rounded-2xl shadow-md border">
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
            🔒 Access Restricted
          </h2>
          <p>
            Please{" "}
            <span className="font-semibold text-indigo-500">log in</span> to
            view your dashboard.
          </p>
        </div>
      </div>
    );
  }

  // 🟢 Logged-in dashboard
  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-b from-[#0d1117] via-[#10131b] to-[#161b22] text-gray-300"
          : "bg-gradient-to-b from-gray-50 via-white to-slate-100 text-gray-900"
      }`}
    >
      <div
        className={`max-w-3xl mx-auto p-6 rounded-2xl shadow-md border ${
          theme === "dark"
            ? "bg-[#1c2128]/90 border-gray-700"
            : "bg-white/90 border-gray-200"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
            Welcome, {user.username}! 👋
          </h1>
          <div className="flex items-center space-x-3">
            <select
              className={`border rounded-lg px-2 py-1 ${
                theme === "dark"
                  ? "bg-[#0d1117] text-gray-300 border-gray-700"
                  : "bg-gray-100 text-gray-800 border-gray-300"
              }`}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
            </select>
            <button
              onClick={handleClearAll}
              className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition-all"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Sessions List */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500">
            No review sessions found for your account.
          </p>
        ) : (
          <div className="space-y-4">
            {filtered.map((s) => (
              <div
                key={s.id}
                className={`border rounded-xl p-4 cursor-pointer ${
                  theme === "dark"
                    ? "bg-[#0d1117] hover:bg-[#1c2128] border-gray-700"
                    : "bg-indigo-50 hover:bg-indigo-100 border-gray-200"
                }`}
                onClick={() => navigate(`/session/${s.id}`)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(
                      s.ts ?? s.created_at ?? new Date().toISOString()
                    ).toLocaleString()}{" "}
                    • {s.language?.toUpperCase()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(s.id);
                    }}
                    className="text-sm hover:underline text-indigo-500"
                  >
                    Delete
                  </button>
                </div>
                <pre
                  className={`text-sm border p-3 rounded-md overflow-x-auto max-h-48 whitespace-pre-wrap ${
                    theme === "dark"
                      ? "bg-[#161b22] text-gray-300 border-gray-700"
                      : "bg-white text-gray-800 border-gray-200"
                  }`}
                >
                  {s.snippet?.trim().slice(0, 300)}
                </pre>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                  {s.issues?.length || 0} issues
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
