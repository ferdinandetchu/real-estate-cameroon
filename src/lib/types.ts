
export type PropertyImage = {
  url: string;
  alt: string;
  hint?: string; // Optional hint for AI image generation if placehold.co is used
};

export type PropertyType = 'house' | 'land' | 'guesthouse' | 'hotel';
export const propertyTypes: PropertyType[] = ['house', 'land', 'guesthouse', 'hotel'];

export type PropertyLocation = 'Buea' | 'Limbe' | 'Douala';
export const propertyLocations: PropertyLocation[] = ['Buea', 'Limbe', 'Douala'];

export type ListingType = 'sale' | 'rent';
export const listingTypes: ListingType[] = ['sale', 'rent'];

export type Property = {
  id: string;
  name: string;
  type: PropertyType;
  listingType: ListingType; // Added to differentiate sale vs rent
  location: PropertyLocation;
  price: number;
  currency: 'XAF' | 'USD';
  description: string;
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqMeters?: number;
  amenities: string[];
  images: PropertyImage[];
  videos?: string[]; // URLs to videos
  isFeatured?: boolean;
  agent: {
    name: string;
    phone: string;
    email: string;
  };
};

export type AppointmentType = 'physical-viewing' | 'virtual-tour' | 'phone-consultation';
export const appointmentTypes: AppointmentType[] = ['physical-viewing', 'virtual-tour', 'phone-consultation'];

export const paymentMethods = ['creditCard', 'mobileMoney'] as const;
export type PaymentMethod = typeof paymentMethods[number];

export type BookingRequest = {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyType: PropertyType; // Added for easier access in dashboard
  propertyListingType: ListingType; // Added for easier access in dashboard
  userId?: string; // Added to associate booking with a user
  appointmentType: AppointmentType;
  appointmentPrice: number; // Price for the selected appointment type
  meetingTime: string; // Store as ISO string or suitable string format
  meetingLocation: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  paymentMethod?: PaymentMethod;
  cardNumber?: string;
  cardExpiry?: string;
  cardCVC?: string;
  mobileMoneyNumber?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed'; // Simplified payment status
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'; // Added 'completed' for post-rental
  createdAt: string; // Store as ISO string
  rentalId?: string; // Link to UserPropertyRental if this booking led to a rental
};

export type UserPropertyRental = {
  id: string; // rental_propertyId_userId_timestamp
  userId: string;
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  propertyImageUrl?: string; 
  rentStartDate: string; // ISO Date string
  rentEndDate: string; // ISO Date string
  monthsPaid: number;
  monthlyPrice: number;
  currency: 'XAF' | 'USD';
  createdAt: string; // ISO Date string
  bookingId: string; // The booking that led to this rental
};
