import React from 'react';
import { Button, Input, Card } from "@pwmnger/ui";

interface LoginFormProps {
  onLogin: (email: string, password: string, twoFactorToken?: string) => Promise<void>;
  onGoToRegister: () => void;
  error?: string;
  loading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onGoToRegister, error, loading }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [twoFactorToken, setTwoFactorToken] = React.useState("");
  const [show2FA, setShow2FA] = React.useState(false);

  const handleSubmit = async () => {
    try {
      await onLogin(email, password, show2FA ? twoFactorToken : undefined);
    } catch (err: any) {
      if (err.requires2FA) {
        setShow2FA(true);
      }
    }
  };

  return (
    <Card title="Welcome Back" style={{ 
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
    }}>
      {!show2FA ? (
        <>
          <Input
            type='email'
            placeholder='Email Address'
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type='password'
            placeholder='Master Password'
            label="Master Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </>
      ) : (
        <>
           <div style={{ textAlign: "center", marginBottom: 20 }}>
             <p>Two-Factor Authentication Required</p>
             <p style={{ fontSize: 12, color: "#666" }}>Enter the code from your authenticator app.</p>
           </div>
           <Input
            placeholder='000000'
            label="2FA Code"
            value={twoFactorToken}
            onChange={(e) => setTwoFactorToken(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            autoFocus
          />
        </>
      )}

      {error && !show2FA && (
        <p style={{ color: "#ff4d4f", textAlign: "center", marginTop: 16, fontSize: 14 }}>
          {error}
        </p>
      )}
      {/* If showing 2FA, parent error might be '2FA Required' effectively handled by switch. 
          But if subsequent error (invalid token), we should show it. 
          Parent error prop handles general errors. */}
      {show2FA && error && error !== "2FA Required" && (
         <p style={{ color: "#ff4d4f", textAlign: "center", marginTop: 16, fontSize: 14 }}>{error}</p>
      )}

      <div style={{ marginTop: 24 }}>
        <Button 
          onClick={handleSubmit} 
          style={{ width: "100%" }}
          disabled={loading || !email || !password || (show2FA && !twoFactorToken)}
        >
          {loading ? "Verifying..." : (show2FA ? "Verify Code" : "Login")}
        </Button>
      </div>

      <p style={{ fontSize: 13, color: '#666', marginTop: 20, textAlign: 'center' }}>
        Don't have an account? <span onClick={onGoToRegister} style={{ color: '#1890ff', cursor: 'pointer', fontWeight: 600 }}>Create new Vault</span>
      </p>
    </Card>
  );
};
