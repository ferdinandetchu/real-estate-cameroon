import { getFeaturedProperties } from '@/lib/data';
import { PropertyList } from './PropertyList';

export async function FeaturedProperties() {
  const featuredProperties = await getFeaturedProperties();

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-primary">
          Featured Properties
        </h2>
        {featuredProperties.length > 0 ? (
          <PropertyList properties={featuredProperties} />
        ) : (
          <p className="text-center text-muted-foreground">No featured properties available at the moment.</p>
        )}
      </div>
    </section>
  );
}
