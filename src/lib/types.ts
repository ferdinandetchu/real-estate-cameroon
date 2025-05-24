
export type PropertyImage = {
  url: string;
  alt: string;
  hint?: string; // Optional hint for AI image generation if placehold.co is used
};

export type PropertyType = 'house' | 'land' | 'guesthouse' | 'hotel';
export const propertyTypes: PropertyType[] = ['house', 'land', 'guesthouse', 'hotel'];

export type PropertyLocation = 'Buea' | 'Limbe' | 'Douala';
export const propertyLocations: PropertyLocation[] = ['Buea', 'Limbe', 'Douala'];

export type Property = {
  id: string;
  name: string;
  type: PropertyType;
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

export type BookingRequest = {
  id: string;
  propertyId: string;
  propertyName: string;
  appointmentType: AppointmentType;
  meetingTime: string; // Store as ISO string or suitable string format
  meetingLocation: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string; // Store as ISO string
};
