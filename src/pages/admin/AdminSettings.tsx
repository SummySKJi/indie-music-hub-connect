
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Settings, Save, Mail, Shield, Globe, Bell } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoApproval, setAutoApproval] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "All settings have been updated successfully.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Admin Settings</h1>
          <Button onClick={handleSaveSettings} className="bg-red-600 hover:bg-red-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="general" className="data-[state=active]:bg-red-600">General</TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-red-600">Notifications</TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-red-600">Security</TabsTrigger>
            <TabsTrigger value="platforms" className="data-[state=active]:bg-red-600">Platforms</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  General Settings
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure general application settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name" className="text-gray-300">Company Name</Label>
                    <Input
                      id="company-name"
                      defaultValue="Indian Digital Music"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email" className="text-gray-300">Contact Email</Label>
                    <Input
                      id="contact-email"
                      defaultValue="admin@mdi.in"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-address" className="text-gray-300">Company Address</Label>
                  <Textarea
                    id="company-address"
                    placeholder="Enter company address..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Maintenance Mode</Label>
                    <p className="text-sm text-gray-400">
                      Enable maintenance mode to prevent user access
                    </p>
                  </div>
                  <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Settings
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Email Notifications</Label>
                    <p className="text-sm text-gray-400">
                      Receive email notifications for new releases and requests
                    </p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notification-email" className="text-gray-300">Notification Email</Label>
                  <Input
                    id="notification-email"
                    defaultValue="notifications@mdi.in"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notification-frequency" className="text-gray-300">Notification Frequency</Label>
                  <Select defaultValue="immediate">
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure security and access control settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Auto-approve Releases</Label>
                    <p className="text-sm text-gray-400">
                      Automatically approve releases that meet criteria
                    </p>
                  </div>
                  <Switch checked={autoApproval} onCheckedChange={setAutoApproval} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout" className="text-gray-300">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    defaultValue="60"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-file-size" className="text-gray-300">Max Upload Size (MB)</Label>
                  <Input
                    id="max-file-size"
                    type="number"
                    defaultValue="50"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Platform Settings
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure platform-specific settings and API keys
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="spotify-api" className="text-gray-300">Spotify API Key</Label>
                  <Input
                    id="spotify-api"
                    type="password"
                    placeholder="Enter Spotify API key..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apple-api" className="text-gray-300">Apple Music API Key</Label>
                  <Input
                    id="apple-api"
                    type="password"
                    placeholder="Enter Apple Music API key..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube-api" className="text-gray-300">YouTube API Key</Label>
                  <Input
                    id="youtube-api"
                    type="password"
                    placeholder="Enter YouTube API key..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-commission" className="text-gray-300">Default Commission (%)</Label>
                  <Input
                    id="default-commission"
                    type="number"
                    defaultValue="15"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
