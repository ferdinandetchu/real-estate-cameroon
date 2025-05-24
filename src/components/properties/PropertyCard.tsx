
'use client'; 

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react'; 
import type { Property } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BedDouble, Bath, LandPlot, Maximize, MapPin, Tag } from 'lucide-react';

type PropertyCardProps = {
  property: Property;
};

export function PropertyCard({ property }: PropertyCardProps) {
  const [clientFormattedPrice, setClientFormattedPrice] = useState<string | null>(null);

  useEffect(() => {
    try {
      setClientFormattedPrice(
        new Intl.NumberFormat('fr-CM', { style: 'currency', currency: property.currency }).format(property.price)
      );
    } catch (e) {
      console.error("Error formatting price:", e);
      setClientFormattedPrice(`${property.price} ${property.currency}`);
    }
  }, [property.price, property.currency]);

  const displayPrice = clientFormattedPrice || `${property.price} ${property.currency}`; 

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0 relative">
        <Link href={`/properties/${property.id}`} className="block">
          <Image
            src={property.images[0].url}
            alt={property.images[0].alt}
            width={400}
            height={250}
            className="w-full h-48 sm:h-52 md:h-60 object-cover"
            priority={false} // Only first few images on page load should be priority
            data-ai-hint={property.images[0].hint || 'property exterior'}
          />
        </Link>
        <Badge variant="secondary" className="absolute top-2 right-2 capitalize text-xs px-1.5 py-0.5 sm:text-sm sm:px-2.5 sm:py-0.5">{property.type}</Badge>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 flex-grow">
        <CardTitle className="text-md sm:text-lg mb-1">
          <Link href={`/properties/${property.id}`} className="hover:text-primary transition-colors">
            {property.name}
          </Link>
        </CardTitle>
        <div className="text-xs sm:text-sm text-muted-foreground mb-2 flex items-center">
          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> {property.location}
        </div>
        <p className="text-xs sm:text-sm text-foreground/80 line-clamp-2 mb-3">{property.description}</p>
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
          {property.bedrooms && (
            <div className="flex items-center">
              <BedDouble className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-primary" /> {property.bedrooms} Beds
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center">
              <Bath className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-primary" /> {property.bathrooms} Baths
            </div>
          )}
          {property.areaSqMeters && (
            <div className="flex items-center">
              {property.type === 'land' ?
                <LandPlot className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-primary" /> :
                <Maximize className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-primary" />
              }
              {property.areaSqMeters} m²
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 flex justify-between items-center border-t">
        <p className="text-md sm:text-lg font-semibold text-primary flex items-center">
           <Tag className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" /> {displayPrice}
           { (property.type === 'guesthouse' || property.type === 'hotel') && <span className="text-[10px] sm:text-xs text-muted-foreground ml-1">/night</span>}
        </p>
        <Button asChild size="sm" variant="default" className="text-xs sm:text-sm px-2 sm:px-3">
          <Link href={`/properties/${property.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
