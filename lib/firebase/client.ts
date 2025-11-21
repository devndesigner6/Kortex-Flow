"use client"

import { getFirebaseAuth, getFirebaseDb } from "./config"
import {
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword as firebaseCreateUser,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User,
  Auth,
} from "firebase/auth"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  Timestamp,
  Firestore,
} from "firebase/firestore"

// Lazy getters for auth and db
export const auth: Auth = new Proxy({} as Auth, {
  get(target, prop) {
    const authInstance = getFirebaseAuth()
    if (!authInstance) {
      throw new Error("Firebase Auth not initialized. Make sure environment variables are set.")
    }
    return authInstance[prop as keyof Auth]
  }
})

export const db: Firestore = new Proxy({} as Firestore, {
  get(target, prop) {
    const dbInstance = getFirebaseDb()
    if (!dbInstance) {
      throw new Error("Firebase Firestore not initialized. Make sure environment variables are set.")
    }
    return dbInstance[prop as keyof Firestore]
  }
})

// Wrap auth functions to use lazy getter
export const signInWithEmailAndPassword = (auth: Auth, email: string, password: string) => {
  return firebaseSignIn(getFirebaseAuth()!, email, password)
}

export const createUserWithEmailAndPassword = (auth: Auth, email: string, password: string) => {
  return firebaseCreateUser(getFirebaseAuth()!, email, password)
}

export const signOut = (auth: Auth) => {
  return firebaseSignOut(getFirebaseAuth()!)
}

export const onAuthStateChanged = (auth: Auth, callback: (user: User | null) => void) => {
  return firebaseOnAuthStateChanged(getFirebaseAuth()!, callback)
}

// Re-export Firestore functions directly
export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  Timestamp,
}

export type { User }
