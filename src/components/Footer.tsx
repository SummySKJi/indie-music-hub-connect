
import { Link } from "react-router-dom";
import { Music, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Music className="h-8 w-8 text-purple-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                IND Distribution
              </span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Your trusted partner for worldwide music distribution. Get your music on 250+ platforms including Spotify, Apple Music, JioSaavn, and more.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <span className="text-sm">musicdistributionindia.in@gmail.com</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 mt-2">
              <Phone className="h-4 w-4" />
              <span className="text-sm">01169652811</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/platforms" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Platforms
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Copyright Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 IND Distribution. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
