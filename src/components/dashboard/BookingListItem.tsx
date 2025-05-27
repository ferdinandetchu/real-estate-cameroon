
'use client';

import type { BookingRequest, AppointmentType } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { CalendarDays, Home, UserCheck, Video, Phone, AlertCircle, CheckCircle, Clock, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { rentPropertyAfterBooking } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import * as React from 'react';

type BookingListItemProps = {
  booking: BookingRequest;
  onRentalSuccess?: () => void; // Callback to refresh dashboard data
};

const appointmentTypeIcons: Record<AppointmentType, React.ElementType> = {
  'physical-viewing': UserCheck,
  'virtual-tour': Video,
  'phone-consultation': Phone,
};

const statusColors: Record<BookingRequest['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  confirmed: 'bg-green-100 text-green-800 border-green-300',
  cancelled: 'bg-red-100 text-red-800 border-red-300',
  completed: 'bg-blue-100 text-blue-800 border-blue-300',
};
const statusIcons: Record<BookingRequest['status'], React.ElementType> = {
  pending: Clock,
  confirmed: CheckCircle,
  cancelled: AlertCircle,
  completed: CheckCircle, // Could be a different icon for completed
};


export function BookingListItem({ booking, onRentalSuccess }: BookingListItemProps) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isRenting, setIsRenting] = React.useState(false);

  const AppointmentIcon = appointmentTypeIcons[booking.appointmentType] || CalendarDays;
  const StatusIcon = statusIcons[booking.status] || AlertCircle;
  const statusColorClass = statusColors[booking.status] || 'bg-gray-100 text-gray-800 border-gray-300';

  let meetingDateDisplay = 'N/A';
  try {
    meetingDateDisplay = format(parseISO(booking.meetingTime), "PPPp"); 
  } catch (error) {
    console.warn("Failed to parse booking meetingTime:", booking.meetingTime, error);
  }
  
  let createdAtDateDisplay = 'N/A';
   try {
    createdAtDateDisplay = format(parseISO(booking.createdAt), "MMM d, yyyy");
  } catch (error) {
    console.warn("Failed to parse booking createdAt:", booking.createdAt, error);
  }

  const handleRentProperty = async () => {
    if (!currentUser) {
      toast({ title: 'Error', description: 'You must be logged in to rent a property.', variant: 'destructive' });
      return;
    }
    if (booking.propertyListingType !== 'rent' || (booking.propertyType !== 'house' && booking.propertyType !== 'land')) {
        toast({ title: 'Information', description: 'This type of property is not available for monthly rental simulation through this flow.', variant: 'default' });
        return;
    }

    setIsRenting(true);
    try {
      const rental = await rentPropertyAfterBooking(currentUser.uid, booking, 1); // Simulate renting for 1 month
      if (rental) {
        toast({
          title: 'Rental Successful (Simulated)',
          description: `You have rented ${booking.propertyName} for 1 month.`,
        });
        if (onRentalSuccess) {
          onRentalSuccess(); // Trigger data refresh on dashboard
        }
      } else {
        toast({ title: 'Rental Failed', description: 'Could not complete the rental process.', variant: 'destructive' });
      }
    } catch (error) {
      console.error("Rental error:", error);
      toast({ title: 'Rental Error', description: 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setIsRenting(false);
    }
  };

  const canRent = booking.status === 'confirmed' &&
                  booking.propertyListingType === 'rent' &&
                  (booking.propertyType === 'house' || booking.propertyType === 'land') && // Only houses/land for this simplified monthly rental
                  !booking.rentalId;

  return (
    <div className="bg-card p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
        <div className="flex-grow">
          <Link href={`/properties/${booking.propertyId}`} className="hover:underline">
            <h3 className="text-lg font-semibold text-primary flex items-center">
              <Home className="w-5 h-5 mr-2 shrink-0" />
              {booking.propertyName}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground capitalize">
            {booking.propertyType} for {booking.propertyListingType}
          </p>
          <div className="text-sm text-muted-foreground mt-1.5 space-y-1">
            <p className="flex items-center">
              <AppointmentIcon className="w-4 h-4 mr-2 shrink-0" />
              Type: <span className="font-medium ml-1 capitalize">{booking.appointmentType.replace('-', ' ')}</span>
            </p>
            <p className="flex items-center">
              <CalendarDays className="w-4 h-4 mr-2 shrink-0" />
              Scheduled for: <span className="font-medium ml-1">{meetingDateDisplay}</span>
            </p>
            {booking.appointmentPrice > 0 && booking.paymentMethod && (
                <p className="text-xs text-muted-foreground">
                    Paid <span className="font-semibold">{new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(booking.appointmentPrice)}</span> via {booking.paymentMethod === 'creditCard' ? 'Credit Card' : 'Mobile Money'} for session.
                </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start sm:items-end mt-2 sm:mt-0">
          <Badge className={`capitalize mb-2 text-xs px-2 py-1 border ${statusColorClass}`}>
             <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
            {booking.status}
          </Badge>
           <p className="text-xs text-muted-foreground mb-2">Booked on: {createdAtDateDisplay}</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            {canRent && (
              <Button onClick={handleRentProperty} size="sm" disabled={isRenting} className="bg-accent hover:bg-accent/90">
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isRenting ? 'Processing...' : 'Rent Property (Simulate 1 Month)'}
              </Button>
            )}
            <Button asChild variant="outline" size="sm">
              <Link href={`/properties/${booking.propertyId}`}>View Property</Link>
            </Button>
          </div>
        </div>
      </div>
       {booking.rentalId && booking.status === 'completed' && (
        <p className="text-sm text-green-600 mt-2">This booking led to a rental agreement.</p>
      )}
    </div>
  );
}
