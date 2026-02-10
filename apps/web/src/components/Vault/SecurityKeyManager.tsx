import React, { useState } from 'react';
import { Button } from '@pwmnger/ui';
import { Key, Plus } from 'lucide-react';

interface SecurityKeyManagerProps {
  onRefresh: () => void;
  setToast: (toast: { message: string, type: "success" | "error" } | null) => void;
}

export const SecurityKeyManager: React.FC<SecurityKeyManagerProps> = ({ onRefresh, setToast }) => {
  const [loading, setLoading] = useState(false);

  const handleAddKey = async () => {
    setLoading(true);
    try {
      const { 
        getWebAuthnRegistrationOptions, 
        verifyWebAuthnRegistration, 
        startRegistration 
      } = await import('@pwmnger/app-logic');
      
      // 1. Get options from server
      const options = await getWebAuthnRegistrationOptions();
      
      // 2. Start browser ceremony
      const attestation = await startRegistration(options);
      
      // 3. Verify with server
      await verifyWebAuthnRegistration(attestation);
      
      setToast({ message: "Security Key Registered!", type: "success" });
      onRefresh();
    } catch (err: any) {
      console.error(err);
      setToast({ message: err.message || "Failed to register key", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 24, borderTop: "1px solid var(--border-subtle)", paddingTop: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <Key size={16} style={{ color: "var(--primary)" }} />
        <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>Security Keys (FIDO2/WebAuthn)</h3>
      </div>
      
      <p style={{ fontSize: "12px", color: "var(--text-dim)", marginBottom: 16 }}>
        Use a physical security key (like a YubiKey) for industrial-grade protection against phishing.
      </p>

      <Button 
        variant="secondary" 
        onClick={handleAddKey} 
        disabled={loading}
        style={{ width: "100%", fontSize: "12px", height: "36px", gap: 8 }}
      >
        <Plus size={14} /> {loading ? "Waiting for Key..." : "Register New Security Key"}
      </Button>
    </div>
  );
};
