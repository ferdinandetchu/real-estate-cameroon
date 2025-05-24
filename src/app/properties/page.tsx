
import { getProperties } from '@/lib/data';
import type { PropertyType, PropertyLocation, ListingType } from '@/lib/types';
import { PropertyList } from '@/components/properties/PropertyList';
import { PropertySearchBar } from '@/components/search/PropertySearchBar';
import type { SuspenseProps } from 'react'; // For potential Suspense usage

// Define a type for searchParams for clarity
interface PropertiesPageSearchParams {
  q?: string;
  type?: PropertyType | 'all';
  listingType?: ListingType | 'all'; // Added listingType
  location?: PropertyLocation | 'all';
  minPrice?: string;
  maxPrice?: string;
}

// Helper to ensure search param values are valid or default
function getValidatedSearchParam<T extends string>(value: string | undefined, allowedValues: readonly T[], defaultValue: T | 'all'): T | 'all' {
  if (value && (allowedValues.includes(value as T) || value === 'all')) {
    return value as T | 'all';
  }
  return defaultValue;
}


export default async function PropertiesPage({ searchParams }: { searchParams: PropertiesPageSearchParams }) {
  const searchTerm = searchParams.q || '';
  const type = searchParams.type || 'all';
  const listingType = searchParams.listingType || 'all'; // Added listingType
  const location = searchParams.location || 'all';
  const minPrice = searchParams.minPrice;
  const maxPrice = searchParams.maxPrice;

  // In a real app with client-side filtering after initial load, 
  // this fetch would be the initial dataset.
  // For server-side filtering based on URL params, this is correct.
  const properties = await getProperties({ 
    searchTerm, 
    type: type as PropertyType | 'all', 
    listingType: listingType as ListingType | 'all', // Pass listingType to getProperties
    location: location as PropertyLocation | 'all',
    minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
    maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
  });

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
        Explore Properties
      </h1>
      
      <div className="mb-10">
        <PropertySearchBar 
          defaultSearchTerm={searchTerm}
          defaultType={type as PropertyType | 'all'}
          // defaultListingType={listingType as ListingType | 'all'} // Prop for search bar if UI filter added
          defaultLocation={location as PropertyLocation | 'all'}
          defaultMinPrice={minPrice || ''}
          defaultMaxPrice={maxPrice || ''}
        />
      </div>
      
      {/* Property List Section */}
      {/* The PropertyList component will display what's fetched based on server-side interpretation of searchParams */}
      <PropertyList properties={properties} />
    </div>
  );
}

// Optional: Define fallback for Suspense if parts of this page were client-rendered with useSearchParams
export const fallback: SuspenseProps['fallback'] = <div>Loading properties...</div>;

