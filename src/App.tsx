
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Pricing from "./pages/Pricing";
import Features from "./pages/Features";
import Platforms from "./pages/Platforms";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes with Navbar/Footer */}
            <Route path="/" element={
              <PublicLayout>
                <Index />
              </PublicLayout>
            } />
            <Route path="/login" element={
              <PublicLayout>
                <Login />
              </PublicLayout>
            } />
            <Route path="/signup" element={
              <PublicLayout>
                <Signup />
              </PublicLayout>
            } />
            <Route path="/pricing" element={
              <PublicLayout>
                <Pricing />
              </PublicLayout>
            } />
            <Route path="/features" element={
              <PublicLayout>
                <Features />
              </PublicLayout>
            } />
            <Route path="/platforms" element={
              <PublicLayout>
                <Platforms />
              </PublicLayout>
            } />
            <Route path="/contact" element={
              <PublicLayout>
                <Contact />
              </PublicLayout>
            } />

            {/* Dashboard Routes (No Navbar/Footer) */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Admin Routes (No Navbar/Footer) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* 404 Route */}
            <Route path="*" element={
              <PublicLayout>
                <NotFound />
              </PublicLayout>
            } />
          </Routes>
          <WhatsAppButton />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Layout component for public pages with navbar and footer
const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default App;
