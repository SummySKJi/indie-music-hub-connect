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
  Search, Eye, Download, CheckCircle, XCircle, Clock, Music, 
  Calendar, User, Play
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Release {
  id: string;
  song_name: string;
  type: string;
  language: string;
  status: 'pending' | 'approved' | 'rejected' | 'live' | 'takedown_requested' | 'takedown_completed';
  release_date?: string;
  created_at: string;
  user_id: string;
  artist_id?: string;
  label_id?: string;
  audio_file?: string;
  cover_art?: string;
  admin_notes?: string;
  user_name?: string;
  artist_name?: string;
}

const MusicManagement = () => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    try {
      const { data: releasesData, error } = await supabase
        .from('releases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch user details for each release
      const userIds = releasesData?.map(r => r.user_id).filter(Boolean) || [];
      const { data: users } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      // Fetch artist details
      const artistIds = releasesData?.map(r => r.artist_id).filter(Boolean) || [];
      const { data: artists } = await supabase
        .from('artists')
        .select('id, name')
        .in('id', artistIds);

      // Combine the data with proper type casting
      const releasesWithDetails = releasesData?.map(release => ({
        id: release.id,
        song_name: release.song_name || '',
        type: release.type || '',
        language: release.language || '',
        status: (release.status || 'pending') as 'pending' | 'approved' | 'rejected' | 'live' | 'takedown_requested' | 'takedown_completed',
        release_date: release.release_date || undefined,
        created_at: release.created_at || '',
        user_id: release.user_id || '',
        artist_id: release.artist_id || undefined,
        label_id: release.label_id || undefined,
        audio_file: release.audio_file || undefined,
        cover_art: release.cover_art || undefined,
        admin_notes: release.admin_notes || undefined,
        user_name: users?.find(u => u.id === release.user_id)?.full_name || 'Unknown',
        artist_name: artists?.find(a => a.id === release.artist_id)?.name || 'Unknown'
      })) || [];

      setReleases(releasesWithDetails);
    } catch (error) {
      console.error('Error fetching releases:', error);
      toast({
        title: "Error",
        description: "Failed to fetch releases",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredReleases = releases.filter(release => {
    const matchesSearch = release.song_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         release.artist_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || release.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateReleaseStatus = async (releaseId: string, newStatus: 'approved' | 'rejected', notes?: string) => {
    try {
      const { error } = await supabase
        .from('releases')
        .update({ 
          status: newStatus, 
          admin_notes: notes || null,
          release_date: newStatus === 'approved' ? new Date().toISOString() : null
        })
        .eq('id', releaseId);

      if (error) throw error;

      setReleases(prev => prev.map(release => 
        release.id === releaseId 
          ? { ...release, status: newStatus, admin_notes: notes || undefined }
          : release
      ));

      toast({
        title: "Success",
        description: `Release ${newStatus} successfully`,
      });

      setSelectedRelease(null);
      setAdminNotes("");
    } catch (error) {
      console.error('Error updating release status:', error);
      toast({
        title: "Error",
        description: "Failed to update release status",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white">Loading releases...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Music Management</h1>
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-md"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search releases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Releases</p>
                  <h3 className="text-2xl font-bold text-white">{releases.length}</h3>
                </div>
                <Music className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending Review</p>
                  <h3 className="text-2xl font-bold text-yellow-400">
                    {releases.filter(r => r.status === 'pending').length}
                  </h3>
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
                  <h3 className="text-2xl font-bold text-green-400">
                    {releases.filter(r => r.status === 'approved').length}
                  </h3>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Rejected</p>
                  <h3 className="text-2xl font-bold text-red-400">
                    {releases.filter(r => r.status === 'rejected').length}
                  </h3>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Releases Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">All Releases</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Song Name</TableHead>
                  <TableHead className="text-gray-300">Artist</TableHead>
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
                    <TableCell className="text-white">{release.song_name}</TableCell>
                    <TableCell className="text-gray-300">{release.artist_name}</TableCell>
                    <TableCell className="text-gray-300">{release.type}</TableCell>
                    <TableCell className="text-gray-300">{release.language}</TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(release.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(release.status)}>
                        {release.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRelease(release);
                                setAdminNotes(release.admin_notes || "");
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-white">Release Details</DialogTitle>
                            </DialogHeader>
                            {selectedRelease && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Song Name</label>
                                    <p className="text-white">{selectedRelease.song_name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Artist</label>
                                    <p className="text-white">{selectedRelease.artist_name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Type</label>
                                    <p className="text-white">{selectedRelease.type}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Language</label>
                                    <p className="text-white">{selectedRelease.language}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Submitted By</label>
                                    <p className="text-white">{selectedRelease.user_name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Status</label>
                                    <Badge className={getStatusColor(selectedRelease.status)}>
                                      {selectedRelease.status}
                                    </Badge>
                                  </div>
                                </div>

                                {selectedRelease.audio_file && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Audio File</label>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Button variant="outline" size="sm">
                                        <Play className="h-4 w-4 mr-2" />
                                        Preview
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {selectedRelease.cover_art && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Cover Art</label>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Button variant="outline" size="sm">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Cover
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                <div>
                                  <label className="text-sm font-medium text-gray-400">Admin Notes</label>
                                  <Textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add notes for this release..."
                                    className="bg-gray-700 border-gray-600 text-white mt-1"
                                    rows={3}
                                  />
                                </div>

                                {selectedRelease.status === 'pending' && (
                                  <div className="flex space-x-2">
                                    <Button
                                      onClick={() => updateReleaseStatus(selectedRelease.id, 'approved', adminNotes)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Approve
                                    </Button>
                                    <Button
                                      onClick={() => updateReleaseStatus(selectedRelease.id, 'rejected', adminNotes)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default MusicManagement;
