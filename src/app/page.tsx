
import { FeaturedProperties } from '@/components/properties/FeaturedProperties';
import { PropertySearchBar } from '@/components/search/PropertySearchBar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShieldCheck, Users, Camera } from 'lucide-react';

export default function HomePage() {
  const benefits = [
    {
      icon: <ShieldCheck className="w-12 h-12 text-accent mb-4" />,
      title: 'Verified Listings',
      description: 'Every property is carefully vetted to ensure accuracy and reliability, giving you peace of mind.',
    },
    {
      icon: <Users className="w-12 h-12 text-accent mb-4" />,
      title: 'Direct Agent Support',
      description: 'Connect directly with knowledgeable agents ready to assist you at every step of your property journey.',
    },
    {
      icon: <Camera className="w-12 h-12 text-accent mb-4" />,
      title: 'High-Quality Media',
      description: 'Explore properties through stunning photos and detailed virtual tours, bringing them to life.',
    },
  ];

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

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Why Choose Cameroon Estates Discovery?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                {benefit.icon}
                <h3 className="text-xl font-semibold text-primary mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
