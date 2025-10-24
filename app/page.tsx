import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-6">
      <div className="max-w-2xl text-center">
        <h1 className="mb-4 font-mono text-6xl font-bold text-green-500">KORTEXFLOW</h1>
        <p className="mb-8 font-mono text-xl text-green-500/70">&gt; AI-POWERED PERSONAL ASSISTANT</p>
        <p className="mb-12 font-mono text-green-500/50">
          Automatically extract tasks and meetings from your Gmail and Calendar. Never miss important deadlines again.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/login">
            <Button className="border border-green-500/30 bg-green-500/10 font-mono text-green-500 hover:bg-green-500/20">
              LOGIN
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="border border-green-500/30 bg-green-500/10 font-mono text-green-500 hover:bg-green-500/20">
              SIGN_UP
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
