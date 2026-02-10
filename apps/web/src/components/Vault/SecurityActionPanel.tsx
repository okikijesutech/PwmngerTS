import React from 'react';
import { Button } from '@pwmnger/ui';
import { Shield, ShieldCheck, ShieldAlert, KeyRound } from 'lucide-react';
import { TwoFactorSetup } from './TwoFactorSetup';
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
  return (
    <div className="card-premium" style={{ padding: 20, flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <Shield size={16} className={styles.accentSuccess} style={{ color: "var(--accent-green)" }} />
        <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>Security</h3>
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
            Enable Two-Factor Authentication (TOTP) to secure your vault with a temporary code.
          </p>
          <Button variant="secondary" onClick={() => setShow2FASetup(!show2FASetup)} style={{ fontSize: "12px", height: "32px", width: "100%" }}>
            {show2FASetup ? "Cancel Setup" : "Enable 2FA"}
          </Button>
        </div>
      )}

      {show2FASetup && (
        <div style={{ marginTop: 20, borderTop: "1px solid var(--border-subtle)", paddingTop: 20 }}>
          <TwoFactorSetup
            onSetup={async () => {
              const { setup2FA } = await import("@pwmnger/app-logic");
              const token = localStorage.getItem("pwmnger_token")!;
              return setup2FA(token);
            }}
            onVerify={async (tokenStr, secret) => {
              const { verify2FASetup } = await import("@pwmnger/app-logic");
              const authToken = localStorage.getItem("pwmnger_token")!;
              const res = await verify2FASetup(authToken, tokenStr, secret);
              if (res.success) {
                onRefreshAccountStatus();
                setToast({ message: "2FA Enabled!", type: "success" });
                setShow2FASetup(false);
              }
              return res;
            }}
          />
        </div>
      )}

      <div style={{ marginTop: 20, borderTop: "1px solid var(--border-subtle)", paddingTop: 20 }}>
         <h4 style={{ fontSize: "11px", margin: "0 0 12px 0", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>Advanced</h4>
         <Button 
           variant="secondary" 
           style={{ width: "100%", fontSize: "12px", height: "32px", gap: 8, justifyContent: "flex-start", padding: "0 12px", opacity: 0.6 }}
           onClick={() => alert("Master Password change feature is coming in v1.1. It requires full vault re-encryption.")}
         >
           <KeyRound size={14} /> Change Master Password
         </Button>
      </div>
    </div>
  );
};
