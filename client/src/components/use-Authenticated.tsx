"use client";

import { Suspense, useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import WelcomePopup from "@/components/WelcomePopup";

function AuthenticatedInner({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const newUser = searchParams.get("newUser");

  const [showWelcome, setShowWelcome] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      const callbackUrl = encodeURIComponent(pathname);
      setRedirecting(true);
      router.replace(`/auth?callbackUrl=${callbackUrl}`);
      return;
    }

    if (newUser === "true") {
      const timer = setTimeout(() => setShowWelcome(true), 500);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("newUser");
      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      router.replace(newUrl, { scroll: false });
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, newUser, pathname, searchParams, router]);

  if (redirecting || !isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="scale-200" />
      </div>
    );
  }

  return (
    <>
      <WelcomePopup open={showWelcome} onOpenChange={setShowWelcome} />
      {children}
    </>
  );
}

export default function AuthenticatedProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Spinner className="scale-200" />
        </div>
      }
    >
      <AuthenticatedInner>{children}</AuthenticatedInner>
    </Suspense>
  );
}
