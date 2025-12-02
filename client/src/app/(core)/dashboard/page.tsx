// app/dashboard/page.tsx
"use client";

import { Suspense } from "react";
import DashboardPageInner from "@/components/pages/DashboardPageInner"
import { Spinner } from "@/components/ui/spinner";
export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">
      <Spinner/>
    </div>}>
      <DashboardPageInner />
    </Suspense>
  );
}
