
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, 
  DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Search, Check, X, DollarSign, CreditCard, Wallet } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WithdrawalRequest {
  id: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  upi_id?: string;
  bank_account_number?: string;
  bank_ifsc?: string;
  bank_account_holder?: string;
  created_at: string;
  status: string;
  wallet_balance: number;
}

const WalletPayouts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [balanceUpdate, setBalanceUpdate] = useState({ customerId: "", amount: "" });

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      
      // Fetch withdrawal requests
      const { data: withdrawalData, error: withdrawalError } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (withdrawalError) {
        console.error('Error fetching withdrawals:', withdrawalError);
        toast({
          title: "Error loading withdrawals",
          description: withdrawalError.message,
          variant: "destructive",
        });
        return;
      }

      // Fetch profiles and wallets for additional data
      const [profilesResult, walletsResult] = await Promise.all([
        supabase.from('profiles').select('id, full_name, email'),
        supabase.from('wallet').select('user_id, balance')
      ]);

      // Create lookup maps
      const profilesMap = new Map();
      const walletsMap = new Map();

      if (profilesResult.data) {
        profilesResult.data.forEach(profile => {
          profilesMap.set(profile.id, { name: profile.full_name, email: profile.email });
        });
      }

      if (walletsResult.data) {
        walletsResult.data.forEach(wallet => {
          walletsMap.set(wallet.user_id, Number(wallet.balance) || 0);
        });
      }

      // Transform the data
      const transformedWithdrawals: WithdrawalRequest[] = (withdrawalData || []).map(withdrawal => {
        const profile = profilesMap.get(withdrawal.user_id);
        return {
          id: withdrawal.id,
          customer_name: profile?.name || 'Unknown Customer',
          customer_email: profile?.email || 'Unknown Email',
          amount: Number(withdrawal.amount),
          upi_id: withdrawal.upi_id,
          bank_account_number: withdrawal.bank_account_number,
          bank_ifsc: withdrawal.bank_ifsc,
          bank_account_holder: withdrawal.bank_account_holder,
          created_at: withdrawal.created_at,
          status: withdrawal.status || 'pending',
          wallet_balance: walletsMap.get(withdrawal.user_id) || 0
        };
      });

      setWithdrawals(transformedWithdrawals);
    } catch (error: any) {
      console.error('Error in fetchWithdrawals:', error);
      toast({
        title: "Error loading withdrawals",
        description: "Failed to load withdrawal data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id: string, action: "approve" | "reject") => {
    try {
      const newStatus = action === "approve" ? "paid" : "rejected";
      
      const { error } = await supabase
        .from('withdrawal_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        toast({
          title: "Error updating withdrawal",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setWithdrawals(prev => prev.map(w => 
        w.id === id ? { ...w, status: newStatus } : w
      ));

      toast({
        title: action === "approve" ? "Payment Approved" : "Payment Rejected",
        description: `Withdrawal request has been ${action === "approve" ? "approved" : "rejected"}.`,
        variant: action === "approve" ? "default" : "destructive",
      });
    } catch (error: any) {
      console.error('Error updating withdrawal:', error);
      toast({
        title: "Error",
        description: "Failed to update withdrawal status",
        variant: "destructive",
      });
    }
  };

  const updateCustomerBalance = async () => {
    if (!balanceUpdate.customerId || !balanceUpdate.amount) {
      toast({
        title: "Invalid input",
        description: "Please provide both customer email and amount",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find user by email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', balanceUpdate.customerId)
        .single();

      if (profileError || !profile) {
        toast({
          title: "Customer not found",
          description: "No customer found with this email",
          variant: "destructive",
        });
        return;
      }

      // Update wallet balance
      const { error: walletError } = await supabase
        .from('wallet')
        .update({ 
          balance: supabase.raw(`balance + ${Number(balanceUpdate.amount)}`)
        })
        .eq('user_id', profile.id);

      if (walletError) {
        toast({
          title: "Error updating balance",
          description: walletError.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Balance Updated",
        description: `Successfully added ₹${balanceUpdate.amount} to customer wallet`,
      });

      setBalanceUpdate({ customerId: "", amount: "" });
      fetchWithdrawals(); // Refresh data
    } catch (error: any) {
      console.error('Error updating balance:', error);
      toast({
        title: "Error",
        description: "Failed to update customer balance",
        variant: "destructive",
      });
    }
  };

  const filteredWithdrawals = withdrawals.filter(w =>
    w.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingWithdrawals = withdrawals.filter(w => w.status === "pending").length;
  const totalPendingAmount = withdrawals
    .filter(w => w.status === "pending")
    .reduce((sum, w) => sum + w.amount, 0);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-white">Loading withdrawal requests...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Wallet & Payout Management</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Wallet className="h-4 w-4 mr-2" />
                Update Balance
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Update Customer Wallet</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Manually update a customer's wallet balance (use for royalty payments)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Customer Email"
                  value={balanceUpdate.customerId}
                  onChange={(e) => setBalanceUpdate({...balanceUpdate, customerId: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Input
                  placeholder="Amount to Add (₹)"
                  type="number"
                  value={balanceUpdate.amount}
                  onChange={(e) => setBalanceUpdate({...balanceUpdate, amount: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={updateCustomerBalance}
                >
                  Update Balance
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending Withdrawals</p>
                  <h3 className="text-3xl font-bold text-yellow-400">{pendingWithdrawals}</h3>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Pending Amount</p>
                  <h3 className="text-3xl font-bold text-red-400">₹{totalPendingAmount.toLocaleString()}</h3>
                </div>
                <CreditCard className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Requests</p>
                  <h3 className="text-3xl font-bold text-blue-400">{withdrawals.length}</h3>
                </div>
                <Wallet className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Withdrawal Requests</CardTitle>
            <CardDescription className="text-gray-400">
              Review and process customer withdrawal requests
            </CardDescription>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search withdrawals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredWithdrawals.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Customer</TableHead>
                    <TableHead className="text-gray-300">Amount</TableHead>
                    <TableHead className="text-gray-300">Payment Details</TableHead>
                    <TableHead className="text-gray-300">Request Date</TableHead>
                    <TableHead className="text-gray-300">Wallet Balance</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWithdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id} className="border-gray-700">
                      <TableCell className="text-white">
                        <div>
                          <div className="font-medium">{withdrawal.customer_name}</div>
                          <div className="text-sm text-gray-400">{withdrawal.customer_email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white font-medium">₹{withdrawal.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-gray-300">
                        {withdrawal.upi_id ? (
                          <div>
                            <div className="text-sm">UPI: {withdrawal.upi_id}</div>
                          </div>
                        ) : withdrawal.bank_account_number ? (
                          <div>
                            <div className="text-sm">Bank: {withdrawal.bank_account_number}</div>
                            <div className="text-xs text-gray-400">IFSC: {withdrawal.bank_ifsc}</div>
                            <div className="text-xs text-gray-400">{withdrawal.bank_account_holder}</div>
                          </div>
                        ) : (
                          <span className="text-gray-500">No payment details</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(withdrawal.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-gray-300">₹{withdrawal.wallet_balance.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          withdrawal.status === "pending" ? "secondary" :
                          withdrawal.status === "paid" ? "default" : "destructive"
                        }>
                          {withdrawal.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {withdrawal.status === "pending" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproval(withdrawal.id, "approve")}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleApproval(withdrawal.id, "reject")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No withdrawal requests found</p>
                <p className="text-sm text-gray-500 mt-2">
                  {searchTerm ? "Try adjusting your search terms" : "Withdrawal requests will appear here when customers request payouts"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default WalletPayouts;
