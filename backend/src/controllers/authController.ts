import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { prisma } from "../db/prisma";
import type { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import { AppError } from "../utils/errors";
import crypto from "crypto";

export async function register(req: Request, res: Response, next: NextFunction) {
  const { email, authHash } = req.body;

  try {
    const serverHash = await argon2.hash(authHash);

    const user = await prisma.user.create({
      data: { email, passwordHash: serverHash },
    });

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });

    const refreshTokenString = crypto.randomBytes(40).toString("hex");
    await prisma.refreshToken.create({
      data: {
        token: refreshTokenString,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshTokenString, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return tokens for Mobile/API clients
    res.json({ 
      success: true, 
      accessToken,
      refreshToken: refreshTokenString
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      return next(new AppError("An account with this email already exists", 409));
    }
    next(err);
  }
}

import { verify2FALogin } from "./twoFactorController";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, authHash, twoFactorToken } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return next(new AppError("Invalid login", 401));

    const ok = await argon2.verify(user.passwordHash, authHash);
    if (!ok) return next(new AppError("Invalid login", 401));

    if (user.twoFactorSecret) {
      if (!twoFactorToken) {
        return res.status(401).json({ error: "2FA Required", requires2FA: true });
      }

      const valid2FA = await verify2FALogin(user.id, twoFactorToken);
      if (!valid2FA) {
        return next(new AppError("Invalid 2FA Token", 401));
      }
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });

    const refreshTokenString = crypto.randomBytes(40).toString("hex");
    await prisma.refreshToken.create({
      data: {
        token: refreshTokenString,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshTokenString, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return tokens for Mobile/API clients
    res.json({ 
      success: true, 
      accessToken,
      refreshToken: refreshTokenString
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return next(new AppError("Refresh token required", 400));

  try {
    const tokenData = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenData || tokenData.expiresAt < new Date()) {
      if (tokenData) {
        await prisma.refreshToken.delete({ where: { id: tokenData.id } });
      }
      return next(new AppError("Invalid or expired refresh token", 401));
    }

    const accessToken = jwt.sign(
      { userId: tokenData.userId },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    // Return token for Mobile/API clients
    res.json({ success: true, accessToken });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  const refreshToken = req.cookies.refreshToken;
  
  try {
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({
    email: user.email,
    is2FAEnabled: !!user.twoFactorSecret,
  });
}
