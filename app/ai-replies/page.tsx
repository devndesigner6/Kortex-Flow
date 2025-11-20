import { redirect } from "next/navigation"
import { getServerSession, firestore } from "@/lib/firebase/helpers"
import { AIRepliesContent } from "@/components/ai-replies/ai-replies-content"

export default async function AIRepliesPage() {
  const { user, error: authError } = await getServerSession()

  if (!user || authError) {
    redirect("/auth/login")
  }

  // Fetch recent emails
  const { data: emails } = await firestore
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
