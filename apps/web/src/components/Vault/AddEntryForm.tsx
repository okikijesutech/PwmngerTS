import React, { useState } from "react";
import { Button, Input } from "@pwmnger/ui";
import { Zap } from "lucide-react";
import { PasswordStrengthMeter } from "../Shared/PasswordStrengthMeter";
import { getPasswordStrength } from "../../utils/passwordStrength";

interface AddEntryFormProps {
  onAdd: (
    site: string,
    username: string,
    password: string,
    folderId?: string | null,
  ) => void;
  folderId?: string | null;
}

export const AddEntryForm: React.FC<AddEntryFormProps> = ({
  onAdd,
  folderId,
}) => {
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const strength = getPasswordStrength(password);

  const handleSubmit = () => {
    if (site && username && password) {
      onAdd(site, username, password, folderId);
      setSite("");
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr auto",
        gap: 12,
        alignItems: "start",
      }}
    >
      <Input
        placeholder="Site / App"
        value={site}
        onChange={(e) => setSite(e.target.value)}
        style={{ 
          background: "var(--slate-900)", 
          border: "1px solid var(--border-subtle)", 
          color: "#fff", 
          fontSize: "13px", 
          height: "36px" 
        }}
      />
      <Input
        placeholder="Username / Email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ 
          background: "var(--slate-900)", 
          border: "1px solid var(--border-subtle)", 
          color: "#fff", 
          fontSize: "13px", 
          height: "36px" 
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ position: "relative" }}>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              background: "var(--slate-900)", 
              border: "1px solid var(--border-subtle)", 
              color: "#fff", 
              fontSize: "13px", 
              height: "36px",
              paddingRight: "36px",
              width: "100%" 
            }}
          />
          <Zap 
            size={14}
            onClick={() => {
              const { generatePassword } = require("../../utils/passwordGenerator");
              setPassword(generatePassword({
                length: 16,
                lowercase: true,
                uppercase: true,
                numbers: true,
                symbols: true
              }));
            }}
            style={{ 
              position: "absolute", 
              right: 12, 
              top: "50%", 
              transform: "translateY(-50%)", 
              cursor: "pointer", 
              color: "var(--accent-green)",
              opacity: 0.6,
              transition: "opacity 0.2s"
            }}
          />
        </div>
        <PasswordStrengthMeter strength={strength} />
      </div>
      <Button 
        onClick={handleSubmit} 
        style={{ 
          background: "var(--accent-green)", 
          padding: "0 16px", 
          borderRadius: "var(--radius-md)",
          fontWeight: 600,
          color: "#000",
          border: "none",
          fontSize: "13px",
          height: "36px"
        }}
      >
        Add
      </Button>
    </div>
  );
};
