"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const initialTheme = savedTheme || "dark"
    setTheme(initialTheme)
    document.documentElement.classList.toggle("dark", initialTheme === "dark")
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={toggleTheme}
      className="group relative flex h-10 w-20 items-center rounded-full border-2 border-green-500/50 bg-green-500/10 p-1 transition-all duration-300 hover:border-green-500 hover:bg-green-500/20"
      aria-label="Toggle theme"
    >
      <div
        className={`absolute h-7 w-7 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg transition-all duration-300 ${
          theme === "dark" ? "left-1" : "left-11"
        }`}
      />

      <div className="relative z-10 flex w-full items-center justify-between px-1">
        <Moon
          className={`h-4 w-4 transition-all duration-300 ${
            theme === "dark" ? "text-black opacity-100" : "text-green-500/40 opacity-50"
          }`}
        />
        <Sun
          className={`h-4 w-4 transition-all duration-300 ${
            theme === "light" ? "text-black opacity-100" : "text-green-500/40 opacity-50"
          }`}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-full bg-green-500/20 blur-sm" />
      </div>
    </button>
  )
}
