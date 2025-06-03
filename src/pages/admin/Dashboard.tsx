
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Music, DollarSign, FileText, Settings, 
  TrendingUp, AlertCircle, Eye, Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface DashboardStats {
  totalUsers: number;
  totalReleases: number;
  pendingReleases: number;
  totalEarnings: number;
  pendingWithdrawals: number;
  newUsersToday: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalReleases: 0,
    pendingReleases: 0,
    totalEarnings: 0,
    pendingWithdrawals: 0,
    newUsersToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch total releases
      const { count: totalReleases } = await supabase
        .from('releases')
        .select('*', { count: 'exact', head: true });

      // Fetch pending releases
      const { count: pendingReleases } = await supabase
        .from('releases')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch pending withdrawals
      const { count: pendingWithdrawals } = await supabase
        .from('withdrawal_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get new users today
      const today = new Date().toISOString().split('T')[0];
      const { count: newUsersToday } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      setStats({
        totalUsers: totalUsers || 0,
        totalReleases: totalReleases || 0,
        pendingReleases: pendingReleases || 0,
        totalEarnings: 0, // This would come from earnings calculations
        pendingWithdrawals: pendingWithdrawals || 0,
        newUsersToday: newUsersToday || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome to IND Distribution Admin Panel</p>
          </div>
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Quick Actions
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Users</p>
                  <h3 className="text-3xl font-bold text-blue-400">{stats.totalUsers}</h3>
                  <p className="text-xs text-gray-500 mt-1">+{stats.newUsersToday} today</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Releases</p>
                  <h3 className="text-3xl font-bold text-green-400">{stats.totalReleases}</h3>
                  <p className="text-xs text-gray-500 mt-1">{stats.pendingReleases} pending</p>
                </div>
                <Music className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending Withdrawals</p>
                  <h3 className="text-3xl font-bold text-yellow-400">{stats.pendingWithdrawals}</h3>
                  <p className="text-xs text-gray-500 mt-1">Requires review</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">System Status</p>
                  <h3 className="text-3xl font-bold text-green-400">Online</h3>
                  <p className="text-xs text-gray-500 mt-1">All systems operational</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="h-5 w-5 mr-2" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-400 text-sm">Manage user accounts, profiles, and permissions</p>
              <div className="flex space-x-2">
                <Link to="/admin/users">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Eye className="h-4 w-4 mr-2" />
                    View Users
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Music className="h-5 w-5 mr-2" />
                Music Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-400 text-sm">Review releases, approve content, manage catalog</p>
              <div className="flex space-x-2">
                <Link to="/admin/releases">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Eye className="h-4 w-4 mr-2" />
                    View Releases
                  </Button>
                </Link>
              </div>
              {stats.pendingReleases > 0 && (
                <Badge variant="secondary" className="mt-2">
                  {stats.pendingReleases} Pending Review
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Financial Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-400 text-sm">Handle withdrawals, earnings, and payments</p>
              <div className="flex space-x-2">
                <Link to="/admin/financials">
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                    <Eye className="h-4 w-4 mr-2" />
                    View Financials
                  </Button>
                </Link>
              </div>
              {stats.pendingWithdrawals > 0 && (
                <Badge variant="destructive" className="mt-2">
                  {stats.pendingWithdrawals} Pending
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Reports & Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-400 text-sm">Generate reports, view analytics, export data</p>
              <div className="flex space-x-2">
                <Link to="/admin/reports">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Eye className="h-4 w-4 mr-2" />
                    View Reports
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Support & Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-400 text-sm">Handle support tickets, copyright requests</p>
              <div className="flex space-x-2">
                <Link to="/admin/support">
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    <Eye className="h-4 w-4 mr-2" />
                    View Requests
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-400 text-sm">Configure platform settings and preferences</p>
              <div className="flex space-x-2">
                <Link to="/admin/settings">
                  <Button size="sm" className="bg-gray-600 hover:bg-gray-700">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
