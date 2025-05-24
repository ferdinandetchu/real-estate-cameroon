
import Link from 'next/link';
import { Home } from 'lucide-react';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-2xl font-bold text-primary hover:text-primary/80 transition-colors ${className}`}>
      <Home className="h-8 w-8" />
      <span>Crown Homes</span>
    </Link>
  );
}
