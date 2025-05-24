import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Upload, DollarSign, Users, FileText, Settings, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Release } from "@/types/custom";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalReleases: 0,
    pendingReleases: 0,
    approvedReleases: 0,
    totalEarnings: 0,
    totalArtists: 0,
    totalLabels: 0
  });
  const [recentReleases, setRecentReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch releases with proper type casting
      const { data: releasesData } = await supabase
        .from('releases')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (releasesData) {
        // Type cast the data to match our Release interface
        const typedReleases: Release[] = releasesData.map(release => ({
          ...release,
          type: release.type as 'single' | 'album' | 'ep',
          status: release.status as 'pending' | 'approved' | 'rejected' | 'live' | 'takedown_requested' | 'takedown_completed'
        }));
        setRecentReleases(typedReleases);
      }

      // Fetch stats data
      const { data: statsData } = await supabase
        .from('releases')
        .select('status')
        .eq('user_id', user.id);

      const { data: artistsData } = await supabase
        .from('artists')
        .select('id')
        .eq('user_id', user.id);

      const { data: labelsData } = await supabase
        .from('labels')
        .select('id')
        .eq('user_id', user.id);

      if (statsData) {
        const totalReleases = statsData.length;
        const pendingReleases = statsData.filter(r => r.status === 'pending').length;
        const approvedReleases = statsData.filter(r => r.status === 'approved').length;

        setStats(prev => ({
          ...prev,
          totalReleases,
          pendingReleases,
          approvedReleases,
          totalArtists: artistsData ? artistsData.length : 0,
          totalLabels: labelsData ? labelsData.length : 0
        }));
      }

      // TODO: Fetch total earnings from wallet or royalty reports
      // const { data: walletData } = await supabase
      //   .from('wallets')
      //   .select('balance')
      //   .eq('user_id', user.id)
      //   .single();

      // if (walletData) {
      //   setStats(prev => ({
      //     ...prev,
      //     totalEarnings: walletData.balance
      //   }));
      // }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Releases */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Music className="h-5 w-5" />
                Total Releases
              </CardTitle>
              <CardDescription className="text-gray-400">All your released tracks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-500">{stats.totalReleases}</div>
            </CardContent>
          </Card>

          {/* Pending Releases */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Releases
              </CardTitle>
              <CardDescription className="text-gray-400">Releases awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-yellow-500">{stats.pendingReleases}</div>
            </CardContent>
          </Card>

          {/* Approved Releases */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Approved Releases
              </CardTitle>
              <CardDescription className="text-gray-400">Releases that are live</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-500">{stats.approvedReleases}</div>
            </CardContent>
          </Card>

          {/* Total Earnings */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Total Earnings
              </CardTitle>
              <CardDescription className="text-gray-400">Revenue from your music</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-500">${stats.totalEarnings}</div>
            </CardContent>
          </Card>

          {/* Total Artists */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                Total Artists
              </CardTitle>
              <CardDescription className="text-gray-400">Number of artists managed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-orange-500">{stats.totalArtists}</div>
            </CardContent>
          </Card>

          {/* Total Labels */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Total Labels
              </CardTitle>
              <CardDescription className="text-gray-400">Number of labels managed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-pink-500">{stats.totalLabels}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Releases */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            <TrendingUp className="h-6 w-6 mr-2 inline-block" />
            Recent Releases
          </h2>
          {recentReleases.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="text-center py-8">
                <XCircle className="h-10 w-10 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No recent releases to display.</p>
                <Link to="/upload-music">
                  <Button className="mt-4 bg-purple-600 hover:bg-purple-700">Upload Music</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentReleases.map((release) => (
                <Card key={release.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">{release.song_name}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {new Date(release.release_date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">Status: {release.status}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            <Settings className="h-6 w-6 mr-2 inline-block" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/upload-music">
              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors">
                <CardContent className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-white font-semibold">Upload Music</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/my-releases">
              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors">
                <CardContent className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-white font-semibold">Manage Releases</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/management">
              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors">
                <CardContent className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-white font-semibold">Artist Management</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
