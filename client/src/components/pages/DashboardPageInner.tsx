// app/dashboard/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import useProjectStore from "@/store/project.store";
import useSubmissionStore from "@/store/submission.store";

import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";

import {
  FolderGit2, ListChecks, Plus, BookOpen, RefreshCw,
  ExternalLink, FileText,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import NewProjectForm from "@/components/projects/newProjectForm";
 
import {
  AreaChart, Area, ResponsiveContainer, Tooltip as ReTooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";  

type Project = {
  projectId: string;
  name: string;
  description?: string;
  updatedAt?: string | number | Date;
  submissionCount?: number;
  authorizedDomains?: string[];
};

type TrendPoint = { date: string; count: number };

export default function DashboardPage() {
  const { projects, fetchProjects, initializeProjects, loading } = useProjectStore();
  const { fetchAnalytics, analytics } = useSubmissionStore();  

  const [search, setSearch] = useState(""); 
  const [open, setOpen] = useState(false);
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y">("7d");

 const [loaded, setLoaded] = useState(false);

useEffect(() => {
  initializeProjects()
    .then(() => setLoaded(true))
    .catch(() => toast.error("Failed to load projects"));
}, [initializeProjects]);

useEffect(() => {
  if (!loaded || !projects?.length) return;
  const run = async () => {
    const slice = (projects as Project[]).slice(0, 24);
    await Promise.allSettled(slice.map((p) => fetchAnalytics(p.projectId, period)));
  };
  run();
}, [projects, period, fetchAnalytics, loaded]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return projects as Project[];
    return (projects as Project[]).filter((p) =>
      `${p.name ?? ""} ${p.projectId ?? ""}`.toLowerCase().includes(term)
    );
  }, [projects, search]);

  // Simple totals from project list
  const baseTotals = useMemo(() => {
    const totalProjects = (projects as Project[]).length;
    const totalSubmissions = (projects as Project[]).reduce(
      (acc, p) => acc + (p.submissionCount ?? 0), 0
    );
    return { totalProjects, totalSubmissions };
  }, [projects]);

  // Aggregate analytics across projects for selected period
  const { periodTotal, activeProjects, trend } = useMemo(() => {
    const trendMap = new Map<string, number>();
    let total = 0;
    let active = 0;

    for (const p of projects as Project[]) {
      const key = `${p.projectId}|${period}`;
      const bucket = analytics[key];
      if (!bucket?.data) continue;

      total += bucket.data.periodSubmissions;
      if (bucket.data.periodSubmissions > 0) active += 1;

      for (const d of bucket.data.dailyStats) {
        const prev = trendMap.get(d._id) ?? 0;
        trendMap.set(d._id, prev + (d.count ?? 0));
      }
    }

    const trendArr: TrendPoint[] = Array.from(trendMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return { periodTotal: total, activeProjects: active, trend: trendArr };
  }, [projects, analytics, period]);

  const handleRefresh = async () => {
    try {
      await fetchProjects(); 
      // Re-fetch analytics for current period
      const slice = (projects as Project[]).slice(0, 24);
      await Promise.allSettled(slice.map((p) => fetchAnalytics(p.projectId, period)));
    } catch {
      toast.error("Failed to refresh");
    }
  };
 

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of your projects, submissions, and analytics.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 size-4" />
                <span>New Project</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg p-0 overflow-hidden bg-card rounded-lg shadow-xl">
              <NewProjectForm onClose={() => setOpen(false)} />
            </DialogContent>
          </Dialog>

          <Button asChild variant="outline">
            <Link href="/docs">
              <BookOpen className="mr-2 size-4" />
              Docs
            </Link>
          </Button>

          <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7d</SelectItem>
              <SelectItem value="30d">30d</SelectItem>
              <SelectItem value="90d">90d</SelectItem>
              <SelectItem value="1y">1y</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className="mr-2 size-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPIs (now analytics-aware) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <CardDescription>All active projects</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-semibold">
                {baseTotals.totalProjects}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Submissions ({period})
            </CardTitle>
            <CardDescription>Across all projects in period</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? <Skeleton className="h-8 w-24" /> : (
              <div className="text-3xl font-semibold">{periodTotal}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects ({period})
            </CardTitle>
            <CardDescription>Projects with ≥1 submission</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? <Skeleton className="h-8 w-20" /> : (
              <div className="text-3xl font-semibold">{activeProjects}</div>
            )}
          </CardContent>
        </Card>
      </div>

  <div className="h-56 w-full">
  {loading ? (
    <Skeleton className="h-full w-full" />
  ) : !trend?.length ? (
    <div className="flex items-center justify-center h-full w-full text-muted-foreground">
      No submission data for this period.
    </div>
  ) : (
   <ResponsiveContainer
  width="100%"
  height="100%"
  className="bg-card text-card-foreground rounded-xl p-2"
>
  <AreaChart data={trend} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
    <defs>
      <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
        <stop
          offset="0%"
          stopColor="hsl(var(--primary))"
          stopOpacity={0.35}
        />
        <stop
          offset="100%"
          stopColor="hsl(var(--primary))"
          stopOpacity={0.08}
        />
      </linearGradient>
    </defs>

    <CartesianGrid
      stroke="hsl(var(--border)/.25)"
      strokeDasharray="4 4"
      vertical={false}
    />

    <XAxis
      dataKey="date"
      tick={{
        fontSize: 12,
        fill: "hsl(var(--muted-foreground))",
      }}
      tickMargin={8}
      axisLine={{ stroke: "hsl(var(--border)/.4)" }}
      tickLine={false}
    />

    <YAxis
      tick={{
        fontSize: 12,
        fill: "hsl(var(--muted-foreground))",
      }}
      width={40}
      axisLine={{ stroke: "hsl(var(--border)/.4)" }}
      tickLine={false}
      allowDecimals={false}
    />

    <ReTooltip
      contentStyle={{
        backgroundColor: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
        borderRadius: 8,
        color: "hsl(var(--foreground))",
        fontSize: 12,
        boxShadow: "0 4px 12px hsl(var(--background)/0.3)",
      }}
      formatter={(v: any) => [v, "Submissions"]}
      labelFormatter={(l: any) => `Date: ${l}`}
    />

    <Area
      type="monotone"
      dataKey="count"
      stroke="hsl(var(--primary))"
      fill="url(#trendFill)"
      strokeWidth={2}
      dot={false}
      activeDot={{
        r: 4,
        stroke: "hsl(var(--primary))",
        fill: "hsl(var(--background))",
        strokeWidth: 2,
      }}
      animationDuration={400}
    />
  </AreaChart>
</ResponsiveContainer>

  )}
</div>



      {/* Projects */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Projects</CardTitle>
              <CardDescription>Manage, monitor, and explore projects</CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/projects">
                <ExternalLink className="mr-2 size-4" />
                View All
              </Link>
            </Button>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-6">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or ID"
              className="max-w-sm"
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-56" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-28" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              No projects found. Adjust search or create a new project.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((p) => {
                const submissions = p.submissionCount ?? 0;
                 
                const key = `${p.projectId}|${period}`;
                const a = analytics[key]?.data;
                const periodCount = a?.periodSubmissions ?? 0;
                return (
                  <Card key={p.projectId} className="flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <CardTitle className="text-base">
                            {p.name || "Untitled project"}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {p.description || "No description provided."}
                          </CardDescription>
                        </div>
                        <FolderGit2 className="size-5 text-muted-foreground shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="flex items-center gap-2">
                        <ListChecks className="size-4 text-muted-foreground" />
                        <div className="text-sm">
                          Total: <span className="font-medium">{submissions}</span>
                          <span className="text-muted-foreground"> • {period}: {periodCount}</span>
                        </div>
                      </div>
                   
                      <div className="mt-3 flex flex-wrap gap-2">
                        {Array.isArray(p.authorizedDomains) && p.authorizedDomains.length > 0 ? (
                          p.authorizedDomains.slice(0, 3).map((d) => (
                            <Badge key={d} variant="outline">{d}</Badge>
                          ))
                        ) : (
                          <Badge variant="outline">No domains</Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/projects/${p.projectId}/submissions`}>
                          <FileText className="mr-2 size-4" />
                          Submissions
                        </Link>
                      </Button>
                      <Button asChild size="sm">
                        <Link href={`/projects/${p.projectId}`}>
                          <ExternalLink className="mr-2 size-4" />
                          Open
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
