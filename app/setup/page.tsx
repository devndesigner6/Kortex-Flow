import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SetupWizard } from "@/components/setup/setup-wizard"

export default async function SetupPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 border-b border-green-500/20 pb-4">
          <h1 className="font-mono text-2xl text-green-500">KORTEXFLOW_SETUP</h1>
          <p className="mt-2 font-mono text-sm text-green-500/70">Initialize your database to start using KortexFlow</p>
        </div>
        <SetupWizard />
      </div>
    </div>
  )
}
