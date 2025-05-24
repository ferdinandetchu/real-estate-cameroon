
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { propertyTypes, propertyLocations, type PropertyType, type PropertyLocation } from '@/lib/types';
import { Search } from 'lucide-react';
import { Label } from '@/components/ui/label';

type PropertySearchBarProps = {
  className?: string;
  defaultType?: PropertyType | 'all';
  defaultLocation?: PropertyLocation | 'all';
  defaultSearchTerm?: string;
  defaultMinPrice?: string;
  defaultMaxPrice?: string;
};

export function PropertySearchBar({ 
  className, 
  defaultType = 'all', 
  defaultLocation = 'all', 
  defaultSearchTerm = '',
  defaultMinPrice = '',
  defaultMaxPrice = ''
}: PropertySearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || defaultSearchTerm);
  const [type, setType] = useState<PropertyType | 'all'>((searchParams.get('type') as PropertyType | 'all') || defaultType);
  const [location, setLocation] = useState<PropertyLocation | 'all'>((searchParams.get('location') as PropertyLocation | 'all') || defaultLocation);
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || defaultMinPrice);
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || defaultMaxPrice);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (type !== 'all') params.set('type', type);
    if (location !== 'all') params.set('location', location);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 md:p-6 rounded-lg shadow-lg bg-card ${className}`}
    >
      <div className="md:col-span-4">
        <Input
          type="text"
          placeholder="Search by keyword (e.g. Buea, villa)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10 sm:h-12" // Adjusted height, text size from base Input
        />
      </div>
      
      <div className="md:col-span-2">
        <Select value={type} onValueChange={(value) => setType(value as PropertyType | 'all')}>
          <SelectTrigger className="h-10 sm:h-12"> {/* Text size from base SelectTrigger */}
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {propertyTypes.map((pt) => (
              <SelectItem key={pt} value={pt} className="capitalize">
                {pt.charAt(0).toUpperCase() + pt.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-2">
        <Select value={location} onValueChange={(value) => setLocation(value as PropertyLocation | 'all')}>
          <SelectTrigger className="h-10 sm:h-12"> {/* Text size from base SelectTrigger */}
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {propertyLocations.map((pl) => (
              <SelectItem key={pl} value={pl}>
                {pl}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-2 space-y-1">
        <Label htmlFor="minPrice" className="text-xs sm:text-sm font-medium text-muted-foreground">Min Price (XAF)</Label>
        <Input
          id="minPrice"
          type="number"
          placeholder="e.g. 10000000"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="h-10 sm:h-12" // Adjusted height, text size from base Input
          min="0"
        />
      </div>

      <div className="md:col-span-2 space-y-1">
        <Label htmlFor="maxPrice" className="text-xs sm:text-sm font-medium text-muted-foreground">Max Price (XAF)</Label>
        <Input
          id="maxPrice"
          type="number"
          placeholder="e.g. 50000000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="h-10 sm:h-12" // Adjusted height, text size from base Input
          min="0"
        />
      </div>
      
      <Button type="submit" className="md:col-span-4 h-10 sm:h-12 text-sm sm:text-base lg:text-lg bg-accent hover:bg-accent/90">
        <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Find Property
      </Button>
    </form>
  );
}
