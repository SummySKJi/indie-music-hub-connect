import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Music, Calendar, User, Building2, Play, Download, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Release } from "@/types/custom";
import CustomerLayout from "@/components/customer/CustomerLayout";

const MyReleases = () => {
  const { user } = useAuth();
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReleases();
    }
  }, [user]);

  const fetchReleases = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('releases')
        .select(`
          *,
          artists:artist_id (name),
          labels:label_id (name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        const typedReleases: Release[] = data.map(release => ({
          ...release,
          type: release.type as 'single' | 'album' | 'ep',
          status: release.status as 'pending' | 'approved' | 'rejected' | 'live' | 'takedown_requested' | 'takedown_completed',
          artists: release.artists as any,
          labels: release.labels as any
        }));
        setReleases(typedReleases);
      }
    } catch (error) {
      console.error('Error fetching releases:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'live': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Calendar className="h-4 w-4" />;
      case 'approved': return <Play className="h-4 w-4" />;
      case 'rejected': return <ArrowLeft className="h-4 w-4" />;
      case 'live': return <Music className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-lg">Loading your releases...</div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">My Releases</h1>
            <p className="text-gray-400">Track and manage your music releases</p>
          </div>
          <Link to="/upload-music">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Upload New Track
            </Button>
          </Link>
        </div>

        {releases.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-12">
              <Music className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Releases Yet</h3>
              <p className="text-gray-400 mb-6">Start your music journey by uploading your first track</p>
              <Link to="/upload-music">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Upload Your First Track
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {releases.map((release) => (
              <Card key={release.id} className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-colors">
                <CardHeader className="pb-3">
                  {release.cover_art && (
                    <div className="aspect-square w-full mb-4 rounded-lg overflow-hidden">
                      <img
                        src={`${supabase.storage.from('cover_art').getPublicUrl(release.cover_art).data.publicUrl}`}
                        alt={release.song_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg truncate">{release.song_name}</CardTitle>
                    <Badge className={`${getStatusColor(release.status)} text-white flex items-center gap-1`}>
                      {getStatusIcon(release.status)}
                      {release.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-300">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{release.artists?.name || 'Unknown Artist'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-300">
                    <Building2 className="h-4 w-4" />
                    <span className="text-sm">{release.labels?.name || 'Unknown Label'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {new Date(release.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-300">
                    <Music className="h-4 w-4" />
                    <span className="text-sm capitalize">{release.type}</span>
                  </div>

                  {release.platforms && release.platforms.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs text-gray-400 mb-2">Platforms ({release.platforms.length})</p>
                      <div className="flex flex-wrap gap-1">
                        {release.platforms.slice(0, 3).map((platform) => (
                          <Badge key={platform} variant="secondary" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                        {release.platforms.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{release.platforms.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {release.admin_notes && (
                    <div className="pt-2">
                      <p className="text-xs text-gray-400 mb-1">Admin Notes:</p>
                      <p className="text-xs text-gray-300 bg-gray-700 p-2 rounded">
                        {release.admin_notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default MyReleases;
