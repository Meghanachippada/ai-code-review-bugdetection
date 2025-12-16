import { useTheme } from "../context/ThemeContext";
import { useSettings } from "../context/SettingsContext";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { depth, setDepth } = useSettings();

  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-b from-[#0d1117] via-[#10131b] to-[#161b22] text-gray-300"
          : "bg-gradient-to-b from-gray-50 via-white to-slate-100 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mb-6">
        Settings
      </h1>

      {/* Theme Preference */}
      <div
        className={`p-6 rounded-2xl shadow-md mb-6 border transition-colors duration-500 ${
          theme === "dark"
            ? "bg-[#1c2128]/90 border-gray-700"
            : "bg-white/90 border-gray-200"
        }`}
      >
        <h2 className="text-lg font-semibold mb-2">🌗 Theme Preference</h2>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as "light" | "dark")}
          className={`border rounded-xl px-3 py-2 transition-colors duration-300 ${
            theme === "dark"
              ? "bg-[#0d1117] text-gray-300 border-gray-700"
              : "bg-gray-100 text-gray-900 border-gray-300"
          }`}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      {/* AI Model */}
      <div
        className={`p-6 rounded-2xl shadow-md mb-6 border transition-colors duration-500 ${
          theme === "dark"
            ? "bg-[#1c2128]/90 border-gray-700"
            : "bg-white/90 border-gray-200"
        }`}
      >
        <h2 className="text-lg font-semibold mb-2">🧠 AI Model</h2>
        <select
          className={`border rounded-xl px-3 py-2 transition-colors duration-300 ${
            theme === "dark"
              ? "bg-[#0d1117] text-gray-300 border-gray-700"
              : "bg-gray-100 text-gray-900 border-gray-300"
          }`}
        >
          <option>OpenAI LLM</option>
          <option>Claude</option>
          <option>Gemini</option>
        </select>
      </div>

      {/* Code Analysis Depth */}
      <div
        className={`p-6 rounded-2xl shadow-md mb-6 border transition-colors duration-500 ${
          theme === "dark"
            ? "bg-[#1c2128]/90 border-gray-700"
            : "bg-white/90 border-gray-200"
        }`}
      >
        <h2 className="text-lg font-semibold mb-2">⚙️ Code Analysis Depth</h2>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="depth"
              value="standard"
              checked={depth === "standard"}
              onChange={() => setDepth("standard")}
              className="accent-indigo-600"
            />
            <span>Standard</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="depth"
              value="deep"
              checked={depth === "deep"}
              onChange={() => setDepth("deep")}
              className="accent-indigo-600"
            />
            <span>Deep</span>
          </label>
        </div>
      </div>
    </div>
  );
}
