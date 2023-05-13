/* eslint-disable require-jsdoc */
/* eslint-disable linebreak-style */
/* eslint-disable eol-last */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
const functions = require('firebase-functions');

const admin = require('firebase-admin');

const database = admin.database();

exports.sendFcm = functions.https.onCall(async (data, context) => {
  checkIfAuth(context);

  const { chatId, title, message } = data;

  const roomSnap = await database.ref(`/rooms/${chatId}`).once('value');
  if (!roomSnap.exists) {
    return false;
  }

  const roomData = roomSnap.val();
});

function checkIfAuth(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Please Sign in.');
  }
}
