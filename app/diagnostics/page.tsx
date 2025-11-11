import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DiagnosticsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "NOT SET"
  const hasGoogleCreds = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

  return (
    <div className="min-h-screen bg-black p-8 font-mono text-green-500">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="border border-green-500/30 bg-green-500/5 p-6">
          <h1 className="mb-4 text-2xl font-bold">SYSTEM_DIAGNOSTICS</h1>

          <div className="space-y-6">
            {/* Environment Variables */}
            <div>
              <h2 className="mb-2 text-lg font-semibold text-green-400">ENVIRONMENT_VARIABLES</h2>
              <div className="space-y-2 rounded border border-green-500/20 bg-black/50 p-4">
                <div className="flex justify-between">
                  <span>NEXT_PUBLIC_APP_URL:</span>
                  <span className={appUrl === "NOT SET" ? "text-red-500" : "text-green-400"}>{appUrl}</span>
                </div>
                <div className="flex justify-between">
                  <span>GOOGLE_CLIENT_ID:</span>
                  <span className={hasGoogleCreds ? "text-green-400" : "text-red-500"}>
                    {process.env.GOOGLE_CLIENT_ID ? "SET" : "NOT SET"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GOOGLE_CLIENT_SECRET:</span>
                  <span className={hasGoogleCreds ? "text-green-400" : "text-red-500"}>
                    {process.env.GOOGLE_CLIENT_SECRET ? "SET" : "NOT SET"}
                  </span>
                </div>
              </div>
            </div>

            {/* OAuth Configuration */}
            <div>
              <h2 className="mb-2 text-lg font-semibold text-green-400">OAUTH_CONFIGURATION</h2>
              <div className="space-y-4 rounded border border-green-500/20 bg-black/50 p-4">
                <div>
                  <p className="mb-2 text-sm text-green-400">Required Redirect URIs in Google Cloud Console:</p>
                  <div className="space-y-1 rounded bg-black p-3 text-sm">
                    <p className="text-yellow-500">{appUrl}/api/gmail/callback</p>
                    <p className="text-yellow-500">{appUrl}/api/calendar/callback</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <p className="text-green-400">Steps to fix "Content is blocked" error:</p>
                  <ol className="ml-4 list-decimal space-y-1">
                    <li>Go to Google Cloud Console → APIs & Services → Credentials</li>
                    <li>Click on your OAuth 2.0 Client ID</li>
                    <li>Under "Authorized redirect URIs", add the URLs shown above</li>
                    <li>Click "Save"</li>
                    <li>Wait 5 minutes for changes to propagate</li>
                    <li>Try connecting Gmail again</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Current Issues */}
            {(appUrl === "NOT SET" || !hasGoogleCreds) && (
              <div>
                <h2 className="mb-2 text-lg font-semibold text-red-500">DETECTED_ISSUES</h2>
                <div className="space-y-2 rounded border border-red-500/20 bg-red-500/5 p-4">
                  {appUrl === "NOT SET" && (
                    <p className="text-red-400">
                      ⚠ NEXT_PUBLIC_APP_URL is not set. Add it in the environment variables section.
                    </p>
                  )}
                  {!hasGoogleCreds && (
                    <p className="text-red-400">
                      ⚠ Google OAuth credentials are missing. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="flex gap-4">
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border border-green-500/30 bg-green-500/10 px-4 py-2 hover:bg-green-500/20"
              >
                OPEN_GOOGLE_CONSOLE
              </a>
              <a
                href="/dashboard"
                className="rounded border border-green-500/30 bg-green-500/10 px-4 py-2 hover:bg-green-500/20"
              >
                BACK_TO_DASHBOARD
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
