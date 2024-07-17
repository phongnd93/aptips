import { useState, ReactNode, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// hooks
import Login from '../pages/auth/login';
// components
import LoadingScreen from '../components/LoadingScreen';
import useSuiAuth from 'src/hooks/useSuiAuth';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function AuthGuard({ children }: Props)
{
  const { isAuthenticated, isInitialized } = useSuiAuth();

  const { pathname, push } = useRouter();

  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  useEffect(() =>
  {
    if (requestedLocation && pathname !== requestedLocation)
    {
      setRequestedLocation(null);
      push(requestedLocation);
    }
  }, [pathname, push, requestedLocation]);
  console.log(isAuthenticated, isInitialized);
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

  return <>{children}</>;
}
