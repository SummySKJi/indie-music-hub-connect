
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();

  console.log("ProtectedRoute - Auth state:", { user: !!user, isAdmin, requireAdmin, loading });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-white">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("No user found, redirecting to login");
    return <Navigate to={requireAdmin ? "/admin/login" : "/login"} replace />;
  }

  if (requireAdmin && !isAdmin) {
    console.log("Admin required but user is not admin, redirecting to admin login");
    return <Navigate to="/admin/login" replace />;
  }

  console.log("Access granted");
  return <>{children}</>;
};

export default ProtectedRoute;
