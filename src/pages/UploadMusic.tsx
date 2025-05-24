
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, Play, Pause, X, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Artist, Label, INDIAN_LANGUAGES, DISTRIBUTION_PLATFORMS } from "@/types/custom";

const UploadMusic = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverArt, setCoverArt] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ audio: 0, cover: 0 });
  const [lyricsNames, setLyricsNames] = useState<string[]>(['']);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [showNewArtistModal, setShowNewArtistModal] = useState(false);
  const [showNewLabelModal, setShowNewLabelModal] = useState(false);

  const [formData, setFormData] = useState({
    type: '',
    song_name: '',
    artist_id: '',
    instagram_id: '',
    music_producer: '',
    copyright: '',
    publisher: '',
    language: '',
    release_date: '',
    label_id: ''
  });

  useEffect(() => {
    fetchArtistsAndLabels();
  }, [user]);

  const fetchArtistsAndLabels = async () => {
    if (!user) return;

    try {
      const [artistsResponse, labelsResponse] = await Promise.all([
        supabase.from('artists').select('*').eq('user_id', user.id),
        supabase.from('labels').select('*').eq('user_id', user.id)
      ]);

      if (artistsResponse.data) setArtists(artistsResponse.data);
      if (labelsResponse.data) setLabels(labelsResponse.data);
    } catch (error) {
      console.error('Error fetching artists and labels:', error);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload MP3 or WAV files only.",
          variant: "destructive",
        });
        return;
      }
      setAudioFile(file);
      const audio = new Audio(URL.createObjectURL(file));
      setAudioPreview(audio);
    }
  };

  const handleCoverArtUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload JPG or PNG files only.",
          variant: "destructive",
        });
        return;
      }

      // Check image dimensions
      const img = new Image();
      img.onload = () => {
        if (img.width < 3000 || img.height < 3000) {
          toast({
            title: "Image too small",
            description: "Cover art must be at least 3000x3000 pixels.",
            variant: "destructive",
          });
          return;
        }
        setCoverArt(file);
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const toggleAudioPlayback = () => {
    if (!audioPreview) return;

    if (isPlaying) {
      audioPreview.pause();
      setIsPlaying(false);
    } else {
      audioPreview.play();
      setIsPlaying(true);
      audioPreview.onended = () => setIsPlaying(false);
    }
  };

  const addLyricsName = () => {
    setLyricsNames([...lyricsNames, '']);
  };

  const removeLyricsName = (index: number) => {
    setLyricsNames(lyricsNames.filter((_, i) => i !== index));
  };

  const updateLyricsName = (index: number, value: string) => {
    const updated = [...lyricsNames];
    updated[index] = value;
    setLyricsNames(updated);
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const selectAllPlatforms = () => {
    setSelectedPlatforms(DISTRIBUTION_PLATFORMS);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      // Upload files first
      let audioPath = '';
      let coverPath = '';

      if (audioFile) {
        const audioFileName = `${user.id}/${Date.now()}-${audioFile.name}`;
        const { error: audioError } = await supabase.storage
          .from('audio_files')
          .upload(audioFileName, audioFile);
        
        if (audioError) throw audioError;
        audioPath = audioFileName;
      }

      if (coverArt) {
        const coverFileName = `${user.id}/${Date.now()}-${coverArt.name}`;
        const { error: coverError } = await supabase.storage
          .from('cover_art')
          .upload(coverFileName, coverArt);
        
        if (coverError) throw coverError;
        coverPath = coverFileName;
      }

      // Create release record
      const { error: releaseError } = await supabase
        .from('releases')
        .insert({
          user_id: user.id,
          type: formData.type,
          song_name: formData.song_name,
          artist_id: formData.artist_id,
          instagram_id: formData.instagram_id || null,
          lyrics_name: lyricsNames.filter(name => name.trim() !== ''),
          music_producer: formData.music_producer || null,
          copyright: formData.copyright,
          publisher: formData.publisher || null,
          language: formData.language,
          release_date: formData.release_date,
          label_id: formData.label_id,
          audio_file: audioPath,
          cover_art: coverPath,
          platforms: selectedPlatforms,
          status: 'pending'
        });

      if (releaseError) throw releaseError;

      toast({
        title: "Release submitted successfully!",
        description: "Your music has been sent for review. You'll be notified once it's approved.",
      });

      navigate('/my-releases');
    } catch (error: any) {
      console.error('Error submitting release:', error);
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard">
            <Button variant="outline" size="icon" className="text-white border-gray-600">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Upload Music</h1>
            <p className="text-gray-400">Submit your music for distribution</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Basic Information</CardTitle>
              <CardDescription className="text-gray-400">
                Enter the basic details about your release
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type" className="text-white">Release Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select release type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="album">Album</SelectItem>
                      <SelectItem value="ep">EP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="song_name" className="text-white">Song Name *</Label>
                  <Input
                    id="song_name"
                    value={formData.song_name}
                    onChange={(e) => setFormData({...formData, song_name: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Singer Name *</Label>
                  <div className="flex gap-2">
                    <Select value={formData.artist_id} onValueChange={(value) => setFormData({...formData, artist_id: value})}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white flex-1">
                        <SelectValue placeholder="Select artist" />
                      </SelectTrigger>
                      <SelectContent>
                        {artists.map(artist => (
                          <SelectItem key={artist.id} value={artist.id}>{artist.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      type="button" 
                      onClick={() => setShowNewArtistModal(true)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="instagram_id" className="text-white">Instagram ID</Label>
                  <Input
                    id="instagram_id"
                    value={formData.instagram_id}
                    onChange={(e) => setFormData({...formData, instagram_id: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="@username"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Lyrics Names *</Label>
                {lyricsNames.map((name, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={name}
                      onChange={(e) => updateLyricsName(index, e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white flex-1"
                      placeholder="Enter lyricist name"
                      required
                    />
                    {lyricsNames.length > 1 && (
                      <Button 
                        type="button" 
                        onClick={() => removeLyricsName(index)}
                        variant="outline"
                        size="icon"
                        className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  type="button" 
                  onClick={addLyricsName}
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Another Lyricist
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="music_producer" className="text-white">Music Producer</Label>
                  <Input
                    id="music_producer"
                    value={formData.music_producer}
                    onChange={(e) => setFormData({...formData, music_producer: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="publisher" className="text-white">Publisher</Label>
                  <Input
                    id="publisher"
                    value={formData.publisher}
                    onChange={(e) => setFormData({...formData, publisher: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="copyright" className="text-white">Copyright *</Label>
                  <Input
                    id="copyright"
                    value={formData.copyright}
                    onChange={(e) => setFormData({...formData, copyright: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="(C) 2025 Artist Name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="language" className="text-white">Song Language *</Label>
                  <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_LANGUAGES.map(lang => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="release_date" className="text-white">Release Date *</Label>
                  <Input
                    id="release_date"
                    type="datetime-local"
                    value={formData.release_date}
                    onChange={(e) => setFormData({...formData, release_date: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label className="text-white">Label Name *</Label>
                  <div className="flex gap-2">
                    <Select value={formData.label_id} onValueChange={(value) => setFormData({...formData, label_id: value})}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white flex-1">
                        <SelectValue placeholder="Select label" />
                      </SelectTrigger>
                      <SelectContent>
                        {labels.map(label => (
                          <SelectItem key={label.id} value={label.id}>{label.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      type="button" 
                      onClick={() => setShowNewLabelModal(true)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Upload Section */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Upload Files</CardTitle>
              <CardDescription className="text-gray-400">
                Upload your audio file and cover art
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-white">Upload Audio File *</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept=".mp3,.wav"
                    onChange={handleAudioUpload}
                    className="hidden"
                    id="audio-upload"
                    required
                  />
                  <label
                    htmlFor="audio-upload"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">Click to upload audio file</p>
                      <p className="text-xs text-gray-500">MP3 or WAV format</p>
                    </div>
                  </label>
                  {audioFile && (
                    <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-white">{audioFile.name}</span>
                        <Button
                          type="button"
                          onClick={toggleAudioPlayback}
                          variant="outline"
                          size="sm"
                          className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-white">Upload Cover Art *</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleCoverArtUpload}
                    className="hidden"
                    id="cover-upload"
                    required
                  />
                  <label
                    htmlFor="cover-upload"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">Click to upload cover art</p>
                      <p className="text-xs text-gray-500">JPG or PNG, min 3000x3000px</p>
                    </div>
                  </label>
                  {coverArt && (
                    <div className="mt-4">
                      <img
                        src={URL.createObjectURL(coverArt)}
                        alt="Cover art preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Selection */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Select Platforms *</CardTitle>
              <CardDescription className="text-gray-400">
                Choose where you want your music to be distributed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button
                  type="button"
                  onClick={selectAllPlatforms}
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                >
                  Select All Platforms
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {DISTRIBUTION_PLATFORMS.map(platform => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform}
                      checked={selectedPlatforms.includes(platform)}
                      onCheckedChange={() => togglePlatform(platform)}
                      className="border-gray-600"
                    />
                    <label htmlFor={platform} className="text-sm text-white cursor-pointer">
                      {platform}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading || !audioFile || !coverArt || selectedPlatforms.length === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? "Submitting..." : "Send to Review"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadMusic;
