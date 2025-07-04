import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isAuthenticated: boolean
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  checkAuthStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!user && !!session

  const checkAuthStatus = async () => {
    try {
      setLoading(true)
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error checking auth status:', error)
        setUser(null)
        setSession(null)
      } else {
        setSession(session)
        setUser(session?.user ?? null)
      }
    } catch (error) {
      console.error('Failed to check auth status:', error)
      setUser(null)
      setSession(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuthStatus()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      
      if (event === 'SIGNED_IN') {
        setSession(session)
        setUser(session?.user ?? null)
        // Store user info in localStorage for persistence
        if (session?.user) {
          localStorage.setItem('user_email', session.user.email || '')
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
        // Clear user info from localStorage
        localStorage.removeItem('user_email')
      } else if (event === 'TOKEN_REFRESHED') {
        setSession(session)
        setUser(session?.user ?? null)
      } else if (event === 'USER_UPDATED') {
        setSession(session)
        setUser(session?.user ?? null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      })
      return { error }
    } catch (error) {
      console.error('Signup error:', error)
      return { error: { message: 'Signup failed. Please try again.' } }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: { message: 'Sign in failed. Please try again.' } }
    }
  }

  const signInWithGoogle = async (redirectTo?: string) => {
    try {
      // Always redirect to auth callback for proper handling
      const callbackUrl = `${window.location.origin}/auth/callback`;
      
      // Set login success flag if redirecting to index page
      if (redirectTo === '/' || redirectTo === '/index') {
        localStorage.setItem('loginSuccess', 'true');
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      return { error }
    } catch (error) {
      console.error('Google sign in error:', error)
      return { error: { message: 'Google sign in failed. Please try again.' } }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
      }
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  const value = {
    user,
    session,
    loading,
    isAuthenticated,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    checkAuthStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 