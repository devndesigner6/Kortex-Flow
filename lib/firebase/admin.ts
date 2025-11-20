import * as admin from "firebase-admin"

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n")
  
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || "kortexflow-1a7e5",
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@kortexflow-1a7e5.iam.gserviceaccount.com",
      privateKey: privateKey,
    }),
  })
}

export const adminAuth = admin.auth()
export const adminDb = admin.firestore()
export default admin
