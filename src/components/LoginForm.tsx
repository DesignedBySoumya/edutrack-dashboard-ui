import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLoginSuccess } = useAuthRedirect({ redirectIfAuthenticated: true });
  const { toast } = useToast();
  const { user, isAuthenticated, signIn, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('loginSuccess') === 'true');

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      toast({
        title: "Already signed in",
        description: `You are already signed in as ${user.email}`,
      });
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent double submission
    setIsLoading(true);
    try {
      const result = await signIn(formData.email, formData.password);
      if (result.success) {
        sessionStorage.setItem('welcomeShown', 'true');
        handleLoginSuccess('/');
        toast({
          title: "Login successful!",
          description: "Welcome back!",
        });
      } else {
        setErrors({ general: "Invalid email or password." });
      }
    } catch (error: any) {
      setErrors({ general: "Login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = () => {
    // TODO: Implement Apple login
    console.log("Apple login clicked");
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setErrors((prev) => ({ ...prev, general: error.message || "Google login failed." }));
      }
    } catch (error: any) {
      setErrors((prev) => ({ ...prev, general: error.message || "Google login failed." }));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full"
                  onClick={handleAppleLogin}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Apple
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                >
                  <span className="mr-2 flex items-center">
                    {/* Google SVG */}
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <g>
                        <path d="M17.64 9.2045C17.64 8.5665 17.5827 7.95225 17.4764 7.3635H9V10.845H13.8436C13.635 11.97 12.9645 12.915 11.9673 13.5645V15.5545H14.655C16.185 14.145 17.64 11.9273 17.64 9.2045Z" fill="#4285F4"/>
                        <path d="M9 18C11.43 18 13.4673 17.2275 14.655 15.5545L11.9673 13.5645C11.3223 14.0045 10.4823 14.2725 9 14.2725C6.6555 14.2725 4.6785 12.5445 3.9645 10.395H1.179V12.4515C2.3625 15.0105 5.418 18 9 18Z" fill="#34A853"/>
                        <path d="M3.9645 10.395C3.7845 9.9555 3.681 9.4785 3.681 9C3.681 8.5215 3.7845 8.0445 3.9645 7.605V5.5485H1.179C0.627 6.66075 0.318 7.791 0.318 9C0.318 10.209 0.627 11.3393 1.179 12.4515L3.9645 10.395Z" fill="#FBBC05"/>
                        <path d="M9 3.7275C10.305 3.7275 11.355 4.179 12.1275 4.8975L14.715 2.31C13.464 1.119 11.43 0 9 0C5.418 0 2.3625 2.9895 1.179 5.5485L3.9645 7.605C4.6785 5.4555 6.6555 3.7275 9 3.7275Z" fill="#EA4335"/>
                      </g>
                    </svg>
                  </span>
                  {isGoogleLoading ? "Connecting to Google..." : "Login with Google"}
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    name="password"
                    type="password" 
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
                {errors.general && (
                  <p className="text-sm text-red-500 text-center">{errors.general}</p>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
