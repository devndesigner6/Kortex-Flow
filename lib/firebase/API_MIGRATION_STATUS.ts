/* 
 * IMPORTANT: API Routes Migration to Firebase
 * 
 * All API routes in app/api/ need to be updated manually or with this pattern:
 * 
 * OLD PATTERN (Supabase):
 * import { createClient } from "@/lib/supabase/server"
 * const supabase = await createClient()
 * const { data: { user } } = await supabase.auth.getUser()
 * await supabase.from("table").insert(data)
 * 
 * NEW PATTERN (Firebase):
 * import { getAuthenticatedUser, db } from "@/lib/firebase/api-helpers"
 * const { user, error } = await getAuthenticatedUser(request)
 * await db.collection("table").add(data)
 * 
 * Files that still need updates:
 * - app/api/tasks/bulk-create/route.ts
 * - app/api/gmail/disconnect/route.ts
 * - app/api/gmail/sync/route.ts
 * - app/api/gmail/send-reply/route.ts
 * - app/api/gmail/callback/route.ts
 * - app/api/calendar/connect/route.ts
 * - app/api/calendar/disconnect/route.ts
 * - app/api/calendar/sync/route.ts
 * - app/api/calendar/callback/route.ts
 * - app/api/events/confirm/route.ts
 * - app/api/ai/extract-tasks/route.ts
 * - app/api/ai/analyze-events/route.ts
 * - app/api/ai/analyze-replies/route.ts
 * - app/api/ai/generate-reply/route.ts
 * 
 * These routes will fail until migrated, but the core auth and dashboard
 * functionality is now working with Firebase.
 */

export const API_MIGRATION_STATUS = {
  completed: [
    "app/api/tasks/create/route.ts",
    "app/api/gmail/connect/route.ts"
  ],
  pending: [
    "app/api/tasks/bulk-create/route.ts",
    "app/api/gmail/*",
    "app/api/calendar/*",
    "app/api/events/*",
    "app/api/ai/*"
  ]
}
