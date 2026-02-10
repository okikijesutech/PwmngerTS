import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Button, Input } from "@pwmnger/ui";
import { Shield, ShieldCheck, Copy, CheckCircle } from 'lucide-react';

interface TwoFactorSetupModalProps {
  onClose: () => void;
  onSetup: () => Promise<{ secret: string; qrCode: string }>;
  onVerify: (token: string, secret: string) => Promise<any>;
  setToast: (toast: { message: string, type: "success" | "error" } | null) => void;
}

export const TwoFactorSetupModal: React.FC<TwoFactorSetupModalProps> = ({
  onClose,
  onSetup,
  onVerify,
  setToast
}) => {
  const [step, setStep] = useState<"IDLE" | "QR" | "SUCCESS">("IDLE");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await onSetup();
      setSecret(data.secret);
      setQrCode(data.qrCode);
      setStep("QR");
    } catch (err: any) {
      setError(err.message || "Failed to start 2FA setup");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    try {
      await onVerify(token, secret);
      setStep("SUCCESS");
    } catch (err: any) {
      setError(err.message || "Invalid Token");
    } finally {
      setLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setToast({ message: "Secret key copied!", type: "success" });
  };

  return ReactDOM.createPortal(
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 }}>
      {/* ... keeping the inner content mostly same, ensuring high z-index ... */}
      <div className="card-premium animate-fade-in" style={{ width: "100%", maxWidth: 440, padding: 32, borderRadius: "var(--radius-xl)" }}>
        
        {step === "IDLE" && (
          <div className="animate-fade-in" style={{ textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(62, 207, 142, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", border: "1px solid rgba(62, 207, 142, 0.2)" }}>
              <Shield size={32} style={{ color: "var(--accent-green)" }} />
            </div>
            
            <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 12px" }}>Setup 2FA</h2>
            <p style={{ fontSize: "14px", color: "var(--text-dim)", marginBottom: 24, lineHeight: "1.5" }}>
              Secure your account by linking an authenticator app (Google Authenticator, Authy, etc.).
            </p>

            {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 16 }}>{error}</p>}

            <div style={{ display: "flex", gap: 12 }}>
              <Button variant="secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</Button>
              <Button onClick={handleStart} disabled={loading} style={{ flex: 1 }}>
                {loading ? "Preparing..." : "Begin Setup"}
              </Button>
            </div>
          </div>
        )}

        {step === "QR" && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 20px" }}>Scan QR Code</h2>
            
            <div style={{ 
              padding: 16, 
              background: "#fff", 
              borderRadius: "var(--radius-lg)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              marginBottom: 20
            }}>
              <img
                src={qrCode}
                alt="2FA QR Code"
                style={{ display: "block", width: 160, height: 160 }}
              />
            </div>
            
            <div style={{ width: "100%", marginBottom: 24 }}>
              <div style={{ fontSize: "12px", color: "var(--text-dim)", marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
                <span>Manual Entry Key</span>
                {copied && <span style={{ color: "var(--accent-green)" }}>Copied!</span>}
              </div>
              <div 
                onClick={copySecret}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between",
                  padding: "10px 12px", 
                  background: "rgba(0,0,0,0.2)", 
                  borderRadius: "var(--radius-md)", 
                  cursor: "pointer",
                  border: "1px solid var(--border-subtle)"
                }}
              >
                <code style={{ fontSize: "13px", color: "var(--accent-blue)", fontFamily: "monospace" }}>
                  {secret}
                </code>
                <Copy size={14} style={{ color: "var(--text-dim)" }} />
              </div>
            </div>

            <div style={{ width: "100%", display: "flex", gap: 12, alignItems: "flex-end" }}>
               <Input
                label="Verification Code"
                placeholder="000 000"
                value={token}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                  setToken(val);
                }}
                style={{ 
                  textAlign: "center", 
                  letterSpacing: "4px", 
                  fontWeight: 600,
                  fontSize: "16px"
                }}
              />
            </div>

            {error && <p style={{ color: "#ef4444", fontSize: 13, marginTop: 12, width: "100%", textAlign: "center" }}>{error}</p>}

            <div style={{ display: "flex", gap: 12, marginTop: 24, width: "100%" }}>
              <Button variant="secondary" onClick={() => setStep("IDLE")} style={{ flex: 1 }}>Back</Button>
              <Button 
                onClick={handleVerify} 
                disabled={token.length !== 6 || loading} 
                style={{ flex: 1 }}
              >
                {loading ? "Verifying..." : "Verify & Enable"}
              </Button>
            </div>
          </div>
        )}

        {step === "SUCCESS" && (
          <div className="animate-fade-in" style={{ textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--accent-green-glow)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <CheckCircle size={32} style={{ color: "var(--accent-green)" }} />
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 12px" }}>2FA Enabled!</h2>
            <p style={{ fontSize: "14px", color: "var(--text-dim)", marginBottom: 32 }}>
              Your account is now secured with Two-Factor Authentication.
            </p>
            <Button onClick={onClose} style={{ width: "100%" }}>Done</Button>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
};
