// routes/project.routes.ts
import { Router } from 'express';
import {
  createProject,
  getProjectByUser,
  getProjectById,
  updateProject,
  deleteProject,
  regenerateKeys
} from '../../controllers/project.controller'; 
import { validateRequest } from '../../middleware/validation.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// Project CRUD routes
router.post('/', validateRequest('createProject'), createProject);
router.get('/', getProjectByUser);
router.get('/:id',  getProjectById);
router.put('/:id', validateRequest('updateProject'), updateProject);
router.delete('/:id',  deleteProject);

// Additional project operations
router.post('/:id/regenerate-keys',  regenerateKeys);

export default router;
