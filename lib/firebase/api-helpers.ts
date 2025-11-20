// Simplified API helper for Firebase
import { adminAuth, adminDb } from "./admin"
import { NextRequest } from "next/server"

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "") || request.cookies.get("auth-token")?.value

    if (!token) {
      return { user: null, error: "No authentication token" }
    }

    const decodedToken = await adminAuth.verifyIdToken(token)
    return {
      user: {
        id: decodedToken.uid,
        email: decodedToken.email || null,
        uid: decodedToken.uid,
      },
      error: null,
    }
  } catch (error) {
    return { user: null, error: "Invalid authentication token" }
  }
}

export { adminDb as db }
