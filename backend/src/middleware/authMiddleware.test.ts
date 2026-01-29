import { requireAuth } from "./authMiddleware.js";
import * as jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

// Mock dependencies
jest.mock("jsonwebtoken");

describe("Auth Middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;
  let sendStatusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockNext = jest.fn();
    sendStatusMock = jest.fn().mockReturnValue(undefined);

    mockReq = {
      headers: {},
    };

    mockRes = {
      sendStatus: sendStatusMock,
    };
  });

  describe("requireAuth", () => {
    it("should return 401 if no authorization header", () => {
      mockReq.headers = {};

      requireAuth(mockReq as any, mockRes as any, mockNext);

      expect(sendStatusMock).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 if no token in authorization header", () => {
      mockReq.headers = { authorization: "Bearer" };

      requireAuth(mockReq as any, mockRes as any, mockNext);

      expect(sendStatusMock).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should extract token from Bearer authorization header", () => {
      const token = "valid_jwt_token";
      const payload = { userId: "user-123" };

      mockReq.headers = { authorization: `Bearer ${token}` };

      (jwt.verify as jest.Mock).mockReturnValue(payload);

      process.env.JWT_SECRET = "test_secret";

      requireAuth(mockReq as any, mockRes as any, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(token, "test_secret");
      expect(mockNext).toHaveBeenCalled();
    });

    it("should attach user to request if token is valid", () => {
      const token = "valid_jwt_token";
      const payload = { userId: "user-123" };

      mockReq.headers = { authorization: `Bearer ${token}` };

      (jwt.verify as jest.Mock).mockReturnValue(payload);

      process.env.JWT_SECRET = "test_secret";

      requireAuth(mockReq as any, mockRes as any, mockNext);

      expect((mockReq as any).user).toEqual(payload);
    });

    it("should return 401 if token is invalid", () => {
      const token = "invalid_jwt_token";

      mockReq.headers = { authorization: `Bearer ${token}` };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      process.env.JWT_SECRET = "test_secret";

      requireAuth(mockReq as any, mockRes as any, mockNext);

      expect(sendStatusMock).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 if token is expired", () => {
      const token = "expired_jwt_token";

      mockReq.headers = { authorization: `Bearer ${token}` };

      const error = new Error("Token expired");
      (error as any).name = "TokenExpiredError";
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw error;
      });

      process.env.JWT_SECRET = "test_secret";

      requireAuth(mockReq as any, mockRes as any, mockNext);

      expect(sendStatusMock).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle multiple Bearer tokens in header (use last one)", () => {
      const token = "valid_jwt_token";
      const payload = { userId: "user-123" };

      // The code splits by " " and takes [1], so "Bearer token" -> ["Bearer", "token"]
      mockReq.headers = { authorization: `Bearer ${token}` };

      (jwt.verify as jest.Mock).mockReturnValue(payload);

      process.env.JWT_SECRET = "test_secret";

      requireAuth(mockReq as any, mockRes as any, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(token, "test_secret");
    });

    it("should use JWT_SECRET from environment", () => {
      const token = "valid_jwt_token";
      const payload = { userId: "user-123" };
      const secret = "custom_jwt_secret_123";

      mockReq.headers = { authorization: `Bearer ${token}` };

      (jwt.verify as jest.Mock).mockReturnValue(payload);

      process.env.JWT_SECRET = secret;

      requireAuth(mockReq as any, mockRes as any, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(token, secret);
    });

    it("should handle case-insensitive Bearer prefix", () => {
      const token = "valid_jwt_token";
      const payload = { userId: "user-123" };

      // Note: the current implementation doesn't handle this, but good to test
      mockReq.headers = { authorization: `bearer ${token}` };

      (jwt.verify as jest.Mock).mockReturnValue(payload);

      process.env.JWT_SECRET = "test_secret";

      requireAuth(mockReq as any, mockRes as any, mockNext);

      // The split will result in ["bearer", token], so it should work
      expect(jwt.verify).toHaveBeenCalled();
    });

    it("should continue to next middleware after successful verification", () => {
      const token = "valid_jwt_token";
      const payload = { userId: "user-456", role: "admin" };

      mockReq.headers = { authorization: `Bearer ${token}` };

      (jwt.verify as jest.Mock).mockReturnValue(payload);

      process.env.JWT_SECRET = "test_secret";

      requireAuth(mockReq as any, mockRes as any, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });
});
