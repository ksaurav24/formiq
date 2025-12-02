'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ReactNode } from 'react';

interface SocialButtonProps {
  provider: 'google' | 'github';
  disabled: boolean;
  onClick: () => void;
  isLoading: boolean;
  icon: ReactNode;
  label: string;
}

export default function SocialButton({
  provider,
  onClick,
  isLoading,
  disabled,
  icon,
  label,
}: SocialButtonProps) {
  const colors = {
    google: 'hover:bg-slate-100 dark:hover:bg-slate-800',
    github: 'hover:bg-slate-100 dark:hover:bg-slate-800',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full"
    >
      <Button
        type="button"
        variant="outline"
        onClick={onClick}
        disabled={disabled}
        className={`w-full h-12 group relative border-slate-200 dark:border-slate-800 ${colors[provider]} focus-visible:ring-2 focus-visible:ring-blue-300 dark:focus-visible:ring-purple-700 transition-all duration-200`}
      >
        {isLoading ? (
          <>
            <Spinner className="mr-2" /> {/* Add some spacing */}
            <span className="text-slate-500 dark:text-slate-400">Connecting...</span>
          </>
        ) : (
          <>
            {/* Animate the icon on hover only, but always keep it visible */}
            <motion.span
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="mr-2 flex items-center"
            >
              {icon}
            </motion.span>
            <span className="font-medium">{label}</span>
          </>
        )}
        {/* Softer, subtle gradient hover effect */}
        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 ease-in-out pointer-events-none" />
      </Button>
    </motion.div>
  );
}
