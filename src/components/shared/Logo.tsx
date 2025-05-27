
import Link from 'next/link';
import Image from 'next/image'; // Import the Next.js Image component

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-2xl font-bold text-primary hover:text-primary/80 transition-colors ${className}`}>
      <Image
        // Replace this src with the path to your actual logo in the /public directory
        // e.g., if your logo is at public/logo.png, use src="/logo.png"
        src="https://placehold.co/140x40.png" // Placeholder for user's image logo
        alt="Crown Homes Logo"
        width={140} // Adjust width as needed
        height={40} // Adjust height as needed
        className="rounded-md" // Added rounded borders
        data-ai-hint="company logo" // Hint for AI or future replacement
      />
      {/* The text "Crown Homes" might be redundant if it's part of your logo image.
          You can remove the span below if your logo image already contains the name.
      */}
      {/* <span>Crown Homes</span> */}
    </Link>
  );
}
