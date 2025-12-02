import type { NextApiRequest, NextApiResponse } from "next";
import Formiq from "../core/formiq";

export function withFormiqHandler(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const formiq = new Formiq(
      process.env.FORMIQ_API_KEY!,
      process.env.FORMIQ_PROJECT_ID!
    );

    try {
      return await handler(req, res, formiq);
    } catch (err: any) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  };
}
