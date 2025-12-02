import type { FormiqResponse, FormiqError } from "../types";

export async function request<T>(
  url: string,
  options: {
    method: "GET" | "POST";
    headers?: Record<string, string>;
    body?: Record<string, any>;
  }
): Promise<FormiqResponse<T>> {
  const res = await fetch(url, {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({})) as T;

  if (!res.ok) {
    throw {
      status: res.status,
      message: (data as any).message || res.statusText,
      details: data,
    } as FormiqError;
  }

  return { success: true, data };
}
