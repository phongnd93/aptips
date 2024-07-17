import { ReactNode } from 'react';
// guards
import AuthGuard from '../guards/AuthGuard';
// components
import MainLayout from './main';
import DashboardLayout from './dashboard';
import LogoOnlyLayout from './LogoOnlyLayout';
import LandingPageLayout from './LandingPageLayout';

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
  variant?: 'main' | 'dashboard' | 'logoOnly' | 'landingPage';
};

export default function Layout({ variant = 'dashboard', children }: Props)
{
  if (variant === 'logoOnly')
  {
    return <LogoOnlyLayout> {children} </LogoOnlyLayout>;
  }

  if (variant === 'landingPage')
  {
    return <LandingPageLayout>{children}</LandingPageLayout>
  }

  // if (variant === 'main')
  // {
  //   return <AuthGuard><MainLayout>{children}</MainLayout></AuthGuard>;
  // }

  return (
    <AuthGuard><MainLayout> {children} </MainLayout></AuthGuard>
  );
}