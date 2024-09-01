import { ReactNode, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
import useChainAuth from 'src/hooks/useChainAuth';
// routes

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function GuestGuard({ children }: Props)
{
  const { push } = useRouter();

  const { isAuthenticated } = useChainAuth();

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
