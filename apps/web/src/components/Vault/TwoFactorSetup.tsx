import React, { useState } from "react";
import { Button, Input, Card } from "@pwmnger/ui";

interface TwoFactorSetupProps {
  onSetup: () => Promise<{ secret: string; qrCode: string }>;
  onVerify: (token: string, secret: string) => Promise<any>;
}

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({
  onSetup,
  onVerify,
}) => {
  const [step, setStep] = useState<"IDLE" | "QR" | "SUCCESS">("IDLE");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const handleStart = async () => {
    try {
      const data = await onSetup();
      setSecret(data.secret);
      setQrCode(data.qrCode);
      setStep("QR");
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to start 2FA setup");
    }
  };

  const handleVerify = async () => {
    try {
      await onVerify(token, secret);
      setStep("SUCCESS");
      setError("");
    } catch (err: any) {
      setError(err.message || "Invalid Token");
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {step === "IDLE" && (
        <div style={{ textAlign: "center" }}>
           <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 16 }}>
            Scan a QR code with your authenticator app (Google Auth, Authy, etc.) to generate secure tokens.
          </p>
          <Button 
            onClick={handleStart} 
            style={{ width: "100%", height: "36px", fontSize: "13px" }}
          >
            Begin Setup
          </Button>
          {error && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 8 }}>{error}</p>}
        </div>
      )}

      {step === "QR" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ 
            padding: 12, 
            background: "#fff", 
            borderRadius: "var(--radius-lg)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            <img
              src={qrCode}
              alt="2FA QR Code"
              style={{ display: "block", width: 140, height: 140 }}
            />
          </div>
          
          <div style={{ textAlign: "center", width: "100%" }}>
            <p style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 4 }}>Manual Secret Key:</p>
            <code style={{ 
              display: "block", 
              padding: "8px", 
              background: "rgba(0,0,0,0.2)", 
              borderRadius: "4px", 
              fontSize: "12px", 
              color: "var(--accent-blue)",
              fontFamily: "monospace",
              userSelect: "all",
              wordBreak: "break-all"
            }}>
              {secret}
            </code>
          </div>

          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
            <Input
              placeholder="Enter 6-digit code"
              value={token}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                setToken(val);
                if (val.length === 6) {
                   // Auto verify could happen here, but button is safer for UX
                }
              }}
              style={{ 
                textAlign: "center", 
                letterSpacing: "4px", 
                fontSize: "16px", 
                fontWeight: 600,
                height: "40px",
                background: "var(--slate-900)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)"
              }}
            />
            <Button
              onClick={handleVerify}
              disabled={token.length !== 6}
              style={{ width: "100%", height: "36px", fontSize: "13px" }}
            >
              Verify & Enable
            </Button>
          </div>
          
          {error && <p style={{ color: "#ef4444", fontSize: 12, margin: 0 }}>{error}</p>}
          
          <Button 
            variant="secondary"
            onClick={() => setStep("IDLE")} 
            style={{ width: "100%", height: "32px", fontSize: "12px", background: "transparent", border: "none", color: "var(--text-dim)" }}
          >
            Cancel
          </Button>
        </div>
      )}

      {step === "SUCCESS" && (
        <div style={{ 
          textAlign: "center", 
          padding: "20px", 
          background: "rgba(62, 207, 142, 0.1)", 
          border: "1px solid rgba(62, 207, 142, 0.2)",
          borderRadius: "var(--radius-md)"
        }}>
          <h3 style={{ color: "var(--accent-green)", margin: "0 0 8px", fontSize: "16px" }}>🎉 Setup Complete!</h3>
          <p style={{ fontSize: "13px", color: "var(--text-primary)", margin: 0 }}>
            Two-Factor Authentication is now active.
          </p>
        </div>
      )}
    </div>
  );
};
