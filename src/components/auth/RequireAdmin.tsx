// src/components/auth/RequireAdmin.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { ReactNode } from "react";
import FullPageLoader from "../common/FullPageLoader";

interface RequireAdminProps {
  children: ReactNode;
}

const RequireAdmin = ({ children }: RequireAdminProps) => {
  const { authUser, loading } = useAuth();

  if (loading) return <FullPageLoader />;

  if (authUser?.role !== "admin") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default RequireAdmin;
