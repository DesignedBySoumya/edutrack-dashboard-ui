import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Completing sign in...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('loading');
        setMessage('Completing sign in...');

        // Handle the auth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth error:', error);
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          toast({
            title: "Authentication failed",
            description: error.message,
            variant: "destructive",
          });
          
          // Redirect to login after a delay
          setTimeout(() => {
            navigate('/login?error=auth_failed');
          }, 2000);
          return;
        }

        if (data.session) {
          // Success! Set login success flag and redirect to home
          setStatus('success');
          setMessage('Sign in successful! Redirecting...');
          
          localStorage.setItem('loginSuccess', 'true');
          
          toast({
            title: "Welcome back!",
            description: "Thank you for signing in. You're all set to continue your studies.",
          });
          
          // Redirect to home page
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 1500);
        } else {
          setStatus('error');
          setMessage('No session found. Please try signing in again.');
          
          setTimeout(() => {
            navigate('/login?error=no_session');
          }, 2000);
        }
      } catch (err) {
        console.error('Callback error:', err);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
        
        toast({
          title: "Authentication error",
          description: "An unexpected error occurred during sign in.",
          variant: "destructive",
        });
        
        setTimeout(() => {
          navigate('/login?error=callback_failed');
        }, 2000);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-[#070a14] flex flex-col items-center justify-center gap-6 p-6">
      <div className="flex w-full max-w-sm flex-col gap-6 items-center">
        <div className="text-center">
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <h2 className="text-xl font-semibold text-white">Completing sign in...</h2>
              <p className="text-gray-400">{message}</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
              <h2 className="text-xl font-semibold text-white">Sign in successful!</h2>
              <p className="text-gray-400">{message}</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <XCircle className="w-12 h-12 text-red-500" />
              <h2 className="text-xl font-semibold text-white">Authentication failed</h2>
              <p className="text-gray-400">{message}</p>
            </div>
          )}
        </div>
        
        {status === 'error' && (
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
} 