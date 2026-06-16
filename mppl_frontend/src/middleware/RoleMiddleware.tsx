import { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthSession } from "../hooks/useAuthSession"; 
import Forbidden from "../pages/errors/Forbidden";

interface RoleMiddlewareProps {
  allowedRoles: string[];
  children?: ReactNode;
}

export default function RoleMiddleware({ allowedRoles, children }: RoleMiddlewareProps) {
  const { user, token } = useAuthSession();
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 text-slate-400 font-medium text-xs">
        Memverifikasi otoritas peran hak akses...
      </div>
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return <Forbidden />;
  }

  return children ? <>{children}</> : <Outlet />;
}