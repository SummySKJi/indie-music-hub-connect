
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Globe, Music, Smartphone, Video } from "lucide-react";

const Platforms = () => {
  const majorPlatforms = [
    { name: "Spotify", category: "Streaming", color: "bg-green-500" },
    { name: "Apple Music", category: "Streaming", color: "bg-gray-700" },
    { name: "JioSaavn", category: "Streaming", color: "bg-orange-500" },
    { name: "YouTube Music", category: "Streaming", color: "bg-red-500" },
    { name: "Amazon Music", category: "Streaming", color: "bg-blue-500" },
    { name: "Instagram", category: "Social", color: "bg-pink-500" },
    { name: "Facebook", category: "Social", color: "bg-blue-600" },
    { name: "TikTok", category: "Social", color: "bg-black" },
    { name: "Gaana", category: "Streaming", color: "bg-red-600" },
    { name: "Hungama Digital", category: "Streaming", color: "bg-purple-600" },
    { name: "Wynk Music", category: "Streaming", color: "bg-blue-400" },
    { name: "Shazam", category: "Discovery", color: "bg-blue-700" }
  ];

  const platformCategories = [
    {
      icon: Music,
      title: "Music Streaming Platforms",
      description: "Major music streaming services worldwide",
      platforms: [
        "Spotify", "Apple Music", "Amazon Music", "YouTube Music", "Deezer",
        "Pandora", "Tidal", "SoundCloud", "Napster", "iHeartRadio"
      ]
    },
    {
      icon: Smartphone,
      title: "Mobile & Regional Platforms",
      description: "Popular mobile apps and regional services",
      platforms: [
        "JioSaavn", "Gaana", "Wynk Music", "Hungama Digital", "Resso",
        "Anghami", "Boomplay", "KKBox", "NetEase Cloud Music", "QQ Music"
      ]
    },
    {
      icon: Video,
      title: "Video & Social Platforms",
      description: "Video platforms and social media",
      platforms: [
        "YouTube", "Instagram", "Facebook", "TikTok", "Snapchat",
        "Twitter", "Twitch", "Vimeo", "Dailymotion", "LinkedIn"
      ]
    },
    {
      icon: Globe,
      title: "International & Specialty",
      description: "Global and niche platforms",
      platforms: [
        "Beatport", "Traxsource", "7Digital", "Bandcamp", "Audiomack",
        "Yandex Music", "VK Music", "MelOn", "LINE Music", "AWA"
      ]
    }
  ];

  const stats = [
    { number: "250+", label: "Total Platforms" },
    { number: "50+", label: "Countries Covered" },
    { number: "24-48hrs", label: "Distribution Time" },
    { number: "100%", label: "Royalty Retention" }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            250+ Distribution Platforms
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Get your music heard everywhere. We distribute to all major streaming platforms, 
            social media networks, and digital stores worldwide.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Major Platforms Showcase */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">Major Platforms</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {majorPlatforms.map((platform, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 ${platform.color} rounded-lg mx-auto mb-3 flex items-center justify-center`}>
                    <Music className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">{platform.name}</h3>
                  <p className="text-xs text-gray-400">{platform.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Platform Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Platform Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {platformCategories.map((category, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-4">
                      <category.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                      <p className="text-gray-400">{category.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {category.platforms.map((platform, platformIndex) => (
                      <div key={platformIndex} className="text-sm text-gray-300 bg-gray-700 rounded px-3 py-1">
                        {platform}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Regional Focus */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <Globe className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Global Reach, Local Impact</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We ensure your music reaches not just global platforms but also important regional and local services 
              that matter to your audience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">India & South Asia</h3>
              <p className="text-gray-400">JioSaavn, Gaana, Wynk, Hungama, and more regional platforms.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Global Markets</h3>
              <p className="text-gray-400">Spotify, Apple Music, Amazon Music, and major international platforms.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Emerging Markets</h3>
              <p className="text-gray-400">Boomplay, Anghami, and other rapidly growing platforms.</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">How Distribution Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Upload Your Music</h3>
              <p className="text-gray-400">Upload your tracks with metadata and artwork through our platform.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Quality Check</h3>
              <p className="text-gray-400">Our system automatically checks audio quality and metadata.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Distribute Worldwide</h3>
              <p className="text-gray-400">Your music goes live on 250+ platforms within 24-48 hours.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                4
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Collect Royalties</h3>
              <p className="text-gray-400">Track performance and collect 100% of your royalties.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Reach Every Platform?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of artists who are already distributing their music worldwide with IND Distribution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Start Distributing
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

export default Platforms;
