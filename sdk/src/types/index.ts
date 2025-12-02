// types.ts

export interface FormiqError {
  status: string;  // "error"
  message: string;
  code: number;
  timestamp: string;
  data?: any;
  errors?: string[];
}

export interface FormiqSubmissionData {
  fields: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface FormiqResponse {
  status: string;  // "success"
  message: string;
  data: FormiqSubmissionData;
  code: number;
  timestamp: string;
}

export interface formiqSubmitOptions {

}