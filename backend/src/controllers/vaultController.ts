import { prisma } from "../db/prisma";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";

interface AuthRequest extends Request {
  user?: { userId: string };
}

export async function uploadVault(req: AuthRequest, res: Response, next: NextFunction) {
  const { vaultPayload } = req.body;
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
    const clientUpdatedAt = vaultPayload.updatedAt || 0;

    if (cloudUpdatedAt > clientUpdatedAt) {
      return next(new AppError("CONFLICT: Cloud version is newer than client version", 409));
    }
  }

  const encryptedString = JSON.stringify(vaultPayload);

  await prisma.vault.upsert({
    where: { userId },
    update: { encrypted: encryptedString },
    create: { encrypted: encryptedString, userId },
  });

  res.json({ success: true });
}

export async function downloadVault(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;

    const vault = await prisma.vault.findUnique({ where: { userId } });
    if (!vault) return res.json({ vaultPayload: null });

    const payload =
      typeof vault.encrypted === "string"
        ? JSON.parse(vault.encrypted)
        : vault.encrypted;

    res.json({ vaultPayload: payload });
  } catch (error) {
    next(error);
  }
}
