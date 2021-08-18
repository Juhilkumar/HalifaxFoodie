import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyDbYoTTmLvTJXS66Ouv9w7pR54AKs-OU6Y",
  authDomain: "halifax-foodie.firebaseapp.com",
  projectId: "halifax-foodie",
  storageBucket: "halifax-foodie.appspot.com",
  messagingSenderId: "630344978264",
  appId: "1:630344978264:web:5d4fde38e5a7e1e9765f2d",
  measurementId: "G-P6KBDRZ2KL",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const firestore = firebase.firestore();
firestore.settings({
  timestampsInSnapshots: true,
});

export default firebase;
