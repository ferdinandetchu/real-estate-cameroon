
'use client';

import type { Property, UserPropertyRental } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Tag, CalendarCheck, CalendarX } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';

type PropertyListItemProps = {
  property: Property & { rentalDetails?: UserPropertyRental };
};

export function PropertyListItem({ property }: PropertyListItemProps) {
  const [clientFormattedPrice, setClientFormattedPrice] = useState<string | null>(null);
  const [clientFormattedRentalEndDate, setClientFormattedRentalEndDate] = useState<string | null>(null);

  const { rentalDetails } = property;

  useEffect(() => {
    try {
      let priceToFormat = property.price;
      if (rentalDetails) {
        priceToFormat = rentalDetails.monthlyPrice;
      }
      setClientFormattedPrice(
        new Intl.NumberFormat('fr-CM', { style: 'currency', currency: property.currency }).format(priceToFormat)
      );
    } catch (e) {
      console.error("Error formatting price:", e);
      setClientFormattedPrice(`${rentalDetails ? rentalDetails.monthlyPrice : property.price} ${property.currency}`);
    }

    if (rentalDetails?.rentEndDate) {
      try {
        setClientFormattedRentalEndDate(format(parseISO(rentalDetails.rentEndDate), 'PPP')); // e.g., Jun 21, 2024
      } catch (e) {
        console.error("Error formatting rental end date:", e);
        setClientFormattedRentalEndDate('Invalid Date');
      }
    }

  }, [property, rentalDetails]);

  const displayPrice = clientFormattedPrice || `${rentalDetails ? rentalDetails.monthlyPrice : property.price} ${property.currency}`; 

  const getPriceSuffix = () => {
    if (property.listingType === 'rent' || rentalDetails) { // If it's a rental or has rental details
      // Guesthouses/Hotels are per night even if part of a rental agreement (though this simulation is basic)
      if (property.type === 'guesthouse' || property.type === 'hotel') {
         return '/night'; // Or adjust if UserPropertyRental implies monthly for these too
      }
      return '/month';
    }
    // For 'sale' listings, no suffix
    return '';
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col sm:flex-row gap-4">
      <Link href={`/properties/${property.id}`} className="block sm:w-1/3 shrink-0">
        <div className="relative aspect-video sm:aspect-square rounded-md overflow-hidden">
          <Image
            src={rentalDetails?.propertyImageUrl || property.images[0].url}
            alt={rentalDetails?.propertyName || property.images[0].alt}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover"
            data-ai-hint={property.images[0].hint || 'property exterior'}
          />
        </div>
      </Link>
      <div className="flex flex-col justify-between flex-grow">
        <div>
          {rentalDetails ? (
             <Badge variant="default" className="capitalize text-xs mb-1 bg-green-600 hover:bg-green-700 text-white">
                Currently Rented
            </Badge>
          ) : (
            <Badge variant="secondary" className="capitalize text-xs mb-1">
              {property.listingType === 'rent' ? `${property.type} for Rent` : `${property.type} for Sale`}
            </Badge>
          )}
          <h3 className="text-lg font-semibold text-primary hover:underline">
            <Link href={`/properties/${property.id}`}>{rentalDetails?.propertyName || property.name}</Link>
          </h3>
          <div className="text-sm text-muted-foreground flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1.5" /> {rentalDetails?.propertyAddress || `${property.address}, ${property.location}`}
          </div>
          <div className="text-md font-semibold text-accent flex items-center mt-2">
            <Tag className="w-4 h-4 mr-1.5" />
            {displayPrice}
            {getPriceSuffix() && <span className="text-xs text-muted-foreground ml-1">{getPriceSuffix()}</span>}
          </div>

          {rentalDetails && (
            <div className="mt-2 space-y-1 text-sm">
              <p className="flex items-center text-green-700">
                <CalendarCheck className="w-4 h-4 mr-1.5" />
                Rent valid until: <span className="font-medium ml-1">{clientFormattedRentalEndDate || 'N/A'}</span>
              </p>
              <p className="flex items-center text-muted-foreground">
                <CalendarX className="w-4 h-4 mr-1.5" /> {/* Using CalendarX as a placeholder for 'paid for' concept */}
                Paid for: <span className="font-medium ml-1">{rentalDetails.monthsPaid} month(s)</span>
              </p>
            </div>
          )}
        </div>
        <div className="mt-3">
          <Button asChild variant={rentalDetails ? "secondary" : "outline"} size="sm">
            <Link href={`/properties/${property.id}`}>
                {rentalDetails ? "View Rental Details" : "View Property"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
