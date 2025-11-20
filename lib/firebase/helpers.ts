// Helper functions to work with Firebase in place of Supabase patterns

import { adminAuth, adminDb } from "./admin"
import { cookies } from "next/headers"
import type { DecodedIdToken } from "firebase-admin/auth"

export interface FirebaseUser {
  id: string
  email: string | null
  user_metadata?: Record<string, any>
}

// Server-side authentication helper
export async function getServerSession(): Promise<{ user: FirebaseUser | null; error: Error | null }> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return { user: null, error: null }
    }

    const decodedToken = await adminAuth.verifyIdToken(token)
    
    return {
      user: {
        id: decodedToken.uid,
        email: decodedToken.email || null,
        user_metadata: decodedToken,
      },
      error: null,
    }
  } catch (error) {
    return { user: null, error: error as Error }
  }
}

// Firestore helper to mimic Supabase query patterns
export class FirestoreQuery {
  private collectionName: string
  private whereConditions: Array<{ field: string; operator: any; value: any }> = []
  private orderByField: string | null = null
  private orderDirection: "asc" | "desc" = "asc"
  private limitCount: number | null = null
  private selectFields: string[] | null = null

  constructor(collection: string) {
    this.collectionName = collection
  }

  select(fields: string = "*") {
    if (fields !== "*") {
      this.selectFields = fields.split(",").map((f) => f.trim())
    }
    return this
  }

  eq(field: string, value: any) {
    this.whereConditions.push({ field, operator: "==", value })
    return this
  }

  gte(field: string, value: any) {
    this.whereConditions.push({ field, operator: ">=", value })
    return this
  }

  lte(field: string, value: any) {
    this.whereConditions.push({ field, operator: "<=", value })
    return this
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.orderByField = field
    this.orderDirection = options?.ascending === false ? "desc" : "asc"
    return this
  }

  limit(count: number) {
    this.limitCount = count
    return this
  }

  async single() {
    const results = await this.execute()
    if (!results.data || results.data.length === 0) {
      return { data: null, error: new Error("No data found") }
    }
    return { data: results.data[0], error: null }
  }

  async execute() {
    try {
      let queryRef: any = adminDb.collection(this.collectionName)

      // Apply where conditions
      for (const condition of this.whereConditions) {
        queryRef = queryRef.where(condition.field, condition.operator, condition.value)
      }

      // Apply ordering
      if (this.orderByField) {
        queryRef = queryRef.orderBy(this.orderByField, this.orderDirection)
      }

      // Apply limit
      if (this.limitCount) {
        queryRef = queryRef.limit(this.limitCount)
      }

      const snapshot = await queryRef.get()
      const data = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }))

      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  // Helper for thens
  then(resolve: any, reject?: any) {
    return this.execute().then(resolve, reject)
  }

  catch(reject: any) {
    return this.execute().catch(reject)
  }
}

// Firestore operations helper
export const firestore = {
  from(collection: string) {
    return new FirestoreQuery(collection)
  },

  async insert(collection: string, data: any) {
    try {
      const docRef = await adminDb.collection(collection).add({
        ...data,
        created_at: new Date().toISOString(),
      })
      return { data: { id: docRef.id, ...data }, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  async update(collection: string, id: string, data: any) {
    try {
      await adminDb.collection(collection).doc(id).update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  async upsert(collection: string, data: any) {
    try {
      const docId = data.id
      await adminDb.collection(collection).doc(docId).set(data, { merge: true })
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  async delete(collection: string, id: string) {
    try {
      await adminDb.collection(collection).doc(id).delete()
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  },
}
