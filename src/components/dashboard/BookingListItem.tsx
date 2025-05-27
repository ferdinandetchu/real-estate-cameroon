
'use client';

import type { BookingRequest, AppointmentType } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { CalendarDays, Home, UserCheck, Video, Phone, AlertCircle, CheckCircle, Clock } from 'lucide-react';

type BookingListItemProps = {
  booking: BookingRequest;
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
  // Add more statuses if needed
};
const statusIcons: Record<BookingRequest['status'], React.ElementType> = {
  pending: Clock,
  confirmed: CheckCircle,
  cancelled: AlertCircle,
};


export function BookingListItem({ booking }: BookingListItemProps) {
  const AppointmentIcon = appointmentTypeIcons[booking.appointmentType] || CalendarDays;
  const StatusIcon = statusIcons[booking.status] || AlertCircle;
  const statusColorClass = statusColors[booking.status] || 'bg-gray-100 text-gray-800 border-gray-300';

  let meetingDateDisplay = 'N/A';
  try {
    meetingDateDisplay = format(parseISO(booking.meetingTime), "PPPp"); // e.g., Jun 21, 2024, 10:00 AM
  } catch (error) {
    console.warn("Failed to parse booking meetingTime:", booking.meetingTime, error);
  }
  
  let createdAtDateDisplay = 'N/A';
   try {
    createdAtDateDisplay = format(parseISO(booking.createdAt), "MMM d, yyyy");
  } catch (error) {
    console.warn("Failed to parse booking createdAt:", booking.createdAt, error);
  }


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
                    Paid <span className="font-semibold">{new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(booking.appointmentPrice)}</span> via {booking.paymentMethod === 'creditCard' ? 'Credit Card' : 'Mobile Money'}
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
          <Button asChild variant="outline" size="sm">
            <Link href={`/properties/${booking.propertyId}`}>View Property</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
