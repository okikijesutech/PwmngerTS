import { register, login } from "./authController.js";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { prisma } from "../db/prisma.js";
import type { Request, Response } from "express";

// Mock dependencies
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../db/prisma.js");

describe("Auth Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let nextMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    jsonMock = jest.fn().mockReturnValue(undefined);
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    nextMock = jest.fn();

    mockReq = {
      body: {},
    };

    mockRes = {
      json: jsonMock,
      status: statusMock,
    };
  });

  describe("register", () => {
    it("should register a new user with hashed password", async () => {
      const email = "test@example.com";
      const password = "password123";
      const hashedPassword = "hashed_password_123";

      mockReq.body = { email, password };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: "user-123",
        email,
        passwordHash: hashedPassword,
      });

      await register(mockReq as any, mockRes as any, nextMock);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 12);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { email, passwordHash: hashedPassword },
      });
      expect(jsonMock).toHaveBeenCalledWith({ success: true });
    });

    it("should handle duplicate email error", async () => {
      const email = "existing@example.com";
      const password = "password123";

      mockReq.body = { email, password };

      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");
      (prisma.user.create as jest.Mock).mockRejectedValue(
        new Error("Unique constraint violation"),
      );

      await expect(register(mockReq as any, mockRes as any, nextMock)).rejects.toThrow();
    });
  });

  describe("login", () => {
    const email = "test@example.com";
    const password = "password123";
    const hashedPassword = "hashed_password_123";
    const userId = "user-123";
    const token = "jwt_token_123";

    it("should login user with correct password", async () => {
      mockReq.body = { email, password };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: userId,
        email,
        passwordHash: hashedPassword,
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      (jwt.sign as jest.Mock).mockReturnValue(token);

      process.env.JWT_SECRET = "test_secret";

      await login(mockReq as any, mockRes as any, nextMock);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(jwt.sign).toHaveBeenCalledWith({ userId }, "test_secret", {
        expiresIn: "7d",
      });
      expect(jsonMock).toHaveBeenCalledWith({ token });
    });

    it("should return 401 if user not found", async () => {
      mockReq.body = { email, password };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await login(mockReq as any, mockRes as any, nextMock);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Invalid login" });
    });

    it("should return 401 if password is incorrect", async () => {
      mockReq.body = { email, password };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: userId,
        email,
        passwordHash: hashedPassword,
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await login(mockReq as any, mockRes as any, nextMock);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Invalid login" });
    });

    it("should include correct JWT expiration", async () => {
      mockReq.body = { email, password };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: userId,
        email,
        passwordHash: hashedPassword,
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(token);

      process.env.JWT_SECRET = "test_secret";

      await login(mockReq as any, mockRes as any, nextMock);

      const signCall = (jwt.sign as jest.Mock).mock.calls[0];
      expect(signCall[2]).toEqual({ expiresIn: "7d" });
    });
  });
});
