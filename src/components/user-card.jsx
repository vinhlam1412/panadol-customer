import React from 'react';
import { Avatar, Box, Text } from 'zmp-ui';
import { useRecoilValue } from 'recoil';
import { userState } from '../state';

const UserCard = ({ showAvatar, fullName }) => {
  const user = useRecoilValue(userState); 

  return (
    <Box flex>
      {showAvatar && <Avatar
        className={"me-2"}
        story="default"
        online
        src={user.avatar.startsWith('http') ? userInfo.avatar : undefined}
      >
        {user.avatar}
      </Avatar>}
      <Box>
        <Text.Title className="text-gray-2 !font-bold">{fullName}</Text.Title>
      </Box>
    </Box>
  );
};

export default UserCard;
