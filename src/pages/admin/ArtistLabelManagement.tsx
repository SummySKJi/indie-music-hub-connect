
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Search, Plus, Edit, Eye, Trash2, Music, Building2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const ArtistLabelManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const [artists] = useState([
    {
      id: "1",
      name: "DJ Rahul",
      email: "djrahul@example.com",
      phone: "+91 9876543210",
      genres: ["Electronic", "EDM"],
      country: "India",
      totalReleases: 5,
      createdBy: "rahul@example.com"
    },
    {
      id: "2",
      name: "Priya Sharma", 
      email: "priya@example.com",
      phone: "+91 9876543211",
      genres: ["Bollywood", "Pop"],
      country: "India",
      totalReleases: 3,
      createdBy: "priya@example.com"
    }
  ]);

  const [labels] = useState([
    {
      id: "1",
      name: "Bollywood Beats Records",
      email: "contact@bbrecords.com",
      phone: "+91 9876543220",
      genres: ["Bollywood", "Classical"],
      country: "India",
      totalReleases: 12,
      createdBy: "admin@bbrecords.com"
    },
    {
      id: "2",
      name: "Electronic Music India",
      email: "info@emi.com", 
      phone: "+91 9876543221",
      genres: ["Electronic", "Techno"],
      country: "India",
      totalReleases: 8,
      createdBy: "emi@example.com"
    }
  ]);

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLabels = labels.filter(label =>
    label.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    label.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Artist & Label Management</h1>
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Artists</p>
                  <h3 className="text-3xl font-bold text-blue-400">{artists.length}</h3>
                </div>
                <Music className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Labels</p>
                  <h3 className="text-3xl font-bold text-green-400">{labels.length}</h3>
                </div>
                <Building2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Artist Releases</p>
                  <h3 className="text-3xl font-bold text-purple-400">
                    {artists.reduce((sum, a) => sum + a.totalReleases, 0)}
                  </h3>
                </div>
                <Music className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Label Releases</p>
                  <h3 className="text-3xl font-bold text-orange-400">
                    {labels.reduce((sum, l) => sum + l.totalReleases, 0)}
                  </h3>
                </div>
                <Building2 className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="artists" className="space-y-4">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="artists" className="data-[state=active]:bg-red-600">Artists</TabsTrigger>
            <TabsTrigger value="labels" className="data-[state=active]:bg-red-600">Labels</TabsTrigger>
          </TabsList>

          <TabsContent value="artists">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Artists</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage all artists on the platform
                </CardDescription>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search artists..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Artist Name</TableHead>
                      <TableHead className="text-gray-300">Contact</TableHead>
                      <TableHead className="text-gray-300">Genres</TableHead>
                      <TableHead className="text-gray-300">Country</TableHead>
                      <TableHead className="text-gray-300">Releases</TableHead>
                      <TableHead className="text-gray-300">Created By</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredArtists.map((artist) => (
                      <TableRow key={artist.id} className="border-gray-700">
                        <TableCell className="text-white font-medium">{artist.name}</TableCell>
                        <TableCell className="text-gray-300">
                          <div>
                            <div>{artist.email}</div>
                            <div className="text-sm text-gray-400">{artist.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div className="flex flex-wrap gap-1">
                            {artist.genres.map((genre, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {genre}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">{artist.country}</TableCell>
                        <TableCell className="text-gray-300">{artist.totalReleases}</TableCell>
                        <TableCell className="text-gray-300">{artist.createdBy}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-400 hover:text-red-300">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="labels">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Labels</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage all labels on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Label Name</TableHead>
                      <TableHead className="text-gray-300">Contact</TableHead>
                      <TableHead className="text-gray-300">Genres</TableHead>
                      <TableHead className="text-gray-300">Country</TableHead>
                      <TableHead className="text-gray-300">Releases</TableHead>
                      <TableHead className="text-gray-300">Created By</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLabels.map((label) => (
                      <TableRow key={label.id} className="border-gray-700">
                        <TableCell className="text-white font-medium">{label.name}</TableCell>
                        <TableCell className="text-gray-300">
                          <div>
                            <div>{label.email}</div>
                            <div className="text-sm text-gray-400">{label.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div className="flex flex-wrap gap-1">
                            {label.genres.map((genre, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {genre}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">{label.country}</TableCell>
                        <TableCell className="text-gray-300">{label.totalReleases}</TableCell>
                        <TableCell className="text-gray-300">{label.createdBy}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-400 hover:text-red-300">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ArtistLabelManagement;
