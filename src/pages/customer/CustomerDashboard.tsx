
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Upload, Wallet, Building2, Clock, CheckCircle } from "lucide-react";
import CustomerLayout from "@/components/customer/CustomerLayout";
import { supabase } from "@/integrations/supabase/client";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalReleases: 0,
    pendingReleases: 0,
    liveReleases: 0,
    totalArtists: 0,
    totalLabels: 0,
    walletBalance: 0,
  });
  const [recentReleases, setRecentReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch releases count
      const { data: releases } = await supabase
        .from('releases')
        .select('id, status, song_name, created_at')
        .eq('user_id', user.id);

      // Fetch artists count
      const { data: artists } = await supabase
        .from('artists')
        .select('id')
        .eq('user_id', user.id);

      // Fetch labels count
      const { data: labels } = await supabase
        .from('labels')
        .select('id')
        .eq('user_id', user.id);

      // Fetch wallet balance
      const { data: wallet } = await supabase
        .from('wallet')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (releases) {
        setStats({
          totalReleases: releases.length,
          pendingReleases: releases.filter(r => r.status === 'pending').length,
          liveReleases: releases.filter(r => r.status === 'live').length,
          totalArtists: artists?.length || 0,
          totalLabels: labels?.length || 0,
          walletBalance: wallet?.balance || 0,
        });
        
        setRecentReleases(releases.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      pending: "secondary",
      approved: "outline",
      rejected: "destructive",
      live: "default"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-lg">Loading dashboard...</div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's your music distribution overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Releases</p>
                  <h3 className="text-3xl font-bold text-white">{stats.totalReleases}</h3>
                </div>
                <Music className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending Reviews</p>
                  <h3 className="text-3xl font-bold text-yellow-400">{stats.pendingReleases}</h3>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Live Releases</p>
                  <h3 className="text-3xl font-bold text-green-400">{stats.liveReleases}</h3>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Artists</p>
                  <h3 className="text-3xl font-bold text-blue-400">{stats.totalArtists}</h3>
                </div>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Labels</p>
                  <h3 className="text-3xl font-bold text-pink-400">{stats.totalLabels}</h3>
                </div>
                <Building2 className="h-8 w-8 text-pink-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Wallet Balance</p>
                  <h3 className="text-3xl font-bold text-green-400">₹{stats.walletBalance}</h3>
                </div>
                <Wallet className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Releases */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Releases</CardTitle>
          </CardHeader>
          <CardContent>
            {recentReleases.length === 0 ? (
              <div className="text-center py-8">
                <Music className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Releases Yet</h3>
                <p className="text-gray-400">Start your music journey by uploading your first track</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentReleases.map((release: any) => (
                  <div key={release.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">{release.song_name}</h4>
                      <p className="text-gray-400 text-sm">
                        {new Date(release.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(release.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default CustomerDashboard;
