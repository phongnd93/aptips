import { ReactNode, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// routes
import useAptos from 'src/hooks/useAptos';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function GuestGuard({ children }: Props)
{
  const { push } = useRouter();

  const { isAuthenticated } = useAptos();

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
