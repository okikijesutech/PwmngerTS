import React, { useState } from 'react';
import { Button, Input, Card } from "@pwmnger/ui";

interface TwoFactorSetupProps {
  onSetup: () => Promise<{ secret: string; qrCode: string }>;
  onVerify: (token: string, secret: string) => Promise<any>;
}

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ onSetup, onVerify }) => {
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
    <div style={{ marginTop: 24, padding: 20, borderTop: "1px solid #eee" }}>
      <h3 style={{ marginTop: 0 }}>Two-Factor Authentication</h3>
      
      {step === "IDLE" && (
        <div>
          <p style={{ color: "#666", fontSize: 14 }}>
            Secure your account with Google Authenticator or similar apps.
          </p>
          <Button onClick={handleStart}>Enable 2FA</Button>
          {error && <p style={{ color: "red", fontSize: 12 }}>{error}</p>}
        </div>
      )}

      {step === "QR" && (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 14 }}>Scan this QR Code:</p>
          <img src={qrCode} alt="2FA QR Code" style={{ border: "4px solid white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />
          <p style={{ fontSize: 12, color: "#999", fontFamily: "monospace" }}>Secret: {secret}</p>
          
          <div style={{ maxWidth: 200, margin: "16px auto" }}>
            <Input 
              placeholder="000000" 
              value={token} 
              onChange={(e) => setToken(e.target.value)} 
            />
            <Button onClick={handleVerify} style={{ marginTop: 8, width: "100%" }}>Verify & Enable</Button>
          </div>
          {error && <p style={{ color: "red", fontSize: 12 }}>{error}</p>}
          <p style={{ fontSize: 12, cursor: "pointer", color: "#666" }} onClick={() => setStep("IDLE")}>Cancel</p>
        </div>
      )}

      {step === "SUCCESS" && (
        <div style={{ color: "green", fontWeight: 600 }}>
          ✅ Two-Factor Authentication Enabled!
        </div>
      )}
    </div>
  );
};
