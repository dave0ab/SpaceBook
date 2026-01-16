'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const token = getAccessToken();

  // Wait for client-side mount to ensure pathname is available (important for static export)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't protect login pages
  const isLoginPage = pathname === '/user/login' || pathname === '/admin/login';

  useEffect(() => {
    // Wait for mount and skip protection on login pages
    if (!mounted || isLoginPage) return;

    // Wait for auth to finish loading before making redirect decisions
    if (isLoading) return;

    // If no token or user after loading is complete, redirect to login
    if (!token || !user) {
      router.push('/user/login');
      return;
    }

    // Only redirect if we're certain the user is not an admin (user exists but role is not admin)
    // Don't redirect if user is null or still loading
    if (requireAdmin && user && user.role !== 'admin') {
      router.push('/user/dashboard');
    }
  }, [mounted, isLoading, token, user, router, requireAdmin, isLoginPage]);

  // Don't show loading screen on login pages
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Wait for mount before checking auth (important for static export)
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
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

  // Check admin requirement - only block if user exists and is definitely not an admin
  if (requireAdmin && user && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

