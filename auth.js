// auth.js (Firebase v9 modular style)

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// If you want Analytics, import it too:
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyB4kSCgdJLSCFMUdEyqT_I9xgrEFNnPulQ",
  authDomain: "ijtima-ae364.firebaseapp.com",
  projectId: "ijtima-ae364",
  storageBucket: "ijtima-ae364.appspot.com",   // corrected: should end with .appspot.com
  messagingSenderId: "843664116262",
  appId: "1:843664116262:web:b6144381ce4b92934374e7",
  measurementId: "G-HGZZGTGFZN"
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// const analytics = getAnalytics(app); // optional, only if you need Analytics

let currentUserProfile = null;

// --- Login Function ---
export async function login(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  // Fetch user profile from Firestore
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    currentUserProfile = docSnap.data();
    return currentUserProfile;
  } else {
    throw new Error("No profile found for this user.");
  }
}

// --- Logout Function ---
export async function logout() {
  await signOut(auth);
  currentUserProfile = null;
}

// --- Get Assigned State ---
export function getUserState() {
  return currentUserProfile ? currentUserProfile.assignedState : null;
}

// --- Get Current Profile ---
export function getUserProfile() {
  return currentUserProfile;
}
