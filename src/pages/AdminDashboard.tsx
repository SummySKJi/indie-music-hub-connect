
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Music, Users, FileText, BarChart2, DollarSign, Shield, Globe, Settings, AlertCircle, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalUsers: number;
  totalReleases: number;
  pendingReleases: number;
  totalArtists: number;
  totalLabels: number;
  pendingWithdrawals: number;
  pendingOacRequests: number;
  pendingTakedownRequests: number;
  totalEarnings: number;
  liveReleases: number;
}

interface RecentActivity {
  id: string;
  type: 'release' | 'user' | 'withdrawal' | 'oac' | 'takedown';
  title: string;
  description: string;
  timestamp: string;
  user_email?: string;
}

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalReleases: 0,
    pendingReleases: 0,
    totalArtists: 0,
    totalLabels: 0,
    pendingWithdrawals: 0,
    pendingOacRequests: 0,
    pendingTakedownRequests: 0,
    totalEarnings: 0,
    liveReleases: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
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

    fetchDashboardData();
  }, [isAdmin, navigate]);

  const fetchDashboardData = async () => {
    try {
      // Fetch all stats in parallel
      const [
        profilesResult,
        releasesResult,
        artistsResult,
        labelsResult,
        withdrawalsResult,
        oacResult,
        takedownResult,
        walletResult
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('releases').select('id, status, created_at', { count: 'exact' }),
        supabase.from('artists').select('id', { count: 'exact' }),
        supabase.from('labels').select('id', { count: 'exact' }),
        supabase.from('withdrawal_requests').select('id, status, amount', { count: 'exact' }),
        supabase.from('oac_requests').select('id, status, created_at', { count: 'exact' }),
        supabase.from('takedown_requests').select('id, status, created_at', { count: 'exact' }),
        supabase.from('wallet').select('balance')
      ]);

      // Calculate stats
      const totalUsers = profilesResult.count || 0;
      const allReleases = releasesResult.data || [];
      const totalReleases = releasesResult.count || 0;
      const pendingReleases = allReleases.filter(r => r.status === 'pending').length;
      const liveReleases = allReleases.filter(r => r.status === 'approved' || r.status === 'live').length;
      
      const totalArtists = artistsResult.count || 0;
      const totalLabels = labelsResult.count || 0;
      
      const allWithdrawals = withdrawalsResult.data || [];
      const pendingWithdrawals = allWithdrawals.filter(w => w.status === 'pending').length;
      
      const allOac = oacResult.data || [];
      const pendingOacRequests = allOac.filter(o => o.status === 'pending').length;
      
      const allTakedowns = takedownResult.data || [];
      const pendingTakedownRequests = allTakedowns.filter(t => t.status === 'pending').length;
      
      const wallets = walletResult.data || [];
      const totalEarnings = wallets.reduce((sum, wallet) => sum + (parseFloat(wallet.balance) || 0), 0);

      setStats({
        totalUsers,
        totalReleases,
        pendingReleases,
        totalArtists,
        totalLabels,
        pendingWithdrawals,
        pendingOacRequests,
        pendingTakedownRequests,
        totalEarnings,
        liveReleases
      });

      // Generate recent activity from real data
      const activities: RecentActivity[] = [];
      
      // Recent releases
      const recentReleases = allReleases
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3);
      
      recentReleases.forEach(release => {
        activities.push({
          id: release.id,
          type: 'release',
          title: 'New Release Submitted',
          description: `Release status: ${release.status}`,
          timestamp: new Date(release.created_at).toLocaleString()
        });
      });

      // Recent OAC requests
      const recentOac = allOac
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 2);
      
      recentOac.forEach(oac => {
        activities.push({
          id: oac.id,
          type: 'oac',
          title: 'OAC Request Submitted',
          description: `Status: ${oac.status}`,
          timestamp: new Date(oac.created_at).toLocaleString()
        });
      });

      // Recent takedown requests
      const recentTakedowns = allTakedowns
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 2);
      
      recentTakedowns.forEach(takedown => {
        activities.push({
          id: takedown.id,
          type: 'takedown',
          title: 'Copyright Takedown Request',
          description: `Status: ${takedown.status}`,
          timestamp: new Date(takedown.created_at).toLocaleString()
        });
      });

      // Sort all activities by timestamp
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(activities.slice(0, 5));

    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Failed to load data",
        description: error.message || "Could not load admin dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'release':
        return <Music className="h-5 w-5 text-white" />;
      case 'user':
        return <Users className="h-5 w-5 text-white" />;
      case 'withdrawal':
        return <DollarSign className="h-5 w-5 text-white" />;
      case 'oac':
        return <Shield className="h-5 w-5 text-white" />;
      case 'takedown':
        return <AlertCircle className="h-5 w-5 text-white" />;
      default:
        return <FileText className="h-5 w-5 text-white" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'release':
        return 'bg-red-600';
      case 'user':
        return 'bg-orange-600';
      case 'withdrawal':
        return 'bg-green-600';
      case 'oac':
        return 'bg-blue-600';
      case 'takedown':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

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
                  <p className="text-sm text-gray-400">Total Customers</p>
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
                  <p className="text-sm text-gray-400">Total Labels</p>
                  <h3 className="text-3xl font-bold text-white">{stats.totalLabels}</h3>
                </div>
                <Building2 className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Live Releases</p>
                  <h3 className="text-2xl font-bold text-green-400">{stats.liveReleases}</h3>
                </div>
                <Globe className="h-6 w-6 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Earnings Pool</p>
                  <h3 className="text-2xl font-bold text-yellow-400">₹{stats.totalEarnings.toLocaleString()}</h3>
                </div>
                <DollarSign className="h-6 w-6 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="text-center">
                <Button 
                  onClick={() => fetchDashboardData()} 
                  className="bg-red-600 hover:bg-red-700"
                >
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Pending Items */}
        <h2 className="text-xl font-bold text-white mb-4">Pending Approvals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">Music Reviews</CardTitle>
              <CardDescription className="text-gray-400">Releases awaiting approval</CardDescription>
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
              <CardDescription className="text-gray-400">Pending payout requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{stats.pendingWithdrawals}</span>
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
                <span className="text-2xl font-bold text-white">{stats.pendingOacRequests}</span>
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
                <span className="text-2xl font-bold text-white">{stats.pendingTakedownRequests}</span>
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
            {recentActivity.length > 0 ? (
              <div className="divide-y divide-gray-700">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center mr-3`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{activity.title}</h4>
                        <p className="text-sm text-gray-400">{activity.description}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">{activity.timestamp}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-400">No recent activity found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
