
'use client';

import * as React from 'react';
import Link from 'next/link';
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
import { Mail } from 'lucide-react';
import type { AuthError } from 'firebase/auth';

const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const { toast } = useToast();
  const { resetPassword, setError } = useAuth();
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const [isLoading, setIsLoading] = React.useState(false);

  async function onSubmit(data: ResetPasswordFormValues) {
    setIsLoading(true);
    setError(null);
    try {
      await resetPassword(data.email);
      toast({
        title: 'Password Reset Email Sent',
        description: `If an account exists for ${data.email}, a password reset link has been sent. Please check your inbox.`,
      });
      form.reset();
    } catch (error) {
      const authError = error as AuthError;
      toast({
        variant: 'destructive',
        title: 'Error Sending Reset Email',
        description: authError.message || 'Failed to send password reset email. Please try again.',
      });
      setError(authError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">Reset Your Password</CardTitle>
          <CardDescription>Enter your email address and we&apos;ll send you a link to reset your password.</CardDescription>
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
                        <Input type="email" placeholder="you@example.com" {...field} className="pl-10 h-10" disabled={isLoading} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-11 text-base bg-accent hover:bg-accent/90" disabled={isLoading}>
                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link href="/auth/login" className={`font-medium text-primary hover:underline ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
