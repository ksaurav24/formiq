// components/hero.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, FileText } from 'lucide-react';
import { CodeBlock } from '../ui/code-block';
import { Spotlight } from '@/components/ui/spotlight'; 
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';

export default function Hero() {
  const code=`import Formiq from 'formiq-sdk';
const formiq = new Formiq('api_key', 'project_id');

await formiq.submitForm({
  name: 'Saurav Kale',
  email: 'saurav@devxsaurav.in',
  message: 'Hello FormIQ!'
});`;
  return (
    <section className="relative pt-16 min-h-screen flex items-center justify-center overflow-hidden">
      {/* Spotlight Effect */}
      <div className="absolute dark:bg-black inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_100%,#000_70%,transparent_110%)]" />

      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="rgba(0, 0, 0, 0.05)"
      />
      
      {/* Grid Background */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="absolute inset-0 bg-grid-neutral-100 dark:bg-grid-neutral-900 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center mb-0"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 dark:border-neutral-800 bg-blue-50/50 dark:bg-neutral-950/50 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 dark:bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-white"></span>
              </span>
              <span className="text-xs font-medium text-blue-700 dark:text-neutral-400">
                Now in Public Beta
              </span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-6"
          >
            <span className='opacity-70'>Turn your </span><span className='opacity-100 font-bold'>static site forms </span> <span className='opacity-70'>into{' '}</span>
            <span className="relative inline-block mb-2 lg:mb-0">
              <span className="relative z-10 font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-white dark:to-white text-transparent bg-clip-text">smart, connected forms</span>
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 600 80"
                preserveAspectRatio="none"
                className="absolute -bottom-4 left-0 w-full h-8"
              >
                <motion.path
                  d="M10 60 C200 100, 400 10, 590 55"
                  stroke="currentColor"
                  className="text-blue-600 dark:text-white"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="transparent"
                />
              </motion.svg>
            </span>{' '}
            <span className='opacity-70'>that </span> <span className="italic font-bold">actually work</span>.
          </motion.h1>

          {/* Subheading with Text Generate Effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto mb-10"
          >
            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
              A simple API + SDK for frontend developers to handle contact or feedback 
              forms directly from static websites and portfolios.{' '}
              <span className="font-medium text-neutral-900 dark:text-white">
                Secure, fast, and zero-setup.
              </span>
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            {/* Primary CTA */}
            <Link href="/auth" className='cursor-pointer'>
              <HoverBorderGradient
                containerClassName="rounded-lg"
                className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-6 py-3 flex items-center gap-2 font-medium cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
                <ArrowRight className="w-4 h-4 ml-1" />
              </HoverBorderGradient>
            </Link>

            {/* Secondary CTAs */}
            <div className="flex items-center gap-3">
              <Link href="/docs">
                <Button
                  variant="outline"
                  className="border-neutral-200 dark:border-neutral-800 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-neutral-900 dark:hover:border-blue-700/40 font-medium transition-colors"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Docs
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Code Preview or Visual Element */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 mb-12 max-w-4xl mx-auto"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 via-purple-200/20 to-blue-200/20 dark:from-transparent dark:via-neutral-800 dark:to-transparent blur-3xl opacity-30 dark:opacity-20" />
              <div className="relative rounded-xl border border-blue-200/50 dark:border-neutral-800 bg-zinc-100/80 dark:bg-neutral-900 p-6 shadow-2xl hover:border-blue-300 dark:hover:border-blue-700/40 transition-colors">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <pre className="text-left text-sm overflow-x-auto">
                  <CodeBlock language="javascript" filename='script.js' code={code}/>
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
