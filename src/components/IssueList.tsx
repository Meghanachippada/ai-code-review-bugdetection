import type { Issue } from "../lib/types";
import { AlertTriangle, Bug, Info, TerminalSquare } from "lucide-react";

export default function IssueList({
  issues,
  aiFeedbackOnly = false,
}: {
  issues: Issue[];
  aiFeedbackOnly?: boolean;
}) {
  if (!issues?.length) {
    return (
      <div className="text-gray-700 font-medium">
        {aiFeedbackOnly
          ? "✅ No static issues detected — AI feedback only."
          : "No issues yet."}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {issues.map((i, idx) => {
        // 🎨 Choose box color and icon
        let boxColor = "border-blue-600 bg-blue-100";
        let Icon = Info;

        if (i.type === "runtime") {
          boxColor = "border-red-600 bg-red-200";
          Icon = Bug;
        } else if (i.type === "syntax") {
          boxColor = "border-yellow-600 bg-yellow-200";
          Icon = AlertTriangle;
        } else if (i.type === "semgrep") {
          boxColor = "border-purple-600 bg-purple-200";
          Icon = TerminalSquare;
        }

        return (
          <div
            key={idx}
            className={`p-3 border-l-4 ${boxColor} shadow-sm`}
            style={{
              color: "black",
              fontWeight: 500,
              textShadow: "none",
              backgroundColor:
                i.type === "runtime"
                  ? "#ffcccc"
                  : i.type === "syntax"
                  ? "#fff2b3"
                  : i.type === "semgrep"
                  ? "#e6ccff"
                  : "#cce5ff",
              borderColor:
                i.type === "runtime"
                  ? "#cc0000"
                  : i.type === "syntax"
                  ? "#e6b800"
                  : i.type === "semgrep"
                  ? "#9933ff"
                  : "#0059b3",
              borderRadius: "0.5rem", // ✅ Rounded corners
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // ✅ Soft shadow
            }}
          >
            {/* 🧠 Header */}
            <div className="flex items-center gap-2 mb-1">
              <Icon
                className={`w-4 h-4 ${
                  i.type === "runtime"
                    ? "text-red-700"
                    : i.type === "syntax"
                    ? "text-yellow-700"
                    : i.type === "semgrep"
                    ? "text-purple-700"
                    : "text-blue-700"
                }`}
              />
              <p className="font-semibold" style={{ color: "black", margin: 0 }}>
                {i.type.charAt(0).toUpperCase() + i.type.slice(1)} — {i.message}
              </p>
            </div>

            {/* 🧩 Details */}
            <div className="ml-6">
              {i.line && (
                <div className="text-sm font-medium" style={{ color: "black" }}>
                  Line {i.line}
                </div>
              )}
              {i.severity && (
                <div
                  className="text-xs mt-1 font-semibold"
                  style={{
                    color:
                      i.severity === "error" ? "#cc0000" : "#b38600",
                  }}
                >
                  Severity: {i.severity}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
