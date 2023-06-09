import React, { useState, useEffect } from 'react';
import { Alert, Button, Icon, Tag } from 'rsuite';
import { auth } from '../../misc/firebase';
import firebase from 'firebase/compat/app';

const ProviderBlock = () => {
  const [isConnected, setIsConnected] = useState({
    'google.com': false,
    'facebook.com': false,
  });

  useEffect(() => {
    const providerData = auth.currentUser && auth.currentUser.providerData;
    if (providerData) {
      setIsConnected({
        'google.com': providerData.some(
          data => data.providerId === 'google.com'
        ),
        'facebook.com': providerData.some(
          data => data.providerId === 'facebook.com'
        ),
      });
    }
  }, [auth.currentUser]);

  const updateIsConnected = (providerId, value) => {
    setIsConnected(p => {
      return {
        ...p,
        [providerId]: value,
      };
    });
  };

  const unlink = async providerId => {
    try {
      if (auth.currentUser.providerData.length === 1) {
        throw new Error(`You can not disconnect from ${providerId}`);
      }

      await auth.currentUser.unlink(providerId);
      updateIsConnected(providerId, false);
      Alert.success(`Disconnected from ${providerId}`);
    } catch (error) {
      Alert.error(error.message, 4000);
    }
  };
  const unlinkFacebook = () => {
    unlink('facebook.com');
  };
  const unlinkGoogle = () => {
    unlink('google.com');
  };

  const link = async provider => {
    try {
      await auth.currentUser.linkWithPopup(provider);
      updateIsConnected(provider.providerId, true);
      Alert.info(`Linked to ${provider.providerId}`, 4000);
    } catch (error) {
      Alert.error(error.message, 4000);
    }
  };
  const linkFacebook = () => {
    link(new firebase.auth.FacebookAuthProvider());
  };
  const linkGoogle = () => {
    link(new firebase.auth.GoogleAuthProvider());
  };

  return (
    <div>
      {isConnected['google.com'] && (
        <Tag color="green" closable onClose={unlinkGoogle}>
          <Icon icon="google" /> Connected
        </Tag>
      )}
      {isConnected['facebook.com'] && (
        <Tag color="blue" closable onClose={unlinkFacebook}>
          <Icon icon="facebook" /> Connected
        </Tag>
      )}

      <div className="mt-2">
        {!isConnected['google.com'] && (
          <Button block color="green" onClick={linkGoogle}>
            <Icon icon={'google'} /> Link to Google
          </Button>
        )}
        {!isConnected['facebook.com'] && (
          <Button block color="blue" onClick={linkFacebook}>
            <Icon icon={'facebook'} /> Link to Facebook
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProviderBlock;
