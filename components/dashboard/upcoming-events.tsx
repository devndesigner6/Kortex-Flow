import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
  const formatTime = (dateString: string) => {
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
        <CardTitle className="font-mono text-xl text-green-500">&gt; UPCOMING_EVENTS</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="font-mono text-sm text-green-500/50">NO_EVENTS_SCHEDULED.</p>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-mono text-sm font-semibold text-green-500">{event.title}</h3>
                  {event.needs_confirmation && (
                    <Badge className="border-yellow-500/30 bg-yellow-500/20 font-mono text-xs text-yellow-500">
                      CONFIRM
                    </Badge>
                  )}
                </div>
                <p className="mb-1 font-mono text-xs text-green-500/70">{formatTime(event.start_time)}</p>
                {event.location && <p className="font-mono text-xs text-green-500/50">LOCATION: {event.location}</p>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
