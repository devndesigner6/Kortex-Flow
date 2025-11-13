import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6">
      <div className="w-full max-w-4xl text-center">
        <h1 className="mb-4 font-serif text-4xl tracking-wide text-primary sm:mb-6 sm:text-6xl md:text-8xl">
          Kortex<span className="italic">Flow</span>
        </h1>

        <p className="mb-3 font-serif text-2xl text-foreground sm:mb-4 sm:text-3xl md:text-4xl">
          Order from <span className="text-accent-foreground">Chaos</span>.
        </p>

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5 px-4 py-2 shadow-sm sm:mb-8 sm:gap-3 sm:px-6 sm:py-3">
          <Shield className="h-5 w-5 shrink-0 text-primary sm:h-6 sm:w-6" />
          <p className="font-serif text-base text-primary sm:text-xl md:text-2xl">Secured by Algorand</p>
        </div>

        <p className="mx-auto mb-8 max-w-2xl px-2 font-serif text-lg italic leading-relaxed text-muted-foreground sm:mb-12 sm:text-xl md:text-2xl">
          Your Inbox is a To-Do List. <span className="text-foreground">KortexFlow is the Manager.</span>
        </p>

        <div className="flex flex-col gap-4 px-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6">
          <Link href="/auth/signup" className="w-full sm:w-auto">
            <Button className="group relative h-14 w-full overflow-hidden border-2 border-primary bg-primary px-6 font-mono text-base text-primary-foreground shadow-lg transition-all duration-500 hover:scale-105 hover:border-accent hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] sm:h-16 sm:px-10 sm:text-lg">
              <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                <Sparkles className="h-4 w-4 shrink-0 animate-pulse sm:h-5 sm:w-5" />
                <span className="truncate">Start Organizing</span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-2 sm:h-5 sm:w-5" />
              </span>
              <div className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:animate-shimmer group-hover:opacity-100" />
            </Button>
          </Link>

          <Link href="/auth/login" className="w-full sm:w-auto">
            <Button className="group relative h-14 w-full overflow-hidden border-2 border-primary/50 bg-card px-6 font-mono text-base text-primary shadow-lg backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_25px_rgba(34,197,94,0.3)] sm:h-16 sm:px-10 sm:text-lg">
              <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                <span className="truncate">Sign In</span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-2 group-hover:text-accent sm:h-5 sm:w-5" />
              </span>
              <div className="absolute inset-0 -z-0 scale-0 rounded-lg bg-gradient-radial from-primary/20 to-transparent transition-transform duration-500 group-hover:scale-150" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
