export default function EmailConfigPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black p-6">
      <div className="w-full max-w-3xl">
        <div className="mb-6 border border-green-500/20 bg-black p-6">
          <h1 className="mb-4 font-mono text-2xl text-green-500">&gt; EMAIL_CONFIGURATION_GUIDE</h1>
          <p className="mb-4 font-mono text-sm text-green-500/70">
            New users are not receiving verification emails because Supabase email authentication needs to be
            configured.
          </p>

          <div className="space-y-6">
            {/* Option 1: Disable Email Confirmation (Development) */}
            <div className="border border-green-500/20 p-4">
              <h2 className="mb-2 font-mono text-lg text-green-500">
                OPTION_1: DISABLE_EMAIL_CONFIRMATION (Quick Fix for Development)
              </h2>
              <ol className="list-inside list-decimal space-y-2 font-mono text-sm text-green-500/70">
                <li>Go to your Supabase Dashboard</li>
                <li>Navigate to Authentication → Providers → Email</li>
                <li>Scroll down to "Email Confirmation"</li>
                <li>Toggle OFF "Enable email confirmations"</li>
                <li>Click "Save"</li>
              </ol>
              <p className="mt-3 font-mono text-xs text-yellow-500">
                WARNING: This allows users to sign up without email verification. Only use for development/testing.
              </p>
            </div>

            {/* Option 2: Configure SMTP */}
            <div className="border border-green-500/20 p-4">
              <h2 className="mb-2 font-mono text-lg text-green-500">OPTION_2: CONFIGURE_SMTP (Production)</h2>
              <ol className="list-inside list-decimal space-y-2 font-mono text-sm text-green-500/70">
                <li>Go to your Supabase Dashboard</li>
                <li>Navigate to Project Settings → Auth</li>
                <li>Scroll to "SMTP Settings"</li>
                <li>
                  Configure your SMTP provider:
                  <ul className="ml-6 mt-2 list-inside list-disc space-y-1">
                    <li>Gmail: smtp.gmail.com:587</li>
                    <li>SendGrid: smtp.sendgrid.net:587</li>
                    <li>AWS SES: email-smtp.region.amazonaws.com:587</li>
                    <li>Or use any other SMTP service</li>
                  </ul>
                </li>
                <li>Enter SMTP credentials (username, password)</li>
                <li>Set "Sender email" to your verified email address</li>
                <li>Click "Save"</li>
              </ol>
            </div>

            {/* Option 3: Use Supabase's Default Email */}
            <div className="border border-green-500/20 p-4">
              <h2 className="mb-2 font-mono text-lg text-green-500">OPTION_3: USE_SUPABASE_DEFAULT_EMAIL</h2>
              <p className="mb-2 font-mono text-sm text-green-500/70">
                Supabase provides default email sending for free tier projects with some limitations:
              </p>
              <ul className="ml-6 list-inside list-disc space-y-1 font-mono text-xs text-green-500/70">
                <li>Limited to 3 emails per hour per user</li>
                <li>May end up in spam folders</li>
                <li>Good enough for testing</li>
              </ul>
              <p className="mt-3 font-mono text-xs text-green-500/70">
                This should work by default. If emails aren't arriving:
              </p>
              <ol className="ml-6 mt-2 list-inside list-decimal space-y-1 font-mono text-xs text-green-500/70">
                <li>Check your spam/junk folder</li>
                <li>Wait 1-2 minutes (emails can be slow on free tier)</li>
                <li>Try option 1 or 2 if still not working</li>
              </ol>
            </div>

            {/* Troubleshooting */}
            <div className="border border-yellow-500/20 bg-yellow-500/5 p-4">
              <h2 className="mb-2 font-mono text-lg text-yellow-500">TROUBLESHOOTING</h2>
              <ul className="ml-6 list-inside list-disc space-y-1 font-mono text-xs text-yellow-500/70">
                <li>Check browser console for error messages during signup</li>
                <li>Check Supabase Dashboard → Authentication → Users to see if user was created</li>
                <li>Check Supabase Dashboard → Logs to see if emails were sent</li>
                <li>
                  Verify the redirect URL is correct:{" "}
                  {typeof window !== "undefined" ? window.location.origin : "[your-app-url]"}/auth/callback
                </li>
              </ul>
            </div>

            {/* Back to Dashboard */}
            <div className="flex justify-center pt-4">
              <a
                href="/dashboard"
                className="border border-green-500/30 bg-green-500/10 px-6 py-2 font-mono text-green-500 hover:bg-green-500/20"
              >
                RETURN_TO_DASHBOARD
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
