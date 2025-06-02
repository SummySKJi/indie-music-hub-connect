
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
  Search, Eye, Building, Globe, Music, UserCheck
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Label {
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
  facebook_page: string | null;
  whatsapp: string | null;
}

const LabelManagement = () => {
  const [labels, setLabels] = useState<Label[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLabels();
  }, []);

  const fetchLabels = async () => {
    try {
      const { data: labelsData, error } = await supabase
        .from('labels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setLabels(labelsData || []);
    } catch (error) {
      console.error('Error fetching labels:', error);
      toast({
        title: "Error",
        description: "Failed to fetch labels",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredLabels = labels.filter(label => 
    label.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    label.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white">Loading labels...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Label Management</h1>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search labels..."
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
                  <p className="text-sm text-gray-400">Total Labels</p>
                  <h3 className="text-2xl font-bold text-white">{labels.length}</h3>
                </div>
                <Building className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">With Social Media</p>
                  <h3 className="text-2xl font-bold text-green-400">
                    {labels.filter(l => l.instagram_id || l.youtube_channel || l.facebook_page).length}
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
                    {labels.filter(l => l.website).length}
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
                  <p className="text-sm text-gray-400">Multi-Genre</p>
                  <h3 className="text-2xl font-bold text-orange-400">
                    {labels.filter(l => l.genres && l.genres.length > 1).length}
                  </h3>
                </div>
                <Music className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Labels Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">All Labels</CardTitle>
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
                {filteredLabels.map((label) => (
                  <TableRow key={label.id} className="border-gray-700">
                    <TableCell className="text-white">{label.name}</TableCell>
                    <TableCell className="text-gray-300">{label.email}</TableCell>
                    <TableCell className="text-gray-300">{label.country}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {label.languages?.slice(0, 2).map((lang, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                        {label.languages?.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{label.languages.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {label.genres?.slice(0, 2).map((genre, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                        {label.genres && label.genres.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{label.genres.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(label.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedLabel(label)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-white">Label Details</DialogTitle>
                            </DialogHeader>
                            {selectedLabel && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Name</label>
                                    <p className="text-white">{selectedLabel.name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Email</label>
                                    <p className="text-white">{selectedLabel.email}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Phone</label>
                                    <p className="text-white">{selectedLabel.phone}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Country</label>
                                    <p className="text-white">{selectedLabel.country}</p>
                                  </div>
                                </div>

                                {selectedLabel.bio && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-400">Bio</label>
                                    <p className="text-white text-sm">{selectedLabel.bio}</p>
                                  </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                  {selectedLabel.website && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-400">Website</label>
                                      <p className="text-blue-400">{selectedLabel.website}</p>
                                    </div>
                                  )}
                                  {selectedLabel.instagram_id && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-400">Instagram</label>
                                      <p className="text-pink-400">@{selectedLabel.instagram_id}</p>
                                    </div>
                                  )}
                                  {selectedLabel.youtube_channel && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-400">YouTube</label>
                                      <p className="text-red-400">{selectedLabel.youtube_channel}</p>
                                    </div>
                                  )}
                                  {selectedLabel.facebook_page && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-400">Facebook</label>
                                      <p className="text-blue-400">{selectedLabel.facebook_page}</p>
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

export default LabelManagement;
