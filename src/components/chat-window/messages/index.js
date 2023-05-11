import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import { auth, database, storage } from '../../../misc/firebase';
import { groupBy, transformToArrWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';
import { Alert, Button } from 'rsuite';
import { useRef } from 'react';

const PAGE_SIZE = 15;
const messageRef = database.ref('/messages');
function shouldScrolltoBottom(node, threshold = 30) {
  const percentage =
    (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0;
  return percentage > threshold;
}

const Messages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const selfRef = useRef();

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  const loadMessages = useCallback(
    limitToLast => {
      const node = selfRef.current;
      messageRef.off();

      messageRef
        .orderByChild('roomId')
        .equalTo(chatId)
        .limitToLast(limitToLast || PAGE_SIZE)
        .on('value', snap => {
          const data = transformToArrWithId(snap.val());
          setMessages(data);
          if (shouldScrolltoBottom(node)) {
            node.scrollTop = node.scrollHeight;
          }
        });
      setLimit(p => p + PAGE_SIZE);
    },
    [chatId]
  );

  const onLoadMore = useCallback(() => {
    const node = selfRef.current;
    const oldHeight = node.scrollHeight;
    setTimeout(() => {
      const newheight = node.scrollHeight;
      node.scrollTop = newheight - oldHeight;
    }, 400);
    loadMessages(limit);
  }, [loadMessages, limit]);

  useEffect(() => {
    const node = selfRef.current;
    loadMessages();
    setTimeout(() => {
      node.scrollTop = node.scrollHeight;
    }, 400);

    return () => {
      messageRef.off('value');
    };
  }, [loadMessages]);

  const handleLike = useCallback(async msgId => {
    const uid = auth.currentUser.uid;
    const messageRef = database.ref(`/messages/${msgId}`);
    let alertMsg;
    await messageRef.transaction(msg => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.likeCount -= 1;
          msg.likes[uid] = null;
          alertMsg = 'Like removed';
        } else {
          msg.likeCount += 1;
          if (!msg.likes) {
            msg.likes = {};
          }
          msg.likes[uid] = true;
          alertMsg = 'Like added';
        }
      }
      return msg;
    });
    Alert.info(alertMsg, 4000);
  }, []);

  const handleDelete = useCallback(
    async (msgId, file) => {
      if (!window.confirm('Delete this message?')) {
        return;
      }

      const isLast = messages[messages.length - 1].id === msgId;

      const updates = {};
      updates[`/messages/${msgId}`] = null;

      if (isLast && messages.length > 1) {
        updates[`/rooms/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2],
          msgId: messages[messages.length - 2].id,
        };
      }

      if (isLast && messages.length === 1) {
        updates[`/rooms/${chatId}/lastMessage`] = null;
      }

      try {
        await database.ref().update(updates);
        Alert.info('Message has been deleted', 4000);
      } catch (error) {
        return Alert.error(error.message, 4000);
      }

      if (file) {
        try {
          const fileRef = storage.refFromURL(file.url);
          await fileRef.delete();
        } catch (error) {
          Alert.error(error.message, 4000);
        }
      }
    },
    [chatId, messages]
  );

  const handleAdmin = useCallback(
    async uid => {
      const adminsRef = database.ref(`/rooms/${chatId}/admins`);
      let alertMsg;
      await adminsRef.transaction(admins => {
        if (admins) {
          if (admins[uid]) {
            admins[uid] = null;
            alertMsg = 'Admin permission removed';
          } else {
            admins[uid] = true;
            alertMsg = 'Admin permission granted';
          }
        }
        return admins;
      });
      Alert.info(alertMsg, 4000);
    },
    [chatId]
  );

  const renderMessages = () => {
    const group = groupBy(messages, item =>
      new Date(item.createdAt).toDateString()
    );
    console.log(group);

    const items = [];
    Object.keys(group).forEach(date => {
      items.push(
        <li key={date} className="text-center mb-1 padded">
          {date}
        </li>
      );
      const msgs = group[date].map(msg => (
        <MessageItem
          key={msg.id}
          message={msg}
          handleAdmin={handleAdmin}
          handleLike={handleLike}
          handleDelete={handleDelete}
        />
      ));
      items.push(...msgs);
      items.concat(msgs);
    });
    return items;
  };

  return (
    <ul ref={selfRef} className="msg-list custom-scroll">
      {messages && messages.length >= PAGE_SIZE && (
        <li className="text-center mt-2 mb-2">
          <Button onClick={onLoadMore} color="green">
            Load More
          </Button>
        </li>
      )}
      {isChatEmpty && <li>No message yet</li>}
      {canShowMessages && renderMessages()}
    </ul>
  );
};

export default Messages;
