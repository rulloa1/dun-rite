/* Firebase Configuration — Production Setup */
/* 
   IMPORTANT: Replace these values with your Firebase project credentials
   Get them from: Firebase Console > Project Settings > Your Apps > SDK setup
*/

const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase (requires firebase SDK loaded first)
// This runs ONLY if window.firebase is available
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(FIREBASE_CONFIG);
  window.db = firebase.firestore();
  window.auth = firebase.auth();
  console.log('Firebase initialized');
}
