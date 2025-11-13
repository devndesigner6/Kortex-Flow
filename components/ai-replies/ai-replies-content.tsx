"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mail, Sparkles, Send, Edit3, X, RefreshCw, User, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Email {
  id: string
  subject: string | null
  sender: string | null
  body: string | null
  received_at: string | null
  gmail_id: string | null
}

interface EmailWithReply extends Email {
  aiReply?: string
  replyTone?: string
  isEditing?: boolean
}

interface AIRepliesContentProps {
  emails: Email[]
}

export function AIRepliesContent({ emails }: AIRepliesContentProps) {
  const router = useRouter()
  const [emailsWithReplies, setEmailsWithReplies] = useState<EmailWithReply[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSending, setIsSending] = useState<string | null>(null)

  const analyzeEmails = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/ai/analyze-replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails }),
      })

      if (!response.ok) throw new Error("Failed to analyze emails")

      const data = await response.json()
      setEmailsWithReplies(
        data.emailsNeedingReplies.map((email: EmailWithReply) => ({
          ...email,
          replyTone: "professional",
          isEditing: false,
        })),
      )
    } catch (error) {
      console.error("Error analyzing emails:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const regenerateReply = async (emailId: string, tone: string) => {
    const email = emailsWithReplies.find((e) => e.id === emailId)
    if (!email) return

    try {
      const response = await fetch("/api/ai/generate-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: email.subject,
          sender: email.sender,
          body: email.body,
          tone,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate reply")

      const data = await response.json()
      setEmailsWithReplies((prev) =>
        prev.map((e) => (e.id === emailId ? { ...e, aiReply: data.reply, replyTone: tone } : e)),
      )
    } catch (error) {
      console.error("Error regenerating reply:", error)
    }
  }

  const sendReply = async (email: EmailWithReply) => {
    if (!email.aiReply || !email.gmail_id) return

    setIsSending(email.id)
    try {
      const response = await fetch("/api/gmail/send-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: email.gmail_id,
          subject: email.subject,
          replyText: email.aiReply,
        }),
      })

      if (!response.ok) throw new Error("Failed to send reply")

      setEmailsWithReplies((prev) => prev.filter((e) => e.id !== email.id))
    } catch (error) {
      console.error("Error sending reply:", error)
    } finally {
      setIsSending(null)
    }
  }

  const updateReply = (emailId: string, newReply: string) => {
    setEmailsWithReplies((prev) => prev.map((e) => (e.id === emailId ? { ...e, aiReply: newReply } : e)))
  }

  const toggleEditing = (emailId: string) => {
    setEmailsWithReplies((prev) => prev.map((e) => (e.id === emailId ? { ...e, isEditing: !e.isEditing } : e)))
  }

  const removeEmail = (emailId: string) => {
    setEmailsWithReplies((prev) => prev.filter((e) => e.id !== emailId))
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "UNKNOWN"
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/dashboard")}
          className="group flex items-center gap-2 rounded-full border border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]"
        >
          <ArrowLeft className="h-4 w-4 text-primary transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="font-serif text-sm uppercase tracking-wider text-primary">Return to Dashboard</span>
        </button>
      </div>

      {/* Title Section */}
      <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-2xl text-foreground">AI Email Replies</h1>
            <p className="font-mono text-sm text-muted-foreground">
              Generate intelligent replies to your emails with AI assistance
            </p>
          </div>
        </div>

        <Button
          onClick={analyzeEmails}
          disabled={isAnalyzing || emails.length === 0}
          className="w-full gap-2 bg-primary font-serif text-sm uppercase tracking-wide text-primary-foreground hover:bg-primary/90 sm:w-auto"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Analyzing Emails...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Analyze Emails for Replies
            </>
          )}
        </Button>
      </div>

      {/* Emails needing replies */}
      {emailsWithReplies.length === 0 && !isAnalyzing && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-8 text-center">
          <Mail className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
          <p className="font-serif text-base text-muted-foreground mb-2">No emails analyzed yet</p>
          <p className="font-mono text-xs text-muted-foreground">
            {emails.length === 0
              ? "Connect and sync your Gmail to get started"
              : `Click the button above to analyze ${emails.length} emails`}
          </p>
        </div>
      )}

      {emailsWithReplies.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-serif text-xl text-foreground">Emails Needing Replies ({emailsWithReplies.length})</h2>

          {emailsWithReplies.map((email) => (
            <div
              key={email.id}
              className="group rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-4 shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="mb-1 font-serif text-base font-medium text-foreground">
                    {email.subject || "No Subject"}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span className="font-mono">{email.sender || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className="font-mono">{formatTime(email.received_at)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => removeEmail(email.id)}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className="border-primary/30 bg-primary/20 font-mono text-xs text-primary">AI DRAFT</Badge>
                  <div className="flex items-center gap-2">
                    <Select
                      value={email.replyTone || "professional"}
                      onValueChange={(value) => regenerateReply(email.id, value)}
                    >
                      <SelectTrigger className="h-7 w-32 border-primary/20 bg-background/50 font-mono text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="brief">Brief</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => toggleEditing(email.id)}
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 px-2 font-mono text-xs"
                    >
                      <Edit3 className="h-3 w-3" />
                      {email.isEditing ? "Preview" : "Edit"}
                    </Button>
                  </div>
                </div>

                {email.isEditing ? (
                  <Textarea
                    value={email.aiReply || ""}
                    onChange={(e) => updateReply(email.id, e.target.value)}
                    className="min-h-32 border-primary/20 bg-background/50 font-mono text-sm"
                  />
                ) : (
                  <div className="rounded-md border border-primary/20 bg-background/30 p-3 font-mono text-sm text-foreground">
                    {email.aiReply || "Generating reply..."}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => sendReply(email)}
                  disabled={!email.aiReply || isSending === email.id}
                  size="sm"
                  className="flex-1 gap-2 bg-primary font-mono text-sm text-primary-foreground hover:bg-primary/90"
                >
                  {isSending === email.id ? (
                    <>
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-3 w-3" />
                      Send Reply
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => regenerateReply(email.id, email.replyTone || "professional")}
                  variant="outline"
                  size="sm"
                  className="gap-2 border-primary/20 font-mono text-sm"
                >
                  <RefreshCw className="h-3 w-3" />
                  Regenerate
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
