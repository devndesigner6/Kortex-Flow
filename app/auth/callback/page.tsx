"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Verifying your email...")

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = createClient()

        // Get the code from the URL
        const params = new URLSearchParams(window.location.search)
        const code = params.get("code")

        if (!code) {
          setStatus("error")
          setMessage("No verification code found")
          return
        }

        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          setStatus("error")
          setMessage(error.message)
          return
        }

        setStatus("success")
        setMessage("Email verified successfully! Redirecting to dashboard...")

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } catch (error) {
        setStatus("error")
        setMessage(error instanceof Error ? error.message : "An error occurred")
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black p-6">
      <div className="w-full max-w-sm">
        <Card className="border-green-500/20 bg-black">
          <CardHeader>
            <CardTitle className="font-mono text-2xl text-green-500">
              &gt; {status === "loading" ? "VERIFYING" : status === "success" ? "SUCCESS" : "ERROR"}
            </CardTitle>
            <CardDescription className="font-mono text-green-500/70">
              {status === "loading" && "Processing verification..."}
              {status === "success" && "Account activated"}
              {status === "error" && "Verification failed"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sm text-green-500/70">SYSTEM_MESSAGE: {message}</p>
            {status === "error" && (
              <button
                onClick={() => router.push("/auth/login")}
                className="mt-4 w-full border border-green-500/30 bg-green-500/10 px-4 py-2 font-mono text-green-500 hover:bg-green-500/20"
              >
                RETURN_TO_LOGIN
              </button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
