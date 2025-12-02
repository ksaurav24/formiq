// middleware/validation.middleware.ts
import { body, param, query, validationResult } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../lib/response';
import logger from '../lib/logger';

const validationRules = {
  createProject: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Project name is required')
      .isLength({ min: 3, max: 100 })
      .withMessage('Project name must be between 3-100 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    
    body('authorizedDomains')
      .optional()
      .isArray()
      .withMessage('Authorized domains must be an array')
      .custom((domains) => {
        // Allows exact domains and wildcard subdomains like *.example.com or * first split by .
        const domainRegex = /^(?:\*\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
        for (const domain of domains) {
          if (domain !== '*' && !domainRegex.test(domain)) {
            logger.error(`Invalid domain format: ${domain}`);
          }
        }
        return true;
      })
      .withMessage('Invalid domain format'),
    
    body('emailNotifications')
      .optional()
      .isBoolean()
      .withMessage('Email notifications must be boolean'),
    
    body('email')
      .optional()
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail()
  ],

  updateProject: [
    param('id').notEmpty().withMessage('Invalid project ID'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Project name must be between 3-100 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    
    body('authorizedDomains')
      .optional()
      .isArray()
      .withMessage('Authorized domains must be an array'),
    
    body('emailNotifications')
      .optional()
      .isBoolean()
      .withMessage('Email notifications must be boolean'),
    
    body('email')
      .optional()
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail()
  ],
  

  createTicket:[
    body('name').isString().notEmpty().withMessage('Name must be between 2 and 100 characters'),
    body('email').isEmail().withMessage('Enter a valid email').normalizeEmail(),
    body('subject').isString().isLength({ min: 5, max: 120 }).withMessage('Subject must be at least 5 characters and max 120 characters'),
    body('category').isIn(['billing', 'technical', 'account', 'feedback', 'other']).withMessage('Select a valid category'),
    body('priority').isIn(['low', 'normal', 'high', 'urgent']).withMessage('Select a valid priority'),
    body('projectId').optional().isString().withMessage('Project ID must be a string'),
    body('url').optional().isURL().withMessage('Enter a valid URL'),
    body('description').isString().isLength({ min: 10 }).withMessage('Please describe the issue in detail'),
    body('steps').optional().isString().withMessage('Steps must be a string'),
    body('expected').optional().isString().withMessage('Expected result must be a string'),
    body('actual').optional().isString().withMessage('Actual result must be a string'),
    body('subscribe').optional().isBoolean().withMessage('Subscribe must be a boolean'),
    body('consent').isBoolean().custom(value => value === true).withMessage('You must consent to be contacted')
  ],

  submissionId: [
    param('submissionId').isMongoId().withMessage('Invalid submission ID')
  ],

  submissionQuery: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    
    query('sortBy')
      .optional()
      .isIn(['createdAt', 'updatedAt'])
      .withMessage('Sort by must be createdAt or updatedAt'),
    
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc'),
    
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be valid ISO date'),
    
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be valid ISO date')
  ]
};

export const validateRequest = (ruleName: keyof typeof validationRules) => {
  return [
    ...validationRules[ruleName],
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send(
          errorResponse(400, "Validation failed", errors.array().map(e => e.msg) )
        );
      }
      next();
    }
  ];
};
