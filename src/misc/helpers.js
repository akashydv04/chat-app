export function getNameInitials(name) {
  const splitName = name.toUpperCase().split(' ');
  if (splitName.length > 1) {
    return splitName[0][0] + splitName[1][0];
  }
  return splitName[0][0];
}

export function transformToArr(snapVal) {
  return snapVal ? Object.keys(snapVal) : [];
}

export function transformToArrWithId(snapVal) {
  return snapVal
    ? Object.keys(snapVal).map(roomId => {
        return {
          ...snapVal[roomId],
          id: roomId,
        };
      })
    : [];
}

export async function getUserUpdate(userId, keytoUpdate, value, db) {
  const updates = {};

  updates[`/profiles/${userId}/${keytoUpdate}`] = value;
  const getMessages = db
    .ref('/messages')
    .orderByChild('author/uid')
    .equalTo(userId)
    .once('value');
  const getRooms = db
    .ref('/rooms')
    .orderByChild('lastMessage/author/uid')
    .equalTo(userId)
    .once('value');
  console.log('rooms', getRooms);
  console.log('messages', getMessages);

  const [msgSnap, roomSnap] = await Promise.all([getMessages, getRooms]);

  msgSnap.forEach(messagegSnaps => {
    updates[`/messages/${messagegSnaps.key}/author/${keytoUpdate}`] = value;
  });

  roomSnap.forEach(roomSnaps => {
    updates[`/rooms/${roomSnaps.key}/lastMessage/author/${keytoUpdate}`] =
      value;
  });

  return updates;
}

export function groupBy(array, groupingKeyFn) {
  return array.reduce((result, item) => {
    const groupingKey = groupingKeyFn(item);
    if (!result[groupingKey]) {
      result[groupingKey] = [];
    }

    result[groupingKey].push(item);

    return result;
  }, {});
}

// eslint-disable-next-line no-unused-vars
const isLocalHost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);
