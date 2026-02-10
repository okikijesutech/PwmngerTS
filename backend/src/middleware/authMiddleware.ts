import * as jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  let token = req.cookies.accessToken;

  // Mobile/API Support: Check Bearer token if cookie is missing
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }

  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
