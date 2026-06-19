import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null; // or a loading spinner

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}; 