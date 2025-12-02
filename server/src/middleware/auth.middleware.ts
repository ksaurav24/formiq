import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth"; //Better-Auth instance
import logger from "../lib/logger";
import { errorResponse } from "../lib/response";


export const authMiddleware = async (req:any, res:any, next:any) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).send(errorResponse(401, "Unauthorized", ["No active session"]));
    }

    req.user = session.user;
    req.user._id = session.user.id; // Ensure _id is set for MongoDB operations
    next();
  } catch (error) {
    logger.error("Auth middleware error:", error);
    res.status(500).send(errorResponse(500, "Internal Server Error", ["An unexpected error occurred"]));
  }
};
