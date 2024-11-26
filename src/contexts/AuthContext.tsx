import React, { createContext, useContext, useEffect, useState } from 'react';
import { SupabaseClient, User, AuthError } from '@supabase/supabase-js';

// Define types for auth-related errors
interface AuthErrorState {
  message: string;
  code?: string;
}

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: AuthErrorState | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateEmail: (newEmail: string) => Promise<void>;
  updateProfile: (updates: { [key: string]: any }) => Promise<void>;
  clearError: () => void;
}

// Props for the AuthProvider component
export interface AuthProviderProps {
  supabase: SupabaseClient;
  children: React.ReactNode;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to format auth errors
const formatAuthError = (error: AuthError): AuthErrorState => {
  return {
    message: error.message || 'An authentication error occurred',
    code: error.status?.toString()
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ supabase, children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthErrorState | null>(null);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (mounted) {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        if (mounted) {
          setError(formatAuthError(error as AuthError));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    initializeAuth();

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      setError(formatAuthError(error as AuthError));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      if (error) throw error;
    } catch (error) {
      setError(formatAuthError(error as AuthError));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      setError(formatAuthError(error as AuthError));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } catch (error) {
      setError(formatAuthError(error as AuthError));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (newPassword: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
    } catch (error) {
      setError(formatAuthError(error as AuthError));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update email
  const updateEmail = async (newEmail: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });
      if (error) throw error;
    } catch (error) {
      setError(formatAuthError(error as AuthError));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update profile data
  const updateProfile = async (updates: { [key: string]: any }) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates,
      });
      if (error) throw error;
    } catch (error) {
      setError(formatAuthError(error as AuthError));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Clear any existing error
  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateEmail,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Optional: Export a higher-order component for class components
export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P & { auth: AuthContextType }>
) => {
  return (props: P) => {
    const auth = useAuthContext();
    return <WrappedComponent {...props} auth={auth} />;
  };
};