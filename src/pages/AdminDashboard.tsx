
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Music, Users, FileText, BarChart2, DollarSign, Shield, Globe, Settings, AlertCircle, Building2, Play, Eye, Edit, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

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

interface CustomerData {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  release_count: number;
  wallet_balance: number;
}

interface RecentRelease {
  id: string;
  song_name: string;
  artist_name: string;
  status: string;
  created_at: string;
  user_email: string;
  type: string;
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
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [recentReleases, setRecentReleases] = useState<RecentRelease[]>([]);
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
      setLoading(true);
      console.log("Starting dashboard data fetch...");

      // Fetch all customer profiles with comprehensive data
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log("Fetched profiles:", profiles?.length || 0);

      // Fetch all releases with comprehensive data
      const { data: releases, error: releasesError } = await supabase
        .from('releases')
        .select('*')
        .order('created_at', { ascending: false });

      if (releasesError) {
        console.error('Error fetching releases:', releasesError);
        throw releasesError;
      }

      console.log("Fetched releases:", releases?.length || 0);

      // Fetch artists, labels, and other data
      const [
        { data: artists, error: artistsError },
        { data: labels, error: labelsError },
        { data: withdrawals, error: withdrawalsError },
        { data: oacRequests, error: oacError },
        { data: takedownRequests, error: takedownError },
        { data: wallets, error: walletsError }
      ] = await Promise.all([
        supabase.from('artists').select('id'),
        supabase.from('labels').select('id'),
        supabase.from('withdrawal_requests').select('id, status, amount'),
        supabase.from('oac_requests').select('id, status'),
        supabase.from('takedown_requests').select('id, status'),
        supabase.from('wallet').select('balance, user_id')
      ]);

      // Process customer data with release counts and wallet balances
      const customersWithData = await Promise.all(
        (profiles || []).map(async (profile) => {
          const userReleases = (releases || []).filter(r => r.user_id === profile.id);
          const userWallet = (wallets || []).find(w => w.user_id === profile.id);
          
          return {
            id: profile.id,
            full_name: profile.full_name,
            email: profile.email,
            phone: profile.phone,
            created_at: profile.created_at,
            release_count: userReleases.length,
            wallet_balance: userWallet?.balance ? Number(userWallet.balance) : 0
          };
        })
      );

      // Process recent releases with user email
      const recentReleasesData = (releases || [])
        .slice(0, 6)
        .map(release => {
          const user = (profiles || []).find(p => p.id === release.user_id);
          return {
            id: release.id,
            song_name: release.song_name || 'Unknown Song',
            artist_name: 'Artist Name', // You might want to fetch this from artists table
            status: release.status || 'pending',
            created_at: release.created_at,
            user_email: user?.email || 'Unknown',
            type: release.type || 'single'
          };
        });

      // Calculate stats
      const totalUsers = profiles?.length || 0;
      const totalReleases = releases?.length || 0;
      const pendingReleases = (releases || []).filter(r => r.status === 'pending').length;
      const liveReleases = (releases || []).filter(r => r.status === 'approved' || r.status === 'live').length;
      const totalArtists = artists?.length || 0;
      const totalLabels = labels?.length || 0;
      const pendingWithdrawals = (withdrawals || []).filter(w => w.status === 'pending').length;
      const pendingOacRequests = (oacRequests || []).filter(o => o.status === 'pending').length;
      const pendingTakedownRequests = (takedownRequests || []).filter(t => t.status === 'pending').length;
      const totalEarnings = (wallets || []).reduce((sum, wallet) => {
        return sum + (wallet.balance ? Number(wallet.balance) : 0);
      }, 0);

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

      setCustomers(customersWithData);
      setRecentReleases(recentReleasesData);

      console.log("Dashboard data processed successfully:", {
        customers: customersWithData.length,
        releases: recentReleasesData.length,
        stats
      });

      toast({
        title: "Dashboard Updated",
        description: "All data has been refreshed successfully.",
      });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'live': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
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
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Welcome back, Administrator</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={fetchDashboardData} 
              className="bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <div className="text-sm text-gray-400">
              Last updated: {new Date().toLocaleString()}
            </div>
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
                  <p className="text-sm text-gray-400">Total Releases</p>
                  <h3 className="text-3xl font-bold text-white">{stats.totalReleases}</h3>
                </div>
                <Music className="h-8 w-8 text-red-500" />
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
                <Building2 className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Earnings</p>
                  <h3 className="text-3xl font-bold text-white">₹{stats.totalEarnings.toLocaleString()}</h3>
                </div>
                <DollarSign className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Overview */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Customer Overview</CardTitle>
            <CardDescription className="text-gray-400">
              Recent customer registrations and activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {customers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customers.slice(0, 6).map((customer) => (
                  <Card key={customer.id} className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-white truncate">{customer.full_name || 'No Name'}</h4>
                            <p className="text-sm text-gray-400 truncate">{customer.email || 'No Email'}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {customer.release_count} releases
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-400 space-y-1">
                          <p>Joined: {new Date(customer.created_at).toLocaleDateString()}</p>
                          <p>Wallet: ₹{customer.wallet_balance.toLocaleString()}</p>
                          <p>Phone: {customer.phone || 'Not provided'}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate("/admin/customers")}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate("/admin/customers")}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Manage
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No customers found</p>
                <p className="text-sm text-gray-500 mt-2">Customer data will appear here when users register</p>
              </div>
            )}
            {customers.length > 6 && (
              <div className="text-center mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/admin/customers")}
                >
                  View All Customers ({customers.length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Music Uploads */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Music Uploads</CardTitle>
            <CardDescription className="text-gray-400">
              Latest music submissions from customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentReleases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentReleases.map((release) => (
                  <Card key={release.id} className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-white truncate">{release.song_name}</h4>
                            <p className="text-sm text-gray-400">{release.artist_name}</p>
                            <p className="text-xs text-gray-500">{release.user_email}</p>
                          </div>
                          <Badge className={`${getStatusColor(release.status)} text-white text-xs`}>
                            {release.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-400 space-y-1">
                          <p>Type: {release.type}</p>
                          <p>Uploaded: {new Date(release.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate("/admin/music/review-queue")}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Review
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate("/admin/music/releases")}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Manage
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Music className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No music uploads yet</p>
                <p className="text-sm text-gray-500 mt-2">Customer uploads will appear here</p>
              </div>
            )}
            {recentReleases.length > 0 && (
              <div className="text-center mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/admin/music/releases")}
                >
                  View All Releases
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">Music Reviews</CardTitle>
              <CardDescription className="text-gray-400">Releases awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{stats.pendingReleases}</span>
                <Button 
                  size="sm" 
                  className="bg-red-600 hover:bg-red-700" 
                  onClick={() => navigate("/admin/music/review-queue")}
                  disabled={stats.pendingReleases === 0}
                >
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
                <Button 
                  size="sm" 
                  className="bg-red-600 hover:bg-red-700" 
                  onClick={() => navigate("/admin/wallet-payouts")}
                  disabled={stats.pendingWithdrawals === 0}
                >
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
                <Button 
                  size="sm" 
                  className="bg-red-600 hover:bg-red-700" 
                  onClick={() => navigate("/admin/requests/oac")}
                  disabled={stats.pendingOacRequests === 0}
                >
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
                <Button 
                  size="sm" 
                  className="bg-red-600 hover:bg-red-700" 
                  onClick={() => navigate("/admin/requests/copyright")}
                  disabled={stats.pendingTakedownRequests === 0}
                >
                  Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => navigate("/admin/customers")}
              >
                <Users className="h-6 w-6" />
                <span>Manage Customers</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => navigate("/admin/music/releases")}
              >
                <Music className="h-6 w-6" />
                <span>Manage Releases</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => navigate("/admin/wallet-payouts")}
              >
                <DollarSign className="h-6 w-6" />
                <span>Process Payouts</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => navigate("/admin/settings")}
              >
                <Settings className="h-6 w-6" />
                <span>System Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
