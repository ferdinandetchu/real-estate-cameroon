
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock } from 'lucide-react';
import type { AuthError } from 'firebase/auth';

// Placeholder for Google Icon
const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);


const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const { login, signInWithGoogle, setError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  const handleSuccessfulLogin = () => {
    toast({
      title: 'Login Successful',
      description: 'Welcome back!',
    });
    if (redirectPath && redirectPath.startsWith('/')) {
      router.push(redirectPath);
    } else {
      router.push('/');
    }
  };

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setError(null);
    try {
      await login(data.email, data.password);
      handleSuccessfulLogin();
    } catch (error) {
      const authError = error as AuthError;
      let errorMessage = authError.message || 'An unexpected error occurred during login.';
      if (authError.code === 'auth/user-not-found' || authError.code === 'auth/wrong-password' || authError.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      }
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: errorMessage,
      });
      setError(authError);
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle(redirectPath);
      // AuthContext now handles the redirect based on redirectPath or defaults to '/'
    } catch (error) {
      // Error is already toasted by signInWithGoogle in AuthContext
      // No need to re-toast here
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                     <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} className="pl-10 h-10" disabled={isLoading || isGoogleLoading} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="/auth/reset-password"
                        className={`text-sm font-medium text-primary hover:underline ${isLoading || isGoogleLoading ? 'pointer-events-none opacity-50' : ''}`}
                        aria-disabled={isLoading || isGoogleLoading}
                        onClick={(e) => { if (isLoading || isGoogleLoading) e.preventDefault(); }}
                      >
                        Forgot password?
                      </Link>
                    </div>
                     <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} className="pl-10 h-10" disabled={isLoading || isGoogleLoading} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-11 text-base bg-accent hover:bg-accent/90" disabled={isLoading || isGoogleLoading}>
                {isLoading ? 'Logging In...' : 'Log In'}
              </Button>
            </form>
          </Form>

          <Separator className="my-6" />

          <div className="space-y-4">
            <Button variant="outline" className="w-full h-11 text-base" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
              <GoogleIcon />
              {isGoogleLoading ? 'Processing...' : 'Sign in with Google'}
            </Button>
          </div>

        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/signup"
              className={`font-medium text-primary hover:underline ${isLoading || isGoogleLoading ? 'pointer-events-none opacity-50' : ''}`}
              aria-disabled={isLoading || isGoogleLoading}
              onClick={(e) => { if (isLoading || isGoogleLoading) e.preventDefault(); }}
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
