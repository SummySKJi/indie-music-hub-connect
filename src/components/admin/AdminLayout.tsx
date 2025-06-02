
import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  Music, 
  UserCheck, 
  Building, 
  DollarSign, 
  FileText, 
  Flag, 
  Youtube, 
  Settings, 
  LogOut,
  Menu,
  X,
  Shield
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "User Management", path: "/admin/users" },
    { icon: Music, label: "Music Management", path: "/admin/releases" },
    { icon: UserCheck, label: "Artist Management", path: "/admin/artists" },
    { icon: Building, label: "Label Management", path: "/admin/labels" },
    { icon: DollarSign, label: "Financials", path: "/admin/financials" },
    { icon: FileText, label: "Royalty Reports", path: "/admin/royalty-reports" },
    { icon: Flag, label: "Copyright Requests", path: "/admin/copyright-requests" },
    { icon: Youtube, label: "OAC Requests", path: "/admin/oac-requests" },
    { icon: Settings, label: "Platform Settings", path: "/admin/settings" },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-red-500" />
            <span className="text-xl font-bold text-white">Admin Panel</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Top bar */}
        <div className="bg-gray-800 shadow-lg">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-white"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="hidden lg:block">
                <h1 className="text-xl font-semibold text-white">
                  IND Distribution - Admin Panel
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <Link to="/" className="text-sm text-gray-300 hover:text-white">
                  View Customer Site
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
