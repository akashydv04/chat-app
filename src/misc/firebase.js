// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBTaYV5ime5jaZ7_xp8L5NwT6okyLOVvQQ',
  authDomain: 'chat-web-app-ebe4e.firebaseapp.com',
  databaseURL: 'https://chat-web-app-ebe4e-default-rtdb.firebaseio.com',
  projectId: 'chat-web-app-ebe4e',
  storageBucket: 'chat-web-app-ebe4e.appspot.com',
  messagingSenderId: '82319992985',
  appId: '1:82319992985:web:2611c23e82027e79033008',
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();
