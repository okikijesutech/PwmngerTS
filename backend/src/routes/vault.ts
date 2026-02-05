import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware";
import { uploadVault, downloadVault } from "../controllers/vaultController";

const router: Router = Router();
router.post("/sync", requireAuth, uploadVault);
router.get("/sync", requireAuth, downloadVault);

export default router;
