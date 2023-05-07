import React from 'react';
import { Alert, Button, Modal } from 'rsuite';
import { useModelState } from '../../misc/custom-hook';
import { useState, useRef } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { database, storage } from '../../misc/firebase';
import { useProfile } from '../../context/profile.context';
import ProfileAvatar from '../ProfileAvatar';
import { getUserUpdate } from '../../misc/helpers';

const inputFileType = '.png, .jpeg, .jpg';

const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/jpg'];

const isValidFile = file => acceptedFileTypes.includes(file.type);

const getBlob = canvas => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('File process error'));
      }
    });
  });
};

const AvatarUploadBtn = () => {
  const { isOpen, open, close } = useModelState();
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();
  const avatarEditorRef = useRef();

  const onFileInputChange = ev => {
    const currFiles = ev.target.files;
    if (currFiles.length === 1) {
      const file = currFiles[0];
      if (isValidFile(file)) {
        setImage(file);

        open();
      } else {
        Alert.warning(`Wrong File type ${file.type}`, 4000);
      }
    }
  };

  const onUploadClick = async () => {
    const canvas = avatarEditorRef.current.getImageScaledToCanvas();
    setIsLoading(true);
    try {
      const blob = await getBlob(canvas);
      const avatarFileRef = storage
        .ref(`/profile/${profile.uid}`)
        .child('avatar');
      const uploadAvatarResult = await avatarFileRef.put(blob, {
        cacheControl: `public, max-age=${3600 * 24 * 3}`,
      });
      const downloadUrl = await uploadAvatarResult.ref.getDownloadURL();

      const updates = await getUserUpdate(
        profile.uid,
        'avatar',
        downloadUrl,
        database
      );
      await database.ref().update(updates);

      // const useAvatarRef = database
      //   .ref(`/profiles/${profile.uid}`)
      //   .child('avatar');
      // useAvatarRef.set(downloadUrl);
      setIsLoading(false);
      Alert.info('Avatar has been uploaded', 4000);
      close();
    } catch (error) {
      setIsLoading(false);
      Alert.error(error.message, 4000);
    }
  };

  return (
    <div className="mt-3 text-center">
      <ProfileAvatar scale={'200'} src={profile.avatar} name={profile.name} />

      <div>
        <label
          htmlFor="avatar-upload"
          className="d-block cursor-pointer padded"
        >
          Select new avatar
          <input
            id="avatar-upload"
            type="file"
            className="d-none"
            accept={inputFileType}
            onChange={onFileInputChange}
          />
        </label>
        <Modal show={isOpen} onHide={close}>
          <Modal.Header>
            <Modal.Title>Adjust and Upload New Avatar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-center align-items-center h-100">
              {image && (
                <AvatarEditor
                  ref={avatarEditorRef}
                  image={image}
                  width={200}
                  height={200}
                  border={10}
                  scale={1.2}
                  rotate={0}
                  borderRadius={100}
                  color={[255, 255, 255, 0.6]}
                />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              block
              appearance="ghost"
              onClick={onUploadClick}
              disabled={isLoading}
            >
              Upload New Avatar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarUploadBtn;
