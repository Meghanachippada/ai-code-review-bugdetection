import type { Issue } from "./types";

const STORAGE_KEY = "aicode_sessions";
const DRAFT_KEY = "aicode_draft"; // ✅ added for persisting draft code

export interface ReviewSession {
  id: string;
  ts: string;
  language: string;
  snippet: string;
  issues: Issue[];
  ai_feedback?: string; // ✅ added to store feedback if needed
  created_at?: string;
}

// ✅ Retrieve all sessions
export function getSessions(): ReviewSession[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ✅ Save one session
export function saveSession(session: ReviewSession) {
  const sessions = getSessions();
  sessions.unshift(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

// ✅ Delete and clear
export function deleteSession(id: string) {
  const sessions = getSessions().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function clearSessions() {
  localStorage.removeItem(STORAGE_KEY);
}

// ✅ Added these two helpers for CodeReview draft persistence
export function saveDraft(code: string) {
  try {
    localStorage.setItem(DRAFT_KEY, code);
  } catch (e) {
    console.error("Failed to save draft", e);
  }
}

export function getDraft(): string {
  try {
    return localStorage.getItem(DRAFT_KEY) || "";
  } catch {
    return "";
  }
}

// ✅ Confidence trend tracking helpers
export interface ConfidenceEntry {
  timestamp: string;
  model?: string;
  confidence: number;
}

const CONFIDENCE_KEY = "ai_confidence_data";

export function saveConfidenceData(entry: ConfidenceEntry) {
  try {
    const existing = JSON.parse(localStorage.getItem(CONFIDENCE_KEY) || "[]");
    existing.push(entry);
    localStorage.setItem(CONFIDENCE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error("Failed to save confidence data:", e);
  }
}

export function getConfidenceData(): ConfidenceEntry[] {
  try {
    return JSON.parse(localStorage.getItem(CONFIDENCE_KEY) || "[]");
  } catch {
    return [];
  }
}

// src/lib/storage.ts
export const saveToken = (token: string) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const clearToken = () => localStorage.removeItem("token");