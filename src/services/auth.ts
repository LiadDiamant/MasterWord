/**
 * auth.ts - Firebase Authentication & User Data Service
 *
 * This module provides helper functions for:
 * 1. Registering a new user with email + password (Firebase Auth)
 * 2. Saving extra user profile data to Firestore (database)
 *
 * WHY a separate file?
 * - Keeps RegisterScreen.tsx focused on UI only
 * - Makes it easy to reuse auth logic in other screens later
 */

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

/**
 * The shape of the user profile data we save to Firestore.
 * This is NOT the Firebase Auth user — it's the extra info
 * like name, age, band level, etc.
 */
export interface UserProfile {
  username: string;
  fullName: string;
  email: string;
  idNumber: string;
  phoneNumber: string;
  age: number;
  referralSource: string;
  selectedBand: string;
}

/**
 * registerUser - Creates a new Firebase Auth account and saves profile data.
 *
 * WHAT IT DOES (step by step):
 * 1. Calls createUserWithEmailAndPassword → Firebase creates an auth account
 *    and gives us back a unique user ID (uid).
 * 2. Takes that uid and saves the user's profile data to Firestore
 *    in a document at: users/{uid}
 *
 * WHY we use the uid as the document ID:
 * - It links the Auth account to the Firestore profile
 * - Later, when the user logs in, we can read their data using their uid
 *
 * @param email    - The email address for login
 * @param password - The password for login
 * @param profile  - All the extra user info (name, age, band, etc.)
 * @returns        - The Firebase User object (contains uid, email, etc.)
 */
export async function registerUser(
  email: string,
  password: string,
  profile: UserProfile
) {
  // Step 1: Create the authentication account
  // This registers the user in Firebase Auth (email + password)
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  // The newly created user — contains the unique uid
  const user = userCredential.user;

  // Step 2: Save the profile data to Firestore
  // doc(db, 'users', user.uid) creates a reference to: /users/{uid}
  // setDoc writes the data to that document
  await setDoc(doc(db, 'users', user.uid), {
    // Spread all the profile fields (username, fullName, age, etc.)
    ...profile,
    // Add a server-generated timestamp so we know when the user registered
    createdAt: serverTimestamp(),
  });

  // Return the user object so the calling code can use the uid if needed
  return user;
}

