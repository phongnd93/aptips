// hooks
// utils
import useChainAuth from 'src/hooks/useChainAuth';
import createAvatar from '../utils/createAvatar';
//
import Avatar, { Props as AvatarProps } from './Avatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }: AvatarProps)
{
  const { user, wallet, info } = useChainAuth();

  return (
    <Avatar
      src={info?.avatarUrl || ''}
      alt={info?.fullName || info?.walletAddress}
      color={info?.avatarUrl ? 'default' : createAvatar(info?.fullName || info?.walletAddress || info?.email || '').color}
      {...other}
    >
      {createAvatar(info?.fullName || info?.walletAddress || info?.email || '').name}
    </Avatar>
  );
}
