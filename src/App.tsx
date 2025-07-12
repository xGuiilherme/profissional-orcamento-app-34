import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import Orcamentos from "./pages/Orcamentos";
import NovoOrcamento from "./pages/NovoOrcamento";
import Templates from "./pages/Templates";
import Perfil from "./pages/Perfil";
import Assinatura from "./pages/Assinatura";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";
import Exemplos from "./pages/Exemplos";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route path="/exemplos" element={<Exemplos />} />
          
          {/* Dashboard routes with layout - Protected */}
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orcamentos" element={<Orcamentos />} />
            <Route path="orcamento/novo/:templateId?" element={<NovoOrcamento />} />
            <Route path="templates" element={<Templates />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="assinatura" element={<Assinatura />} />
          </Route>
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;