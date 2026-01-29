import { prisma } from "../db/prisma.js";
import type { Request, Response } from "express";

interface AuthRequest extends Request {
  user?: { userId: string };
}

export async function uploadVault(req: AuthRequest, res: Response) {
  const { encryptedVault } = req.body;
  const userId = req.user!.userId;

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
