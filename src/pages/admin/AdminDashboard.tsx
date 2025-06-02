
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Users, 
  Music, 
  DollarSign, 
  FileText, 
  Flag, 
  Youtube,
  TrendingUp,
  AlertCircle,
  Calendar,
  Eye
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalCustomers: number;
  newSignupsToday: number;
  newSignupsWeek: number;
  newSignupsMonth: number;
  totalReleases: number;
  pendingReleases: number;
  approvedReleases: number;
  rejectedReleases: number;
  totalEarnings: number;
  pendingWithdrawals: number;
  pendingWithdrawalAmount: number;
  pendingTakedowns: number;
  pendingOacRequests: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    newSignupsToday: 0,
    newSignupsWeek: 0,
    newSignupsMonth: 0,
    totalReleases: 0,
    pendingReleases: 0,
    approvedReleases: 0,
    rejectedReleases: 0,
    totalEarnings: 0,
    pendingWithdrawals: 0,
    pendingWithdrawalAmount: 0,
    pendingTakedowns: 0,
    pendingOacRequests: 0,
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      // Fetch recent releases
      const { data: releases } = await supabase
        .from('releases')
        .select('id, song_name, status, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch user details for releases
      const userIds = releases?.map(r => r.user_id).filter(Boolean) || [];
      const { data: users } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      // Combine data
      const releasesWithUsers = releases?.map(release => ({
        ...release,
        user_name: users?.find(u => u.id === release.user_id)?.full_name || 'Unknown'
      })) || [];

      // Fetch recent users
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('id, full_name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      return { releases: releasesWithUsers, users: recentUsers || [] };
    }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total customers
        const { count: totalCustomers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get new signups
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

        const { count: newSignupsToday } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today);

        const { count: newSignupsWeek } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', weekAgo);

        const { count: newSignupsMonth } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', monthAgo);

        // Get release stats
        const { count: totalReleases } = await supabase
          .from('releases')
          .select('*', { count: 'exact', head: true });

        const { count: pendingReleases } = await supabase
          .from('releases')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        const { count: approvedReleases } = await supabase
          .from('releases')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved');

        const { count: rejectedReleases } = await supabase
          .from('releases')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'rejected');

        // Get withdrawal stats
        const { count: pendingWithdrawals } = await supabase
          .from('withdrawal_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        const { data: withdrawalAmount } = await supabase
          .from('withdrawal_requests')
          .select('amount')
          .eq('status', 'pending');

        const pendingWithdrawalAmount = withdrawalAmount?.reduce((sum, w) => sum + Number(w.amount), 0) || 0;

        // Get pending requests
        const { count: pendingTakedowns } = await supabase
          .from('takedown_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        const { count: pendingOacRequests } = await supabase
          .from('oac_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        setStats({
          totalCustomers: totalCustomers || 0,
          newSignupsToday: newSignupsToday || 0,
          newSignupsWeek: newSignupsWeek || 0,
          newSignupsMonth: newSignupsMonth || 0,
          totalReleases: totalReleases || 0,
          pendingReleases: pendingReleases || 0,
          approvedReleases: approvedReleases || 0,
          rejectedReleases: rejectedReleases || 0,
          totalEarnings: 0, // This would come from earnings data
          pendingWithdrawals: pendingWithdrawals || 0,
          pendingWithdrawalAmount,
          pendingTakedowns: pendingTakedowns || 0,
          pendingOacRequests: pendingOacRequests || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex space-x-2">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Customers</p>
                  <h3 className="text-3xl font-bold text-blue-400">{stats.totalCustomers}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    +{stats.newSignupsToday} today, +{stats.newSignupsWeek} this week
                  </p>
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
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.pendingReleases} pending review
                  </p>
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
                  <p className="text-xs text-gray-500 mt-1">
                    ₹{stats.pendingWithdrawalAmount.toLocaleString()} total
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending Requests</p>
                  <h3 className="text-3xl font-bold text-red-400">
                    {stats.pendingTakedowns + stats.pendingOacRequests}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.pendingTakedowns} takedowns, {stats.pendingOacRequests} OAC
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Music className="h-4 w-4 mr-2" />
                Review Pending Music ({stats.pendingReleases})
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <DollarSign className="h-4 w-4 mr-2" />
                Process Withdrawals ({stats.pendingWithdrawals})
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Flag className="h-4 w-4 mr-2" />
                Handle Takedowns ({stats.pendingTakedowns})
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Youtube className="h-4 w-4 mr-2" />
                Review OAC Requests ({stats.pendingOacRequests})
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity?.releases.slice(0, 5).map((release) => (
                  <div key={release.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white truncate">{release.song_name}</p>
                      <p className="text-xs text-gray-400">
                        by {release.user_name}
                      </p>
                    </div>
                    <Badge 
                      variant={release.status === 'pending' ? 'secondary' : 
                              release.status === 'approved' ? 'default' : 'destructive'}
                    >
                      {release.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">New Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity?.users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">{user.full_name || 'No name'}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Release Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Release Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Pending Review</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${stats.totalReleases > 0 ? (stats.pendingReleases / stats.totalReleases) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-yellow-400">{stats.pendingReleases}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Approved</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${stats.totalReleases > 0 ? (stats.approvedReleases / stats.totalReleases) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-green-400">{stats.approvedReleases}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Rejected</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${stats.totalReleases > 0 ? (stats.rejectedReleases / stats.totalReleases) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-red-400">{stats.rejectedReleases}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Platform Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-purple-400">{stats.newSignupsMonth}</h4>
                  <p className="text-sm text-gray-400">New Users (30 days)</p>
                </div>
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-orange-400">250+</h4>
                  <p className="text-sm text-gray-400">DSPs Connected</p>
                </div>
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-cyan-400">₹{stats.totalEarnings.toLocaleString()}</h4>
                  <p className="text-sm text-gray-400">Total Earnings</p>
                </div>
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-pink-400">99.9%</h4>
                  <p className="text-sm text-gray-400">Uptime</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
