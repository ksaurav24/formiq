import cors from 'cors';
import { hybridAtomicMiddlewareWithHeaders } from '../../middleware/rateLimiter';
// routes/submission.routes.ts
import { Router } from 'express';
import {
  getSubmissionsByProject,
  getAllUserSubmissions,
  getSubmissionById,
  deleteSubmission,
  getSubmissionAnalytics,
  exportSubmissions,
  createSubmission
} from '../../controllers/submission.controller'; 
import { validateRequest } from '../../middleware/validation.middleware'; 
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

 

router.post(
  '/project/:projectId/submit', 
  // hybridAtomicMiddlewareWithHeaders,
  createSubmission
);


router.use(authMiddleware);
// Get all submissions across user's projects
router.get('/', getAllUserSubmissions);

// Get single submission by ID
router.get('/:submissionId', validateRequest('submissionId'), getSubmissionById);

// Delete single submission
router.delete('/:submissionId', validateRequest('submissionId'), deleteSubmission);

// Project-specific submission routes
router.get('/project/:projectId',getSubmissionsByProject);
router.get('/project/:projectId/analytics',getSubmissionAnalytics);
router.get('/project/:projectId/export',exportSubmissions);

  

export default router;
