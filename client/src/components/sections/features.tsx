// components/features-section.tsx
'use client';

import { motion } from 'framer-motion';
import {
  Zap,
  Shield,
  Code2,
  Bell,
  BarChart3,
  Webhook,
  Globe,
  Lock,
  FileJson,
  Smartphone,
  Boxes,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

const allFeatures = {
  core: [
    {
      icon: Zap,
      title: 'Instant Setup',
      description: 'Install the SDK and start collecting submissions in minutes. No configuration needed.',
    },
    {
      icon: Shield,
      title: 'Built-in Security',
      description: 'CSRF protection, rate limiting, and spam filtering are enabled by default.',
    },
    {
      icon: Code2,
      title: 'Developer-Friendly API',
      description: 'Clean, intuitive API with full TypeScript support and comprehensive documentation.',
    },
    {
      icon: Bell,
      title: 'Real-time Notifications',
      description: 'Get instant email or webhook notifications when new submissions arrive.',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track submission trends, conversion rates, and form performance metrics.',
    },
    {
      icon: Webhook,
      title: 'Webhooks Integration',
      description: 'Connect to Zapier, Slack, Discord, or any webhook-enabled service.',
      note: 'coming soon',
    },
  ],
  advanced: [
    {
      icon: Globe,
      title: 'Caching for Performance',
      description: 'Lightning-fast responses with caching implemented.',
    },
    {
      icon: Lock,
      title: 'Data Privacy',
      description: 'GDPR compliant with end-to-end encryption and secure data storage.',
      note: 'coming soon',
    },
    {
      icon: FileJson,
      title: 'Export Anywhere',
      description: 'Export submissions as JSON, CSV, or access via REST API.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Works seamlessly on all devices with responsive design support.',
    },
    {
      icon: Boxes,
      title: 'Multiple Projects',
      description: 'Manage unlimited forms across different projects from one account.',
    },
    {
      icon: Sparkles,
      title: 'Auto-validation',
      description: 'Automatic field validation and sanitization to keep data clean.',
      note: 'coming soon',
    },
  ],
};

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 sm:py-32  dark:bg-black overflow-hidden">
      {/* Gradient Orb Background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/40 dark:bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100/40 dark:bg-white/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4 border-blue-300 dark:border-neutral-800 text-blue-700 dark:text-neutral-400 bg-blue-50 dark:bg-transparent">
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
              Everything you need to handle forms.
              <br />
              <span className="text-neutral-500 dark:text-neutral-400">Nothing you don&apos;t.</span>
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-500 max-w-2xl mx-auto">
              Powerful features that make form handling simple, secure, and scalable.
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs defaultValue="core" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-12">
                <TabsTrigger 
                  value="core" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black transition-all"
                >
                  Core Features
                </TabsTrigger>
                <TabsTrigger 
                  value="advanced" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black transition-all"
                >
                  Advanced
                </TabsTrigger>
              </TabsList>

              <TabsContent value="core">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allFeatures.core.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      >
                        <Card className="h-full border-blue-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-blue-400 dark:hover:border-neutral-700 hover:bg-blue-50/50 dark:hover:bg-neutral-900/50 hover:shadow-lg transition-all duration-300 group relative">
                          <CardContent className="p-6">
                           {feature?.note &&  <Badge className='absolute top-2 right-2 bg-yellow-100 text-yellow-800 border-yellow-200'>
                              {feature?.note}
                            </Badge>}
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-neutral-900 dark:to-neutral-900 flex items-center justify-center mb-4 group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:bg-white transition-all duration-300">
                              <Icon className="w-6 h-6 text-blue-600 dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors" />
                            </div>
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2 group-hover:text-blue-700 dark:group-hover:text-white transition-colors">
                              {feature.title}
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                              {feature.description}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="advanced">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allFeatures.advanced.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      >
                        <Card className="h-full border-purple-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-purple-400 dark:hover:border-neutral-700 hover:bg-purple-50/50 dark:hover:bg-neutral-900/50 hover:shadow-lg transition-all duration-300 group relative">
                          <CardContent className="p-6">
                             {feature?.note &&  <Badge className='absolute top-2 right-2 bg-yellow-100 text-yellow-800 border-yellow-200'>
                              {feature?.note}
                            </Badge>}
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-neutral-900 dark:to-neutral-900 flex items-center justify-center mb-4 group-hover:from-purple-600 group-hover:to-pink-600 dark:group-hover:bg-white transition-all duration-300">
                              <Icon className="w-6 h-6 text-purple-600 dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors" />
                            </div>
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2 group-hover:text-purple-700 dark:group-hover:text-white transition-colors">
                              {feature.title}
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                              {feature.description}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Bottom Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-20"
          >
            <Card className="border-blue-200 dark:border-neutral-800 bg-gradient-to-br from-blue-50   to-purple-50 dark:from-neutral-950 dark:to-black shadow-lg">
              <CardContent className="p-12 text-center">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                  And much more...
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-2xl mx-auto">
                  Custom validation, file uploads, multi-language support, team collaboration, 
                  API access, custom domains, and advanced integrations.
                </p>
                <Link
                  href="/docs"
                  className="inline-flex items-center text-blue-600 dark:text-white hover:text-purple-600 dark:hover:text-neutral-300 transition-colors font-medium"
                >
                  <span>Explore all features</span>
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
