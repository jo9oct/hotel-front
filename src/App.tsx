
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Menu } from "@/pages/Menu";
import { MyOrder } from "@/pages/UserOrderManagement";
import { AdminLogin } from "@/pages/AdminLogin";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { AdminOrders } from "@/pages/AdminOrders";
import NotFound from "./pages/NotFound";
import {useAuthStore} from "@/store/authStore"
import { useEffect } from "react";

const queryClient = new QueryClient();

// Protected route wrapper for admin pages
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin" replace />;
};

const handleUpdateAccount = async (data: { username: string; password: string; newPassword: string }) => {
  // Your logic to update account
  console.log('Updating account with:', data);
};

const App = () => {

  const { checkAuth,isAuthenticated  } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      await checkAuth()
    }
    fetchData()
  },[checkAuth])

  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navigation handleUpdateAccount={handleUpdateAccount}/>
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<Menu />} />
              <Route path="/favorites" element={<MyOrder />} />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />
                } 
              />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="/admin/orders" 
                element={
                  <ProtectedAdminRoute>
                    <AdminOrders />
                  </ProtectedAdminRoute>
                } 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
