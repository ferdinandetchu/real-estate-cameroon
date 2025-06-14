
'use client';

import { useState, useEffect } from 'react';
import type { Property, BookingRequest } from '@/lib/types';
import { PropertyImageGallery } from '@/components/properties/PropertyImageGallery';
import { BookingModal } from '@/components/modals/BookingModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Tag, BedDouble, Bath, Maximize, LandPlot, Building, Home, Users, CalendarDays, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getUserDashboardBookings } from '@/lib/data'; // Import the data fetching function

type PropertyDetailViewProps = {
  property: Property;
};

export function PropertyDetailView({ property }: PropertyDetailViewProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [clientFormattedPrice, setClientFormattedPrice] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const router = useRouter();

  const [showMapSection, setShowMapSection] = useState(false);
  const [checkingBookings, setCheckingBookings] = useState(false);

  useEffect(() => {
    // Format price on the client after hydration
    try {
      setClientFormattedPrice(
        new Intl.NumberFormat('fr-CM', { style: 'currency', currency: property.currency }).format(property.price)
      );
    } catch (e) {
      console.error("Error formatting price:", e);
      // Fallback to a simple display if Intl fails
      setClientFormattedPrice(`${property.price} ${property.currency}`);
    }
  }, [property.price, property.currency]);

  useEffect(() => {
    const checkUserBookings = async () => {
      if (currentUser && property) {
        setCheckingBookings(true);
        setShowMapSection(false); // Reset while checking
        try {
          const bookings = await getUserDashboardBookings(currentUser.uid);
          const hasConfirmedBookingForProperty = bookings.some(
            (booking) => booking.propertyId === property.id && booking.status === 'confirmed'
          );
          setShowMapSection(hasConfirmedBookingForProperty);
        } catch (error) {
          console.error("Failed to check user bookings for map display:", error);
          setShowMapSection(false); // Default to not showing map on error
        } finally {
          setCheckingBookings(false);
        }
      } else {
        setShowMapSection(false); // No user, no map shown based on prior bookings
        setCheckingBookings(false);
      }
    };

    checkUserBookings();
  }, [currentUser, property]);


  const getPropertyTypeIcon = (type: Property['type']) => {
    switch (type) {
      case 'house': return <Home className="w-5 h-5 mr-2 text-primary" />;
      case 'land': return <LandPlot className="w-5 h-5 mr-2 text-primary" />;
      case 'guesthouse': return <Users className="w-5 h-5 mr-2 text-primary" />;
      case 'hotel': return <Building className="w-5 h-5 mr-2 text-primary" />;
      default: return <Home className="w-5 h-5 mr-2 text-primary" />;
    }
  };

  const displayPrice = clientFormattedPrice || `${property.price} ${property.currency}`; 

  const getPriceSuffix = () => {
    if (property.listingType === 'rent') {
      if (property.type === 'house' || property.type === 'land') {
        return '/month';
      }
      if (property.type === 'guesthouse' || property.type === 'hotel') {
        return '/night';
      }
    }
    return '';
  };

  const handleBookSessionClick = () => {
    if (currentUser) {
      setIsBookingModalOpen(true);
    } else {
      router.push('/auth/login?redirect=/properties/' + property.id); 
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
        <div>
          <PropertyImageGallery images={property.images} propertyName={property.name} />
        </div>
        <div className="space-y-4 sm:space-y-6">
          <Badge variant="secondary" className="capitalize text-xs sm:text-sm py-1 px-2 sm:px-3">
            {property.listingType === 'rent' ? `${property.type} for Rent` : property.type}
          </Badge>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">{property.name}</h1>
          
          <div className="text-sm sm:text-base text-muted-foreground">
            <div className="flex items-start">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary mt-1 shrink-0" />
                <div>
                    <p>{property.address}</p>
                    <p>{property.location}</p>
                </div>
            </div>
          </div>

          <div className="text-2xl sm:text-3xl font-bold text-accent flex items-center">
            <Tag className="w-6 h-6 sm:w-7 sm:h-7 mr-2" />
            {displayPrice}
            {getPriceSuffix() && <span className="text-sm sm:text-base text-muted-foreground ml-2">{getPriceSuffix()}</span>}
          </div>
          
          <Button 
            onClick={handleBookSessionClick} 
            size="lg" 
            className="w-full md:w-auto text-sm sm:text-base lg:text-lg py-2.5 px-5 sm:py-3 sm:px-6 bg-accent hover:bg-accent/90"
          >
            <CalendarDays className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Book a Session
          </Button>

          <Separator />

          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base text-foreground/90">
            {property.bedrooms && (
              <div className="flex items-center">
                <BedDouble className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" /> {property.bedrooms} Bedrooms
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center">
                <Bath className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" /> {property.bathrooms} Bathrooms
              </div>
            )}
            {property.areaSqMeters && (
              <div className="flex items-center">
                {property.type === 'land' ? <LandPlot className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" /> : <Maximize className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />}
                {property.areaSqMeters} m²
              </div>
            )}
             <div className="flex items-center col-span-2 md:col-span-1">
                {getPropertyTypeIcon(property.type)} <span className="capitalize">{property.type}</span>
              </div>
          </div>
        </div>
      </div>

      <Separator className="my-6 sm:my-8 md:my-12" />

      <div className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-3">Property Description</h2>
          <p className="text-sm sm:text-base text-foreground/80 leading-relaxed whitespace-pre-line">{property.description}</p>
        </div>

        {property.amenities && property.amenities.length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">Amenities</h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 text-sm sm:text-base">
              {property.amenities.map((amenity) => (
                <li key={amenity} className="flex items-center text-foreground/80">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary shrink-0"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {amenity}
                </li>
              ))}
            </ul>
          </div>
        )}
      
        <Separator className="my-6 sm:my-8" />
        
        {checkingBookings ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-3 text-muted-foreground">Checking booking status for map...</p>
          </div>
        ) : showMapSection ? (
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">Location on Map</h2>
            <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden shadow flex items-center justify-center">
              <Image 
                src={`https://placehold.co/800x450.png?text=${encodeURIComponent('Map: ' + property.address)}`} 
                alt={`Map showing approximate location of ${property.name}`}
                width={800}
                height={450}
                className="object-cover w-full h-full"
                data-ai-hint="map location"
              />
            </div>
            <Button asChild variant="outline">
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(property.address + ', ' + property.location)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <MapPin className="mr-2 h-4 w-4" /> View on Google Maps
              </a>
            </Button>
          </div>
        ) : (
          <div className="py-4 text-center text-muted-foreground bg-card border rounded-md p-4">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="font-semibold">Map information is available after confirming your booking.</p>
            <p className="text-sm">This helps maintain privacy and security for our property owners.</p>
          </div>
        )}


        <Separator className="my-6 sm:my-8" />

        <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-3">Contact Agent</h2>
            <p className="text-sm sm:text-base text-foreground/80"><strong>Name:</strong> {property.agent.name}</p>
            <p className="text-sm sm:text-base text-foreground/80"><strong>Phone:</strong> <a href={`tel:${property.agent.phone}`} className="text-accent hover:underline">{property.agent.phone}</a></p>
            <p className="text-sm sm:text-base text-foreground/80"><strong>Email:</strong> <a href={`mailto:${property.agent.email}`} className="text-accent hover:underline">{property.agent.email}</a></p>
        </div>
      </div>


      {isBookingModalOpen && currentUser && ( 
        <BookingModal
          property={property}
          isOpen={isBookingModalOpen}
          onOpenChange={setIsBookingModalOpen}
        />
      )}
    </>
  );
}
