import React from 'react';
import { Button, Input, Card } from "@pwmnger/ui";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onGoToRegister: () => void;
  error?: string;
  loading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onGoToRegister, error, loading }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <Card title="Welcome Back" style={{ 
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
    }}>
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
        onKeyPress={(e) => e.key === 'Enter' && onLogin(email, password)}
      />

      {error && (
        <p style={{ color: "#ff4d4f", textAlign: "center", marginTop: 16, fontSize: 14 }}>
          {error}
        </p>
      )}

      <div style={{ marginTop: 24 }}>
        <Button 
          onClick={() => onLogin(email, password)} 
          style={{ width: "100%" }}
          disabled={loading || !email || !password}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>

      <p style={{ fontSize: 13, color: '#666', marginTop: 20, textAlign: 'center' }}>
        Don't have an account? <span onClick={onGoToRegister} style={{ color: '#1890ff', cursor: 'pointer', fontWeight: 600 }}>Create new Vault</span>
      </p>
    </Card>
  );
};
