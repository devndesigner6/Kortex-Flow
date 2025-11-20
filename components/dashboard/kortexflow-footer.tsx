"use client"

import { Brain, ArrowUp, Linkedin } from "lucide-react"

export function KortexFlowFooter() {
  return (
    <footer className="mt-12 border-t border-primary/10 bg-background/50 py-6 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-2 sm:px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Column I: System Status */}
          <div className="space-y-2">
            <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-primary">I. System Status</h3>
            <div className="space-y-1.5 font-mono text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-foreground">KORTEXFLOW // V1.0</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-primary shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span>STATUS: Operational</span>
              </div>
              <div>AI-POWERED PRODUCTIVITY</div>
              <div>LICENSE: Open Source</div>
            </div>
          </div>

          {/* Column II: Features */}
          <div className="space-y-2">
            <h3 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
              <Brain className="h-3.5 w-3.5" />
              II. KEY FEATURES
            </h3>
            <div className="space-y-1.5 font-mono text-xs text-muted-foreground">
              <div className="text-foreground">AI-POWERED TOOLS</div>
              <div>Gmail Integration</div>
              <div>Calendar Sync</div>
              <div>Task Extraction</div>
              <div>Smart Replies</div>
            </div>
          </div>

          {/* Column III: Roadmap */}
          <div className="space-y-2">
            <h3 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
              <ArrowUp className="h-3.5 w-3.5" />
              III. Roadmap
            </h3>
            <div className="space-y-1.5 font-mono text-xs text-muted-foreground">
              <div className="text-foreground">FUTURE UPGRADES</div>
              <div>Q1: Enhanced AI Capabilities</div>
              <div>Q2: Mobile Applications</div>
              <div>Q3: Team Collaboration</div>
              <div>Q4: Advanced Analytics</div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-primary/5 pt-4 text-center font-mono text-xs text-muted-foreground/70">
          <p>© 2025 KortexFlow // Developed 2025. All rights reserved</p>
        </div>
      </div>
    </footer>
  )
}
