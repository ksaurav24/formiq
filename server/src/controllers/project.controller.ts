// controllers/project.controller.ts
import { asyncHandler } from "./../lib/asyncHandler";
import Project from "../models/project.model";
import { generateKeyPairBase64 } from "../lib/Utils";
import { errorResponse, successResponse } from "../lib/response"; 
import logger from "../lib/logger";
import mongoose from "mongoose";
import Submission from "../models/submission.model";
import {
  bumpUserProjectVersion, 
  cacheFetch,
  cacheGet,
  cacheSet,
  getUserProjectVersion,
  updateCache,
} from "../lib/redis.utils";

// Create project with enhanced error handling and transactions
export const createProject = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      authorizedDomains = [],
      emailNotifications = false,
      email,
    } = req.body;
    const owner = req.user._id;

    // Check duplicate project name for user
    const existingProject = await Project.findOne({
      name: name?.trim(),
      owner,
    });

    if (existingProject) {
      return res
        .status(409)
        .send(errorResponse(409, "Project name already exists"));
    }

    // Generate secure key pair
    const { publicKey, privateKey } = generateKeyPairBase64();

    // Generate unique projectId
    const projectId = `${owner.toString().slice(-6)}-${name
      ?.toLowerCase()
      .replace(/\s+/g, "-")}-${Date.now()}`;

    const project = await Project.create({
      projectId,
      name: name?.trim(),
      description: description?.trim(),
      owner,
      keys: { publicKey, privateKey },
      authorizedDomains:
        authorizedDomains?.map((domain: any) =>
          domain.toLowerCase().trim()
        ) || [],
      emailNotifications,
      email: email?.toLowerCase().trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Clear cached project data
    await bumpUserProjectVersion(owner);

    const projectResponse = project.toJSON();

    logger.info("Project created successfully", {
      projectId: project._id,
      owner,
      name: project.name,
    });

    res
      .status(201)
      .send(
        successResponse(201, "Project created successfully", projectResponse)
      );
  } catch (error: any) {
    logger.error("Error creating project:", error, {
      owner: req.user._id,
      requestBody: { ...req.body, keys: "[REDACTED]" },
    });

    if (error.code === 11000) {
      return res
        .status(409)
        .send(errorResponse(409, "Project with this name already exists"));
    }

    res.status(500).send(errorResponse(500, "Failed to create project"));
  }
});


// Get projects by user with pagination, sorting, and filtering
export const getProjectByUser = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search,
  } = req.query;

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const sort: { [key: string]: 1 | -1 } = {
    [String(sortBy)]: sortOrder === "desc" ? -1 : 1,
  };

  const filter: Record<string, any> = { owner };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const version = await getUserProjectVersion(owner);
  const cacheKey = `projects:v${version}:${owner}:page:${page}:limit:${limit}:sort:${sortBy}:${sortOrder}:search:${
    search || ""
  }`;
  try {
    const data = await cacheFetch(
      cacheKey,
      async () => {
        const [projects, totalCount] = await Promise.all([
          Project.find(filter)
            .select("name description createdAt updatedAt projectId")
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
          Project.countDocuments(filter),
        ]);

        return {
          projects,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            hasNextPage: parseInt(page) < Math.ceil(totalCount / limit),
            hasPrevPage: parseInt(page) > 1,
          },
        };
      },
      3600,
      res.setHeader.bind(res)
    );

    logger.info("Projects fetched successfully", {
      owner,
      count: data.projects.length,
      page: parseInt(page),
      totalCount: data.pagination.totalCount,
    });

    res
      .status(200)
      .send(successResponse(200, "Projects fetched successfully", data));
  } catch (error) {
    logger.error("Error fetching projects:", error, { owner });
    res.status(500).send(errorResponse(500, "Failed to fetch projects"));
  }
});

// Get project by ID with enhanced security
export const getProjectById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const owner = req.user._id;
    let projectId;

    // Validate ObjectId format
    if (mongoose.Types.ObjectId.isValid(id)) {
      projectId = id;
    } else {
      projectId = null;
    }
    // cache check by owner and projectId or id
    const cacheKey = `project:${owner}:${projectId || id}`;
    console.log(cacheKey)
    const cachedProject = await cacheGet(cacheKey);
    if (cachedProject) {
      logger.info(`Project fetched from cache`, { cacheKey });
      // set headers to indicate cache hit
      res.setHeader("X-Cache", "HIT");
      return res
        .status(200)
        .send(
          successResponse(200, "Project fetched successfully", cachedProject)
        );
    }
    const project = await Project.findOne({
      $or: projectId ? [{ _id: projectId }] : [],
      projectId: !projectId ? id : null,
      owner,
    })
      .select("-keys.privateKey") // Exclude private key from response
      .lean();

    if (!project) {
      logger.warn(`Project not found or access denied`, {
        projectId: id,
        owner: owner,
      });
      return res.status(404).send(errorResponse(404, "Project not found"));
    }

    // other analytics or related data i.e. submission count and last submission date
    const submissionCount = await Submission.countDocuments({
      projectId: project._id,
    });
    // fetch last submission date only if there are submissions to avoid unnecessary db call
    let lastSubmission: Date | null = null;
    if (submissionCount > 0) {
      const lastSubmissionDoc = await Submission.findOne({
        project: project._id,
      })
        .sort({ createdAt: -1 })
        .lean();

      lastSubmission = lastSubmissionDoc ? lastSubmissionDoc.createdAt : null;
    }

    logger.info(`Project fetched successfully`, {
      projectId: id,
      owner: owner,
    });
    // set headers to indicate cache miss
    res.setHeader("X-Cache", "MISS");
    // set the project data in cache here for future requests
    // As there is the chance of project updates, so we set a TTL of 15 minutes (i.e. backend will serve stale data for 15 minutes max)
    await cacheSet(
      cacheKey,
      { ...project, submissionCount, lastSubmission },
      900
    ); // Cache for 15 minutes

    res.status(200).send(
      successResponse(200, "Project fetched successfully", {
        ...project,
        submissionCount,
        lastSubmission,
      })
    );
  } catch (error) {
    logger.error("Error fetching project:", error, {
      projectId: req.params.id,
      owner: req.user._id,
    });
    res.status(500).send(errorResponse(500, "Failed to fetch project"));
  }
});

// Update project with optimistic locking and partial updates
export const updateProject = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const owner = req.user._id;
    let projectId;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      projectId = id;
    } else {
      projectId = null;
    }

    const {
      name,
      description,
      authorizedDomains,
      emailNotifications,
      email,
    } = req.body;

    // Check if project exists and user owns it
    const existingProject = await Project.findOne(
      projectId
        ? { projectId, owner }
        : { _id: id, owner }
    );

    if (!existingProject) {
      return res.status(404).send(errorResponse(404, "Project not found"));
    }

    // Check for duplicate name if name is being changed
    if (name && name.trim() !== existingProject.name) {
      const duplicateProject = await Project.findOne({
        name: name.trim(),
        owner,
        _id: { $ne: existingProject._id },
      });

      if (duplicateProject) {
        return res
          .status(409)
          .send(errorResponse(409, "Project name already exists"));
      }
    }

    // Prepare update object with only provided fields
    const updateData: { [key: string]: any } = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim();
    if (authorizedDomains !== undefined) {
      updateData.authorizedDomains =
        authorizedDomains?.map((domain: any) =>
          domain.toLowerCase().trim()
        ) || [];
    }
    if (emailNotifications !== undefined)
      updateData.emailNotifications = emailNotifications;
    if (email !== undefined) updateData.email = email?.toLowerCase().trim();

    const updatedProject = await Project.findOneAndUpdate(
      { _id: existingProject._id, owner },
      { $set: updateData },
      {
        new: true,
        select: "-keys.privateKey",
      }
    ).lean();

    logger.info(`Project updated successfully`, {
      projectId: id,
      owner,
      updatedFields: Object.keys(updateData),
    });

    // Invalidate cache for this project and user's project list
    await bumpUserProjectVersion(owner);
    const cacheKey = `project:${owner}:${projectId || id}`;
    await updateCache(cacheKey, updatedProject, 900); // Update cache for 15 minutes

    res
      .status(200)
      .send(
        successResponse(200, "Project updated successfully", updatedProject)
      );
  } catch (error: any) {
    logger.error("Error updating project:", error, {
      projectId: req.params.id,
      owner: req.user._id,
    });

    if (error.code === 11000) {
      return res
        .status(409)
        .send(errorResponse(409, "Project name already exists"));
    }

    res.status(500).send(errorResponse(500, "Failed to update project"));
  }
});


// Delete project with cascade operations
export const deleteProject = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const owner = req.user._id;
    let projectId;

    // Validate ObjectId format
    if (mongoose.Types.ObjectId.isValid(id)) {
      projectId = id;
    } else {
      projectId = null;
    }

    const project = await Project.findOneAndDelete(
      projectId
        ? { _id: projectId, owner }
        : { projectId: id, owner }
    ).lean();

    if (!project) {
      return res.status(404).send(errorResponse(404, "Project not found"));
    }

    // Optional: cascade deletions for related data
    // Example: await RelatedModel.deleteMany({ projectId: id });

    logger.info(`Project deleted successfully`, {
      projectId: id,
      owner,
      projectName: project.name,
    });

    // Delete or invalidate cache
    await bumpUserProjectVersion(owner);

    res.status(200).send(
      successResponse(200, "Project deleted successfully", { projectId: id })
    );
  } catch (error) {
    logger.error("Error deleting project:", error, {
      projectId: req.params.id,
      owner: req.user._id,
    });
    res.status(500).send(errorResponse(500, "Failed to delete project"));
  }
});

// Regenerate project keys
export const regenerateKeys = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const owner = req.user._id;

    const project = await Project.findOne({ _id: id, owner });

    if (!project) {
      return res.status(404).send(errorResponse(404, "Project not found"));
    }

    // Generate new key pair
    const { publicKey, privateKey } = generateKeyPairBase64();

    project.keys = { publicKey, privateKey };
    project.updatedAt = new Date();

    await project.save();

    logger.info(`Project keys regenerated`, {
      projectId: id,
      owner,
    });

    // Return only public key
    res.status(200).send(
      successResponse(200, "Keys regenerated successfully", {
        publicKey,
        updatedAt: project.updatedAt,
      })
    );
  } catch (error) {
    logger.error("Error regenerating keys:", error, {
      projectId: req.params.id,
      owner: req.user._id,
    });
    res.status(500).send(errorResponse(500, "Failed to regenerate keys"));
  }
});

