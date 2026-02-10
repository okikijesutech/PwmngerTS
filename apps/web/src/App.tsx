import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Toast } from "@pwmnger/ui";
import { checkVaultExists, isUnlocked } from "@pwmnger/app-logic";

import { useAuth } from "./hooks/useAuth";
import { useVault } from "./hooks/useVault";
import { ProtectedRoute, PublicRoute } from "./components/Shared/RouteGuards";

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
  const { vault, isSyncing, isUnlocking, error: vaultError, unlock, unlockWithRecovery, lock, sync, addEntry, deleteEntry, updateEntry, importData, createFolder, deleteFolder, moveEntry, downloadRecoveryKit, create, setError: setVaultError, reset } = useVault();
  
  const [loading, setLoading] = useState(true);
  const [vaultExists, setVaultExists] = useState<boolean | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function init() {
      // Check session and vault existence
      await update2FAStatus();
      const exists = await checkVaultExists();
      setVaultExists(exists);
      setLoading(false);
    }
    init();
  }, [update2FAStatus]);

  const handleLogin = async (e: string, p: string, t?: string) => {
    try {
      await login(e, p, t);
      await sync();
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
      await create(p); 
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
      <div className="mesh-glow" />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={
            <PublicRoute isAuthenticated={!!session} isVaultUnlocked={!!vault} vaultExists={vaultExists}>
              <LandingPage onLogin={() => navigate("/login")} onRegister={() => navigate("/register")} />
            </PublicRoute>
          } />
          
          <Route path="/login" element={
            <PublicRoute isAuthenticated={!!session} isVaultUnlocked={!!vault} vaultExists={vaultExists}>
              <div style={{ maxWidth: 400, margin: "140px auto 0", padding: "0 20px" }}>
                <div className="animate-fade-in shadow-2xl">
                  <LoginForm 
                    onLogin={handleLogin} 
                    onGoToRegister={() => navigate("/register")} 
                    error={authError} 
                    loading={isAuthAction} 
                  />
                </div>
              </div>
            </PublicRoute>
          } />

          <Route path="/register" element={
            <PublicRoute isAuthenticated={!!session} isVaultUnlocked={!!vault} vaultExists={vaultExists}>
              <div style={{ maxWidth: 400, margin: "140px auto 0", padding: "0 20px" }}>
                <div className="animate-fade-in shadow-2xl">
                  <RegisterVault 
                    onRegister={handleRegister} 
                    onGoToLogin={() => navigate("/login")} 
                    error={authError} 
                    loading={isAuthAction} 
                  />
                </div>
              </div>
            </PublicRoute>
          } />

          <Route path="/unlock" element={
            session ? (
              <div style={{ maxWidth: 400, margin: "140px auto 0", padding: "0 20px" }}>
                <div className="animate-fade-in shadow-2xl">
                  <UnlockVault 
                    onUnlock={handleUnlock} 
                    onRecover={handleRecover} 
                    error={vaultError} 
                    loading={isUnlocking} 
                  />
                </div>
                <p style={{ textAlign: "center", marginTop: 24 }} className="animate-fade-in">
                  <span 
                    onClick={async () => { 
                      if (confirm("This will permanently delete your locally stored vault data. You will need to login and sync from cloud again. Proceed?")) {
                        try {
                          await reset(); 
                          await logout(); 
                        } catch (e) {
                          console.error("Error during reset/logout", e);
                        } finally {
                           navigate("/login"); 
                        }
                      }
                    }} 
                    style={{ cursor: "pointer", color: "var(--text-dim)", fontSize: 12, fontWeight: 500 }}
                  >
                    Switch Account / Reset Local Data
                  </span>
                </p>
              </div>
            ) : <Navigate to="/login" />
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute isAuthenticated={!!session} isVaultUnlocked={!!vault} vaultExists={vaultExists}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <VaultDashboard
                  vault={vault!}
                  userEmail={session?.email || ""}
                  onSync={async () => {
                  try {
                    await sync();
                    setToast({ message: "Sync successful!", type: "success" });
                  } catch (err: any) {
                    setToast({ message: err.message || "Sync failed", type: "error" });
                  }
                }}
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
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </Suspense>

      {location.pathname !== "/dashboard" && location.pathname !== "/" && (
        <footer style={{ marginTop: "auto", padding: "40px 0", textAlign: "center" }}>
          <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>
            &copy; 2026 PwmngerTS &bull; Distributed Zero-Knowledge Storage
          </div>
        </footer>
      )}
    </div>
  );
}
