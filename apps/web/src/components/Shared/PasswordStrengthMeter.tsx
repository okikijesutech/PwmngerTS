import React, { memo } from "react";

interface PasswordStrengthMeterProps {
  strength: "Weak" | "Fair" | "Good" | "Strong" | "Very Strong" | string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = memo(({
  strength,
}) => {
  const getStrengthColor = () => {
    switch (strength) {
      case "Weak":
        return "#ef4444"; // red-500
      case "Fair":
        return "#f59e0b"; // amber-500
      case "Good":
        return "#10b981"; // emerald-500
      case "Strong":
      case "Very Strong":
        return "var(--accent-green)";
      default:
        return "var(--slate-700)";
    }
  };

  const getStrengthWidth = () => {
    switch (strength) {
      case "Weak":
        return "20%";
      case "Fair":
        return "40%";
      case "Good":
        return "60%";
      case "Strong":
        return "80%";
      case "Very Strong":
        return "100%";
      default:
        return "0%";
    }
  };

  return (
    <div style={{ marginTop: 8, marginBottom: 16 }}>
      <div
        style={{
          height: 6,
          width: "100%",
          backgroundColor: "var(--slate-900)",
          borderRadius: "var(--radius-full)",
          overflow: "hidden",
          border: "1px solid var(--border-subtle)"
        }}
      >
        <div
          style={{
            height: "100%",
            width: getStrengthWidth(),
            backgroundColor: getStrengthColor(),
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: strength !== "" ? `0 0 10px ${getStrengthColor()}44` : "none"
          }}
        />
      </div>
      <div
        style={{
          fontSize: 11,
          marginTop: 6,
          color: "var(--text-dim)",
          fontWeight: 600,
          textAlign: "right",
          textTransform: "uppercase",
          letterSpacing: "0.025em"
        }}
      >
        Strength: <span style={{ color: getStrengthColor() }}>{strength || "None"}</span>
      </div>
    </div>
  );
});
