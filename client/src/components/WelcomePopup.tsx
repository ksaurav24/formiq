// components/WelcomePopup.tsx
"use client";
 
import {
  Dialog,
  DialogContent, 
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  FolderPlus, 
  Code2,
  BarChart3,
  Bell,
  ArrowRight,
  X, 
} from "lucide-react";
import { useState } from "react"; 
import NewProjectForm from "./projects/newProjectForm";

type WelcomePopupProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function WelcomePopup({ open, onOpenChange }: WelcomePopupProps) { 
  const [newProjectOpen, setNewProjectOpen] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleGetStarted = () => {
    handleClose();
    setTimeout(() => setNewProjectOpen(true), 500);
  };

  const steps = [
    {
      icon: <FolderPlus className="size-5" />,
      title: "Create your first project",
      description: "Generate an API key instantly",
    },
    {
      icon: <Code2 className="size-5" />,
      title: "Integrate in minutes",
      description: "Use our JS/TS SDK on any site",
    },
    {
      icon: <BarChart3 className="size-5" />,
      title: "Track submissions",
      description: "Real-time analytics dashboard",
    },
    {
      icon: <Bell className="size-5" />,
      title: "Get notified",
      description: "Enable alerts for new submissions",
    },
  ];

  return (<>
    <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
            <DialogContent className="max-w-lg p-0 overflow-hidden bg-card rounded-lg shadow-xl">
              <NewProjectForm onClose={() => setNewProjectOpen(false)} />
            </DialogContent>
          </Dialog>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0">
        {/* Header Section */}
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 pb-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 h-8 w-8"
            onClick={handleClose}
          >
            <X className="size-4" />
          </Button>

          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20">
              <Sparkles className="size-7 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-3xl font-bold tracking-tight mb-2">
                Welcome to Formiq! 👋
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Manage and track all your frontend forms effortlessly.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 pt-6 space-y-6">
          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map((step, i) => (
                <div
                key={i}
                className="group relative p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary shrink-0 group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="font-medium text-sm">{step.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {step.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Tip Section */}
          <div className="rounded-lg bg-muted/50 p-4 border-l-4 border-primary">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/20 text-primary shrink-0 mt-0.5">
                <span className="text-xs font-bold">💡</span>
              </div>
              <div className="flex-1 space-y-1">
                <div className="font-medium text-sm">Pro Tip</div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Start by adding a project, your dashboard will show all
                  submissions, usage stats, and top endpoints here!
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Button
              onClick={handleGetStarted}
              className="flex-1 h-11 text-base group"
              >
              <FolderPlus className="mr-2 size-4 group-hover:scale-110 transition-transform" />
              Create Your First Project
              <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              className="sm:w-auto"
            >
              I&apos;ll do this later
            </Button>
          </div>

          {/* Footer Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>🚀</span>
            <span>Let&apos;s get your forms live!</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
              </>
  );
}
