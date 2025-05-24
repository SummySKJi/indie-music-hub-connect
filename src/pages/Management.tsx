import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Edit, Trash2, Music, Building2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Artist, MusicLabel, INDIAN_LANGUAGES, MUSIC_GENRES } from "@/types/custom";

const Management = () => {
  const { user } = useAuth();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [labels, setLabels] = useState<MusicLabel[]>([]);
  const [loading, setLoading] = useState(false);
  const [showArtistModal, setShowArtistModal] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [editingLabel, setEditingLabel] = useState<MusicLabel | null>(null);

  const [artistForm, setArtistForm] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    website: '',
    gender: '',
    youtube_channel: '',
    instagram_id: '',
    facebook_page: '',
    bio: '',
    spotify_profile: '',
    apple_music_profile: '',
    country: '',
    genres: [] as string[],
    languages: [] as string[]
  });

  const [labelForm, setLabelForm] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    website: '',
    youtube_channel: '',
    instagram_id: '',
    facebook_page: '',
    bio: '',
    country: '',
    genres: [] as string[],
    languages: [] as string[]
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const [artistsResponse, labelsResponse] = await Promise.all([
        supabase.from('artists').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('labels').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      ]);

      if (artistsResponse.data) setArtists(artistsResponse.data);
      if (labelsResponse.data) setLabels(labelsResponse.data);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Failed to load data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetArtistForm = () => {
    setArtistForm({
      name: '',
      email: '',
      phone: '',
      whatsapp: '',
      website: '',
      gender: '',
      youtube_channel: '',
      instagram_id: '',
      facebook_page: '',
      bio: '',
      spotify_profile: '',
      apple_music_profile: '',
      country: '',
      genres: [],
      languages: []
    });
    setEditingArtist(null);
  };

  const resetLabelForm = () => {
    setLabelForm({
      name: '',
      email: '',
      phone: '',
      whatsapp: '',
      website: '',
      youtube_channel: '',
      instagram_id: '',
      facebook_page: '',
      bio: '',
      country: '',
      genres: [],
      languages: []
    });
    setEditingLabel(null);
  };

  const handleArtistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const artistData = {
        ...artistForm,
        user_id: user.id
      };

      if (editingArtist) {
        const { error } = await supabase
          .from('artists')
          .update(artistData)
          .eq('id', editingArtist.id);
        
        if (error) throw error;
        toast({ title: "Artist updated successfully!" });
      } else {
        const { error } = await supabase
          .from('artists')
          .insert(artistData);
        
        if (error) throw error;
        toast({ title: "Artist created successfully!" });
      }

      setShowArtistModal(false);
      resetArtistForm();
      fetchData();
    } catch (error: any) {
      console.error('Error saving artist:', error);
      toast({
        title: "Failed to save artist",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLabelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const labelData = {
        ...labelForm,
        user_id: user.id
      };

      if (editingLabel) {
        const { error } = await supabase
          .from('labels')
          .update(labelData)
          .eq('id', editingLabel.id);
        
        if (error) throw error;
        toast({ title: "Label updated successfully!" });
      } else {
        const { error } = await supabase
          .from('labels')
          .insert(labelData);
        
        if (error) throw error;
        toast({ title: "Label created successfully!" });
      }

      setShowLabelModal(false);
      resetLabelForm();
      fetchData();
    } catch (error: any) {
      console.error('Error saving label:', error);
      toast({
        title: "Failed to save label",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const editArtist = (artist: Artist) => {
    setArtistForm(artist);
    setEditingArtist(artist);
    setShowArtistModal(true);
  };

  const editLabel = (label: MusicLabel) => {
    setLabelForm(label);
    setEditingLabel(label);
    setShowLabelModal(true);
  };

  const deleteArtist = async (id: string) => {
    if (!confirm("Are you sure you want to delete this artist?")) return;

    try {
      const { error } = await supabase
        .from('artists')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Artist deleted successfully!" });
      fetchData();
    } catch (error: any) {
      console.error('Error deleting artist:', error);
      toast({
        title: "Failed to delete artist",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteLabel = async (id: string) => {
    if (!confirm("Are you sure you want to delete this label?")) return;

    try {
      const { error } = await supabase
        .from('labels')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Label deleted successfully!" });
      fetchData();
    } catch (error: any) {
      console.error('Error deleting label:', error);
      toast({
        title: "Failed to delete label",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-white">Loading management data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard">
            <Button variant="outline" size="icon" className="text-white border-gray-600">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Management</h1>
            <p className="text-gray-400">Manage your artists and music labels</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Artists Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Music className="h-6 w-6" />
                Artists
              </h2>
              <Dialog open={showArtistModal} onOpenChange={setShowArtistModal}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setEditingArtist(null);
                      resetArtistForm();
                    }}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Artist
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-gray-800 border-gray-700 max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      {editingArtist ? 'Edit Artist' : 'Add New Artist'}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      {editingArtist ? 'Update artist information' : 'Create a new artist profile'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleArtistSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="artist-name" className="text-white">Artist Name *</Label>
                        <Input
                          id="artist-name"
                          value={artistForm.name}
                          onChange={(e) => setArtistForm({...artistForm, name: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="artist-email" className="text-white">Email *</Label>
                        <Input
                          id="artist-email"
                          type="email"
                          value={artistForm.email}
                          onChange={(e) => setArtistForm({...artistForm, email: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="artist-phone" className="text-white">Phone *</Label>
                        <Input
                          id="artist-phone"
                          value={artistForm.phone}
                          onChange={(e) => setArtistForm({...artistForm, phone: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="artist-whatsapp" className="text-white">WhatsApp</Label>
                        <Input
                          id="artist-whatsapp"
                          value={artistForm.whatsapp}
                          onChange={(e) => setArtistForm({...artistForm, whatsapp: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="artist-gender" className="text-white">Gender</Label>
                        <Select value={artistForm.gender} onValueChange={(value) => setArtistForm({...artistForm, gender: value})}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="artist-country" className="text-white">Country *</Label>
                        <Input
                          id="artist-country"
                          value={artistForm.country}
                          onChange={(e) => setArtistForm({...artistForm, country: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="artist-bio" className="text-white">Bio</Label>
                      <Textarea
                        id="artist-bio"
                        value={artistForm.bio}
                        onChange={(e) => setArtistForm({...artistForm, bio: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowArtistModal(false)}
                        className="border-gray-600 text-gray-400 hover:text-white"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                        {editingArtist ? 'Update Artist' : 'Create Artist'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {artists.length === 0 ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="text-center py-12">
                  <User className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No artists yet</h3>
                  <p className="text-gray-400 mb-6">Create your first artist profile to get started.</p>
                  <Button onClick={() => setShowArtistModal(true)} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" /> Add Your First Artist
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artists.map((artist) => (
                  <Card key={artist.id} className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mb-2">
                          <span className="text-white font-bold text-lg">{artist.name.charAt(0)}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => editArtist(artist)} variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => deleteArtist(artist.id)} variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-white">{artist.name}</CardTitle>
                      <CardDescription className="text-gray-400">{artist.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-400">Country:</span>
                          <span className="text-white ml-2">{artist.country}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Languages:</span>
                          <span className="text-white ml-2">{artist.languages.join(', ')}</span>
                        </div>
                        {artist.genres.length > 0 && (
                          <div>
                            <span className="text-gray-400">Genres:</span>
                            <span className="text-white ml-2">{artist.genres.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Labels Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                Music Labels
              </h2>
              <Dialog open={showLabelModal} onOpenChange={setShowLabelModal}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setEditingLabel(null);
                      resetLabelForm();
                    }}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Label
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-gray-800 border-gray-700 max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      {editingLabel ? 'Edit Label' : 'Add New Label'}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      {editingLabel ? 'Update label information' : 'Create a new label profile'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleLabelSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="label-name" className="text-white">Label Name *</Label>
                        <Input
                          id="label-name"
                          value={labelForm.name}
                          onChange={(e) => setLabelForm({...labelForm, name: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="label-email" className="text-white">Email *</Label>
                        <Input
                          id="label-email"
                          type="email"
                          value={labelForm.email}
                          onChange={(e) => setLabelForm({...labelForm, email: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="label-phone" className="text-white">Phone *</Label>
                        <Input
                          id="label-phone"
                          value={labelForm.phone}
                          onChange={(e) => setLabelForm({...labelForm, phone: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="label-country" className="text-white">Country *</Label>
                        <Input
                          id="label-country"
                          value={labelForm.country}
                          onChange={(e) => setLabelForm({...labelForm, country: e.target.value})}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="label-bio" className="text-white">Bio</Label>
                      <Textarea
                        id="label-bio"
                        value={labelForm.bio}
                        onChange={(e) => setLabelForm({...labelForm, bio: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowLabelModal(false)}
                        className="border-gray-600 text-gray-400 hover:text-white"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                        {editingLabel ? 'Update Label' : 'Create Label'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {labels.length === 0 ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="text-center py-12">
                  <Globe className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No labels yet</h3>
                  <p className="text-gray-400 mb-6">Create your first label to get started.</p>
                  <Button onClick={() => setShowLabelModal(true)} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" /> Add Your First Label
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {labels.map((label) => (
                  <Card key={label.id} className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mb-2">
                          <span className="text-white font-bold text-lg">{label.name.charAt(0)}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => editLabel(label)} variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => deleteLabel(label.id)} variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-white">{label.name}</CardTitle>
                      <CardDescription className="text-gray-400">{label.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-400">Country:</span>
                          <span className="text-white ml-2">{label.country}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Languages:</span>
                          <span className="text-white ml-2">{label.languages.join(', ')}</span>
                        </div>
                        {label.genres.length > 0 && (
                          <div>
                            <span className="text-gray-400">Genres:</span>
                            <span className="text-white ml-2">{label.genres.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Management;
