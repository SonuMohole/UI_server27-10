import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Vulnerabilities from "./pages/Vulnerabilities";
import Dashboard2 from "./pages/Dashboard2";
import Dashboard3 from "./pages/Dashboard3";
import AgentCenter from "./pages/AgentCenter";
import KEVIntelligence from "./pages/KEVIntelligence";
import ThreatNews from "./pages/ThreatNews";
import Reports from "./pages/Reports";
import Subscription from "./pages/Subscription";
import AIAssistant from "./pages/AIAssistant";
import NotFound from "./pages/NotFound";
import AssetsPage from "@/pages/AssetsPage";
import AccountSettings from "@/pages/AccountSettings";
import Account from "./pages/account_settings/Account";
import SIMDashboard from "./pages/SIMDashboard";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
           <Route path="/dashboard2" element={<Dashboard2 />} />
           <Route path="/dashboard3" element={<Dashboard3 />} />
              <Route path="/assets" element={<AssetsPage />} />
            <Route path="/vulnerabilities" element={<Vulnerabilities />} />
            <Route path="/agent-center" element={<AgentCenter />} />
            <Route path="/kev-intelligence" element={<KEVIntelligence />} />
            <Route path="/threat-news" element={<ThreatNews />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/assets" element={<AssetsPage />} />   
             

          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/account_settings/account" element={<Account />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
