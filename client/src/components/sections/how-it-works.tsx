// components/how-it-works-section.tsx
'use client';

import { motion } from 'framer-motion';
import { Download, Key, Code, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const steps = [
  {
    number: '01',
    title: 'Install FormIQ SDK',
    description: 'Add FormIQ to your project with a single command. Works with npm, yarn, pnpm, or bun.',
    icon: Download,
    code: 'npm install formiq-sdk',
    time: '30 seconds',
  },
  {
    number: '02',
    title: 'Get Your API Key',
    description: 'Sign up and create a project in the FormIQ dashboard. Copy your API key and project ID.',
    icon: Key,
    code: 'const formiq = new Formiq(apiKey, projectId);',
    time: '1 minute',
  },
  {
    number: '03',
    title: 'Add to Your Forms',
    description: 'Import the SDK and connect it to your forms with just a few lines of code.',
    icon: Code,
    code: 'await formiq.submitForm({ name, email, message });',
    time: '2 minutes',
  },
  {
    number: '04',
    title: 'Start Receiving Submissions',
    description: 'View, manage, and respond to form submissions from your dashboard or via API.',
    icon: CheckCircle,
    code: '// Submissions automatically stored',
    time: 'Instant',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32   dark:bg-black overflow-hidden">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#e5e5e5_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,#262626_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4 border-blue-300 dark:border-neutral-800 text-blue-700 dark:text-neutral-400 bg-blue-50 dark:bg-transparent">
              How It Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
              From zero to production
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
                in under 5 minutes
              </span>
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-500 max-w-2xl mx-auto">
              Four simple steps to handle forms on your static sites. No backend required.
            </p>
          </motion.div>

          {/* Steps - Vertical Layout */}
          <div className="relative space-y-8">
            {/* Vertical Timeline Line */}
            <div className="absolute left-8 md:left-12 top-16 bottom-16 w-0.5 bg-gradient-to-b from-blue-300 via-purple-300 to-blue-300 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800" />

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <Card className="border-blue-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-blue-400 dark:hover:border-neutral-700 hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6 md:p-8">
                      <div className="flex gap-6 md:gap-8">
                        {/* Icon & Number - Now on Timeline */}
                        <div className="flex flex-col items-center gap-3 shrink-0 relative">
                          <div className="relative z-10">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white dark:border-black bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <Icon className="w-7 h-7 md:w-9 md:h-9 text-white" />
                            </div>
                            {/* Step Number Badge */}
                            <div className="absolute -top-1 -right-1 w-7 h-7 md:w-8 md:h-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center text-xs md:text-sm font-bold border-2 border-white dark:border-black shadow-md">
                              {index + 1}
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 whitespace-nowrap">
                            {step.time}
                          </Badge>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-4 pt-2">
                          <div className="space-y-2">
                            <h3 className="text-xl md:text-2xl font-semibold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {step.title}
                            </h3>
                            <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                              {step.description}
                            </p>
                          </div>

                          {/* Code Block */}
                          <div className="rounded-lg border border-blue-200 dark:border-neutral-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-black dark:to-neutral-950 p-4 overflow-x-auto group-hover:border-blue-400 dark:group-hover:border-blue-700/40 transition-colors">
                            <code className="text-sm font-mono text-blue-800 dark:text-neutral-400">
                              {step.code}
                            </code>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-20"
          >
            <div className="inline-flex flex-col items-center gap-6 rounded-2xl border border-blue-200 dark:border-neutral-800 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 p-8 sm:p-10 shadow-lg">
              <div className="space-y-2 text-center">
                <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                  Ready to get started?
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Follow our quick start guide and be live in minutes
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/docs/installation"
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 px-6 py-3 font-medium transition-all duration-300 shadow-lg group"
                >
                  Installation Guide
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center justify-center rounded-lg border border-blue-300 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-blue-50 dark:hover:bg-neutral-900 px-6 py-3 font-medium transition-colors"
                >
                  View Full Docs
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
