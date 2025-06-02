
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Search, Eye, DollarSign, CheckCircle, XCircle, Clock, 
  Upload, Download, CreditCard
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  upi_id?: string;
  bank_account_number?: string;
  bank_account_holder?: string;
  bank_ifsc?: string;
  admin_notes?: string;
  created_at: string;
  user_name?: string;
  user_email?: string;
}

const FinancialManagement = () => {
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithdrawalRequests();
  }, []);

  const fetchWithdrawalRequests = async () => {
    try {
      const { data: requestsData, error } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch user details for each request
      const userIds = requestsData?.map(r => r.user_id).filter(Boolean) || [];
      const { data: users } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);

      // Combine the data
      const requestsWithDetails = requestsData?.map(request => ({
        ...request,
        user_name: users?.find(u => u.id === request.user_id)?.full_name || 'Unknown',
        user_email: users?.find(u => u.id === request.user_id)?.email || 'Unknown'
      })) || [];

      setWithdrawalRequests(requestsWithDetails);
    } catch (error) {
      console.error('Error fetching withdrawal requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch withdrawal requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = withdrawalRequests.filter(request => {
    const matchesSearch = request.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.user_email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateRequestStatus = async (requestId: string, newStatus: 'approved' | 'rejected' | 'processed', notes?: string) => {
    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .update({ 
          status: newStatus, 
          admin_notes: notes || null
        })
        .eq('id', requestId);

      if (error) throw error;

      setWithdrawalRequests(prev => prev.map(request => 
        request.id === requestId 
          ? { ...request, status: newStatus, admin_notes: notes || null }
          : request
      ));

      toast({
        title: "Success",
        description: `Withdrawal request ${newStatus} successfully`,
      });

      setSelectedRequest(null);
      setAdminNotes("");
    } catch (error) {
      console.error('Error updating withdrawal request:', error);
      toast({
        title: "Error",
        description: "Failed to update withdrawal request",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-blue-500';
      case 'processed':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const totalPendingAmount = withdrawalRequests
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const totalProcessedAmount = withdrawalRequests
    .filter(r => r.status === 'processed')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white">Loading financial data...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Financial Management</h1>
          <div className="flex items-center space-x-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Upload className="h-4 w-4 mr-2" />
              Upload Earnings
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
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
                  <h3 className="text-2xl font-bold text-yellow-400">
                    {withdrawalRequests.filter(r => r.status === 'pending').length}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    ₹{totalPendingAmount.toLocaleString()}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Processed This Month</p>
                  <h3 className="text-2xl font-bold text-green-400">
                    {withdrawalRequests.filter(r => r.status === 'processed').length}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    ₹{totalProcessedAmount.toLocaleString()}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Requests</p>
                  <h3 className="text-2xl font-bold text-white">{withdrawalRequests.length}</h3>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Rejected</p>
                  <h3 className="text-2xl font-bold text-red-400">
                    {withdrawalRequests.filter(r => r.status === 'rejected').length}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Need review</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-md"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="processed">Processed</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search by user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>

        {/* Withdrawal Requests Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Withdrawal Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">User</TableHead>
                  <TableHead className="text-gray-300">Amount</TableHead>
                  <TableHead className="text-gray-300">Method</TableHead>
                  <TableHead className="text-gray-300">Requested</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id} className="border-gray-700">
                    <TableCell>
                      <div>
                        <p className="text-white font-medium">{request.user_name}</p>
                        <p className="text-gray-400 text-sm">{request.user_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-white font-semibold">
                      ₹{Number(request.amount).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {request.upi_id ? (
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-1" />
                          UPI
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-1" />
                          Bank
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(request.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setAdminNotes(request.admin_notes || "");
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-white">Withdrawal Request Details</DialogTitle>
                          </DialogHeader>
                          {selectedRequest && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-400">User</label>
                                  <p className="text-white">{selectedRequest.user_name}</p>
                                  <p className="text-gray-400 text-sm">{selectedRequest.user_email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-400">Amount</label>
                                  <p className="text-white text-lg font-semibold">
                                    ₹{Number(selectedRequest.amount).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-400">Status</label>
                                  <Badge className={getStatusColor(selectedRequest.status)}>
                                    {selectedRequest.status}
                                  </Badge>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-400">Requested On</label>
                                  <p className="text-white">
                                    {new Date(selectedRequest.created_at).toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              {selectedRequest.upi_id && (
                                <div>
                                  <label className="text-sm font-medium text-gray-400">UPI ID</label>
                                  <p className="text-white font-mono">{selectedRequest.upi_id}</p>
                                </div>
                              )}

                              {selectedRequest.bank_account_number && (
                                <div className="space-y-2">
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Account Holder</label>
                                    <p className="text-white">{selectedRequest.bank_account_holder}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Account Number</label>
                                    <p className="text-white font-mono">{selectedRequest.bank_account_number}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">IFSC Code</label>
                                    <p className="text-white font-mono">{selectedRequest.bank_ifsc}</p>
                                  </div>
                                </div>
                              )}

                              <div>
                                <label className="text-sm font-medium text-gray-400">Admin Notes</label>
                                <Textarea
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  placeholder="Add notes for this withdrawal request..."
                                  className="bg-gray-700 border-gray-600 text-white mt-1"
                                  rows={3}
                                />
                              </div>

                              {selectedRequest.status === 'pending' && (
                                <div className="flex space-x-2">
                                  <Button
                                    onClick={() => updateRequestStatus(selectedRequest.id, 'approved', adminNotes)}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button
                                    onClick={() => updateRequestStatus(selectedRequest.id, 'rejected', adminNotes)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>
                                </div>
                              )}

                              {selectedRequest.status === 'approved' && (
                                <Button
                                  onClick={() => updateRequestStatus(selectedRequest.id, 'processed', adminNotes)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark as Processed
                                </Button>
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default FinancialManagement;
