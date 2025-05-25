
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import CustomerLayout from "@/components/customer/CustomerLayout";
import { supabase } from "@/integrations/supabase/client";

const RoyaltyReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('royalty_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('upload_date', { ascending: false });

      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (filePath: string, fileName: string) => {
    // In a real application, this would download from Supabase storage
    // For now, we'll show a placeholder
    console.log('Download request for:', filePath);
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-lg">Loading reports...</div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Royalty Reports</h1>
          <p className="text-gray-400">View and download your earning and royalty reports</p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Available Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Reports Available</h3>
                <p className="text-gray-400">
                  Royalty reports uploaded by admin will appear here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map((report: any) => (
                  <div key={report.id} className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-medium">{report.report_period}</h4>
                        <p className="text-gray-400 text-sm">
                          Type: {report.file_type.toUpperCase()}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Uploaded: {new Date(report.upload_date).toLocaleDateString()}
                        </p>
                      </div>
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    
                    <Button
                      onClick={() => handleDownload(report.file_path, report.report_period)}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
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

export default RoyaltyReports;
