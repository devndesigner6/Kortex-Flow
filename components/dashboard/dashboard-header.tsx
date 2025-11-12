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
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.log('Sign out error (Supabase may not be configured):', error)
    }
    router.push("/")
  }

  const goToBlockchain = () => {
    router.push("/blockchain")
  }

  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-green-500/20 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-mono text-2xl font-bold text-green-500 sm:text-4xl break-words">
          &gt; KORTEXFLOW_DASHBOARD
        </h1>
        <p className="mt-2 font-mono text-xs sm:text-sm text-green-500/70 break-all">USER: {user.email}</p>
      </div>
      <div className="flex gap-2 sm:gap-3 flex-shrink-0">
        <Button
          onClick={goToBlockchain}
          className="border border-green-500/30 bg-green-500/10 font-mono text-xs sm:text-sm text-green-500 hover:bg-green-500/20"
        >
          CONNECT_WALLET
        </Button>
        <Button
          onClick={handleLogout}
          className="border border-red-500/30 bg-red-500/10 font-mono text-xs sm:text-sm text-red-500 hover:bg-red-500/20"
        >
          LOGOUT
        </Button>
      </div>
    </div>
  )
}
