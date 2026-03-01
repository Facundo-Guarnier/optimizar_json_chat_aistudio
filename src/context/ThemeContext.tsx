import React, { createContext, useContext, useState, useEffect } from "react";

const DEFAULT_SEED = "#3b82f6";

interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
  seedColor: string;
  setSeedColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: true,
  toggleTheme: () => {},
  seedColor: DEFAULT_SEED,
  setSeedColor: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme-dark");
    return saved !== null ? saved === "true" : true;
  });

  const [seedColor, setSeedColorState] = useState(() => {
    return localStorage.getItem("theme-seed") || DEFAULT_SEED;
  });

  // Apply dark class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.body.style.backgroundColor = isDark ? "#030712" : "#ffffff";
    document.body.style.color = isDark ? "#f3f4f6" : "#111827";
    localStorage.setItem("theme-dark", String(isDark));
  }, [isDark]);

  // Apply seed/accent color as CSS custom property
  useEffect(() => {
    document.documentElement.style.setProperty("--seed-color", seedColor);
    localStorage.setItem("theme-seed", seedColor);
  }, [seedColor]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const setSeedColor = (color: string) => setSeedColorState(color);

  return (
    <ThemeContext.Provider
      value={{ isDark, toggleTheme, seedColor, setSeedColor }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
