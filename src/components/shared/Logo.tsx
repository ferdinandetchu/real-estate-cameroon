
import Link from 'next/link';
import { Home } from 'lucide-react'; // Import the Home icon

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-2xl font-bold text-primary hover:text-primary/80 transition-colors ${className}`}>
      <Home className="h-7 w-7" /> {/* Use the Home icon */}
      <span>Property Get</span> {/* Display the text "Property Get" */}
    </Link>
  );
}
