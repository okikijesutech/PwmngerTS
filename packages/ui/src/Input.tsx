import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  const containerStyles: React.CSSProperties = {
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    width: "100%",
  };

  const labelStyles: React.CSSProperties = {
    marginBottom: "4px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#262626",
  };

  const inputStyles: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: "6px",
    border: error ? "1px solid #ff4d4f" : "1px solid #d9d9d9",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s ease",
    width: "100%",
    boxSizing: "border-box",
    ...style,
  };

  const errorStyles: React.CSSProperties = {
    marginTop: "4px",
    fontSize: "12px",
    color: "#ff4d4f",
  };

  return (
    <div style={containerStyles}>
      {label && <label style={labelStyles}>{label}</label>}
      <input 
        style={inputStyles}
        onFocus={(e) => {
          if (!error) e.currentTarget.style.borderColor = "#40a9ff";
          e.currentTarget.style.boxShadow = error 
            ? "0 0 0 2px rgba(255, 77, 79, 0.2)" 
            : "0 0 0 2px rgba(24, 144, 255, 0.2)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? "#ff4d4f" : "#d9d9d9";
          e.currentTarget.style.boxShadow = "none";
        }}
        {...props} 
      />
      {error && <span style={errorStyles}>{error}</span>}
    </div>
  );
};
