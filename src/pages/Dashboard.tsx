
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile, Wallet, Release, Artist, Label } from "@/types/custom";
import { Music, DollarSign, FileText, User, Plus, BarChart2, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [releases, setReleases] = useState<Release[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch wallet
        const { data: walletData, error: walletError } = await supabase
          .from('wallet')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (!walletError && walletData) {
          setWallet(walletData);
        }

        // Fetch releases
        const { data: releasesData, error: releasesError } = await supabase
          .from('releases')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (!releasesError && releasesData) {
          setReleases(releasesData);
        }

        // Fetch artists
        const { data: artistsData, error: artistsError } = await supabase
          .from('artists')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (!artistsError && artistsData) {
          setArtists(artistsData);
        }

        // Fetch labels
        const { data: labelsData, error: labelsError } = await supabase
          .from('labels')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (!labelsError && labelsData) {
          setLabels(labelsData);
        }

      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Failed to load data",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {profile?.full_name || user?.email}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="outline" onClick={() => signOut()} className="text-white border-gray-600">
            Sign Out
          </Button>
        </div>
      </header>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Releases</p>
                <h3 className="text-3xl font-bold text-white">{releases.length}</h3>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Artists</p>
                <h3 className="text-3xl font-bold text-white">{artists.length}</h3>
              </div>
              <Music className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Labels</p>
                <h3 className="text-3xl font-bold text-white">{labels.length}</h3>
              </div>
              <Globe className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Wallet Balance</p>
                <h3 className="text-3xl font-bold text-white">₹{wallet?.balance || 0}</h3>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/upload-music">
            <Button className="py-6 bg-purple-800 hover:bg-purple-700 flex items-center justify-center gap-2 w-full">
              <Plus className="h-5 w-5" /> Upload Music
            </Button>
          </Link>
          <Link to="/management">
            <Button className="py-6 bg-blue-800 hover:bg-blue-700 flex items-center justify-center gap-2 w-full">
              <User className="h-5 w-5" /> Manage Artists
            </Button>
          </Link>
          <Link to="/oac-request">
            <Button className="py-6 bg-green-800 hover:bg-green-700 flex items-center justify-center gap-2 w-full">
              <Shield className="h-5 w-5" /> Request OAC
            </Button>
          </Link>
          <Link to="/wallet">
            <Button className="py-6 bg-orange-800 hover:bg-orange-700 flex items-center justify-center gap-2 w-full">
              <BarChart2 className="h-5 w-5" /> View Wallet
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Recent Releases */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Recent Releases</h2>
          <Link to="/my-releases">
            <Button variant="outline" className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-white">
              View All
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {releases.length > 0 ? (
            releases.slice(0, 3).map(release => (
              <Card key={release.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                {release.cover_art && (
                  <div className="w-full h-48 bg-gray-700">
                    <img 
                      src={`https://bifsslngdjrcxawbcend.supabase.co/storage/v1/object/public/cover_art/${release.cover_art}`} 
                      alt={release.song_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
                {!release.cover_art && (
                  <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                    <Music className="h-12 w-12 text-gray-500" />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">{release.song_name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {release.type.charAt(0).toUpperCase() + release.type.slice(1)} • {new Date(release.release_date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    release.status === 'approved' ? 'bg-green-900 text-green-300' : 
                    release.status === 'live' ? 'bg-blue-900 text-blue-300' :
                    release.status === 'pending' ? 'bg-yellow-900 text-yellow-300' : 
                    'bg-red-900 text-red-300'
                  }`}>
                    {release.status.toUpperCase()}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
              <Music className="h-12 w-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No releases yet. Upload your first track!</p>
              <Link to="/upload-music">
                <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" /> Upload Music
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Artists & Labels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Your Artists</h2>
            <Link to="/management">
              <Button variant="outline" className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-white">
                View All
              </Button>
            </Link>
          </div>
          
          <Card className="bg-gray-800 border-gray-700">
            {artists.length > 0 ? (
              <div className="divide-y divide-gray-700">
                {artists.slice(0, 4).map(artist => (
                  <div key={artist.id} className="p-4 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                      <span className="text-white font-bold">{artist.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{artist.name}</h4>
                      <p className="text-sm text-gray-400">{artist.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <CardContent className="text-center py-8">
                <User className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">No artists added yet.</p>
                <Link to="/management">
                  <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" /> Add Artist
                  </Button>
                </Link>
              </CardContent>
            )}
          </Card>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Your Labels</h2>
            <Link to="/management">
              <Button variant="outline" className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-white">
                View All
              </Button>
            </Link>
          </div>
          
          <Card className="bg-gray-800 border-gray-700">
            {labels.length > 0 ? (
              <div className="divide-y divide-gray-700">
                {labels.slice(0, 4).map(label => (
                  <div key={label.id} className="p-4 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                      <span className="text-white font-bold">{label.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{label.name}</h4>
                      <p className="text-sm text-gray-400">{label.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <CardContent className="text-center py-8">
                <Globe className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">No labels added yet.</p>
                <Link to="/management">
                  <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" /> Add Label
                  </Button>
                </Link>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
