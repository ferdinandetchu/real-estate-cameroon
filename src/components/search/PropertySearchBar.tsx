'use client';

import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { propertyTypes, propertyLocations, type PropertyType, type PropertyLocation } from '@/lib/types';
import { Search } from 'lucide-react';

type PropertySearchBarProps = {
  className?: string;
  defaultType?: PropertyType | 'all';
  defaultLocation?: PropertyLocation | 'all';
  defaultSearchTerm?: string;
};

export function PropertySearchBar({ className, defaultType = 'all', defaultLocation = 'all', defaultSearchTerm = '' }: PropertySearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || defaultSearchTerm);
  const [type, setType] = useState<PropertyType | 'all'>((searchParams.get('type') as PropertyType | 'all') || defaultType);
  const [location, setLocation] = useState<PropertyLocation | 'all'>((searchParams.get('location') as PropertyLocation | 'all') || defaultLocation);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (type !== 'all') params.set('type', type);
    if (location !== 'all') params.set('location', location);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`grid grid-cols-1 md:grid-cols-4 gap-4 p-4 md:p-6 rounded-lg shadow-lg bg-card ${className}`}
    >
      <Input
        type="text"
        placeholder="Search by keyword (e.g. Buea, villa)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="md:col-span-2 h-12 text-base"
      />
      <Select value={type} onValueChange={(value) => setType(value as PropertyType | 'all')}>
        <SelectTrigger className="h-12 text-base">
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
      <Select value={location} onValueChange={(value) => setLocation(value as PropertyLocation | 'all')}>
        <SelectTrigger className="h-12 text-base">
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
      <Button type="submit" className="md:col-span-4 h-12 text-lg bg-accent hover:bg-accent/90">
        <Search className="mr-2 h-5 w-5" /> Find Property
      </Button>
    </form>
  );
}
