
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Youtube, ExternalLink, Plus } from "lucide-react";
import CustomerLayout from "@/components/customer/CustomerLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const OacRequests = () => {
  const { user } = useAuth();
  const [artists, setArtists] = useState([]);
  const [labels, setLabels] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    artist_id: '',
    singer_channel_link: '',
    topic_channel_link: '',
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
      // Fetch user's artists
      const { data: artistsData } = await supabase
        .from('artists')
        .select('id, name')
        .eq('user_id', user.id);

      // Fetch user's labels
      const { data: labelsData } = await supabase
        .from('labels')
        .select('id, name')
        .eq('user_id', user.id);

      // Fetch OAC requests
      const { data: requestsData } = await supabase
        .from('oac_requests')
        .select(`
          *,
          artists:artist_id(name),
          labels:label_id(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setArtists(artistsData || []);
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

    if (!formData.artist_id || !formData.singer_channel_link || !formData.topic_channel_link || !formData.label_id) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate YouTube URLs
    const youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(formData.singer_channel_link) || !youtubeRegex.test(formData.topic_channel_link)) {
      toast({
        title: "Invalid YouTube URLs",
        description: "Please enter valid YouTube channel links.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('oac_requests')
        .insert({
          user_id: user.id,
          artist_id: formData.artist_id,
          singer_channel_link: formData.singer_channel_link,
          topic_channel_link: formData.topic_channel_link,
          label_id: formData.label_id,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Request Submitted",
        description: "Your OAC request has been sent for review.",
      });

      setFormData({
        artist_id: '',
        singer_channel_link: '',
        topic_channel_link: '',
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
          <h1 className="text-3xl font-bold text-white mb-2">Official Artist Channel (OAC)</h1>
          <p className="text-gray-400">Request YouTube Official Artist Channel setup</p>
        </div>

        {/* Submit New Request */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Submit New OAC Request
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {artists.length === 0 || labels.length === 0 ? (
              <div className="text-center py-8">
                <Youtube className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Artists & Labels Required</h3>
                <p className="text-gray-400">You need to create at least one artist and one label to submit OAC requests</p>
              </div>
            ) : (
              <>
                <div>
                  <Label htmlFor="artist" className="text-gray-300">Singer Name *</Label>
                  <Select value={formData.artist_id} onValueChange={(value) => setFormData(prev => ({...prev, artist_id: value}))}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select artist" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {artists.map((artist: any) => (
                        <SelectItem key={artist.id} value={artist.id}>
                          {artist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="singer_channel" className="text-gray-300">Singer Owned Channel Link *</Label>
                  <Input
                    id="singer_channel"
                    placeholder="https://youtube.com/channel/..."
                    value={formData.singer_channel_link}
                    onChange={(e) => setFormData(prev => ({...prev, singer_channel_link: e.target.value}))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="topic_channel" className="text-gray-300">Singer Topic Channel Link *</Label>
                  <Input
                    id="topic_channel"
                    placeholder="https://youtube.com/channel/..."
                    value={formData.topic_channel_link}
                    onChange={(e) => setFormData(prev => ({...prev, topic_channel_link: e.target.value}))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="label" className="text-gray-300">Label Name *</Label>
                  <Select value={formData.label_id} onValueChange={(value) => setFormData(prev => ({...prev, label_id: value}))}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select label" />
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
                  Submit OAC Request
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
                <Youtube className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Requests Yet</h3>
                <p className="text-gray-400">Your OAC requests will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request: any) => (
                  <div key={request.id} className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-medium">{request.artists?.name}</h4>
                        <p className="text-gray-400 text-sm">Label: {request.labels?.name}</p>
                        <p className="text-gray-400 text-sm">
                          Submitted: {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Singer Channel:</span>
                        <a 
                          href={request.singer_channel_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-400 hover:text-blue-300 text-sm"
                        >
                          <span className="mr-1">View Channel</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Topic Channel:</span>
                        <a 
                          href={request.topic_channel_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-400 hover:text-blue-300 text-sm"
                        >
                          <span className="mr-1">View Channel</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
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

export default OacRequests;
