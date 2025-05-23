
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { 
  Music, Users, Inbox, FileSpreadsheet, Ban, Youtube, FileText, 
  Database, Settings, Menu, X, Layout, CreditCard, Bell, User, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // This would normally check if admin is logged in
  const isAdminLoggedIn = true; // In a real app, this would come from auth state
  
  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" />;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview />;
      case "music":
        return <MusicManagement />;
      case "customers":
        return <CustomerManagement />;
      case "artists":
        return <ArtistLabelManagement />;
      case "payouts":
        return <PayoutManagement />;
      case "copyright":
        return <CopyrightRequests />;
      case "oac":
        return <OACRequests />;
      case "reports":
        return <RoyaltyReportUpload />;
      case "platforms":
        return <PlatformManagement />;
      case "settings":
        return <AdminSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-gray-900 border-b border-gray-800 p-4">
        <div className="flex justify-between items-center">
          <Link to="/admin" className="flex items-center space-x-2">
            <Music className="h-6 w-6 text-red-500" />
            <span className="text-lg font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              IND Admin
            </span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="text-white"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div 
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } md:block bg-gray-900 border-r border-gray-800 w-full md:w-64 p-6 space-y-8 absolute md:relative z-10 top-16 md:top-0 h-[calc(100vh-4rem)] md:h-screen overflow-y-auto`}
      >
        <div className="hidden md:flex items-center space-x-2 mb-8">
          <Music className="h-8 w-8 text-red-500" />
          <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            IND Admin
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-xs uppercase text-gray-500 font-semibold tracking-wider mb-2">
            Management
          </h3>

          <Button
            variant={activeTab === "overview" ? "secondary" : "ghost"} 
            className={`w-full justify-start ${activeTab === "overview" ? "bg-gray-800" : "hover:bg-gray-800"} text-left`}
            onClick={() => setActiveTab("overview")}
          >
            <Layout className="mr-2 h-4 w-4" />
            Dashboard
          </Button>

          <Button
            variant={activeTab === "music" ? "secondary" : "ghost"} 
            className={`w-full justify-start ${activeTab === "music" ? "bg-gray-800" : "hover:bg-gray-800"} text-left`}
            onClick={() => setActiveTab("music")}
          >
            <Music className="mr-2 h-4 w-4" />
            Music Management
          </Button>

          <Button
            variant={activeTab === "customers" ? "secondary" : "ghost"} 
            className={`w-full justify-start ${activeTab === "customers" ? "bg-gray-800" : "hover:bg-gray-800"} text-left`}
            onClick={() => setActiveTab("customers")}
          >
            <Users className="mr-2 h-4 w-4" />
            Customer Management
          </Button>

          <Button
            variant={activeTab === "artists" ? "secondary" : "ghost"} 
            className={`w-full justify-start ${activeTab === "artists" ? "bg-gray-800" : "hover:bg-gray-800"} text-left`}
            onClick={() => setActiveTab("artists")}
          >
            <Inbox className="mr-2 h-4 w-4" />
            Artist & Label Management
          </Button>

          <Button
            variant={activeTab === "payouts" ? "secondary" : "ghost"} 
            className={`w-full justify-start ${activeTab === "payouts" ? "bg-gray-800" : "hover:bg-gray-800"} text-left`}
            onClick={() => setActiveTab("payouts")}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Wallet & Payout Management
          </Button>

          <h3 className="text-xs uppercase text-gray-500 font-semibold tracking-wider mb-2 mt-6">
            Requests
          </h3>

          <Button
            variant={activeTab === "copyright" ? "secondary" : "ghost"} 
            className={`w-full justify-start ${activeTab === "copyright" ? "bg-gray-800" : "hover:bg-gray-800"} text-left`}
            onClick={() => setActiveTab("copyright")}
          >
            <Ban className="mr-2 h-4 w-4" />
            Copyright Removal
          </Button>

          <Button
            variant={activeTab === "oac" ? "secondary" : "ghost"} 
            className={`w-full justify-start ${activeTab === "oac" ? "bg-gray-800" : "hover:bg-gray-800"} text-left`}
            onClick={() => setActiveTab("oac")}
          >
            <Youtube className="mr-2 h-4 w-4" />
            OAC Requests
          </Button>

          <h3 className="text-xs uppercase text-gray-500 font-semibold tracking-wider mb-2 mt-6">
            System
          </h3>

          <Button
            variant={activeTab === "reports" ? "secondary" : "ghost"} 
            className={`w-full justify-start ${activeTab === "reports" ? "bg-gray-800" : "hover:bg-gray-800"} text-left`}
            onClick={() => setActiveTab("reports")}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Royalty Report Upload
          </Button>

          <Button
            variant={activeTab === "platforms" ? "secondary" : "ghost"} 
            className={`w-full justify-start ${activeTab === "platforms" ? "bg-gray-800" : "hover:bg-gray-800"} text-left`}
            onClick={() => setActiveTab("platforms")}
          >
            <Database className="mr-2 h-4 w-4" />
            Platform Management
          </Button>

          <Button
            variant={activeTab === "settings" ? "secondary" : "ghost"} 
            className={`w-full justify-start ${activeTab === "settings" ? "bg-gray-800" : "hover:bg-gray-800"} text-left`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>

        <div className="pt-4 mt-8 border-t border-gray-800">
          <div className="flex items-center mb-4">
            <div className="bg-red-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">
              <span className="font-medium">A</span>
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-400">admin@mdi.in</p>
            </div>
          </div>
          
          <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 bg-gray-950 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

// Admin Overview Component
const AdminOverview = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <div className="flex space-x-2">
          <Button size="icon" variant="ghost" className="rounded-full text-gray-400 hover:text-white">
            <Bell size={18} />
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full text-gray-400 hover:text-white">
            <User size={18} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Customers" 
          value="248" 
          description="Active users"
          icon={<Users className="h-8 w-8 text-blue-500" />}
        />
        <StatsCard 
          title="Pending Reviews" 
          value="42" 
          description="Music submissions"
          icon={<Music className="h-8 w-8 text-purple-500" />}
        />
        <StatsCard 
          title="Withdrawal Requests" 
          value="18" 
          description="Pending payouts"
          icon={<CreditCard className="h-8 w-8 text-green-500" />}
        />
        <StatsCard 
          title="Total Releases" 
          value="1,254" 
          description="Across all platforms"
          icon={<FileText className="h-8 w-8 text-orange-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center justify-between">
              <span>Recent Music Submissions</span>
              <Badge value="42" />
            </CardTitle>
            <CardDescription className="text-gray-400">Music awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Sunshine Boulevard", artist: "Summer Beats", status: "Pending", time: "2 hours ago" },
                { title: "Moonlight Sonata Remix", artist: "DJ Classical", status: "Pending", time: "5 hours ago" },
                { title: "Urban Echoes", artist: "City Sounds", status: "Pending", time: "1 day ago" }
              ].map((submission, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center">
                      <Music className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-white">{submission.title}</p>
                      <p className="text-sm text-gray-400">{submission.artist}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-900 text-yellow-400">
                      {submission.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{submission.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="link" className="w-full mt-4 text-red-400 hover:text-red-300">
              View All Submissions
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center justify-between">
              <span>Pending Requests</span>
              <div className="flex gap-2">
                <Badge value="18" color="green" />
                <Badge value="12" color="purple" />
                <Badge value="8" color="orange" />
              </div>
            </CardTitle>
            <CardDescription className="text-gray-400">Awaiting administrator action</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <RequestItem 
                title="Withdrawal Request" 
                description="₹12,500 to UPI ID" 
                user="Rhythm Records"
                time="3 hours ago"
                type="payout"
              />
              <RequestItem 
                title="Copyright Removal" 
                description="YouTube video takedown request" 
                user="Beats Production"
                time="1 day ago"
                type="copyright"
              />
              <RequestItem 
                title="OAC Request" 
                description="Official Artist Channel setup" 
                user="DJ Grooves"
                time="2 days ago"
                type="oac"
              />
            </div>
            <Button variant="link" className="w-full mt-4 text-red-400 hover:text-red-300">
              View All Requests
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-white text-xl">Recent Activities</CardTitle>
          <CardDescription className="text-gray-400">System activities log</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs uppercase bg-gray-800 text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3 rounded-l-lg">Action</th>
                  <th scope="col" className="px-6 py-3">User</th>
                  <th scope="col" className="px-6 py-3">Details</th>
                  <th scope="col" className="px-6 py-3 rounded-r-lg">Time</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-800 border-b border-gray-700">
                  <td className="px-6 py-4 font-medium text-white">Release Approved</td>
                  <td className="px-6 py-4">Admin</td>
                  <td className="px-6 py-4">"Sunset Dreams" by Summer Vibes</td>
                  <td className="px-6 py-4">1 hour ago</td>
                </tr>
                <tr className="bg-gray-800 border-b border-gray-700">
                  <td className="px-6 py-4 font-medium text-white">Payment Processed</td>
                  <td className="px-6 py-4">Admin</td>
                  <td className="px-6 py-4">₹8,500 to Moonlight Records</td>
                  <td className="px-6 py-4">3 hours ago</td>
                </tr>
                <tr className="bg-gray-800">
                  <td className="px-6 py-4 font-medium text-white">New Customer</td>
                  <td className="px-6 py-4">System</td>
                  <td className="px-6 py-4">Urban Beats registered</td>
                  <td className="px-6 py-4">1 day ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Badge Component
const Badge = ({ value, color = "yellow" }: { value: string, color?: string }) => {
  const colorClasses: Record<string, string> = {
    yellow: "bg-yellow-900 text-yellow-400",
    green: "bg-green-900 text-green-400",
    purple: "bg-purple-900 text-purple-400",
    orange: "bg-orange-900 text-orange-400",
  };
  
  return (
    <span className={`${colorClasses[color]} text-xs font-medium px-2.5 py-1 rounded-full`}>
      {value}
    </span>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, description, icon }: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ReactNode;
}) => {
  return (
    <Card className="bg-gray-900 border-gray-800 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Request Item Component
const RequestItem = ({ title, description, user, time, type }: {
  title: string;
  description: string;
  user: string;
  time: string;
  type: 'payout' | 'copyright' | 'oac';
}) => {
  const icons = {
    payout: <CreditCard className="h-6 w-6 text-green-400" />,
    copyright: <Ban className="h-6 w-6 text-red-400" />,
    oac: <Youtube className="h-6 w-6 text-purple-400" />
  };
  
  return (
    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center">
          {icons[type]}
        </div>
        <div className="ml-4">
          <p className="font-medium text-white">{title}</p>
          <p className="text-sm text-gray-400">{description}</p>
          <p className="text-xs text-gray-500">By {user}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500">{time}</p>
        <Button variant="outline" size="sm" className="mt-1 h-7 border-gray-700 hover:bg-gray-700">
          Review
        </Button>
      </div>
    </div>
  );
};

// Placeholder components for different sections
const MusicManagement = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
      Music Management
    </h1>
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <p className="text-gray-400">Music review and management interface will be implemented here.</p>
    </div>
  </div>
);

const CustomerManagement = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
      Customer Management
    </h1>
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <p className="text-gray-400">Customer management interface will be implemented here.</p>
    </div>
  </div>
);

const ArtistLabelManagement = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
      Artist & Label Management
    </h1>
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <p className="text-gray-400">Artist and label management interface will be implemented here.</p>
    </div>
  </div>
);

const PayoutManagement = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
      Wallet & Payout Management
    </h1>
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <p className="text-gray-400">Wallet and payout management interface will be implemented here.</p>
    </div>
  </div>
);

const CopyrightRequests = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
      Copyright Removal Requests
    </h1>
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <p className="text-gray-400">Copyright removal request management interface will be implemented here.</p>
    </div>
  </div>
);

const OACRequests = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
      OAC Requests
    </h1>
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <p className="text-gray-400">Official Artist Channel request management interface will be implemented here.</p>
    </div>
  </div>
);

const RoyaltyReportUpload = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
      Royalty Report Upload
    </h1>
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <p className="text-gray-400">Royalty report upload interface will be implemented here.</p>
    </div>
  </div>
);

const PlatformManagement = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
      Platform Management
    </h1>
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <p className="text-gray-400">Distribution platform management interface will be implemented here.</p>
    </div>
  </div>
);

const AdminSettings = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
      Settings
    </h1>
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <p className="text-gray-400">Admin settings interface will be implemented here.</p>
    </div>
  </div>
);

export default AdminDashboard;
