import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import vaultRoutes from "./routes/vault.js";

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(cors());
app.use(express.json({ limit: "10kb" }));

app.use("/auth", authRoutes);
app.use("/vault", vaultRoutes);

export default app;
