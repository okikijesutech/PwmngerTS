import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth";
import vaultRoutes from "./routes/vault";
import publicRoutes from "./routes/public";
import pino from "pino-http";
import logger from "./utils/logger";
import { errorHandler } from "./middleware/errorHandler";
import cookieParser from "cookie-parser";

import session from "express-session";

const app: express.Application = express();

app.use(session({
  secret: process.env.SESSION_SECRET || "pwmnger-secret-session",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === "production", 
    httpOnly: true, 
    sameSite: "lax", 
    maxAge: 60 * 60 * 1000 // 1 hour 
  }
}));

app.use(compression());
app.use(helmet());
app.use(cookieParser());
app.use(pino({ logger }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 100 : 10000, // Relax in dev
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));

app.use("/auth", authRoutes);
app.use("/vault", vaultRoutes);
app.use("/public", publicRoutes);

app.use(errorHandler);

export default app;
