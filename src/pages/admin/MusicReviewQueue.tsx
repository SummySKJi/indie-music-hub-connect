
import { useState, useEffect } from "react";
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
import { Play, Download, Edit, Check, X, Trash2, Eye, Search } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Release {
  id: string;
  song_name: string;
  artist_id: string;
  label_id: string;
  user_id: string;
  created_at: string;
  status: string;
  type: string;
  language: string;
  copyright: string;
  platforms: string[];
  cover_art: string;
  audio_file: string;
  admin_notes: string;
  // Joined data
  artist_name?: string;
  label_name?: string;
  user_email?: string;
}

const MusicReviewQueue = () => {
  const [submissions, setSubmissions] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Release | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      
      // Fetch releases with related data
      const { data: releases, error } = await supabase
        .from('releases')
        .select(`
          *,
          artists(name),
          labels(name),
          profiles(email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching releases:', error);
        toast({
          title: "Error loading submissions",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Transform the data to match our interface
      const transformedReleases: Release[] = (releases || []).map(release => ({
        id: release.id,
        song_name: release.song_name || 'Untitled',
        artist_id: release.artist_id,
        label_id: release.label_id,
        user_id: release.user_id,
        created_at: release.created_at,
        status: release.status || 'pending',
        type: release.type || 'Single',
        language: release.language || 'Not specified',
        copyright: release.copyright || 'Not specified',
        platforms: release.platforms || [],
        cover_art: release.cover_art || '',
        audio_file: release.audio_file || '',
        admin_notes: release.admin_notes || '',
        artist_name: release.artists?.name || 'Unknown Artist',
        label_name: release.labels?.name || 'Independent',
        user_email: release.profiles?.email || 'Unknown'
      }));

      setSubmissions(transformedReleases);
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error loading submissions",
        description: "Failed to load music submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('releases')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) {
        toast({
          title: "Error approving submission",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setSubmissions(prev => prev.map(sub => 
        sub.id === id ? { ...sub, status: "approved" } : sub
      ));
      
      toast({
        title: "Submission Approved",
        description: "The music submission has been approved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error approving submission",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('releases')
        .update({ 
          status: 'rejected',
          admin_notes: reason
        })
        .eq('id', id);

      if (error) {
        toast({
          title: "Error rejecting submission",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setSubmissions(prev => prev.map(sub => 
        sub.id === id ? { ...sub, status: "rejected", admin_notes: reason } : sub
      ));
      
      toast({
        title: "Submission Rejected",
        description: "The music submission has been rejected.",
        variant: "destructive",
      });
      setRejectionReason("");
    } catch (error: any) {
      toast({
        title: "Error rejecting submission",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('releases')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Error deleting submission",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setSubmissions(prev => prev.filter(sub => sub.id !== id));
      toast({
        title: "Submission Deleted",
        description: "The music submission has been deleted.",
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting submission",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredSubmissions = submissions.filter(submission =>
    submission.song_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.artist_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = submissions.filter(s => s.status === "pending").length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-white">Loading submissions...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Music Review Queue</h1>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {pendingCount} Pending
          </Badge>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Music Submissions</CardTitle>
            <CardDescription className="text-gray-400">
              Review and manage music submissions from customers
            </CardDescription>
            <div className="flex space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by song name, artist, or user email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <Button onClick={fetchSubmissions} variant="outline">
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No submissions found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Song Details</TableHead>
                    <TableHead className="text-gray-300">Artist/Label</TableHead>
                    <TableHead className="text-gray-300">Submitted By</TableHead>
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id} className="border-gray-700">
                      <TableCell className="text-white">
                        <div>
                          <div className="font-medium">{submission.song_name}</div>
                          <div className="text-sm text-gray-400">
                            {submission.type} • {submission.language}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div>
                          <div>{submission.artist_name}</div>
                          <div className="text-sm text-gray-400">{submission.label_name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{submission.user_email}</TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={submission.status === "pending" ? "secondary" : 
                                     submission.status === "approved" ? "default" : "destructive"}>
                          {submission.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedSubmission(submission)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-white">Review Submission</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                  Review all details and take action on this submission
                                </DialogDescription>
                              </DialogHeader>
                              {selectedSubmission && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Song Name</label>
                                      <Input value={selectedSubmission.song_name} className="bg-gray-700 border-gray-600 text-white" readOnly />
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Artist</label>
                                      <Input value={selectedSubmission.artist_name || ''} className="bg-gray-700 border-gray-600 text-white" readOnly />
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Type</label>
                                      <Input value={selectedSubmission.type} className="bg-gray-700 border-gray-600 text-white" readOnly />
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Language</label>
                                      <Input value={selectedSubmission.language} className="bg-gray-700 border-gray-600 text-white" readOnly />
                                    </div>
                                    <div className="col-span-2">
                                      <label className="text-sm font-medium text-gray-300">Copyright</label>
                                      <Input value={selectedSubmission.copyright} className="bg-gray-700 border-gray-600 text-white" readOnly />
                                    </div>
                                  </div>
                                  
                                  <div className="flex space-x-4">
                                    <Button size="sm" variant="outline" disabled>
                                      <Play className="h-4 w-4 mr-2" />
                                      Play Audio
                                    </Button>
                                    <Button size="sm" variant="outline" disabled>
                                      <Download className="h-4 w-4 mr-2" />
                                      Download
                                    </Button>
                                  </div>

                                  {selectedSubmission.status === "pending" && (
                                    <div className="flex space-x-3 pt-4">
                                      <Button 
                                        onClick={() => handleApprove(selectedSubmission.id)}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        <Check className="h-4 w-4 mr-2" />
                                        Approve
                                      </Button>
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button variant="destructive">
                                            <X className="h-4 w-4 mr-2" />
                                            Reject
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-gray-800 border-gray-700">
                                          <DialogHeader>
                                            <DialogTitle className="text-white">Reject Submission</DialogTitle>
                                            <DialogDescription className="text-gray-400">
                                              Please provide a reason for rejection
                                            </DialogDescription>
                                          </DialogHeader>
                                          <Textarea
                                            placeholder="Enter rejection reason..."
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            className="bg-gray-700 border-gray-600 text-white"
                                          />
                                          <Button 
                                            onClick={() => {
                                              handleReject(selectedSubmission.id, rejectionReason);
                                            }}
                                            variant="destructive"
                                            disabled={!rejectionReason.trim()}
                                          >
                                            Confirm Rejection
                                          </Button>
                                        </DialogContent>
                                      </Dialog>
                                      <Button 
                                        onClick={() => handleDelete(selectedSubmission.id)}
                                        variant="outline"
                                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                      </Button>
                                    </div>
                                  )}

                                  {selectedSubmission.admin_notes && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Admin Notes</label>
                                      <Textarea
                                        value={selectedSubmission.admin_notes}
                                        className="bg-gray-700 border-gray-600 text-white"
                                        readOnly
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default MusicReviewQueue;
