import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { ShippingProvider } from "@/contexts/ShippingContext";
import { OrdersProvider } from "@/contexts/OrdersContext";
import { B2BProvider } from "@/contexts/B2BContext";
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
import MyRFQs from "./pages/MyRFQs";
import PaymentTerms from "./pages/PaymentTerms";
import ContractTemplates from "./pages/ContractTemplates";
import OfferHistory from "./pages/OfferHistory";
import Communications from "./pages/Communications";
import CustomsSupport from "./pages/CustomsSupport";
import SupplierDashboard from "./pages/SupplierDashboard";
import SupplierProducts from "./pages/SupplierProducts";
import SupplierCreateProduct from "./pages/SupplierCreateProduct";
import SupplierRFQs from "./pages/SupplierRFQs";
import SupplierRFQResponse from "./pages/SupplierRFQResponse";
import SupplierOrders from "./pages/SupplierOrders";
import SupplierOrderDetail from "./pages/SupplierOrderDetail";
import SupplierShipments from "./pages/SupplierShipments";
import SupplierShipmentDetail from "./pages/SupplierShipmentDetail";
import SupplierTracking from "./pages/SupplierTracking";
import SupplierProfile from "./pages/SupplierProfile";
import SupplierReports from "./pages/SupplierReports";
import SupplierCustoms from "./pages/SupplierCustoms";
import SupplierMessages from "./pages/SupplierMessages";
import SupplierSettings from "./pages/SupplierSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <ShippingProvider>
        <OrdersProvider>
          <B2BProvider>
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
                  <Route
                    path="/shipping-request"
                    element={<ShippingRequest />}
                  />
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

                  {/* B2B/Wholesale Routes - Module 7 */}
                  <Route path="/my-rfqs" element={<MyRFQs />} />
                  <Route path="/payment-terms" element={<PaymentTerms />} />
                  <Route
                    path="/contract-templates"
                    element={<ContractTemplates />}
                  />
                  <Route path="/offer-history" element={<OfferHistory />} />
                  <Route path="/communications" element={<Communications />} />
                  <Route path="/customs-support" element={<CustomsSupport />} />

                  {/* Supplier Dashboard Routes */}
                  <Route
                    path="/supplier/dashboard"
                    element={<SupplierDashboard />}
                  />
                  <Route
                    path="/supplier/products"
                    element={<SupplierProducts />}
                  />
                  <Route
                    path="/supplier/products/new"
                    element={<SupplierCreateProduct />}
                  />
                  <Route path="/supplier/rfqs" element={<SupplierRFQs />} />
                  <Route
                    path="/supplier/rfqs/:id/respond"
                    element={<SupplierRFQResponse />}
                  />
                  <Route path="/supplier/orders" element={<SupplierOrders />} />
                  <Route
                    path="/supplier/orders/:id"
                    element={<SupplierOrderDetail />}
                  />
                  <Route
                    path="/supplier/shipments"
                    element={<SupplierShipments />}
                  />
                  <Route
                    path="/supplier/shipments/:id"
                    element={<SupplierShipmentDetail />}
                  />
                  <Route
                    path="/supplier/tracking"
                    element={<SupplierTracking />}
                  />
                  <Route
                    path="/supplier/profile"
                    element={<SupplierProfile />}
                  />
                  <Route
                    path="/supplier/reports"
                    element={<SupplierReports />}
                  />
                  <Route
                    path="/supplier/customs"
                    element={<SupplierCustoms />}
                  />
                  <Route
                    path="/supplier/messages"
                    element={<SupplierMessages />}
                  />
                  <Route
                    path="/supplier/settings"
                    element={<SupplierSettings />}
                  />

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
          </B2BProvider>
        </OrdersProvider>
      </ShippingProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
