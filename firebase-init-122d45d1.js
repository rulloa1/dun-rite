/* Firebase Configuration & Auth */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyD1234567890abcdefghijklmnopqrstuvwx",
  authDomain: "dun-rite-construction.firebaseapp.com",
  projectId: "dun-rite-construction",
  storageBucket: "dun-rite-construction.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890ghijkl"
};

// Initialize Firebase
let db = null;
let auth = null;

try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  auth = firebase.auth();
} catch(e) {
  console.log('Firebase not loaded; using localStorage');
}

window.firebase = {
  db,
  auth,
  config: firebaseConfig,
  ready: !!db
};
