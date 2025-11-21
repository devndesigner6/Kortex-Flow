import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app"
import { getAuth, Auth } from "firebase/auth"
import { getFirestore, Firestore } from "firebase/firestore"
import { getAnalytics, isSupported } from "firebase/analytics"

// Initialize Firebase only when config is available
let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

function getFirebaseConfig() {
  return {
    apiKey: "AIzaSyDlKY6ueOdWjCAq30c26YG_5Z3AUpd2m7s",
    authDomain: "kortexflow-1a7e5.firebaseapp.com",
    projectId: "kortexflow-1a7e5",
    storageBucket: "kortexflow-1a7e5.firebasestorage.app",
    messagingSenderId: "534727057286",
    appId: "1:534727057286:web:5bfe0907686c1e84f2d607",
    measurementId: "G-E0K4BYKEYL",
  }
}

function initializeFirebase() {
  // Only initialize if we're in the browser
  if (!app && typeof window !== "undefined") {
    try {
      const config = getFirebaseConfig()
      app = getApps().length === 0 ? initializeApp(config) : getApp()
      auth = getAuth(app)
      db = getFirestore(app)
      console.log("Firebase initialized successfully")
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
