 import cors from "cors";

export const dashboardCors = cors({
  origin: [process.env.environment !== "production" ? "http://localhost:3000" : process.env.DASHBOARD_URL!],  // only your dashboard
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

