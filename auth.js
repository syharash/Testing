// auth.js
// Firebase Authentication + Firestore profile management

// --- Firebase Initialization ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUserProfile = null;

// --- Login Function ---
export async function login(email, password) {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;
    const doc = await db.collection("users").doc(uid).get();
    if (doc.exists) {
      currentUserProfile = doc.data();
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
  await auth.signOut();
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
