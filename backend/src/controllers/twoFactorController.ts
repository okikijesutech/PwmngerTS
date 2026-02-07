// @ts-ignore
import { authenticator } from "otplib";
import { toDataURL } from "qrcode";
import { prisma } from "../db/prisma";
import type { Request, Response } from "express";

export async function setup2FA(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  // Generate secret
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(userId, "PwmngerTS", secret);

  // Generate QR
  const qrCode = await toDataURL(otpauth);

  res.json({ secret, qrCode });
}

export async function verify2FASetup(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { token, secret } = req.body;

  if (!authenticator.check(token, secret)) {
    return res.status(400).json({ error: "Invalid token" });
  }

  // Determine user email from context or DB if needed for keyuri, but here we just save secret
  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorSecret: secret },
  });

  res.json({ success: true });
}

// Used during login
export async function verify2FALogin(
  userId: string,
  token: string,
): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.twoFactorSecret) return false;
  return authenticator.check(token, user.twoFactorSecret);
}
