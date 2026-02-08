// Set the API URL for the appLogic package
(window as any).PW_API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Toast } from "@pwmnger/ui";
import { checkVaultExists, isUnlocked } from "@pwmnger/app-logic";

import { useAuth } from "./hooks/useAuth";
import { useVault } from "./hooks/useVault";

const UnlockVault = lazy(() => import("./components/Vault/UnlockVault").then(m => ({ default: m.UnlockVault })));
const RegisterVault = lazy(() => import("./components/Vault/RegisterVault").then(m => ({ default: m.RegisterVault })));
const LoginForm = lazy(() => import("./components/Vault/LoginForm").then(m => ({ default: m.LoginForm })));
const VaultDashboard = lazy(() => import("./components/Vault/VaultDashboard").then(m => ({ default: m.VaultDashboard })));
const LandingPage = lazy(() => import("./components/Landing/LandingPage").then(m => ({ default: m.LandingPage })));

const LoadingSpinner = () => (
  <div style={{ 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    height: "100vh", 
    background: "#030816", 
    color: "#fff" 
  }}>
    <div className="loader">Shielding...</div>
  </div>
);

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, isAuthAction, error: authError, is2FAEnabled, login, register, logout, update2FAStatus, setError: setAuthError } = useAuth();
  const { vault, isSyncing, isUnlocking, error: vaultError, unlock, unlockWithRecovery, lock, sync, addEntry, deleteEntry, updateEntry, importData, createFolder, deleteFolder, moveEntry, downloadRecoveryKit, setError: setVaultError } = useVault();
  
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function init() {
      const exists = await checkVaultExists();
      const unlocked = isUnlocked();

      if (unlocked) {
        if (location.pathname === "/" || location.pathname === "/login" || location.pathname === "/unlock") {
          navigate("/dashboard", { replace: true });
        }
      } else if (exists) {
        if (location.pathname === "/" || location.pathname === "/login") {
           navigate("/unlock", { replace: true });
        }
      } else {
        if (location.pathname !== "/" && location.pathname !== "/register" && location.pathname !== "/login") {
          navigate("/", { replace: true });
        }
      }
      setLoading(false);
    }
    init();
  }, [navigate]);

  const handleLogin = async (e: string, p: string, t?: string) => {
    try {
      await login(e, p, t);
      await sync(localStorage.getItem("pwmnger_token")!);
      await unlock(p);
      setToast({ message: "Welcome back!", type: "success" });
      navigate("/dashboard");
    } catch (err: any) {
      if (!err.requires2FA) setAuthError(err.message);
      throw err;
    }
  };

  const handleRegister = async (e: string, p: string) => {
    try {
      await register(e, p);
      await useVault().create(p); // Temp use of create
      await login(e, p);
      setToast({ message: "Account created!", type: "success" });
      navigate("/dashboard");
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleUnlock = async (p: string) => {
    try {
      await unlock(p);
      setToast({ message: "Vault unlocked!", type: "success" });
      navigate("/dashboard");
    } catch (err: any) {
      setVaultError(err.message);
    }
  };

  const handleRecover = async (key: string, data: any) => {
    try {
      await unlockWithRecovery(key, data);
      setToast({ message: "Vault recovered!", type: "success" });
      navigate("/dashboard");
    } catch (err: any) {
      setVaultError(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="app-main">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={
            <LandingPage onLogin={() => navigate("/login")} onRegister={() => navigate("/register")} />
          } />
          
          <Route path="/login" element={
            <div style={{ maxWidth: 450, margin: "100px auto" }}>
              <LoginForm 
                onLogin={handleLogin} 
                onGoToRegister={() => navigate("/register")} 
                error={authError} 
                loading={isAuthAction} 
              />
            </div>
          } />

          <Route path="/register" element={
            <div style={{ maxWidth: 450, margin: "100px auto" }}>
              <RegisterVault 
                onRegister={handleRegister} 
                onGoToLogin={() => navigate("/login")} 
                error={authError} 
                loading={isAuthAction} 
              />
            </div>
          } />

          <Route path="/unlock" element={
            <div style={{ maxWidth: 450, margin: "100px auto" }}>
              <UnlockVault 
                onUnlock={handleUnlock} 
                onRecover={handleRecover} 
                error={vaultError} 
                loading={isUnlocking} 
              />
              <p style={{ textAlign: "center", marginTop: 20 }}>
                <span onClick={() => { localStorage.clear(); navigate("/login"); }} style={{ cursor: "pointer", color: "#666", fontSize: 13 }}>
                  Switch Account / Reset
                </span>
              </p>
            </div>
          } />

          <Route path="/dashboard" element={
            vault ? (
              <VaultDashboard
                vault={vault}
                userEmail={session?.email || ""}
                onSync={() => sync(localStorage.getItem("pwmnger_token")!)}
                onLock={() => { lock(); navigate("/unlock"); }}
                onAddEntry={addEntry}
                onDeleteEntry={deleteEntry}
                onCreateFolder={createFolder}
                onDeleteFolder={deleteFolder}
                onMoveEntry={moveEntry}
                onEditEntry={updateEntry}
                onImportVault={importData}
                onDownloadRecoveryKit={downloadRecoveryKit}
                onRefreshAccountStatus={update2FAStatus}
                isSyncing={isSyncing}
                is2FAEnabled={is2FAEnabled}
              />
            ) : <Navigate to="/unlock" />
          } />
        </Routes>
      </Suspense>

      {location.pathname !== "/dashboard" && location.pathname !== "/" && (
        <footer className="footer-main">
          <div className="footer-logo">
            <span className="logo-icon">🛡️</span> Pwmnger<span>TS</span>
          </div>
          <p className="footer-copy">
            &copy; 2026 okikijesutech &bull; Secure Zero-Knowledge Storage Global.
          </p>
          <div style={{ display: "flex", gap: 20, opacity: 0.6, fontSize: 12 }}>
             <a href="#" style={{ color: "white", textDecoration: "none" }}>Privacy Policy</a>
             <a href="#" style={{ color: "white", textDecoration: "none" }}>Terms of Service</a>
             <a href="https://github.com/okikijesutech/PwmngerTS" target="_blank" style={{ color: "white", textDecoration: "none" }}>Open Source</a>
          </div>
        </footer>
      )}
    </div>
  );
}
