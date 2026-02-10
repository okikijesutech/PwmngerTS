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
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Key size={14} style={{ color: "var(--primary)" }} />
          <h3 style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>Security Keys</h3>
        </div>
      </div>
      
      <Button 
        variant="secondary" 
        onClick={handleAddKey} 
        disabled={loading}
        style={{ width: "100%", fontSize: "12px", height: "32px", gap: 8 }}
      >
        <Plus size={14} /> {loading ? "Waiting..." : "Add Key (FIDO2)"}
      </Button>
    </div>
  );
};
