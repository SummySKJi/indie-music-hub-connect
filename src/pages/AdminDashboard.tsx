
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Music, Users, FileText, BarChart2, DollarSign, Shield, Globe, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user, isAdmin, signOut } = useAuth();
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
        // Fetch users count
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (usersError) throw usersError;

        // Fetch total releases
        const { count: releasesCount, error: releasesError } = await supabase
          .from('releases')
          .select('*', { count: 'exact', head: true });

        if (releasesError) throw releasesError;

        // Fetch pending releases
        const { count: pendingReleasesCount, error: pendingError } = await supabase
          .from('releases')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        if (pendingError) throw pendingError;

        // Fetch artists count
        const { count: artistsCount, error: artistsError } = await supabase
          .from('artists')
          .select('*', { count: 'exact', head: true });

        if (artistsError) throw artistsError;

        // Fetch labels count
        const { count: labelsCount, error: labelsError } = await supabase
          .from('labels')
          .select('*', { count: 'exact', head: true });

        if (labelsError) throw labelsError;

        // Fetch pending withdrawal requests
        const { count: withdrawalsCount, error: withdrawalsError } = await supabase
          .from('withdrawal_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        if (withdrawalsError) throw withdrawalsError;

        // Fetch pending OAC requests
        const { count: oacCount, error: oacError } = await supabase
          .from('oac_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        if (oacError) throw oacError;

        // Fetch pending takedown requests
        const { count: takedownCount, error: takedownError } = await supabase
          .from('takedown_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        if (takedownError) throw takedownError;

        setStats({
          totalUsers: usersCount || 0,
          totalReleases: releasesCount || 0,
          pendingReleases: pendingReleasesCount || 0,
          totalArtists: artistsCount || 0,
          totalLabels: labelsCount || 0,
          totalWithdrawals: withdrawalsCount || 0,
          totalOacRequests: oacCount || 0,
          totalTakedownRequests: takedownCount || 0
        });

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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 p-4 hidden lg:block">
        <div className="flex items-center space-x-2 mb-8">
          <Music className="h-8 w-8 text-red-500" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">IND Admin</h1>
        </div>
        
        <nav className="space-y-1">
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-700">
            <BarChart2 className="h-5 w-5 mr-3" /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700">
            <FileText className="h-5 w-5 mr-3" /> Releases
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700">
            <Users className="h-5 w-5 mr-3" /> Users
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700">
            <Music className="h-5 w-5 mr-3" /> Artists
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700">
            <DollarSign className="h-5 w-5 mr-3" /> Payments
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700">
            <Shield className="h-5 w-5 mr-3" /> OAC Requests
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700">
            <Shield className="h-5 w-5 mr-3" /> Takedowns
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700">
            <Globe className="h-5 w-5 mr-3" /> Platforms
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700">
            <Settings className="h-5 w-5 mr-3" /> Settings
          </Button>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button 
            variant="outline" 
            className="w-full border-gray-600 text-gray-400 hover:text-white"
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 p-6">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <div className="text-sm text-gray-400">
            Welcome, Admin
          </div>
        </header>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <h2 className="text-xl font-bold mb-4">Pending Approvals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">Releases</CardTitle>
              <CardDescription className="text-gray-400">New releases waiting for approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{stats.pendingReleases}</span>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
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
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
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
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-700">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center mr-3">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">New Release Submitted</h4>
                    <p className="text-sm text-gray-400">Artist submitted a new single</p>
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
    </div>
  );
};

export default AdminDashboard;
