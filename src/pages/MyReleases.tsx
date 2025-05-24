
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Music, Search, Eye, Download } from "lucide-react";
import { Release } from "@/types/custom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const MyReleases = () => {
  const { user } = useAuth();
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReleases();
  }, [user]);

  const fetchReleases = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('releases')
        .select(`
          *,
          artists(name),
          labels(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReleases(data || []);
    } catch (error: any) {
      console.error('Error fetching releases:', error);
      toast({
        title: "Failed to load releases",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredReleases = releases.filter(release =>
    release.song_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    release.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    release.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-900 text-green-300';
      case 'live': return 'bg-blue-900 text-blue-300';
      case 'pending': return 'bg-yellow-900 text-yellow-300';
      case 'rejected': return 'bg-red-900 text-red-300';
      case 'takedown_requested': return 'bg-orange-900 text-orange-300';
      case 'takedown_completed': return 'bg-gray-900 text-gray-300';
      default: return 'bg-gray-900 text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-white">Loading your releases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard">
            <Button variant="outline" size="icon" className="text-white border-gray-600">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">My Releases</h1>
            <p className="text-gray-400">Manage and track your music releases</p>
          </div>
          <Link to="/upload-music">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Upload New Music
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search releases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>

        {filteredReleases.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-12">
              <Music className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No releases found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm ? "No releases match your search criteria." : "You haven't uploaded any music yet."}
              </p>
              <Link to="/upload-music">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Upload Your First Track
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredReleases.map((release) => (
              <Card key={release.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Cover Art */}
                    <div className="w-full md:w-32 h-32 bg-gray-700 rounded-lg overflow-hidden">
                      {release.cover_art ? (
                        <img
                          src={`https://bifsslngdjrcxawbcend.supabase.co/storage/v1/object/public/cover_art/${release.cover_art}`}
                          alt={release.song_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music className="h-8 w-8 text-gray-500" />
                        </div>
                      )}
                    </div>

                    {/* Release Info */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{release.song_name}</h3>
                          <p className="text-gray-400 mb-2">
                            {release.type.charAt(0).toUpperCase() + release.type.slice(1)}
                            {release.artists && ` • ${release.artists.name}`}
                          </p>
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(release.status)}`}>
                            {release.status.replace('_', ' ').toUpperCase()}
                          </div>
                        </div>
                        <div className="text-right mt-4 md:mt-0">
                          <p className="text-sm text-gray-400">Release Date</p>
                          <p className="text-white">{new Date(release.release_date).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Language</p>
                          <p className="text-white">{release.language}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Label</p>
                          <p className="text-white">{release.labels?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Platforms</p>
                          <p className="text-white">{release.platforms?.length || 0} platforms</p>
                        </div>
                      </div>

                      {/* Lyrics Names */}
                      {release.lyrics_name && release.lyrics_name.length > 0 && (
                        <div className="mt-4">
                          <p className="text-gray-400 text-sm">Lyrics by: {release.lyrics_name.join(', ')}</p>
                        </div>
                      )}

                      {/* Admin Notes */}
                      {release.admin_notes && (
                        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                          <p className="text-gray-400 text-sm mb-1">Admin Notes:</p>
                          <p className="text-white text-sm">{release.admin_notes}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:text-white">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {release.audio_file && (
                          <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:text-white">
                            <Download className="h-4 w-4 mr-2" />
                            Download Audio
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReleases;
