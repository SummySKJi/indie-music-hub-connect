
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { 
  Music, Upload, Library, WalletIcon, Users, Ban, FileText, Youtube, User,
  ChevronDown, ChevronRight, Home, Settings, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // This would normally check if user is logged in
  const isLoggedIn = true; // In a real app, this would come from auth state
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview />;
      case "upload":
        return <UploadMusic />;
      case "releases":
        return <MyReleases />;
      case "wallet":
        return <WalletComponent />;
      case "management":
        return <Management />;
      case "takedown":
        return <TakedownRequest />;
      case "reports":
        return <RoyaltyReports />;
      case "oac":
        return <OfficialArtistChannel />;
      case "profile":
        return <CustomerProfile />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-gray-900 border-b border-gray-800 p-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Music className="h-6 w-6 text-purple-500" />
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              IND Distribution
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
          <Music className="h-8 w-8 text-purple-500" />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            IND Distribution
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-xs uppercase text-gray-500 font-semibold tracking-wider mb-2">
            Dashboard
          </h3>

          <Button
            variant={activeTab === "overview" ? "secondary" : "ghost"} 
            className={`w-full justify-start ${activeTab === "overview" ? "bg-gray-800" : "hover:bg-gray-800"} text-left`}
            onClick={() => setActiveTab("overview")}
          >
            <Home className="mr-2 h-4 w-4" />
            Overview
          </Button>

          <Button
            variant={activeTab === "upload" ? "secondary" : "ghost"} 
            className={`w-full justify-start ${activeTab === "upload" ? "bg-gray-800" : "hover:bg-gray-800"} text-left`}
            onClick={() => setActiveTab("upload")}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Music
          </Button>

          <Button
            variant={activeTab === "releases" ? "secondary" : "ghost"} 
            className={`w-full justify-start ${activeTab === "releases" ? "bg-gray-800" : "hover:bg-gray-800"} text-left`}
            onClick={() => setActiveTab("releases")}
          >
            <Library className="mr-2 h-4 w-4" />
            My Releases
          </Button>

          <Button
            variant={activeTab === "wallet" ? "secondary" : "ghost"} 
            className={`w-full justify-start ${activeTab === "wallet" ? "bg-gray-800" : "hover:bg-gray-800"} text-left`}
            onClick={() => setActiveTab("wallet")}
          >
            <WalletIcon className="mr-2 h-4 w-4" />
            Wallet / Earnings
          </Button>

          <Button
            variant={activeTab === "management" ? "secondary" : "ghost"} 
            className={`w-full justify-start ${activeTab === "management" ? "bg-gray-800" : "hover:bg-gray-800"} text-left`}
            onClick={() => setActiveTab("management")}
          >
            <Users className="mr-2 h-4 w-4" />
            Management
          </Button>

          <Button
            variant={activeTab === "takedown" ? "secondary" : "ghost"} 
            className={`w-full justify-start ${activeTab === "takedown" ? "bg-gray-800" : "hover:bg-gray-800"} text-left`}
            onClick={() => setActiveTab("takedown")}
          >
            <Ban className="mr-2 h-4 w-4" />
            Takedown Request
          </Button>

          <Button
            variant={activeTab === "reports" ? "secondary" : "ghost"} 
            className={`w-full justify-start ${activeTab === "reports" ? "bg-gray-800" : "hover:bg-gray-800"} text-left`}
            onClick={() => setActiveTab("reports")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Royalty Reports
          </Button>

          <Button
            variant={activeTab === "oac" ? "secondary" : "ghost"} 
            className={`w-full justify-start ${activeTab === "oac" ? "bg-gray-800" : "hover:bg-gray-800"} text-left`}
            onClick={() => setActiveTab("oac")}
          >
            <Youtube className="mr-2 h-4 w-4" />
            Official Artist Channel
          </Button>

          <Button
            variant={activeTab === "profile" ? "secondary" : "ghost"} 
            className={`w-full justify-start ${activeTab === "profile" ? "bg-gray-800" : "hover:bg-gray-800"} text-left`}
            onClick={() => setActiveTab("profile")}
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </div>

        <div className="pt-4 mt-8 border-t border-gray-800">
          <div className="flex items-center mb-4">
            <div className="bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">
              <span className="font-medium">JS</span>
            </div>
            <div>
              <p className="text-sm font-medium">John Smith</p>
              <p className="text-xs text-gray-400">john@example.com</p>
            </div>
          </div>
          
          <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800">
            <Settings className="mr-2 h-4 w-4" />
            Account Settings
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

// Dashboard Overview Component
const DashboardOverview = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Releases" 
          value="14" 
          description="Across all platforms"
          icon={<Music className="h-8 w-8 text-purple-500" />}
        />
        <StatsCard 
          title="Pending Reviews" 
          value="3" 
          description="Awaiting approval"
          icon={<Upload className="h-8 w-8 text-blue-500" />}
        />
        <StatsCard 
          title="Total Earnings" 
          value="₹12,480" 
          description="Lifetime earnings"
          icon={<WalletIcon className="h-8 w-8 text-green-500" />}
        />
        <StatsCard 
          title="Artist Profiles" 
          value="5" 
          description="Managed profiles"
          icon={<Users className="h-8 w-8 text-pink-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white text-xl">Recent Releases</CardTitle>
            <CardDescription className="text-gray-400">Your latest music uploads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Summer Vibes", artist: "DJ Groove", status: "Live", date: "2 days ago" },
                { title: "Midnight Dreams", artist: "Moonlight", status: "Pending", date: "1 week ago" },
                { title: "Urban Echo", artist: "City Sound", status: "Live", date: "2 weeks ago" }
              ].map((release, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center">
                      <Music className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-white">{release.title}</p>
                      <p className="text-sm text-gray-400">{release.artist}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      release.status === "Live" ? "bg-green-900 text-green-400" : "bg-yellow-900 text-yellow-400"
                    }`}>
                      {release.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{release.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="link" className="w-full mt-4 text-purple-400 hover:text-purple-300">
              View All Releases
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white text-xl">Recent Activities</CardTitle>
            <CardDescription className="text-gray-400">Latest actions on your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Song uploaded", details: "Midnight Dreams", time: "2 days ago" },
                { action: "Earnings deposited", details: "₹580 added to wallet", time: "1 week ago" },
                { action: "New artist created", details: "Added profile for 'DJ Groove'", time: "2 weeks ago" },
                { action: "Withdrawal requested", details: "₹1,200 to UPI", time: "3 weeks ago" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-white">{activity.action}</p>
                    <p className="text-sm text-gray-400">{activity.details}</p>
                  </div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
            <Button variant="link" className="w-full mt-4 text-purple-400 hover:text-purple-300">
              View All Activities
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
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

// Placeholder components for different sections
const UploadMusic = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
      Upload Music
    </h1>
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <p className="text-gray-400">Upload music form will be implemented here.</p>
    </div>
  </div>
);

const MyReleases = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
      My Releases
    </h1>
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <p className="text-gray-400">List of releases will be displayed here.</p>
    </div>
  </div>
);

// Renamed from "Wallet" to "WalletComponent" to avoid naming conflict
const WalletComponent = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
      Wallet / Earnings
    </h1>
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <p className="text-gray-400">Wallet and earnings information will be displayed here.</p>
    </div>
  </div>
);

const Management = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
      Management
    </h1>
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <p className="text-gray-400">Artist and label management will be implemented here.</p>
    </div>
  </div>
);

const TakedownRequest = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
      Takedown Request
    </h1>
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <p className="text-gray-400">Copyright removal/takedown request form will be implemented here.</p>
    </div>
  </div>
);

const RoyaltyReports = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
      Royalty Reports
    </h1>
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <p className="text-gray-400">Royalty and earnings reports will be displayed here.</p>
    </div>
  </div>
);

const OfficialArtistChannel = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
      Official Artist Channel
    </h1>
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <p className="text-gray-400">OAC request form will be implemented here.</p>
    </div>
  </div>
);

const CustomerProfile = () => (
  <div>
    <h1 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
      My Profile
    </h1>
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <p className="text-gray-400">User profile information and settings will be displayed here.</p>
    </div>
  </div>
);

export default Dashboard;
