
'use client';

import type { Property } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';

type PropertyListItemProps = {
  property: Property;
};

export function PropertyListItem({ property }: PropertyListItemProps) {
  const [clientFormattedPrice, setClientFormattedPrice] = useState<string | null>(null);

  useEffect(() => {
    // Format price on the client after hydration
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

  return (
    <div className="bg-card p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col sm:flex-row gap-4">
      <Link href={`/properties/${property.id}`} className="block sm:w-1/3 shrink-0">
        <div className="relative aspect-video sm:aspect-square rounded-md overflow-hidden">
          <Image
            src={property.images[0].url}
            alt={property.images[0].alt}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover"
            data-ai-hint={property.images[0].hint || 'property exterior'}
          />
        </div>
      </Link>
      <div className="flex flex-col justify-between flex-grow">
        <div>
          <Badge variant="secondary" className="capitalize text-xs mb-1">
            {property.listingType === 'rent' ? `${property.type} for Rent` : `${property.type} for Sale`}
          </Badge>
          <h3 className="text-lg font-semibold text-primary hover:underline">
            <Link href={`/properties/${property.id}`}>{property.name}</Link>
          </h3>
          <div className="text-sm text-muted-foreground flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1.5" /> {property.address}, {property.location}
          </div>
          <div className="text-md font-semibold text-accent flex items-center mt-2">
            <Tag className="w-4 h-4 mr-1.5" />
            {displayPrice}
            {getPriceSuffix() && <span className="text-xs text-muted-foreground ml-1">{getPriceSuffix()}</span>}
          </div>
        </div>
        <div className="mt-3">
          <Button asChild variant="outline" size="sm">
            <Link href={`/properties/${property.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
