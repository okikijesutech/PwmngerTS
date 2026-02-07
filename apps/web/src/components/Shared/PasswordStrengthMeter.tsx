import React from "react";

interface PasswordStrengthMeterProps {
  strength: "Weak" | "Fair" | "Good" | "Strong" | "Very Strong" | string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  strength,
}) => {
  const getStrengthColor = () => {
    switch (strength) {
      case "Weak":
        return "#ff4d4f";
      case "Fair":
        return "#faad14";
      case "Good":
        return "#52c41a";
      case "Strong":
      case "Very Strong":
        return "#1890ff";
      default:
        return "#d9d9d9";
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
          height: 4,
          width: "100%",
          backgroundColor: "#f0f0f0",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: getStrengthWidth(),
            backgroundColor: getStrengthColor(),
            transition: "all 0.3s ease",
          }}
        />
      </div>
      <div
        style={{
          fontSize: 12,
          marginTop: 4,
          color: getStrengthColor(),
          fontWeight: 600,
          textAlign: "right",
        }}
      >
        {strength}
      </div>
    </div>
  );
};
