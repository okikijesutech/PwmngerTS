import {
  isUnlocked,
  getVault,
  lockVault,
  createNewVault,
  unlockVault,
  saveCurrentVault,
} from "./vaultManager";

// Mock dependencies
jest.mock("../../crypto/src/kdf");
jest.mock("../../crypto/src");
jest.mock("../../crypto/src/vaultKey");
jest.mock("../../vault/src/vault");
jest.mock("../../storage/src/indexedDb");

import { deriveMasterKey } from "../../crypto/src/kdf";
import { decryptData, encryptData } from "../../crypto/src";
import { generateVaultKey } from "../../crypto/src/vaultKey";
import { createEmptyVault } from "../../vault/src/vault";
import { saveVault, loadVault } from "../../storage/src/indexedDb";

describe("VaultManager", () => {
  const mockPassword = "testPassword123";
  const mockSalt = new Uint8Array(16);
  const mockMasterKey = {} as CryptoKey;
  const mockVaultKey = {} as CryptoKey;
  const mockVault = {
    id: "test-vault",
    entries: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const mockEncryptedPayload = { iv: [1, 2, 3], data: [4, 5, 6] };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock global crypto object
    global.crypto = {
      getRandomValues: jest.fn((arr) => arr),
    } as any;
    // Reset vault state
    lockVault();
  });

  afterEach(async () => {
    // Clean up vault state after each test
    await lockVault();
  });

  describe("isUnlocked", () => {
    it("should return false initially", () => {
      expect(isUnlocked()).toBe(false);
    });

    it("should return true after vault is unlocked", async () => {
      (loadVault as jest.Mock).mockResolvedValue({
        salt: Array.from(mockSalt),
        encryptedVault: mockEncryptedPayload,
        encryptedVaultKey: mockEncryptedPayload,
      });
      (deriveMasterKey as jest.Mock).mockResolvedValue(mockMasterKey);
      (decryptData as jest.Mock)
        .mockResolvedValueOnce(mockVaultKey)
        .mockResolvedValueOnce(mockVault);

      await unlockVault(mockPassword);
      expect(isUnlocked()).toBe(true);
    });
  });

  describe("getVault", () => {
    it("should throw error when vault is locked", () => {
      expect(() => getVault()).toThrow("Vault is locked");
    });

    it("should return vault when unlocked", async () => {
      (loadVault as jest.Mock).mockResolvedValue({
        salt: Array.from(mockSalt),
        encryptedVault: mockEncryptedPayload,
        encryptedVaultKey: mockEncryptedPayload,
      });
      (deriveMasterKey as jest.Mock).mockResolvedValue(mockMasterKey);
      (decryptData as jest.Mock)
        .mockResolvedValueOnce(mockVaultKey)
        .mockResolvedValueOnce(mockVault);

      await unlockVault(mockPassword);
      const vault = getVault();
      expect(vault).toEqual(mockVault);
    });
  });

  describe("lockVault", () => {
    it("should lock the vault", async () => {
      // First unlock
      (loadVault as jest.Mock).mockResolvedValue({
        salt: Array.from(mockSalt),
        encryptedVault: mockEncryptedPayload,
        encryptedVaultKey: mockEncryptedPayload,
      });
      (deriveMasterKey as jest.Mock).mockResolvedValue(mockMasterKey);
      (decryptData as jest.Mock)
        .mockResolvedValueOnce(mockVaultKey)
        .mockResolvedValueOnce(mockVault);

      await unlockVault(mockPassword);
      expect(isUnlocked()).toBe(true);

      // Then lock
      await lockVault();
      expect(isUnlocked()).toBe(false);
      expect(() => getVault()).toThrow("Vault is locked");
    });
  });

  describe("createNewVault", () => {
    it("should create and save a new vault", async () => {
      (deriveMasterKey as jest.Mock).mockResolvedValue(mockMasterKey);
      (generateVaultKey as jest.Mock).mockResolvedValue(mockVaultKey);
      (createEmptyVault as jest.Mock).mockReturnValue(mockVault);
      (encryptData as jest.Mock)
        .mockResolvedValueOnce(mockEncryptedPayload)
        .mockResolvedValueOnce(mockEncryptedPayload);

      await createNewVault(mockPassword);

      expect(deriveMasterKey).toHaveBeenCalledWith(
        mockPassword,
        expect.any(Uint8Array),
      );
      expect(generateVaultKey).toHaveBeenCalled();
      expect(createEmptyVault).toHaveBeenCalled();
      expect(encryptData).toHaveBeenCalledTimes(2);
      expect(saveVault).toHaveBeenCalledWith({
        salt: expect.any(Array),
        encryptedVault: mockEncryptedPayload,
        encryptedVaultKey: mockEncryptedPayload,
      });
      expect(isUnlocked()).toBe(true);
    });
  });

  describe("unlockVault", () => {
    it("should throw error if no vault found", async () => {
      (loadVault as jest.Mock).mockResolvedValue(null);

      await expect(unlockVault(mockPassword)).rejects.toThrow("No vault found");
    });

    it("should throw error if vault key decryption fails", async () => {
      (loadVault as jest.Mock).mockResolvedValue({
        salt: Array.from(mockSalt),
        encryptedVault: mockEncryptedPayload,
        encryptedVaultKey: mockEncryptedPayload,
      });
      (deriveMasterKey as jest.Mock).mockResolvedValue(mockMasterKey);
      (decryptData as jest.Mock).mockResolvedValueOnce(null);

      await expect(unlockVault(mockPassword)).rejects.toThrow(
        "Failed to decrypt vault key",
      );
    });

    it("should unlock vault with correct password", async () => {
      (loadVault as jest.Mock).mockResolvedValue({
        salt: Array.from(mockSalt),
        encryptedVault: mockEncryptedPayload,
        encryptedVaultKey: mockEncryptedPayload,
      });
      (deriveMasterKey as jest.Mock).mockResolvedValue(mockMasterKey);
      (decryptData as jest.Mock)
        .mockResolvedValueOnce(mockVaultKey)
        .mockResolvedValueOnce(mockVault);

      await unlockVault(mockPassword);

      expect(deriveMasterKey).toHaveBeenCalledWith(
        mockPassword,
        expect.any(Uint8Array),
      );
      expect(decryptData).toHaveBeenCalledTimes(2);
      expect(isUnlocked()).toBe(true);
      expect(getVault()).toEqual(mockVault);
    });
  });

  describe("saveCurrentVault", () => {
    it("should throw error if vault is locked", async () => {
      await expect(saveCurrentVault()).rejects.toThrow("Vault is not unlocked");
    });

    it("should update and save vault", async () => {
      // First unlock
      (loadVault as jest.Mock).mockResolvedValue({
        salt: Array.from(mockSalt),
        encryptedVault: mockEncryptedPayload,
        encryptedVaultKey: mockEncryptedPayload,
      });
      (deriveMasterKey as jest.Mock).mockResolvedValue(mockMasterKey);
      (decryptData as jest.Mock)
        .mockResolvedValueOnce(mockVaultKey)
        .mockResolvedValueOnce(mockVault);

      await unlockVault(mockPassword);

      // Reset mocks for save test
      jest.clearAllMocks();
      (loadVault as jest.Mock).mockResolvedValue({
        salt: Array.from(mockSalt),
        encryptedVault: mockEncryptedPayload,
        encryptedVaultKey: mockEncryptedPayload,
      });
      (encryptData as jest.Mock).mockResolvedValue(mockEncryptedPayload);

      await saveCurrentVault();

      expect(encryptData).toHaveBeenCalledWith(
        mockVaultKey,
        expect.any(Object),
      );
      expect(saveVault).toHaveBeenCalledWith({
        salt: expect.any(Array),
        encryptedVault: mockEncryptedPayload,
        encryptedVaultKey: mockEncryptedPayload,
      });
    });

    it("should throw error if no vault to update", async () => {
      // First unlock
      (loadVault as jest.Mock)
        .mockResolvedValueOnce({
          salt: Array.from(mockSalt),
          encryptedVault: mockEncryptedPayload,
          encryptedVaultKey: mockEncryptedPayload,
        })
        .mockResolvedValueOnce(null);
      (deriveMasterKey as jest.Mock).mockResolvedValue(mockMasterKey);
      (decryptData as jest.Mock)
        .mockResolvedValueOnce(mockVaultKey)
        .mockResolvedValueOnce(mockVault);

      await unlockVault(mockPassword);

      (encryptData as jest.Mock).mockResolvedValue(mockEncryptedPayload);

      await expect(saveCurrentVault()).rejects.toThrow("No vault to update");
    });
  });
});
