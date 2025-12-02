"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sparkles } from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import ThemeToggle from "../theme-toggle";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/auth.store";
import { authClient } from "@/lib/authClient";
import SocialButton from "./social-button";
import Link from "next/link";

interface authFormProps {
  callbackUrl: string
}
export default function AuthForm({ callbackUrl }: authFormProps) {
  const router = useRouter(); 

  const { signIn, setUser, setSession } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);
  const [activeProvider, setActiveProvider] = useState<"google" | "github" | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setHydrated(true);
      try {
        const data = await authClient.getSession();
        if (data?.data) {
          setUser(data.data.user);
          setSession(data);
          router.replace(callbackUrl); // redirect to callbackUrl
        } else {
          setSessionLoading(false);
        }
      } catch {
        console.error("Failed to fetch session");
      }
    };
    init();
  }, [router, setSession, setUser, callbackUrl]);

  if (!hydrated) return null;

  const handleSocialLogin = async (provider: "google" | "github") => {
    try {
      setActiveProvider(provider);
      await signIn(provider, callbackUrl); // pass callbackUrl if supported by authClient
    } catch {
      toast.error("Failed to sign in. Please try again.");
      setActiveProvider(null);
    }
  };
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md relative"
    >
      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      <Card className="relative overflow-hidden border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-sm bg-white/90 dark:bg-slate-900/90">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />

        {sessionLoading ? <div className="flex justify-center">
          <Spinner/>
        </div> : <div className="relative p-8 space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-2"
          >
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
            </div>

            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Welcome to Formiq
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Sign in to continue to your account
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <SocialButton
              provider="google"
              disabled={!!activeProvider}
              onClick={() => handleSocialLogin("google")}
              isLoading={activeProvider === "google" }
              icon={<FaGoogle className="w-5 h-5" />}
              label="Continue with Google"
            />

            <SocialButton
              provider="github"
              disabled={!!activeProvider}
              onClick={() => handleSocialLogin("github")}
              isLoading={activeProvider === "github" }
              icon={<FaGithub className="w-5 h-5" />}
              label="Continue with GitHub"
            />
          </motion.div>

          <div className="relative">
            <Separator className="bg-slate-200 dark:bg-slate-800" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 px-4 pb-0.5 text-xs text-slate-500 dark:text-slate-500">
              secure authentication
            </span>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-slate-500 dark:text-slate-500"
          >
            By continuing, you agree to Formiq&apos;s{" "}
            <Link href={"/legal/terms"} className="text-slate-700 dark:text-slate-300 hover:underline cursor-pointer">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href={"/legal/privacy-policies"} className="text-slate-700 dark:text-slate-300 hover:underline cursor-pointer">
              Privacy Policy
            </Link>
          </motion.p>
        </div>}

        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      </Card>

      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>
    </motion.div>
  );
}
