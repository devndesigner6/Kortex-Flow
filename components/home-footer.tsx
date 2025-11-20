"use client"

import Link from "next/link"

export function HomeFooter() {
  return (
    <footer className="w-full border-t border-primary/20 bg-background py-6">
      <div className="container mx-auto px-4">
        {/* Thin neon-green line */}
        <div className="mb-3 h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" />

        {/* Single line footer text */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 font-mono text-xs text-primary/80 sm:text-sm">
          <span className="flex items-center gap-2">
            {/* Pulsing green dot for protocol status */}
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            KORTEXFLOW V1.0
          </span>

          <span className="hidden sm:inline text-primary/40">//</span>

          <span>© 2025 KORTEXFLOW</span>

          <span className="hidden sm:inline text-primary/40">//</span>

          <span>DEVELOPED 2025. ALL RIGHTS RESERVED</span>
        </div>
      </div>
    </footer>
  )
}
