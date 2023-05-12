// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import 'firebase/messaging';
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

export const messaging = firebase.messaging.isSupported()
  ? app.messaging()
  : null;

if (messaging) {
  messaging.usePublicVapidKey(
    'BKj-bdhHILNs74vbOxtXfCMShrQ52paE7UCYwCXceGU29ieIq6SU7xKt7pOAHf4GPmGCiy0fAvWg9MQpwQUmGb0'
  );

  messaging.onMessage(data => {
    console.log(data);
  });
}
