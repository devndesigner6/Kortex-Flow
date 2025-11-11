import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Email {
  id: string
  subject: string | null
  sender: string | null
  received_at: string | null
  processed: boolean
}

interface RecentEmailsProps {
  emails: Email[]
}

export function RecentEmails({ emails }: RecentEmailsProps) {
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
    <Card className="border-green-500/20 bg-black">
      <CardHeader>
        <CardTitle className="font-mono text-xl text-green-500">&gt; RECENT_EMAILS</CardTitle>
      </CardHeader>
      <CardContent>
        {emails.length === 0 ? (
          <p className="font-mono text-sm text-green-500/50">NO_EMAILS_SYNCED.</p>
        ) : (
          <div className="space-y-3">
            {emails.map((email) => (
              <div key={email.id} className="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-mono text-sm font-semibold text-green-500">{email.subject || "NO_SUBJECT"}</h3>
                  {!email.processed && (
                    <Badge className="border-blue-500/30 bg-blue-500/20 font-mono text-xs text-blue-500">NEW</Badge>
                  )}
                </div>
                <p className="mb-1 font-mono text-xs text-green-500/70">FROM: {email.sender || "UNKNOWN"}</p>
                <p className="font-mono text-xs text-green-500/50">{formatTime(email.received_at)}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
