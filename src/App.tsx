
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import AdminLogin from "./pages/AdminLogin";

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
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import MusicManagement from "./pages/admin/MusicManagement";
import FinancialManagement from "./pages/admin/FinancialManagement";
import AdminRoyaltyReports from "./pages/admin/AdminRoyaltyReports";
import CopyrightRequests from "./pages/admin/CopyrightRequests";
import AdminOacRequests from "./pages/admin/OacRequests";
import AdminSettings from "./pages/admin/AdminSettings";

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
              <Route path="/admin/login" element={<AdminLogin />} />
              
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
              
              {/* Admin protected routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute adminOnly>
                  <UserManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/releases" element={
                <ProtectedRoute adminOnly>
                  <MusicManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/artists" element={
                <ProtectedRoute adminOnly>
                  <div>Artist Management - Coming Soon</div>
                </ProtectedRoute>
              } />
              <Route path="/admin/labels" element={
                <ProtectedRoute adminOnly>
                  <div>Label Management - Coming Soon</div>
                </ProtectedRoute>
              } />
              <Route path="/admin/financials" element={
                <ProtectedRoute adminOnly>
                  <FinancialManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/royalty-reports" element={
                <ProtectedRoute adminOnly>
                  <AdminRoyaltyReports />
                </ProtectedRoute>
              } />
              <Route path="/admin/copyright-requests" element={
                <ProtectedRoute adminOnly>
                  <CopyrightRequests />
                </ProtectedRoute>
              } />
              <Route path="/admin/oac-requests" element={
                <ProtectedRoute adminOnly>
                  <AdminOacRequests />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute adminOnly>
                  <AdminSettings />
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
