import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Placeholder routes for navigation links */}
          <Route
            path="/categories"
            element={
              <div className="p-8 text-center">Categorías - En desarrollo</div>
            }
          />
          <Route
            path="/how-it-works"
            element={
              <div className="p-8 text-center">
                Cómo Funciona - En desarrollo
              </div>
            }
          />
          <Route
            path="/support"
            element={
              <div className="p-8 text-center">Soporte - En desarrollo</div>
            }
          />
          <Route
            path="/legal"
            element={
              <div className="p-8 text-center">Marco Legal - En desarrollo</div>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
