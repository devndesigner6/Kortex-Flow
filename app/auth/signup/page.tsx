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
import { ArrowRight, Shield, User, Cpu } from "lucide-react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showGlitch, setShowGlitch] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => setShowGlitch(false), 400)
    return () => clearTimeout(timer)
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()

      console.log("[v0] Starting signup process for:", email, "with name:", fullName)

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: undefined,
        },
      })

      if (signUpError) {
        throw signUpError
      }

      if (data?.user) {
        if (data.user.identities && data.user.identities.length === 0) {
          setError("This email is already registered. Please login instead.")
          setIsLoading(false)
          return
        }

        console.log("[v0] User created, creating profile with ID:", data.user.id)
        const { error: profileError } = await supabase.from("profiles").upsert(
          {
            id: data.user.id,
            full_name: fullName,
            email: email,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "id",
          },
        )

        if (profileError) {
          console.error("[v0] Profile creation error:", profileError)
        } else {
          console.log("[v0] Profile created successfully with name:", fullName)
        }

        router.push("/dashboard")
      } else {
        throw new Error("User creation failed - no user data returned")
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes("already registered")) {
          setError("This email is already registered. Please login instead.")
        } else if (error.message.includes("Failed to fetch")) {
          setError("Network error. Please check your internet connection and try again.")
        } else {
          setError(error.message)
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
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
              Initiate KortexFlow Protocol
            </CardTitle>
            <CardDescription className="font-mono text-base text-muted-foreground">
              Establish your Decentralized Identity.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label
                    htmlFor="fullName"
                    className="flex items-center gap-2 font-mono text-sm text-foreground uppercase tracking-wider"
                  >
                    <User className="h-4 w-4 text-primary" />
                    Operator Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11 border-2 border-input bg-background font-mono text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:border-primary focus:shadow-[0_0_15px_rgba(var(--primary),0.25)] focus:animate-pulse"
                  />
                </div>
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
                    <Shield className="h-4 w-4 text-primary" />
                    Encryption Key (min 6 characters)
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
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
                    "Executing Protocol..."
                  ) : (
                    <span className="flex items-center gap-3">
                      Execute Protocol
                      <Cpu className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  )}
                </Button>
              </div>
              <div className="mt-6 text-center font-mono text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-primary underline-offset-4 transition-all hover:underline hover:text-primary/80"
                >
                  Access System
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
