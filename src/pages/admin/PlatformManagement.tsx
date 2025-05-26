
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Search, Plus, Edit, Eye, Trash2, Globe, Check, X } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "@/hooks/use-toast";

interface Platform {
  id: string;
  name: string;
  type: string;
  status: "active" | "inactive";
  features: string[];
  commission: number;
  totalReleases: number;
}

const PlatformManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [platforms] = useState<Platform[]>([
    {
      id: "1",
      name: "Spotify",
      type: "Streaming",
      status: "active",
      features: ["Audio Streaming", "Playlist Placement"],
      commission: 15,
      totalReleases: 1250
    },
    {
      id: "2", 
      name: "Apple Music",
      type: "Streaming",
      status: "active",
      features: ["Audio Streaming", "Spatial Audio"],
      commission: 15,
      totalReleases: 980
    },
    {
      id: "3",
      name: "YouTube Music",
      type: "Video/Audio",
      status: "active", 
      features: ["Video Streaming", "Audio Streaming"],
      commission: 20,
      totalReleases: 750
    },
    {
      id: "4",
      name: "Amazon Music",
      type: "Streaming",
      status: "inactive",
      features: ["Audio Streaming"],
      commission: 18,
      totalReleases: 560
    }
  ]);

  const togglePlatformStatus = (id: string) => {
    toast({
      title: "Platform Status Updated",
      description: "Platform status has been updated successfully.",
    });
  };

  const filteredPlatforms = platforms.filter(platform =>
    platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    platform.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activePlatforms = platforms.filter(p => p.status === "active").length;
  const totalReleases = platforms.reduce((sum, p) => sum + p.totalReleases, 0);
  const avgCommission = platforms.reduce((sum, p) => sum + p.commission, 0) / platforms.length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Platform Management</h1>
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Platform
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Platforms</p>
                  <h3 className="text-3xl font-bold text-green-400">{activePlatforms}</h3>
                </div>
                <Globe className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Platforms</p>
                  <h3 className="text-3xl font-bold text-blue-400">{platforms.length}</h3>
                </div>
                <Globe className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Releases</p>
                  <h3 className="text-3xl font-bold text-purple-400">{totalReleases.toLocaleString()}</h3>
                </div>
                <Globe className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg Commission</p>
                  <h3 className="text-3xl font-bold text-orange-400">{avgCommission.toFixed(1)}%</h3>
                </div>
                <Globe className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Platform Management</CardTitle>
            <CardDescription className="text-gray-400">
              Manage all distribution platforms and their settings
            </CardDescription>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search platforms..."
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
                  <TableHead className="text-gray-300">Platform</TableHead>
                  <TableHead className="text-gray-300">Type</TableHead>
                  <TableHead className="text-gray-300">Features</TableHead>
                  <TableHead className="text-gray-300">Commission</TableHead>
                  <TableHead className="text-gray-300">Releases</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlatforms.map((platform) => (
                  <TableRow key={platform.id} className="border-gray-700">
                    <TableCell className="text-white font-medium">{platform.name}</TableCell>
                    <TableCell className="text-gray-300">{platform.type}</TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex flex-wrap gap-1">
                        {platform.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{platform.commission}%</TableCell>
                    <TableCell className="text-gray-300">{platform.totalReleases.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={platform.status === "active"}
                          onCheckedChange={() => togglePlatformStatus(platform.id)}
                        />
                        <Badge variant={platform.status === "active" ? "default" : "secondary"}>
                          {platform.status}
                        </Badge>
                      </div>
                    </TableCell>
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
      </div>
    </AdminLayout>
  );
};

export default PlatformManagement;
