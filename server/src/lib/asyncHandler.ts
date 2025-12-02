/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/asyncHandler.ts
import { errorResponse } from './response'

export const asyncHandler =
  (fn: (req:any, res:any, next:any) => Promise<any>) =>
  (req:any, res:any, next:any) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      const statusCode = error?.statusCode || 500
      const message = error?.message || 'Internal Server Error'
      const errors = error?.errors || ['An unexpected error occurred']
      res.status(statusCode).json(errorResponse(statusCode, message, errors))
    })
  }
