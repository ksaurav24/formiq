// components/why-section.tsx
'use client';

import { motion } from 'framer-motion';
import {
  Zap,
  Shield,
  Code2,
  Database,
  Clock,
  ArrowRight,
  CheckCircle2,
  FastForward,
} from 'lucide-react';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const features = [
  {
    title: 'Zero Backend Required',
    description:
      'Skip the servers and databases. Integrate with one SDK and start collecting form data instantly — no backend code required.',
    icon: Zap,
    className: 'md:col-span-2',
    header: (
      <div className="flex h-full min-h-[220px] w-full flex-col justify-between rounded-xl border border-blue-200 dark:border-neutral-800 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 p-6 shadow-inner">
        <div className="space-y-2 font-mono text-xs text-blue-700 dark:text-neutral-400">
          <div>npm install formiq-sdk</div>
          <div className="h-px bg-blue-200 dark:bg-neutral-800" />
          <div>const formiq = new Formiq(apiKey, projectId)</div>
          <div>await formiq.submitForm(data)</div>
        </div>
        <Badge
          variant="outline"
          className="mt-3 border-blue-300 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/30 w-fit"
        >
          3 lines of code
        </Badge>
      </div>
    ),
  },
  {
    title: 'Security Built In',
    description:
      'Advanced security at every layer — CSRF protection, spam filtering, rate limiting, and encrypted data storage.',
    icon: Shield,
    className: 'md:col-span-1',
    header: (
      <div className="flex h-full min-h-[220px] w-full items-center justify-center rounded-xl border border-purple-200 dark:border-neutral-800 bg-gradient-to-br from-purple-50  to-purple-50 dark:from-neutral-950 dark:to-neutral-900 p-6">
        <div className="space-y-3 w-full">
          {[
            'CSRF Protection',
            'Rate Limiting',
            'Spam Filtering',
            'API Authentication',
          ].map((label, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-blue-400" />
              <span className="text-purple-900 dark:text-neutral-400">{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'Developer Experience',
    description:
      'FormIQ is built for developers — TypeScript-ready, React-friendly, and simple enough for any JS stack.',
    icon: Code2,
    className: 'md:col-span-1',
    header: (
      <div className="flex h-full min-h-[220px] w-full items-center justify-center rounded-xl border border-indigo-200 dark:border-neutral-800 bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 p-6">
        <div className="grid grid-cols-2 gap-3 w-full">
          {['TypeScript', 'React', 'Next.js', 'Vanilla JS'].map((tech) => (
            <div
              key={tech}
              className="rounded border border-indigo-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-3 text-center hover:border-indigo-400 hover:bg-indigo-50 dark:hover:border-blue-700/40 transition"
            >
              <div className="text-xs font-mono text-indigo-700 dark:text-neutral-400">{tech}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'Automatic Storage',
    description:
      'Every submission is automatically stored and organized — accessible from your dashboard or API anytime.',
    icon: Database,
    className: 'md:col-span-2',
    header: (
      <div className="flex h-full min-h-[220px] w-full flex-col justify-center rounded-xl border border-blue-200 dark:border-neutral-800 bg-gradient-to-br from-blue-50  to-blue-50 dark:from-neutral-950 dark:to-neutral-900 p-6">
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded border border-blue-200 dark:border-neutral-800 bg-white dark:bg-black/50 p-3 hover:border-blue-400 hover:bg-blue-50 dark:hover:border-blue-700/40 transition"
            >
              <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
              <div className="flex-1 space-y-1">
                <div className="h-2 w-3/4 rounded bg-blue-200 dark:bg-neutral-800" />
                <div className="h-2 w-1/2 rounded bg-blue-100 dark:bg-neutral-800" />
              </div>
              <div className="text-xs text-blue-400 dark:text-neutral-600">{i}h ago</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'Fast & Easy Forms',
    description:
      'Create, share, and track forms effortlessly with real-time submissions and simple analytics.',
    icon: FastForward,
    className: 'md:col-span-2',
    header: (
      <div className="flex h-full min-h-[220px] w-full items-center justify-center rounded-xl border border-purple-200 dark:border-neutral-800 bg-gradient-to-br from-purple-50   to-purple-50 dark:from-neutral-950 dark:to-neutral-900 p-6">
        <div className="flex lg:flex-row flex-col items-center gap-4">
          {[
            { label: 'Forms Created', value: 'Instantly' },
            { label: 'Submissions', value: 'Real-time' },
            { label: 'Analytics', value: 'Basic Stats' },
          ].map((stat) => (
            <div key={stat.label} className="text-center flex lg:flex-row flex-col items-center gap-2">
              <div className="flex flex-col gap-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 dark:from-white dark:to-white text-transparent bg-clip-text mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-purple-700 dark:text-neutral-400">{stat.label}</div>
              </div>
              <div className="justify-center hidden lg:flex">
                <ArrowRight className="w-8 h-8 text-purple-400 dark:text-neutral-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: '5-Minute Setup',
    description:
      'From install to live submissions in under 5 minutes. No configs, no frameworks, just pure productivity.',
    icon: Clock,
    className: 'md:col-span-1',
    header: (
      <div className="flex h-full min-h-[220px] w-full items-center justify-center rounded-xl border border-indigo-200 dark:border-neutral-800 bg-gradient-to-br from-indigo-50   to-indigo-50 dark:from-neutral-950 dark:to-neutral-900 p-6">
        <div className="text-center space-y-2">
          <div className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
            5
          </div>
          <div className="text-sm text-indigo-700 dark:text-neutral-400">
            minutes to production
          </div>
        </div>
      </div>
    ),
  },
];

export default function WhySection() {
  return (
    <section
      id="why"
      className="relative py-24 sm:py-32 overflow-hidden text-zinc-900 dark:text-zinc-100"
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 border-blue-300 dark:border-neutral-800 text-blue-700 dark:text-neutral-400 bg-blue-50 dark:bg-transparent">
            Why FormIQ
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold mb-4">
            <span className="text-neutral-900 dark:text-white">Stop wrestling with backends.</span>
            <br />
            <span className="bg-gradient-to-r inline-block from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text my-1">
              Start building faster.
            </span>
          </h2>
          <p className="text-lg text-neutral-700 dark:text-zinc-400 max-w-2xl mx-auto">
            Simplify form handling for your static sites. No servers, no
            maintenance — just results.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <BentoGrid className="max-w-7xl mx-auto gap-6">
            {features.map((feature, i) => (
              <BentoGridItem
                key={i}
                title={feature.title}
                description={feature.description}
                header={feature.header}
                icon={feature.icon}
                className={`${feature.className} hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)] transition-shadow duration-300`}
              />
            ))}
          </BentoGrid>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-20"
        >
          <div className="inline-flex flex-col items-center gap-4 rounded-2xl border border-blue-200 dark:border-neutral-800 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 p-10 shadow-lg">
            <p className="text-neutral-800 dark:text-neutral-300 text-lg font-medium">
              Ready to simplify your form handling?
            </p>
            <Link href="/docs">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 font-medium group transition-all duration-300 shadow-lg">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-500 mt-2">
              <span>No credit card required</span>
              <span>•</span>
              <span>Free tier available</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
