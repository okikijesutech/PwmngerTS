import React from 'react';
import { Button } from '@pwmnger/ui';
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
    <div className="glass" style={{ padding: 16, borderRadius: "var(--radius-md)" }}>
      <h3 className={styles.sectionTitle} style={{ fontSize: "12px", marginBottom: 8, opacity: 0.6 }}>🛡️ Security</h3>
      {is2FAEnabled ? (
        <div className={`${styles.badge} ${styles.badgeSuccess}`} style={{ display: "inline-block" }}>
          ✓ Two-Factor Authentication Active
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0, flex: 1 }}>
            Enable 2FA (TOTP) for maximum security.
          </p>
          <Button variant="secondary" onClick={() => setShow2FASetup(!show2FASetup)} style={{ fontSize: "11px", padding: "6px 12px" }}>
            {show2FASetup ? "Cancel" : "Enable"}
          </Button>
        </div>
      )}
      {show2FASetup && (
        <div style={{ marginTop: 20, borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: 16 }}>
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

      <div style={{ marginTop: 12, borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: 12 }}>
         <h4 style={{ fontSize: "11px", margin: "0 0 8px 0", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Account Security</h4>
         <Button 
           variant="secondary" 
           style={{ width: "100%", fontSize: "11px", opacity: 0.6 }}
           onClick={() => alert("Master Password change feature is coming in v1.1. It requires full vault re-encryption.")}
         >
           Change Master Password
         </Button>
      </div>
    </div>
  );
};
