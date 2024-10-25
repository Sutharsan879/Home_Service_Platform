import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; 
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyBGM08xNiuSKzCNoRKp8QZpaZV56HsJeBQ",
  authDomain: "task-2-da972.firebaseapp.com",
  databaseURL: "https://task-2-da972-default-rtdb.firebaseio.com",
  projectId: "task-2-da972",
  storageBucket: "task-2-da972.appspot.com",
  messagingSenderId: "1014378431547",
  appId: "1:1014378431547:web:c877f03286b837ac95c81e",
  measurementId: "G-W65BPJMVVQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);  
const storage = getStorage(app);    

export { auth, database, storage };
