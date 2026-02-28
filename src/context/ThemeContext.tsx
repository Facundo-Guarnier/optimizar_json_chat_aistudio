import React, { createContext, useContext } from "react";

interface ThemeContextValue {
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({ isDark: true });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // This app always uses dark mode (bg-gray-950)
  return (
    <ThemeContext.Provider value={{ isDark: true }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
