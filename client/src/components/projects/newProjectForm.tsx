"use client";

import React, { useState } from "react";
import useProjectStore from "@/store/project.store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Spinner } from "../ui/spinner";

export default function NewProjectForm({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const { newProject } = useProjectStore();

  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    authorizedDomains: [""],
    emailNotifications: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!projectData.name.trim()) errs.name = "Project name is required";
    projectData.authorizedDomains.forEach((origin, i) => {
      if (!origin.trim()) errs[`origin-${i}`] = "Origin cannot be empty";
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setProjectData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOriginChange = (index: number, value: string) => {
    const newOrigins = [...projectData.authorizedDomains];
    newOrigins[index] = value;
    handleChange("authorizedDomains", newOrigins);
  };

  const addOriginField = () => {
    setProjectData((prev) => ({
      ...prev,
      authorizedDomains: [...prev.authorizedDomains, ""],
    }));
  };

  const removeOriginField = (index: number) => {
    setProjectData((prev) => ({
      ...prev,
      authorizedDomains: prev.authorizedDomains.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const newProj = await newProject(projectData);
      toast.success("Project created successfully", {
        closeButton: true,
      });
      if (onClose) onClose();
      router.push(`/projects/${newProj?.projectId}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 p-6 bg-card text-card-foreground"
    >
      <DialogHeader>
        <DialogTitle>Create a New Project</DialogTitle>
        <DialogDescription>
          Fill out the details below to set up a new project and define allowed origins.
        </DialogDescription>
      </DialogHeader>

      {/* Project Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          value={projectData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter project name"
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={projectData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Project description (optional)"
        />
      </div>

      {/* Allowed Origins */}
      <div className="space-y-2">
        <Label>Allowed Origins</Label>
        <AnimatePresence>
          {projectData.authorizedDomains.map((origin, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex gap-2 items-center"
            >
              <Input
                value={origin}
                onChange={(e) => handleOriginChange(idx, e.target.value)}
                placeholder="https://example.com"
                className={errors[`origin-${idx}`] ? "border-destructive" : ""}
              />
              {projectData.authorizedDomains.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeOriginField(idx)}
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addOriginField}
          className="mt-2"
        >
          + Add another origin
        </Button>
      </div>

      {/* Email Notifications */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="email-notifications"
          checked={projectData.emailNotifications}
          onCheckedChange={(checked) => handleChange("emailNotifications", checked)}
        />
        <Label htmlFor="email-notifications" className="cursor-pointer">
          Enable email notifications
        </Label>
      </div>

      <DialogFooter className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? <div className="flex items-center gap-2">
              <Spinner className="size-4" />
              Creating...
            </div>
              : "Create Project"}
        </Button>
      </DialogFooter>
    </form>
  );
}
