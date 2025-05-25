
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Music, Lock, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "Admin@mdi.in",
    password: "Nayak77@@"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, user, isAdmin, loading } = useAuth();

  // Redirect if already logged in as admin
  useEffect(() => {
    console.log("AdminLogin - Auth state:", { user: !!user, isAdmin, loading });
    
    if (!loading && user && isAdmin) {
      console.log("Admin already logged in, redirecting to dashboard");
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    console.log("Admin login attempt with:", formData.email);
    setIsSubmitting(true);
    
    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        console.error("Admin login error:", error);
        toast({
          title: "Login Failed",
          description: "Invalid admin credentials. Please check your email and password.",
          variant: "destructive",
        });
      } else {
        console.log("Admin login successful");
        toast({
          title: "Admin Login Successful", 
          description: "Redirecting to admin dashboard...",
        });
        
        // Redirect to admin dashboard
        setTimeout(() => {
          navigate("/admin/dashboard", { replace: true });
        }, 1000);
      }
    } catch (error: any) {
      console.error("Admin login exception:", error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-white">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Shield className="h-12 w-12 text-red-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Admin Portal
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">IND Distribution</h1>
          <p className="text-gray-400">Administrator Access Panel</p>
        </div>

        <Card className="bg-gray-900 border-gray-800 shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-white flex items-center justify-center space-x-2">
              <Lock className="h-6 w-6 text-red-500" />
              <span>Admin Login</span>
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              Enter your administrator credentials to access the control panel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">Admin Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Admin@mdi.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 pl-10 focus:border-red-500 focus:ring-red-500"
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 pl-10 pr-10 focus:border-red-500 focus:ring-red-500"
                    disabled={isSubmitting}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Access Admin Panel</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-gray-800">
              <div className="bg-gray-800 p-4 rounded-lg mb-4">
                <p className="text-xs text-gray-400 mb-2">Admin Credentials:</p>
                <p className="text-sm text-green-400 font-mono">Email: Admin@mdi.in</p>
                <p className="text-sm text-green-400 font-mono">Password: Nayak77@@</p>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                🔒 Authorized personnel only. All access attempts are logged.
              </p>
              <Link 
                to="/login" 
                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center space-x-1"
              >
                <Music className="h-4 w-4" />
                <span>← Back to regular login</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-600">
            © 2024 IND Distribution. Administrator Portal v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
