
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Music, Users, FileText, BarChart2, DollarSign, Shield, Globe, Settings, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReleases: 0,
    pendingReleases: 0,
    totalArtists: 0,
    totalLabels: 0,
    totalWithdrawals: 0,
    totalOacRequests: 0,
    totalTakedownRequests: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin/login");
      toast({
        title: "Access Denied",
        description: "You don't have administrator privileges.",
        variant: "destructive",
      });
      return;
    }

    const fetchAdminData = async () => {
      try {
        // Mock statistics data for development
        const mockStats = {
          totalUsers: 250,
          totalReleases: 1250,
          pendingReleases: 48,
          totalArtists: 520,
          totalLabels: 125,
          totalWithdrawals: 15,
          totalOacRequests: 8,
          totalTakedownRequests: 3
        };
        
        setStats(mockStats);
      } catch (error: any) {
        console.error("Error fetching admin dashboard data:", error);
        toast({
          title: "Failed to load data",
          description: error.message || "Could not load admin dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-white">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Welcome back, Administrator</p>
          </div>
          <div className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleString()}
          </div>
        </header>
        
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Users</p>
                  <h3 className="text-3xl font-bold text-white">{stats.totalUsers}</h3>
                </div>
                <Users className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Artists</p>
                  <h3 className="text-3xl font-bold text-white">{stats.totalArtists}</h3>
                </div>
                <Music className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Releases</p>
                  <h3 className="text-3xl font-bold text-white">{stats.totalReleases}</h3>
                </div>
                <FileText className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Labels</p>
                  <h3 className="text-3xl font-bold text-white">{stats.totalLabels}</h3>
                </div>
                <Globe className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Pending Items */}
        <h2 className="text-xl font-bold text-white mb-4">Pending Approvals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">Releases</CardTitle>
              <CardDescription className="text-gray-400">New releases waiting for approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{stats.pendingReleases}</span>
                <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => navigate("/admin/music/review-queue")}>
                  Review
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">Withdrawals</CardTitle>
              <CardDescription className="text-gray-400">Withdrawal requests pending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{stats.totalWithdrawals}</span>
                <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => navigate("/admin/wallet-payouts")}>
                  Review
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">OAC Requests</CardTitle>
              <CardDescription className="text-gray-400">Official Artist Channel requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{stats.totalOacRequests}</span>
                <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => navigate("/admin/requests/oac")}>
                  Review
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">Takedowns</CardTitle>
              <CardDescription className="text-gray-400">Copyright removal requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{stats.totalTakedownRequests}</span>
                <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => navigate("/admin/requests/copyright")}>
                  Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-700">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center mr-3">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">New Release Submitted</h4>
                    <p className="text-sm text-gray-400">Artist submitted a new single for review</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">2 mins ago</span>
              </div>
              
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">New User Registration</h4>
                    <p className="text-sm text-gray-400">New user joined the platform</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">1 hour ago</span>
              </div>
              
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center mr-3">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Withdrawal Request</h4>
                    <p className="text-sm text-gray-400">User requested a withdrawal of ₹2,500</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">3 hours ago</span>
              </div>
              
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">OAC Request</h4>
                    <p className="text-sm text-gray-400">Artist requested Official Artist Channel</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">5 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
