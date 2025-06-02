
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

  console.log("🛡️ ProtectedRoute - Auth state:", { 
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
    return <Navigate to="/login" replace />;
  }

  // If this is an admin-only route, check admin status
  if (adminOnly && !isAdmin) {
    console.log("❌ Admin access required but user is not admin, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // If user is admin but trying to access regular routes, redirect to admin panel
  if (isAdmin && !adminOnly && location.pathname.startsWith('/admin') === false) {
    console.log("🔄 Admin user accessing regular route, allowing access");
  }

  console.log("✅ Access granted to:", user.email);
  return <>{children}</>;
};

export default ProtectedRoute;
