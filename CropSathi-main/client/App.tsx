import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Knowledge from "./pages/Knowledge";
import Diagnose from "./pages/Diagnose";
import Crops from "./pages/Crops";
import Weather from "./pages/Weather";
import Market from "./pages/Market";
import Profile from "./pages/Profile";
import GetStarted from "./pages/GetStarted";
import Composting from "./pages/Composting";
import Schemes from "./pages/Schemes";
import ExpenseTracker from "./pages/ExpenseTracker";

const queryClient = new QueryClient();

import { EmergencyButton } from "@/components/site/EmergencyButton";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <EmergencyButton />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/expense-tracker" element={<ExpenseTracker />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/knowledge/composting" element={<Composting />} />
          <Route path="/diagnose" element={<Diagnose />} />
          <Route path="/crops" element={<Crops />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/market" element={<Market />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
