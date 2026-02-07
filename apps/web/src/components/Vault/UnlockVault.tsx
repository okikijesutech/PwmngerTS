import React from "react";
import { Button, Input, Card } from "@pwmnger/ui";

interface UnlockVaultProps {
  onUnlock: (password: string) => void;
  error: string;
}

export const UnlockVault: React.FC<UnlockVaultProps> = ({
  onUnlock,
  error,
}) => {
  const [password, setPassword] = React.useState("");

  return (
    <Card
      title="Unlock Vault"
      style={{
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
      }}
    >
      <Input
        type="password"
        placeholder="Enter Master Password"
        label="Master Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && onUnlock(password)}
      />
      <div style={{ marginTop: 24 }}>
        <Button onClick={() => onUnlock(password)} style={{ width: "100%" }}>
          Unlock
        </Button>
      </div>
      {error && (
        <p
          style={{
            color: "#ff4d4f",
            textAlign: "center",
            marginTop: 16,
            fontSize: 14,
          }}
        >
          {error}
        </p>
      )}
    </Card>
  );
};
