
import { useState, useEffect } from 'react';
import { supabase } from '../app/integrations/supabase/client';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          isEmailVerified: session.user.email_confirmed_at !== null,
          createdAt: new Date(session.user.created_at),
        };
        setUser(userData);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          isEmailVerified: session.user.email_confirmed_at !== null,
          createdAt: new Date(session.user.created_at),
        };
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const register = async (email: string, name: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed',
          data: {
            name: name,
          }
        }
      });

      if (error) {
        console.log('Registration error:', error);
        return { success: false, error: error.message };
      }

      if (data.user && !data.session) {
        // User needs to verify email
        return { 
          success: true, 
          message: 'Please check your email and click the verification link to complete registration.' 
        };
      }

      return { success: true };
    } catch (error: any) {
      console.log('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log('Login error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.log('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log('Logout error:', error);
      }
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const sendVerificationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed'
        }
      });

      if (error) {
        console.log('Send verification error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.log('Send verification error:', error);
      return { success: false, error: 'Failed to send verification email' };
    }
  };

  const verifyEmail = async (verificationCode: string) => {
    // Note: Supabase handles email verification via email links, not codes
    // This is kept for demo purposes but in real implementation, 
    // email verification happens automatically when user clicks the email link
    try {
      if (verificationCode === '123456') { // Demo code
        return { success: true };
      }
      return { success: false, error: 'Invalid verification code. In production, email verification is handled via email links.' };
    } catch (error) {
      console.log('Email verification error:', error);
      return { success: false, error: 'Verification failed' };
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    register,
    login,
    logout,
    sendVerificationEmail,
    verifyEmail,
  };
};
