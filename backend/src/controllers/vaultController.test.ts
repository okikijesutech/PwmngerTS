import { uploadVault, downloadVault } from "./vaultController.js";
import { prisma } from "../db/prisma.js";
import type { Request, Response } from "express";

// Mock dependencies
jest.mock("../db/prisma.js");

interface AuthRequest extends Request {
  user?: { userId: string };
}

describe("Vault Controller", () => {
  let mockReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    jsonMock = jest.fn().mockReturnValue(undefined);

    mockReq = {
      body: {},
      user: { userId: "user-123" },
    };

    mockRes = {
      json: jsonMock,
    };
  });

  describe("uploadVault", () => {
    it("should create a new vault if it doesn't exist", async () => {
      const encryptedVault = { iv: [1, 2, 3], data: [4, 5, 6] };
      mockReq.body = { encryptedVault };

      (prisma.vault.upsert as jest.Mock).mockResolvedValue({
        id: "vault-123",
        encrypted: JSON.stringify(encryptedVault),
        userId: "user-123",
        updatedAt: new Date(),
      });

      await uploadVault(mockReq as any, mockRes as any);

      expect(prisma.vault.upsert).toHaveBeenCalledWith({
        where: { userId: "user-123" },
        update: { encrypted: encryptedVault },
        create: { encrypted: encryptedVault, userId: "user-123" },
      });
      expect(jsonMock).toHaveBeenCalledWith({ success: true });
    });

    it("should update existing vault", async () => {
      const encryptedVault = { iv: [1, 2, 3], data: [4, 5, 6] };
      const newEncryptedVault = { iv: [7, 8, 9], data: [10, 11, 12] };

      mockReq.body = { encryptedVault: newEncryptedVault };

      (prisma.vault.upsert as jest.Mock).mockResolvedValue({
        id: "vault-123",
        encrypted: JSON.stringify(newEncryptedVault),
        userId: "user-123",
        updatedAt: new Date(),
      });

      await uploadVault(mockReq as any, mockRes as any);

      expect(prisma.vault.upsert).toHaveBeenCalledWith({
        where: { userId: "user-123" },
        update: { encrypted: newEncryptedVault },
        create: { encrypted: newEncryptedVault, userId: "user-123" },
      });
      expect(jsonMock).toHaveBeenCalledWith({ success: true });
    });

    it("should handle database errors", async () => {
      const encryptedVault = { iv: [1, 2, 3], data: [4, 5, 6] };
      mockReq.body = { encryptedVault };

      (prisma.vault.upsert as jest.Mock).mockRejectedValue(
        new Error("Database error"),
      );

      await expect(uploadVault(mockReq as any, mockRes as any)).rejects.toThrow(
        "Database error",
      );
    });

    it("should use correct userId from request", async () => {
      const encryptedVault = { iv: [1, 2, 3], data: [4, 5, 6] };
      mockReq.body = { encryptedVault };
      mockReq.user = { userId: "user-456" };

      (prisma.vault.upsert as jest.Mock).mockResolvedValue({
        id: "vault-456",
        encrypted: JSON.stringify(encryptedVault),
        userId: "user-456",
        updatedAt: new Date(),
      });

      await uploadVault(mockReq as any, mockRes as any);

      const call = (prisma.vault.upsert as jest.Mock).mock.calls[0][0];
      expect(call.where.userId).toBe("user-456");
      expect(call.create.userId).toBe("user-456");
    });
  });

  describe("downloadVault", () => {
    it("should return encrypted vault if exists", async () => {
      const encryptedVault = { iv: [1, 2, 3], data: [4, 5, 6] };

      (prisma.vault.findUnique as jest.Mock).mockResolvedValue({
        id: "vault-123",
        encrypted: JSON.stringify(encryptedVault),
        userId: "user-123",
        updatedAt: new Date(),
      });

      await downloadVault(mockReq as any, mockRes as any);

      expect(prisma.vault.findUnique).toHaveBeenCalledWith({
        where: { userId: "user-123" },
      });
      expect(jsonMock).toHaveBeenCalledWith({
        encryptedVault: JSON.stringify(encryptedVault),
      });
    });

    it("should return null if vault doesn't exist", async () => {
      (prisma.vault.findUnique as jest.Mock).mockResolvedValue(null);

      await downloadVault(mockReq as any, mockRes as any);

      expect(jsonMock).toHaveBeenCalledWith({ encryptedVault: null });
    });

    it("should query with correct userId", async () => {
      mockReq.user = { userId: "user-789" };

      (prisma.vault.findUnique as jest.Mock).mockResolvedValue(null);

      await downloadVault(mockReq as any, mockRes as any);

      expect(prisma.vault.findUnique).toHaveBeenCalledWith({
        where: { userId: "user-789" },
      });
    });

    it("should handle database errors", async () => {
      (prisma.vault.findUnique as jest.Mock).mockRejectedValue(
        new Error("Database error"),
      );

      await expect(
        downloadVault(mockReq as any, mockRes as any),
      ).rejects.toThrow("Database error");
    });

    it("should return vault with correct structure", async () => {
      const encryptedVault = { iv: [7, 8, 9], data: [10, 11, 12] };

      (prisma.vault.findUnique as jest.Mock).mockResolvedValue({
        id: "vault-123",
        encrypted: encryptedVault,
        userId: "user-123",
        updatedAt: new Date("2026-01-29T10:00:00Z"),
      });

      await downloadVault(mockReq as any, mockRes as any);

      expect(jsonMock).toHaveBeenCalledWith({
        encryptedVault: encryptedVault,
      });
    });
  });
});
