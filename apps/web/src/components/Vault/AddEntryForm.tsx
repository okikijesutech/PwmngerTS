import React, { useState } from "react";
import { Button, Input, Card } from "@pwmnger/ui";
import { PasswordStrengthMeter } from "../Shared/PasswordStrengthMeter";
import { getPasswordStrength } from "../../utils/passwordStrength";

interface AddEntryFormProps {
  onAdd: (site: string, username: string, password: string) => void;
}

export const AddEntryForm: React.FC<AddEntryFormProps> = ({ onAdd }) => {
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const strength = getPasswordStrength(password);

  const handleSubmit = () => {
    if (site && username && password) {
      onAdd(site, username, password);
      setSite("");
      setUsername("");
      setPassword("");
    }
  };

  return (
    <Card title="Add New Credential" style={{ marginBottom: 32 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr auto",
          gap: 16,
          alignItems: "start",
        }}
      >
        <Input
          placeholder="Site (e.g. google.com)"
          label="Website"
          value={site}
          onChange={(e) => setSite(e.target.value)}
        />
        <Input
          placeholder="Username"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Input
            type="password"
            placeholder="Password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordStrengthMeter strength={strength} />
        </div>
        <Button onClick={handleSubmit} style={{ marginTop: 24 }}>
          Add
        </Button>
      </div>
    </Card>
  );
};
