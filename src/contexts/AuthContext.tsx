
'use client';

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  sendPasswordResetEmail,
  type User,
  type AuthError
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: AuthError | null;
  setError: Dispatch<SetStateAction<AuthError | null>>;
  signup: typeof createUserWithEmailAndPassword;
  login: typeof signInWithEmailAndPassword;
  logout: typeof signOut;
  signInWithGoogle: (redirectPath?: string | null) => Promise<void>; // Modified to accept redirectPath
  resetPassword: typeof sendPasswordResetEmail;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const handleAuthError = (err: any, defaultMessage: string) => {
    setError(err as AuthError);
    toast({
      variant: 'destructive',
      title: 'Authentication Error',
      description: (err as AuthError).message || defaultMessage,
    });
  };

  const wrappedSignup = async (email: string, pass: string) => {
    setError(null);
    return createUserWithEmailAndPassword(auth, email, pass);
  };

  const wrappedLogin = async (email: string, pass: string) => {
    setError(null);
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const wrappedLogout = async () => {
    setError(null);
    await signOut(auth);
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    router.push('/auth/login');
  };

  const wrappedSignInWithGoogle = async (redirectPath?: string | null) => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setCurrentUser(result.user);
      toast({ title: 'Signed In', description: 'Successfully signed in with Google.' });
      if (redirectPath && redirectPath.startsWith('/')) {
        router.push(redirectPath);
      } else {
        router.push('/');
      }
    } catch (err: any) {
      handleAuthError(err, 'Failed to sign in with Google.');
      // Let the calling component handle its own isLoading state
      throw err; // Re-throw to allow specific error handling in component
    }
  };
  
  const wrappedResetPassword = async (email: string) => {
    setError(null);
    return sendPasswordResetEmail(auth, email);
  };


  const value = {
    currentUser,
    loading,
    error,
    setError,
    signup: wrappedSignup,
    login: wrappedLogin,
    logout: wrappedLogout,
    signInWithGoogle: wrappedSignInWithGoogle,
    resetPassword: wrappedResetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
