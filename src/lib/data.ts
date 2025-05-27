
import type { Property, BookingRequest, PropertyType, PropertyLocation, ListingType, AppointmentType, PaymentMethod, UserPropertyRental } from './types';
import { format, addMonths, parseISO } from 'date-fns';

const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Spacious Villa in Buea',
    type: 'house',
    listingType: 'sale',
    location: 'Buea',
    price: 75000000,
    currency: 'XAF',
    description: 'A beautiful and spacious villa located in the serene residential area of Buea, offering breathtaking views of Mount Cameroon. Features modern amenities and a large garden.',
    address: '123 Mountain View Rd, Buea',
    bedrooms: 4,
    bathrooms: 3,
    areaSqMeters: 300,
    amenities: ['WiFi', 'Parking', 'Garden', 'Security', 'Air Conditioning'],
    images: [
      { url: 'https://images.unsplash.com/photo-1664210905659-c9cb32dd75bd', alt: 'Front view of the villa', hint: 'modern villa' },
      { url: 'https://images.unsplash.com/photo-1638885930125-85350348d266', alt: 'Living room', hint: 'luxury living room' },
      { url: 'https://images.unsplash.com/photo-1666228459069-d308cbea796b', alt: 'Garden view', hint: 'lush garden' },
    ],
    isFeatured: true,
    agent: { name: 'John Doe', phone: '+237670000001', email: 'john.doe@propertyget.com' },
  },
  {
    id: '2',
    name: 'Prime Land in Limbe',
    type: 'land',
    listingType: 'sale',
    location: 'Limbe',
    price: 25000000,
    currency: 'XAF',
    description: 'A prime plot of land ideal for residential or commercial development, situated near the Atlantic coast in Limbe. Easy access to main roads and utilities.',
    address: '456 Beachfront Ave, Limbe',
    areaSqMeters: 1000,
    amenities: ['Fenced', 'Road Access'],
    images: [
      { url: 'https://placehold.co/800x600.png', alt: 'View of the land plot', hint: 'vacant land' },
      { url: 'https://placehold.co/800x600.png', alt: 'Nearby coastline', hint: 'coastal landscape' },
    ],
    isFeatured: true,
    agent: { name: 'Jane Smith', phone: '+237670000002', email: 'jane.smith@propertyget.com' },
  },
  {
    id: '3',
    name: 'Cozy Guesthouse in Douala',
    type: 'guesthouse',
    listingType: 'rent', // Guesthouses are effectively for rent (per night)
    location: 'Douala',
    price: 15000, // Per night
    currency: 'XAF',
    description: 'A charming and cozy guesthouse in the heart of Douala, perfect for travelers. Offers comfortable rooms and a friendly atmosphere.',
    address: '789 City Center St, Douala',
    bedrooms: 10, // Number of rooms
    amenities: ['WiFi', 'Breakfast Included', 'Daily Cleaning', 'Shared Lounge'],
    images: [
      { url: 'https://placehold.co/800x600.png', alt: 'Guesthouse exterior', hint: 'charming guesthouse' },
      { url: 'https://placehold.co/800x600.png', alt: 'Sample room', hint: 'cozy bedroom' },
    ],
    agent: { name: 'Michael B.', phone: '+237670000003', email: 'michael.b@propertyget.com' },
  },
  {
    id: '4',
    name: 'Luxury Hotel Suite, Douala',
    type: 'hotel',
    listingType: 'rent', // Hotels are effectively for rent (per night)
    location: 'Douala',
    price: 120000, // Per night
    currency: 'XAF', 
    description: 'Experience luxury in this exquisite hotel suite in Douala. Top-notch amenities, city views, and impeccable service.',
    address: '101 Business District, Douala',
    bedrooms: 1, // Suite
    bathrooms: 1,
    amenities: ['Pool', 'Gym', 'Restaurant', 'Room Service', 'Concierge'],
    images: [
      { url: 'https://placehold.co/800x600.png', alt: 'Hotel building', hint: 'luxury hotel' },
      { url: 'https://placehold.co/800x600.png', alt: 'Hotel suite interior', hint: 'hotel suite' },
    ],
    isFeatured: true,
    agent: { name: 'Global Hotels Inc.', phone: '+237670000004', email: 'bookings@globalhotels.com' },
  },
  {
    id: '5',
    name: 'Affordable House for Rent in Limbe',
    type: 'house',
    listingType: 'rent',
    location: 'Limbe',
    price: 350000, // Price per month
    currency: 'XAF',
    description: 'A well-maintained and affordable house for rent in a quiet neighborhood of Limbe. Ideal for families. Price is per month.',
    address: '22 Peace Valley, Limbe',
    bedrooms: 3,
    bathrooms: 2,
    areaSqMeters: 150,
    amenities: ['Parking', 'Garden'],
    images: [
      { url: 'https://placehold.co/800x600.png', alt: 'House exterior', hint: 'simple house' },
      { url: 'https://placehold.co/800x600.png', alt: 'Living area', hint: 'modest living room' },
    ],
    agent: { name: 'Peter K.', phone: '+237670000005', email: 'peter.k@propertyget.com' },
  },
    {
    id: '6',
    name: 'Commercial Land in Douala',
    type: 'land',
    listingType: 'sale',
    location: 'Douala',
    price: 150000000,
    currency: 'XAF',
    description: 'Large plot of commercial land in a rapidly developing area of Douala. Excellent investment opportunity.',
    address: 'Industrial Zone Plot 7, Douala',
    areaSqMeters: 5000,
    amenities: ['Road Access', 'Utilities Nearby'],
    images: [
      { url: 'https://placehold.co/800x600.png', alt: 'Commercial land plot', hint: 'large vacant lot' },
    ],
    isFeatured: false,
    agent: { name: 'Alpha Investments', phone: '+237670000006', email: 'invest@alpha.com' },
  },
  {
    id: '7',
    name: 'Modern Apartment for Rent, Buea',
    type: 'house', // Using 'house' type for apartments for simplicity in this model
    listingType: 'rent',
    location: 'Buea',
    price: 250000, // Price per month
    currency: 'XAF',
    description: 'Stylish 2-bedroom apartment for rent in a central Buea location. Features contemporary design and access to shared amenities.',
    address: 'Apartment 5B, Modern Living Complex, Buea',
    bedrooms: 2,
    bathrooms: 1,
    areaSqMeters: 90,
    amenities: ['WiFi', 'Parking', 'Security', 'Balcony'],
    images: [
      { url: 'https://placehold.co/800x600.png', alt: 'Apartment building exterior', hint: 'modern apartment' },
      { url: 'https://placehold.co/800x600.png', alt: 'Apartment interior', hint: 'stylish apartment' },
    ],
    isFeatured: true,
    agent: { name: 'Buea Rentals Co.', phone: '+237670000007', email: 'rentals@bueaproperties.com' },
  },
];

// Simulated in-memory store for booking requests
let mockBookingRequests: BookingRequest[] = [
  {
    id: 'booking_1700000000000_abcdef1',
    propertyId: '1',
    propertyName: 'Spacious Villa in Buea',
    propertyType: 'house',
    propertyListingType: 'sale',
    userId: 'user123_mock', 
    appointmentType: 'physical-viewing',
    appointmentPrice: 5000,
    meetingTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), 
    meetingLocation: 'At the property: 123 Mountain View Rd, Buea',
    userName: 'Test User',
    userPhone: '+1234567890',
    userEmail: 'testuser@example.com',
    paymentMethod: 'creditCard',
    paymentStatus: 'paid', 
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'booking_1700000000001_abcdef2',
    propertyId: '5', // Affordable House for Rent in Limbe
    propertyName: 'Affordable House for Rent in Limbe',
    propertyType: 'house',
    propertyListingType: 'rent',
    userId: 'user123_mock', 
    appointmentType: 'virtual-tour',
    appointmentPrice: 2500,
    meetingTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), 
    meetingLocation: 'N/A (Virtual Tour)',
    userName: 'Test User',
    userPhone: '+1234567890',
    userEmail: 'testuser@example.com',
    paymentMethod: 'mobileMoney',
    paymentStatus: 'paid',
    status: 'confirmed', // Changed to confirmed for "Rent Property" button testing
    createdAt: new Date().toISOString(),
  }
];

let mockUserPropertyRentals: UserPropertyRental[] = [];


export async function getProperties(filters?: {
  type?: PropertyType | 'all';
  listingType?: ListingType | 'all';
  location?: PropertyLocation | 'all';
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Property[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  let filteredProperties = mockProperties;

  if (filters) {
    if (filters.type && filters.type !== 'all') {
      filteredProperties = filteredProperties.filter(p => p.type === filters.type);
    }
    if (filters.listingType && filters.listingType !== 'all') {
      filteredProperties = filteredProperties.filter(p => p.listingType === filters.listingType);
    }
    if (filters.location && filters.location !== 'all') {
      filteredProperties = filteredProperties.filter(p => p.location === filters.location);
    }
    if (filters.searchTerm) {
      const searchTermLower = filters.searchTerm.toLowerCase();
      filteredProperties = filteredProperties.filter(p =>
        p.name.toLowerCase().includes(searchTermLower) ||
        p.description.toLowerCase().includes(searchTermLower) ||
        p.address.toLowerCase().includes(searchTermLower)
      );
    }
    if (filters.minPrice !== undefined) {
      filteredProperties = filteredProperties.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filteredProperties = filteredProperties.filter(p => p.price <= filters.maxPrice!);
    }
  }
  return filteredProperties;
}

export async function getPropertyById(id: string): Promise<Property | undefined> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockProperties.find(p => p.id === id);
}

export async function getFeaturedProperties(): Promise<Property[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockProperties.filter(p => p.isFeatured);
}

type SubmitBookingRequestData = Omit<BookingRequest, 'id' | 'status' | 'createdAt' | 'propertyType' | 'propertyListingType'> & {
  propertyType: PropertyType;
  propertyListingType: ListingType;
};


export async function submitBookingRequest(bookingData: SubmitBookingRequestData): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const fullBookingData: BookingRequest = {
    id: `booking_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    ...bookingData,
    status: 'pending', 
    createdAt: new Date().toISOString(),
  };
  
  mockBookingRequests.push(fullBookingData); 
  console.log('Booking request submitted:', fullBookingData);
  return fullBookingData.id;
}


export async function getUserDashboardProperties(userId: string): Promise<(Property & { rentalDetails?: UserPropertyRental })[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`Fetching dashboard properties and rentals for userId: ${userId} (simulated)`);

  // Simulate owned/listed properties (currently returning all featured for demo)
  const ownedOrListedProperties = mockProperties.filter(p => p.isFeatured).map(p => ({ ...p })); 

  // Get user's rentals
  const userRentals = mockUserPropertyRentals.filter(rental => rental.userId === userId);

  const combinedProperties: (Property & { rentalDetails?: UserPropertyRental })[] = [];

  // Add properties that are rentals
  for (const rental of userRentals) {
    const propertyDetails = mockProperties.find(p => p.id === rental.propertyId);
    if (propertyDetails) {
      combinedProperties.push({
        ...propertyDetails,
        // Override price with rental price for consistency on dashboard if needed, or use rental.monthlyPrice
        // price: rental.monthlyPrice, 
        rentalDetails: rental,
      });
    }
  }
  
  // Add other properties (owned/listed), ensuring no duplicates if a property is also in rentals
  for (const prop of ownedOrListedProperties) {
    if (!combinedProperties.some(cp => cp.id === prop.id)) {
      combinedProperties.push(prop);
    }
  }
  
  // For demo, if current user has no properties/rentals, show some from user123_mock
   if (combinedProperties.length === 0 && userId !== 'user123_mock') {
    const mockUserRentalsForDemo = mockUserPropertyRentals.filter(r => r.userId === 'user123_mock');
    const demoProperties: (Property & { rentalDetails?: UserPropertyRental })[] = [];
     for (const rental of mockUserRentalsForDemo) {
        const propertyDetails = mockProperties.find(p => p.id === rental.propertyId);
        if (propertyDetails) {
            demoProperties.push({
                ...propertyDetails,
                rentalDetails: {
                    ...rental,
                    propertyName: `${rental.propertyName} (Demo for ${userId})`
                }
            });
        }
    }
     // Add a couple of non-rented properties for demo
    const demoNonRented = mockProperties.slice(0,2).filter(p => !demoProperties.some(dp => dp.id === p.id));
    demoNonRented.forEach(p => demoProperties.push({...p, name: `${p.name} (Demo for ${userId})`}));
    return demoProperties;
  }


  return combinedProperties;
}

export async function getUserDashboardBookings(userId: string): Promise<BookingRequest[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const userBookings = mockBookingRequests.filter(booking => booking.userId === userId);
  console.log(`Fetching dashboard bookings for userId: ${userId}, found: ${userBookings.length} (simulated)`);
  
  if (userBookings.length === 0 && userId !== 'user123_mock') {
    return mockBookingRequests.filter(booking => booking.userId === 'user123_mock').map(b => ({
      ...b, 
      propertyName: `${b.propertyName} (Demo for ${userId})` 
    }));
  }
  return userBookings;
}

export async function rentPropertyAfterBooking(
  userId: string,
  booking: BookingRequest,
  monthsToRent: number
): Promise<UserPropertyRental | null> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const property = await getPropertyById(booking.propertyId);

  if (!property || property.listingType !== 'rent' || !property.price) {
    console.error('Property not found, not for rent, or price is missing.');
    return null;
  }
  // For guesthouses/hotels, price is per night, so "monthsToRent" logic might differ.
  // For simplicity, we assume monthly rental for 'house' and 'land' here.
  // A more complex system would handle daily rates for guesthouses/hotels.
  let monthlyPrice = property.price;
  if (property.type === 'guesthouse' || property.type === 'hotel') {
    // This is a simplification; true monthly rates for hotels are complex.
    // Assuming price is daily, and we're asked to rent for X "months" (interpreted as X * 30 days)
    // This part of the logic might need significant refinement for real-world hotel/guesthouse monthly stays.
    // For now, let's assume it's not applicable or use a placeholder.
    // Or, disallow "renting" guesthouses/hotels through this specific "X months" flow.
    // Let's restrict this simplified flow to house/land for monthly rentals for now.
    if (property.type !== 'house' && property.type !== 'land') {
        console.warn(`Monthly rental simulation not directly applicable for ${property.type}. Using property price as flat fee for now.`);
        // Or return null / throw error if this flow isn't for guesthouses/hotels
    }
  }


  const rentStartDate = new Date();
  const rentEndDate = addMonths(rentStartDate, monthsToRent);

  const newRental: UserPropertyRental = {
    id: `rental_${property.id}_${userId}_${Date.now()}`,
    userId,
    propertyId: property.id,
    propertyName: property.name,
    propertyAddress: property.address,
    propertyImageUrl: property.images[0]?.url,
    rentStartDate: rentStartDate.toISOString(),
    rentEndDate: rentEndDate.toISOString(),
    monthsPaid: monthsToRent,
    monthlyPrice: monthlyPrice,
    currency: property.currency,
    createdAt: new Date().toISOString(),
    bookingId: booking.id,
  };

  mockUserPropertyRentals.push(newRental);

  // Update booking status
  const bookingIndex = mockBookingRequests.findIndex(b => b.id === booking.id);
  if (bookingIndex !== -1) {
    mockBookingRequests[bookingIndex].status = 'completed';
    mockBookingRequests[bookingIndex].rentalId = newRental.id;
  }

  console.log('Property rented (simulated):', newRental);
  return newRental;
}
