
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Search, Eye, Edit, Ban, CheckCircle, Users, Mail, Calendar } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  created_at: string;
  status: 'active' | 'suspended' | 'deactivated';
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Add status field (default to active for now)
      const usersWithStatus = data?.map(user => ({
        ...user,
        status: 'active' as const
      })) || [];

      setUsers(usersWithStatus);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'suspended':
        return 'bg-yellow-500';
      case 'deactivated':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'suspended' | 'deactivated') => {
    try {
      // For now, we'll just update the local state
      // In a real implementation, you'd update this in the database
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));

      toast({
        title: "Success",
        description: `User status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white">Loading users...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Users</p>
                  <h3 className="text-2xl font-bold text-white">{users.length}</h3>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Users</p>
                  <h3 className="text-2xl font-bold text-green-400">
                    {users.filter(u => u.status === 'active').length}
                  </h3>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Suspended</p>
                  <h3 className="text-2xl font-bold text-yellow-400">
                    {users.filter(u => u.status === 'suspended').length}
                  </h3>
                </div>
                <Ban className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">New This Month</p>
                  <h3 className="text-2xl font-bold text-purple-400">
                    {users.filter(u => {
                      const monthAgo = new Date();
                      monthAgo.setMonth(monthAgo.getMonth() - 1);
                      return new Date(u.created_at) > monthAgo;
                    }).length}
                  </h3>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Name</TableHead>
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Phone</TableHead>
                  <TableHead className="text-gray-300">Joined</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-gray-700">
                    <TableCell className="text-white">
                      {user.full_name || 'No name provided'}
                    </TableCell>
                    <TableCell className="text-gray-300">{user.email}</TableCell>
                    <TableCell className="text-gray-300">
                      {user.phone || 'Not provided'}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">User Details</DialogTitle>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-400">Full Name</label>
                                  <p className="text-white">{selectedUser.full_name || 'Not provided'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-400">Email</label>
                                  <p className="text-white">{selectedUser.email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-400">Phone</label>
                                  <p className="text-white">{selectedUser.phone || 'Not provided'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-400">WhatsApp</label>
                                  <p className="text-white">{selectedUser.whatsapp || 'Not provided'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-400">Joined</label>
                                  <p className="text-white">{new Date(selectedUser.created_at).toLocaleString()}</p>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    onClick={() => handleStatusChange(selectedUser.id, 'active')}
                                    className="bg-green-600 hover:bg-green-700"
                                    disabled={selectedUser.status === 'active'}
                                  >
                                    Activate
                                  </Button>
                                  <Button
                                    onClick={() => handleStatusChange(selectedUser.id, 'suspended')}
                                    className="bg-yellow-600 hover:bg-yellow-700"
                                    disabled={selectedUser.status === 'suspended'}
                                  >
                                    Suspend
                                  </Button>
                                  <Button
                                    onClick={() => handleStatusChange(selectedUser.id, 'deactivated')}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={selectedUser.status === 'deactivated'}
                                  >
                                    Deactivate
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
