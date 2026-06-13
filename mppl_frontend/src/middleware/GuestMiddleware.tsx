import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingScreen } from "../components/ui/LoadingScreen";

interface GuestMiddlewareProps {
  children: React.ReactNode;
}

const GuestMiddleware: React.FC<GuestMiddlewareProps> = ({ children }) => {
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
    return <LoadingScreen message="Mempersiapkan Lingkungan Sandbox..." />;
  }

  if (token || hasTokenInStorage) {
    const from = location.state?.from?.pathname || "/main";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default GuestMiddleware;
