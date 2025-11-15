import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AIRepliesContent } from "@/components/ai-replies/ai-replies-content"

export default async function AIRepliesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch recent emails
  const { data: emails } = await supabase
    .from("emails")
    .select("*")
    .eq("user_id", user.id)
    .order("received_at", { ascending: false })
    .then((res) => ({ data: res.data || [] }))
    .catch(() => ({ data: [] }))

  return (
    <div className="page-transition min-h-screen w-full bg-background p-4 sm:p-6">
      <div className="animate-slide-in mx-auto w-full max-w-6xl">
        <AIRepliesContent emails={emails} />
      </div>
    </div>
  )
}
