import { useState, ReactNode, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// hooks
import Login from '../pages/auth/login';
// components
import LoadingScreen from '../components/LoadingScreen';
import Profile from 'src/pages/profile';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import useAptos from 'src/hooks/useAptos';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function AuthGuard({ children }: Props)
{
  const { account, connected, wallet, wallets } = useWallet();
  const { firstLogin, isInitialized, isAuthenticated } = useAptos();

  const { pathname, push } = useRouter();

  const [requestedLocation, setRequestedLocation] = useState<string | null>(firstLogin ? '/profile' : null);

  useEffect(() =>
  {
    if (requestedLocation && pathname !== requestedLocation)
    {
      setRequestedLocation(null);
      push(requestedLocation);
    }
  }, [pathname, push, requestedLocation]);
  if (!isInitialized)
  {
    return <LoadingScreen />;
  }

  if (!isAuthenticated)
  {
    if (pathname !== requestedLocation)
    {
      setRequestedLocation(pathname);
    }
    return <Login />;
  }
  if (firstLogin)
  {
    return <Profile />
  }

  return <>{children}</>;
}
