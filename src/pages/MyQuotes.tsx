import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { useCart } from "@/contexts/CartContext";
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
  const { state } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedQuote, setSelectedQuote] = useState<any>(null);

  // Combine context quotes with mock quotes
  const allQuotes = [...state.quotes, ...mockQuotes];

  // Filter quotes
  const filteredQuotes = allQuotes.filter((quote) => {
    const matchesSearch =
      quote.items.some((item: any) =>
        item.productTitle.toLowerCase().includes(searchQuery.toLowerCase()),
      ) || quote.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || quote.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
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
      case "sent":
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <FileText className="w-3 h-3 mr-1" />
            Enviada
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusCounts = () => {
    return {
      all: allQuotes.length,
      pending: allQuotes.filter((q) => q.status === "pending").length,
      accepted: allQuotes.filter((q) => q.status === "accepted").length,
      "counter-offer": allQuotes.filter((q) => q.status === "counter-offer")
        .length,
      rejected: allQuotes.filter((q) => q.status === "rejected").length,
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mis Cotizaciones
            </h1>
            <p className="text-gray-600">
              Gestiona y revisa el estado de tus solicitudes de cotización
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {statusCounts.all}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {statusCounts.pending}
                </div>
                <div className="text-sm text-gray-600">Pendientes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {statusCounts.accepted}
                </div>
                <div className="text-sm text-gray-600">Aceptadas</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {statusCounts["counter-offer"]}
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
                            Cotización #
                            {quote.id.split("-")[1] || quote.id.slice(-4)}
                          </h3>
                          {getStatusBadge(quote.status)}
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Enviada: {quote.sentAt?.toLocaleDateString()}
                          </div>
                          {quote.updatedAt &&
                            quote.updatedAt !== quote.sentAt && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                Actualizada:{" "}
                                {quote.updatedAt.toLocaleDateString()}
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-bold text-zlc-blue-900">
                          ${quote.totalAmount.toLocaleString()} USD
                        </div>
                        <div className="text-sm text-gray-600">
                          {quote.items.reduce(
                            (sum: number, item: any) => sum + item.quantity,
                            0,
                          )}{" "}
                          contenedor
                          {quote.items.reduce(
                            (sum: number, item: any) => sum + item.quantity,
                            0,
                          ) !== 1
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
                        {quote.items.map((item: any) => (
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
                                ${item.pricePerContainer.toLocaleString()}
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
                                Cotización #
                                {quote.id.split("-")[1] || quote.id.slice(-4)}
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
                                      {selectedQuote.sentAt?.toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>

                                {/* Products */}
                                <div>
                                  <Label className="text-sm font-medium">
                                    Productos
                                  </Label>
                                  <div className="mt-2 space-y-2">
                                    {selectedQuote.items.map((item: any) => (
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
                                          </div>
                                          <div className="text-right">
                                            <div className="font-medium">
                                              $
                                              {item.pricePerContainer.toLocaleString()}
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

                                {/* Payment Conditions */}
                                <div>
                                  <Label className="text-sm font-medium">
                                    Condiciones de Pago
                                  </Label>
                                  <div className="mt-1 text-sm">
                                    {selectedQuote.paymentConditions}
                                  </div>
                                </div>

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

                                {/* Total */}
                                <div className="border-t pt-4">
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium">
                                      Total Estimado:
                                    </span>
                                    <span className="text-xl font-bold text-zlc-blue-900">
                                      $
                                      {selectedQuote.totalAmount.toLocaleString()}{" "}
                                      USD
                                    </span>
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
        </div>
      </main>
    </div>
  );
}
