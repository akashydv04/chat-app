// Import the functions you need from the SDKs you need
import { Notification as Toast } from 'rsuite';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import 'firebase/compat/messaging';
import 'firebase/compat/functions';
import { isLocalHost } from './helpers';
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';
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
export const functions = app.functions('us-central1');

export const messaging = firebase.messaging.isSupported()
  ? app.messaging()
  : null;

if (messaging) {
  messaging
    .getToken({
      vapidKey:
        'BKj-bdhHILNs74vbOxtXfCMShrQ52paE7UCYwCXceGU29ieIq6SU7xKt7pOAHf4GPmGCiy0fAvWg9MQpwQUmGb0',
    })
    .then(currentToken => {
      if (currentToken) {
        // Send the token to your server and update the UI if necessary
        // ...
      } else {
        // Show permission request UI
        console.log(
          'No registration token available. Request permission to generate one.'
        );
        // ...
      }
    })
    .catch(err => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    });
  messaging.onMessage(({ notification }) => {
    const { title, body } = notification;
    Toast.info({ title, description: body, duration: 0 });
  });
}

messaging
  .getToken({
    vapidKey:
      'BKj-bdhHILNs74vbOxtXfCMShrQ52paE7UCYwCXceGU29ieIq6SU7xKt7pOAHf4GPmGCiy0fAvWg9MQpwQUmGb0',
  })
  .then(currentToken => {
    if (currentToken) {
      // Send the token to your server and update the UI if necessary
      // ...
    } else {
      // Show permission request UI
      console.log(
        'No registration token available. Request permission to generate one.'
      );
      // ...
    }
  })
  .catch(err => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
  });

if (isLocalHost) {
  functions.useFunctionsEmulator('http://localhost:5001');
}
