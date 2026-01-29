import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { prisma } from "../db/prisma.js";
import type { Request, Response } from "express";

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;

  const hash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { email, passwordHash: hash },
  });

  res.json({ success: true });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid login" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid login" });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.json({ token });
}
