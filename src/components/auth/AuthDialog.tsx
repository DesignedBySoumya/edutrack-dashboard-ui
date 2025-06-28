
'use client';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Chrome, Apple, Twitter } from 'lucide-react';

interface AuthDialogProps {
  openFromSettings?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface SignInFormData {
  email: string;
  password: string;
}

interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
}

export function AuthDialog({ openFromSettings = false, onOpenChange }: AuthDialogProps) {
  const [open, setOpen] = useState(openFromSettings);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const signInForm = useForm<SignInFormData>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const signUpForm = useForm<SignUpFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      password: ''
    }
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleSignIn = async (data: SignInFormData) => {
    setIsLoading(true);
    console.log('Sign in attempt:', data);
    // TODO: Implement actual sign in logic
    setTimeout(() => {
      setIsLoading(false);
      handleOpenChange(false);
    }, 1000);
  };

  const handleSignUp = async (data: SignUpFormData) => {
    setIsLoading(true);
    console.log('Sign up attempt:', data);
    // TODO: Implement actual sign up logic
    setTimeout(() => {
      setIsLoading(false);
      handleOpenChange(false);
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign in clicked');
    // TODO: Implement Google OAuth
  };

  const handleAppleSignIn = () => {
    console.log('Apple sign in clicked');
    // TODO: Implement Apple OAuth
  };

  const handleTwitterSignIn = () => {
    console.log('Twitter sign in clicked');
    // TODO: Implement Twitter OAuth
  };

  const handleGuestLogin = () => {
    console.log('Guest login clicked');
    // Generate a temporary guest ID and store in localStorage
    const guestId = `guest_${Date.now()}`;
    localStorage.setItem('guestUserId', guestId);
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="backdrop-blur-xl bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 border border-slate-700/50 max-w-md p-0 gap-0 rounded-2xl shadow-2xl">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isSignUp ? 'Create Account' : 'Welcome back'}
            </h2>
            <p className="text-slate-400 text-sm">
              {isSignUp ? 'Join thousands of successful candidates' : 'Sign in to continue your journey'}
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              className="w-full h-12 bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-white flex items-center justify-center gap-3"
              onClick={handleGoogleSignIn}
            >
              <Chrome className="w-5 h-5" />
              Continue with Google
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-12 bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-white flex items-center justify-center gap-2"
                onClick={handleAppleSignIn}
              >
                <Apple className="w-5 h-5" />
                Apple
              </Button>
              <Button
                variant="outline"
                className="h-12 bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-white flex items-center justify-center gap-2"
                onClick={handleTwitterSignIn}
              >
                <Twitter className="w-5 h-5" />
                Twitter
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 text-slate-400">
                or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          {isSignUp ? (
            <Form {...signUpForm}>
              <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                <FormField
                  control={signUpForm.control}
                  name="fullName"
                  rules={{ required: "Full name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-sm font-medium">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          className="h-12 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-lg" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpForm.control}
                  name="email"
                  rules={{ required: "Email is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-sm font-medium">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="Enter your email" 
                          className="h-12 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-lg" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signUpForm.control}
                  name="password"
                  rules={{ required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-sm font-medium">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Create a password" 
                          className="h-12 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-lg" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...signInForm}>
              <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                <FormField
                  control={signInForm.control}
                  name="email"
                  rules={{ required: "Email is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-sm font-medium">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your email" 
                          className="h-12 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-lg" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signInForm.control}
                  name="password"
                  rules={{ required: "Password is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-sm font-medium">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter your password" 
                          className="h-12 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-lg" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <button 
                    type="button"
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </Form>
          )}

          {/* Guest Login */}
          <Button 
            variant="ghost" 
            className="w-full mt-4 text-slate-400 hover:text-white hover:bg-slate-800/50 h-12"
            onClick={handleGuestLogin}
          >
            Continue as Guest
          </Button>

          {/* Toggle Sign Up / Sign In */}
          <div className="text-center mt-6">
            <p className="text-slate-400 text-sm">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
