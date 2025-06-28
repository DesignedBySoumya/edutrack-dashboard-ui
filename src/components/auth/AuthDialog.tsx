
'use client';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Chrome } from 'lucide-react';

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

  useEffect(() => {
    if (!openFromSettings) {
      const timer = setTimeout(() => setOpen(true), 20000); // open after 20s
      return () => clearTimeout(timer);
    }
  }, [openFromSettings]);

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

  const handleGuestLogin = () => {
    console.log('Guest login clicked');
    // Generate a temporary guest ID and store in localStorage
    const guestId = `guest_${Date.now()}`;
    localStorage.setItem('guestUserId', guestId);
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="backdrop-blur-md bg-[#0b1729]/90 border-none max-w-md">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid grid-cols-2 bg-[#112f4a] rounded-xl mb-4 w-full">
            <TabsTrigger value="signin" className="text-white data-[state=active]:bg-blue-600">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="text-white data-[state=active]:bg-blue-600">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card className="bg-[#12263f] text-white shadow-xl border-slate-700">
              <CardContent className="p-6">
                <Form {...signInForm}>
                  <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                    <FormField
                      control={signInForm.control}
                      name="email"
                      rules={{ required: "Email is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your email" 
                              className="bg-[#0e1f34] text-white border-slate-600 focus:border-blue-500" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signInForm.control}
                      name="password"
                      rules={{ required: "Password is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter your password" 
                              className="bg-[#0e1f34] text-white border-slate-600 focus:border-blue-500" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </form>
                </Form>
                
                <div className="mt-4 space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full text-white border-slate-600 hover:bg-slate-700"
                    onClick={handleGoogleSignIn}
                  >
                    <Chrome className="w-4 h-4 mr-2" />
                    Sign in with Google
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full text-sm text-slate-400 hover:text-white hover:bg-slate-800"
                    onClick={handleGuestLogin}
                  >
                    Continue as Guest
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="bg-[#12263f] text-white shadow-xl border-slate-700">
              <CardContent className="p-6">
                <Form {...signUpForm}>
                  <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                    <FormField
                      control={signUpForm.control}
                      name="fullName"
                      rules={{ required: "Full name is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your full name" 
                              className="bg-[#0e1f34] text-white border-slate-600 focus:border-blue-500" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="email"
                      rules={{ required: "Email is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="Enter your email" 
                              className="bg-[#0e1f34] text-white border-slate-600 focus:border-blue-500" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="password"
                      rules={{ required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Create a password" 
                              className="bg-[#0e1f34] text-white border-slate-600 focus:border-blue-500" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
