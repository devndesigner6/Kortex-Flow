import { getAuthenticatedUser, db } from "@/lib/firebase/api-helpers"
import { NextResponse } from "next/server"
import { generateWithGemini } from "@/lib/google-ai"

export async function POST(request: Request) {
  // Firebase initialized via helpers

  const { user, error: authError } = await getAuthenticatedUser(request)

  if (!user || authError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const eventsSnapshot = await db
      .collection("calendar_events")
      .where("user_id", "==", user.uid)
      .where("start_time", ">=", new Date().toISOString())
      .limit(10)
      .get()

    const events = eventsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

    if (!events || events.length === 0) {
      return NextResponse.json({ extracted: 0, message: "No unprocessed events found" })
    }

    let totalTasksCreated = 0

    for (const event of events) {
      const eventContent = `
Event: ${event.title}
Date: ${new Date(event.start_time).toLocaleString()} - ${new Date(event.end_time).toLocaleString()}
Location: ${event.location || "Not specified"}
Description: ${event.description || "No description"}
Attendees: ${event.attendees || "Just you"}
      `

      const prompt = `Analyze this calendar event and identify any preparation tasks, follow-up actions, or things that need to be done before, during, or after this meeting.

Consider:
- Items to prepare before the meeting (documents, presentations, data)
- Things to bring or set up (equipment, materials)
- Follow-up actions mentioned in the description
- Deadlines or deliverables associated with this event
- RSVPs or confirmations needed

Only create tasks if there are clear action items. Don't create tasks for routine meetings with no preparation needed.

Return ONLY a valid JSON object with this structure:
{
  "tasks": [
    {
      "title": "string",
      "description": "string",
      "due_date": "string or null",
      "priority": "urgent|high|medium|low"
    }
  ]
}

Calendar event:
${eventContent}`

      const text = await generateWithGemini(prompt)

      // Parse the JSON response
      let parsed
      try {
        parsed = JSON.parse(text)
      } catch (e) {
        console.error("[v0] Failed to parse AI response:", text)
        continue
      }

      if (parsed.tasks && parsed.tasks.length > 0) {
        const batch = db.batch()

        for (const task of parsed.tasks) {
          const taskRef = db.collection("tasks").doc()
          batch.set(taskRef, {
            user_id: user.uid,
            title: task.title,
            description: task.description,
            due_date: task.due_date || event.start_time,
            priority: task.priority,
            status: "pending",
            source: "calendar",
            source_id: event.google_event_id || event.id,
            created_at: new Date().toISOString(),
          })
        }

        try {
          await batch.commit()
          totalTasksCreated += parsed.tasks.length
        } catch (error) {
          console.error("[v0] Error inserting tasks from event:", error)
        }
      }
    }

    return NextResponse.json({
      extracted: totalTasksCreated,
      processed_events: events.length,
      message: `Successfully extracted ${totalTasksCreated} tasks from ${events.length} events`,
    })
  } catch (error) {
    console.error("[v0] Event analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze events" }, { status: 500 })
  }
}



