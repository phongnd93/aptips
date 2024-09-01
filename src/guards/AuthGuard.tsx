import { useState, ReactNode, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// hooks
import Login from '../pages/auth/login';
// components
import LoadingScreen from '../components/LoadingScreen';
import Profile from 'src/pages/profile';
import useChainAuth from 'src/hooks/useChainAuth';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function AuthGuard({ children }: Props)
{
  const { firstLogin, isInitialized, isAuthenticated } = useChainAuth();

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
