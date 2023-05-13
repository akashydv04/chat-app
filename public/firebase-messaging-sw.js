/* eslint-disable no-undef */
importScripts(
  'https://www.gstatic.com/firebasejs/9.21.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.21.0/firebase-messaging-compat.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyBTaYV5ime5jaZ7_xp8L5NwT6okyLOVvQQ',
  authDomain: 'chat-web-app-ebe4e.firebaseapp.com',
  databaseURL: 'https://chat-web-app-ebe4e-default-rtdb.firebaseio.com',
  projectId: 'chat-web-app-ebe4e',
  storageBucket: 'chat-web-app-ebe4e.appspot.com',
  messagingSenderId: '82319992985',
  appId: '1:82319992985:web:2611c23e82027e79033008',
});

firebase.messaging();
