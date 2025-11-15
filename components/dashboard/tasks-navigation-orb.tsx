"use client"

import { useRouter } from "next/navigation"
import { ArrowRight, ListTodo } from "lucide-react"

export function TasksNavigationOrb() {
  const router = useRouter()

  return (
    <div className="mb-6 flex items-center justify-center sm:mb-8">
      <button
        onClick={() => router.push("/tasks")}
        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-3 transition-all duration-500 hover:scale-105 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] sm:w-auto sm:gap-3 sm:px-6 md:px-8 md:py-4"
      >
        {/* Orb glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Icon with pulse animation */}
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 transition-all duration-300 group-hover:bg-primary/30 sm:h-10 sm:w-10 md:h-12 md:w-12">
          <ListTodo className="h-4 w-4 text-primary transition-transform duration-300 group-hover:scale-110 sm:h-5 sm:w-5 md:h-6 md:w-6" />
        </div>

        <span className="relative font-serif text-sm uppercase tracking-wider text-primary sm:text-base md:text-lg">
          View Task Log
        </span>

        {/* Arrow icon */}
        <ArrowRight className="relative h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5 md:h-6 md:w-6" />

        {/* Animated border effect */}
        <div className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 animate-spin-slow rounded-full border-2 border-transparent border-t-primary/50" />
        </div>
      </button>
    </div>
  )
}
