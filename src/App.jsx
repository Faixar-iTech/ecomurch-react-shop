import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductEntry from "./pages/ProductEntry";
import ProductManagement from "./pages/ProductManagement";
import APIDebugger from '@/components/APIDebugger';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
           <Route path="/admin/products/new" element={<ProductEntry />} /> {/* Add this route */}
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/debug-api" element={<APIDebugger />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;