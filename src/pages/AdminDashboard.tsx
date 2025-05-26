import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Music, Users, FileText, BarChart2, DollarSign, Shield, Globe, Settings, AlertCircle, Building2, Play, Eye, Edit } from "lucide-react";
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
  const [recentReleases, setRecentReleases] = useState<any[]>([]);
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
        supabase.from('profiles').select('id, email, created_at', { count: 'exact' }),
        supabase.from('releases').select('*', { count: 'exact' }),
        supabase.from('artists').select('id', { count: 'exact' }),
        supabase.from('labels').select('id', { count: 'exact' }),
        supabase.from('withdrawal_requests').select('id, status, amount, created_at', { count: 'exact' }),
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
      const totalEarnings = wallets.reduce((sum, wallet) => {
        const balance = wallet.balance ? Number(wallet.balance) : 0;
        return sum + balance;
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

      // Get recent releases with artist and user data
      const recentReleasesWithData = await fetchRecentReleasesWithDetails();
      setRecentReleases(recentReleasesWithData);

      // Generate recent activity from real data
      const activities: RecentActivity[] = [];
      
      // Recent user registrations
      const recentUsers = (profilesResult.data || [])
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 2);
      
      recentUsers.forEach(user => {
        activities.push({
          id: user.id,
          type: 'user',
          title: 'New User Registration',
          description: `User registered: ${user.email}`,
          timestamp: new Date(user.created_at).toLocaleString(),
          user_email: user.email
        });
      });

      // Recent releases
      const recentReleasesActivity = allReleases
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3);
      
      recentReleasesActivity.forEach(release => {
        activities.push({
          id: release.id,
          type: 'release',
          title: 'New Music Upload',
          description: `"${release.song_name}" - Status: ${release.status}`,
          timestamp: new Date(release.created_at).toLocaleString()
        });
      });

      // Recent withdrawal requests
      const recentWithdrawals = allWithdrawals
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 2);
      
      recentWithdrawals.forEach(withdrawal => {
        activities.push({
          id: withdrawal.id,
          type: 'withdrawal',
          title: 'Withdrawal Request',
          description: `Amount: ₹${withdrawal.amount} - Status: ${withdrawal.status}`,
          timestamp: new Date(withdrawal.created_at).toLocaleString()
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
      setRecentActivity(activities.slice(0, 8));

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

  const fetchRecentReleasesWithDetails = async () => {
    try {
      // Fetch recent releases
      const { data: releases } = await supabase
        .from('releases')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (!releases) return [];

      // Fetch related data
      const [artistsResult, labelsResult, profilesResult] = await Promise.all([
        supabase.from('artists').select('id, name'),
        supabase.from('labels').select('id, name'),
        supabase.from('profiles').select('id, email, full_name')
      ]);

      // Create lookup maps
      const artistsMap = new Map();
      const labelsMap = new Map();
      const profilesMap = new Map();

      if (artistsResult.data) {
        artistsResult.data.forEach(artist => {
          artistsMap.set(artist.id, artist.name);
        });
      }

      if (labelsResult.data) {
        labelsResult.data.forEach(label => {
          labelsMap.set(label.id, label.name);
        });
      }

      if (profilesResult.data) {
        profilesResult.data.forEach(profile => {
          profilesMap.set(profile.id, { email: profile.email, name: profile.full_name });
        });
      }

      // Transform the data
      return releases.map(release => ({
        ...release,
        artist_name: release.artist_id ? artistsMap.get(release.artist_id) || 'Unknown Artist' : 'Unknown Artist',
        label_name: release.label_id ? labelsMap.get(release.label_id) || 'Independent' : 'Independent',
        user_info: release.user_id ? profilesMap.get(release.user_id) || { email: 'Unknown', name: 'Unknown' } : { email: 'Unknown', name: 'Unknown' }
      }));
    } catch (error) {
      console.error('Error fetching recent releases:', error);
      return [];
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
        return 'bg-blue-600';
      case 'withdrawal':
        return 'bg-green-600';
      case 'oac':
        return 'bg-purple-600';
      case 'takedown':
        return 'bg-orange-600';
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

        {/* Recent Uploads Section */}
        <h2 className="text-xl font-bold text-white mb-4">Recent Music Uploads</h2>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Latest Customer Uploads</CardTitle>
            <CardDescription className="text-gray-400">
              Recent music submissions from customers
            </CardDescription>
            <div className="flex justify-end">
              <Button 
                onClick={() => navigate("/admin/music/all-releases")}
                className="bg-red-600 hover:bg-red-700"
              >
                View All Releases
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentReleases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentReleases.map((release) => (
                  <Card key={release.id} className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white truncate">{release.song_name}</h4>
                          <p className="text-sm text-gray-400">{release.artist_name}</p>
                          <p className="text-xs text-gray-500">{release.user_info.email}</p>
                        </div>
                        <Badge className={`${getStatusColor(release.status)} text-white text-xs`}>
                          {release.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-400 mb-3">
                        {new Date(release.created_at).toLocaleDateString()}
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
                          onClick={() => navigate("/admin/music/all-releases")}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Manage
                        </Button>
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
          </CardContent>
        </Card>

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
                        {activity.user_email && (
                          <p className="text-xs text-gray-500">{activity.user_email}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">{activity.timestamp}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-400">No recent activity found</p>
                <p className="text-sm text-gray-500 mt-2">Activity will appear here as users interact with the platform</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
