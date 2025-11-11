"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function VerifyPage() {
  const [isResending, setIsResending] = useState(false)
  const [message, setMessage] = useState("")

  const handleResendEmail = async () => {
    setIsResending(true)
    setMessage("")

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user?.email) {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: user.email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          }
        })

        if (error) throw error
        setMessage("Verification email resent successfully!")
      } else {
        setMessage("Please sign up again to receive a verification email.")
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to resend email")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black p-6">
      <div className="w-full max-w-sm">
        <Card className="border-green-500/20 bg-black">
          <CardHeader>
            <CardTitle className="font-mono text-2xl text-green-500">&gt; VERIFICATION_REQUIRED</CardTitle>
            <CardDescription className="font-mono text-green-500/70">
              Check your email to confirm account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="font-mono text-sm text-green-500/70">
                SYSTEM_MESSAGE: Account created successfully. Please check your email inbox and click the verification
                link to activate your KortexFlow account.
              </p>
              <p className="font-mono text-xs text-green-500/50">
                • Check your spam folder if you don't see the email<br />
                • The verification link is valid for 24 hours<br />
                • You need to verify before logging in
              </p>
            </div>

            {message && (
              <p className={`font-mono text-sm ${message.includes("Failed") || message.includes("again") ? "text-red-500" : "text-green-500"}`}>
                {message}
              </p>
            )}

            <div className="space-y-2">
              <Button
                onClick={handleResendEmail}
                disabled={isResending}
                className="w-full border border-green-500/30 bg-green-500/10 font-mono text-green-500 hover:bg-green-500/20"
              >
                {isResending ? "SENDING..." : "RESEND_VERIFICATION_EMAIL"}
              </Button>

              <Link href="/auth/login" className="block">
                <Button
                  variant="outline"
                  className="w-full border border-green-500/30 bg-transparent font-mono text-green-500 hover:bg-green-500/10"
                >
                  BACK_TO_LOGIN
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
