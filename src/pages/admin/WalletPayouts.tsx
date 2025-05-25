
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const WalletPayouts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [withdrawals, setWithdrawals] = useState([
    {
      id: "1",
      customerName: "Rahul Kumar",
      email: "rahul@example.com",
      amount: 2500,
      upiId: "rahul@paytm",
      requestDate: "2024-01-20",
      status: "pending",
      walletBalance: 5000
    },
    {
      id: "2",
      customerName: "Priya Sharma", 
      email: "priya@example.com",
      amount: 1500,
      bankAccount: "1234567890",
      bankIfsc: "HDFC0001234",
      accountHolder: "Priya Sharma",
      requestDate: "2024-01-19",
      status: "pending",
      walletBalance: 3200
    }
  ]);

  const [balanceUpdate, setBalanceUpdate] = useState({ customerId: "", amount: "" });

  const handleApproval = (id: string, action: "approve" | "reject") => {
    setWithdrawals(prev => prev.map(w => 
      w.id === id ? { ...w, status: action === "approve" ? "paid" : "rejected" } : w
    ));
    toast({
      title: action === "approve" ? "Payment Approved" : "Payment Rejected",
      description: `Withdrawal request has been ${action === "approve" ? "approved" : "rejected"}.`,
      variant: action === "approve" ? "default" : "destructive",
    });
  };

  const filteredWithdrawals = withdrawals.filter(w =>
    w.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <Button className="w-full bg-green-600 hover:bg-green-700">
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
                  <h3 className="text-3xl font-bold text-yellow-400">
                    {withdrawals.filter(w => w.status === "pending").length}
                  </h3>
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
                  <h3 className="text-3xl font-bold text-red-400">
                    ₹{withdrawals.filter(w => w.status === "pending").reduce((sum, w) => sum + w.amount, 0)}
                  </h3>
                </div>
                <CreditCard className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Processed This Month</p>
                  <h3 className="text-3xl font-bold text-green-400">₹45,230</h3>
                </div>
                <Wallet className="h-8 w-8 text-green-500" />
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
                        <div className="font-medium">{withdrawal.customerName}</div>
                        <div className="text-sm text-gray-400">{withdrawal.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white font-medium">₹{withdrawal.amount}</TableCell>
                    <TableCell className="text-gray-300">
                      {withdrawal.upiId ? (
                        <div>
                          <div className="text-sm">UPI: {withdrawal.upiId}</div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm">Bank: {withdrawal.bankAccount}</div>
                          <div className="text-xs text-gray-400">IFSC: {withdrawal.bankIfsc}</div>
                          <div className="text-xs text-gray-400">{withdrawal.accountHolder}</div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-300">{withdrawal.requestDate}</TableCell>
                    <TableCell className="text-gray-300">₹{withdrawal.walletBalance}</TableCell>
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default WalletPayouts;
