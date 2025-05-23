
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Globe, 
  TrendingUp, 
  Shield, 
  Headphones, 
  Upload, 
  DollarSign, 
  Music, 
  Users,
  Clock,
  FileText,
  Settings,
  Smartphone
} from "lucide-react";

const Features = () => {
  const mainFeatures = [
    {
      icon: Globe,
      title: "Global Music Distribution",
      description: "Distribute your music to 250+ platforms worldwide including Spotify, Apple Music, JioSaavn, YouTube Music, Amazon Music, and many more.",
      details: [
        "Instant distribution to all major platforms",
        "Regional platforms for better local reach",
        "Automatic metadata optimization",
        "Multi-format support (MP3, WAV, FLAC)"
      ]
    },
    {
      icon: DollarSign,
      title: "Royalty Collection & Reporting",
      description: "Keep 100% of your royalties with detailed analytics and transparent reporting from all platforms.",
      details: [
        "Real-time revenue tracking",
        "Platform-wise breakdown",
        "Monthly detailed reports",
        "Revenue forecasting tools"
      ]
    },
    {
      icon: Shield,
      title: "Copyright Management",
      description: "Advanced Content ID protection and copyright management to safeguard your intellectual property.",
      details: [
        "YouTube Content ID registration",
        "Copyright infringement monitoring",
        "DMCA takedown assistance",
        "Rights management tools"
      ]
    },
    {
      icon: Music,
      title: "Official Artist Channel (OAC)",
      description: "Get your Official Artist Channel on YouTube and other platforms for enhanced credibility and features.",
      details: [
        "YouTube OAC setup and management",
        "Artist verification badges",
        "Enhanced profile features",
        "Priority playlist consideration"
      ]
    }
  ];

  const additionalFeatures = [
    {
      icon: Upload,
      title: "Fast & Easy Upload",
      description: "Upload your music in minutes with our user-friendly dashboard and automated quality checks."
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Get detailed insights into your music's performance across all platforms with comprehensive analytics."
    },
    {
      icon: Headphones,
      title: "24/7 Customer Support",
      description: "Our dedicated support team is available round the clock to assist you with any queries or issues."
    },
    {
      icon: Users,
      title: "Artist Community",
      description: "Connect with other artists, share experiences, and grow together in our exclusive artist community."
    },
    {
      icon: Clock,
      title: "Pre-Release Scheduling",
      description: "Schedule your releases in advance and coordinate your marketing campaigns effectively."
    },
    {
      icon: FileText,
      title: "Metadata Management",
      description: "Professional metadata editing and optimization to ensure your music appears correctly on all platforms."
    },
    {
      icon: Settings,
      title: "White-Label Dashboard",
      description: "Customize your dashboard with your branding for a professional look and feel."
    },
    {
      icon: Smartphone,
      title: "Mobile App Access",
      description: "Manage your music distribution on the go with our mobile-friendly platform and dedicated app."
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Powerful Features for Artists
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to succeed in the music industry. From distribution to analytics, 
            we've got you covered with industry-leading tools and features.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {mainFeatures.map((feature, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-gray-400 text-base mt-4">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-300">{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Additional Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all duration-300 h-full">
                <CardContent className="p-6 text-center h-full flex flex-col">
                  <feature.icon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400 text-sm flex-grow">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <Shield className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Security & Protection</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Your music and data are protected with industry-leading security measures.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">SSL Encryption</h3>
              <p className="text-gray-400">All data transfers are encrypted with 256-bit SSL encryption.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Secure Storage</h3>
              <p className="text-gray-400">Your music files are stored in secure, redundant cloud storage.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Regular Backups</h3>
              <p className="text-gray-400">Automated backups ensure your music is never lost.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Experience These Features?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of artists who are already using IND Distribution to grow their music career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Get Started Now
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
