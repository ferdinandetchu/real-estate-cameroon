'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BookingForm } from '@/components/forms/BookingForm';
import type { Property } from '@/lib/types';

type BookingModalProps = {
  property: Property;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BookingModal({ property, isOpen, onOpenChange }: BookingModalProps) {
  const handleSuccess = () => {
    onOpenChange(false); // Close modal on successful submission
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">Book a Session</DialogTitle>
          <DialogDescription>
            Schedule a meeting with an agent for "{property.name}". Please fill out your details below.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <BookingForm property={property} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
