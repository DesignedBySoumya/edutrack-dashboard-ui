import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, CheckCircle } from 'lucide-react';

interface AuthenticatedRedirectProps {
  children: React.ReactNode;
}

export function AuthenticatedRedirect({ children }: AuthenticatedRedirectProps) {
  const { isAuthenticated, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      toast({
        title: "Already signed in",
        description: `You are already authenticated. Redirecting to home in ${countdown} seconds...`,
      });

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/', { replace: true });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isAuthenticated, loading, navigate, toast, countdown]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="bg-[#070a14] flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 shadow-2xl">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <CardTitle className="text-xl">Already Signed In</CardTitle>
              <CardDescription>
                You are already authenticated and will be redirected to the home page in {countdown} seconds.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                If you want to use a different account, you can sign out first.
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate('/', { replace: true })}
                >
                  Go to Home
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={async () => {
                    await signOut();
                    toast({
                      title: "Signed out",
                      description: "You have been signed out successfully.",
                    });
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 