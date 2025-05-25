
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Flag, ExternalLink, Plus } from "lucide-react";
import CustomerLayout from "@/components/customer/CustomerLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const CopyrightRemoval = () => {
  const { user } = useAuth();
  const [releases, setReleases] = useState([]);
  const [labels, setLabels] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    release_id: '',
    youtube_video_link: '',
    label_id: ''
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch live releases
      const { data: releasesData } = await supabase
        .from('releases')
        .select('id, song_name')
        .eq('user_id', user.id)
        .eq('status', 'live');

      // Fetch user's labels
      const { data: labelsData } = await supabase
        .from('labels')
        .select('id, name')
        .eq('user_id', user.id);

      // Fetch takedown requests
      const { data: requestsData } = await supabase
        .from('takedown_requests')
        .select(`
          *,
          releases:release_id(song_name),
          labels:label_id(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setReleases(releasesData || []);
      setLabels(labelsData || []);
      setRequests(requestsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (!user) return;

    if (!formData.release_id || !formData.youtube_video_link || !formData.label_id) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate YouTube URL
    const youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(formData.youtube_video_link)) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video link.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('takedown_requests')
        .insert({
          user_id: user.id,
          release_id: formData.release_id,
          youtube_video_link: formData.youtube_video_link,
          label_id: formData.label_id,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Request Submitted",
        description: "Your copyright removal request has been sent for review.",
      });

      setFormData({
        release_id: '',
        youtube_video_link: '',
        label_id: ''
      });

      fetchData();
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      pending: "secondary",
      in_process: "outline",
      approved: "default",
      rejected: "destructive",
      completed: "default"
    };
    return <Badge variant={variants[status] || "outline"}>{status.replace('_', ' ')}</Badge>;
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-lg">Loading data...</div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Copyright Removal</h1>
          <p className="text-gray-400">Request removal of Content ID claims from YouTube videos</p>
        </div>

        {/* Submit New Request */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Submit New Request
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {releases.length === 0 ? (
              <div className="text-center py-8">
                <Flag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Live Releases</h3>
                <p className="text-gray-400">You need live releases to submit copyright removal requests</p>
              </div>
            ) : (
              <>
                <div>
                  <Label htmlFor="song" className="text-gray-300">Select Song *</Label>
                  <Select value={formData.release_id} onValueChange={(value) => setFormData(prev => ({...prev, release_id: value}))}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Choose a live song" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {releases.map((release: any) => (
                        <SelectItem key={release.id} value={release.id}>
                          {release.song_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="youtube_link" className="text-gray-300">YouTube Video Link *</Label>
                  <Input
                    id="youtube_link"
                    placeholder="https://youtube.com/watch?v=..."
                    value={formData.youtube_video_link}
                    onChange={(e) => setFormData(prev => ({...prev, youtube_video_link: e.target.value}))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="label" className="text-gray-300">Label Name *</Label>
                  <Select value={formData.label_id} onValueChange={(value) => setFormData(prev => ({...prev, label_id: value}))}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Choose label" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {labels.map((label: any) => (
                        <SelectItem key={label.id} value={label.id}>
                          {label.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleSubmitRequest}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Submit Request
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Request History */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Request History</CardTitle>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-8">
                <Flag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Requests Yet</h3>
                <p className="text-gray-400">Your copyright removal requests will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request: any) => (
                  <div key={request.id} className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-medium">{request.releases?.song_name}</h4>
                        <p className="text-gray-400 text-sm">Label: {request.labels?.name}</p>
                        <p className="text-gray-400 text-sm">
                          Submitted: {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <a 
                        href={request.youtube_video_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-400 hover:text-blue-300 text-sm"
                      >
                        <span className="mr-1">View Video</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    {request.admin_notes && (
                      <div className="mt-3 p-3 bg-gray-600 rounded">
                        <p className="text-xs text-gray-400 mb-1">Admin Notes:</p>
                        <p className="text-sm text-gray-300">{request.admin_notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default CopyrightRemoval;
