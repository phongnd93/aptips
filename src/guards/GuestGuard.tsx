import { ReactNode, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// routes
import useSuiAuth from 'src/hooks/useSuiAuth';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function GuestGuard({ children }: Props)
{
  const { push } = useRouter();

  const { isAuthenticated, firstLogin } = useSuiAuth();

  useEffect(() =>
  {
    if (isAuthenticated)
    {
      console.log('First login', firstLogin);
      !firstLogin ? push('/dashboard') : push('/profile');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, firstLogin]);

  return <>{children}</>;
}
