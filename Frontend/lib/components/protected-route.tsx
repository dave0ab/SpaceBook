'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../providers/auth-provider';
import { getAccessToken, clearTokens } from '../api-client';

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
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const token = getAccessToken();

  // Function to decode token and get role
  const getTokenRole = (): string | null => {
    try {
      if (!token) return null;
      
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(atob(parts[1]));
      return payload.role || null;
    } catch {
      return null;
    }
  };

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

    // Prevent multiple redirect attempts
    if (hasCheckedAuth) return;

    // Validate token role matches required route
    const tokenRole = getTokenRole();
    
    if (requireAdmin) {
      // If admin route, token must have admin role
      if (tokenRole !== 'admin') {
        setHasCheckedAuth(true);
        clearTokens(); // Clear invalid token
        router.push('/admin/login');
        return;
      }
    } else {
      // If user route, reject admin tokens (admin should use admin routes)
      if (tokenRole === 'admin') {
        setHasCheckedAuth(true);
        clearTokens(); // Clear admin token
        router.push('/admin/login');
        return;
      }
    }

    // If no token or user after loading is complete, redirect to login
    if (!token || !user) {
      setHasCheckedAuth(true);
      router.push(requireAdmin ? '/admin/login' : '/user/login');
      return;
    }

    // Only redirect if we're certain the user is not an admin
    // Check that user.role exists and is explicitly not 'admin'
    if (requireAdmin && user && user.role && user.role !== 'admin') {
      setHasCheckedAuth(true);
      router.push('/user/dashboard');
      return;
    }
    
    // If user route but user is admin, redirect to admin dashboard
    if (!requireAdmin && user && user.role === 'admin') {
      setHasCheckedAuth(true);
      router.push('/admin/dashboard');
      return;
    }

    // If we get here and requireAdmin is true, user must be admin - allow access
    // Mark as checked to prevent re-checking
    if (requireAdmin && user && user.role === 'admin') {
      setHasCheckedAuth(true);
    } else if (!requireAdmin) {
      setHasCheckedAuth(true);
    }
  }, [mounted, isLoading, token, user, router, requireAdmin, isLoginPage, hasCheckedAuth]);

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
  // Add explicit check for user.role existence
  if (requireAdmin && user && user.role && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  // If requireAdmin is true but user.role is undefined or not set, wait a bit more
  // This handles the case where JWT decoding might be delayed or role is missing
  if (requireAdmin && user && !user.role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

