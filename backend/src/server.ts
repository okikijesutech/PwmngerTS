import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import vaultRoutes from "./routes/vault.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/vault", vaultRoutes);

export default app;
