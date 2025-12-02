// app/not-found.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, FileQuestion, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-[150px] sm:text-[200px] font-bold leading-none text-white/10 select-none">
            404
          </h1>
        </motion.div>

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <div className="w-16 h-16 rounded-2xl border-2 border-neutral-800 bg-neutral-950 flex items-center justify-center">
            <FileQuestion className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl sm:text-4xl font-bold text-white mb-4"
        >
          Page not found
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg text-neutral-400 mb-8 max-w-md mx-auto"
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link href="/">
            <Button className="bg-white text-black hover:bg-neutral-200 font-medium w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link> 
        </motion.div>

        {/* Search or Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="border-t border-neutral-800 pt-8"
        >
          <p className="text-sm text-neutral-500 mb-4">Quick links:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/docs"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Documentation
            </Link>
            <span className="text-neutral-800">•</span>
            <Link
              href="/help"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Help Center
            </Link>
            <span className="text-neutral-800">•</span>
            <Link
              href="/docs/quick-start"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Quick Start
            </Link>
            <span className="text-neutral-800">•</span>
            <Link
              href="https://github.com/ksaurav24/formiq"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              GitHub
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
