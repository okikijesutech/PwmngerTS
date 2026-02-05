import { Router } from "express";
import { register, login } from "../controllers/authController";

import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import type { Request, Response, NextFunction } from "express";

const router: Router = Router();

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts per hour
  message: { error: "Too many login attempts, please try again later." },
});

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerValidation = [
  body("email").isEmail().withMessage("Invalid email"),
  body("authHash").isLength({ min: 32 }).withMessage("Invalid auth hash format"),
];

router.post("/register", authLimiter, registerValidation, validate, register);
router.post("/login", authLimiter, login);

export default router;
