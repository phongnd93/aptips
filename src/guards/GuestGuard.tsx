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

  const { isAuthenticated } = useSuiAuth();

  useEffect(() =>
  {
    if (isAuthenticated)
    {
      push('/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return <>{children}</>;
}
