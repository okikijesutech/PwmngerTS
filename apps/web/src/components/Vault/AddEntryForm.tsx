import React, { useState } from "react";
import { Button, Input } from "@pwmnger/ui";
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
        gap: 16,
        alignItems: "start",
      }}
    >
      <Input
        placeholder="Site"
        value={site}
        onChange={(e) => setSite(e.target.value)}
        style={{ padding: "8px 12px", fontSize: "13px" }}
      />
      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: "8px 12px", fontSize: "13px" }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ position: "relative" }}>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "8px 40px 8px 12px", fontSize: "13px", width: "100%" }}
          />
          <span 
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
            title="Generate strong password"
            style={{ 
              position: "absolute", 
              right: 12, 
              top: "50%", 
              transform: "translateY(-50%)", 
              cursor: "pointer", 
              fontSize: "14px",
              opacity: 0.5,
              userSelect: "none"
            }}
          >
            ⚡
          </span>
        </div>
        <PasswordStrengthMeter strength={strength} />
      </div>
      <Button 
        onClick={handleSubmit} 
        style={{ 
          background: "var(--primary)", 
          padding: "8px 20px", 
          borderRadius: "var(--radius-md)",
          fontWeight: 600,
          color: "#fff",
          border: "none",
          fontSize: "13px"
        }}
      >
        Add
      </Button>
    </div>
  );
};
