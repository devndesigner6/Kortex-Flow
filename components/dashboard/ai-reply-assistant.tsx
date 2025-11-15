"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Mail, Send, Edit3, X, RefreshCw, User, Clock } from "lucide-react"
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

interface AIReplyAssistantProps {
  emails: Email[]
}

export function AIReplyAssistant({ emails }: AIReplyAssistantProps) {
  const [emailsWithReplies, setEmailsWithReplies] = useState<EmailWithReply[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSending, setIsSending] = useState<string | null>(null)

  const analyzeEmails = async () => {
    console.log("[v0] Starting email analysis with", emails.length, "emails")
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/ai/analyze-replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails }),
      })

      console.log("[v0] Analyze API response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Analyze API error:", errorText)
        throw new Error("Failed to analyze emails")
      }

      const data = await response.json()
      console.log("[v0] Analysis result:", data)

      setEmailsWithReplies(
        data.emailsNeedingReplies.map((email: EmailWithReply) => ({
          ...email,
          replyTone: "professional",
          isEditing: false,
        })),
      )

      console.log("[v0] Set", data.emailsNeedingReplies.length, "emails needing replies")
    } catch (error) {
      console.error("[v0] Error analyzing emails:", error)
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
    <Card className="border-primary/20 bg-background/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between font-serif text-xl text-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>AI Reply Assistant</span>
          </div>
          <Button
            onClick={analyzeEmails}
            disabled={isAnalyzing || emails.length === 0}
            size="sm"
            className="gap-2 bg-primary/20 font-mono text-xs text-primary hover:bg-primary/30"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-3 w-3 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3" />
                Analyze Emails
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {emailsWithReplies.length === 0 ? (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
            <Mail className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="font-serif text-sm text-muted-foreground">
              {emails.length === 0
                ? "No emails to analyze. Sync your Gmail first."
                : "Click 'Analyze Emails' to find emails that need replies"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
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
      </CardContent>
    </Card>
  )
}
