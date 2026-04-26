'use client'

import React from "react";
import { useState, useEffect } from 'react';

interface ThemeManagerProps {
  storageKey?: string;
  defaultTheme?: "light" | "dark" | "system";
}

const ThemeManager: React.FC<ThemeManagerProps> = ({ 
  storageKey = "theme", 
  defaultTheme = "system" 
}) => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">(defaultTheme);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    const storedTheme = localStorage.getItem(storageKey) as "light" | "dark" | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!mounted) return;
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(systemTheme);
    } else {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
      localStorage.setItem(storageKey, theme);
    }
  }, [theme, mounted, storageKey]);

  const setThemeValue = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    localStorage.setItem(storageKey, newTheme);
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-3">
        <span className="text-sm font-medium">Theme</span>
      </div>
      <div className="flex flex-col gap-2 p-3">
        <button
          onClick={() => setThemeValue("light")}
          className={`flex items-center justify-between p-2 text-sm rounded-md hover:bg-gray-100 ${
            theme === "light" ? "bg-gray-100" : ""
          }`}
        >
          <span>Light</span>
          {theme === "light" && (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          )}
        </button>
        <button
          onClick={() => setThemeValue("dark")}
          className={`flex items-center justify-between p-2 text-sm rounded-md hover:bg-gray-100 ${
            theme === "dark" ? "bg-gray-100" : ""
          }`}
        >
          <span>Dark</span>
          {theme === "dark" && (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          )}
        </button>
        <button
          onClick={() => setThemeValue("system")}
          className={`flex items-center justify-between p-2 text-sm rounded-md hover:bg-gray-100 ${
            theme === "system" ? "bg-gray-100" : ""
          }`}
        >
          <span>System</span>
          {theme === "system" && (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export { ThemeManager };
