'use client';

import { useState } from 'react';
import type { Property } from '@/lib/types';
import { PropertyImageGallery } from '@/components/properties/PropertyImageGallery';
import { BookingModal } from '@/components/modals/BookingModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Tag, BedDouble, Bath, Maximize, LandPlot, Building, Home, Users, CalendarDays } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type PropertyDetailViewProps = {
  property: Property;
};

export function PropertyDetailView({ property }: PropertyDetailViewProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: currency }).format(price);
  };

  const getPropertyTypeIcon = (type: Property['type']) => {
    switch (type) {
      case 'house': return <Home className="w-5 h-5 mr-2 text-primary" />;
      case 'land': return <LandPlot className="w-5 h-5 mr-2 text-primary" />;
      case 'guesthouse': return <Users className="w-5 h-5 mr-2 text-primary" />;
      case 'hotel': return <Building className="w-5 h-5 mr-2 text-primary" />;
      default: return <Home className="w-5 h-5 mr-2 text-primary" />;
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <PropertyImageGallery images={property.images} propertyName={property.name} />
        </div>
        <div className="space-y-6">
          <Badge variant="secondary" className="capitalize text-sm py-1 px-3">{property.type}</Badge>
          <h1 className="text-3xl lg:text-4xl font-bold text-primary">{property.name}</h1>
          
          <div className="flex items-center text-muted-foreground">
            <MapPin className="w-5 h-5 mr-2 text-primary" />
            <span>{property.address}, {property.location}</span>
          </div>

          <div className="text-3xl font-bold text-accent flex items-center">
            <Tag className="w-7 h-7 mr-2" />
            {formatPrice(property.price, property.currency)}
            {(property.type === 'guesthouse' || property.type === 'hotel') && <span className="text-base text-muted-foreground ml-2">/night</span>}
          </div>
          
          <Button onClick={() => setIsBookingModalOpen(true)} size="lg" className="w-full md:w-auto text-lg py-3 px-6 bg-accent hover:bg-accent/90">
            <CalendarDays className="mr-2 h-5 w-5" /> Book a Session
          </Button>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-foreground/90">
            {property.bedrooms && (
              <div className="flex items-center">
                <BedDouble className="w-5 h-5 mr-2 text-primary" /> {property.bedrooms} Bedrooms
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center">
                <Bath className="w-5 h-5 mr-2 text-primary" /> {property.bathrooms} Bathrooms
              </div>
            )}
            {property.areaSqMeters && (
              <div className="flex items-center">
                {property.type === 'land' ? <LandPlot className="w-5 h-5 mr-2 text-primary" /> : <Maximize className="w-5 h-5 mr-2 text-primary" />}
                {property.areaSqMeters} m²
              </div>
            )}
             <div className="flex items-center col-span-2 md:col-span-1">
                {getPropertyTypeIcon(property.type)} <span className="capitalize">{property.type}</span>
              </div>
          </div>
        </div>
      </div>

      <Separator className="my-8 md:my-12" />

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-primary mb-3">Property Description</h2>
          <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{property.description}</p>
        </div>

        {property.amenities && property.amenities.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">Amenities</h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {property.amenities.map((amenity) => (
                <li key={amenity} className="flex items-center text-foreground/80">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary shrink-0"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {amenity}
                </li>
              ))}
            </ul>
          </div>
        )}
      
        <Separator className="my-8" />

        <div>
            <h2 className="text-2xl font-semibold text-primary mb-3">Contact Agent</h2>
            <p className="text-foreground/80"><strong>Name:</strong> {property.agent.name}</p>
            <p className="text-foreground/80"><strong>Phone:</strong> <a href={`tel:${property.agent.phone}`} className="text-accent hover:underline">{property.agent.phone}</a></p>
            <p className="text-foreground/80"><strong>Email:</strong> <a href={`mailto:${property.agent.email}`} className="text-accent hover:underline">{property.agent.email}</a></p>
        </div>
      </div>


      {isBookingModalOpen && (
        <BookingModal
          property={property}
          isOpen={isBookingModalOpen}
          onOpenChange={setIsBookingModalOpen}
        />
      )}
    </>
  );
}
