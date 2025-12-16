// src/lib/api.ts
import type { AnalyzeRequest, AnalyzeResponse } from "./types";

const API_BASE = "/api";

export default {
  // --- Existing function ---
  analyzeCode: async ({
    language,
    content,
    depth = "deep",
  }: AnalyzeRequest): Promise<AnalyzeResponse> => {
    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token && token !== "null" && token !== "undefined") {
        headers["Authorization"] = `Bearer ${token}`;
      }


      const response = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers,
        body: JSON.stringify({ language, content, depth }),
      });

      if (!response.ok) throw new Error(`Backend returned ${response.status}`);
      const data: AnalyzeResponse = await response.json();

      if (depth === "standard") {
        data.issues = data.issues.slice(0, Math.ceil(data.issues.length / 2));
        data.ai_feedback =
          "Summary (Standard Mode):\n" +
          (data.ai_feedback.split(".").slice(0, 2).join(".") ||
            "Basic checks completed.");
      }
      return data;
    } catch (error) {
      console.error("❌ API call failed:", error);
      throw new Error("Backend not reachable or request failed.");
    }
  },

  // --- Auth functions ---
  registerUser: async (data: { username: string; email: string; password: string }) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  loginUser: async (data: { username: string; password: string }) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (res.ok && json.access_token) {
      localStorage.setItem("token", json.access_token);
    }
    return json;
  },

  // --- 🧩 New session API functions ---
  getUserSessions: async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/sessions/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch user sessions");
      return await res.json();
    } catch (err) {
      console.error("Error fetching user sessions:", err);
      return [];
    }
  },

  // ✅ NEW FUNCTION ADDED (required for SessionDetails to work)
  getSingleSession: async (token: string, id: number) => {
    try {
      const res = await fetch(`${API_BASE}/sessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch session");
      return await res.json();
    } catch (err) {
      console.error("Error fetching single session:", err);
      return null;
    }
  },
  // --------------------------------------------------------------

  saveUserSession: async (token: string, sessionData: any) => {
    try {
      const res = await fetch(`${API_BASE}/sessions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sessionData),
      });
      if (!res.ok) throw new Error("Failed to save session");
      return await res.json();
    } catch (err) {
      console.error("Error saving session:", err);
    }
  },

  deleteUserSession: async (token: string, sessionId: number) => {
    try {
      const res = await fetch(`${API_BASE}/sessions/${sessionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch (err) {
      console.error("Error deleting session:", err);
    }
  },
};
