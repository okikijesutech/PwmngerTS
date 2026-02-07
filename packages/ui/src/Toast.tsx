import React, { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "#52c41a";
      case "error":
        return "#ff4d4f";
      default:
        return "#1890ff";
    }
  };

  const toastStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "24px",
    left: "50%",
    transform: `translateX(-50%) ${visible ? "translateY(0)" : "translateY(100px)"}`,
    backgroundColor: getBackgroundColor(),
    color: "white",
    padding: "12px 24px",
    borderRadius: "4px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 1000,
    transition: "all 0.3s ease-in-out",
    opacity: visible ? 1 : 0,
    fontWeight: 500,
  };

  return <div style={toastStyle}>{message}</div>;
};
