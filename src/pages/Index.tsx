
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Music, Globe, TrendingUp, Users, Shield, Headphones } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Globe,
      title: "Global Distribution",
      description: "Distribute your music to 250+ platforms worldwide including Spotify, Apple Music, and JioSaavn."
    },
    {
      icon: TrendingUp,
      title: "Detailed Analytics",
      description: "Get comprehensive reports and analytics to track your music's performance across all platforms."
    },
    {
      icon: Shield,
      title: "Copyright Protection",
      description: "Advanced Content ID and copyright management to protect your intellectual property."
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Dedicated customer support team available round the clock to assist you."
    }
  ];

  const platforms = [
    "Spotify", "Apple Music", "JioSaavn", "YouTube Music", "Instagram",
    "Facebook", "Amazon Music", "Gaana", "Hungama", "Wynk Music"
  ];

  const testimonials = [
    {
      name: "Arjun Sharma",
      role: "Independent Artist",
      content: "IND Distribution helped me reach millions of listeners worldwide. The process was seamless and the support was amazing!"
    },
    {
      name: "Priya Singh",
      role: "Music Producer",
      content: "The detailed analytics and fast distribution made IND Distribution my go-to choice for all my releases."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Distribute Your Music Worldwide
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Get your music on 250+ platforms including Spotify, Apple Music, JioSaavn, and more. 
            Fast uploads, detailed reporting, and worldwide reach.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-4">
                Get Started Today
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white text-lg px-8 py-4">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose IND Distribution?</h2>
            <p className="text-xl text-gray-400">Everything you need to succeed in the music industry</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <feature.icon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Distribute to Major Platforms</h2>
          <p className="text-xl text-gray-400 mb-12">Your music on all the platforms that matter</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
            {platforms.map((platform, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-4 w-full h-20 flex items-center justify-center border border-gray-700 hover:border-purple-500 transition-all duration-300"
              >
                <span className="text-white font-medium text-center">{platform}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-400 mt-8">+ 240 more platforms worldwide</p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Artists Say</h2>
            <p className="text-xl text-gray-400">Join thousands of satisfied artists</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-pink-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Share Your Music with the World?</h2>
          <p className="text-xl text-gray-200 mb-8">
            Join thousands of artists who trust IND Distribution to get their music heard globally.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100 text-lg px-8 py-4">
              Start Distributing Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
