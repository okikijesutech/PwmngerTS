import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { uploadVault, downloadVault } from "../controllers/vaultController.js";

const router = Router();
router.post("/sync", requireAuth, uploadVault);
router.get("/sync", requireAuth, downloadVault);

export default router;
