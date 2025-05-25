
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProtectedRoute from "@/components/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Platforms from "./pages/Platforms";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Customer pages
import Dashboard from "./pages/Dashboard";
import UploadMusic from "./pages/UploadMusic";
import MyReleases from "./pages/MyReleases";
import Management from "./pages/Management";
import WalletEarnings from "./pages/customer/WalletEarnings";
import CopyrightRemoval from "./pages/customer/CopyrightRemoval";
import RoyaltyReports from "./pages/customer/RoyaltyReports";
import OacRequests from "./pages/customer/OacRequests";
import CustomerProfile from "./pages/customer/CustomerProfile";

// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import MusicReviewQueue from "./pages/admin/MusicReviewQueue";
import AllReleases from "./pages/admin/AllReleases";
import CustomerManagement from "./pages/admin/CustomerManagement";
import ArtistLabelManagement from "./pages/admin/ArtistLabelManagement";
import WalletPayouts from "./pages/admin/WalletPayouts";
import CopyrightRequests from "./pages/admin/CopyrightRequests";
import AdminOacRequests from "./pages/admin/OacRequests";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<><Navbar /><Index /><Footer /></>} />
              <Route path="/features" element={<><Navbar /><Features /><Footer /></>} />
              <Route path="/pricing" element={<><Navbar /><Pricing /><Footer /></>} />
              <Route path="/platforms" element={<><Navbar /><Platforms /><Footer /></>} />
              <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
              <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
              <Route path="/signup" element={<><Navbar /><Signup /><Footer /></>} />
              
              {/* Customer protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/upload-music" element={
                <ProtectedRoute>
                  <UploadMusic />
                </ProtectedRoute>
              } />
              <Route path="/my-releases" element={
                <ProtectedRoute>
                  <MyReleases />
                </ProtectedRoute>
              } />
              <Route path="/wallet" element={
                <ProtectedRoute>
                  <WalletEarnings />
                </ProtectedRoute>
              } />
              <Route path="/management" element={
                <ProtectedRoute>
                  <Management />
                </ProtectedRoute>
              } />
              <Route path="/copyright-removal" element={
                <ProtectedRoute>
                  <CopyrightRemoval />
                </ProtectedRoute>
              } />
              <Route path="/royalty-reports" element={
                <ProtectedRoute>
                  <RoyaltyReports />
                </ProtectedRoute>
              } />
              <Route path="/oac-requests" element={
                <ProtectedRoute>
                  <OacRequests />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <CustomerProfile />
                </ProtectedRoute>
              } />
              
              {/* Admin routes */}
              <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              {/* Admin Music Management */}
              <Route path="/admin/music/review-queue" element={
                <ProtectedRoute requireAdmin={true}>
                  <MusicReviewQueue />
                </ProtectedRoute>
              } />
              <Route path="/admin/music/releases" element={
                <ProtectedRoute requireAdmin={true}>
                  <AllReleases />
                </ProtectedRoute>
              } />
              
              {/* Admin Customer & Artist Management */}
              <Route path="/admin/customers" element={
                <ProtectedRoute requireAdmin={true}>
                  <CustomerManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/artists-labels" element={
                <ProtectedRoute requireAdmin={true}>
                  <ArtistLabelManagement />
                </ProtectedRoute>
              } />
              
              {/* Admin Financial Management */}
              <Route path="/admin/wallet-payouts" element={
                <ProtectedRoute requireAdmin={true}>
                  <WalletPayouts />
                </ProtectedRoute>
              } />
              
              {/* Admin Request Management */}
              <Route path="/admin/requests/copyright" element={
                <ProtectedRoute requireAdmin={true}>
                  <CopyrightRequests />
                </ProtectedRoute>
              } />
              <Route path="/admin/requests/oac" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminOacRequests />
                </ProtectedRoute>
              } />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <WhatsAppButton />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
