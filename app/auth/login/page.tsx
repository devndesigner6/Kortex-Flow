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

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setError("Please verify your email address before logging in. Check your inbox.")
          return
        }
        throw error
      }

      if (data.user) {
        router.push("/dashboard")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black p-6">
      <div className="w-full max-w-sm">
        <Card className="border-green-500/20 bg-black">
          <CardHeader>
            <CardTitle className="font-mono text-2xl text-green-500">&gt; KORTEXFLOW_LOGIN</CardTitle>
            <CardDescription className="font-mono text-green-500/70">
              Enter credentials to access system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
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
                    PASSWORD
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-green-500/30 bg-black font-mono text-green-500"
                  />
                </div>
                {error && <p className="font-mono text-sm text-red-500">ERROR: {error}</p>}
                <Button
                  type="submit"
                  className="w-full border border-green-500/30 bg-green-500/10 font-mono text-green-500 hover:bg-green-500/20"
                  disabled={isLoading}
                >
                  {isLoading ? "AUTHENTICATING..." : "EXECUTE_LOGIN"}
                </Button>
              </div>
              <div className="mt-4 text-center font-mono text-sm text-green-500/70">
                NO_ACCOUNT?{" "}
                <Link href="/auth/signup" className="text-green-500 underline">
                  CREATE_NEW
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
