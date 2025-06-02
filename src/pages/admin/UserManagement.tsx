
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Search, Eye, Edit, Ban, UserCheck, Download, Mail } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  status: "active" | "suspended" | "deactivated";
  totalReleases: number;
  totalEarnings: number;
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          phone,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get release counts for each user
      const usersWithStats = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { count: releaseCount } = await supabase
            .from('releases')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id);

          const { data: wallet } = await supabase
            .from('wallet')
            .select('balance')
            .eq('user_id', profile.id)
            .single();

          return {
            ...profile,
            status: "active" as const,
            totalReleases: releaseCount || 0,
            totalEarnings: Number(wallet?.balance || 0),
          };
        })
      );

      return usersWithStats;
    }
  });

  const updateUserStatus = async (userId: string, newStatus: string) => {
    // In a real implementation, you'd update a user_status table
    toast({
      title: "Status Updated",
      description: `User status updated to ${newStatus}.`,
    });
    refetch();
  };

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      active: "default",
      suspended: "destructive",
      deactivated: "outline"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Users
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Bulk Email
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Users</p>
                  <h3 className="text-3xl font-bold text-blue-400">{users?.length || 0}</h3>
                </div>
                <UserCheck className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Users</p>
                  <h3 className="text-3xl font-bold text-green-400">
                    {users?.filter(u => u.status === "active").length || 0}
                  </h3>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">New This Month</p>
                  <h3 className="text-3xl font-bold text-purple-400">
                    {users?.filter(u => {
                      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                      return new Date(u.created_at) > monthAgo;
                    }).length || 0}
                  </h3>
                </div>
                <UserCheck className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Suspended</p>
                  <h3 className="text-3xl font-bold text-red-400">
                    {users?.filter(u => u.status === "suspended").length || 0}
                  </h3>
                </div>
                <Ban className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">User Management</CardTitle>
            <CardDescription className="text-gray-400">
              Manage customer accounts and view user details
            </CardDescription>
            <div className="flex space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="deactivated">Deactivated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
                <p className="text-gray-400 mt-2">Loading users...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-300">Phone</TableHead>
                    <TableHead className="text-gray-300">Registration Date</TableHead>
                    <TableHead className="text-gray-300">Releases</TableHead>
                    <TableHead className="text-gray-300">Earnings</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-gray-700">
                      <TableCell className="text-white font-medium">
                        {user.full_name || 'No name'}
                      </TableCell>
                      <TableCell className="text-gray-300">{user.email}</TableCell>
                      <TableCell className="text-gray-300">{user.phone || 'N/A'}</TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-gray-300">{user.totalReleases}</TableCell>
                      <TableCell className="text-gray-300">₹{user.totalEarnings.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Select 
                            value={user.status} 
                            onValueChange={(value) => updateUserStatus(user.id, value)}
                          >
                            <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                              <SelectItem value="deactivated">Deactivated</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
