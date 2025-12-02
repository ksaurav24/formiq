// app.ts
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/route';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (e.g., curl, Postman)
    if (!origin) return callback(null, true);

    // Dynamically allow the requesting origin
    callback(null, true);
  },
  credentials: true, // allow cookies/credentials
  allowedHeaders: ["Content-Type", "Authorization", "X-Formiq-Key"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.use("/api", routes);

export default app;
