'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { PropertyImage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PropertyImageGalleryProps = {
  images: PropertyImage[];
  propertyName: string;
};

export function PropertyImageGallery({ images, propertyName }: PropertyImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
        No images available
      </div>
    );
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };
  
  const currentImage = images[currentIndex];

  return (
    <div className="relative">
      <div className="aspect-[16/10] relative overflow-hidden rounded-lg shadow-lg bg-muted">
        <Image
          src={currentImage.url}
          alt={currentImage.alt || `${propertyName} - Image ${currentIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-opacity duration-300 ease-in-out"
          priority={currentIndex === 0} // Prioritize loading the first image
          data-ai-hint={currentImage.hint || 'property detail'}
        />
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/70 hover:bg-background"
              onClick={handlePrev}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/70 hover:bg-background"
              onClick={handleNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'aspect-square rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring ring-offset-2 transition-all',
                currentIndex === index ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={image.alt || `Thumbnail ${index + 1}`}
                width={100}
                height={100}
                className="w-full h-full object-cover"
                data-ai-hint={image.hint || 'property thumbnail'}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
