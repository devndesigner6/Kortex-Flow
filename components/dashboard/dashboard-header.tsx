"use client"

import { auth, signOut, db, doc, getDoc, onAuthStateChanged } from "@/lib/firebase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import type { User } from "firebase/auth"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogOut, Mail } from 'lucide-react'
import { useEffect, useState } from "react"
import { KortexFlowLogo } from "@/components/kortexflow-logo"

interface DashboardHeaderProps {
  user?: { id: string; email: string | null } | null
  profile: { full_name?: string | null } | null
}

export function DashboardHeader({ user: serverUser, profile: initialProfile }: DashboardHeaderProps) {
  const router = useRouter()
  const [profile, setProfile] = useState(initialProfile)
  const [user, setUser] = useState<User | null>(null)
  const [isContactHovered, setIsContactHovered] = useState(false)

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else if (serverUser) {
        // Fallback to server user if client auth not ready
        setUser({ uid: serverUser.id, email: serverUser.email } as User)
      }
    })

    return () => unsubscribe()
  }, [serverUser])

  useEffect(() => {
    if (!user?.uid) return

    const fetchProfile = async () => {
      const docRef = doc(db, "profiles", user.uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        console.log("[v0] Fetched fresh profile:", docSnap.data())
        setProfile(docSnap.data() as any)
      }
    }

    fetchProfile()
  }, [user?.uid])

  const handleLogout = async () => {
    await signOut(auth)
    document.cookie = 'auth-token=; path=/; max-age=0'
    router.push("/")
  }

  if (!user) {
    return (
      <div className="mb-6 flex animate-pulse items-center justify-between border-b border-primary/20 pb-4">
        <div className="h-12 w-48 rounded bg-primary/10"></div>
      </div>
    )
  }

  const displayName = profile?.full_name || user.email?.split("@")[0] || user.email || 'User'

  return (
    <div className="mb-6 flex flex-col gap-3 border-b border-primary/20 pb-4 sm:mb-8 sm:gap-4 sm:pb-6 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
        <KortexFlowLogo size={50} className="block shrink-0 sm:hidden" />
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
        <Button
          asChild
          className="group relative border border-primary/20 bg-primary/5 p-2 transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] sm:p-2.5"
          aria-label="Contact Support"
          onMouseEnter={() => setIsContactHovered(true)}
          onMouseLeave={() => setIsContactHovered(false)}
        >
          <a href="mailto:kortexflowsync@gmail.com?subject=KortexFlow Support Query">
            <Mail className={`h-4 w-4 text-primary transition-all duration-500 ${isContactHovered ? 'rotate-[360deg] scale-110' : 'rotate-0 scale-100'}`} />
            <span className={`absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary transition-all duration-300 ${isContactHovered ? 'scale-150 opacity-100' : 'scale-0 opacity-0'}`} />
          </a>
        </Button>
        
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
