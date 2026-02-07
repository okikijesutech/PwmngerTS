import { deriveAuthHash } from "@pwmnger/crypto";

const BASE_URL = (globalThis as any).PW_API_URL || "http://localhost:4000";

export async function registerAccount(email: string, masterPassword: string) {
  // Zero-Knowledge: Derive Auth Hash from (Password + Email)
  // Server never sees the Password.
  const authHash = await deriveAuthHash(masterPassword, email);

  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, authHash }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Registration failed");
  }

  return true;
}

export async function loginAccount(
  email: string,
  masterPassword: string,
  twoFactorToken?: string,
) {
  const authHash = await deriveAuthHash(masterPassword, email);

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, authHash, twoFactorToken }),
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

  const { token } = await res.json();
  return token as string;
}

export async function setup2FA(token: string) {
  const res = await fetch(`${BASE_URL}/auth/2fa/setup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to setup 2FA");
  return res.json(); // { secret, qrCode }
}

export async function verify2FASetup(
  authToken: string,
  twoFactorToken: string,
  secret: string,
) {
  const res = await fetch(`${BASE_URL}/auth/2fa/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ token: twoFactorToken, secret }),
  });
  if (!res.ok) throw new Error("Invalid Token");
  return res.json();
}
