
import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export function Navbar() {
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/properties', label: 'Properties' },
    // { href: '/agents', label: 'Agents' }, // Future link
    // { href: '/contact', label: 'Contact Us' }, // Future link
  ];

  // Placeholder for authentication status - in a real app, this would come from a context or hook
  const isAuthenticated = false; 

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Logo />
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              {/* <Button variant="outline">Profile</Button>
              <Button variant="ghost">Logout</Button> */}
              <p className="text-sm text-muted-foreground">User Logged In (Placeholder)</p>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 p-4">
              <Logo className="mb-4"/>
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-lg transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex flex-col space-y-2 pt-4 border-t">
                   {isAuthenticated ? (
                    <>
                      {/* <Button variant="outline" className="w-full">Profile</Button>
                      <Button variant="ghost" className="w-full">Logout</Button> */}
                       <p className="text-sm text-center text-muted-foreground">User Logged In (Placeholder)</p>
                    </>
                    ) : (
                    <>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/auth/login">Login</Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link href="/auth/signup">Sign Up</Link>
                      </Button>
                    </>
                    )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
