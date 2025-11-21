import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app"
import { getAuth, Auth } from "firebase/auth"
import { getFirestore, Firestore } from "firebase/firestore"
import { getAnalytics, isSupported } from "firebase/analytics"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase only when config is available
let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

function initializeFirebase() {
  // Only initialize if we have valid config and we're in the browser
  if (!app && firebaseConfig.apiKey && firebaseConfig.projectId && typeof window !== "undefined") {
    try {
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
      auth = getAuth(app)
      db = getFirestore(app)
    } catch (error) {
      console.error("Failed to initialize Firebase:", error)
    }
  }
  return { app, auth, db }
}

// Initialize Analytics only on client side
let analytics: ReturnType<typeof getAnalytics> | null = null
if (typeof window !== "undefined") {
  initializeFirebase()
  if (app) {
    isSupported().then((supported) => {
      if (supported && app) {
        analytics = getAnalytics(app)
      }
    })
  }
}

// Export getters to ensure lazy initialization
export function getFirebaseApp(): FirebaseApp {
  if (typeof window === "undefined") {
    throw new Error("Firebase can only be initialized in the browser")
  }
  const result = initializeFirebase()
  if (!result.app) {
    throw new Error("Firebase App not initialized. Check environment variables.")
  }
  return result.app
}

export function getFirebaseAuth(): Auth {
  if (typeof window === "undefined") {
    throw new Error("Firebase Auth can only be initialized in the browser")
  }
  const result = initializeFirebase()
  if (!result.auth) {
    throw new Error("Firebase Auth not initialized. Check environment variables.")
  }
  return result.auth
}

export function getFirebaseDb(): Firestore {
  if (typeof window === "undefined") {
    throw new Error("Firebase Firestore can only be initialized in the browser")
  }
  const result = initializeFirebase()
  if (!result.db) {
    throw new Error("Firebase Firestore not initialized. Check environment variables.")
  }
  return result.db
}

export { analytics }
