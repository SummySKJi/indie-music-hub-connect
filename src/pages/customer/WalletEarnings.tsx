
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Wallet, Download, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import CustomerLayout from "@/components/customer/CustomerLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const WalletEarnings = () => {
  const { user } = useAuth();
  const [walletBalance, setWalletBalance] = useState(0);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: '',
    upi_id: '',
    bank_account_number: '',
    bank_ifsc: '',
    bank_account_holder: ''
  });

  useEffect(() => {
    if (user) {
      fetchWalletData();
    }
  }, [user]);

  const fetchWalletData = async () => {
    if (!user) return;

    try {
      // Fetch wallet balance
      const { data: wallet } = await supabase
        .from('wallet')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      // Fetch withdrawal requests
      const { data: requests } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setWalletBalance(wallet?.balance || 0);
      setWithdrawalRequests(requests || []);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalRequest = async () => {
    if (!user) return;

    const amount = parseFloat(withdrawalForm.amount);
    if (amount <= 0 || amount > walletBalance) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount within your wallet balance.",
        variant: "destructive",
      });
      return;
    }

    if (!withdrawalForm.upi_id && (!withdrawalForm.bank_account_number || !withdrawalForm.bank_ifsc || !withdrawalForm.bank_account_holder)) {
      toast({
        title: "Payment Details Required",
        description: "Please provide either UPI ID or complete bank details.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .insert({
          user_id: user.id,
          amount: amount,
          upi_id: withdrawalForm.upi_id || null,
          bank_account_number: withdrawalForm.bank_account_number || null,
          bank_ifsc: withdrawalForm.bank_ifsc || null,
          bank_account_holder: withdrawalForm.bank_account_holder || null,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Withdrawal Request Submitted",
        description: "Your withdrawal request has been sent to admin for processing.",
      });

      setWithdrawalForm({
        amount: '',
        upi_id: '',
        bank_account_number: '',
        bank_ifsc: '',
        bank_account_holder: ''
      });

      fetchWalletData();
    } catch (error) {
      console.error('Error submitting withdrawal request:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit withdrawal request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      pending: "secondary",
      approved: "outline",
      paid: "default",
      rejected: "destructive"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-lg">Loading wallet data...</div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Wallet & Earnings</h1>
          <p className="text-gray-400">Manage your earnings and request withdrawals</p>
        </div>

        {/* Wallet Balance */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Available Balance</p>
                <h3 className="text-4xl font-bold text-green-400">₹{walletBalance.toFixed(2)}</h3>
              </div>
              <Wallet className="h-12 w-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Request Form */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5" />
              Request Withdrawal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount" className="text-gray-300">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={withdrawalForm.amount}
                onChange={(e) => setWithdrawalForm(prev => ({...prev, amount: e.target.value}))}
                className="bg-gray-700 border-gray-600 text-white"
                max={walletBalance}
              />
              <p className="text-xs text-gray-400 mt-1">Maximum: ₹{walletBalance.toFixed(2)}</p>
            </div>

            <div className="border-t border-gray-600 pt-4">
              <h4 className="text-white font-medium mb-3">Payment Method (Choose One)</h4>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="upi" className="text-gray-300">UPI ID</Label>
                  <Input
                    id="upi"
                    placeholder="Enter UPI ID"
                    value={withdrawalForm.upi_id}
                    onChange={(e) => setWithdrawalForm(prev => ({...prev, upi_id: e.target.value}))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="text-center text-gray-400 text-sm">OR</div>

                <div className="space-y-3">
                  <h5 className="text-gray-300 font-medium">Bank Account Details</h5>
                  <div>
                    <Label htmlFor="account_holder" className="text-gray-300">Account Holder Name</Label>
                    <Input
                      id="account_holder"
                      placeholder="Enter account holder name"
                      value={withdrawalForm.bank_account_holder}
                      onChange={(e) => setWithdrawalForm(prev => ({...prev, bank_account_holder: e.target.value}))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="account_number" className="text-gray-300">Account Number</Label>
                    <Input
                      id="account_number"
                      placeholder="Enter account number"
                      value={withdrawalForm.bank_account_number}
                      onChange={(e) => setWithdrawalForm(prev => ({...prev, bank_account_number: e.target.value}))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ifsc" className="text-gray-300">IFSC Code</Label>
                    <Input
                      id="ifsc"
                      placeholder="Enter IFSC code"
                      value={withdrawalForm.bank_ifsc}
                      onChange={(e) => setWithdrawalForm(prev => ({...prev, bank_ifsc: e.target.value}))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleWithdrawalRequest}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Submit Withdrawal Request
            </Button>
          </CardContent>
        </Card>

        {/* Withdrawal History */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ArrowDownCircle className="h-5 w-5" />
              Withdrawal History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {withdrawalRequests.length === 0 ? (
              <div className="text-center py-8">
                <Wallet className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Withdrawal Requests</h3>
                <p className="text-gray-400">Your withdrawal requests will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {withdrawalRequests.map((request: any) => (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">₹{request.amount}</h4>
                      <p className="text-gray-400 text-sm">
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                      {request.upi_id && (
                        <p className="text-gray-400 text-xs">UPI: {request.upi_id}</p>
                      )}
                      {request.bank_account_number && (
                        <p className="text-gray-400 text-xs">Bank: ***{request.bank_account_number.slice(-4)}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {getStatusBadge(request.status)}
                      {request.admin_notes && (
                        <p className="text-gray-400 text-xs mt-1">{request.admin_notes}</p>
                      )}
                    </div>
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

export default WalletEarnings;
