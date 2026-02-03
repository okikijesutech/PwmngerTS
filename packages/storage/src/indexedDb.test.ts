import { saveVault, loadVault } from "./indexedDb";

const DB_NAME = "pwmngr-db";
const STORE_NAME = "vault";

type StoredVault = {
  salt: number[];
  encryptedVault: any;
  encryptedVaultKey: any;
};

describe("IndexedDB Storage", () => {
  const mockStoredVault: StoredVault = {
    salt: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    encryptedVault: { iv: [1, 2, 3], data: [4, 5, 6] },
    encryptedVaultKey: { iv: [7, 8, 9], data: [10, 11, 12] },
  };

  let mockDB: any;
  let mockTransaction: any;
  let mockStore: any;

  beforeEach(() => {
    // Clear any previous mocks
    jest.clearAllMocks();

    // Setup mock store
    const mockGetRequest = { result: null, onsuccess: null, onerror: null };
    const mockPutRequest = { onsuccess: null, onerror: null };
    mockStore = {
      get: jest.fn(() => mockGetRequest),
      put: jest.fn(() => mockPutRequest),
    };
    (global as any).mockGetRequest = mockGetRequest;
    (global as any).mockPutRequest = mockPutRequest;

    // Setup mock transaction
    mockTransaction = {
      objectStore: jest.fn(() => mockStore),
      oncomplete: null,
      onerror: null,
    };

    // Setup mock database
    mockDB = {
      transaction: jest.fn(() => mockTransaction),
      objectStoreNames: {
        contains: jest.fn(() => true),
      },
      createObjectStore: jest.fn(),
    };

    // Setup global indexedDB mock
    const mockRequest = {
      result: mockDB,
      onupgradeneeded: null,
      onsuccess: null,
      onerror: null,
      error: null,
    };
    (global as any).indexedDB = {
      open: jest.fn((name, version) => mockRequest),
    };
    (global as any).mockRequest = mockRequest;
  });

  describe("saveVault", () => {
    it("should save vault data to IndexedDB", async () => {
      const openRequest = (global as any).mockRequest;

      const savePromise = saveVault(mockStoredVault);

      // Simulate successful open
      setTimeout(() => {
        openRequest.onsuccess?.();
      }, 0);

      // Simulate transaction completion
      setTimeout(() => {
        mockTransaction.oncomplete?.();
      }, 10);

      await savePromise;

      expect((global as any).indexedDB.open).toHaveBeenCalledWith(
        DB_NAME,
        expect.any(Number),
      );
      expect(mockDB.transaction).toHaveBeenCalledWith(STORE_NAME, "readwrite");
      expect(mockStore.put).toHaveBeenCalledWith(mockStoredVault, "main");
    });

    it("should reject on database error", async () => {
      const openRequest = (global as any).mockRequest;

      const savePromise = saveVault(mockStoredVault);

      // Simulate error
      setTimeout(() => {
        openRequest.error = new Error("DB Error");
        openRequest.onerror?.();
      }, 0);

      await expect(savePromise).rejects.toBeDefined();
    });

    it("should reject on transaction error", async () => {
      const openRequest = (global as any).mockRequest;

      const savePromise = saveVault(mockStoredVault);

      // Simulate successful open
      setTimeout(() => {
        openRequest.onsuccess?.();
      }, 0);

      // Simulate transaction error
      setTimeout(() => {
        mockTransaction.error = new Error("Tx Error");
        mockTransaction.onerror?.();
      }, 10);

      await expect(savePromise).rejects.toBeDefined();
    });
  });

  describe("loadVault", () => {
    it("should load vault data from IndexedDB", async () => {
      const openRequest = (global as any).mockRequest;

      const loadPromise = loadVault();

      // Set mock data
      mockStore.getData = mockStoredVault;

      // Simulate successful open
      setTimeout(() => {
        openRequest.onsuccess?.();
      }, 0);

      // Simulate successful get request
      setTimeout(() => {
        const getRequest = (global as any).mockGetRequest;
        getRequest.result = mockStoredVault;
        getRequest.onsuccess?.();
      }, 10);

      const result = await loadPromise;

      expect((global as any).indexedDB.open).toHaveBeenCalledWith(
        DB_NAME,
        expect.any(Number),
      );
      expect(mockDB.transaction).toHaveBeenCalledWith(STORE_NAME, "readonly");
      expect(mockStore.get).toHaveBeenCalledWith("main");
      expect(result).toEqual(mockStoredVault);
    });

    it("should return null if no vault found", async () => {
      const openRequest = (global as any).mockRequest;

      const loadPromise = loadVault();

      // Set mock data to undefined (no vault)
      mockStore.getData = undefined;

      // Simulate successful open
      setTimeout(() => {
        openRequest.onsuccess?.();
      }, 0);

      // Simulate successful get request with no result
      setTimeout(() => {
        const getRequest = (global as any).mockGetRequest;
        getRequest.result = undefined;
        getRequest.onsuccess?.();
      }, 10);

      const result = await loadPromise;

      expect(result).toBeNull();
    });

    it("should reject on database error", async () => {
      const openRequest = (global as any).mockRequest;

      const loadPromise = loadVault();

      // Simulate error
      setTimeout(() => {
        openRequest.error = new Error("DB Error");
        openRequest.onerror?.();
      }, 0);

      await expect(loadPromise).rejects.toBeDefined();
    });

    it("should reject on get request error", async () => {
      const openRequest = (global as any).mockRequest;

      const loadPromise = loadVault();

      // Simulate successful open
      setTimeout(() => {
        openRequest.onsuccess?.();
      }, 0);

      // Simulate get request error
      setTimeout(() => {
        const getRequest = (global as any).mockGetRequest;
        getRequest.error = new Error("Get Request Error");
        getRequest.onerror?.();
      }, 10);

      await expect(loadPromise).rejects.toBeDefined();
    });
  });

  describe("Database initialization", () => {
    it("should create object store on first use if not exists", async () => {
      mockDB.objectStoreNames.contains = jest.fn(() => false);

      const openRequest = (global as any).mockRequest;

      const loadPromise = loadVault();

      // Simulate upgrade needed
      setTimeout(() => {
        openRequest.onupgradeneeded?.();
      }, 0);

      // Simulate successful open
      setTimeout(() => {
        openRequest.onsuccess?.();
      }, 5);

      // Simulate get
      setTimeout(() => {
        const getRequest = (global as any).mockGetRequest;
        getRequest.onsuccess?.();
      }, 15);

      await loadPromise;

      expect(mockDB.objectStoreNames.contains).toHaveBeenCalledWith(STORE_NAME);
      expect(mockDB.createObjectStore).toHaveBeenCalledWith(STORE_NAME);
    });
  });
});
