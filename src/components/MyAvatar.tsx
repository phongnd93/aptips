// hooks
import useSuiAuth from 'src/hooks/useSuiAuth';
// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar, { Props as AvatarProps } from './Avatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }: AvatarProps)
{
  const { user, wallet } = useSuiAuth();

  return (
    <Avatar
      src={user?.photoURL | ''}
      alt={user?.userAddr || wallet?.address}
      color={user?.photoURL ? 'default' : createAvatar(user?.ephemeralPrivateKey || user?.userAddr || wallet?.label || '').color}
      {...other}
    >
      {createAvatar(user?.ephemeralPrivateKey || user?.userAddr || wallet?.label || '').name}
    </Avatar>
  );
}
