// app/help/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  Tooltip, TooltipProvider, TooltipTrigger, TooltipContent,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";


import {
  Search, LifeBuoy, BookOpen, LinkIcon, MessageSquare, AlertCircle, Send, ExternalLink,
} from "lucide-react";

// Ticket schema (no file upload)
const ticketSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(120),
  category: z.enum(["billing", "technical", "account", "feedback", "other"] as const, {
    message: "Select a category",
  }),
  priority: z.enum(["low", "normal", "high", "urgent"] as const, {
    message: "Select a priority",
  }),
  projectId: z.string().optional(),
  url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  description: z.string().min(10, "Please describe the issue in detail"),
  steps: z.string().optional().or(z.literal("")),
  expected: z.string().optional().or(z.literal("")),
  actual: z.string().optional().or(z.literal("")),
  subscribe: z.boolean().default(true),
  consent: z.boolean().refine((v) => v, "You must consent to be contacted"),
});

type TicketValues = z.infer<typeof ticketSchema>;


export default function HelpPage() {

    const [search, setSearch] = useState("");
  const form = useForm<TicketValues>({
    resolver: zodResolver(ticketSchema) as Resolver<TicketValues>,
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      category: undefined,
      priority: "normal",
      projectId: "",
      url: "",
      description: "",
      steps: "",
      expected: "",
      actual: "",
      subscribe: true,
      consent: true,
    },
    mode: "onChange",
  });
  

  const onSubmit = async (values: TicketValues) => {
    console.log("Submitting ticket:", values);
    await toast.promise(
        // demo timeout
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: "Submitting ticket…",
        success: "Ticket submitted. We’ll reach out shortly.",
        error: "Failed to submit ticket",
      }
    );
    form.reset({ ...form.getValues(), subject: "", description: "", steps: "", expected: "", actual: "" });
  };

//   const topicTiles = [
//     {
//       icon: <BookOpen className="size-5" />,
//       title: "Docs & Guides",
//       desc: "Read how-tos, APIs, and best practices.",
//       href: "/docs",
//     },
//     {
//       icon: <LifeBuoy className="size-5" />,
//       title: "Status",
//       desc: "Check system uptime and incidents.",
//       href: "/status",
//     },
//     {
//       icon: <MessageSquare className="size-5" />,
//       title: "Community",
//       desc: "Ask, share, learn and collaborate with others.",
//       href: "/community",
//     },
//     {
//       icon: <AlertCircle className="size-5" />,
//       title: "Changelog",
//       desc: "See what’s new and improved and learn more.",
//       href: "/changelog",
//     },
//   ];

  const popularLinks = [
    { label: "Get API key", href: "/docs/api/auth" },
    { label: "Authorized domains", href: "/docs/security/domains" },
    { label: "Webhooks setup", href: "/docs/integrations/webhooks" },
    { label: "Rate limits", href: "/docs/api/rate-limits" },
  ];

  return (
    <TooltipProvider delayDuration={150}>
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
        {/* Hero / Search */}
        {/* <Card className="border-dashed">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                  How can we help?
                </h1>
                <p className="text-muted-foreground">
                  Search answers or raise a support ticket if you’re stuck.
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary">Getting started</Badge>
                  <Badge variant="secondary">API</Badge>
                  <Badge variant="secondary">Billing</Badge>
                  <Badge variant="secondary">Deploy</Badge>
                </div>
              </div>

              <div className="w-full md:w-[360px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search help articles"
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search help articles"
                  />
                </div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {popularLinks.map((l) => (
                    <Button key={l.href} asChild variant="ghost" size="sm" className="h-8 px-2">
                      <Link href={l.href}>
                        {l.label}
                        <ExternalLink className="ml-1 size-3.5" />
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Quick topics */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {topicTiles.map((t) => (
            <Card key={t.title} className="group transition-transform hover:translate-y-[-1px]">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center justify-center h-8 w-8 rounded-md border bg-card text-foreground">
                    {t.icon}
                  </div>
                  <CardTitle className="text-base">{t.title}</CardTitle>
                </div>
                <CardDescription>{t.desc}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={t.href}>
                    Open
                    <ExternalLink className="ml-2 size-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div> */}

        {/* FAQs */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Frequently asked</CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="a1">
                <AccordionTrigger>How do I find my public key?</AccordionTrigger>
                <AccordionContent>
                  Go to a project’s details page and look for the “Public key” field; use the copy button beside it.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="a2">
                <AccordionTrigger>Why are submissions blocked?</AccordionTrigger>
                <AccordionContent>
                  Ensure the origin domain is authorized in the project settings and that rate limits aren’t exceeded.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="a3">
                <AccordionTrigger>How do I enable email notifications?</AccordionTrigger>
                <AccordionContent>
                  In project settings, toggle “Email notifications” to receive alerts on new submissions.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Raise a ticket */}
        <Card className="animate-in fade-in-50">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Raise a support ticket</CardTitle>
                <CardDescription>Provide details so the team can assist quickly</CardDescription>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline">Avg. response: under 24h</Badge>
                </TooltipTrigger>
                <TooltipContent>Most tickets get first reply in a business day</TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Contact */}
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" placeholder="Your name" {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="you@example.com" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>

              {/* Subject */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Brief summary of the issue" {...form.register("subject")} />
                {form.formState.errors.subject && (
                  <p className="text-sm text-destructive">{form.formState.errors.subject.message}</p>
                )}
              </div>

              {/* Category & Priority */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  onValueChange={(v) => form.setValue("category", v as any, { shouldValidate: true })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-destructive">{form.formState.errors.category.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  defaultValue="normal"
                  onValueChange={(v) => form.setValue("priority", v as any, { shouldValidate: true })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.priority && (
                  <p className="text-sm text-destructive">{form.formState.errors.priority.message}</p>
                )}
              </div>

              {/* Optional project & URL */}
              <div className="space-y-2">
                <Label htmlFor="projectId">Project ID (optional)</Label>
                <Input id="projectId" placeholder="proj_xxx…" {...form.register("projectId")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL (optional)</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input id="url" className="pl-9" placeholder="https://…" {...form.register("url")} />
                </div>
                {form.formState.errors.url && (
                  <p className="text-sm text-destructive">{form.formState.errors.url.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Describe the issue</Label>
                <Textarea
                  id="description"
                  rows={5}
                  placeholder="What happened? Include error messages, timeframe, and any context."
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                )}
              </div>

              {/* Diagnostic text fields (no uploads) */}
              <div className="space-y-2">
                <Label htmlFor="steps">Steps to reproduce (optional)</Label>
                <Textarea id="steps" rows={3} placeholder="1) … 2) … 3) …" {...form.register("steps")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected">Expected (optional)</Label>
                <Textarea id="expected" rows={3} placeholder="What you expected to happen" {...form.register("expected")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actual">Actual (optional)</Label>
                <Textarea id="actual" rows={3} placeholder="What actually happened" {...form.register("actual")} />
              </div>

              {/* Preferences */}
              <div className="md:col-span-2 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.watch("subscribe")}
                    onCheckedChange={(v) => form.setValue("subscribe", v)}
                    id="subscribe"
                  />
                  <Label htmlFor="subscribe">Email me updates about this ticket</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.watch("consent")}
                    onCheckedChange={(v) => form.setValue("consent", v, { shouldValidate: true })}
                    id="consent"
                  />
                  <Label htmlFor="consent">I consent to be contacted</Label>
                </div>
              </div>
              {form.formState.errors.consent && (
                <div className="md:col-span-2">
                  <p className="text-sm text-destructive">{form.formState.errors.consent.message}</p>
                </div>
              )}

              {/* Actions */}
              <div className="md:col-span-2 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  By submitting, you agree to our{" "}
                  <Link className="underline underline-offset-4" href="/legal/support-policy">
                    Support Policy
                  </Link>
                  .
                </p>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || !form.formState.isValid}
                >
                  <Send className="mr-2 size-4" />
                  Submit ticket
                </Button>
              </div>
            </form>
            {/* Link to privacy policy and terms of service to check it out */}
            <div className="mt-4">
              <p className="text-xs text-muted-foreground">
                Please review our{" "}
                <Link className="underline underline-offset-4" href="/legal/privacy-policies">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link className="underline underline-offset-4" href="/legal/terms">
                  Terms of Service
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
