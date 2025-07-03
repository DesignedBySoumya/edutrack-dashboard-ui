import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

interface UseAuthRedirectOptions {
  redirectIfAuthenticated?: boolean;
}

export function useAuthRedirect(options: UseAuthRedirectOptions = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { redirectIfAuthenticated = false } = options;

  useEffect(() => {
    if (redirectIfAuthenticated) {
      const isAuthenticated = localStorage.getItem('loginSuccess') === 'true';
      if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/signup')) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [redirectIfAuthenticated, location.pathname, navigate]);

  const handleLoginSuccess = (intendedDestination?: string) => {
    const from = intendedDestination || location.state?.from?.pathname || '/';
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
    handleLoginSuccess,
    handleSignOut,
  };
} 