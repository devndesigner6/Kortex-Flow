"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="mb-8 flex items-center justify-between border-b border-green-500/20 pb-6">
      <div>
        <h1 className="font-mono text-4xl font-bold text-green-500">&gt; KORTEXFLOW_DASHBOARD</h1>
        <p className="mt-2 font-mono text-sm text-green-500/70">USER: {user.email}</p>
      </div>
      <Button
        onClick={handleLogout}
        className="border border-green-500/30 bg-green-500/10 font-mono text-green-500 hover:bg-green-500/20"
      >
        LOGOUT
      </Button>
    </div>
  )
}
