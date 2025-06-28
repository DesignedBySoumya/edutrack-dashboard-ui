import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

export function AuthStatusIndicator() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Badge variant="secondary">Loading...</Badge>;
  }

  if (isAuthenticated && user) {
    return (
      <Badge variant="default" className="bg-green-500">
        ✓ {user.email}
      </Badge>
    );
  }

  return <Badge variant="destructive">Not authenticated</Badge>;
} 