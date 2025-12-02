// components/navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import ThemeToggle from '../theme-toggle';

const navLinks = [ 
  { name: 'Why FormIQ', href: '#why' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Features', href: '#features' }, 
  { name: 'Docs', href: '/docs' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setIsMobileOpen(false);
      }
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`  top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? '  backdrop-blur-sm border-b border-neutral-200  dark:border-neutral-800  '
          : ' border-none'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-2"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-neutral-900 dark:text-white"
              >
                <rect
                  width="32"
                  height="32"
                  rx="6"
                  className="fill-neutral-900 dark:fill-white"
                />
                <path
                  d="M10 12h12M10 16h8M10 20h10"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="dark:stroke-neutral-900"
                />
              </svg>
              <span className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                FormIQ
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                {navLinks.map((link) => (
                  <NavigationMenuItem className='bg-transperant' key={link.name}>
                    <Link href={link.href} legacyBehavior passHref >
                          
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                        onClick={(e) => smoothScroll(e as any, link.href)} 
                      >
                        <span className="text-sm font-medium text-zinc-600 dark:text-neutral-400 hover:text-zinc-900 dark:hover:text-white  transition-colors ">
                          {link.name}
                        </span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/auth">
              <Button
                variant="ghost"
                className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                Login
              </Button>
            </Link>
            <Link href="/docs">
              <Button
                className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 font-medium"
                size="sm"
              >
                Get Started
              </Button>
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <div className="flex flex-col h-full p-4">
                {/* Mobile Logo */}
                <div className="flex items-center space-x-2 mb-8">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-neutral-900 dark:text-white"
                  >
                    <rect
                      width="32"
                      height="32"
                      rx="6"
                      className="fill-neutral-900 dark:fill-white"
                    />
                    <path
                      d="M10 12h12M10 16h8M10 20h10"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="dark:stroke-neutral-900"
                    />
                  </svg>
                  <span className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
                    FormIQ
                  </span>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col space-y-1 flex-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={(e) => smoothScroll(e, link.href)}
                      className="px-3 py-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-md transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                <Separator className="my-4" />

                {/* Mobile CTA Buttons */}
                <div className="flex flex-col space-y-4">
                  <Link href="/auth">
                    <Button
                      variant="outline"
                      className="w-full font-medium"
                      size="sm"
                    >
                      Login
                    </Button>
                  <Link href="/docs">
                  </Link>
                    <Button
                      className="w-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 font-medium"
                      size="sm"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
                  
        </div>
      </nav>
    </motion.header>
  );
}
