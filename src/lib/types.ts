// src/lib/types.ts

// All possible issue categories
export type IssueType =
  | "logic"
  | "security"
  | "style"
  | "syntax"
  | "error"
  | "info";

// Severity levels
export type Severity = "error" | "warning" | "info";

export interface Issue {
  id?: string;
  line?: number;
  column?: number;
  length?: number;
  type: IssueType;
  severity: Severity;
  message: string;
  recommendation?: string;
  confidence?: number; // 0..1
}

// ✅ Add depth support
export type AnalysisDepth = "standard" | "deep";

export interface AnalyzeRequest {
  language: "python" | "javascript" | "java" | "c" | "cpp";
  content: string;
  depth?: AnalysisDepth; // optional new field
}

export interface AnalyzeResponse {
  issues: Issue[];
  ai_feedback: string;
  confidence?: number;
}
