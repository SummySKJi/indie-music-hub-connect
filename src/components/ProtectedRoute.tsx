
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  console.log("🛡️ ProtectedRoute check:", { 
    user: !!user, 
    userEmail: user?.email,
    loading,
    isAdmin,
    adminOnly,
    currentPath: location.pathname
  });

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
    console.log("❌ No user found, redirecting to login");
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    console.log("❌ Admin access required but user is not admin");
    return <Navigate to="/dashboard" replace />;
  }

  console.log("✅ Access granted to:", user.email);
  return <>{children}</>;
};

export default ProtectedRoute;
