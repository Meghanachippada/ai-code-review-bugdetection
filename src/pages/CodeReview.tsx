// src/pages/CodeReview.tsx
import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import Editor from "../components/Editor";
import IssueList from "../components/IssueList";
import FileLoader from "../components/FileLoader";
import API from "../lib/api";
import type { AnalyzeRequest, Issue } from "../lib/types";
import {
  saveSession,
  saveDraft,
  getDraft,
  saveConfidenceData,
} from "../lib/storage";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext"; // ✅ NEW import for token access

export default function CodeReview() {
  const { depth } = useSettings();
  const { token } = useAuth(); // ✅ Access logged-in token

  const [language, setLanguage] = useState<AnalyzeRequest["language"]>("javascript");
  const [code, setCode] = useState<string>(getDraft());
  const [issues, setIssues] = useState<Issue[]>([]);
  const [aiFeedback, setAiFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    saveDraft(code);
  }, [code]);

  const analyze = async () => {
    if (!code.trim()) {
      alert("Please enter or upload code before analyzing.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.analyzeCode({ language, content: code, depth });
      const ai_feedback = res?.ai_feedback || "No AI feedback available.";

      setIssues(res?.issues || []);
      setAiFeedback(ai_feedback);

      const session = {
        id: uuid(),
        ts: new Date().toISOString(),
        language,
        snippet: code,
        issues: res?.issues || [],
        ai_feedback,
      };

      // ✅ 1. Save locally (existing behavior, unchanged)
      saveSession(session);

      // ✅ 2. Save to backend if logged in
      if (token) {
        try {
          await API.saveUserSession(token, {
            language,
            snippet: code,
            issues: res?.issues || [],
            ai_feedback,
          });
          console.log("✅ Session successfully saved to backend");
        } catch (err) {
          console.error("❌ Failed to save session to backend:", err);
        }
      }

      // ✅ 3. Save AI confidence data (unchanged)
      const confidenceValue =
        typeof res?.confidence === "number"
          ? res.confidence
          : Math.max(0, Math.min(1, 1 - (session.issues.length * 0.05)));

      saveConfidenceData({
        timestamp: new Date().toISOString(),
        model: "AI Reviewer",
        confidence: confidenceValue,
      });
    } catch (err) {
      console.error("❌ Analyze failed:", err);
      alert("Backend not reachable or request failed.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setCode("");
    setIssues([]);
    setAiFeedback("");
  };

  return (
    <div
      className="space-y-4 min-h-[80vh] bg-gradient-to-b from-gray-50 to-slate-100 
                 dark:from-[#0d1117] dark:to-[#161b22] text-gray-800 dark:text-gray-300 
                 p-6 rounded-2xl shadow-sm transition-colors duration-500"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300">
          Code Review ({depth === "deep" ? "Deep" : "Standard"} Mode)
        </h1>
        <div className="flex gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as AnalyzeRequest["language"])}
            className="border rounded-xl px-3 py-2 bg-white text-gray-800 
                       dark:bg-[#1c2128] dark:text-gray-300 dark:border-gray-700"
          >
            <option value="javascript">JavaScript/TS</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
          </select>
          <FileLoader onLoad={setCode} />
          <button
            onClick={analyze}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white 
                       disabled:opacity-50 hover:bg-indigo-700 
                       dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-all"
          >
            {loading ? "Analyzing…" : "Analyze"}
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 
                       dark:border-gray-700 dark:hover:bg-[#1f2633] dark:text-gray-300"
          >
            Clear
          </button>
        </div>
      </div>

      <Editor value={code} setValue={setCode} language={language} issues={issues} />

      <section className="space-y-3 mt-4">
        <h2 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
          Results
          <span
            className={`px-2 py-0.5 text-xs font-semibold rounded-md ${
              depth === "deep"
                ? "bg-indigo-600 text-white"
                : "bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-gray-200"
            }`}
          >
            {depth.toUpperCase()} MODE
          </span>
        </h2>

        <IssueList issues={issues} />

        {aiFeedback && (
          <div
            className="mt-6 bg-white dark:bg-[#1c2128] rounded-xl shadow p-4 
                       border border-indigo-100 dark:border-gray-700 transition-colors"
          >
            <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-2 flex items-center">
              🧠 AI Feedback
            </h3>
            <div className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap text-[15px] leading-relaxed">
              {aiFeedback
                .replace(/^#+/gm, "")
                .replace(/\*\*/g, "")
                .replace(/Summary.*?:/i, "")
                .trim() +
                (depth === "deep"
                  ? "\n\n💡 Additional Insights: The AI performed a deeper review, analyzing structure, style, and maintainability for long-term improvement."
                  : "\n\n💡 Suggestion: Consider reviewing variable naming and structure for better readability.")}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
