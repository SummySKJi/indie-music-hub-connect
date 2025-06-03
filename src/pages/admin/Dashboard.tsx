
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Music, DollarSign, FileText, Settings, 
  TrendingUp, AlertCircle, Eye, Plus, UserCheck, Building,
  Flag, Youtube, Upload, Activity, Calendar
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";

interface DashboardStats {
  totalCustomers: number;
  totalReleases: number;
  totalArtists: number;
  totalLabels: number;
  pendingReleases: number;
  pendingWithdrawals: number;
  pendingCopyright: number;
  pendingOAC: number;
  newCustomersToday: number;
  totalEarnings: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalReleases: 0,
    totalArtists: 0,
    totalLabels: 0,
    pendingReleases: 0,
    pendingWithdrawals: 0,
    pendingCopyright: 0,
    pendingOAC: 0,
    newCustomersToday: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch total customers
      const { count: totalCustomers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch total releases
      const { count: totalReleases } = await supabase
        .from('releases')
        .select('*', { count: 'exact', head: true });

      // Fetch total artists
      const { count: totalArtists } = await supabase
        .from('artists')
        .select('*', { count: 'exact', head: true });

      // Fetch total labels
      const { count: totalLabels } = await supabase
        .from('labels')
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

      // Fetch pending copyright requests
      const { count: pendingCopyright } = await supabase
        .from('takedown_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch pending OAC requests
      const { count: pendingOAC } = await supabase
        .from('oac_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get new customers today
      const today = new Date().toISOString().split('T')[0];
      const { count: newCustomersToday } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      setStats({
        totalCustomers: totalCustomers || 0,
        totalReleases: totalReleases || 0,
        totalArtists: totalArtists || 0,
        totalLabels: totalLabels || 0,
        pendingReleases: pendingReleases || 0,
        pendingWithdrawals: pendingWithdrawals || 0,
        pendingCopyright: pendingCopyright || 0,
        pendingOAC: pendingOAC || 0,
        newCustomersToday: newCustomersToday || 0,
        totalEarnings: 0, // This would come from earnings calculations
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
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-white">Loading admin dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Complete overview of IND Distribution platform</p>
          </div>
          <Button className="bg-red-600 hover:bg-red-700">
            <Activity className="h-4 w-4 mr-2" />
            View Activity Log
          </Button>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Customers</p>
                  <h3 className="text-3xl font-bold text-blue-400">{stats.totalCustomers}</h3>
                  <p className="text-xs text-gray-500 mt-1">+{stats.newCustomersToday} today</p>
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
                  <p className="text-sm text-gray-400">Artists</p>
                  <h3 className="text-3xl font-bold text-purple-400">{stats.totalArtists}</h3>
                  <p className="text-xs text-gray-500 mt-1">Active profiles</p>
                </div>
                <UserCheck className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Labels</p>
                  <h3 className="text-3xl font-bold text-orange-400">{stats.totalLabels}</h3>
                  <p className="text-xs text-gray-500 mt-1">Active labels</p>
                </div>
                <Building className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending Reviews</p>
                  <h3 className="text-2xl font-bold text-yellow-400">{stats.pendingReleases}</h3>
                </div>
                <Music className="h-6 w-6 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending Withdrawals</p>
                  <h3 className="text-2xl font-bold text-red-400">{stats.pendingWithdrawals}</h3>
                </div>
                <DollarSign className="h-6 w-6 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Copyright Requests</p>
                  <h3 className="text-2xl font-bold text-pink-400">{stats.pendingCopyright}</h3>
                </div>
                <Flag className="h-6 w-6 text-pink-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">OAC Requests</p>
                  <h3 className="text-2xl font-bold text-cyan-400">{stats.pendingOAC}</h3>
                </div>
                <Youtube className="h-6 w-6 text-cyan-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Management Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Music className="h-5 w-5 mr-2" />
                Music Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-400 text-sm">Review pending music submissions and manage releases</p>
              <div className="flex space-x-2">
                <Link to="/admin/music-review">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Eye className="h-4 w-4 mr-2" />
                    Review Queue
                  </Button>
                </Link>
              </div>
              {stats.pendingReleases > 0 && (
                <Badge variant="destructive" className="mt-2">
                  {stats.pendingReleases} Pending
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Customer Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-400 text-sm">Manage customer accounts and profiles</p>
              <div className="flex space-x-2">
                <Link to="/admin/customers">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Eye className="h-4 w-4 mr-2" />
                    View Customers
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Wallet & Payouts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-400 text-sm">Process withdrawal requests and manage earnings</p>
              <div className="flex space-x-2">
                <Link to="/admin/payouts">
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                    <Eye className="h-4 w-4 mr-2" />
                    Manage Payouts
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
                <UserCheck className="h-5 w-5 mr-2" />
                Artist & Label Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-400 text-sm">Manage artist profiles and record labels</p>
              <div className="flex space-x-2">
                <Link to="/admin/artists">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Eye className="h-4 w-4 mr-2" />
                    Artists
                  </Button>
                </Link>
                <Link to="/admin/labels">
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    <Eye className="h-4 w-4 mr-2" />
                    Labels
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Flag className="h-5 w-5 mr-2" />
                Request Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-400 text-sm">Handle copyright and OAC requests</p>
              <div className="flex space-x-2">
                <Link to="/admin/copyright">
                  <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                    <Flag className="h-4 w-4 mr-2" />
                    Copyright
                  </Button>
                </Link>
                <Link to="/admin/oac">
                  <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                    <Youtube className="h-4 w-4 mr-2" />
                    OAC
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Royalty Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-400 text-sm">Upload and manage royalty reports</p>
              <div className="flex space-x-2">
                <Link to="/admin/royalty-upload">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Reports
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Platform Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">{stats.totalReleases}</div>
                <div className="text-gray-400">Total Releases</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">{stats.totalCustomers}</div>
                <div className="text-gray-400">Active Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">250+</div>
                <div className="text-gray-400">Distribution Platforms</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">100%</div>
                <div className="text-gray-400">Rights Retained</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
