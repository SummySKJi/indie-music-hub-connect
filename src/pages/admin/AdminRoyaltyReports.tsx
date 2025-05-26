
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Search, Upload, Download, Eye, FileText, Calendar } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "@/hooks/use-toast";

interface RoyaltyReport {
  id: string;
  reportPeriod: string;
  platform: string;
  totalEarnings: number;
  totalStreams: number;
  uploadDate: string;
  fileType: string;
  status: "processed" | "pending" | "error";
}

const AdminRoyaltyReports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reports] = useState<RoyaltyReport[]>([
    {
      id: "1",
      reportPeriod: "January 2024",
      platform: "Spotify",
      totalEarnings: 15420.50,
      totalStreams: 892340,
      uploadDate: "2024-02-01",
      fileType: "CSV",
      status: "processed"
    },
    {
      id: "2",
      reportPeriod: "January 2024", 
      platform: "Apple Music",
      totalEarnings: 12850.25,
      totalStreams: 645230,
      uploadDate: "2024-02-01",
      fileType: "Excel",
      status: "processed"
    },
    {
      id: "3",
      reportPeriod: "February 2024",
      platform: "YouTube Music",
      totalEarnings: 8920.75,
      totalStreams: 523180,
      uploadDate: "2024-03-01",
      fileType: "CSV",
      status: "pending"
    }
  ]);

  const handleUploadReport = () => {
    toast({
      title: "Upload Started",
      description: "Royalty report upload has been initiated.",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      processed: "default",
      pending: "outline",
      error: "destructive"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const filteredReports = reports.filter(report =>
    report.reportPeriod.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEarnings = reports.reduce((sum, r) => sum + r.totalEarnings, 0);
  const totalStreams = reports.reduce((sum, r) => sum + r.totalStreams, 0);
  const processedReports = reports.filter(r => r.status === "processed").length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Royalty Reports Management</h1>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleUploadReport}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Report
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Earnings</p>
                  <h3 className="text-3xl font-bold text-green-400">₹{totalEarnings.toLocaleString()}</h3>
                </div>
                <FileText className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Streams</p>
                  <h3 className="text-3xl font-bold text-blue-400">{totalStreams.toLocaleString()}</h3>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Processed Reports</p>
                  <h3 className="text-3xl font-bold text-purple-400">{processedReports}</h3>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Reports</p>
                  <h3 className="text-3xl font-bold text-orange-400">{reports.length}</h3>
                </div>
                <FileText className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Royalty Reports</CardTitle>
            <CardDescription className="text-gray-400">
              Manage and review all platform royalty reports
            </CardDescription>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reports..."
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
                  <TableHead className="text-gray-300">Report Period</TableHead>
                  <TableHead className="text-gray-300">Platform</TableHead>
                  <TableHead className="text-gray-300">Total Earnings</TableHead>
                  <TableHead className="text-gray-300">Total Streams</TableHead>
                  <TableHead className="text-gray-300">Upload Date</TableHead>
                  <TableHead className="text-gray-300">File Type</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id} className="border-gray-700">
                    <TableCell className="text-white font-medium">{report.reportPeriod}</TableCell>
                    <TableCell className="text-gray-300">{report.platform}</TableCell>
                    <TableCell className="text-gray-300">₹{report.totalEarnings.toLocaleString()}</TableCell>
                    <TableCell className="text-gray-300">{report.totalStreams.toLocaleString()}</TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(report.uploadDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-gray-300">{report.fileType}</TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
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

export default AdminRoyaltyReports;
