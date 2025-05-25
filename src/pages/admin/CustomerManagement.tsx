
import { useState } from "react";
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

const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([
    {
      id: "1",
      name: "Rahul Kumar",
      email: "rahul@example.com",
      phone: "+91 9876543210",
      joinDate: "2024-01-10",
      totalReleases: 5,
      totalEarnings: "₹15,420",
      status: "active",
      walletBalance: "₹2,500"
    },
    {
      id: "2", 
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 9876543211",
      joinDate: "2024-01-05",
      totalReleases: 3,
      totalEarnings: "₹8,930",
      status: "active",
      walletBalance: "₹1,200"
    },
    {
      id: "3",
      name: "Amit Singh",
      email: "amit@example.com", 
      phone: "+91 9876543212",
      joinDate: "2023-12-20",
      totalReleases: 8,
      totalEarnings: "₹25,680",
      status: "inactive",
      walletBalance: "₹500"
    }
  ]);

  const toggleCustomerStatus = (id: string) => {
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
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <h3 className="text-3xl font-bold text-green-400">
                    {customers.filter(c => c.status === "active").length}
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
                  <p className="text-sm text-gray-400">Inactive Customers</p>
                  <h3 className="text-3xl font-bold text-red-400">
                    {customers.filter(c => c.status === "inactive").length}
                  </h3>
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
                  <h3 className="text-3xl font-bold text-blue-400">
                    {customers.reduce((sum, c) => sum + c.totalReleases, 0)}
                  </h3>
                </div>
                <Edit className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Earnings</p>
                  <h3 className="text-3xl font-bold text-yellow-400">₹49,030</h3>
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
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Customer Details</TableHead>
                  <TableHead className="text-gray-300">Contact</TableHead>
                  <TableHead className="text-gray-300">Join Date</TableHead>
                  <TableHead className="text-gray-300">Releases</TableHead>
                  <TableHead className="text-gray-300">Earnings</TableHead>
                  <TableHead className="text-gray-300">Wallet</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="border-gray-700">
                    <TableCell className="text-white">
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-gray-400">{customer.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{customer.phone}</TableCell>
                    <TableCell className="text-gray-300">{customer.joinDate}</TableCell>
                    <TableCell className="text-gray-300">{customer.totalReleases}</TableCell>
                    <TableCell className="text-gray-300">{customer.totalEarnings}</TableCell>
                    <TableCell className="text-gray-300">{customer.walletBalance}</TableCell>
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CustomerManagement;
