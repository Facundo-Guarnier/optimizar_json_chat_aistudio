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

  // Apply seed/accent color as CSS custom property + update primary
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--seed-color", seedColor);
    root.style.setProperty("--color-primary", seedColor);

    // Generate a lighter variant for primary-container (mix with background)
    const r = parseInt(seedColor.slice(1, 3), 16);
    const g = parseInt(seedColor.slice(3, 5), 16);
    const b = parseInt(seedColor.slice(5, 7), 16);

    if (isDark) {
      // Darker tinted container
      root.style.setProperty(
        "--color-primary-container",
        `rgb(${Math.round(r * 0.3)}, ${Math.round(g * 0.3)}, ${Math.round(b * 0.3)})`,
      );
      root.style.setProperty(
        "--color-on-primary-container",
        `rgb(${Math.min(255, r + 100)}, ${Math.min(255, g + 100)}, ${Math.min(255, b + 100)})`,
      );
    } else {
      // Lighter tinted container
      root.style.setProperty(
        "--color-primary-container",
        `rgb(${Math.min(255, r + 160)}, ${Math.min(255, g + 160)}, ${Math.min(255, b + 160)})`,
      );
      root.style.setProperty(
        "--color-on-primary-container",
        `rgb(${Math.round(r * 0.5)}, ${Math.round(g * 0.5)}, ${Math.round(b * 0.5)})`,
      );
    }

    localStorage.setItem("theme-seed", seedColor);
  }, [seedColor, isDark]);

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
