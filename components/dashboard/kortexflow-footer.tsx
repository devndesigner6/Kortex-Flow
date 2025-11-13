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
              <div>PROTOCOL: Algorand</div>
              <div>LAST BLOCK: [Dynamic]</div>
              <div>LICENSE: Open Source</div>
            </div>
          </div>

          {/* Column II: Development Team */}
          <div className="space-y-2">
            <h3 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
              <Brain className="h-3.5 w-3.5" />
              II. Block Genesis
            </h3>
            <div className="space-y-2 font-mono text-xs text-muted-foreground">
              <div className="text-foreground">DEVELOPMENT TEAM</div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span>Project Lead: Hemanth Peddada</span>
                  <a
                    href="https://linkedin.com/in/hemanth-peddada-jgrph"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-primary"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span>Developer: Premkumar Kuppili</span>
                  <a
                    href="https://linkedin.com/in/premkumarkuppili"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-primary"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span>Developer: Sravya Kandala</span>
                  <a
                    href="https://linkedin.com/in/sravya-kandala-b"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-primary"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Column III: Roadmap */}
          <div className="space-y-2">
            <h3 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
              <ArrowUp className="h-3.5 w-3.5" />
              III. Roadmap
            </h3>
            <div className="space-y-1.5 font-mono text-xs text-muted-foreground">
              <div className="text-foreground">FUTURE PROTOCOL UPGRADES</div>
              <div>Q2: Token Integration</div>
              <div>Q3: Decentralized Storage</div>
              <div>Q3: AI Response Drafting</div>
              <div>Q4: Cross-Chain Support</div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-primary/5 pt-4 text-center font-mono text-xs text-muted-foreground/70">
          <p>© 2025 KortexFlow // All protocols reserved</p>
        </div>
      </div>
    </footer>
  )
}
