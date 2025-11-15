"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, User, Clock, ExternalLink } from 'lucide-react'
import { EmailDetailModal } from "./email-detail-modal"

interface Email {
  id: string
  subject: string | null
  sender: string | null
  received_at: string | null
  body: string | null
  processed: boolean
}

interface RecentEmailsProps {
  emails: Email[]
}

export function RecentEmails({ emails }: RecentEmailsProps) {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)

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

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email)
  }

  const handleCloseModal = () => {
    setSelectedEmail(null)
  }

  return (
    <>
      <Card className="border-primary/20 bg-background/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-xl text-foreground">
            <Mail className="h-5 w-5 text-primary" />
            <span>Recent Emails</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {emails.length === 0 ? (
            <div className="text-center py-6">
              <p className="font-mono text-sm text-muted-foreground">
                Connect Gmail to sync your emails
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {emails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => handleEmailClick(email)}
                  className="group cursor-pointer rounded-lg border border-primary/20 bg-primary/5 p-4 transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:shadow-md active:scale-[0.99]"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <h3 className="min-w-0 flex-1 truncate font-serif text-base font-medium text-foreground">
                        {email.subject || "No Subject"}
                      </h3>
                      <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    {!email.processed && (
                      <Badge className="shrink-0 border-blue-500/30 bg-blue-500/20 font-mono text-xs text-blue-500">
                        NEW
                      </Badge>
                    )}
                  </div>
                  <div className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3 shrink-0" />
                    <span className="min-w-0 truncate font-mono">{email.sender || "Unknown"}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 shrink-0" />
                    <span className="font-mono">{formatTime(email.received_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EmailDetailModal
        email={selectedEmail}
        open={!!selectedEmail}
        onClose={handleCloseModal}
      />
    </>
  )
}
