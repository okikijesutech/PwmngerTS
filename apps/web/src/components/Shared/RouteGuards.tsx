import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isUnlocked, checkVaultExists } from "@pwmnger/app-logic";

interface RouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  isVaultUnlocked: boolean;
  vaultExists: boolean | null;
}

/**
 * Guard for routes that require both a session and an unlocked vault.
 * Redirects to /login if no session, or /unlock if vault is locked but exists.
 */
export const ProtectedRoute: React.FC<RouteProps> = ({ 
  children, 
  isAuthenticated, 
  isVaultUnlocked,
  vaultExists 
}) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (vaultExists && !isVaultUnlocked) {
    return <Navigate to="/unlock" state={{ from: location }} replace />;
  }

  if (!vaultExists) {
    return <Navigate to="/register" replace />;
  }

  return <>{children}</>;
};

/**
 * Guard for public routes (Login/Register).
 * Redirects to dashboard if already authenticated and unlocked.
 */
export const PublicRoute: React.FC<RouteProps> = ({ 
  children, 
  isAuthenticated, 
  isVaultUnlocked 
}) => {
  if (isAuthenticated && isVaultUnlocked) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};
