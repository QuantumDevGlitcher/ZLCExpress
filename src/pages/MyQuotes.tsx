import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Navigation } from "@/components/Navigation";
import { QuoteService, Quote } from "@/services/quoteService";
import * as API from "@/services/api";
import {
  FileText,
  Download,
  Eye,
  MessageCircle,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Calendar,
  Building,
  Package,
  DollarSign,
  Truck,
  MapPin,
  Ship,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock additional quotes for demonstration
const mockQuotes = [
  {
    id: "quote-1",
    items: [
      {
        id: "item-1",
        productTitle: "Camisetas Premium Algodón",
        supplier: "TextileCorp ZLC",
        quantity: 2,
        pricePerContainer: 15000,
      },
    ],
    totalAmount: 30750,
    status: "pending" as const,
    sentAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-16"),
    paymentConditions: "30% Anticipo, 70% contra BL",
    supplierResponse: "",
  },
  {
    id: "quote-2",
    items: [
      {
        id: "item-2",
        productTitle: "Calzado Deportivo Premium",
        supplier: "ShoeCorp International",
        quantity: 1,
        pricePerContainer: 28000,
      },
    ],
    totalAmount: 28250,
    status: "accepted" as const,
    sentAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-12"),
    paymentConditions: "Carta de Crédito a la Vista",
    supplierResponse:
      "Cotización aprobada. Procedemos con la orden de producción.",
  },
  {
    id: "quote-3",
    items: [
      {
        id: "item-3",
        productTitle: "Electrónicos para Hogar",
        supplier: "Electronics ZLC Corp",
        quantity: 3,
        pricePerContainer: 45000,
      },
    ],
    totalAmount: 135750,
    status: "counter-offer" as const,
    sentAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-14"),
    paymentConditions: "50% Anticipo, 50% contra BL",
    supplierResponse:
      "Ofrecemos un descuento del 5% por el volumen. Precio final: $42,750 por contenedor.",
  },
  {
    id: "quote-4",
    items: [
      {
        id: "item-4",
        productTitle: "Productos de Belleza",
        supplier: "Beauty Supply ZLC",
        quantity: 1,
        pricePerContainer: 32000,
      },
    ],
    totalAmount: 32250,
    status: "rejected" as const,
    sentAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-07"),
    paymentConditions: "100% Anticipo",
    supplierResponse:
      "No podemos cumplir con las condiciones de pago solicitadas.",
  },
];

export default function MyQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [stats, setStats] = useState({
    all: 0,
    pending: 0,
    accepted: 0,
    "counter-offer": 0,
    rejected: 0,
  });

  // Cargar cotizaciones al montar el componente
  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 MyQuotes: Iniciando carga de cotizaciones...');
      
      const [quotesData, statsData] = await Promise.all([
        QuoteService.getUserQuotes(),
        QuoteService.getQuoteStats()
      ]);
      
      console.log('📋 MyQuotes: Cotizaciones recibidas:', quotesData.length, quotesData);
      console.log('📊 MyQuotes: Estadísticas recibidas:', statsData);
      setQuotes(quotesData);
      
      // Actualizar estadísticas con los datos reales
      const newStats = {
        all: statsData.total,
        pending: statsData.pending,
        accepted: statsData.accepted,
        "counter-offer": 0, // No implementado aún en backend
        rejected: statsData.rejected,
      };
      console.log('📈 MyQuotes: Nuevas estadísticas:', newStats);
      setStats(newStats);
      
    } catch (error) {
      console.error('❌ MyQuotes: Error cargando cotizaciones:', error);
    } finally {
      setIsLoading(false);
      console.log('✅ MyQuotes: Carga completada');
    }
  };

  // Función de prueba para diagnosticar problemas
  const testConnection = async () => {
    console.log('🧪 Iniciando prueba de conexión...');
    const result = await API.testBackendConnection();
    console.log('🧪 Resultado de prueba:', result);
    alert(`Prueba de conexión: ${result.success ? 'ÉXITO' : 'FALLO'}\n${result.message}`);
  };

  // Función para crear una RFQ de prueba
  const createTestRFQ = async () => {
    console.log('🧪 Creando RFQ de prueba...');
    
    const testRFQData = {
      productId: 'prod_1', // Usar un producto que existe en la base de datos
      productName: 'Producto de Prueba',
      requesterName: 'Usuario Demo',
      requesterEmail: 'demo@example.com',
      companyName: 'Empresa Demo',
      containerQuantity: 1,
      containerType: '40GP' as const,
      incoterm: 'FOB' as const,
      tentativeDeliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      logisticsComments: 'RFQ de prueba para verificar conectividad',
      priority: 'medium' as const,
      estimatedValue: 10000,
      currency: 'USD'
    };
    
    try {
      const result = await API.createRFQ(testRFQData);
      console.log('🧪 Resultado de RFQ de prueba:', result);
      
      if (result.success) {
        alert('✅ RFQ de prueba creada exitosamente!\n\nAhora actualiza la lista para verla.');
        loadQuotes(); // Recargar la lista
      } else {
        alert(`❌ Error creando RFQ de prueba:\n${result.message}`);
      }
    } catch (error) {
      console.error('❌ Error en createTestRFQ:', error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  // Filtrar cotizaciones
  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch =
      quote.items.some((item) =>
        item.productTitle.toLowerCase().includes(searchQuery.toLowerCase()),
      ) || quote.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || quote.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Quote['status']) => {
    switch (status) {
      case "pending":
      case "sent":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
      case "quoted":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <MessageCircle className="w-3 h-3 mr-1" />
            Cotizada
          </Badge>
        );
      case "accepted":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Aceptada
          </Badge>
        );
      case "counter-offer":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Contraoferta
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rechazada
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <Clock className="w-3 h-3 mr-1" />
            Expirada
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusCounts = () => {
    return {
      all: quotes.length,
      pending: quotes.filter((q) => q.status === "pending" || q.status === "sent").length,
      accepted: quotes.filter((q) => q.status === "accepted").length,
      "counter-offer": quotes.filter((q) => q.status === "counter-offer").length,
      rejected: quotes.filter((q) => q.status === "rejected").length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-zlc-gray-50">
      <Navigation />

      <main className="pt-14 sm:pt-16 md:pt-20">
        <div className="container-section py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Mis Cotizaciones
              </h1>
              <div className="flex gap-2">
                <Button
                  onClick={createTestRFQ}
                  variant="default"
                  size="sm"
                >
                  ➕ Crear RFQ Prueba
                </Button>
                <Button
                  onClick={testConnection}
                  variant="secondary"
                  size="sm"
                >
                  🧪 Probar Backend
                </Button>
                <Button
                  onClick={loadQuotes}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Actualizar
                </Button>
              </div>
            </div>
            <p className="text-gray-600">
              Gestiona y revisa el estado de tus solicitudes de cotización
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-zlc-blue-600" />
              <span className="ml-2 text-gray-600">Cargando cotizaciones...</span>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.all}
                    </div>
                    <div className="text-sm text-gray-600">Total</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {stats.pending}
                    </div>
                    <div className="text-sm text-gray-600">Pendientes</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {stats.accepted}
                    </div>
                    <div className="text-sm text-gray-600">Aceptadas</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {stats["counter-offer"]}
                    </div>
                    <div className="text-sm text-gray-600">Contraofertas</div>
                  </CardContent>
                </Card>
              </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por producto o ID de cotización..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="accepted">Aceptadas</SelectItem>
                    <SelectItem value="counter-offer">Contraofertas</SelectItem>
                    <SelectItem value="rejected">Rechazadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Quotes List */}
          {filteredQuotes.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchQuery || statusFilter !== "all"
                    ? "No se encontraron cotizaciones"
                    : "No tienes cotizaciones aún"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || statusFilter !== "all"
                    ? "Prueba ajustando los filtros de búsqueda"
                    : "Explora nuestro catálogo y solicita tu primera cotización"}
                </p>
                <Button
                  asChild
                  className="bg-zlc-blue-600 hover:bg-zlc-blue-700"
                >
                  <Link to="/categories">Explorar Productos</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredQuotes.map((quote) => (
                <Card
                  key={quote.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {quote.quoteNumber}
                          </h3>
                          {getStatusBadge(quote.status)}
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Enviada: {QuoteService.formatDate(quote.sentAt)}
                          </div>
                          {quote.updatedAt &&
                            quote.updatedAt !== quote.sentAt && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                Actualizada:{" "}
                                {QuoteService.formatDate(quote.updatedAt || quote.sentAt)}
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-bold text-zlc-blue-900">
                          {QuoteService.formatCurrency(quote.grandTotal, 'USD')}
                        </div>
                        <div className="text-sm text-gray-600">
                          {quote.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                          contenedor
                          {quote.items.reduce((sum, item) => sum + item.quantity, 0) !== 1
                            ? "es"
                            : ""}
                        </div>
                      </div>
                    </div>

                    {/* Products Summary */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Productos:
                      </h4>
                      <div className="space-y-2">
                        {quote.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <Package className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">
                                {item.productTitle}
                              </span>
                              <div className="flex items-center text-gray-600">
                                <Building className="h-3 w-3 mr-1" />
                                {item.supplier}
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span>
                                {item.quantity} contenedor
                                {item.quantity !== 1 ? "es" : ""}
                              </span>
                              <span className="font-medium">
                                {QuoteService.formatCurrency(item.pricePerContainer, item.currency)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Supplier Response */}
                    {quote.supplierResponse && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <MessageCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-900 mb-1">
                              Respuesta del Proveedor:
                            </p>
                            <p className="text-sm text-blue-800">
                              {quote.supplierResponse}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Freight Information */}
                    {quote.freightDetails && (
                      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start space-x-2 mb-3">
                          <Ship className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-green-900 mb-1">
                              Información de Flete
                            </h4>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Origen:</span>
                            <p className="text-gray-600">{quote.freightDetails.origin}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Destino:</span>
                            <p className="text-gray-600">{quote.freightDetails.destination}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Transportista:</span>
                            <p className="text-gray-600">{quote.freightDetails.carrier}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Costo:</span>
                            <p className="text-green-700 font-semibold">
                              {QuoteService.formatCurrency(quote.freightDetails.cost, quote.freightDetails.currency)}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Tiempo de tránsito:</span>
                            <p className="text-gray-600">{quote.freightDetails.transitTime} días</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Fecha estimada:</span>
                            <p className="text-gray-600">{QuoteService.formatDate(quote.freightDetails.estimatedDate)}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        Pago: {quote.paymentConditions}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedQuote(quote)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Detalles
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>
                                {quote.quoteNumber}
                              </DialogTitle>
                              <DialogDescription>
                                Detalles completos de la cotización
                              </DialogDescription>
                            </DialogHeader>

                            {selectedQuote && (
                              <div className="space-y-6">
                                {/* Status and Dates */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Estado
                                    </Label>
                                    <div className="mt-1">
                                      {getStatusBadge(selectedQuote.status)}
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Fecha de Envío
                                    </Label>
                                    <div className="mt-1 text-sm">
                                      {QuoteService.formatDate(selectedQuote.sentAt)}
                                    </div>
                                  </div>
                                </div>

                                {/* Products */}
                                <div>
                                  <Label className="text-sm font-medium">
                                    Productos
                                  </Label>
                                  <div className="mt-2 space-y-2">
                                    {selectedQuote.items.map((item) => (
                                      <div
                                        key={item.id}
                                        className="border rounded-lg p-3"
                                      >
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <h4 className="font-medium">
                                              {item.productTitle}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                              {item.supplier}
                                            </p>
                                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                              <span>Tipo: {item.containerType}</span>
                                              <span>Incoterm: {item.incoterm}</span>
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <div className="font-medium">
                                              {QuoteService.formatCurrency(item.pricePerContainer, item.currency)}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                              {item.quantity} contenedor
                                              {item.quantity !== 1 ? "es" : ""}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Freight Information */}
                                {selectedQuote.freightDetails && (
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Información de Flete
                                    </Label>
                                    <div className="mt-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <span className="font-medium text-gray-700">Origen:</span>
                                          <p className="text-gray-600">{selectedQuote.freightDetails.origin}</p>
                                        </div>
                                        <div>
                                          <span className="font-medium text-gray-700">Destino:</span>
                                          <p className="text-gray-600">{selectedQuote.freightDetails.destination}</p>
                                        </div>
                                        <div>
                                          <span className="font-medium text-gray-700">Transportista:</span>
                                          <p className="text-gray-600">{selectedQuote.freightDetails.carrier}</p>
                                        </div>
                                        <div>
                                          <span className="font-medium text-gray-700">Costo del Flete:</span>
                                          <p className="text-green-700 font-semibold">
                                            {QuoteService.formatCurrency(selectedQuote.freightDetails.cost, selectedQuote.freightDetails.currency)}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="font-medium text-gray-700">Tiempo de tránsito:</span>
                                          <p className="text-gray-600">{selectedQuote.freightDetails.transitTime} días</p>
                                        </div>
                                        <div>
                                          <span className="font-medium text-gray-700">Fecha estimada:</span>
                                          <p className="text-gray-600">{QuoteService.formatDate(selectedQuote.freightDetails.estimatedDate)}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Payment Conditions */}
                                <div>
                                  <Label className="text-sm font-medium">
                                    Condiciones de Pago
                                  </Label>
                                  <div className="mt-1 text-sm">
                                    {selectedQuote.paymentConditions}
                                  </div>
                                </div>

                                {/* Special Requirements */}
                                {selectedQuote.specialRequirements && (
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Comentarios Logísticos
                                    </Label>
                                    <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                                      {selectedQuote.specialRequirements}
                                    </div>
                                  </div>
                                )}

                                {/* Supplier Response */}
                                {selectedQuote.supplierResponse && (
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Respuesta del Proveedor
                                    </Label>
                                    <div className="mt-1 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                                      {selectedQuote.supplierResponse}
                                    </div>
                                  </div>
                                )}

                                {/* Cost Breakdown */}
                                <div className="border-t pt-4">
                                  <Label className="text-sm font-medium mb-3 block">
                                    Desglose de Costos
                                  </Label>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>Subtotal Productos:</span>
                                      <span>{QuoteService.formatCurrency(selectedQuote.totalAmount, 'USD')}</span>
                                    </div>
                                    {selectedQuote.freightCost && selectedQuote.freightCost > 0 && (
                                      <div className="flex justify-between">
                                        <span>Costo de Flete:</span>
                                        <span>{QuoteService.formatCurrency(selectedQuote.freightCost, 'USD')}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between">
                                      <span>Comisión de Plataforma:</span>
                                      <span>{QuoteService.formatCurrency(selectedQuote.platformCommission, 'USD')}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2 font-semibold text-base">
                                      <span>Total:</span>
                                      <span className="text-zlc-blue-900">
                                        {QuoteService.formatCurrency(selectedQuote.grandTotal, 'USD')}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Descargar
                        </Button>

                        {quote.status === "counter-offer" && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Aceptar Oferta
                          </Button>
                        )}

                        {quote.status === "accepted" && (
                          <Button
                            size="sm"
                            className="bg-zlc-blue-600 hover:bg-zlc-blue-700"
                          >
                            Proceder con Orden
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
