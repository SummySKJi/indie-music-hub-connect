
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Search, UserCheck, UserX, Edit, Eye, Mail } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Customer {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  status: "active" | "inactive";
  total_releases: number;
  wallet_balance: number;
}

const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      
      // Fetch profiles with wallet and release counts
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast({
          title: "Error loading customers",
          description: profilesError.message,
          variant: "destructive",
        });
        return;
      }

      // Fetch additional data for each customer
      const customersWithData = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Get release count
          const { count: releaseCount } = await supabase
            .from('releases')
            .select('id', { count: 'exact' })
            .eq('user_id', profile.id);

          // Get wallet balance
          const { data: walletData } = await supabase
            .from('wallet')
            .select('balance')
            .eq('user_id', profile.id)
            .single();

          return {
            id: profile.id,
            full_name: profile.full_name,
            email: profile.email,
            phone: profile.phone,
            created_at: profile.created_at,
            status: "active" as const, // Default to active, you can add logic to determine this
            total_releases: releaseCount || 0,
            wallet_balance: walletData?.balance ? Number(walletData.balance) : 0
          };
        })
      );

      setCustomers(customersWithData);
    } catch (error: any) {
      console.error('Error in fetchCustomers:', error);
      toast({
        title: "Error loading customers",
        description: "Failed to load customer data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCustomerStatus = async (id: string) => {
    // This would require additional logic to actually update customer status
    // For now, just update the local state
    setCustomers(prev => prev.map(customer => 
      customer.id === id 
        ? { ...customer, status: customer.status === "active" ? "inactive" : "active" }
        : customer
    ));
    
    toast({
      title: "Customer Status Updated",
      description: "Customer account status has been updated successfully.",
    });
  };

  const filteredCustomers = customers.filter(customer =>
    (customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  const activeCustomers = customers.filter(c => c.status === "active").length;
  const inactiveCustomers = customers.filter(c => c.status === "inactive").length;
  const totalReleases = customers.reduce((sum, c) => sum + c.total_releases, 0);
  const totalEarnings = customers.reduce((sum, c) => sum + c.wallet_balance, 0);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-white">Loading customers...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Customer Management</h1>
          <div className="text-sm text-gray-400">
            Total Customers: {customers.length}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Customers</p>
                  <h3 className="text-3xl font-bold text-green-400">{activeCustomers}</h3>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Inactive Customers</p>
                  <h3 className="text-3xl font-bold text-red-400">{inactiveCustomers}</h3>
                </div>
                <UserX className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Releases</p>
                  <h3 className="text-3xl font-bold text-blue-400">{totalReleases}</h3>
                </div>
                <Edit className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Wallet Balance</p>
                  <h3 className="text-3xl font-bold text-yellow-400">₹{totalEarnings.toLocaleString()}</h3>
                </div>
                <Edit className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">All Customers</CardTitle>
            <CardDescription className="text-gray-400">
              View and manage customer accounts and details
            </CardDescription>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredCustomers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Customer Details</TableHead>
                    <TableHead className="text-gray-300">Contact</TableHead>
                    <TableHead className="text-gray-300">Join Date</TableHead>
                    <TableHead className="text-gray-300">Releases</TableHead>
                    <TableHead className="text-gray-300">Wallet Balance</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id} className="border-gray-700">
                      <TableCell className="text-white">
                        <div>
                          <div className="font-medium">{customer.full_name || 'N/A'}</div>
                          <div className="text-sm text-gray-400">{customer.email || 'N/A'}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{customer.phone || 'N/A'}</TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-gray-300">{customer.total_releases}</TableCell>
                      <TableCell className="text-gray-300">₹{customer.wallet_balance.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={customer.status === "active"}
                            onCheckedChange={() => toggleCustomerStatus(customer.id)}
                          />
                          <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                            {customer.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No customers found</p>
                <p className="text-sm text-gray-500 mt-2">
                  {searchTerm ? "Try adjusting your search terms" : "Customers will appear here when they register"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CustomerManagement;
