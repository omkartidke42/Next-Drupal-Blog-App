"use client";

import { useTheme } from "./theme-Provider";
import { Sun, Moon, Monitor } from "lucide-react";


export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2">
      <button onClick={() => setTheme("light")} aria-label="Light mode">
        <Sun size={20} className={theme === "light" ? "text-yellow-400" : "text-gray-400"} />
      </button>
      <button onClick={() => setTheme("dark")} aria-label="Dark mode">
        <Moon size={20} className={theme === "dark" ? "text-purple-400" : "text-gray-400"} />
      </button>
      <button onClick={() => setTheme("system")} aria-label="System mode">
        <Monitor size={20} className={theme === "system" ? "text-blue-400" : "text-gray-400"} />
      </button>
    </div>
  );
}
