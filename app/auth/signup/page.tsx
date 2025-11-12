"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'your-supabase-project-url') {
      setError('⚠️ Authentication is not configured. Redirecting to dashboard in demo mode...')
      setIsLoading(false)
      // For demo purposes, redirect to dashboard anyway
      setTimeout(() => router.push("/dashboard"), 2000)
      return
    }

    try {
      const supabase = createClient()

      console.log("[v0] Starting signup for:", email)

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      console.log("[v0] Signup response:", { data, error: signUpError })

      if (signUpError) {
        console.error("[v0] Signup error:", signUpError)
        throw signUpError
      }

      if (data?.user) {
        console.log("[v0] User created successfully:", data.user.id)

        // Profile is automatically created by the database trigger
        router.push("/dashboard")
      } else {
        throw new Error("User creation failed - no user data returned")
      }
    } catch (error: unknown) {
      console.error("[v0] Signup catch block:", error)

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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black p-6">
      <div className="w-full max-w-sm">
        <Card className="border-green-500/20 bg-black">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-green-500">&gt; KORTEXFLOW_REGISTER</CardTitle>
            <CardDescription className="font-mono text-green-500/70">Initialize new user account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="fullName" className="font-mono text-green-500">
                    FULL_NAME
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="border-green-500/30 bg-black font-mono text-green-500 placeholder:text-green-500/30"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="font-mono text-green-500">
                    EMAIL_ADDRESS
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@kortexflow.sys"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-green-500/30 bg-black font-mono text-green-500 placeholder:text-green-500/30"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="font-mono text-green-500">
                    PASSWORD (min 6 characters)
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-green-500/30 bg-black font-mono text-green-500"
                  />
                </div>
                {error && (
                  <div className="rounded border border-red-500/30 bg-red-500/10 p-3">
                    <p className="font-mono text-sm text-red-500">ERROR: {error}</p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full border border-green-500/30 bg-green-500/10 font-mono text-green-500 hover:bg-green-500/20"
                  disabled={isLoading}
                >
                  {isLoading ? "CREATING_ACCOUNT..." : "EXECUTE_SIGNUP"}
                </Button>
              </div>
              <div className="mt-4 text-center font-mono text-sm text-green-500/70">
                ACCOUNT_EXISTS?{" "}
                <Link href="/auth/login" className="text-green-500 underline">
                  LOGIN_HERE
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
