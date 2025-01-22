"use client";

import { useState } from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store"; // Ensure this imports the correct RootState type
import { logoutUser } from "@/lib/redux/features/authSlice";

interface NavItem {
  href: string;
  label: string;
}

export default function Header() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>(); 
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async (): Promise<void> => {
    try {
      // Perform the logout operation using the correct Redux action
      dispatch(logoutUser());
    } catch (e) {
      if (e instanceof Error) {
        console.error("Error occurred:", e.message);
      }
    }
  };

  const authenticatedNavItems: NavItem[] = [
    { href: "/", label: "Home" },
    { href: `/dashboard/${user?.role}`, label: "Dashboard" },
    { href: `/profile/${user?.role}`, label: "Profile" },
    { href: "/appointments", label: "Appointments" },
  ];

  return (
    <header className="bg-gray-800 bg-opacity-50 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            WellVisit
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-8">
            {user != null &&
              authenticatedNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white hover:text-purple-300 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>

          <div className="hidden md:block">
            {user ? (
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="mr-4">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="secondary">Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6 text-white" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] bg-gray-800 bg-opacity-95 backdrop-blur-lg"
            >
              <nav className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-8">
                  <Link
                    href="/"
                    className="text-2xl font-bold text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    WellVisit
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-6 w-6 text-white" />
                  </Button>
                </div>
                <ul className="flex flex-col space-y-4">
                  {user &&
                    authenticatedNavItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="text-white hover:text-purple-300 transition-colors text-lg"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                </ul>
                <div className="mt-auto mb-8">
                  {user ? (
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <Link href="/login">
                        <Button variant="outline" className="w-full">
                          Login
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button variant="secondary" className="w-full">
                          Register
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}
