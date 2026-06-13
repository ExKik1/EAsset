import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingScreen } from "../components/ui/LoadingScreen";

interface AuthMiddlewareProps {
  children: React.ReactNode;
}

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const { token, loading } = useAuth();
  const location = useLocation();
  const hasTokenInStorage = localStorage.getItem("token");
  const [visualLoading, setVisualLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setVisualLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading || visualLoading) {
    return <LoadingScreen message="Memverifikasi Otorisasi Sesi..." />;
  }

  if (!token && !hasTokenInStorage) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthMiddleware;
