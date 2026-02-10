import React from "react";
import { Button, Input } from "@pwmnger/ui";
import { Mail, Lock, Sparkles, ArrowRight, Shield } from "lucide-react";
import { PasswordStrengthMeter } from "../Shared/PasswordStrengthMeter";
import { getPasswordStrength } from "../../utils/passwordStrength";

interface RegisterVaultProps {
  onRegister: (email: string, password: string) => void;
  onGoToLogin: () => void;
  error?: string;
  loading?: boolean;
}

export const RegisterVault: React.FC<RegisterVaultProps> = ({
  onRegister,
  onGoToLogin,
  error,
  loading,
}) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const strength = getPasswordStrength(password);

  return (
    <div className="card-premium animate-fade-in" style={{ padding: "40px", borderRadius: "var(--radius-xl)" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: 700, letterSpacing: "-0.025em" }}>Create Vault</h2>
        <p style={{ margin: 0, fontSize: "14px", color: "var(--text-dim)" }}>Start your secure, zero-knowledge journey.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ position: "relative" }}>
          <Mail size={16} style={{ position: "absolute", left: 14, top: 40, color: "var(--text-dim)" }} />
          <Input
            type="email"
            placeholder="Email address"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            style={{ 
              background: "var(--slate-900)", 
              border: "1px solid var(--border-subtle)", 
              color: "#fff", 
              paddingLeft: "40px",
              height: "44px"
            }}
          />
        </div>

        <div style={{ position: "relative" }}>
          <Lock size={16} style={{ position: "absolute", left: 14, top: 40, color: "var(--text-dim)" }} />
          <Input
            type="password"
            placeholder="Choose a strong master password"
            label="Master Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            style={{ 
              background: "var(--slate-900)", 
              border: "1px solid var(--border-subtle)", 
              color: "#fff", 
              paddingLeft: "40px",
              height: "44px"
            }}
          />
        </div>

        <div style={{ marginTop: -8 }}>
           <PasswordStrengthMeter strength={strength} />
        </div>

        <div style={{ display: "flex", gap: 12, padding: "12px", background: "rgba(62, 207, 142, 0.05)", border: "1px solid rgba(62, 207, 142, 0.1)", borderRadius: "var(--radius-md)", marginTop: 4 }}>
           <Shield size={16} style={{ color: "var(--accent-green)", flexShrink: 0 }} />
           <p style={{ margin: 0, fontSize: "11px", color: "var(--accent-green)", lineHeight: 1.4 }}>
             <strong>Passwords cannot be recovered.</strong> PwmngerTS is zero-knowledge; we don't store your master password.
           </p>
        </div>
      </div>

      {error && (
        <p style={{ color: "#ef4444", textAlign: "center", marginTop: 20, fontSize: "13px", background: "rgba(239, 68, 68, 0.05)", padding: "8px", borderRadius: "6px", border: "1px solid rgba(239, 68, 68, 0.1)" }}>
          {error}
        </p>
      )}

      <div style={{ marginTop: 32 }}>
        <Button
          onClick={() => onRegister(email, password)}
          disabled={password.length < 8 || !email || loading}
          style={{ 
            width: "100%", 
            height: "44px", 
            background: "var(--accent-green)", 
            color: "#000", 
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            border: "none"
          }}
        >
          {loading ? "Constructing Vault..." : "Create Secure Vault"} 
          {!loading && <Sparkles size={16} />}
        </Button>
      </div>

      <div style={{ marginTop: 32, textAlign: "center", fontSize: "13px", color: "var(--text-dim)" }}>
        Already have an account?{" "}
        <span
          onClick={onGoToLogin}
          style={{ color: "var(--accent-green)", cursor: "pointer", fontWeight: 600 }}
        >
          Login
        </span>
      </div>
    </div>
  );
};
