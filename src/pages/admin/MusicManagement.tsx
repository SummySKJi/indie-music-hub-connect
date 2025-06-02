
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
import { Search, Eye, Download, CheckCircle, XCircle, Clock, Play, Image } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Release {
  id: string;
  song_name: string;
  artist_name: string;
  type: string;
  language: string;
  status: string;
  created_at: string;
  user_id: string;
  cover_art: string;
  audio_file: string;
  platforms: string[];
  copyright: string;
  admin_notes: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

const MusicManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  const { data: releases, isLoading, refetch } = useQuery({
    queryKey: ['admin-releases', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('releases')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  const updateReleaseStatus = async (releaseId: string, newStatus: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('releases')
        .update({ 
          status: newStatus,
          admin_notes: notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', releaseId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Release status updated to ${newStatus}.`,
      });
      
      refetch();
      setSelectedRelease(null);
      setReviewNotes("");
    } catch (error) {
      console.error('Error updating release status:', error);
      toast({
        title: "Error",
        description: "Failed to update release status.",
        variant: "destructive",
      });
    }
  };

  const filteredReleases = releases?.filter(release => {
    const matchesSearch = release.song_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         release.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
      live: "outline"
    };
    const icons: Record<string, React.ReactNode> = {
      pending: <Clock className="h-3 w-3 mr-1" />,
      approved: <CheckCircle className="h-3 w-3 mr-1" />,
      rejected: <XCircle className="h-3 w-3 mr-1" />,
      live: <Play className="h-3 w-3 mr-1" />
    };
    return (
      <Badge variant={variants[status] || "outline"} className="flex items-center">
        {icons[status]}
        {status}
      </Badge>
    );
  };

  const pendingCount = releases?.filter(r => r.status === 'pending').length || 0;
  const approvedCount = releases?.filter(r => r.status === 'approved').length || 0;
  const rejectedCount = releases?.filter(r => r.status === 'rejected').length || 0;
  const liveCount = releases?.filter(r => r.status === 'live').length || 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Music Management</h1>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Releases
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending Review</p>
                  <h3 className="text-3xl font-bold text-yellow-400">{pendingCount}</h3>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Approved</p>
                  <h3 className="text-3xl font-bold text-green-400">{approvedCount}</h3>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Live</p>
                  <h3 className="text-3xl font-bold text-blue-400">{liveCount}</h3>
                </div>
                <Play className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Rejected</p>
                  <h3 className="text-3xl font-bold text-red-400">{rejectedCount}</h3>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Release Management</CardTitle>
            <CardDescription className="text-gray-400">
              Review, approve, reject, and manage all music releases
            </CardDescription>
            <div className="flex space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search releases by song name or artist..."
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
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
                <p className="text-gray-400 mt-2">Loading releases...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Song/Album</TableHead>
                    <TableHead className="text-gray-300">Artist/Customer</TableHead>
                    <TableHead className="text-gray-300">Type</TableHead>
                    <TableHead className="text-gray-300">Language</TableHead>
                    <TableHead className="text-gray-300">Submitted</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReleases.map((release) => (
                    <TableRow key={release.id} className="border-gray-700">
                      <TableCell className="text-white font-medium">
                        {release.song_name}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div>
                          <p className="font-medium">{release.profiles?.full_name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{release.profiles?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{release.type}</TableCell>
                      <TableCell className="text-gray-300">{release.language}</TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(release.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(release.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedRelease(release)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-800 border-gray-700 max-w-4xl">
                              <DialogHeader>
                                <DialogTitle className="text-white">Release Details</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                  Review and manage this release
                                </DialogDescription>
                              </DialogHeader>
                              {selectedRelease && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="text-white font-medium">Song Information</h4>
                                        <div className="mt-2 space-y-2">
                                          <p className="text-gray-300"><span className="text-gray-400">Song Name:</span> {selectedRelease.song_name}</p>
                                          <p className="text-gray-300"><span className="text-gray-400">Type:</span> {selectedRelease.type}</p>
                                          <p className="text-gray-300"><span className="text-gray-400">Language:</span> {selectedRelease.language}</p>
                                          <p className="text-gray-300"><span className="text-gray-400">Copyright:</span> {selectedRelease.copyright}</p>
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="text-white font-medium">Platforms</h4>
                                        <div className="mt-2 flex flex-wrap gap-1">
                                          {selectedRelease.platforms?.map((platform) => (
                                            <Badge key={platform} variant="outline" className="text-xs">
                                              {platform}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="text-white font-medium">Files</h4>
                                        <div className="mt-2 space-y-2">
                                          {selectedRelease.cover_art && (
                                            <Button size="sm" variant="outline" className="w-full justify-start">
                                              <Image className="h-4 w-4 mr-2" />
                                              Download Cover Art
                                            </Button>
                                          )}
                                          {selectedRelease.audio_file && (
                                            <Button size="sm" variant="outline" className="w-full justify-start">
                                              <Download className="h-4 w-4 mr-2" />
                                              Download Audio File
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {selectedRelease.status === 'pending' && (
                                    <div className="space-y-4">
                                      <div>
                                        <label className="text-white font-medium">Review Notes</label>
                                        <Textarea
                                          value={reviewNotes}
                                          onChange={(e) => setReviewNotes(e.target.value)}
                                          placeholder="Add notes for approval/rejection..."
                                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                                        />
                                      </div>
                                      <div className="flex space-x-3">
                                        <Button 
                                          onClick={() => updateReleaseStatus(selectedRelease.id, 'approved', reviewNotes)}
                                          className="bg-green-600 hover:bg-green-700"
                                        >
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Approve Release
                                        </Button>
                                        <Button 
                                          onClick={() => updateReleaseStatus(selectedRelease.id, 'rejected', reviewNotes)}
                                          variant="destructive"
                                        >
                                          <XCircle className="h-4 w-4 mr-2" />
                                          Reject Release
                                        </Button>
                                      </div>
                                    </div>
                                  )}

                                  {selectedRelease.admin_notes && (
                                    <div>
                                      <h4 className="text-white font-medium">Admin Notes</h4>
                                      <p className="mt-2 text-gray-300 bg-gray-700 p-3 rounded">
                                        {selectedRelease.admin_notes}
                                      </p>
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

export default MusicManagement;
