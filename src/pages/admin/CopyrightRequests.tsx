
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
import { Search, ExternalLink, Eye, Flag } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "@/hooks/use-toast";

const CopyrightRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState([
    {
      id: "1",
      songName: "Summer Vibes",
      youtubeLink: "https://youtube.com/watch?v=example1",
      label: "Bollywood Beats Records",
      submittedBy: "rahul@example.com",
      submittedDate: "2024-01-20",
      status: "pending"
    },
    {
      id: "2",
      songName: "Bollywood Dreams",
      youtubeLink: "https://youtube.com/watch?v=example2", 
      label: "Electronic Music India",
      submittedBy: "priya@example.com",
      submittedDate: "2024-01-19",
      status: "in_process"
    }
  ]);

  const updateStatus = (id: string, newStatus: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    ));
    toast({
      title: "Status Updated",
      description: `Copyright request status updated to ${newStatus.replace('_', ' ')}.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      pending: "secondary",
      in_process: "outline",
      approved: "default",
      rejected: "destructive",
      completed: "default"
    };
    return <Badge variant={variants[status] || "outline"}>{status.replace('_', ' ')}</Badge>;
  };

  const filteredRequests = requests.filter(req =>
    req.songName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Copyright Removal Requests</h1>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {requests.filter(r => r.status === "pending").length} Pending
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending</p>
                  <h3 className="text-3xl font-bold text-yellow-400">
                    {requests.filter(r => r.status === "pending").length}
                  </h3>
                </div>
                <Flag className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">In Process</p>
                  <h3 className="text-3xl font-bold text-blue-400">
                    {requests.filter(r => r.status === "in_process").length}
                  </h3>
                </div>
                <Flag className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Completed</p>
                  <h3 className="text-3xl font-bold text-green-400">
                    {requests.filter(r => r.status === "completed").length}
                  </h3>
                </div>
                <Flag className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Rejected</p>
                  <h3 className="text-3xl font-bold text-red-400">
                    {requests.filter(r => r.status === "rejected").length}
                  </h3>
                </div>
                <Flag className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Copyright Removal Requests</CardTitle>
            <CardDescription className="text-gray-400">
              Review and manage copyright takedown requests
            </CardDescription>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search requests..."
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
                  <TableHead className="text-gray-300">Song Name</TableHead>
                  <TableHead className="text-gray-300">YouTube Link</TableHead>
                  <TableHead className="text-gray-300">Label</TableHead>
                  <TableHead className="text-gray-300">Submitted By</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id} className="border-gray-700">
                    <TableCell className="text-white font-medium">{request.songName}</TableCell>
                    <TableCell className="text-gray-300">
                      <a 
                        href={request.youtubeLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-400 hover:text-blue-300"
                      >
                        <span className="mr-1">View Video</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell className="text-gray-300">{request.label}</TableCell>
                    <TableCell className="text-gray-300">{request.submittedBy}</TableCell>
                    <TableCell className="text-gray-300">{request.submittedDate}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Select 
                          value={request.status} 
                          onValueChange={(value) => updateStatus(request.id, value)}
                        >
                          <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_process">In Process</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
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

export default CopyrightRequests;
