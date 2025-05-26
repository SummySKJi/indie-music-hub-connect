
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Music, Users, FileText, BarChart2, DollarSign, Shield, 
  Globe, Settings, ChevronDown, ChevronRight, Upload,
  UserCheck, Building2, CreditCard, Flag, Youtube, 
  AlertCircle, TrendingUp, Home, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const AdminSidebar = () => {
  const { signOut } = useAuth();
  const location = useLocation();
  const [musicManagementOpen, setMusicManagementOpen] = useState(false);
  const [requestsOpen, setRequestsOpen] = useState(false);

  const menuItems = [
    {
      title: "Dashboard",
      icon: BarChart2,
      path: "/admin/dashboard",
    },
    {
      title: "Music Management",
      icon: Music,
      isCollapsible: true,
      isOpen: musicManagementOpen,
      setIsOpen: setMusicManagementOpen,
      children: [
        { title: "Review Queue", path: "/admin/music/review-queue", icon: FileText },
        { title: "All Releases", path: "/admin/music/releases", icon: Music },
      ]
    },
    {
      title: "Customer Management",
      icon: Users,
      path: "/admin/customers",
    },
    {
      title: "Artist & Label Management",
      icon: Building2,
      path: "/admin/artists-labels",
    },
    {
      title: "Wallet & Payouts",
      icon: DollarSign,
      path: "/admin/wallet-payouts",
    },
    {
      title: "Requests Management",
      icon: AlertCircle,
      isCollapsible: true,
      isOpen: requestsOpen,
      setIsOpen: setRequestsOpen,
      children: [
        { title: "Copyright Removal", path: "/admin/requests/copyright", icon: Flag },
        { title: "OAC Requests", path: "/admin/requests/oac", icon: Youtube },
      ]
    },
    {
      title: "Royalty Reports",
      icon: TrendingUp,
      path: "/admin/royalty-reports",
    },
    {
      title: "Platform Management",
      icon: Globe,
      path: "/admin/platforms",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 text-white overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-8">
          <Shield className="h-8 w-8 text-red-500" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            IND Admin
          </h1>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.isCollapsible ? (
                <Collapsible open={item.isOpen} onOpenChange={item.setIsOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-white hover:bg-gray-700 hover:text-white"
                    >
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.title}</span>
                      </div>
                      {item.isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 ml-4">
                    {item.children?.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                          isActive(child.path)
                            ? "bg-red-600 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        <child.icon className="h-4 w-4 mr-2" />
                        {child.title}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link
                  to={item.path!}
                  className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive(item.path!)
                      ? "bg-red-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button 
            variant="outline" 
            className="w-full border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
