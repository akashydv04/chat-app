import React from 'react';
import { Button, Modal } from 'rsuite';
import { useModelState } from '../../../misc/custom-hook';
import ProfileAvatar from '../../ProfileAvatar';

const ProfileInfoBtnModal = ({ profile, children, ...btnProps }) => {
  const { isOpen, open, close } = useModelState();
  const firstName = profile.name.split(' ')[0];
  const { name, avatar, createdAt } = profile;
  const memberSince = new Date(createdAt).toLocaleDateString();
  return (
    <>
      <Button {...btnProps} onClick={open}>
        {firstName}
      </Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>{firstName} Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <ProfileAvatar scale={'200'} src={avatar} name={name} />
          <h4 className="mt-2">{name}</h4>
          <p>Member Since: {memberSince}</p>
        </Modal.Body>
        <Modal.Footer>
          {children}
          <Button block onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileInfoBtnModal;
