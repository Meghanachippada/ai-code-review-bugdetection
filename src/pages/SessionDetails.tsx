import { useParams, useNavigate } from "react-router-dom";
import { getSessions, type ReviewSession } from "../lib/storage";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

export default function SessionDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<ReviewSession | null>(null);
  const { theme } = useTheme();
  const { token } = useAuth();

  useEffect(() => {
    const loadSession = async () => {
      // If logged in → use backend
      if (token) {
        try {
          const serverSession = await api.getSingleSession(token, Number(id));
          setSession(serverSession);
          return;
        } catch (err) {
          console.error("Backend session load failed:", err);
          setSession(null);
          return;
        }
      }

      // If not logged in → fallback to local storage
      const sessions = getSessions();
      const found = sessions.find((s) => String(s.id) === String(id));
      setSession(found || null);
    };

    loadSession();
  }, [id, token]);

  if (!session) {
    return (
      <div
        className={`p-6 text-center min-h-screen transition-colors duration-500 ${
          theme === "dark"
            ? "bg-gradient-to-b from-[#0d1117] via-[#10131b] to-[#161b22] text-gray-300"
            : "bg-gradient-to-b from-white via-slate-50 to-slate-100 text-gray-700"
        }`}
      >
        <p>Session not found.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  const cardBg =
    theme === "dark"
      ? "bg-[#1c2128] border border-gray-700 text-gray-200"
      : "bg-white border border-gray-200 text-gray-800";

  const snippetBg =
    theme === "dark"
      ? "bg-[#0d1117] text-gray-300 border border-gray-700"
      : "bg-gray-50 text-gray-800 border border-gray-200";

  const issueBg =
    theme === "dark"
      ? "bg-[#151a22] border border-gray-700"
      : "bg-indigo-50 border border-indigo-100";

  return (
    <div
      className={`p-8 min-h-screen transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-b from-[#0d1117] via-[#10131b] to-[#161b22]"
          : "bg-gradient-to-b from-white via-slate-50 to-slate-100"
      }`}
    >
      <div className={`max-w-3xl mx-auto p-6 rounded-2xl shadow-md ${cardBg}`}>
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold text-indigo-500 mb-2">
          {session.language.toUpperCase()} •{" "}
          {new Date(session.ts).toLocaleString()}
        </h1>

        <p className="mb-4">
          Total Issues:{" "}
          <span className="font-semibold text-indigo-400">
            {session.issues.length}
          </span>
        </p>

        {session.issues.length > 0 ? (
          <ul className="space-y-3">
            {session.issues.map((issue: any, i: number) => (
              <li
                key={i}
                className={`border-l-4 border-indigo-500 rounded p-3 ${issueBg}`}
              >
                <p className="font-medium text-indigo-400">
                  <strong>{issue.type}</strong> — {issue.message}
                </p>
                {issue.line && (
                  <p className="text-sm text-gray-400">
                    Line: {issue.line} | Severity:{" "}
                    <span className="capitalize">{issue.severity}</span>
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="italic text-gray-400">No issues recorded.</p>
        )}

        {session.snippet && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2 text-indigo-400">
              Code Snippet
            </h2>
            <pre className={`p-4 rounded text-sm overflow-x-auto ${snippetBg}`}>
              {session.snippet}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
