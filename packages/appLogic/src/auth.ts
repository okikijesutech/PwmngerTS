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

export async function loginAccount(email: string, masterPassword: string) {
  const authHash = await deriveAuthHash(masterPassword, email);

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, authHash }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Login failed");
  }

  const { token } = await res.json();
  return token as string;
}
