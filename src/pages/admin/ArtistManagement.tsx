
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Search, Eye, Edit, Trash2, Users, UserCheck, Globe, Music
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Artist {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  languages: string[];
  genres: string[] | null;
  created_at: string;
  user_id: string | null;
  bio: string | null;
  website: string | null;
  instagram_id: string | null;
  youtube_channel: string | null;
  spotify_profile: string | null;
  apple_music_profile: string | null;
}

const ArtistManagement = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const { data: artistsData, error } = await supabase
        .from('artists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setArtists(artistsData || []);
    } catch (error) {
      console.error('Error fetching artists:', error);
      toast({
        title: "Error",
        description: "Failed to fetch artists",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredArtists = artists.filter(artist => 
    artist.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white">Loading artists...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Artist Management</h1>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Artists</p>
                  <h3 className="text-2xl font-bold text-white">{artists.length}</h3>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">With Social Media</p>
                  <h3 className="text-2xl font-bold text-green-400">
                    {artists.filter(a => a.instagram_id || a.youtube_channel).length}
                  </h3>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">With Website</p>
                  <h3 className="text-2xl font-bold text-purple-400">
                    {artists.filter(a => a.website).length}
                  </h3>
                </div>
                <Globe className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Music Platforms</p>
                  <h3 className="text-2xl font-bold text-orange-400">
                    {artists.filter(a => a.spotify_profile || a.apple_music_profile).length}
                  </h3>
                </div>
                <Music className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Artists Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">All Artists</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Name</TableHead>
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Country</TableHead>
                  <TableHead className="text-gray-300">Languages</TableHead>
                  <TableHead className="text-gray-300">Genres</TableHead>
                  <TableHead className="text-gray-300">Joined</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArtists.map((artist) => (
                  <TableRow key={artist.id} className="border-gray-700">
                    <TableCell className="text-white">{artist.name}</TableCell>
                    <TableCell className="text-gray-300">{artist.email}</TableCell>
                    <TableCell className="text-gray-300">{artist.country}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {artist.languages?.slice(0, 2).map((lang, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                        {artist.languages?.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{artist.languages.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {artist.genres?.slice(0, 2).map((genre, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                        {artist.genres && artist.genres.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{artist.genres.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(artist.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedArtist(artist)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-white">Artist Details</DialogTitle>
                            </DialogHeader>
                            {selectedArtist && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Name</label>
                                    <p className="text-white">{selectedArtist.name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Email</label>
                                    <p className="text-white">{selectedArtist.email}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Phone</label>
                                    <p className="text-white">{selectedArtist.phone}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Country</label>
                                    <p className="text-white">{selectedArtist.country}</p>
                                  </div>
                                </div>

                                {selectedArtist.bio && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Bio</label>
                                    <p className="text-white text-sm">{selectedArtist.bio}</p>
                                  </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                  {selectedArtist.website && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-400">Website</label>
                                      <p className="text-blue-400">{selectedArtist.website}</p>
                                    </div>
                                  )}
                                  {selectedArtist.instagram_id && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-400">Instagram</label>
                                      <p className="text-pink-400">@{selectedArtist.instagram_id}</p>
                                    </div>
                                  )}
                                  {selectedArtist.youtube_channel && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-400">YouTube</label>
                                      <p className="text-red-400">{selectedArtist.youtube_channel}</p>
                                    </div>
                                  )}
                                  {selectedArtist.spotify_profile && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-400">Spotify</label>
                                      <p className="text-green-400">{selectedArtist.spotify_profile}</p>
                                    </div>
                                  )}
                                </div>
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

export default ArtistManagement;
