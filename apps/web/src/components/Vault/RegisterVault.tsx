import React from 'react';
import { Button, Input, Card } from "@pwmnger/ui";
import { PasswordStrengthMeter } from '../Shared/PasswordStrengthMeter';
import { getPasswordStrength } from '../../utils/passwordStrength';

interface RegisterVaultProps {
  onRegister: (email: string, password: string) => void;
  onGoToLogin: () => void;
  error?: string;
  loading?: boolean;
}

export const RegisterVault: React.FC<RegisterVaultProps> = ({ onRegister, onGoToLogin, error, loading }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const strength = getPasswordStrength(password);

  return (
    <Card title="Create Account" style={{ 
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
    }}>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>
        Create a new secure vault. <strong>Passwords cannot be recovered.</strong>
      </p>
      
      <Input
        type='email'
        placeholder='Email Address'
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />

      <Input
        type='password'
        placeholder='Set Master Password'
        label="New Master Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      
      <PasswordStrengthMeter strength={strength} />

      {error && (
        <p style={{ color: "#ff4d4f", textAlign: "center", marginBottom: 16, fontSize: 14 }}>
          {error}
        </p>
      )}

      <div style={{ marginTop: 24 }}>
        <Button 
          onClick={() => onRegister(email, password)} 
          style={{ width: "100%" }}
          disabled={password.length < 8 || !email || loading}
        >
          {loading ? "Creating Vault..." : "Create Vault"}
        </Button>
      </div>
      
      <p style={{ fontSize: 13, color: '#666', marginTop: 20, textAlign: 'center' }}>
        Already have an account? <span onClick={onGoToLogin} style={{ color: '#1890ff', cursor: 'pointer', fontWeight: 600 }}>Login</span>
      </p>
    </Card>
  );
};
