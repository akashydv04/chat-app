import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, database, messaging } from '../misc/firebase';
import firebase from 'firebase/compat/app';

export const isOfflineForDatabase = {
  state: 'offline',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const isOnlineForDatabase = {
  state: 'online',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let userRef;
    let userStatusRef;
    let tokenRefreshUnSub;
    const authUnSub = auth.onAuthStateChanged(async authObj => {
      if (authObj) {
        console.log('user id: ', authObj.uid);
        userStatusRef = database.ref(`/status/${authObj.uid}`);
        userRef = database.ref(`/profiles/${authObj.uid}`);
        userRef.on('value', snap => {
          if (snap) {
            const { name, createdAt, avatar } = snap.val();
            const data = {
              avatar,
              name,
              createdAt,
              uid: authObj.uid,
              email: authObj.email,
            };
            setProfile(data);
            setIsLoading(false);
          }
        });

        database.ref('.info/connected').on('value', snapshot => {
          // If we're not currently connected, don't do anything.
          if (!!snapshot.val() === false) {
            return;
          }
          userStatusRef
            .onDisconnect()
            .set(isOfflineForDatabase)
            .then(() => {
              userStatusRef.set(isOnlineForDatabase);
            });
        });

        if (messaging) {
          try {
            const currentToken = await messaging.getToken();
            if (currentToken) {
              await database.ref(`/fcm_token/${currentToken}`).set(authObj.uid);
            }
          } catch (error) {
            console.log(
              'An error occurred while retrieving token. ',
              error.message
            );
          }

          tokenRefreshUnSub = messaging.onTokenRefresh(async () => {
            try {
              const currentToken = await messaging.getToken();
              if (currentToken) {
                await database
                  .ref(`/fcm_token/${currentToken}`)
                  .set(authObj.uid);
              }
            } catch (error) {
              console.log(
                'An error occurred while retrieving token. ',
                error.message
              );
            }
          });
          // messaging
          //   .getToken(messaging, { vapidKey: '<YOUR_PUBLIC_VAPID_KEY_HERE>' })
          //   .then(currentToken => {
          //     if (currentToken) {
          //       // Send the token to your server and update the UI if necessary
          //       // ...
          //     } else {
          //       // Show permission request UI
          //       console.log(
          //         'No registration token available. Request permission to generate one.'
          //       );
          //       // ...
          //     }
          //   })
          //   .catch(err => {
          //     console.log('An error occurred while retrieving token. ', err);
          //   });
        }
      } else {
        if (userRef) {
          userRef.off();
        }

        if (userStatusRef) {
          userStatusRef.off();
        }

        if (tokenRefreshUnSub) {
          tokenRefreshUnSub();
        }
        database.ref('.info/connected').off();
        setProfile(null);
        setIsLoading(false);
      }
    });
    return () => {
      authUnSub();
      if (userRef) {
        userRef.off();
      }

      if (userStatusRef) {
        userStatusRef.off();
      }
      if (tokenRefreshUnSub) {
        tokenRefreshUnSub();
      }
      database.ref('.info/connected').off();
    };
  }, []);
  return (
    <ProfileContext.Provider value={{ isLoading, profile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
