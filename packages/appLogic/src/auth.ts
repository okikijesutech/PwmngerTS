import { deriveAuthHash, wipe, stringToUint8Array } from "@pwmnger/crypto";
import { saveAuthToken, loadAuthToken } from "@pwmnger/storage";

const BASE_URL = (globalThis as any).PW_API_URL || "http://localhost:4000";

async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = await loadAuthToken();
  const headers = new Headers(options.headers || {});
  
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: "include", // Keep cookies for web
  });
}

export async function registerAccount(email: string, masterPassword: string) {
  // Zero-Knowledge: Derive Auth Hash from (Password + Email)
  // Server never sees the Password.
  const passwordBuffer = stringToUint8Array(masterPassword);
  try {
    const authHash = await deriveAuthHash(passwordBuffer, email);

    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, authHash }),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Registration failed");
    }

    const data = await res.json();
    if (data.accessToken) {
      await saveAuthToken(data.accessToken);
    }
  } finally {
    wipe(passwordBuffer);
  }

  return true;
}

export async function loginAccount(
  email: string,
  masterPassword: string,
  twoFactorToken?: string,
) {
  const passwordBuffer = stringToUint8Array(masterPassword);
  try {
    const authHash = await deriveAuthHash(passwordBuffer, email);

    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, authHash, twoFactorToken }),
      credentials: "include",
    });



    if (!res.ok) {
      const err = await res.json();
      // 2FA Handling
      if (err.requires2FA) {
        const error: any = new Error("2FA Required");
        error.requires2FA = true;
        throw error;
      }
      throw new Error(err.error || "Login failed");
    }
    const data = await res.json();
    if (data.accessToken) {
      await saveAuthToken(data.accessToken);
    }
    return true;
  } finally {
    wipe(passwordBuffer);
  }
}

export async function refreshAccount() {
  const res = await authenticatedFetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Session expired");

  const data = await res.json();
  if (data.accessToken) {
    await saveAuthToken(data.accessToken);
  }
  return true;
}

export async function setup2FA() {
  const res = await authenticatedFetch(`${BASE_URL}/auth/2fa/setup`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to setup 2FA");
  return res.json(); // { secret, qrCode }
}

export async function verify2FASetup(
  twoFactorToken: string,
  secret: string,
) {
  const res = await authenticatedFetch(`${BASE_URL}/auth/2fa/verify`, {
    method: "POST",
    body: JSON.stringify({ token: twoFactorToken, secret }),
  });
  if (!res.ok) throw new Error("Invalid Token");
  return res.json();
}

export async function getAccountStatus() {
  const res = await authenticatedFetch(`${BASE_URL}/auth/me`);
  if (!res.ok) throw new Error("Failed to fetch account status");
  return res.json(); // { email, is2FAEnabled }
}

export async function logoutAccount() {
  await authenticatedFetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
  });
}
