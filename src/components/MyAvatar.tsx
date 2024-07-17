// hooks
import useSuiAuth from 'src/hooks/useSuiAuth';
// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar, { Props as AvatarProps } from './Avatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }: AvatarProps)
{
  const { user } = useSuiAuth();

  return (
    <Avatar
      src={user?.photoURL | ''}
      alt={user?.userAddr}
      color={user?.photoURL ? 'default' : createAvatar(user?.ephemeralPrivateKey || user?.userAddr || '').color}
      {...other}
    >
      {createAvatar(user?.ephemeralPrivateKey || user?.userAddr || '').name}
    </Avatar>
  );
}
