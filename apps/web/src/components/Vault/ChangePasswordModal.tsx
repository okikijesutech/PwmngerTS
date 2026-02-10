import React, { useState } from 'react';
import { Button, Input } from '@pwmnger/ui';
import { Lock, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';

interface ChangePasswordModalProps {
  onClose: () => void;
  setToast: (toast: { message: string, type: "success" | "error" } | null) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose, setToast }) => {
  const [step, setStep] = useState(1);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRekey = async () => {
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { rekeyVault } = await import('@pwmnger/app-logic');
      await rekeyVault(oldPassword, newPassword);
      setStep(3);
      setToast({ message: "Master Password updated successfully!", type: "success" });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update password. Please check your current password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
      <div className="card-premium animate-fade-in" style={{ width: "100%", maxWidth: 440, padding: 32, borderRadius: "var(--radius-xl)" }}>
        
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 12px" }}>Change Master Password</h2>
            <p style={{ fontSize: "14px", color: "var(--text-dim)", marginBottom: 24 }}>
              This will re-encrypt your entire vault with a new key. Ensure you have your recovery kit backed up.
            </p>

            <Input 
              type="password"
              label="Current Master Password"
              placeholder="••••••••"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              style={{ marginBottom: 20 }}
            />

            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <Button variant="secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</Button>
              <Button onClick={() => setStep(2)} disabled={!oldPassword} style={{ flex: 1 }}>Next <ArrowRight size={16} /></Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent-green)", marginBottom: 16 }}>
              <Lock size={18} />
              <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Set New Password</h2>
            </div>
            
            <p style={{ fontSize: "13px", color: "var(--text-dim)", marginBottom: 20 }}>
              Use a strong, unique pass-phrase that you can remember.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Input 
                type="password"
                label="New Master Password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input 
                type="password"
                label="Confirm New Password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && (
              <p style={{ color: "#ef4444", fontSize: "13px", marginTop: 16, background: "rgba(239, 68, 68, 0.05)", padding: 8, borderRadius: 6 }}>
                {error}
              </p>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <Button variant="secondary" onClick={() => setStep(1)} disabled={loading}>Previous</Button>
              <Button onClick={handleRekey} disabled={loading || !newPassword || !confirmPassword} style={{ flex: 1 }}>
                {loading ? "Re-encrypting..." : "Update Vault Key"}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: "center" }} className="animate-fade-in">
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--accent-green-glow)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <CheckCircle size={32} style={{ color: "var(--accent-green)" }} />
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 12px" }}>Success!</h2>
            <p style={{ fontSize: "14px", color: "var(--text-dim)", marginBottom: 32 }}>
              Your vault has been re-encrypted with your new Master Password.
            </p>
            <Button onClick={onClose} style={{ width: "100%" }}>Done</Button>
          </div>
        )}

      </div>
    </div>
  );
};
