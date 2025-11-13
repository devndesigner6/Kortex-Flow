"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import { KortexFlowLogo } from "@/components/kortexflow-logo"

interface DashboardHeaderProps {
  user: User
  profile: { full_name?: string | null } | null
}

export function DashboardHeader({ user, profile: initialProfile }: DashboardHeaderProps) {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState(initialProfile)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()

      if (data) {
        console.log("[v0] Fetched fresh profile:", data)
        setProfile(data)
      }
    }

    fetchProfile()
  }, [user.id, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const displayName = profile?.full_name || user.email?.split("@")[0] || user.email

  return (
    <div className="mb-6 flex flex-col gap-3 border-b border-primary/20 pb-4 sm:mb-8 sm:gap-4 sm:pb-6 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
        <KortexFlowLogo size={60} className="hidden shrink-0 sm:block" />
        <div className="min-w-0 flex-1">
          <h1 className="font-serif text-xl italic leading-tight tracking-wide text-primary sm:text-2xl md:text-3xl lg:text-4xl">
            Kortexflow: Mission Control
          </h1>
          <p className="mt-1.5 font-mono text-xs text-muted-foreground sm:mt-2 sm:text-sm">
            Operator: <span className="text-primary">{displayName}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
        <ThemeToggle />
        <Button
          onClick={handleLogout}
          className="group border border-red-500/20 bg-red-500/5 p-2 transition-all duration-300 hover:border-red-500/40 hover:bg-red-500/10 hover:shadow-[0_0_10px_rgba(239,68,68,0.2)] sm:p-2.5"
          aria-label="Exit"
        >
          <LogOut className="h-4 w-4 text-red-500 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  )
}
