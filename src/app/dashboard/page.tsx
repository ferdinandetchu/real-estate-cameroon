
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { Property, BookingRequest } from '@/lib/types';
import { getUserDashboardProperties, getUserDashboardBookings } from '@/lib/data';
import { PropertyListItem } from '@/components/dashboard/PropertyListItem';
import { BookingListItem } from '@/components/dashboard/BookingListItem';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [bookings, setBookings] = React.useState<BookingRequest[]>([]);
  const [dataLoading, setDataLoading] = React.useState(true);

  React.useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/auth/login?redirect=/dashboard');
    }
  }, [currentUser, authLoading, router]);

  React.useEffect(() => {
    async function fetchData() {
      if (currentUser) {
        setDataLoading(true);
        try {
          const [userProperties, userBookings] = await Promise.all([
            getUserDashboardProperties(currentUser.uid),
            getUserDashboardBookings(currentUser.uid),
          ]);
          setProperties(userProperties);
          setBookings(userBookings);
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
          // Handle error (e.g., show a toast message)
        } finally {
          setDataLoading(false);
        }
      } else if (!authLoading) {
        // If not loading auth and no current user, means redirection should have happened
        // or there's no data to fetch.
        setDataLoading(false);
      }
    }
    fetchData();
  }, [currentUser, authLoading]);

  if (authLoading || (!currentUser && !authLoading)) {
    // Show loading skeletons or a full-page loader while auth is resolving or redirecting
    return (
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <Skeleton className="h-8 w-1/3 mb-6" />
        <Skeleton className="h-6 w-1/4 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
        <Separator className="my-8" />
        <Skeleton className="h-6 w-1/4 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">User Dashboard</h1>
      {currentUser && (
        <p className="text-md text-muted-foreground mb-8">
          Welcome back, {currentUser.displayName || currentUser.email}!
        </p>
      )}

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-primary mb-6">My Properties</h2>
        {dataLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.map((prop) => (
              <PropertyListItem key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-6 bg-card rounded-lg shadow">
            <p className="text-muted-foreground mb-4">You don&apos;t have any properties listed here yet.</p>
            <Button asChild>
              <Link href="/properties">Explore Properties</Link>
            </Button>
          </div>
        )}
      </section>

      <Separator className="my-8 md:my-12" />

      <section>
        <h2 className="text-2xl font-semibold text-primary mb-6">My Bookings</h2>
        {dataLoading ? (
           <div className="space-y-4">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingListItem key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-6 bg-card rounded-lg shadow">
            <p className="text-muted-foreground mb-4">You haven&apos;t made any bookings yet.</p>
             <Button asChild>
              <Link href="/properties">Find Properties to Book</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
