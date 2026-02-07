import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { prisma } from "../db/prisma";
import type { Request, Response } from "express";

export async function register(req: Request, res: Response) {
  const { email, authHash } = req.body;

  try {
    // Zero-Knowledge: Client sends hash of password. Server hashes THAT.
    // Server never knows "Master Password".
    const serverHash = await argon2.hash(authHash);

    const user = await prisma.user.create({
      data: { email, passwordHash: serverHash },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
}

import { verify2FALogin } from "./twoFactorController";

export async function login(req: Request, res: Response) {
  const { email, authHash, twoFactorToken } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid login" });

  const ok = await argon2.verify(user.passwordHash, authHash);
  if (!ok) return res.status(401).json({ error: "Invalid login" });

  // 2FA Check
  if (user.twoFactorSecret) {
    if (!twoFactorToken) {
      return res.status(401).json({ error: "2FA Required", requires2FA: true });
    }

    const valid2FA = await verify2FALogin(user.id, twoFactorToken);
    if (!valid2FA) {
      return res.status(401).json({ error: "Invalid 2FA Token" });
    }
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.json({ token });
}
