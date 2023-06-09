import React from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { Alert, Icon, Input, InputGroup } from 'rsuite';
import firebase from 'firebase/compat/app';
import { useParams } from 'react-router';
import { useProfile } from '../../../context/profile.context';
import { database } from '../../../misc/firebase';
import AttachmentBtnModal from './AttachmentBtnModal';
import AudioMsgBtn from './AudioMsgBtn';

function assembleMessages(profile, chatId) {
  return {
    roomId: chatId,
    author: {
      name: profile.name,
      uid: profile.uid,
      createdAt: profile.createdAt,
      ...(profile.avatar ? { avatar: profile.avatar } : {}),
    },
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    likeCount: 0,
  };
}

const Bottom = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();
  const { chatId } = useParams();

  const onInputChange = useCallback(value => {
    setInput(value);
  }, []);

  const onSendClick = async () => {
    if (input.trim() === '') {
      return;
    }

    setIsLoading(true);
    const messageData = assembleMessages(profile, chatId);
    messageData.text = input;

    const updates = {};

    const messageId = database.ref('messages').push().key;
    updates[`/messages/${messageId}`] = messageData;
    updates[`/rooms/${chatId}/lastMessage`] = {
      ...messageData,
      msgId: messageId,
    };

    try {
      await database.ref().update(updates);
      setInput('');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Alert.error('Something went wrong', 4000);
    }
  };

  const onKeyDown = ev => {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      onSendClick();
    }
  };

  const afterUpload = useCallback(
    async files => {
      setIsLoading(true);
      const updates = {};

      files.forEach(file => {
        const messageData = assembleMessages(profile, chatId);
        messageData.file = file;
        const messageId = database.ref('messages').push().key;
        updates[`/messages/${messageId}`] = messageData;
      });

      const lastMessageId = Object.keys(updates).pop();
      updates[`/rooms/${chatId}/lastMessage`] = {
        ...updates[lastMessageId],
        msgId: lastMessageId,
      };

      try {
        await database.ref().update(updates);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        Alert.error('Something went wrong', 4000);
      }
    },
    [chatId, profile]
  );

  return (
    <div>
      <InputGroup>
        <AttachmentBtnModal afterUpload={afterUpload} />
        <AudioMsgBtn afterUpload={afterUpload} />
        <Input
          placeholder="Write a new message...."
          value={input}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
        />
        <InputGroup.Button
          color="blue"
          appearance="primary"
          onClick={onSendClick}
          disabled={isLoading}
        >
          <Icon icon="send" />
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
};

export default Bottom;
