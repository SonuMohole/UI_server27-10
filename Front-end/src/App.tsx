import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AccountSettings from "@/pages/AccountSettings";
import AssetsPage from "@/pages/AssetsPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Account from "./pages/account_settings/Account";
import AgentCenter from "./pages/AgentCenter";
import AIAssistant from "./pages/AIAssistant";
import Dashboard from "./pages/Dashboard";
import Dashboard3 from "./pages/Dashboard3";
import KEVIntelligence from "./pages/KEVIntelligence";
import NotFound from "./pages/NotFound";
import Reports from "./pages/Reports";
import Subscription from "./pages/Subscription";
import ThreatNews from "./pages/ThreatNews";
import Vulnerabilities from "./pages/Vulnerabilities";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
          
        
           <Route path="/" element={<Dashboard3 />} />
           <Route path="Dashboard" element={<Dashboard />} />
            <Route path="/dashboard3" element={<Dashboard3 />} />
              <Route path="/assets" element={<AssetsPage />} />
            <Route path="/vulnerabilities" element={<Vulnerabilities />} />
            <Route path="/agent-center" element={<AgentCenter />} />
            <Route path="/kev-intelligence" element={<KEVIntelligence />} />
            <Route path="/threat-news" element={<ThreatNews />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            
             

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
