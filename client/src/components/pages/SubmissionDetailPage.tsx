// components/submissions/SubmissionDetailContent.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import useSubmissionStore, { Submission } from "@/store/submission.store";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import {
  ArrowLeft,
  Trash2,
  Copy,
  Download,
  Calendar,
  Globe,
  Monitor,
  MapPin,
  FolderGit2,
  Clock,
  FileText,
  ExternalLink,
} from "lucide-react";
 

export default function SubmissionDetailContent({
  submissionId,
}: {
  submissionId: string;
}) {
  const router = useRouter();
  const { fetchSubmissionById, deleteSubmission } = useSubmissionStore();
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchSubmissionById(submissionId)
      .then((data) => setSubmission(data))
      .catch(() => {
        toast.error("Failed to load submission");
        router.push("/dashboard");
      })
      .finally(() => setLoading(false));
  }, [submissionId, fetchSubmissionById, router]);
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
  const handleDelete = async () => {
   const confirmed = await confirmToast({
            title: "Delete this submission?",
            description:
                "This action is irreversible and will permanently remove submissions.",
        });
    if (!confirmed) return;

    setDeleting(true);
    const deleteSubmissionAndRedirect = async (submissionId:string) =>{
            await deleteSubmission(submissionId)
            router.push(`/projects/${submission?.project?.projectId}/submissions`);
    }
    try {
      await toast.promise(deleteSubmissionAndRedirect(submissionId), {
        loading: "Deleting submission…",
        success: "Submission deleted",
        error: "Failed to delete submission",
      }); 
    } catch {
      // Error toast already shown
    } finally {
      setDeleting(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const exportAsJSON = () => {
    if (!submission) return;
    const exportData = {
      submissionId: submission._id,
      projectName: submission.project?.name,
      submittedAt: submission.createdAt,
      origin: submission.origin,
      fields: submission.fields,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submission_${submission._id}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    toast.success("Downloaded submission data");
  };
  

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 flex-1" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!submission) {
    return (
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="text-lg text-destructive">Submission not found</div>
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 size-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const fields = Object.entries(submission.fields || {});
  const created = new Date(submission.createdAt).toLocaleString();
  const updated = new Date(submission.updatedAt).toLocaleString();

  return (
    <TooltipProvider delayDuration={200}>
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Link href="/dashboard">
                  <ArrowLeft className="size-4" />
                </Link>
              </Button>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Submission Details
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="font-mono text-xs cursor-pointer"
                onClick={() => copyToClipboard(submission._id)}
                title="Click to copy ID"
              >
                ID: {submission._id.slice(0, 8)}…
              </Badge>
              {submission.project && (
                <Badge variant="secondary">{submission.project.name}</Badge>
              )}
              <Badge variant="outline">
                <Calendar className="mr-1 size-3" />
                {created}
              </Badge>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(submission._id)}
                >
                  <Copy className="mr-2 size-4" />
                  Copy ID
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy submission ID</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={exportAsJSON}>
                  <Download className="mr-2 size-4" />
                  Export
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download as JSON</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  <Trash2 className="mr-2 size-4" />
                  {deleting ? "Deleting…" : "Delete"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete this submission</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form Data */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="size-5" />
                  Form Data
                </CardTitle>
                <CardDescription>
                  Fields submitted through the form
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                {fields.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No fields in this submission
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[35%]">Field Name</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell className="font-medium align-top">
                            <div className="flex items-center gap-2">
                              <span>{key}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                onClick={() => copyToClipboard(String(value))}
                              >
                                <Copy className="size-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="align-top">
                            <div className="break-words whitespace-pre-wrap max-w-md">
                              {typeof value === "object"
                                ? JSON.stringify(value, null, 2)
                                : String(value)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Monitor className="size-5" />
                  Submission Metadata
                </CardTitle>
                <CardDescription>
                  Technical information about the submission
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Globe className="size-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="text-sm font-medium">Origin</div>
                      <div className="text-sm text-muted-foreground break-all">
                        {submission.origin}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(submission.origin)}
                    >
                      <Copy className="size-4" />
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <MapPin className="size-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="text-sm font-medium">IP Address</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {submission.ipAddress}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(submission.ipAddress)}
                    >
                      <Copy className="size-4" />
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <Monitor className="size-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="text-sm font-medium">User Agent</div>
                      <div className="text-xs text-muted-foreground break-all">
                        {submission.userAgent}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(submission.userAgent)}
                    >
                      <Copy className="size-4" />
                    </Button>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Clock className="size-5 text-muted-foreground mt-0.5" />
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Created</div>
                        <div className="text-sm text-muted-foreground">
                          {created}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="size-5 text-muted-foreground mt-0.5" />
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Updated</div>
                        <div className="text-sm text-muted-foreground">
                          {updated}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Project Info & Actions */}
          <div className="space-y-6">
            {submission.project && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FolderGit2 className="size-5" />
                    Project
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">
                      {submission.project.name}
                    </div>
                    {submission.project.description && (
                      <p className="text-sm text-muted-foreground">
                        {submission.project.description}
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      Project ID
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="font-mono text-xs cursor-pointer"
                        onClick={() =>
                          copyToClipboard(submission.project!.projectId)
                        }
                      >
                        {submission.project.projectId}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          copyToClipboard(submission.project!.projectId)
                        }
                      >
                        <Copy className="size-3" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      Authorized Domains
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {submission.project.authorizedDomains.map((domain:string) => (
                        <Badge key={domain} variant="secondary" className="text-xs">
                          {domain}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Button asChild className="w-full" size="sm">
                      <Link
                        href={`/projects/${submission.project.projectId}`}
                      >
                        <ExternalLink className="mr-2 size-4" />
                        View Project
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      <Link
                        href={`/projects/${submission.project.projectId}/submissions`}
                      >
                        <FileText className="mr-2 size-4" />
                        All Submissions
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Info</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Fields
                  </span>
                  <Badge variant="secondary">{fields.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Submission ID
                  </span>
                  <Badge
                    variant="outline"
                    className="font-mono text-xs cursor-pointer"
                    onClick={() => copyToClipboard(submission._id)}
                  >
                    {submission._id.slice(0, 12)}…
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4">
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 size-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
