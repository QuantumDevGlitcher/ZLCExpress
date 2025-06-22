import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { ShippingProvider } from "@/contexts/ShippingContext";
import { OrdersProvider } from "@/contexts/OrdersContext";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import MyQuotes from "./pages/MyQuotes";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ShippingRequest from "./pages/ShippingRequest";
import TransportOptions from "./pages/TransportOptions";
import BookingConfirmation from "./pages/BookingConfirmation";
import Documentation from "./pages/Documentation";
import OrderTracking from "./pages/OrderTracking";
import MyOrders from "./pages/MyOrders";
import OrderDetail from "./pages/OrderDetail";
import CompanyProfile from "./pages/CompanyProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <ShippingProvider>
        <OrdersProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/my-quotes" element={<MyQuotes />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Shipping Workflow Routes - Module 5 */}
                <Route path="/shipping-request" element={<ShippingRequest />} />
                <Route
                  path="/transport-options"
                  element={<TransportOptions />}
                />
                <Route
                  path="/booking-confirmation"
                  element={<BookingConfirmation />}
                />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/order-tracking" element={<OrderTracking />} />

                {/* Order Management Routes - Module 6 */}
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/order/:id" element={<OrderDetail />} />
                <Route path="/company-profile" element={<CompanyProfile />} />

                {/* Placeholder routes for navigation links */}
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
                    <div className="p-8 text-center">
                      Soporte - En desarrollo
                    </div>
                  }
                />
                <Route
                  path="/legal"
                  element={
                    <div className="p-8 text-center">
                      Marco Legal - En desarrollo
                    </div>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </OrdersProvider>
      </ShippingProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
