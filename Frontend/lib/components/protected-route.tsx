'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../providers/auth-provider';
import { getAccessToken } from '../api-client';

export function ProtectedRoute({ 
  children, 
  requireAdmin = false 
}: { 
  children: React.ReactNode;
  requireAdmin?: boolean;
}) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const token = getAccessToken();

  // Don't protect login pages
  const isLoginPage = pathname === '/user/login' || pathname === '/admin/login';

  useEffect(() => {
    // Skip protection on login pages
    if (isLoginPage) return;

    if (!isLoading && (!token || !user)) {
      window.location.href = '/user/login';
    } else if (!isLoading && requireAdmin && user?.role !== 'admin') {
      window.location.href = '/user/dashboard';
    }
  }, [isLoading, token, user, requireAdmin, isLoginPage]);

  // Don't show loading screen on login pages
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated (already handled in useEffect, but show loading while redirecting)
  if (!token || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Check admin requirement
  if (requireAdmin && user.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}

