'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { submitBookingRequest } from '@/lib/data';
import type { Property } from '@/lib/types';
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon, PhoneIcon, MailIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const bookingFormSchema = z.object({
  propertyName: z.string(),
  meetingDate: z.date({
    required_error: "A meeting date is required.",
  }),
  meetingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  meetingLocation: z.string().min(5, { message: 'Meeting location must be at least 5 characters.' }),
  userName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  userPhone: z.string().min(9, { message: 'Phone number seems too short.' }),
  userEmail: z.string().email({ message: 'Invalid email address.' }),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

type BookingFormProps = {
  property: Property;
  onSuccess?: () => void;
};

export function BookingForm({ property, onSuccess }: BookingFormProps) {
  const { toast } = useToast();
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      propertyName: property.name,
      meetingLocation: `Viewing for ${property.name} at ${property.address}`,
      meetingDate: new Date(),
      meetingTime: "10:00",
      userName: '',
      userPhone: '',
      userEmail: '',
    },
  });

  async function onSubmit(data: BookingFormValues) {
    try {
      const meetingDateTime = new Date(data.meetingDate);
      const [hours, minutes] = data.meetingTime.split(':').map(Number);
      meetingDateTime.setHours(hours, minutes);

      const bookingId = await submitBookingRequest({
        propertyId: property.id,
        propertyName: data.propertyName,
        meetingTime: meetingDateTime.toISOString(),
        meetingLocation: data.meetingLocation,
        userName: data.userName,
        userPhone: data.userPhone,
        userEmail: data.userEmail,
      });
      toast({
        title: 'Booking Request Sent!',
        description: `Your request (ID: ${bookingId}) for ${data.propertyName} has been submitted. We'll contact you soon.`,
      });
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send booking request. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="propertyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property</FormLabel>
              <FormControl>
                <Input {...field} readOnly className="bg-muted/50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="meetingDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Preferred Meeting Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal h-10",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setDate(new Date().getDate() -1)) // Disable past dates
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="meetingTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Meeting Time</FormLabel>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input type="time" {...field} className="pl-10 h-10" />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="meetingLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Suggested Meeting Location / Details</FormLabel>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <FormControl>
                  <Textarea {...field} placeholder="e.g., At the property site, or a nearby landmark. Any specific requests?" className="pl-10 min-h-[80px]" />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <h3 className="text-lg font-medium pt-4 border-t">Your Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <FormControl>
                  <Input placeholder="Your full name" {...field} className="pl-10 h-10" />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="userPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <FormControl>
                  <Input type="tel" placeholder="Your phone number" {...field} className="pl-10 h-10" />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
         <FormField
          control={form.control}
          name="userEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <FormControl>
                <Input type="email" placeholder="Your email address" {...field} className="pl-10 h-10" />
              </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full h-12 text-lg bg-accent hover:bg-accent/90" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Submitting...' : 'Send Booking Request'}
        </Button>
      </form>
    </Form>
  );
}
