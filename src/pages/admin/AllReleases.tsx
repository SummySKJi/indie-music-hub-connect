
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Search, Filter, Download, Edit, Eye } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const AllReleases = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [releases] = useState([
    {
      id: "1",
      songName: "Summer Vibes",
      artistName: "DJ Rahul", 
      releaseDate: "2024-01-20",
      status: "live",
      platforms: ["Spotify", "Apple Music", "YouTube"],
      totalStreams: "15,245",
      earnings: "₹2,540"
    },
    {
      id: "2",
      songName: "Bollywood Dreams", 
      artistName: "Priya Sharma",
      releaseDate: "2024-01-18",
      status: "approved",
      platforms: ["Spotify", "JioSaavn"],
      totalStreams: "8,932", 
      earnings: "₹1,420"
    },
    {
      id: "3",
      songName: "Classical Fusion",
      artistName: "Ravi Kumar",
      releaseDate: "2024-01-15",
      status: "rejected",
      platforms: [],
      totalStreams: "0",
      earnings: "₹0"
    }
  ]);

  const getStatusBadge = (status: string) => {
    const variants = {
      live: "default",
      approved: "secondary", 
      rejected: "destructive",
      pending: "outline"
    };
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const filteredReleases = releases.filter(release =>
    release.songName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    release.artistName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">All Releases</h1>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Release Management</CardTitle>
            <CardDescription className="text-gray-400">
              View and manage all music releases across all platforms
            </CardDescription>
            <div className="flex space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search releases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Release Details</TableHead>
                  <TableHead className="text-gray-300">Artist</TableHead>
                  <TableHead className="text-gray-300">Release Date</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Platforms</TableHead>
                  <TableHead className="text-gray-300">Streams</TableHead>
                  <TableHead className="text-gray-300">Earnings</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReleases.map((release) => (
                  <TableRow key={release.id} className="border-gray-700">
                    <TableCell className="text-white">
                      <div className="font-medium">{release.songName}</div>
                    </TableCell>
                    <TableCell className="text-gray-300">{release.artistName}</TableCell>
                    <TableCell className="text-gray-300">{release.releaseDate}</TableCell>
                    <TableCell>{getStatusBadge(release.status)}</TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex flex-wrap gap-1">
                        {release.platforms.map((platform, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{release.totalStreams}</TableCell>
                    <TableCell className="text-gray-300">{release.earnings}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
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

export default AllReleases;
