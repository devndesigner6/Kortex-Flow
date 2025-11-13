"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ArrowRight, Key, Brain } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showGlitch, setShowGlitch] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => setShowGlitch(false), 400)
    return () => clearTimeout(timer)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      console.log("[v0] Starting login for:", email)

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        console.log("[v0] User logged in with ID:", user.id)

        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        console.log("[v0] Existing profile:", profile)

        if (!profile) {
          // Create profile if it doesn't exist
          console.log("[v0] Creating new profile for existing user")
          await supabase.from("profiles").insert({
            id: user.id,
            full_name: user.user_metadata.full_name || email.split("@")[0],
            email: user.email,
            updated_at: new Date().toISOString(),
          })
        }
      }

      const mainElement = document.querySelector("main") as HTMLElement
      if (mainElement) {
        mainElement.style.opacity = "0"
        mainElement.style.transform = "translateY(-20px)"
        mainElement.style.transition = "all 0.4s ease-out"
      }

      setTimeout(() => {
        router.push("/dashboard")
      }, 400)
    } catch (error: unknown) {
      console.error("[v0] Login error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="page-transition flex min-h-screen w-full items-center justify-center bg-background p-6 relative">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 4px)",
          animation: "scanlines 8s linear infinite",
        }}
      />

      <div className="w-full max-w-md animate-slide-in relative z-10">
        <Card
          className={`border-2 bg-card shadow-xl transition-all duration-200 ${showGlitch ? "border-primary animate-pulse" : "border-primary/20"}`}
        >
          <CardHeader className="space-y-2">
            <CardTitle className="font-serif text-4xl tracking-wide text-primary uppercase">
              KortexFlow Access
            </CardTitle>
            <CardDescription className="font-mono text-base text-muted-foreground">
              Welcome Back, Operator.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label
                    htmlFor="email"
                    className="flex items-center gap-2 font-mono text-sm text-foreground uppercase tracking-wider"
                  >
                    <span className="text-primary font-bold text-lg leading-none">&gt;</span>
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="operator@kortexflow.io"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 border-2 border-input bg-background font-mono text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:border-primary focus:shadow-[0_0_15px_rgba(var(--primary),0.25)] focus:animate-pulse"
                  />
                </div>
                <div className="grid gap-3">
                  <Label
                    htmlFor="password"
                    className="flex items-center gap-2 font-mono text-sm text-foreground uppercase tracking-wider"
                  >
                    <Key className="h-4 w-4 text-primary" />
                    Encryption Key
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 border-2 border-input bg-background font-mono text-foreground transition-all duration-300 focus:border-primary focus:shadow-[0_0_15px_rgba(var(--primary),0.25)] focus:animate-pulse"
                  />
                </div>
                {error && (
                  <div className="rounded-lg border-2 border-destructive/30 bg-destructive/10 p-3">
                    <p className="font-mono text-sm text-destructive">Error: {error}</p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="glow-button group h-12 border-2 border-primary/30 bg-primary font-mono text-base text-primary-foreground uppercase tracking-wider transition-all duration-300 hover:border-primary/50 hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Authenticating..."
                  ) : (
                    <span className="flex items-center gap-3">
                      Access System
                      <Brain className="h-5 w-5 transition-all duration-300 group-hover:scale-110" />
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  )}
                </Button>
              </div>
              <div className="mt-6 text-center font-mono text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="font-semibold text-primary underline-offset-4 transition-all hover:underline hover:text-primary/80"
                >
                  Initiate Protocol
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
      `}</style>
    </main>
  )
}
