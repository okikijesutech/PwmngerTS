import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  style,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          backgroundColor: "#ff4d4f",
          color: "white",
        };
      case "secondary":
        return {
          backgroundColor: "#f5f5f5",
          color: "rgba(0, 0, 0, 0.85)",
          border: "1px solid #d9d9d9",
        };
      default:
        return {
          backgroundColor: "#1890ff",
          color: "white",
        };
    }
  };

  const baseStyles: React.CSSProperties = {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    transition: "all 0.3s ease",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
    boxShadow: "0 2px 0 rgba(0, 0, 0, 0.045)",
    ...getVariantStyles(),
    ...style,
  };

  return (
    <button
      style={baseStyles}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLButtonElement).style.opacity = "0.85";
        (e.currentTarget as HTMLButtonElement).style.transform =
          "translateY(-1px)";
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLButtonElement).style.opacity = "1";
        (e.currentTarget as HTMLButtonElement).style.transform =
          "translateY(0)";
      }}
      {...props}
    >
      {children}
    </button>
  );
};
