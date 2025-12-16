import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import type { Extension } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { useTheme } from "../context/ThemeContext";
import type { Issue } from "../lib/types";

interface EditorProps {
  value: string;
  setValue: (v: string) => void;
  language: string;
  issues?: Issue[];
}

export default function Editor({ value, setValue, language, issues = [] }: EditorProps) {
  const { theme } = useTheme();

  // ✅ choose language syntax extension
  const getLangExtension = (): Extension => {
    switch (language) {
      case "python":
        return python();
      case "java":
        return java();
      case "cpp":
      case "c":
        return cpp();
      default:
        return javascript({ jsx: true, typescript: true });
    }
  };

  // ✅ light theme style using EditorView.theme
  const lightTheme = EditorView.theme(
    {
      "&": {
        backgroundColor: "#ffffff",
        color: "#000000",
      },
      ".cm-content": {
        caretColor: "#000000",
      },
      ".cm-gutters": {
        backgroundColor: "#f3f4f6",
        color: "#6b7280",
        border: "none",
      },
    },
    { dark: false }
  );

  return (
    <div
      className={`rounded-xl overflow-hidden transition-all duration-500 ${
        theme === "dark"
          ? "bg-[#0d1117] border border-gray-700"
          : "bg-white border border-gray-200"
      }`}
    >
      <CodeMirror
        value={value}
        height="400px"
        theme={theme === "dark" ? oneDark : lightTheme}
        extensions={[getLangExtension()]}
        onChange={(val) => setValue(val)}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          foldGutter: false,
        }}
        style={{
          fontSize: "15px",
          fontFamily: "JetBrains Mono, Menlo, monospace",
        }}
      />
    </div>
  );
}
