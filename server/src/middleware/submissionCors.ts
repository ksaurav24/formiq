import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import Project from "../models/project.model";
import { errorResponse } from "../lib/response";

export const submissionCors = async (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  const projectId = req.params.projectId;

  console.log(`CORS check for origin: ${origin}, projectId: ${projectId}`);

  if (!origin || !projectId) return res.status(400).send("Missing origin or projectId");

  const project = await Project.findOne({ projectId }).lean();
  if (!project) return res.status(404).send("Project not found");

  const isAllowed = project.authorizedDomains.some(domain => {
    if (domain.startsWith("*.")) {
      const regex = new RegExp(`^https?://([a-z0-9-]+\\.)${domain.slice(2).replace(/\./g, "\\.")}$`, "i");
      return regex.test(origin);
    }
    return origin === domain;
  });

  if (!isAllowed) return res.status(403).send("Origin not allowed");

  // **Apply headers for both OPTIONS and POST**
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    return res.status(204).send();
  }

  next(); // POST request continues
};

