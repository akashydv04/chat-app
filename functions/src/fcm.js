/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
/* eslint-disable linebreak-style */
/* eslint-disable eol-last */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */

import { Alert } from 'rsuite';

/* eslint-disable quotes */
const functions = require('firebase-functions');

const admin = require('firebase-admin');

const database = admin.database();
const messaging = admin.messaging();

exports.sendFcm = functions.https.onCall(async (data, context) => {
  checkIfAuth(context);

  const { chatId, title, message } = data;

  const roomSnap = await database.ref(`/rooms/${chatId}`).once('value');
  if (!roomSnap.exists) {
    return false;
  }

  const roomData = roomSnap.val();

  checkIfAlowed(context, transformToArr(roomData.admins));
  const fcmUsers = transformToArr(roomData.fcmUsers);

  const userTokenPromises = fcmUsers.map(uid => getUserTokens(uid));
  const userTokenResult = await Promise.all(userTokenPromises);
  const token = userTokenResult.reduce(
    (accTokens, userTokens) => [...accTokens, ...userTokens],
    []
  );

  if (token.length === 0) {
    return false;
  }

  const fcmMsg = {
    notification: {
      title: `${title} (${roomData.name})`,
      body: message,
    },
    token,
  };

  const batchResponse = await messaging.sendMulticast(fcmMsg);
  const failedTokens = [];
  if (batchResponse.failureCount > 0) {
    batchResponse.responses.forEach((resp, idx) => {
      if (!resp.success) {
        failedTokens.push(token[idx]);
      }
    });
  }

  const removePromises = failedTokens.map(token =>
    database.ref(`/fcm_tokens/${token}`).remove()
  );
  return Promise.all(removePromises).catch(err => err.message);
});

async function getUserTokens(uid) {
  const usersTokenSnap = await database
    .ref('/fcm_tokens')
    .orderByValue()
    .equalTo(uid)
    .once('value');

  if (!usersTokenSnap.hasChildren()) {
    return [];
  }

  return Object.keys(usersTokenSnap.val());
}

function checkIfAuth(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Please Sign in.');
  }
}

function checkIfAlowed(context, chatAdmins) {
  if (!chatAdmins.includes(context.auth.uid)) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Restricted access.'
    );
  }
}

export function transformToArr(snapVal) {
  return snapVal ? Object.keys(snapVal) : [];
}
