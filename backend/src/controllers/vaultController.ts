import { prisma } from "../db/prisma";
import type { Request, Response } from "express";

interface AuthRequest extends Request {
  user?: { userId: string };
}

export async function uploadVault(req: AuthRequest, res: Response) {
  const { encryptedVault } = req.body;
  const userId = req.user!.userId;

  // Check for conflicts: prevent older data from overwriting newer cloud data
  const existing = await prisma.vault.findUnique({ where: { userId } });

  if (existing && existing.encrypted) {
    let cloudVault: any;
    try {
      cloudVault =
        typeof existing.encrypted === "string"
          ? JSON.parse(existing.encrypted)
          : existing.encrypted;
    } catch {
      cloudVault = {};
    }

    const cloudUpdatedAt = cloudVault.updatedAt || 0;
    const clientUpdatedAt = encryptedVault.updatedAt || 0;

    if (cloudUpdatedAt > clientUpdatedAt) {
      return res.status(409).json({
        success: false,
        error: "CONFLICT",
        message: "Cloud version is newer than client version",
      });
    }
  }

  await prisma.vault.upsert({
    where: { userId },
    update: { encrypted: encryptedVault },
    create: { encrypted: encryptedVault, userId },
  });

  res.json({ success: true });
}

export async function downloadVault(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;

  const vault = await prisma.vault.findUnique({ where: { userId } });
  if (!vault) return res.json({ encryptedVault: null });

  res.json({ encryptedVault: vault.encrypted });
}
