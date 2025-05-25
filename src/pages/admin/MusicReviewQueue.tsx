
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
import { Play, Download, Edit, Check, X, Trash2, Eye } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "@/hooks/use-toast";

const MusicReviewQueue = () => {
  const [submissions, setSubmissions] = useState([
    {
      id: "1",
      songName: "Summer Vibes",
      artistName: "DJ Rahul",
      submittedBy: "user@example.com",
      submittedAt: "2024-01-15",
      status: "pending",
      type: "Single",
      language: "Hindi",
      genre: "Electronic",
      coverArt: "/placeholder.svg",
      audioFile: "summer-vibes.mp3"
    },
    {
      id: "2", 
      songName: "Bollywood Dreams",
      artistName: "Priya Sharma",
      submittedBy: "priya@example.com",
      submittedAt: "2024-01-14",
      status: "pending",
      type: "Single",
      language: "Hindi",
      genre: "Bollywood",
      coverArt: "/placeholder.svg",
      audioFile: "bollywood-dreams.mp3"
    }
  ]);

  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = (id: string) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, status: "approved" } : sub
    ));
    toast({
      title: "Submission Approved",
      description: "The music submission has been approved successfully.",
    });
  };

  const handleReject = (id: string, reason: string) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, status: "rejected", rejectionReason: reason } : sub
    ));
    toast({
      title: "Submission Rejected",
      description: "The music submission has been rejected.",
      variant: "destructive",
    });
  };

  const handleDelete = (id: string) => {
    setSubmissions(prev => prev.filter(sub => sub.id !== id));
    toast({
      title: "Submission Deleted",
      description: "The music submission has been deleted.",
      variant: "destructive",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Music Review Queue</h1>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {submissions.filter(s => s.status === "pending").length} Pending
          </Badge>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Pending Submissions</CardTitle>
            <CardDescription className="text-gray-400">
              Review and manage music submissions from customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Song Details</TableHead>
                  <TableHead className="text-gray-300">Artist</TableHead>
                  <TableHead className="text-gray-300">Submitted By</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id} className="border-gray-700">
                    <TableCell className="text-white">
                      <div>
                        <div className="font-medium">{submission.songName}</div>
                        <div className="text-sm text-gray-400">
                          {submission.type} • {submission.language} • {submission.genre}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{submission.artistName}</TableCell>
                    <TableCell className="text-gray-300">{submission.submittedBy}</TableCell>
                    <TableCell className="text-gray-300">{submission.submittedAt}</TableCell>
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
                            <Button size="sm" variant="outline">
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
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-300">Song Name</label>
                                  <Input value={submission.songName} className="bg-gray-700 border-gray-600 text-white" readOnly />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-300">Artist</label>
                                  <Input value={submission.artistName} className="bg-gray-700 border-gray-600 text-white" readOnly />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-300">Type</label>
                                  <Input value={submission.type} className="bg-gray-700 border-gray-600 text-white" readOnly />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-300">Language</label>
                                  <Input value={submission.language} className="bg-gray-700 border-gray-600 text-white" readOnly />
                                </div>
                              </div>
                              
                              <div className="flex space-x-4">
                                <Button size="sm" variant="outline">
                                  <Play className="h-4 w-4 mr-2" />
                                  Play Audio
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                              </div>

                              {submission.status === "pending" && (
                                <div className="flex space-x-3 pt-4">
                                  <Button 
                                    onClick={() => handleApprove(submission.id)}
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
                                          handleReject(submission.id, rejectionReason);
                                          setRejectionReason("");
                                        }}
                                        variant="destructive"
                                      >
                                        Confirm Rejection
                                      </Button>
                                    </DialogContent>
                                  </Dialog>
                                  <Button 
                                    onClick={() => handleDelete(submission.id)}
                                    variant="outline"
                                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </Button>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
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

export default MusicReviewQueue;
