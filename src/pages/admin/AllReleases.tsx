
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
import { Search, Filter, Download, Edit, Eye, Play, Music, Calendar, User } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Release {
  id: string;
  song_name: string;
  artist_name: string;
  label_name: string;
  release_date: string | null;
  status: string;
  platforms: string[];
  user_email: string;
  user_name: string;
  created_at: string;
  type: string;
  language: string;
  cover_art: string;
  audio_file: string;
  admin_notes: string;
}

const AllReleases = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    try {
      setLoading(true);
      
      // First fetch releases
      const { data: releasesData, error: releasesError } = await supabase
        .from('releases')
        .select('*')
        .order('created_at', { ascending: false });

      if (releasesError) {
        console.error('Error fetching releases:', releasesError);
        toast({
          title: "Error loading releases",
          description: releasesError.message,
          variant: "destructive",
        });
        return;
      }

      // Then fetch related data separately
      const [artistsResult, labelsResult, profilesResult] = await Promise.all([
        supabase.from('artists').select('id, name'),
        supabase.from('labels').select('id, name'),
        supabase.from('profiles').select('id, email, full_name')
      ]);

      // Create lookup maps
      const artistsMap = new Map();
      const labelsMap = new Map();
      const profilesMap = new Map();

      if (artistsResult.data) {
        artistsResult.data.forEach(artist => {
          artistsMap.set(artist.id, artist.name);
        });
      }

      if (labelsResult.data) {
        labelsResult.data.forEach(label => {
          labelsMap.set(label.id, label.name);
        });
      }

      if (profilesResult.data) {
        profilesResult.data.forEach(profile => {
          profilesMap.set(profile.id, { email: profile.email, name: profile.full_name });
        });
      }

      // Transform the data
      const transformedReleases: Release[] = (releasesData || []).map(release => {
        const userInfo = release.user_id ? profilesMap.get(release.user_id) : null;
        return {
          id: release.id,
          song_name: release.song_name || 'Untitled',
          artist_name: release.artist_id ? artistsMap.get(release.artist_id) || 'Unknown Artist' : 'Unknown Artist',
          label_name: release.label_id ? labelsMap.get(release.label_id) || 'Independent' : 'Independent',
          release_date: release.release_date,
          status: release.status || 'pending',
          platforms: release.platforms || [],
          user_email: userInfo?.email || 'Unknown',
          user_name: userInfo?.name || 'Unknown User',
          created_at: release.created_at,
          type: release.type || 'Single',
          language: release.language || 'Not specified',
          cover_art: release.cover_art || '',
          audio_file: release.audio_file || '',
          admin_notes: release.admin_notes || ''
        };
      });

      setReleases(transformedReleases);
    } catch (error: any) {
      console.error('Error in fetchReleases:', error);
      toast({
        title: "Error loading releases",
        description: "Failed to load release data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      live: "default",
      approved: "secondary", 
      rejected: "destructive",
      pending: "outline"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const filteredReleases = releases.filter(release =>
    release.song_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    release.artist_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    release.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    release.user_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-white">Loading releases...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">All Customer Releases</h1>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={fetchReleases}>
              <Filter className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Music Release Management</CardTitle>
            <CardDescription className="text-gray-400">
              View and manage all customer music uploads and releases
            </CardDescription>
            <div className="flex space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search releases by song, artist, or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredReleases.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Release Details</TableHead>
                    <TableHead className="text-gray-300">Artist</TableHead>
                    <TableHead className="text-gray-300">Customer</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Upload Date</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReleases.map((release) => (
                    <TableRow key={release.id} className="border-gray-700">
                      <TableCell className="text-white">
                        <div className="flex items-center space-x-3">
                          {release.cover_art && (
                            <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                              <img
                                src={`${supabase.storage.from('cover_art').getPublicUrl(release.cover_art).data.publicUrl}`}
                                alt={release.song_name}
                                className="w-full h-full object-cover rounded"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.parentElement!.innerHTML = '<Music class="h-6 w-6 text-gray-400" />';
                                }}
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{release.song_name}</div>
                            <div className="text-sm text-gray-400">{release.type} • {release.language}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div>
                          <div>{release.artist_name}</div>
                          <div className="text-sm text-gray-400">{release.label_name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div>
                          <div>{release.user_name}</div>
                          <div className="text-sm text-gray-400">{release.user_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(release.status)}</TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(release.created_at).toLocaleDateString()}
                      </TableCell>
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
                            <DialogContent className="bg-gray-800 border-gray-700 max-w-3xl">
                              <DialogHeader>
                                <DialogTitle className="text-white">Release Details</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                  Complete information about this customer's music release
                                </DialogDescription>
                              </DialogHeader>
                              {selectedRelease && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Song Name</label>
                                      <Input value={selectedRelease.song_name} className="bg-gray-700 border-gray-600 text-white" readOnly />
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Artist</label>
                                      <Input value={selectedRelease.artist_name} className="bg-gray-700 border-gray-600 text-white" readOnly />
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Type</label>
                                      <Input value={selectedRelease.type} className="bg-gray-700 border-gray-600 text-white" readOnly />
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Language</label>
                                      <Input value={selectedRelease.language} className="bg-gray-700 border-gray-600 text-white" readOnly />
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Customer</label>
                                      <Input value={`${selectedRelease.user_name} (${selectedRelease.user_email})`} className="bg-gray-700 border-gray-600 text-white" readOnly />
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Status</label>
                                      <Input value={selectedRelease.status} className="bg-gray-700 border-gray-600 text-white" readOnly />
                                    </div>
                                  </div>

                                  {selectedRelease.platforms && selectedRelease.platforms.length > 0 && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Platforms</label>
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        {selectedRelease.platforms.map((platform, index) => (
                                          <Badge key={index} variant="secondary">
                                            {platform}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

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

                                  {selectedRelease.admin_notes && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Admin Notes</label>
                                      <div className="bg-gray-700 border-gray-600 text-white p-2 rounded mt-1">
                                        {selectedRelease.admin_notes}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <Music className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No releases found</p>
                <p className="text-sm text-gray-500 mt-2">
                  {searchTerm ? "Try adjusting your search terms" : "Customer releases will appear here when music is uploaded"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AllReleases;
