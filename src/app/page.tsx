import { FeaturedProperties } from '@/components/properties/FeaturedProperties';
import { PropertySearchBar } from '@/components/search/PropertySearchBar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/30 via-background to-background">
        <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url('https://placehold.co/1920x1080.png?text=Cameroon+Landscape')" }}
            data-ai-hint="cameroon landscape"
          ></div>
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
            Discover Your Dream Property in Cameroon
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto">
            Explore a wide range of houses, lands, guesthouses, and hotels in Buea, Limbe, Douala, and beyond.
          </p>
          <div className="max-w-3xl mx-auto">
            <PropertySearchBar />
          </div>
          <div className="mt-12">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-6 text-lg">
              <Link href="/properties">View All Properties</Link>
            </Button>
          </div>
        </div>
      </section>

      <FeaturedProperties />

      {/* Call to Action Section - Optional */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Ready to Find Your Perfect Place?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Our expert agents are here to help you every step of the way.
            Contact us today for a personalized consultation.
          </p>
          <Button size="lg" variant="default" className="bg-primary hover:bg-primary/90">
            Contact an Agent
          </Button>
        </div>
      </section>
    </>
  );
}
