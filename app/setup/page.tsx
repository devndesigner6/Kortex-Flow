import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/firebase/helpers"
import { SetupWizard } from "@/components/setup/setup-wizard"

export default async function SetupPage() {
  const { user, error: authError } = await getServerSession()

  if (!user || authError) {
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
