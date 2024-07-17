import { ReactNode } from 'react';
// guards
import AuthGuard from '../guards/AuthGuard';
// components
import MainLayout from './main';
import DashboardLayout from './dashboard';
import LogoOnlyLayout from './LogoOnlyLayout';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
  variant?: 'main' | 'dashboard' | 'logoOnly';
};

export default function Layout({ variant = 'dashboard', children }: Props)
{
  if (variant === 'logoOnly')
  {
    return <LogoOnlyLayout> {children} </LogoOnlyLayout>;
  }

  // if (variant === 'main')
  // {
  //   return <AuthGuard><MainLayout>{children}</MainLayout></AuthGuard>;
  // }

  return (
    <AuthGuard>
      <MainLayout> {children} </MainLayout>
    </AuthGuard>
  );
}
