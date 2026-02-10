import { Router } from "express";
import { register, login, getMe, refresh, logout } from "../controllers/authController";
import { setup2FA, verify2FASetup } from "../controllers/twoFactorController";
import { 
  getRegistrationOptions, 
  verifyRegistration, 
  getAuthenticationOptions, 
  verifyAuthentication 
} from "../controllers/webAuthnController";
import { requireAuth } from "../middleware/authMiddleware";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import type { Request, Response, NextFunction } from "express";

const router: Router = Router();

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === "production" ? 10 : 1000, // Relax in dev
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
  body("authHash")
    .isLength({ min: 32 })
    .withMessage("Invalid auth hash format"),
];

router.post("/register", authLimiter, registerValidation, validate, register);
router.post("/login", authLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", requireAuth, getMe);

// 2FA Routes
router.post("/2fa/setup", requireAuth, setup2FA);
router.post("/2fa/verify", requireAuth, verify2FASetup);

// WebAuthn / YubiKey Routes
router.post("/2fa/webauthn/register/options", requireAuth, getRegistrationOptions);
router.post("/2fa/webauthn/register/verify", requireAuth, verifyRegistration);
router.post("/2fa/webauthn/login/options", getAuthenticationOptions);
router.post("/2fa/webauthn/login/verify", verifyAuthentication);

export default router;
