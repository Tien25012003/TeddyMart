// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBdTF21koiqn_pGkKbCCXTXhFmII4ldFn0",
    authDomain: "teddymart-90d05.firebaseapp.com",
    projectId: "teddymart-90d05",
    storageBucket: "teddymart-90d05.appspot.com",
    messagingSenderId: "697095652159",
    appId: "1:697095652159:web:e7578783464d6edda4498a",
    measurementId: "G-NLNSYCY89X",
    databaseURL: "https://teddymart-90d05.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
export {db, auth, storage};
