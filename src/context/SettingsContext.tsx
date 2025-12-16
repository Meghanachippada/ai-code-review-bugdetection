// src/context/SettingsContext.tsx
import { createContext, useContext, useState, type ReactNode, useEffect } from "react";

type DepthType = "standard" | "deep";

interface SettingsContextType {
  depth: DepthType;
  setDepth: (d: DepthType) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [depth, setDepth] = useState<DepthType>(
    (localStorage.getItem("depth") as DepthType) || "standard"
  );

  useEffect(() => {
    localStorage.setItem("depth", depth);
  }, [depth]);

  return (
    <SettingsContext.Provider value={{ depth, setDepth }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
