"use client"

import { getFirebaseAuth, getFirebaseDb } from "./config"
import {
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword as firebaseCreateUser,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User,
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
} from "firebase/firestore"

// Export auth and db as getters
export const getAuth = () => getFirebaseAuth()
export const getDb = () => getFirebaseDb()

// For backward compatibility, export auth and db that call getters
export const auth = getFirebaseAuth()
export const db = getFirebaseDb()

// Wrap auth functions to always use fresh instances
export const signInWithEmailAndPassword = (authInstance: any, email: string, password: string) => {
  return firebaseSignIn(getFirebaseAuth(), email, password)
}

export const createUserWithEmailAndPassword = (authInstance: any, email: string, password: string) => {
  return firebaseCreateUser(getFirebaseAuth(), email, password)
}

export const signOut = (authInstance: any) => {
  return firebaseSignOut(getFirebaseAuth())
}

export const onAuthStateChanged = (authInstance: any, callback: (user: User | null) => void) => {
  return firebaseOnAuthStateChanged(getFirebaseAuth(), callback)
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
