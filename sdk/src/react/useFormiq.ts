// react/useFormiq.ts
import { useState } from "react";
import Formiq from "../core/formiq";
import type { FormiqError } from "../types";

interface SubmitOptions {
  ipAddress?: string;
  userAgent?: string;
  origin?: string;
}

export function useFormiq(formiq: Formiq) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FormiqError | null>(null);

  const submit = async (data: Record<string, any>, options?: SubmitOptions) => {
    setLoading(true);
    setError(null);
    try {
      return await formiq.submitForm(data, options);
    } catch (err: any) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}
