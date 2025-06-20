
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { submitBookingRequest } from '@/lib/data';
import type { Property, AppointmentType, PaymentMethod, PropertyType, ListingType } from '@/lib/types';
import { appointmentTypes, paymentMethods } from '@/lib/types';
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon, PhoneIcon, MailIcon, Eye, Video, Briefcase, CreditCard, Smartphone, CheckCircle2, CalendarPlus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, addHours, parseISO, getDay, getDate, getMonth, getYear } from 'date-fns';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { useAuth } from '@/contexts/AuthContext'; 

const appointmentTypeDetailsMap: Record<AppointmentType, {
  label: string;
  icon: React.ElementType;
  benefits: string[];
  price: number; // in XAF
  priceDescription: string;
}> = {
  'physical-viewing': {
    label: 'Physical Viewing',
    icon: Eye,
    benefits: ['In-person tour of the property.', 'Meet the agent directly.', 'Assess neighborhood and surroundings.'],
    price: 5000,
    priceDescription: 'Service fee for site visit coordination.',
  },
  'virtual-tour': {
    label: 'Virtual Tour',
    icon: Video,
    benefits: ['Guided tour via video call.', 'Ask questions in real-time.', 'View from anywhere.'],
    price: 2500,
    priceDescription: 'Fee for live virtual tour session.',
  },
  'phone-consultation': {
    label: 'Phone Consultation',
    icon: PhoneIcon, 
    benefits: ['Discuss property details with an agent.', 'Clarify doubts and get advice.', 'Quick and convenient.'],
    price: 0,
    priceDescription: 'Initial consultation is free.',
  },
};

const paymentMethodDetailsMap: Record<PaymentMethod, { label: string; icon: React.ElementType }> = {
  'creditCard': { label: 'Credit Card', icon: CreditCard },
  'mobileMoney': { label: 'Mobile Money', icon: Smartphone },
};

const bookingFormSchema = z.object({
  propertyName: z.string(),
  appointmentType: z.enum(appointmentTypes, {
    required_error: "Please select an appointment type.",
  }),
  meetingDate: z.date({
    required_error: "A meeting date is required.",
  }),
  meetingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  meetingLocation: z.string().min(5, { message: 'Meeting location must be at least 5 characters.' })
    .or(z.literal("").transform(() => undefined)).optional(),
  userName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  userPhone: z.string().min(9, { message: 'Phone number seems too short.' }),
  userEmail: z.string().email({ message: 'Invalid email address.' }),
  paymentMethod: z.enum(paymentMethods, { required_error: "Please select a payment method."}),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(), 
  cardCVC: z.string().optional(),
  mobileMoneyNumber: z.string().optional(),
}).refine(data => data.appointmentType === 'physical-viewing' ? !!data.meetingLocation : true, {
  message: "Meeting location is required for physical viewings.",
  path: ["meetingLocation"],
}).refine(data => {
    const [hours, minutes] = data.meetingTime.split(':').map(Number);
    // Check if hours or minutes are NaN (e.g. if regex failed but somehow passed)
    if (isNaN(hours) || isNaN(minutes)) return false; 
    const selectedTotalMinutes = hours * 60 + minutes;
    const startTimeTotalMinutes = 9 * 60; // 09:00
    const endTimeTotalMinutes = 17 * 60; // 17:00
    return selectedTotalMinutes >= startTimeTotalMinutes && selectedTotalMinutes <= endTimeTotalMinutes;
  }, {
  message: "Preferred time should be between 09:00 and 17:00.",
  path: ["meetingTime"],
})
.superRefine((data, ctx) => {
  const selectedAppointmentPrice = appointmentTypeDetailsMap[data.appointmentType as AppointmentType]?.price;
  if (selectedAppointmentPrice > 0) { 
    if (data.paymentMethod === 'creditCard') {
      if (!data.cardNumber || !/^\d{13,19}$/.test(data.cardNumber.replace(/\s/g, ''))) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid card number (13-19 digits).", path: ["cardNumber"] });
      }
      if (!data.cardExpiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.cardExpiry)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid expiry date (MM/YY).", path: ["cardExpiry"] });
      }
      if (!data.cardCVC || !/^\d{3,4}$/.test(data.cardCVC)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid CVC (3-4 digits).", path: ["cardCVC"] });
      }
    } else if (data.paymentMethod === 'mobileMoney') {
      if (!data.mobileMoneyNumber || !/^\+?\d{9,15}$/.test(data.mobileMoneyNumber)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid mobile money number.", path: ["mobileMoneyNumber"] });
      }
    }
  }
});


type BookingFormValues = z.infer<typeof bookingFormSchema>;

type BookingFormProps = {
  property: Property;
  onSuccess?: () => void;
};

export function BookingForm({ property, onSuccess }: BookingFormProps) {
  const { toast } = useToast();
  const { currentUser } = useAuth(); 
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      propertyName: property.name,
      appointmentType: 'physical-viewing',
      meetingLocation: `Viewing for ${property.name} at ${property.address}`,
      meetingDate: new Date(), 
      meetingTime: "10:00", // Default time within 09:00-17:00
      userName: currentUser?.displayName || currentUser?.email?.split('@')[0] || '', 
      userPhone: '', 
      userEmail: currentUser?.email || '', 
      paymentMethod: 'creditCard',
      cardNumber: '',
      cardExpiry: '',
      cardCVC: '',
      mobileMoneyNumber: '',
    },
  });

  const selectedAppointmentType = form.watch('appointmentType');
  const selectedPaymentMethod = form.watch('paymentMethod');
  
  const [clientFormattedAppointmentPrice, setClientFormattedAppointmentPrice] = React.useState<string | null>(null);

  const currentAppointmentDetails = appointmentTypeDetailsMap[selectedAppointmentType as AppointmentType];
  const currentAppointmentPrice = currentAppointmentDetails?.price ?? 0;

  React.useEffect(() => {
    if (currentAppointmentDetails) {
      try {
        setClientFormattedAppointmentPrice(
          new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(currentAppointmentDetails.price)
        );
      } catch (e) {
        console.error("Error formatting appointment price:", e);
        setClientFormattedAppointmentPrice(`${currentAppointmentDetails.price} XAF`);
      }
    } else {
      setClientFormattedAppointmentPrice(null);
    }
  }, [currentAppointmentDetails]);

  React.useEffect(() => {
    if (currentUser) {
      form.setValue('userName', currentUser.displayName || currentUser.email?.split('@')[0] || '');
      form.setValue('userEmail', currentUser.email || '');
    }
  }, [currentUser, form]);


  async function onSubmit(data: BookingFormValues) {
    if (!currentUser) {
      toast({ title: "Authentication Error", description: "You must be logged in to book a session.", variant: "destructive"});
      return;
    }
    try {
      const meetingDateTimeCombined = new Date(data.meetingDate);
      const [hours, minutes] = data.meetingTime.split(':').map(Number);
      meetingDateTimeCombined.setHours(hours, minutes, 0, 0);

      const appointmentPrice = appointmentTypeDetailsMap[data.appointmentType as AppointmentType]?.price ?? 0;

      const bookingId = await submitBookingRequest({
        propertyId: property.id,
        propertyName: data.propertyName,
        propertyType: property.type,
        propertyListingType: property.listingType,
        userId: currentUser.uid, 
        appointmentType: data.appointmentType as AppointmentType,
        appointmentPrice: appointmentPrice,
        meetingTime: meetingDateTimeCombined.toISOString(),
        meetingLocation: data.meetingLocation || (data.appointmentType === 'physical-viewing' ? property.address : 'N/A (Virtual/Phone)'),
        userName: data.userName,
        userPhone: data.userPhone,
        userEmail: data.userEmail,
        paymentMethod: appointmentPrice > 0 ? data.paymentMethod : undefined,
        paymentStatus: appointmentPrice > 0 ? 'paid' : undefined, 
        cardNumber: appointmentPrice > 0 && data.paymentMethod === 'creditCard' ? data.cardNumber : undefined,
        cardExpiry: appointmentPrice > 0 && data.paymentMethod === 'creditCard' ? data.cardExpiry : undefined,
        cardCVC: appointmentPrice > 0 && data.paymentMethod === 'creditCard' ? data.cardCVC : undefined,
        mobileMoneyNumber: appointmentPrice > 0 && data.paymentMethod === 'mobileMoney' ? data.mobileMoneyNumber : undefined,
      });

      const eventTitle = encodeURIComponent(`Booking: ${property.name}`);
      const eventStartTime = parseISO(meetingDateTimeCombined.toISOString());
      const eventEndTime = addHours(eventStartTime, 1); 
      
      const formatForGoogleCalendar = (date: Date) => format(date, "yyyyMMdd'T'HHmmss'Z'");
      const googleStartTime = formatForGoogleCalendar(eventStartTime);
      const googleEndTime = formatForGoogleCalendar(eventEndTime);

      const eventLocation = encodeURIComponent(data.meetingLocation || (data.appointmentType === 'physical-viewing' ? property.address : 'Virtual/Phone'));
      const eventDetails = encodeURIComponent(
        `Appointment for ${property.name}.\nType: ${appointmentTypeDetailsMap[data.appointmentType as AppointmentType].label}\nAgent: ${property.agent.name} (${property.agent.phone})`
      );
      
      const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${googleStartTime}/${googleEndTime}&details=${eventDetails}&location=${eventLocation}`;

      toast({
        title: 'Booking Request Sent!',
        description: (
          <div className="space-y-2">
            <p>Your request (ID: {bookingId}) for {data.propertyName} has been submitted. We&apos;ll contact you soon.</p>
            <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
                >
                <CalendarPlus className="mr-2 h-4 w-4" /> Add to Google Calendar
                </a>
            </Button>
          </div>
        ),
        duration: 20000, 
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
  
  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    if (date < today) return true; 

    const dayOfWeek = getDay(date); 
    if (dayOfWeek === 0 || dayOfWeek === 6) return true; 

    const currentMonth = getMonth(today);
    const currentYear = getYear(today);
    
    const dateDay = getDate(date);
    const dateMonth = getMonth(date);
    const dateYear = getYear(date);

    if (dateYear === currentYear && dateMonth === currentMonth && (dateDay === 10 || dateDay === 20)) {
      return true;
    }
    
    const nextMonthDateYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const nextMonth = (currentMonth + 1) % 12;

    if (dateYear === nextMonthDateYear && dateMonth === nextMonth && dateDay === 15) {
      return true;
    }

    return false; 
  };


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
        
        <FormField
          control={form.control}
          name="appointmentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Appointment Type</FormLabel>
              <Select onValueChange={(value) => {
                field.onChange(value);
                if (value !== 'physical-viewing') {
                  form.setValue('meetingLocation', ''); 
                } else {
                  form.setValue('meetingLocation', `Viewing for ${property.name} at ${property.address}`);
                }
              }} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-10">
                    <div className="flex items-center">
                       {React.createElement(appointmentTypeDetailsMap[field.value as AppointmentType]?.icon || Briefcase, { className: "mr-2 h-4 w-4 text-muted-foreground" })}
                       <SelectValue placeholder="Select an appointment type" />
                    </div>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {appointmentTypes.map((type) => {
                    const details = appointmentTypeDetailsMap[type];
                    return (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center">
                          <details.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                          {details.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {currentAppointmentDetails && (
          <div className="mt-4 p-4 border rounded-md bg-card space-y-3">
            <h4 className="font-semibold text-md text-primary">{currentAppointmentDetails.label} Details</h4>
            <div>
              <p className="text-sm font-medium text-foreground/90">Benefits:</p>
              <ul className="list-none pl-0 mt-1 space-y-1">
                {currentAppointmentDetails.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-green-500 shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/90">Price for Session:</p>
              <p className="text-lg font-semibold text-accent">
                {clientFormattedAppointmentPrice || `${currentAppointmentDetails.price} XAF`}
              </p>
              {currentAppointmentDetails.priceDescription && <p className="text-xs text-muted-foreground">{currentAppointmentDetails.priceDescription}</p>}
            </div>
          </div>
        )}


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="meetingDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Preferred Date</FormLabel>
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
                      disabled={isDateDisabled}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Select an available date. Weekends and certain public holidays may be unavailable.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="meetingTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Time</FormLabel>
                <div className="relative">
                  <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input type="time" {...field} className="pl-10 h-10" />
                  </FormControl>
                </div>
                <FormDescription>
                  Select a time between 09:00 and 17:00. Agent will confirm exact time based on availability.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {selectedAppointmentType === 'physical-viewing' && (
          <FormField
            control={form.control}
            name="meetingLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suggested Meeting Location</FormLabel>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Textarea {...field} placeholder="e.g., At the property site, or a nearby landmark." className="pl-10 min-h-[80px]" />
                  </FormControl>
                </div>
                <FormDescription>
                  Only required for physical viewings. Our agent will confirm the exact meeting point.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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

        {currentAppointmentPrice > 0 && (
          <>
            <Separator className="my-6" />
            <h3 className="text-lg font-medium">Payment for Session Booking</h3>
            <p className="text-sm text-muted-foreground">
              Secure your booking session by providing payment details. Amount: <span className="font-semibold text-accent">{clientFormattedAppointmentPrice || `${currentAppointmentPrice} XAF`}</span>.
            </p>
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10">
                         <div className="flex items-center">
                            {React.createElement(paymentMethodDetailsMap[field.value as PaymentMethod]?.icon || Briefcase, { className: "mr-2 h-4 w-4 text-muted-foreground" })}
                            <SelectValue placeholder="Select payment method" />
                         </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethods.map((method) => {
                        const details = paymentMethodDetailsMap[method];
                        return (
                          <SelectItem key={method} value={method}>
                             <div className="flex items-center">
                                <details.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                                {details.label}
                             </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedPaymentMethod === 'creditCard' && (
              <div className="space-y-4 p-4 border rounded-md bg-card">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl><Input placeholder="0000 0000 0000 0000" {...field} className="h-10"/></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cardExpiry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl><Input placeholder="MM/YY" {...field} className="h-10"/></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cardCVC"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVC</FormLabel>
                        <FormControl><Input placeholder="123" {...field} className="h-10"/></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {selectedPaymentMethod === 'mobileMoney' && (
               <div className="space-y-4 p-4 border rounded-md bg-card">
                <FormField
                  control={form.control}
                  name="mobileMoneyNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Money Number</FormLabel>
                      <FormControl><Input type="tel" placeholder="+237 XXX XX XX XX" {...field} className="h-10"/></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </>
        )}
        
        <Button type="submit" className="w-full h-12 text-lg bg-accent hover:bg-accent/90" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Submitting...' : 'Send Booking Request'}
        </Button>
      </form>
    </Form>
  );
}


    