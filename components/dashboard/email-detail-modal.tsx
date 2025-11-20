"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mail, User, Clock, X } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface Email {
  id: string
  subject: string | null
  sender: string | null
  received_at: string | null
  body: string | null
  processed: boolean
}

interface EmailDetailModalProps {
  email: Email | null
  open: boolean
  onClose: () => void
}

export function EmailDetailModal({ email, open, onClose }: EmailDetailModalProps) {
  if (!email) return null

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "Unknown date"
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0">
        <DialogHeader className="border-b border-primary/20 bg-primary/5 px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <DialogTitle className="font-serif text-xl text-foreground">
                  {email.subject || "No Subject"}
                </DialogTitle>
                {!email.processed && (
                  <Badge className="border-blue-500/30 bg-blue-500/20 font-mono text-xs text-blue-500">
                    NEW
                  </Badge>
                )}
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-mono">{email.sender || "Unknown Sender"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono">{formatTime(email.received_at)}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0 hover:bg-primary/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(85vh-160px)]">
          <div className="px-6 py-4">
            {email.body ? (
              <div 
                className="prose prose-sm max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: email.body }}
              />
            ) : (
              <p className="text-center text-muted-foreground font-mono">
                No email content available
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
