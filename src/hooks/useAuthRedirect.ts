import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UseAuthRedirectOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  redirectIfAuthenticated?: boolean;
}

export function useAuthRedirect({
  redirectTo = '/',
  requireAuth = false,
  redirectIfAuthenticated = false
}: UseAuthRedirectOptions = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (loading) return;

    // If authentication is required and user is not authenticated
    if (requireAuth && !isAuthenticated) {
      const from = location.pathname;
      navigate('/login', { 
        state: { from: { pathname: from } },
        replace: true 
      });
      return;
    }

    // If user is authenticated but shouldn't be on this page (e.g., login/signup)
    if (redirectIfAuthenticated && isAuthenticated) {
      navigate(redirectTo, { replace: true });
      return;
    }
  }, [isAuthenticated, loading, requireAuth, redirectIfAuthenticated, navigate, location, redirectTo]);

  const handleLoginSuccess = (intendedDestination?: string) => {
    const from = intendedDestination || location.state?.from?.pathname || redirectTo;
    
    // Set login success flag if redirecting to index page
    if (from === '/' || from === '/index') {
      localStorage.setItem('loginSuccess', 'true');
    }
    
    navigate(from, { replace: true });
    toast({
      title: "Login successful!",
      description: "Welcome back to your study dashboard.",
    });
  };

  const handleSignOut = async (signOutFn: () => Promise<void>) => {
    try {
      await signOutFn();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    isAuthenticated,
    loading,
    handleLoginSuccess,
    handleSignOut,
  };
} 