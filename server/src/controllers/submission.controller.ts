// controllers/submission.controller.ts
import { asyncHandler } from "../lib/asyncHandler";
import Submission from "../models/submission.model";
import Project from "../models/project.model";
import User from "../models/user.model";
import { errorResponse, successResponse } from "../lib/response";
import logger from "../lib/logger";
import mongoose from "mongoose";
import { verifyPublicKey } from "../lib/Utils";
import { cacheDel, updateCache } from "../lib/redis.utils";
import { enqueueEmailJob } from "../lib/emailQueue";

// Get all submissions for a specific project
export const getSubmissionsByProject = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.params;
    const owner = req.user._id;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', startDate, endDate } = req.query;

    

    // Verify project ownership
    const project = await Project.findOne({ projectId, owner }).lean();
    if (!project) {
      return res.status(404).send(errorResponse(404, "Project not found or access denied"));
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort: { [key: string]: 1 | -1 } = { [String(sortBy)]: sortOrder === 'desc' ? -1 : 1 };

    // Build date filter if provided
    const dateFilter: Record<string, any> = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const filter: Record<string, any> = { projectId:project._id };
    if (Object.keys(dateFilter).length > 0) {
      filter.createdAt = dateFilter;
    }

    // Execute queries in parallel
    const [submissions, totalCount] = await Promise.all([
      Submission.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Submission.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    logger.info(`Submissions fetched successfully`, {
      projectId,
      owner,
      count: submissions.length,
      totalCount
    });

    res.status(200).send(successResponse(200, "Submissions fetched successfully", {
      submissions,
      project: {
        id: project._id,
        name: project.name,
        projectId: project.projectId
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    }));
  } catch (error) {
    logger.error("Error fetching submissions:", error, {
      projectId: req.params.projectId,
      owner: req.user._id
    });
    res.status(500).send(errorResponse(500, "Failed to fetch submissions"));
  }
});

// Get all submissions across all user's projects
export const getAllUserSubmissions = asyncHandler(async (req, res) => {
  try {
    const owner = req.user._id;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', projectId, startDate, endDate } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort: Record<string, 1 | -1> = { [String(sortBy)]: sortOrder === 'desc' ? -1 : 1 };

    // Get all user's projects
    const userProjects = await Project.find({ owner }).select('_id name projectId').lean();
    const projectIds = userProjects.map(p => p._id);

    if (projectIds.length === 0) {
      return res.status(200).send(successResponse(200, "No submissions found", {
        submissions: [],
        projects: [],
        pagination: {
          currentPage: parseInt(page),
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      }));
    }

    // Build filter
    const filter: Record<string, any> = { projectId: { $in: projectIds } };
    
    // Filter by specific project if provided
    if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
      if (projectIds.some(id => id.toString() === projectId)) {
        filter.projectId = new mongoose.Types.ObjectId(projectId);
      } else {
        return res.status(403).send(errorResponse(403, "Access denied to this project"));
      }
    }

    // Date filter
    if (startDate || endDate) {
      const dateFilter: Record<string, any> = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
      filter.createdAt = dateFilter;
    }

    // Execute queries in parallel
    const [submissions, totalCount] = await Promise.all([
      Submission.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'projects',
            localField: 'projectId',
            foreignField: '_id',
            as: 'project',
            pipeline: [
              { $project: { name: 1, projectId: 1 } }
            ]
          }
        },
        { $unwind: '$project' },
        { $sort: sort },
        { $skip: skip },
        { $limit: parseInt(limit) }
      ]),
      Submission.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    logger.info(`All user submissions fetched successfully`, {
      owner,
      count: submissions.length,
      totalCount,
      projectCount: userProjects.length
    });

    res.status(200).send(successResponse(200, "All submissions fetched successfully", {
      submissions,
      projects: userProjects,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    }));
  } catch (error) {
    logger.error("Error fetching all user submissions:", error, {
      owner: req.user._id
    });
    res.status(500).send(errorResponse(500, "Failed to fetch submissions"));
  }
});

// Get single submission by ID
export const getSubmissionById = asyncHandler(async (req, res) => {
  try {
    const { submissionId } = req.params;
    const owner = req.user._id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      return res.status(400).send(errorResponse(400, "Invalid submission ID format"));
    }

   const ownerObjectId = new mongoose.Types.ObjectId(owner);
  
  const submission = await Submission.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(submissionId) } },
    {
      $lookup: {
        from: 'projects',
        localField: 'projectId',
        foreignField: '_id',
        as: 'project'
      }
    },
    { $unwind: '$project' },
    {$project:{
      'project.keys':0,
      'project.authorizedOrigins':0,
      'project.emailNotifications':0,
      'project.createdAt':0,
      'project.updatedAt':0,
    }},
    { $match: { 'project.owner': ownerObjectId } } // must match ObjectId type
  ]);


    if (!submission || submission.length === 0) {
      return res.status(404).send(errorResponse(404, "Submission not found or access denied"));
    }

    logger.info(`Submission fetched successfully`, {
      submissionId,
      owner,
      projectId: submission[0].projectId
    });

    res.status(200).send(successResponse(200, "Submission fetched successfully", submission[0]));
  } catch (error) {
    logger.error("Error fetching submission:", error, {
      submissionId: req.params.submissionId,
      owner: req.user._id
    });
    res.status(500).send(errorResponse(500, "Failed to fetch submission"));
  }
});

// Delete submission
export const deleteSubmission = asyncHandler(async (req, res) => {
  try {
    const { submissionId } = req.params;
    const owner = req.user._id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      return res.status(400).send(errorResponse(400, "Invalid submission ID format"));
    }

    // Find submission and verify project ownership
    const submission = await Submission.findById(submissionId).lean();
    if (!submission) {
      return res.status(404).send(errorResponse(404, "Submission not found"));
    }

    // Verify project ownership
    const project = await Project.findOne({ _id: submission.projectId, owner }).lean();
    if (!project) {
      return res.status(403).send(errorResponse(403, "Access denied"));
    }

    // Delete submission
    await Submission.findByIdAndDelete(submissionId);

    logger.info(`Submission deleted successfully`, {
      submissionId,
      owner,
      projectId: submission.projectId
    });

    // TODO update cache of the project submissions count
    const cacheKey  = `project:${project.owner}:${project.projectId}`
    await cacheDel(cacheKey);
    res.status(200).send(successResponse(200, "Submission deleted successfully", { id: submissionId }));
  } catch (error) {
    logger.error("Error deleting submission:", error, {
      submissionId: req.params.submissionId,
      owner: req.user._id
    });
    res.status(500).send(errorResponse(500, "Failed to delete submission"));
  }
});

// Get submission analytics for a project
export const getSubmissionAnalytics = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.params;
    const owner = req.user._id;
    const { period = '7d' } = req.query; // 7d, 30d, 90d, 1y
 

    // Verify project ownership
    const project = await Project.findOne({  projectId, owner }).lean();
    if (!project) {
      return res.status(404).send(errorResponse(404, "Project not found or access denied"));
    }

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    console.log(project._id, projectId)

    // Get analytics data
    const [totalSubmissions, periodSubmissions, dailyStats, topOrigins, fieldStats] = await Promise.all([
      // Total submissions for this project
      Submission.countDocuments({ projectId: project._id }),
      
      // Submissions in the specified period
      Submission.countDocuments({
        projectId: project._id,
        createdAt: { $gte: startDate }
      }),
      
      // Daily submission counts
      Submission.aggregate([
        {
          $match: {
            projectId: project._id,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ]),
      
      // Top origins
      Submission.aggregate([
        {
          $match: {
            projectId: project._id,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: "$origin",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      
      // Field usage statistics
      Submission.aggregate([
        {
          $match: {
            projectId: project._id,
            createdAt: { $gte: startDate }
          }
        },
        {
          $project: {
            fieldKeys: { $objectToArray: "$fields" }
          }
        },
        { $unwind: "$fieldKeys" },
        {
          $group: {
            _id: "$fieldKeys.k",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);

    logger.info(`Submission analytics fetched successfully`, {
      projectId,
      owner,
      period,
      totalSubmissions,
      periodSubmissions
    });

    res.status(200).send(successResponse(200, "Analytics fetched successfully", {
      project: {
        id: project._id,
        name: project.name,
        projectId: project.projectId
      },
      analytics: {
        totalSubmissions,
        periodSubmissions,
        period,
        dailyStats,
        topOrigins,
        fieldStats
      }
    }));
  } catch (error) {
    logger.error("Error fetching submission analytics:", error, {
      projectId: req.params.projectId,
      owner: req.user._id
    });
    res.status(500).send(errorResponse(500, "Failed to fetch analytics"));
  }
});

// Export submissions as CSV
export const exportSubmissions = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.params;
    const owner = req.user._id;
    const { format = 'csv', startDate, endDate } = req.query;

     

    // Verify project ownership
    const project = await Project.findOne({ projectId, owner }).lean();
    if (!project) {
      return res.status(404).send(errorResponse(404, "Project not found or access denied"));
    }

    // Build filter
    const filter: Record<string, any> = { projectId:project._id };
    if (startDate || endDate) {
      const dateFilter: Record<string, any> = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
      filter.createdAt = dateFilter;
    }

    const submissions = await Submission.find(filter).lean();

    // Set appropriate headers for file download
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${project.name.replace(/[^a-zA-Z0-9]/g, '_')}_submissions_${timestamp}.${format}`;
    
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', format === 'json' ? 'application/json' : 'text/csv');

    if (format === 'json') {
      res.status(200).send(JSON.stringify(submissions, null, 2));
    } else {
      // Convert to CSV format
      if (submissions.length === 0) {
        return res.status(200).send('No submissions found');
      }

      // Get all unique field keys
      const allFieldKeys = [...new Set(submissions.flatMap(sub => Object.keys(sub.fields)))];
      
      // Create CSV header
      const csvHeader = ['ID', 'Created At', 'IP Address', 'User Agent', 'Origin', ...allFieldKeys].join(',');
      
      // Create CSV rows
      const csvRows = submissions.map(sub => {
        const baseData = [
          sub._id,
          sub.createdAt.toISOString(),
          sub.ipAddress,
          `"${sub.userAgent.replace(/"/g, '""')}"`,
          sub.origin
        ];
        
        const fieldData = allFieldKeys.map(key => {
          const value = sub.fields[key];
          return value ? `"${String(value).replace(/"/g, '""')}"` : '';
        });
        
        return [...baseData, ...fieldData].join(',');
      });

      const csvContent = [csvHeader, ...csvRows].join('\n');
      res.status(200).send(csvContent);
    }

    logger.info(`Submissions exported successfully`, {
      projectId,
      owner,
      format,
      count: submissions.length
    });

  } catch (error) {
    logger.error("Error exporting submissions:", error, {
      projectId: req.params.projectId,
      owner: req.user._id
    });
    res.status(500).send(errorResponse(500, "Failed to export submissions"));
  }
});

// POST /:projectId/submission
export const createSubmission = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.params;
    const { fields } = req.body;
    // Optionally, you can get these from headers or req.body
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';
    const origin = req.headers['origin'] || req.get('origin') || req.headers['referer'] || '';
    const publicKey = req.headers['x-formiq-key'] || req.body.formiqKey || '';
    // decode the api key from base64
    console.log("Dbug")
// Check if project exists
    const project = await Project.findOne({ projectId }).lean();
    if (!project) {
      return res.status(404).send(errorResponse(404, "Project not found"));
    }   
    console.log(project.owner)
    const owner = await User.findById(project.owner)

    if(!owner){
      return res.status(404).send(successResponse(404,"No associated owner found"))
    }
    // Validate PublicKey
    if (!publicKey || !verifyPublicKey(publicKey, project.keys.publicKey)) {
      console.log(`Invalid or missing public key: received "${publicKey}", expected "${project.keys.publicKey}"`);
      return res.status(403).send(errorResponse(403, "Invalid or missing public key"));
    }

    // Validate fields
    if (!fields || typeof fields !== 'object' || Array.isArray(fields)) {
      return res.status(400).send(errorResponse(400, "Fields must be a valid object"));
    }
 

    // Create and save the submission
    const submission = new Submission({
      projectId: project._id,
      fields,
      ipAddress,
      userAgent,
      origin
    });
    await submission.save();

    const cacheKey  = `project:${project.owner}:${project.projectId}`
    console.log(cacheKey)
    // !TODO - increament the number of submissions for the project in cache instead of deleting the cachce 
    await cacheDel(cacheKey);



    // Send the mail if the project has email notifications enabled
    if (project.emailNotifications) {
       await enqueueEmailJob({
        type: 'formSubmission',
        to: owner.email,
        data: {
          projectName: project.name,
          submissionId: submission._id,
          submissionFields: fields,
        }
      })
    }
    // convert the submission to response friendly submission using toJSON method
    const responseSubmission = submission.toJSON();
    
    logger.info("Submission created", { projectId, submissionId: submission._id });
    res.status(201).send(successResponse(201, "Submission created", responseSubmission));
  } catch (error) {
    logger.error("Error creating submission:", error, { projectId: req.params.projectId });
    res.status(500).send(errorResponse(500, "Failed to create submission"));
  }
});