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

    // Parse seed color RGB
    const r = parseInt(seedColor.slice(1, 3), 16);
    const g = parseInt(seedColor.slice(3, 5), 16);
    const b = parseInt(seedColor.slice(5, 7), 16);

    // Mix two colors by ratio (0=colorA, 1=colorB)
    const mix = (a: number, bVal: number, ratio: number) =>
      Math.round(a + (bVal - a) * ratio);

    if (isDark) {
      // Container: mix seed with black (20% seed, 80% black)
      root.style.setProperty(
        "--color-primary-container",
        `rgb(${mix(0, r, 0.2)}, ${mix(0, g, 0.2)}, ${mix(0, b, 0.2)})`,
      );
      // On-container: lighter version of seed (mix 60% toward white)
      root.style.setProperty(
        "--color-on-primary-container",
        `rgb(${mix(r, 255, 0.6)}, ${mix(g, 255, 0.6)}, ${mix(b, 255, 0.6)})`,
      );
    } else {
      // Container: mix seed with white (85% white, 15% seed)
      root.style.setProperty(
        "--color-primary-container",
        `rgb(${mix(255, r, 0.15)}, ${mix(255, g, 0.15)}, ${mix(255, b, 0.15)})`,
      );
      // On-container: darker version of seed (mix 50% toward black)
      root.style.setProperty(
        "--color-on-primary-container",
        `rgb(${mix(r, 0, 0.5)}, ${mix(g, 0, 0.5)}, ${mix(b, 0, 0.5)})`,
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
