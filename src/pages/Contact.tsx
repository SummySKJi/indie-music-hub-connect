
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Clock, MapPin, MessageCircle } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Contact form submitted:", formData);
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
    alert("Thank you for your message! We'll get back to you soon.");
  };

  const handleWhatsApp = () => {
    const whatsappNumber = "+917742789827";
    const message = "Hi! I need assistance with music distribution.";
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "musicdistributionindia.in@gmail.com",
      description: "Send us an email anytime"
    },
    {
      icon: Phone,
      title: "Phone",
      content: "01169652811",
      description: "Call us during business hours"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      content: "+91 7742789827",
      description: "Quick support via WhatsApp"
    },
    {
      icon: Clock,
      title: "Working Hours",
      content: "Mon - Sat: 9 AM - 6 PM IST",
      description: "We're here to help"
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have questions about music distribution? Need help with your account? 
            Our team is here to assist you every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Send us a Message</CardTitle>
                <CardDescription className="text-gray-400">
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-white">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-white">Subject</Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="What is this about?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-white">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 resize-none"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                          <info.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white mb-1">{info.title}</h3>
                          <p className="text-purple-400 font-medium mb-1">{info.content}</p>
                          <p className="text-gray-400 text-sm">{info.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Contact Actions */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Need Immediate Help?</h3>
              <div className="space-y-3">
                <Button
                  onClick={handleWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat on WhatsApp
                </Button>
                <Button
                  onClick={() => window.location.href = 'mailto:musicdistributionindia.in@gmail.com'}
                  variant="outline"
                  className="w-full border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h3>
              <div className="space-y-3">
                <details className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <summary className="text-white cursor-pointer font-medium">
                    How long does distribution take?
                  </summary>
                  <p className="text-gray-400 mt-2 text-sm">
                    Your music typically goes live on most platforms within 24-48 hours after submission.
                  </p>
                </details>
                <details className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <summary className="text-white cursor-pointer font-medium">
                    Do you take any commission from royalties?
                  </summary>
                  <p className="text-gray-400 mt-2 text-sm">
                    No! You keep 100% of your royalties. We only charge a one-time distribution fee.
                  </p>
                </details>
                <details className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <summary className="text-white cursor-pointer font-medium">
                    Can I update my music after distribution?
                  </summary>
                  <p className="text-gray-400 mt-2 text-sm">
                    Yes, you can update metadata and artwork. For audio changes, you'll need to submit a new release.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
