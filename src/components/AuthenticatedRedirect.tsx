import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from 'react';

interface AuthenticatedRedirectProps {
  children: React.ReactNode;
}

export function AuthenticatedRedirect({ children }: AuthenticatedRedirectProps) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (!isAuthenticated && !loading) {
    return <>{children}</>;
  }
  return null;
} 