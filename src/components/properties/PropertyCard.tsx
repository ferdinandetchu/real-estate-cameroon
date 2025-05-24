import Link from 'next/link';
import Image from 'next/image';
import type { Property } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BedDouble, Bath, LandPlot, Maximize, MapPin, Tag } from 'lucide-react';

type PropertyCardProps = {
  property: Property;
};

export function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: currency }).format(price);
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0 relative">
        <Link href={`/properties/${property.id}`} className="block">
          <Image
            src={property.images[0].url}
            alt={property.images[0].alt}
            width={400}
            height={250}
            className="w-full h-56 object-cover"
            data-ai-hint={property.images[0].hint || 'property exterior'}
          />
        </Link>
        <Badge variant="secondary" className="absolute top-2 right-2 capitalize">{property.type}</Badge>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg mb-1">
          <Link href={`/properties/${property.id}`} className="hover:text-primary transition-colors">
            {property.name}
          </Link>
        </CardTitle>
        <div className="text-sm text-muted-foreground mb-2 flex items-center">
          <MapPin className="w-4 h-4 mr-1" /> {property.location}
        </div>
        <p className="text-sm text-foreground/80 line-clamp-2 mb-3">{property.description}</p>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          {property.bedrooms && (
            <div className="flex items-center">
              <BedDouble className="w-4 h-4 mr-1 text-primary" /> {property.bedrooms} Beds
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1 text-primary" /> {property.bathrooms} Baths
            </div>
          )}
          {property.areaSqMeters && (
            <div className="flex items-center">
              <Maximize className="w-4 h-4 mr-1 text-primary" /> {property.areaSqMeters} m²
            </div>
          )}
           {property.type === 'land' && property.areaSqMeters && (
             <div className="flex items-center col-span-2">
               <LandPlot className="w-4 h-4 mr-1 text-primary" /> {property.areaSqMeters} m²
             </div>
           )}
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t">
        <p className="text-xl font-semibold text-primary flex items-center">
           <Tag className="w-5 h-5 mr-2" /> {formatPrice(property.price, property.currency)}
           { (property.type === 'guesthouse' || property.type === 'hotel') && <span className="text-xs text-muted-foreground ml-1">/night</span>}
        </p>
        <Button asChild size="sm" variant="default">
          <Link href={`/properties/${property.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
