// components/project/ProjectDetailsSkeleton.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectDetailsSkeleton() {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader className="pb-3">
          <div className="space-y-2">
            <CardTitle className="text-lg">Project details</CardTitle>
            <CardDescription>Metadata, settings, and access keys</CardDescription>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Info */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-44" />
            </div>

            {/* Settings */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>

            {/* Domains */}
            <div className="md:col-span-2 space-y-3">
              <Skeleton className="h-5 w-40" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>

            {/* Public Key */}
            <div className="md:col-span-2 space-y-3">
              <Skeleton className="h-5 w-28" />
              <div className="relative">
                <Skeleton className="h-10 w-full" />
                <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
