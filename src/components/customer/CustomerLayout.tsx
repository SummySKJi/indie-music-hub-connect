
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Upload,
  Music,
  Wallet,
  Building2,
  Flag,
  FileText,
  Youtube,
  User,
  LogOut,
  Menu,
} from "lucide-react";

const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      title: "Upload Music",
      icon: Upload,
      path: "/upload-music",
    },
    {
      title: "My Releases",
      icon: Music,
      path: "/my-releases",
    },
    {
      title: "Wallet & Earnings",
      icon: Wallet,
      path: "/wallet",
    },
    {
      title: "Management",
      icon: Building2,
      path: "/management",
    },
    {
      title: "Copyright Removal",
      icon: Flag,
      path: "/copyright-removal",
    },
    {
      title: "Royalty Reports",
      icon: FileText,
      path: "/royalty-reports",
    },
    {
      title: "OAC Requests",
      icon: Youtube,
      path: "/oac-requests",
    },
    {
      title: "Profile",
      icon: User,
      path: "/profile",
    },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-900">
        <Sidebar className="border-r border-gray-700">
          <SidebarHeader className="p-4">
            <div className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-purple-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                IND Distribution
              </span>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                  >
                    <Link to={item.path} className="flex items-center space-x-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                {user?.email}
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
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-gray-700 flex items-center px-6 bg-gray-800">
            <SidebarTrigger className="text-white" />
            <div className="flex-1" />
          </header>
          
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CustomerLayout;
