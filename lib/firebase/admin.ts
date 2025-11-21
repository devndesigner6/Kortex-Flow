import * as admin from "firebase-admin"

function initializeAdmin() {
  if (!admin.apps.length) {
    try {
      const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n")
      
      if (!privateKey) {
        console.warn("Firebase Admin not initialized: missing FIREBASE_ADMIN_PRIVATE_KEY")
        return
      }
      
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || "kortexflow-1a7e5",
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@kortexflow-1a7e5.iam.gserviceaccount.com",
          privateKey: privateKey,
        }),
      })
    } catch (error) {
      console.error("Failed to initialize Firebase Admin:", error)
    }
  }
}

export const getAdminAuth = () => {
  initializeAdmin()
  return admin.auth()
}

export const getAdminDb = () => {
  initializeAdmin()
  return admin.firestore()
}

// Legacy exports for backwards compatibility
export const adminAuth = new Proxy({} as admin.auth.Auth, {
  get: (target, prop) => {
    initializeAdmin()
    return (admin.auth() as any)[prop]
  }
})

export const adminDb = new Proxy({} as admin.firestore.Firestore, {
  get: (target, prop) => {
    initializeAdmin()
    return (admin.firestore() as any)[prop]
  }
})

export default admin
