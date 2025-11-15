import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyPage() {
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
          <CardContent>
            <p className="font-mono text-sm text-green-500/70">
              SYSTEM_MESSAGE: Account created successfully. Please check your email inbox and click the verification
              link to activate your KortexFlow account.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
