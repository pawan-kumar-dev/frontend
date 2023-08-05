import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBx8KseYwgFGAxKJVI8Xvaz6hXf29a99Go",
  authDomain: "expensexpert-d47c6.firebaseapp.com",
  projectId: "expensexpert-d47c6",
  storageBucket: "expensexpert-d47c6.appspot.com",
  messagingSenderId: "921470244989",
  appId: "1:921470244989:web:c27d7b2f4330403e837914",
};

initializeApp(firebaseConfig);

const db = getFirestore();

const auth = getAuth();

const categoryRef = collection(db, "category");

const usersRef = collection(db, "user");
const expenseRef = collection(db, "expense");

const googleAuthProvider = new GoogleAuthProvider();

export { db, categoryRef, auth, usersRef, expenseRef, googleAuthProvider };
