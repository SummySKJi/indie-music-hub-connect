
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile, Wallet, Release, Artist, Label } from "@/types/custom";
import { Music, DollarSign, FileText, User, Plus, BarChart2, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

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
        // For development purposes, using mock data
        // In production, these would be replaced with actual database queries
        
        // Mock profile data
        const mockProfile: UserProfile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || 'User',
          email: user.email || '',
          phone: null,
          whatsapp: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProfile(mockProfile);

        // Mock wallet data
        const mockWallet: Wallet = {
          id: '1',
          user_id: user.id,
          balance: 5000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setWallet(mockWallet);

        // Mock releases data
        const mockReleases: Release[] = [
          {
            id: '1',
            user_id: user.id,
            type: 'single',
            song_name: 'Summer Vibes',
            artist_id: '1',
            lyrics_name: ['Summer Lyrics'],
            copyright: 'Copyright 2025',
            language: 'English',
            release_date: new Date().toISOString(),
            label_id: '1',
            audio_file: 'audio1.mp3',
            cover_art: null,
            platforms: ['Spotify', 'Apple Music'],
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            user_id: user.id,
            type: 'album',
            song_name: 'Winter Chill',
            artist_id: '2',
            lyrics_name: ['Winter Lyrics'],
            copyright: 'Copyright 2025',
            language: 'English',
            release_date: new Date().toISOString(),
            label_id: '1',
            audio_file: 'audio2.mp3',
            cover_art: null,
            platforms: ['Spotify', 'Apple Music'],
            status: 'approved',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        setReleases(mockReleases);

        // Mock artists data
        const mockArtists: Artist[] = [
          {
            id: '1',
            user_id: user.id,
            name: 'DJ Cool',
            email: 'dj@example.com',
            phone: '1234567890',
            country: 'India',
            genres: ['Electronic', 'Pop'],
            languages: ['English', 'Hindi'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            user_id: user.id,
            name: 'Ice Beats',
            email: 'ice@example.com',
            phone: '0987654321',
            country: 'India',
            genres: ['Hip Hop', 'Rap'],
            languages: ['English', 'Hindi'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        setArtists(mockArtists);

        // Mock labels data
        const mockLabels: Label[] = [
          {
            id: '1',
            user_id: user.id,
            name: 'Cool Records',
            email: 'cool@example.com',
            phone: '1234567890',
            country: 'India',
            genres: ['Electronic', 'Pop'],
            languages: ['English', 'Hindi'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        setLabels(mockLabels);

        // Once your database tables are properly set up, you can uncomment these queries:
        /*
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
        
        if (!walletError) {
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

        // If wallet doesn't exist, create one
        if (!walletData && !walletError?.message.includes('Results contain 0 rows')) {
          await supabase.from('wallet').insert([{ user_id: user.id, balance: 0 }]);
        }
        */

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
          <Button className="py-6 bg-purple-800 hover:bg-purple-700 flex items-center justify-center gap-2">
            <Plus className="h-5 w-5" /> New Release
          </Button>
          <Button className="py-6 bg-blue-800 hover:bg-blue-700 flex items-center justify-center gap-2">
            <User className="h-5 w-5" /> Add Artist
          </Button>
          <Button className="py-6 bg-green-800 hover:bg-green-700 flex items-center justify-center gap-2">
            <Shield className="h-5 w-5" /> Request OAC
          </Button>
          <Button className="py-6 bg-orange-800 hover:bg-orange-700 flex items-center justify-center gap-2">
            <BarChart2 className="h-5 w-5" /> View Analytics
          </Button>
        </div>
      </div>
      
      {/* Recent Releases */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Recent Releases</h2>
          <Button variant="outline" className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-white">
            View All
          </Button>
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
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">{release.song_name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {release.type.charAt(0).toUpperCase() + release.type.slice(1)} • {new Date(release.release_date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-white">
                    {release.status.toUpperCase()}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
              <Music className="h-12 w-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No releases yet. Create your first release!</p>
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" /> Create Release
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Artists & Labels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Your Artists</h2>
            <Button variant="outline" className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-white">
              View All
            </Button>
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
                <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" /> Add Artist
                </Button>
              </CardContent>
            )}
          </Card>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Your Labels</h2>
            <Button variant="outline" className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-white">
              View All
            </Button>
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
                <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" /> Add Label
                </Button>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
