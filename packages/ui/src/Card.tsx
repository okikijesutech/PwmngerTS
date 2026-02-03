import React from "react";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, title, style }) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #f0f0f0",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
    ...style,
  };

  const titleStyle: React.CSSProperties = {
    marginTop: 0,
    marginBottom: "16px",
    fontSize: "18px",
    fontWeight: 600,
    color: "#262626",
    borderBottom: "1px solid #f0f0f0",
    paddingBottom: "12px",
  };

  return (
    <div style={cardStyle}>
      {title && <h3 style={titleStyle}>{title}</h3>}
      {children}
    </div>
  );
};
