import React from 'react';
import { Avatar } from 'rsuite';
import { getNameInitials } from '../misc/helpers';

const ProfileAvatar = ({ name, ...avatarProps }) => {
  return (
    <Avatar
      circle
      {...avatarProps}
      className="width-200 height-200 img-fullsize font-huge"
    >
      {getNameInitials(name)}
    </Avatar>
  );
};

export default ProfileAvatar;
