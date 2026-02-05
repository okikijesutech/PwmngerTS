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

export async function login(req: Request, res: Response) {
  const { email, authHash } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid login" });

  const ok = await argon2.verify(user.passwordHash, authHash);
  if (!ok) return res.status(401).json({ error: "Invalid login" });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.json({ token });
}
