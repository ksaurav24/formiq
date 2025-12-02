import type { Request, Response, NextFunction } from "express"; 
import logger from "../lib/logger";
import { checkMultipleBucketsWithRemaining } from "../lib/rateLimiter.helper";
import { errorResponse } from "../lib/response";

const BUCKETS = [
  { name: "shortTerm", capacity: 10, refillTokens: 1, interval: 60000 },   // 10/min per client
  { name: "longTerm", capacity: 100, refillTokens: 1, interval: 3600000 }, // 100/hour per client
];

export const hybridAtomicMiddlewareWithHeaders = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = req.params.projectId;
      if (!projectId) return res.status(400).send(errorResponse(400, "Bad Request", ["Missing projectId in request parameters"]));

      const clientId = req.ip; // or req.user.id if authenticated
      console.log("Client ID:", clientId);
      if (!clientId) return res.status(400).send(errorResponse(400, "Bad Request", ["Unable to determine client identity"]));
      const buckets = BUCKETS.flatMap(b => [
        {
          key: `rate_limit:${b.name}:${projectId}:client:${clientId}`,
          name: `client:${b.name}`,
          capacity: b.capacity,
          refillTokens: b.refillTokens,
          interval: b.interval
        },
        {
          key: `rate_limit:${b.name}:${projectId}:global`,
          name: `project:${b.name}`,
          capacity: b.capacity * 10,        // higher project-level limit
          refillTokens: b.refillTokens * 10,
          interval: b.interval
        }
      ]);

      console.log("Rate limit buckets:", buckets.map(b => b.key));
      const { allowed, remaining } = await checkMultipleBucketsWithRemaining(buckets);

      // Add headers for frontend
      res.setHeader("X-RateLimit-Limit", Math.max(...buckets.map(b => b.capacity)));
      res.setHeader("X-RateLimit-Remaining", Math.min(...Object.values(remaining)));
      res.setHeader("X-RateLimit-Reset", Date.now() + Math.min(...buckets.map(b => b.interval)));

      if (!allowed) return res.status(429).send(errorResponse(429, "Rate limit exceeded", ["Too many requests, please try again later."], { remaining}));

      next();
    } catch (err) {
      logger.error("Hybrid atomic rate limit error:", err);
      res.status(500).send(errorResponse(500, "Internal server error", [err instanceof Error && process.env.NODE_ENV !== "production" ? err.message : "Internal server error"]));
    }
  };
};
