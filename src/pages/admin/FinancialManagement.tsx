
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Upload, Download, CheckCircle, XCircle, DollarSign, CreditCard, FileText } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
  upi_id: string;
  bank_account_number: string;
  bank_ifsc: string;
  bank_account_holder: string;
  admin_notes: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

const FinancialManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [earningsAmount, setEarningsAmount] = useState("");
  const [earningsUser, setEarningsUser] = useState("");
  const [earningsPeriod, setEarningsPeriod] = useState("");

  const { data: withdrawalRequests, isLoading, refetch } = useQuery({
    queryKey: ['withdrawal-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const { data: users } = useQuery({
    queryKey: ['users-for-earnings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .order('full_name');
      
      if (error) throw error;
      return data || [];
    }
  });

  const updateWithdrawalStatus = async (requestId: string, newStatus: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .update({ 
          status: newStatus,
          admin_notes: notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Withdrawal request ${newStatus}.`,
      });
      
      refetch();
      setSelectedRequest(null);
      setAdminNotes("");
    } catch (error) {
      console.error('Error updating withdrawal status:', error);
      toast({
        title: "Error",
        description: "Failed to update withdrawal status.",
        variant: "destructive",
      });
    }
  };

  const addEarnings = async () => {
    if (!earningsUser || !earningsAmount || !earningsPeriod) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update user's wallet balance
      const { data: currentWallet } = await supabase
        .from('wallet')
        .select('balance')
        .eq('user_id', earningsUser)
        .single();

      const currentBalance = Number(currentWallet?.balance || 0);
      const newBalance = currentBalance + Number(earningsAmount);

      const { error } = await supabase
        .from('wallet')
        .update({ balance: newBalance })
        .eq('user_id', earningsUser);

      if (error) throw error;

      toast({
        title: "Earnings Added",
        description: `Successfully added ₹${earningsAmount} to user's wallet.`,
      });
      
      setEarningsUser("");
      setEarningsAmount("");
      setEarningsPeriod("");
    } catch (error) {
      console.error('Error adding earnings:', error);
      toast({
        title: "Error",
        description: "Failed to add earnings.",
        variant: "destructive",
      });
    }
  };

  const filteredRequests = withdrawalRequests?.filter(request => {
    const matchesSearch = request.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
      processed: "outline"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const pendingCount = withdrawalRequests?.filter(r => r.status === 'pending').length || 0;
  const pendingAmount = withdrawalRequests?.filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + Number(r.amount), 0) || 0;
  const processedCount = withdrawalRequests?.filter(r => r.status === 'processed').length || 0;
  const totalAmount = withdrawalRequests?.reduce((sum, r) => sum + Number(r.amount), 0) || 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Financial Management</h1>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Financial Data
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending Withdrawals</p>
                  <h3 className="text-3xl font-bold text-yellow-400">{pendingCount}</h3>
                  <p className="text-xs text-gray-500">₹{pendingAmount.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Processed</p>
                  <h3 className="text-3xl font-bold text-green-400">{processedCount}</h3>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Payouts</p>
                  <h3 className="text-3xl font-bold text-blue-400">₹{totalAmount.toLocaleString()}</h3>
                </div>
                <CreditCard className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Platform Earnings</p>
                  <h3 className="text-3xl font-bold text-purple-400">₹0</h3>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="withdrawals" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="withdrawals" className="data-[state=active]:bg-red-600">
              Withdrawal Requests
            </TabsTrigger>
            <TabsTrigger value="earnings" className="data-[state=active]:bg-red-600">
              Add Earnings
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-red-600">
              Financial Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="withdrawals">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Withdrawal Requests</CardTitle>
                <CardDescription className="text-gray-400">
                  Review and process customer withdrawal requests
                </CardDescription>
                <div className="flex space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by customer name or email..."
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="processed">Processed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
                    <p className="text-gray-400 mt-2">Loading withdrawal requests...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Customer</TableHead>
                        <TableHead className="text-gray-300">Amount</TableHead>
                        <TableHead className="text-gray-300">Request Date</TableHead>
                        <TableHead className="text-gray-300">Payment Method</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.map((request) => (
                        <TableRow key={request.id} className="border-gray-700">
                          <TableCell className="text-white">
                            <div>
                              <p className="font-medium">{request.profiles?.full_name}</p>
                              <p className="text-xs text-gray-500">{request.profiles?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300 font-medium">
                            ₹{Number(request.amount).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {new Date(request.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {request.upi_id ? `UPI: ${request.upi_id}` : 
                             `Bank: ****${request.bank_account_number?.slice(-4)}`}
                          </TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setSelectedRequest(request)}
                                >
                                  Review
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-gray-800 border-gray-700">
                                <DialogHeader>
                                  <DialogTitle className="text-white">Withdrawal Request Details</DialogTitle>
                                </DialogHeader>
                                {selectedRequest && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-gray-400">Customer</p>
                                        <p className="text-white">{selectedRequest.profiles?.full_name}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-400">Amount</p>
                                        <p className="text-white font-bold">₹{Number(selectedRequest.amount).toLocaleString()}</p>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <p className="text-gray-400">Payment Details</p>
                                      {selectedRequest.upi_id ? (
                                        <div className="bg-gray-700 p-3 rounded mt-1">
                                          <p className="text-white">UPI ID: {selectedRequest.upi_id}</p>
                                        </div>
                                      ) : (
                                        <div className="bg-gray-700 p-3 rounded mt-1">
                                          <p className="text-white">Account Holder: {selectedRequest.bank_account_holder}</p>
                                          <p className="text-white">Account Number: {selectedRequest.bank_account_number}</p>
                                          <p className="text-white">IFSC: {selectedRequest.bank_ifsc}</p>
                                        </div>
                                      )}
                                    </div>

                                    {selectedRequest.status === 'pending' && (
                                      <div className="space-y-3">
                                        <Textarea
                                          value={adminNotes}
                                          onChange={(e) => setAdminNotes(e.target.value)}
                                          placeholder="Add admin notes..."
                                          className="bg-gray-700 border-gray-600 text-white"
                                        />
                                        <div className="flex space-x-3">
                                          <Button 
                                            onClick={() => updateWithdrawalStatus(selectedRequest.id, 'approved', adminNotes)}
                                            className="bg-green-600 hover:bg-green-700"
                                          >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Approve
                                          </Button>
                                          <Button 
                                            onClick={() => updateWithdrawalStatus(selectedRequest.id, 'processed', adminNotes)}
                                            className="bg-blue-600 hover:bg-blue-700"
                                          >
                                            Mark as Processed
                                          </Button>
                                          <Button 
                                            onClick={() => updateWithdrawalStatus(selectedRequest.id, 'rejected', adminNotes)}
                                            variant="destructive"
                                          >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Reject
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Add Customer Earnings</CardTitle>
                <CardDescription className="text-gray-400">
                  Upload earnings data for customers from streaming platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-white font-medium">Customer</label>
                    <Select value={earningsUser} onValueChange={setEarningsUser}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.full_name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-white font-medium">Amount (₹)</label>
                    <Input
                      type="number"
                      value={earningsAmount}
                      onChange={(e) => setEarningsAmount(e.target.value)}
                      placeholder="0.00"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white font-medium">Period</label>
                    <Input
                      value={earningsPeriod}
                      onChange={(e) => setEarningsPeriod(e.target.value)}
                      placeholder="e.g., January 2024"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <Button onClick={addEarnings} className="bg-green-600 hover:bg-green-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Add Earnings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Financial Reports</CardTitle>
                <CardDescription className="text-gray-400">
                  Generate and view financial reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Financial reporting features coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default FinancialManagement;
