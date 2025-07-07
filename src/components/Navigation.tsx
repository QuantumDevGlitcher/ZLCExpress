import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CartDropdown } from "@/components/CartDropdown";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Building2,
  ChevronDown,
  Globe,
  HelpCircle,
  Home,
  Menu,
  Package,
  Scale,
  Settings,
  ShoppingCart,
  User,
  MessageSquare,
  FileText,
  Shield,
  Bell,
  TrendingUp,
  BarChart3,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const languages = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
];

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "CRC", name: "Costa Rican Colón", symbol: "₡" },
  { code: "PAB", name: "Panamanian Balboa", symbol: "B/." },
];

const mainMenuItems = [
  { label: "Inicio", href: "/", icon: Home },
  { label: "Categorías", href: "/categories", icon: Package },
  { label: "Cómo Funciona", href: "/how-it-works", icon: HelpCircle },
  { label: "Ayuda/Soporte", href: "/support", icon: HelpCircle },
  { label: "Marco Legal", href: "/legal", icon: Scale },
];

const b2bMenuItems = [
  { label: "Mis RFQs", href: "/my-rfqs", icon: FileText },
  { label: "Historial de Ofertas", href: "/offer-history", icon: TrendingUp },
  { label: "Comunicaciones", href: "/communications", icon: MessageSquare },
  { label: "Términos de Pago", href: "/payment-terms", icon: Settings },
  { label: "Contratos", href: "/contract-templates", icon: Scale },
  { label: "Aduana ZLC", href: "/customs-support", icon: Shield },
];

const supplierMenuItems = [
  { label: "Mi Panel", href: "/supplier/dashboard", icon: Home },
  { label: "Mi Perfil", href: "/supplier/profile", icon: Building2 },
  { label: "Mis Lotes", href: "/supplier/products", icon: Package },
  { label: "Cotizaciones RFQ", href: "/supplier/rfqs", icon: FileText },
  { label: "Órdenes Proforma", href: "/supplier/orders", icon: ShoppingCart },
  { label: "Envíos y Logística", href: "/supplier/shipments", icon: Truck },
  { label: "Mensajería", href: "/supplier/messages", icon: MessageSquare },
  { label: "Reportes y Ventas", href: "/supplier/reports", icon: BarChart3 },
  { label: "Aduana y Docs", href: "/supplier/customs", icon: Shield },
  { label: "Configuraciones", href: "/supplier/settings", icon: Settings },
];

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const location = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from auth context
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const companyStatus = "verified"; // This would come from auth context

  // ============================================
  // USER TYPE DETECTION - FOR DEVELOPMENT ONLY
  // TODO: REPLACE WITH REAL AUTH CONTEXT
  // ============================================
  const isSupplierRoute = location.pathname.startsWith("/supplier");
  const userType = isSupplierRoute ? "supplier" : "buyer";
  // ============================================
  // END USER TYPE DETECTION SECTION
  // ============================================

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm",
        className,
      )}
    >
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 xl:max-w-7xl xl:mx-auto">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 sm:space-x-3 hover:opacity-90 transition-opacity min-w-fit flex-shrink-0"
          >
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-zlc-blue-700 to-zlc-blue-900 text-white shadow-soft">
              <Building2 className="h-5 w-5 sm:h-7 sm:w-7" />
            </div>
            <div className="hidden sm:flex flex-col justify-center min-w-0">
              <span className="text-lg sm:text-xl font-bold text-zlc-blue-900 tracking-tight whitespace-nowrap">
                ZLC Express
              </span>
              <span className="text-xs sm:text-sm text-zlc-gray-600 font-medium whitespace-nowrap">
                B2B Marketplace
              </span>
            </div>
          </Link>
          {/* Desktop Navigation */}
          <NavigationMenu className="hidden xl:flex">
            <NavigationMenuList>
              {mainMenuItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.href}
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-zlc-gray-100 hover:text-zlc-blue-800 focus:bg-zlc-gray-100 focus:text-zlc-blue-800 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}

              {/* User Type Specific Menu */}
              {userType === "supplier" ? (
                /* Supplier Dropdown Menu */
                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-10 px-4 py-2 text-sm font-medium"
                      >
                        <Building2 className="mr-2 h-4 w-4" />
                        Panel Proveedor
                        <ChevronDown className="ml-2 h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64">
                      <DropdownMenuLabel>
                        Mi Panel de Proveedor
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {supplierMenuItems.map((item) => (
                        <DropdownMenuItem key={item.href} asChild>
                          <Link to={item.href} className="w-full">
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>
              ) : (
                /* B2B Buyer Dropdown Menu */
                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-10 px-4 py-2 text-sm font-medium"
                      >
                        <Building2 className="mr-2 h-4 w-4" />
                        B2B
                        <ChevronDown className="ml-2 h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuLabel>Herramientas B2B</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {b2bMenuItems.map((item) => (
                        <DropdownMenuItem key={item.href} asChild>
                          <Link to={item.href} className="w-full">
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Cart Dropdown - Only for Buyers */}
            {userType === "buyer" && <CartDropdown />}
            {/* Language & Currency Selector */}
            <div className="hidden lg:flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 px-3">
                    <Globe className="mr-2 h-4 w-4" />
                    <span className="mr-1">{selectedLanguage.flag}</span>
                    <span className="mr-2 text-sm">
                      {selectedLanguage.code.toUpperCase()}
                    </span>
                    <span className="mx-1">|</span>
                    <span className="ml-1 text-sm font-medium">
                      {selectedCurrency.symbol}
                    </span>
                    <ChevronDown className="ml-2 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Idioma</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setSelectedLanguage(lang)}
                        className={cn(
                          selectedLanguage.code === lang.code &&
                            "bg-zlc-blue-50",
                        )}
                      >
                        <span className="mr-2">{lang.flag}</span>
                        {lang.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Moneda</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    {currencies.map((currency) => (
                      <DropdownMenuItem
                        key={currency.code}
                        onClick={() => setSelectedCurrency(currency)}
                        className={cn(
                          selectedCurrency.code === currency.code &&
                            "bg-zlc-blue-50",
                        )}
                      >
                        <span className="mr-2 font-mono text-sm">
                          {currency.symbol}
                        </span>
                        {currency.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* User Authentication */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                {companyStatus === "verified" && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    Empresa Verificada
                  </Badge>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-9">
                      <User className="mr-2 h-4 w-4" />
                      Mi Cuenta
                      <ChevronDown className="ml-2 h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userType === "supplier" ? (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/supplier/dashboard">
                            <Home className="mr-2 h-4 w-4" />
                            Mi Panel
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/supplier/profile">
                            <Building2 className="mr-2 h-4 w-4" />
                            Mi Perfil
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/supplier/products">
                            <Package className="mr-2 h-4 w-4" />
                            Mis Lotes
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/supplier/orders">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Mis Órdenes
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/supplier/settings">
                            <Settings className="mr-2 h-4 w-4" />
                            Configuración
                          </Link>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/my-orders">
                            <Package className="mr-2 h-4 w-4" />
                            Mis Pedidos
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/company-profile">
                            <Settings className="mr-2 h-4 w-4" />
                            Configuración
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Button variant="ghost" asChild>
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
                <Button
                  asChild
                  className="bg-zlc-blue-800 hover:bg-zlc-blue-900"
                >
                  <Link to="/register">Registrar Empresa</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="xl:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-6">
                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-2">
                    {mainMenuItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsSheetOpen(false)}
                        className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-zlc-gray-100"
                      >
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.label}
                      </Link>
                    ))}

                    {/* User Type Specific Menu in Mobile */}
                    <div className="border-t pt-4 mt-4">
                      {userType === "supplier" ? (
                        <>
                          <h4 className="text-sm font-medium text-gray-900 mb-2 px-3">
                            <Building2 className="inline mr-2 h-4 w-4" />
                            Panel Proveedor
                          </h4>
                          {supplierMenuItems.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={() => setIsSheetOpen(false)}
                              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-zlc-gray-100 ml-4"
                            >
                              <item.icon className="mr-3 h-4 w-4" />
                              {item.label}
                            </Link>
                          ))}
                        </>
                      ) : (
                        <>
                          <h4 className="text-sm font-medium text-gray-900 mb-2 px-3">
                            <Building2 className="inline mr-2 h-4 w-4" />
                            B2B Tools
                          </h4>
                          {b2bMenuItems.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={() => setIsSheetOpen(false)}
                              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-zlc-gray-100 ml-4"
                            >
                              <item.icon className="mr-3 h-4 w-4" />
                              {item.label}
                            </Link>
                          ))}
                        </>
                      )}
                    </div>
                  </nav>

                  {/* Mobile Language & Currency */}
                  <div className="space-y-4 border-t pt-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Idioma</h4>
                      <div className="space-y-1">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => setSelectedLanguage(lang)}
                            className={cn(
                              "flex w-full items-center rounded-lg px-3 py-2 text-sm",
                              selectedLanguage.code === lang.code
                                ? "bg-zlc-blue-100 text-zlc-blue-900"
                                : "hover:bg-zlc-gray-100",
                            )}
                          >
                            <span className="mr-2">{lang.flag}</span>
                            {lang.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Moneda</h4>
                      <div className="space-y-1">
                        {currencies.map((currency) => (
                          <button
                            key={currency.code}
                            onClick={() => setSelectedCurrency(currency)}
                            className={cn(
                              "flex w-full items-center rounded-lg px-3 py-2 text-sm",
                              selectedCurrency.code === currency.code
                                ? "bg-zlc-blue-100 text-zlc-blue-900"
                                : "hover:bg-zlc-gray-100",
                            )}
                          >
                            <span className="mr-2 font-mono">
                              {currency.symbol}
                            </span>
                            {currency.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Auth */}
                  {!isLoggedIn && (
                    <div className="space-y-2 border-t pt-6">
                      <Button
                        variant="ghost"
                        asChild
                        className="w-full justify-start"
                      >
                        <Link to="/login" onClick={() => setIsSheetOpen(false)}>
                          Iniciar Sesión
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className="w-full bg-zlc-blue-800 hover:bg-zlc-blue-900"
                      >
                        <Link
                          to="/register"
                          onClick={() => setIsSheetOpen(false)}
                        >
                          Registrar Empresa
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
