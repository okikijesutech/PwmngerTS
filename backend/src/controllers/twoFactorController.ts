import { generateSecret, generateURI, verifySync } from "otplib";
import { toDataURL } from "qrcode";
import { prisma } from "../db/prisma";
import type { Request, Response } from "express";

export async function setup2FA(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    console.log("Setting up 2FA for user:", userId);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Generate secret
    const secret = generateSecret();
    const otpauth = generateURI({
      secret,
      label: user.email,
      issuer: "PwmngerTS",
    });

    // Generate QR
    const qrCode = await toDataURL(otpauth);

    res.json({ secret, qrCode });
  } catch (err) {
    console.error("2FA Setup Error:", err);
    res.status(500).json({ error: "2FA Setup failed", details: String(err) });
  }
}

export async function verify2FASetup(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { token, secret } = req.body;

    if (!verifySync({ token, secret }).valid) {
      return res.status(400).json({ error: "Invalid token" });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("2FA Verification Error:", err);
    res.status(500).json({ error: "2FA Verification failed" });
  }
}

// Used during login
export async function verify2FALogin(
  userId: string,
  token: string,
): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.twoFactorSecret) return false;
  return verifySync({ token, secret: user.twoFactorSecret }).valid;
}
