
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Music, 
  Globe, 
  DollarSign, 
  Users, 
  Play, 
  TrendingUp,
  Shield,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Music className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              IND Distribution
            </span>
          </div>
          <div className="flex space-x-4">
            <Link to="/login">
              <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
                Get Started
              </Button>
            </Link>
            <Link to="/admin/login">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Distribute Your Music
          </span>
          <br />
          <span className="text-white">Worldwide</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Get your music on Spotify, Apple Music, YouTube, and 250+ other platforms. 
          Keep 100% of your rights and earnings with IND Distribution.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button size="lg" className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-lg px-8 py-3">
              Start Distributing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-3">
            <Play className="mr-2 h-5 w-5" />
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center text-white mb-12">
          Why Choose IND Distribution?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="bg-gray-800 border-gray-700 hover:border-red-500 transition-colors">
            <CardHeader>
              <Globe className="h-12 w-12 text-red-500 mb-4" />
              <CardTitle className="text-white">Global Reach</CardTitle>
              <CardDescription className="text-gray-400">
                Distribute to 250+ platforms worldwide including Spotify, Apple Music, YouTube Music, and more.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-red-500 transition-colors">
            <CardHeader>
              <DollarSign className="h-12 w-12 text-green-500 mb-4" />
              <CardTitle className="text-white">Keep 100% Rights</CardTitle>
              <CardDescription className="text-gray-400">
                You own your music. Keep 100% of your rights and maximize your earnings with transparent reporting.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-red-500 transition-colors">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-blue-500 mb-4" />
              <CardTitle className="text-white">Real-time Analytics</CardTitle>
              <CardDescription className="text-gray-400">
                Track your performance with detailed analytics and insights across all platforms.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-red-500 transition-colors">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-500 mb-4" />
              <CardTitle className="text-white">Artist Support</CardTitle>
              <CardDescription className="text-gray-400">
                Get dedicated support from our team of music industry professionals.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gray-800 rounded-2xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-center text-white mb-12">
            Trusted by Artists Worldwide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-red-400 mb-2">250+</div>
              <div className="text-gray-400">Music Platforms</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">10K+</div>
              <div className="text-gray-400">Artists</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">50K+</div>
              <div className="text-gray-400">Releases</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">100%</div>
              <div className="text-gray-400">Rights Retained</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h3 className="text-4xl font-bold text-white mb-6">
          Ready to Share Your Music with the World?
        </h3>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of artists who trust IND Distribution to get their music heard globally.
        </p>
        <Link to="/register">
          <Button size="lg" className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-lg px-8 py-3">
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Music className="h-6 w-6 text-red-500" />
            <span className="text-lg font-bold text-white">IND Distribution</span>
          </div>
          <div className="text-gray-400 text-sm">
            © 2024 IND Distribution. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
