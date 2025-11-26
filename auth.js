// auth.js (Firebase v9 modular style)

// Import Firebase modules directly from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// --- Firebase Initialization ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUserProfile = null;

// --- Login Function ---
export async function login(email, password) {
  try {
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
  } catch (err) {
    throw err;
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
