// app/projects/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import useProjectStore from "@/store/project.store";

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
  Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink,
} from "@/components/ui/pagination";

import {
  FolderGit2, ListChecks, ExternalLink, FileText, RefreshCw, SortAsc, SortDesc,
  Plus,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import NewProjectForm from "../projects/newProjectForm";

type Project = {
  projectId: string;
  name: string;
  description?: string;
  updatedAt?: string | number | Date;
  submissionCount?: number;
  authorizedDomains?: string[];
};

export default function ProjectsPage() {
  const { projects, initializeProjects, fetchProjects, loading } = useProjectStore();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"updatedAt" | "name">("updatedAt");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [limit, setLimit] = useState(12);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    initializeProjects().catch(() => toast.error("Failed to load projects"));
  }, [initializeProjects]);

  const handleRefresh = async () => {
    try {
      await fetchProjects();
      toast.success("Refreshed");
    } catch {
      toast.error("Failed to refresh");
    }
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = (projects as Project[]) ?? [];
    if (term) {
      list = list.filter((p) =>
        `${p.name ?? ""} ${p.projectId ?? ""}`.toLowerCase().includes(term)
      );
    }
    list = [...list].sort((a, b) => {
      const dir = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "name") {
        return a.name.localeCompare(b.name) * dir;
      }
      
      const da = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const db = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return (da - db) * dir;
    });
    return list;
  }, [projects, search, sortBy, sortOrder]);

  // client-side pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Projects
          </h1>
          <p className="text-muted-foreground">
            Browse and manage your projects with quick actions.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className="mr-2 size-4" />
            Refresh
          </Button>
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
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filters</CardTitle>
          <CardDescription>Search, sort, and page size</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Search</label>
              <Input
                placeholder="Search by name or ID"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Sort by</label>
              <Select
                value={sortBy}
                onValueChange={(v) => {
                  setSortBy(v as any);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updatedAt">Last updated</SelectItem>
                  <SelectItem value="name">Name</SelectItem> 
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Order</label>
              <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as any)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">
                    <div className="flex items-center gap-2">
                      <SortDesc className="size-4" /> Desc
                    </div>
                  </SelectItem>
                  <SelectItem value="asc">
                    <div className="flex items-center gap-2">
                      <SortAsc className="size-4" /> Asc
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Per page</label>
              <Select
                value={String(limit)}
                onValueChange={(v) => {
                  setLimit(parseInt(v));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">All projects</CardTitle>
          <CardDescription>Cards with quick actions</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
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
                    <Skeleton className="h-4 w-28" />
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Skeleton className="h-9 w-28" />
                    <Skeleton className="h-9 w-24" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : paged.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              No projects found. Try adjusting search or create a new project.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {paged.map((p) => {
                const updated = p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "—";
                return (
                  <Card key={p.projectId} className="flex flex-col transition-transform hover:translate-y-[-1px]">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <CardTitle className="text-base">{p.name || "Untitled project"}</CardTitle>
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
                          Submissions: <span className="font-medium">{p.submissionCount ?? 0}</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Updated: {updated}</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {Array.isArray(p.authorizedDomains) && p.authorizedDomains.length > 0 ? (
                          p.authorizedDomains.slice(0, 3).map((d) => (
                            <Badge key={d} variant="outline">
                              {d}
                            </Badge>
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

        {/* Pagination */}
        <CardFooter className="mt-2 flex items-center justify-between">
          <div className="text-sm text-muted-foreground w-36">
            Page {currentPage} of {totalPages} <br/> {total} total
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && setPage(currentPage - 1)}
                  aria-disabled={currentPage <= 1}
                  className={currentPage <= 1 ? "opacity-50 pointer-events-none" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages })
                .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
                .map((_, idx) => {
                  const num = Math.max(1, currentPage - 2) + idx;
                  return (
                    <PaginationItem key={num}>
                      <PaginationLink isActive={num === currentPage} onClick={() => setPage(num)}>
                        {num}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && setPage(currentPage + 1)}
                  aria-disabled={currentPage >= totalPages}
                  className={currentPage >= totalPages ? "opacity-50 pointer-events-none" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  );
}
