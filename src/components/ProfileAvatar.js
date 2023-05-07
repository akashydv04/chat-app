import React from 'react';
import { Avatar } from 'rsuite';
import { getNameInitials } from '../misc/helpers';

const ProfileAvatar = ({ scale, name, ...avatarProps }) => {
  return (
    <Avatar
      circle
      {...avatarProps}
      className={`width-${scale} height-${scale} img-fullsize font-huge`}
    >
      {getNameInitials(name)}
    </Avatar>
  );
};

export default ProfileAvatar;
