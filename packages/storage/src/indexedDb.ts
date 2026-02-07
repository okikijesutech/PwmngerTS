const DB_NAME = "pwmnger-db";
const STORE_NAME = "vault";
const DB_VERSION = 2;

import type { EncryptedPayload } from "@pwmnger/crypto";

type StoredVault = {
  salt: number[];
  encryptedVault: EncryptedPayload;
  encryptedVaultKey: EncryptedPayload;
  updatedAt: number;
};

let dbPromise: Promise<IDBDatabase> | null = null;

/** @internal - For testing use only */
export function __resetDB() {
  dbPromise = null;
}

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    console.log("IndexedDB: Opening database...");
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      console.log("IndexedDB: Upgrade needed, creating store...");
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      console.log("IndexedDB: Database opened successfully");
      resolve(request.result);
    };
    request.onerror = () => {
      console.error("IndexedDB: Error opening database", request.error);
      dbPromise = null;
      reject(request.error);
    };
  });

  return dbPromise;
}

export async function saveVault(data: StoredVault): Promise<void> {
  console.log("IndexedDB: Saving vault...");
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(data, "main");

    request.onsuccess = () => {
      console.log("IndexedDB: Vault saved successfully to 'main'");
      resolve();
    };
    tx.oncomplete = () => {
      console.log("IndexedDB: Transaction completed");
    };
    tx.onerror = () => {
      console.error("IndexedDB: Transaction error during save", tx.error);
      reject(tx.error);
    };
    request.onerror = () => {
      console.error("IndexedDB: Request error during save", request.error);
      reject(request.error);
    };
  });
}

export async function loadVault(): Promise<StoredVault | null> {
  console.log("IndexedDB: Loading vault...");
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get("main");

    request.onsuccess = () => {
      console.log(
        "IndexedDB: Load request successful",
        request.result ? "data found" : "no data found",
      );
      resolve(request.result ?? null);
    };
    request.onerror = () => {
      console.error("IndexedDB: Error loading vault", request.error);
      reject(request.error);
    };
  });
}
