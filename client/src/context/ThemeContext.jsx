import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "finora_theme";

const getSystemPreference = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored || "system";
  });

  const resolvedTheme = theme === "system" ? getSystemPreference() : theme;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    if (theme !== "system") return undefined;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => document.documentElement.setAttribute("data-theme", getSystemPreference());
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, [theme]);

  const updateTheme = useCallback((next) => {
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleTheme = useCallback(() => {
    updateTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, updateTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: updateTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
