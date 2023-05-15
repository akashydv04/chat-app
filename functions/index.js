/* eslint-disable quotes */
const functions = require('firebase-functions');

const admin = require('firebase-admin');

const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://chat-web-app-ebe4e-default-rtdb.firebaseio.com',
});

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info('Hello logs!', { structuredData: true });
//   response.send('Hello from Firebase!');
// });

const { sendFcm } = require('./src/fcm');
exports.sendFcm = sendFcm;
