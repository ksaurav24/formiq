// components/footer.tsx
'use client';

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-neutral-50 dark:bg-black border-t border-neutral-200 dark:border-neutral-800">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-transparent dark:via-transparent dark:to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            {/* Brand */}
            <div className="flex flex-col max-w-fit items-center md:items-start gap-3">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity" />
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative"
                  >
                    <rect 
                      width="32" 
                      height="32" 
                      rx="6" 
                      className="fill-neutral-900 dark:fill-white group-hover:fill-blue-600 dark:group-hover:fill-blue-500 transition-colors" 
                    />
                    <path
                      d="M10 12h12M10 16h8M10 20h10"
                      className="stroke-white dark:stroke-black group-hover:stroke-white transition-colors"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span className="text-lg font-semibold text-neutral-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 group-hover:text-transparent group-hover:bg-clip-text transition-all">
                  FormIQ
                </span>
              </Link>
              <p className="text-sm text-neutral-600 dark:text-neutral-500 text-center md:text-left max-w-xs">
                Simple form handling for static sites.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center lg:-ml-16 gap-x-6 gap-y-3 text-sm">
              <Link
                href="/docs"
                className="text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
              >
                Documentation
              </Link>
              <Link
                href="/help"
                className="text-neutral-600 dark:text-neutral-400 hover:text-purple-600 dark:hover:text-white transition-colors font-medium"
              >
                Help
              </Link>
              <Link
                href="/legal/privacy"
                className="text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
              >
                Privacy
              </Link>
              <Link
                href="/legal/terms"
                className="text-neutral-600 dark:text-neutral-400 hover:text-purple-600 dark:hover:text-white transition-colors font-medium"
              >
                Terms
              </Link>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/ksaurav24"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:bg-neutral-900 hover:border-blue-300 dark:hover:border-neutral-700 flex items-center justify-center transition-all group"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-neutral-700 dark:text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-white transition-colors" />
              </a>
              <a
                href="mailto:formiq@devxsaurav.in"
                className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 dark:hover:bg-neutral-900 hover:border-purple-300 dark:hover:border-neutral-700 flex items-center justify-center transition-all group"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-neutral-700 dark:text-neutral-400 group-hover:text-purple-600 dark:group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          <Separator className="bg-neutral-200 dark:bg-neutral-800 mb-6" />

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-neutral-600 dark:text-neutral-500">
            <p className="flex items-center gap-2">
              <span>© 2025 FormIQ.</span>
              <span className="hidden sm:inline">All rights reserved.</span>
            </p>
            <p className="flex items-center gap-1.5">
              <span>Built with</span>
              <span className="text-red-500 animate-pulse">♥</span>
              <span>by</span>
              <a
                href="https://devxsaurav.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-700 dark:text-neutral-400 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 dark:hover:from-blue-400 dark:hover:to-purple-400 hover:bg-clip-text font-medium transition-all"
              >
                ksaurav24
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
