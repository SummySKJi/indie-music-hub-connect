
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Single Song",
      price: "₹99",
      period: "per release",
      description: "Perfect for individual song releases",
      features: [
        "Distribute to 250+ platforms",
        "Keep 100% of your royalties",
        "Basic analytics",
        "Email support",
        "No time limit",
        "Copyright protection"
      ],
      popular: false
    },
    {
      name: "Artist Plan",
      price: "₹999",
      period: "per year",
      description: "Best for active artists with multiple releases",
      features: [
        "Unlimited releases",
        "Distribute to 250+ platforms",
        "Keep 100% of your royalties",
        "Advanced analytics & insights",
        "Priority email support",
        "Official Artist Channel (OAC)",
        "Content ID protection",
        "Pre-release scheduling",
        "Collaborative playlists"
      ],
      popular: true
    },
    {
      name: "Label Plan",
      price: "₹2999",
      period: "per year",
      description: "Perfect for labels and music companies",
      features: [
        "Unlimited artists & releases",
        "Distribute to 250+ platforms",
        "Keep 100% of your royalties",
        "White-label dashboard",
        "Dedicated account manager",
        "Phone & WhatsApp support",
        "Advanced copyright management",
        "Revenue splitting tools",
        "Custom reporting",
        "API access"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your music distribution needs. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative bg-gray-800 border-gray-700 ${
                plan.popular ? 'border-purple-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                <CardDescription className="text-gray-400">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-2">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-6">
                  <Link to="/signup">
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                          : 'bg-gray-700 hover:bg-gray-600 text-white'
                      }`}
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Do you take any commission?</h3>
              <p className="text-gray-400">
                No! You keep 100% of your royalties. We only charge a one-time distribution fee.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">How fast is the distribution?</h3>
              <p className="text-gray-400">
                Your music typically goes live on most platforms within 24-48 hours after submission.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Can I cancel anytime?</h3>
              <p className="text-gray-400">
                Yes, you can cancel your subscription anytime. Your music will remain live on all platforms.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">What if I need help?</h3>
              <p className="text-gray-400">
                Our support team is available 24/7 via email, and premium users get WhatsApp support.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Get Started?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of artists who trust IND Distribution
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Start Your Music Journey
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
