"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, CheckCircle2 } from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  description: string | null
  start_time: string
  end_time: string
  location: string | null
  needs_confirmation: boolean
}

interface UpcomingEventsProps {
  events: CalendarEvent[]
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const [confirmingEventId, setConfirmingEventId] = useState<string | null>(null)
  const [confirmedEvents, setConfirmedEvents] = useState<Set<string>>(new Set())

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const handleConfirmEvent = async (eventId: string) => {
    setConfirmingEventId(eventId)
    try {
      const response = await fetch("/api/events/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      })

      if (!response.ok) throw new Error("Failed to confirm event")

      setConfirmedEvents((prev) => new Set([...prev, eventId]))
    } catch (error) {
      console.error("Error confirming event:", error)
      alert("Failed to confirm event. Please try again.")
    } finally {
      setConfirmingEventId(null)
    }
  }

  return (
    <Card className="border-primary/20 bg-background/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-xl text-foreground">
          <Calendar className="h-5 w-5 text-primary" />
          <span>Upcoming Events</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-6">
            <p className="font-mono text-sm text-muted-foreground">
              Connect Calendar to sync your events
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="group rounded-lg border border-primary/20 bg-primary/5 p-4 transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:shadow-md"
              >
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-serif text-base font-medium text-foreground">{event.title}</h3>
                  {event.needs_confirmation && !confirmedEvents.has(event.id) ? (
                    <Button
                      onClick={() => handleConfirmEvent(event.id)}
                      disabled={confirmingEventId === event.id}
                      size="sm"
                      className="h-7 gap-1 border-yellow-500/30 bg-yellow-500/20 px-3 font-mono text-xs text-yellow-500 hover:bg-yellow-500/30"
                    >
                      {confirmingEventId === event.id ? (
                        "Confirming..."
                      ) : (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          CONFIRM
                        </>
                      )}
                    </Button>
                  ) : confirmedEvents.has(event.id) ? (
                    <Badge className="border-green-500/30 bg-green-500/20 font-mono text-xs text-green-500">
                      CONFIRMED
                    </Badge>
                  ) : null}
                </div>
                {event.description && (
                  <p className="mb-2 font-mono text-xs text-muted-foreground">{event.description}</p>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span className="font-mono">{formatTime(event.start_time)}</span>
                </div>
                {event.location && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="font-mono">{event.location}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
