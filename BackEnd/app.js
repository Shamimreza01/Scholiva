import cors from "cors";
import "dotenv/config";
import express from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";

import authRoutes from "./routes/authRoutes.js";
import classroomRoutes from "./routes/classroomRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// --- CUSTOM SECURITY LOGIC (Express 5 Compatible) ---

const scholivaSanitize = (obj) => {
  if (obj && typeof obj === "object") {
    Object.keys(obj).forEach((key) => {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
      } else if (typeof obj[key] === "object") {
        scholivaSanitize(obj[key]);
      }
    });
  }
};

const securitySanitizer = (req, res, next) => {
  if (req.body) scholivaSanitize(req.body);
  if (req.query) scholivaSanitize(req.query);
  if (req.params) scholivaSanitize(req.params);
  next();
};

// --- SECURITY MIDDLEWARE ---

// 1. Set Secure HTTP Headers
app.use(helmet());

// 2. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api", limiter);

// 3. CORS Configuration
app.use(
  cors({
    origin: ["https://scholiva.netlify.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
  }),
);

// 4. Body Parser & Sanitization
app.use(express.json({ limit: "10kb" }));
app.use(securitySanitizer);

// 6. Prevent HTTP Parameter Pollution
app.use(hpp());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/posts", postRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("Quiz App API is running...");
});

export default app;
