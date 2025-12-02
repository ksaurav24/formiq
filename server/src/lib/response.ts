// packages/common/src/utils/response.ts

import { ApiResponse } from './ApiResponse'

export const successResponse = <T>(code=200, message = 'Success', data?: T): ApiResponse<T> => {
  return new ApiResponse({ success: true, message, data, code })
}

export const errorResponse = <T>(code=500, message = 'Something went wrong', errors: string[] = [], data?: T): ApiResponse<T> => {
  return new ApiResponse({ success: false, message, code, errors, data })
}