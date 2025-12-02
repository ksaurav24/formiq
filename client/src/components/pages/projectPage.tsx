"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useProjectStore, { Project } from "@/store/project.store";
import { toast } from "sonner";

import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Trash2,
    Edit,
    FileText,
    Copy,
    Eye,
    EyeOff,
    Globe,
    KeyRound,
    Save,
    X,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { ProjectDetailsSkeleton } from "@/components/projects/loadingProject";

const schema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(60, "Name is too long"),
    description: z
        .string()
        .max(280, "Description too long")
        .optional()
        .or(z.literal("")),
    emailNotifications: z.boolean().default(false),
    authorizedDomainsText: z.string().optional().or(z.literal("")),
});
type FormValues = z.infer<typeof schema>;

export default function ProjectDetailsContent({
    projectId,
}: {
    projectId: string;
}) {
    const router = useRouter();
    const { getProjectById, deleteProject, updateProject } = useProjectStore();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showKey, setShowKey] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const updateProjectAndDisableEditing = async (
        id: string,
        payload: Partial<Project>
    ) => {
        const updated = await updateProject(id, payload);
        setProject(updated);
        setIsEditing(false);
        setSaving(false);
    };
    useEffect(() => {
        if (!projectId) return;
        setLoading(true);
        getProjectById(projectId)
            .then((proj: Project | undefined) => setProject(proj || null))
            .catch(() => toast.error("Failed to fetch project"))
            .finally(() => setLoading(false));
    }, [projectId, getProjectById]);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema) as any,
        mode: "onChange",
        defaultValues: {
            name: project?.name ?? "",
            description: project?.description ?? "",
            emailNotifications: !!project?.emailNotifications,
            authorizedDomainsText: (project?.authorizedDomains ?? []).join("\n"),
        },
    });

    useEffect(() => {
        if (!project) return;
        form.reset({
            name: project.name ?? "",
            description: project.description ?? "",
            emailNotifications: !!project.emailNotifications,
            authorizedDomainsText: (project.authorizedDomains ?? []).join("\n"),
        });
    }, [project]); // reset when loaded entity changes

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

    const onSubmit: SubmitHandler<FormValues> = async (values) => {
        if (!project) return;
        const domains = (values.authorizedDomainsText || "")
            .split(/[\n,]/g)
            .map((s) => s.trim())
            .filter(Boolean);
        const payload: Partial<Project> = {
            name: values.name,
            description: values.description || undefined,
            emailNotifications: values.emailNotifications,
            authorizedDomains: domains,
        };
        try {
            setSaving(true);
            await toast.promise(
                updateProjectAndDisableEditing(project.projectId, payload),
                {
                    loading: "Saving changes…",
                    success: "Project updated",
                    error: (err: any) => err?.message || "Failed to update project",
                }
            );
        } catch {
            // handled by toast
        }
    };

    const handleDelete = async () => {
        if (!project) return;
        const confirmed = await confirmToast({
            title: "Delete this project?",
            description:
                "This action is irreversible and will permanently remove submissions.",
        });
        if (!confirmed) return;

        setDeleting(true);
        try {
            await toast.promise(deleteProject(project.projectId), {
                loading: "Deleting project…",
                success: "Project deleted",
                error: (err: any) => err?.message || "Failed to delete project",
            });
            router.push("/projects");
        } catch {
            // stay on page
        } finally {
            setDeleting(false);
        }
    };

    const copyToClipboard = async (text: string, itemName?: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(`Copied ${itemName || "to clipboard"}`);
        } catch {
            toast.error("Failed to copy to clipboard");
        }
    };

    const created = useMemo(
        () =>
            project?.createdAt ? new Date(project.createdAt).toLocaleString() : "",
        [project?.createdAt]
    );
    const updated = useMemo(
        () =>
            project?.updatedAt ? new Date(project.updatedAt).toLocaleString() : "",
        [project?.updatedAt]
    );
    const lastSub = useMemo(
        () =>
            project?.lastSubmission
                ? new Date(project.lastSubmission).toLocaleString()
                : null,
        [project?.lastSubmission]
    );

    // IMPORTANT: render the skeleton while fetching to avoid "not found" flash.
    if (loading) {
        return <ProjectDetailsSkeleton />;
    }

    if (!project) {
        return (
            <div className="p-8 text-center text-destructive">Project not found.</div>
        );
    }

    const isDirty = form.formState.isDirty;
    const isValid = form.formState.isValid;
    const isSubmitting = form.formState.isSubmitting;

    return (
        <TooltipProvider delayDuration={200}>
            <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-2">
                        {!isEditing ? (
                            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                                {project.name}
                            </h1>
                        ) : (
                            <Form {...form}>
                                <form
                                    id="project-form"
                                    onSubmit={form.handleSubmit(onSubmit as any)}
                                    className="space-y-0"
                                >
                                    <FormField
                                        control={form.control as any}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="sr-only">Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Project name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>
                        )}
                        {!isEditing ? (
                            <p className="text-muted-foreground">
                                {project.description || "No description provided."}
                            </p>
                        ) : (
                            <Form {...form}>
                                <FormField
                                    control={form.control as any}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="sr-only">Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Description"
                                                    rows={3}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </Form>
                        )}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    className="flex flex-wrap gap-2 cursor-pointer"
                                    onDoubleClick={copyToClipboard.bind(null, project.projectId, "project ID")}
                                >
                  {/* Make this unselectable */}
                                    <Badge variant="outline" className="select-none">ID: {project.projectId}</Badge>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="right">Double click to copy project id</TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {!isEditing ? (
                            <>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                router.push(`/projects/${projectId}/submissions`)
                                            }
                                        >
                                            <FileText className="mr-2 size-4" />
                                            <span className="hidden sm:inline">Submissions</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>View submissions</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            <Edit className="mr-2 size-4" />
                                            <span className="hidden sm:inline">Edit</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Edit project</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={handleDelete}
                                            disabled={deleting}
                                        >
                                            <Trash2 className="mr-2 size-4" />
                                            <span className="hidden sm:inline">
                                                {deleting ? "Deleting…" : "Delete"}
                                            </span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {deleting ? "Deleting…" : "Delete project"}
                                    </TooltipContent>
                                </Tooltip>
                            </>
                        ) : (
                            <>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="default"
                                            type="submit"
                                            form="project-form"
                                            disabled={!isDirty || !isValid || isSubmitting || saving}
                                        >
                                            <Save className="mr-2 size-4" />
                                            <span className="hidden sm:inline">
                                                {saving ? (
                                                    <div>
                                                        <Spinner className="inline mr-2 size-4" />
                                                        Saving…
                                                    </div>
                                                ) : (
                                                    "Save Changes"
                                                )}
                                            </span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Save changes</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            type="button"
                                            onClick={() => {
                                                form.reset();
                                                setIsEditing(false);
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            <X className="mr-2 size-4" />
                                            <span className="hidden sm:inline">Cancel</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Discard changes</TooltipContent>
                                </Tooltip>
                            </>
                        )}
                    </div>
                </div>

                {/* Content */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Project details</CardTitle>
                        <CardDescription>
                            Metadata, settings, and access keys
                        </CardDescription>
                    </CardHeader>
                    <Separator />
                    <CardContent className="p-0">
                        <ScrollArea className="max-h-[70vh]">
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Info */}
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">Project info</div>
                                    <div className="text-sm text-muted-foreground">
                                        Created: {created}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Updated: {updated}
                                    </div>
                                </div>

                                {/* Settings */}
                                <div className="space-y-3">
                                    <div className="text-sm font-medium">Settings</div>
                                    {!isEditing ? (
                                        <>
                                            <div className="text-sm text-muted-foreground">
                                                Email notifications:{" "}
                                                {project.emailNotifications ? "Enabled" : "Disabled"}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Submissions: {project.submissionCount ?? 0}
                                            </div>
                                            {lastSub && (
                                                <div className="text-sm text-muted-foreground">
                                                    Last submission: {lastSub}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <Form {...form}>
                                            <FormField
                                                control={form.control as any}
                                                name="emailNotifications"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                                        <div className="space-y-0.5">
                                                            <FormLabel>Email notifications</FormLabel>
                                                            <div className="text-xs text-muted-foreground">
                                                                Receive email when new submissions arrive
                                                            </div>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                                aria-label="Toggle email notifications"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </Form>
                                    )}
                                </div>

                                {/* Domains */}
                                <div className="md:col-span-2 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Globe className="size-4 text-muted-foreground" />
                                        <div className="text-sm font-medium">
                                            Authorized domains
                                        </div>
                                    </div>

                                    {!isEditing ? (
                                        <div className="flex flex-wrap gap-2">
                                            {project.authorizedDomains?.length ? (
                                                project.authorizedDomains.map((url) => (
                                                    <Badge key={url} variant="outline">
                                                        {url}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <div className="text-sm text-muted-foreground">
                                                    None configured
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Form {...form}>
                                            <FormField
                                                control={form.control as any}
                                                name="authorizedDomainsText"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="sr-only">
                                                            Authorized domains
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="example.com
api.example.com
https://my.site"
                                                                rows={4}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                        <div className="text-xs text-muted-foreground">
                                                            One per line or comma-separated; protocol is
                                                            optional
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        </Form>
                                    )}
                                </div>

                                {/* Public Key */}
                                <div className="md:col-span-2 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <KeyRound className="size-4 text-muted-foreground" />
                                        <div className="text-sm font-medium">Public key</div>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            type={showKey ? "text" : "password"}
                                            readOnly
                                            value={project.keys?.publicKey || ""}
                                            className="pr-24"
                                        />
                                        <div className="absolute inset-y-0 right-2 flex items-center gap-1">
                                            <Tooltip>
                        <TooltipTrigger asChild>
                                                                    <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8"
                                                onClick={() => setShowKey((s) => !s)}
                                                aria-label={showKey ? "Hide key" : "Show key"}
                                            >
                                                {showKey ? (
                                                    <EyeOff className="size-4" />
                                                ) : (
                                                    <Eye className="size-4" />
                                                )}
                                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{showKey ? "Hide key" : "Show key"}</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={copyToClipboard.bind(
                              null,
                                                    project.keys?.publicKey || "",
                          "Public Key"
                                                )}
                                                aria-label="Copy key" 
                                            >
                                                <Copy className="size-4" />
                                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy public key</TooltipContent>
                      </Tooltip>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </TooltipProvider>
    );
}
