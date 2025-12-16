// src/pages/Analytics.tsx
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../lib/api";
import type { ReviewSession } from "../lib/storage";

export default function Analytics() {
  const [sessions, setSessions] = useState<ReviewSession[]>([]);
  const { user, token } = useAuth();
  const { theme } = useTheme();

  // 🧩 Load only the logged-in user's sessions
  useEffect(() => {
    const loadUserSessions = async () => {
      if (token) {
        const data = await api.getUserSessions(token);
        if (Array.isArray(data)) setSessions(data);
      } else {
        setSessions([]); // no access if not logged in
      }
    };
    loadUserSessions();
  }, [token]);

  // 🔒 Restrict if not logged in
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
          <p>Please log in to view analytics data.</p>
        </div>
      </div>
    );
  }

  // 🧮 Aggregate analytics data
  const issueTypeCounts: Record<string, number> = {};
  const severityCounts: Record<string, number> = {};

  sessions.forEach((session) => {
    session.issues?.forEach((issue: any) => {
      issueTypeCounts[issue.type] = (issueTypeCounts[issue.type] || 0) + 1;
      severityCounts[issue.severity || "undefined"] =
        (severityCounts[issue.severity || "undefined"] || 0) + 1;
    });
  });

  const issueTypeData = Object.entries(issueTypeCounts).map(([type, count]) => ({
    type,
    count,
  }));
  const severityData = Object.entries(severityCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#6366F1", "#22C55E", "#FACC15", "#EF4444", "#3B82F6"];

  return (
    <div
      className={`min-h-[80vh] p-8 rounded-2xl transition-colors duration-500 
      bg-gradient-to-b from-indigo-50 via-white to-slate-100 
      dark:from-[#0d1117] dark:via-[#10131b] dark:to-[#161b22]
      text-gray-800 dark:text-gray-200`}
    >
      <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-6">
        📊 Analytics Dashboard — Hello, {user.username}!
      </h1>

      {sessions.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          No analytics data yet — run a few code reviews first.
        </p>
      ) : (
        <div className="space-y-10">
          {issueTypeData.length > 0 && (
            <div className="bg-white dark:bg-[#1c2128] rounded-2xl border border-indigo-100 dark:border-gray-700 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                🧩 Issue Type Distribution
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={issueTypeData}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {severityData.length > 0 && (
            <div className="bg-white dark:bg-[#1c2128] rounded-2xl border border-indigo-100 dark:border-gray-700 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                ⚠️ Severity Level Distribution
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value})`}
                  >
                    {severityData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
