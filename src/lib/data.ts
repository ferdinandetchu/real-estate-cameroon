
import type { Property, BookingRequest, PropertyType, PropertyLocation, AppointmentType, PaymentMethod } from './types';

const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Spacious Villa in Buea',
    type: 'house',
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
      { url: 'https://placehold.co/800x600.png', alt: 'Front view of the villa', hint: 'modern villa' },
      { url: 'https://placehold.co/800x600.png', alt: 'Living room', hint: 'luxury living room' },
      { url: 'https://placehold.co/800x600.png', alt: 'Garden view', hint: 'lush garden' },
    ],
    isFeatured: true,
    agent: { name: 'John Doe', phone: '+237670000001', email: 'john.doe@cameroonestates.com' },
  },
  {
    id: '2',
    name: 'Prime Land in Limbe',
    type: 'land',
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
    agent: { name: 'Jane Smith', phone: '+237670000002', email: 'jane.smith@cameroonestates.com' },
  },
  {
    id: '3',
    name: 'Cozy Guesthouse in Douala',
    type: 'guesthouse',
    location: 'Douala',
    price: 15000,
    currency: 'XAF', // Per night
    description: 'A charming and cozy guesthouse in the heart of Douala, perfect for travelers. Offers comfortable rooms and a friendly atmosphere.',
    address: '789 City Center St, Douala',
    bedrooms: 10, // Number of rooms
    amenities: ['WiFi', 'Breakfast Included', 'Daily Cleaning', 'Shared Lounge'],
    images: [
      { url: 'https://placehold.co/800x600.png', alt: 'Guesthouse exterior', hint: 'charming guesthouse' },
      { url: 'https://placehold.co/800x600.png', alt: 'Sample room', hint: 'cozy bedroom' },
    ],
    agent: { name: 'Michael B.', phone: '+237670000003', email: 'michael.b@cameroonestates.com' },
  },
  {
    id: '4',
    name: 'Luxury Hotel Suite, Douala',
    type: 'hotel',
    location: 'Douala',
    price: 120000,
    currency: 'XAF', // Per night
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
    name: 'Affordable House in Limbe',
    type: 'house',
    location: 'Limbe',
    price: 35000000,
    currency: 'XAF',
    description: 'A well-maintained and affordable house in a quiet neighborhood of Limbe. Ideal for families.',
    address: '22 Peace Valley, Limbe',
    bedrooms: 3,
    bathrooms: 2,
    areaSqMeters: 150,
    amenities: ['Parking', 'Garden'],
    images: [
      { url: 'https://placehold.co/800x600.png', alt: 'House exterior', hint: 'simple house' },
      { url: 'https://placehold.co/800x600.png', alt: 'Living area', hint: 'modest living room' },
    ],
    agent: { name: 'Peter K.', phone: '+237670000005', email: 'peter.k@cameroonestates.com' },
  },
    {
    id: '6',
    name: 'Commercial Land in Douala',
    type: 'land',
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
];

export async function getProperties(filters?: {
  type?: PropertyType | 'all';
  location?: PropertyLocation | 'all';
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Property[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let filteredProperties = mockProperties;

  if (filters) {
    if (filters.type && filters.type !== 'all') {
      filteredProperties = filteredProperties.filter(p => p.type === filters.type);
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
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockProperties.find(p => p.id === id);
}

export async function getFeaturedProperties(): Promise<Property[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockProperties.filter(p => p.isFeatured);
}

type SubmitBookingRequestData = Omit<BookingRequest, 'id' | 'status' | 'createdAt'>;

export async function submitBookingRequest(bookingData: SubmitBookingRequestData): Promise<string> {
  // Simulate API delay and booking submission
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const fullBookingData: BookingRequest = {
    id: `booking_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    ...bookingData,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  
  console.log('Booking request submitted:', fullBookingData);
  // In a real app, this would write to Firestore.
  return fullBookingData.id;
}
