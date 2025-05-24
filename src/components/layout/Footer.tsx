
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-2">Crown Homes</h3>
            <p className="text-sm text-muted-foreground">Your gateway to properties in Cameroon.</p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/properties" className="hover:text-primary transition-colors">Properties</Link></li>
              {/* <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li> */}
              {/* <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li> */}
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-2">Contact Us</h4>
            <p className="text-sm text-muted-foreground">Buea, Cameroon</p>
            <p className="text-sm text-muted-foreground">Email: info@crownhomes.com</p>
            <p className="text-sm text-muted-foreground">Phone: +237 123 456 789</p>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Crown Homes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
