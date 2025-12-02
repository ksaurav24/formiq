"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSubmissionStore from "@/store/submission.store";
import { toast } from "sonner";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"

import { Button } from "@/components/ui/button"; 
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { Eye, Trash2, Download, RefreshCw, ChevronDown } from "lucide-react";

type Props = {
   
    projectId: string;
  
};

export default function ProjectSubmissionsList({ 
    projectId 
 }: Props) {
  const router = useRouter();
  const {
    byProject,
    fetchProjectSubmissions,
    deleteSubmission,
    exportSubmissions,
    setProjectQuery,
  } = useSubmissionStore();

  // Local filter state mirrors server-supported query
  const bucket = byProject[projectId];
  const page = bucket?.page ?? 1;
  const limit = bucket?.limit ?? 10;
  const sortBy = bucket?.sortBy ?? "createdAt";
  const sortOrder = bucket?.sortOrder ?? "desc";
  const [startDate, setStartDate] = useState<string | undefined>(bucket?.startDate);
  const [endDate, setEndDate] = useState<string | undefined>(bucket?.endDate);
  const loading = bucket?.loading ?? false;
  const pagination = bucket?.pagination ?? null;
  const items = bucket?.items ?? [];
  const meta = bucket?.meta ?? null;

  // Initial + reactive fetch
  useEffect(() => {
    fetchProjectSubmissions(projectId, { page, limit, sortBy, sortOrder, startDate, endDate }).catch((e) =>
      console.error(e)
    );
  }, [projectId, page, limit, sortBy, sortOrder, startDate, endDate, fetchProjectSubmissions]);

  // Derived project label
  const projectLabel = useMemo(() => {
    if (!meta) return `Project ${projectId}`;
    return `${meta.name} (${meta.projectId})`;
  }, [meta, projectId]);

  const onRefresh = async () => {
    try {
      await fetchProjectSubmissions(projectId, { page, limit, sortBy, sortOrder, startDate, endDate });
      toast.success("Refreshed");
    } catch (e: any) {
      toast.error(e?.message || "Failed to refresh");
    }
  };
    const confirmToast = (opts: {
        title: string;
        description?: string;
        confirmLabel?: string;
        cancelLabel?: string;
    }) =>
        new Promise<boolean>((resolve) => {
            toast.custom(
                (t) => (
                    <div className="grid gap-3 rounded-md border bg-popover text-popover-foreground shadow-lg p-4 w-[320px]">
                        <div className="space-y-1">
                            <div className="text-sm font-medium">{opts.title}</div>
                            {opts.description ? (
                                <div className="text-xs text-muted-foreground">
                                    {opts.description}
                                </div>
                            ) : null}
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    toast.dismiss(t);
                                    resolve(false);
                                }}
                            >
                                {opts.cancelLabel ?? "Cancel"}
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                    toast.dismiss(t);
                                    resolve(true);
                                }}
                            >
                                {opts.confirmLabel ?? "Delete"}
                            </Button>
                        </div>
                    </div>
                ),
                { duration: Infinity, position: "top-center" }
            );
        });

  const onDeleteRow = async (submissionId: string) => {
    const id = submissionId;
    const ok = await confirmToast({
      title: "Delete submission?",
      description: "This action cannot be undone.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (!ok) return;
    try {
      await deleteSubmission(id);
      toast.success("Submission deleted"); 
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete submission");
    }
  };

  const onExport = async (format: "csv" | "json") => {
    try {
      await exportSubmissions(projectId, { format, startDate, endDate });
      toast.success(`Exported ${format.toUpperCase()}`);
    } catch (e: any) {
      toast.error(e?.message || "Failed to export");
    }
  };

  const gotoPage = (nextPage: number) => {
    setProjectQuery(projectId, { page: nextPage });
  };

  const onChangeLimit = (val: number) => {
    setProjectQuery(projectId, { limit: val, page: 1 });
  };

  const onChangeSort = (key: string, order: "asc" | "desc") => {
    setProjectQuery(projectId, { sortBy: key, sortOrder: order, page: 1 });
  };

  const fieldPreview = (fields: Record<string, any>) => {
    const entries = Object.entries(fields ?? {}).slice(0, 3);
    if (entries.length === 0) return "—";
    return entries.map(([k, v]) => `${k}: ${String(v)}`.slice(0, 32)).join(" · ");
  };

 return (
  <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
    {/* Header / Toolbar */}
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      <div className="space-y-1.5">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Submissions
        </h1>
        <p className="text-muted-foreground">
          {projectLabel}
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={loading}
          className="transition-opacity data-[loading=true]:opacity-70"
          data-loading={loading}
        >
          <RefreshCw className="mr-2 size-4" />
          Refresh
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="group">
              <Download className="mr-2 size-4" />
              Export
              <ChevronDown className="ml-2 size-4 transition-transform group-data-[state=open]:rotate-180" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Export format</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onExport("csv")}>CSV</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport("json")}>JSON</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    {/* Controls */}
    <Card className="animate-in fade-in-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Filters</CardTitle>
        <CardDescription>Sort, date range, and page size</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Sort By (shadcn Select) */}
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Sort by</label>
            <div className="flex gap-2">
              <Select
                value={sortBy}
                onValueChange={(val) => onChangeSort(val, sortOrder)}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created At</SelectItem>
                  <SelectItem value="origin">Origin</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortOrder}
                onValueChange={(val) => onChangeSort(sortBy, val as "asc" | "desc")}
              >
                <SelectTrigger className="h-9 w-[130px]">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Desc</SelectItem>
                  <SelectItem value="asc">Asc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range (Popover + Calendar in range mode) */}
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Date range</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 w-full justify-between"
                >
                  {startDate || endDate
                    ? `${startDate ?? "…"} — ${endDate ?? "…"}`
                    : "Pick a date range"}
                  <ChevronDown className="ml-2 size-4 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <div className="grid gap-3">
                  <Calendar
                    mode="range"
                    selected={{
                      from: startDate ? new Date(startDate) : undefined,
                      to: endDate ? new Date(endDate) : undefined,
                    }}
                    onSelect={(range: { from?: Date; to?: Date } | undefined) => {
                      setStartDate(range?.from ? range.from.toISOString().slice(0, 10) : undefined);
                      setEndDate(range?.to ? range.to.toISOString().slice(0, 10) : undefined);
                    }}
                    numberOfMonths={1}
                    className="rounded-md border"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setStartDate(undefined);
                        setEndDate(undefined);
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        setProjectQuery(projectId, { startDate, endDate, page: 1 })
                      }
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Per page (shadcn Select) */}
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Per page</label>
            <Select
              value={String(limit)}
              onValueChange={(val) => onChangeLimit(parseInt(val))}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Apply button for smaller screens */}
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-1 flex items-end">
            <label className="sr-only">Apply filters</label>
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => setProjectQuery(projectId, { startDate, endDate, page: 1 })}
              disabled={loading}
            >
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Table */}
    <Card className="animate-in fade-in-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Submissions</CardTitle>
        <CardDescription>View, export, or manage submissions</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <div className="relative rounded-md border">
          <div className="max-h-[60vh] overflow-auto">
            <Table> 
              <TableHeader className="sticky top-0 z-10 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                <TableRow>
                  <TableHead className="w-[38%]">Fields</TableHead>
                  <TableHead className="w-[20%]">Origin</TableHead>
                  <TableHead className="w-[22%]">Created</TableHead>
                  <TableHead className="w-[20%]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={`sk-${i}`}>
                      <TableCell><Skeleton className="h-4 w-[90%]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell className="flex gap-2">
                        <Skeleton className="h-9 w-20" />
                        <Skeleton className="h-9 w-24" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No submissions found for the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((s) => {
                    const id = (s as any)._id || (s as any).id;
                    const created = s.createdAt ? new Date(s.createdAt).toLocaleString() : "—";
                    return (
                      <TableRow
                        key={id}
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <TableCell className="align-top">
                          <div className="truncate">{fieldPreview(s.fields)}</div>
                          <div className="mt-1 flex gap-2">
                            <Badge variant="outline" className="font-normal">
                              ID: {String(id).slice(0, 8)}…
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          {s.origin || "—"}
                        </TableCell>
                        <TableCell className="align-top">
                          {created}
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex flex-wrap gap-2">
                            <Button asChild size="sm" variant="outline" className="transition-transform hover:translate-y-[-1px]">
                              <Link href={`/submissions/${id}`}>
                                <Eye className="mr-2 size-4" />
                                View
                              </Link>
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="secondary" className="group">
                                  Actions
                                  <ChevronDown className="ml-2 size-4 transition-transform group-data-[state=open]:rotate-180" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/submissions/${id}`}>Open details</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => onDeleteRow(id)}
                                >
                                  <Trash2 className="mr-2 size-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 0 ? (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-muted-foreground w-32">
              Page {pagination.currentPage} of {pagination.totalPages}  <br/> {pagination.totalCount} total
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => pagination.hasPrevPage && gotoPage(pagination.currentPage - 1)}
                    aria-disabled={!pagination.hasPrevPage}
                    className={!pagination.hasPrevPage ? "opacity-50 pointer-events-none" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: pagination.totalPages })
                  .slice(
                    Math.max(0, pagination.currentPage - 3),
                    Math.min(pagination.totalPages, pagination.currentPage + 2)
                  )
                  .map((_, idx) => {
                    const num = Math.max(1, pagination.currentPage - 2) + idx;
                    return (
                      <PaginationItem key={num}>
                        <PaginationLink
                          isActive={num === pagination.currentPage}
                          onClick={() => gotoPage(num)}
                        >
                          {num}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => pagination.hasNextPage && gotoPage(pagination.currentPage + 1)}
                    aria-disabled={!pagination.hasNextPage}
                    className={!pagination.hasNextPage ? "opacity-50 pointer-events-none" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        ) : null}
      </CardContent>
    </Card>
  </div>
);

}
