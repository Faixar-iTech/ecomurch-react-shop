// App.jsx
import { Toaster as RadixToaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner"; // Direct from sonner package
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
      {/* Radix UI Toaster if you need it for specific components */}
      {/* <RadixToaster /> */}
      
      {/* Sonner Toaster for general use */}
      <SonnerToaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/products/new" element={<ProductEntry />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/debug-api" element={<APIDebugger />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;