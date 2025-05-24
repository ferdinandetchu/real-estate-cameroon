import { getPropertyById } from '@/lib/data';
import { PropertyDetailView } from './components/PropertyDetailView';
import { notFound } from 'next/navigation';

type PropertyDetailPageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: PropertyDetailPageProps) {
  const property = await getPropertyById(params.id);
  if (!property) {
    return {
      title: 'Property Not Found',
    };
  }
  return {
    title: `${property.name} - Cameroon Estates Discovery`,
    description: property.description.substring(0, 160),
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const property = await getPropertyById(params.id);

  if (!property) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <PropertyDetailView property={property} />
    </div>
  );
}
