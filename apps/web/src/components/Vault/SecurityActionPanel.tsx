import React from 'react';
import { Button } from '@pwmnger/ui';
import { Shield, ShieldCheck, ShieldAlert, KeyRound } from 'lucide-react';
import { TwoFactorSetupModal } from './TwoFactorSetupModal';
import { SecurityKeyManager } from './SecurityKeyManager';
import { ChangePasswordModal } from './ChangePasswordModal';
import styles from '../../styles/Dashboard.module.css';

interface SecurityActionPanelProps {
  is2FAEnabled: boolean;
  show2FASetup: boolean;
  setShow2FASetup: (val: boolean) => void;
  onRefreshAccountStatus: () => void;
  setToast: (toast: { message: string, type: "success" | "error" } | null) => void;
}

export const SecurityActionPanel: React.FC<SecurityActionPanelProps> = ({
  is2FAEnabled,
  show2FASetup,
  setShow2FASetup,
  onRefreshAccountStatus,
  setToast
}) => {
  const [showChangePassword, setShowChangePassword] = React.useState(false);

  return (
    <div className="card-premium" style={{ padding: 20, flex: 1 }}>
      {showChangePassword && (
        <ChangePasswordModal 
          onClose={() => setShowChangePassword(false)}
          setToast={setToast}
        />
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Left Column: 2FA */}
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Shield size={14} className={styles.accentSuccess} style={{ color: "var(--accent-green)" }} />
            <h3 style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>Two-Factor Auth</h3>
          </div>

          {is2FAEnabled ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(62, 207, 142, 0.05)", border: "1px solid rgba(62, 207, 142, 0.1)", borderRadius: "var(--radius-md)" }}>
              <ShieldCheck size={16} style={{ color: "var(--accent-green)" }} />
              <span style={{ fontSize: "13px", color: "var(--accent-green)", fontWeight: 500 }}>2FA is active</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.1)", borderRadius: "var(--radius-md)" }}>
                <ShieldAlert size={16} style={{ color: "#ef4444" }} />
                <span style={{ fontSize: "13px", color: "#ef4444", fontWeight: 500 }}>2FA is disabled</span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-dim)", margin: 0 }}>
                Enable 2FA (TOTP) for better security.
              </p>
              <Button variant="secondary" onClick={() => setShow2FASetup(true)} style={{ fontSize: "12px", height: "32px", width: "100%", marginTop: "auto" }}>
                Enable 2FA
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Keys & Advanced */}
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div>
            <SecurityKeyManager 
              onRefresh={onRefreshAccountStatus}
              setToast={setToast}
            />
          </div>

          <div style={{ marginTop: "auto", paddingTop: 12 }}>
            <Button 
              variant="secondary" 
              style={{ width: "100%", fontSize: "12px", height: "32px", gap: 8, justifyContent: "flex-start", padding: "0 12px", opacity: 0.8 }}
              onClick={() => setShowChangePassword(true)}
            >
             <KeyRound size={14} /> Change Master Password
           </Button>
          </div>
        </div>
      </div>

      {show2FASetup && (
        <TwoFactorSetupModal 
          onClose={() => setShow2FASetup(false)}
          setToast={setToast}
          onSetup={async () => {
             const { setup2FA } = await import("@pwmnger/app-logic");
             return setup2FA();
          }}
          onVerify={async (tokenStr, secret) => {
             const { verify2FASetup } = await import("@pwmnger/app-logic");
             const res = await verify2FASetup(tokenStr, secret);
             if (res.success) {
               onRefreshAccountStatus();
               setToast({ message: "2FA Enabled!", type: "success" });
               // Modal handles close on "Done"
             }
             return res;
          }}
        />
      )}
    </div>
  );
};
