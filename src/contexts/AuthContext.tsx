import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextType {
  session: any;
  user: any;
  loading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: any }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Robust sign up (handles email confirmation and always inserts profile)
  const signUp = async (email: string, password: string, name?: string) => {
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
    });

    if (signUpError) {
      console.error("Supabase signUp error:", signUpError);
      return { success: false, error: signUpError };
    }

    // Handle both immediate and email-confirmation flows
    const userId = data.user?.id || data.session?.user?.id;
    if (!userId || !name) {
      console.error("User ID or name missing after signUp", { userId, name });
      return { success: false, error: { message: "User or name missing." } };
    }

    // Insert into profiles table with new schema: id, name, email
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: userId, name, email: email.toLowerCase() }]);

    if (profileError) {
      console.error("Supabase profile insert error:", profileError);
      return { success: false, error: profileError };
    }

    return { success: true };
  };

  // Sign in
  const signIn = async (email: string, password: string) => {
    const trimmedEmail = email.toLowerCase().trim();
    const trimmedPassword = password.trim();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: trimmedPassword,
    });
    if (error) {
      console.error("Login error:", error.message);
      return { success: false, error: error.message };
    }
    console.log("Login successful:", data);
    return { success: true };
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    localStorage.removeItem('loginSuccess');
    localStorage.removeItem('userEmail');
    sessionStorage.removeItem('welcomeShown');
    if (error) {
      console.error("Error signing out:", error.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      // Sync localStorage with actual auth state
      if (session?.user) {
        localStorage.setItem('loginSuccess', 'true');
        localStorage.setItem('userEmail', session.user.email || '');
      } else {
        localStorage.removeItem('loginSuccess');
        localStorage.removeItem('userEmail');
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        isAuthenticated: !!session,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 