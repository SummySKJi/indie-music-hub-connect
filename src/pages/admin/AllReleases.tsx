
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Search, Filter, Download, Edit, Eye } from "lucide-react";
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
  created_at: string;
}

const AllReleases = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

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
        supabase.from('profiles').select('id, email')
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
          profilesMap.set(profile.id, profile.email);
        });
      }

      // Transform the data
      const transformedReleases: Release[] = (releasesData || []).map(release => ({
        id: release.id,
        song_name: release.song_name || 'Untitled',
        artist_name: release.artist_id ? artistsMap.get(release.artist_id) || 'Unknown Artist' : 'Unknown Artist',
        label_name: release.label_id ? labelsMap.get(release.label_id) || 'Independent' : 'Independent',
        release_date: release.release_date,
        status: release.status || 'pending',
        platforms: release.platforms || [],
        user_email: release.user_id ? profilesMap.get(release.user_id) || 'Unknown' : 'Unknown',
        created_at: release.created_at
      }));

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
    release.user_email.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-white">All Releases</h1>
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
            <CardTitle className="text-white">Release Management</CardTitle>
            <CardDescription className="text-gray-400">
              View and manage all music releases across all platforms
            </CardDescription>
            <div className="flex space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search releases..."
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
                    <TableHead className="text-gray-300">Label</TableHead>
                    <TableHead className="text-gray-300">User</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Platforms</TableHead>
                    <TableHead className="text-gray-300">Submit Date</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReleases.map((release) => (
                    <TableRow key={release.id} className="border-gray-700">
                      <TableCell className="text-white">
                        <div className="font-medium">{release.song_name}</div>
                      </TableCell>
                      <TableCell className="text-gray-300">{release.artist_name}</TableCell>
                      <TableCell className="text-gray-300">{release.label_name}</TableCell>
                      <TableCell className="text-gray-300">{release.user_email}</TableCell>
                      <TableCell>{getStatusBadge(release.status)}</TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex flex-wrap gap-1">
                          {release.platforms.length > 0 ? (
                            release.platforms.map((platform, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {platform}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500 text-xs">No platforms</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(release.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
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
                <p className="text-gray-400">No releases found</p>
                <p className="text-sm text-gray-500 mt-2">
                  {searchTerm ? "Try adjusting your search terms" : "Releases will appear here when customers submit music"}
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
