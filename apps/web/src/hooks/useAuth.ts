import { useState, useCallback } from "react";
import { loginAccount, registerAccount, getAccountStatus } from "@pwmnger/app-logic";

export function useAuth() {
  const [isAuthAction, setIsAuthAction] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] = useState<{ email: string } | null>(() => {
    const email = localStorage.getItem("pwmnger_email");
    return email ? { email } : null;
  });
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const update2FAStatus = useCallback(async () => {
    const token = localStorage.getItem("pwmnger_token");
    if (!token) return;
    try {
      const status = await getAccountStatus();
       setIs2FAEnabled(status.is2FAEnabled);
       setSession({ email: status.email });
       localStorage.setItem("pwmnger_email", status.email);
    } catch (e) {
      setSession(null);
      localStorage.removeItem("pwmnger_email");
    }
  }, []);

  const login = async (email: string, password: string, twoFactorToken?: string) => {
    setIsAuthAction(true);
    setError("");
    try {
      await loginAccount(email, password, twoFactorToken);
      localStorage.setItem("pwmnger_email", email);
      setSession({ email });
      await update2FAStatus();
      return { email };
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setIsAuthAction(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsAuthAction(true);
    setError("");
    try {
      await registerAccount(email, password);
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setIsAuthAction(false);
    }
  };

  const logout = async () => {
    await logoutAccount();
    localStorage.removeItem("pwmnger_email");
    setSession(null);
    setIs2FAEnabled(false);
  };

  return {
    session,
    isAuthAction,
    error,
    is2FAEnabled,
    login,
    register,
    logout,
    update2FAStatus,
    setError
  };
}
