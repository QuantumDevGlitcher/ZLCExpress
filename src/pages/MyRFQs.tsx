import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Navigation } from "@/components/Navigation";
import { useB2B } from "@/contexts/B2BContext";
import { RFQ, RFQQuote } from "@/types";
import {
  FileText,
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  DollarSign,
  Package,
  Building,
  Calendar,
  TrendingUp,
  Send,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function MyRFQs() {
  const navigate = useNavigate();
  const { state, loadRFQs, updateRFQStatus, acceptQuote, createCounterOffer } =
    useB2B();

  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    searchTerm: "",
  });
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [counterOfferData, setCounterOfferData] = useState({
    unitPrice: "",
    leadTime: "",
    paymentTerms: "",
    specialConditions: "",
  });

  useEffect(() => {
    const initializeData = async () => {
      await loadRFQs();
      setIsLoading(false);
    };
    initializeData();
  }, [loadRFQs]);

  const filteredRFQs = state.rfqs.filter((rfq) => {
    const matchesStatus = !filters.status || rfq.status === filters.status;
    const matchesSearch =
      !filters.searchTerm ||
      rfq.rfqNumber.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      rfq.productTitle
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase()) ||
      rfq.supplierName.toLowerCase().includes(filters.searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusIcon = (status: RFQ["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "quoted":
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case "counter_offer":
        return <RefreshCw className="h-4 w-4 text-purple-600" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "expired":
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: RFQ["status"]) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "quoted":
        return "Cotización Recibida";
      case "counter_offer":
        return "Contraoferta";
      case "accepted":
        return "Aceptada";
      case "rejected":
        return "Rechazada";
      case "expired":
        return "Expirada";
      default:
        return "Desconocido";
    }
  };

  const getStatusColor = (status: RFQ["status"]) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "quoted":
        return "bg-blue-100 text-blue-800";
      case "counter_offer":
        return "bg-purple-100 text-purple-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy", { locale: es });
  };

  const handleViewRFQ = (rfq: RFQ) => {
    setSelectedRFQ(rfq);
    setShowQuoteDialog(true);
  };

  const handleAcceptQuote = async (rfqId: string, quoteId: string) => {
    await acceptQuote(rfqId, quoteId);
    setShowQuoteDialog(false);
    setSelectedRFQ(null);
  };

  const handleCreateCounterOffer = async (rfqId: string, quoteId: string) => {
    if (!counterOfferData.unitPrice) return;

    await createCounterOffer(rfqId, quoteId, {
      unitPrice: parseFloat(counterOfferData.unitPrice),
      leadTime: parseInt(counterOfferData.leadTime) || undefined,
      paymentTerms: counterOfferData.paymentTerms || undefined,
      specialConditions: counterOfferData.specialConditions || undefined,
      totalPrice:
        parseFloat(counterOfferData.unitPrice) *
        (selectedRFQ?.containerQuantity || 1),
    });

    setShowQuoteDialog(false);
    setSelectedRFQ(null);
    setCounterOfferData({
      unitPrice: "",
      leadTime: "",
      paymentTerms: "",
      specialConditions: "",
    });
  };

  // Calculate statistics
  const stats = {
    total: filteredRFQs.length,
    pending: filteredRFQs.filter((r) => r.status === "pending").length,
    quoted: filteredRFQs.filter((r) => r.status === "quoted").length,
    accepted: filteredRFQs.filter((r) => r.status === "accepted").length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 mt-20">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zlc-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mis Cotizaciones (RFQ)
              </h1>
              <p className="text-gray-600 mt-1">
                Gestione sus solicitudes de cotización y respuestas de
                proveedores
              </p>
            </div>
            <Button
              onClick={() => navigate("/categories")}
              className="bg-zlc-blue-600 hover:bg-zlc-blue-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Nueva RFQ
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total RFQs
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.total}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-zlc-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Pendientes
                    </p>
                    <p className="text-2xl font-bold text-amber-600">
                      {stats.pending}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Con Cotización
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.quoted}
                    </p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Aceptadas
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.accepted}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="search">Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="search"
                      placeholder="Nº RFQ, producto o proveedor..."
                      value={filters.searchTerm}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          searchTerm: e.target.value,
                        }))
                      }
                      className="pl-10 border border-black bg-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        status: value === "all" ? "" : value,
                      }))
                    }
                  >
                    <SelectTrigger className="border border-black bg-white">
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="quoted">
                        Cotización Recibida
                      </SelectItem>
                      <SelectItem value="counter_offer">
                        Contraoferta
                      </SelectItem>
                      <SelectItem value="accepted">Aceptada</SelectItem>
                      <SelectItem value="rejected">Rechazada</SelectItem>
                      <SelectItem value="expired">Expirada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RFQs Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Lista de RFQs ({filteredRFQs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredRFQs.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No se encontraron RFQs
                  </h3>
                  <p className="text-gray-600">
                    {filters.status || filters.searchTerm
                      ? "Intente ajustar los filtros de búsqueda"
                      : "Aún no tiene solicitudes de cotización"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nº RFQ</TableHead>
                        <TableHead>Producto</TableHead>
                        <TableHead>Proveedor</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Válido Hasta</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRFQs.map((rfq) => (
                        <TableRow key={rfq.id}>
                          <TableCell>
                            <div className="font-mono font-medium">
                              {rfq.rfqNumber}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(rfq.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium max-w-48 truncate">
                                {rfq.productTitle}
                              </div>
                              <div className="text-sm text-gray-500">
                                {rfq.incoterm} • {rfq.containerType}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">
                                {rfq.supplierName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">
                                {rfq.containerQuantity}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`flex items-center gap-1 ${getStatusColor(rfq.status)}`}
                            >
                              {getStatusIcon(rfq.status)}
                              {getStatusLabel(rfq.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {formatDate(rfq.validUntil)}
                            </div>
                            {new Date(rfq.validUntil) < new Date() && (
                              <Badge className="text-xs bg-red-100 text-red-800 mt-1">
                                Expirado
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewRFQ(rfq)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalles
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* RFQ Detail Dialog */}
          <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  Detalles de RFQ: {selectedRFQ?.rfqNumber}
                </DialogTitle>
                <DialogDescription>
                  Información completa y cotizaciones recibidas
                </DialogDescription>
              </DialogHeader>

              {selectedRFQ && (
                <div className="space-y-6">
                  {/* RFQ Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Información del RFQ</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Producto:</span>
                          <p className="font-medium">
                            {selectedRFQ.productTitle}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Cantidad:</span>
                          <p className="font-medium">
                            {selectedRFQ.containerQuantity} contenedores{" "}
                            {selectedRFQ.containerType}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Incoterm:</span>
                          <p className="font-medium">{selectedRFQ.incoterm}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">
                            Entrega Estimada:
                          </span>
                          <p className="font-medium">
                            {formatDate(selectedRFQ.estimatedDeliveryDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Estado y Fechas</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Estado:</span>
                          <Badge
                            className={`ml-2 ${getStatusColor(selectedRFQ.status)}`}
                          >
                            {getStatusLabel(selectedRFQ.status)}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-gray-600">Creado:</span>
                          <p className="font-medium">
                            {formatDate(selectedRFQ.createdAt)}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Válido hasta:</span>
                          <p className="font-medium">
                            {formatDate(selectedRFQ.validUntil)}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Proveedor:</span>
                          <p className="font-medium">
                            {selectedRFQ.supplierName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedRFQ.logisticsComments && (
                    <div>
                      <h4 className="font-medium mb-2">
                        Comentarios Logísticos
                      </h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {selectedRFQ.logisticsComments}
                      </p>
                    </div>
                  )}

                  {selectedRFQ.specialRequirements && (
                    <div>
                      <h4 className="font-medium mb-2">
                        Requisitos Especiales
                      </h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {selectedRFQ.specialRequirements}
                      </p>
                    </div>
                  )}

                  <Separator />

                  {/* Quotes Section */}
                  <div>
                    <h4 className="font-medium mb-4">
                      Cotizaciones Recibidas ({selectedRFQ.quotes.length})
                    </h4>

                    {selectedRFQ.quotes.length === 0 ? (
                      <Alert>
                        <Clock className="h-4 w-4" />
                        <AlertDescription>
                          Aún no se han recibido cotizaciones para esta RFQ. El
                          proveedor tiene hasta{" "}
                          {formatDate(selectedRFQ.validUntil)} para responder.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-4">
                        {selectedRFQ.quotes.map((quote) => (
                          <Card key={quote.id} className="border">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h5 className="font-medium">
                                    Cotización #{quote.quoteNumber}
                                  </h5>
                                  <p className="text-sm text-gray-600">
                                    {formatDate(quote.createdAt)}
                                    {quote.isCounterOffer && (
                                      <Badge className="ml-2 bg-purple-100 text-purple-800">
                                        Contraoferta
                                      </Badge>
                                    )}
                                  </p>
                                </div>
                                <Badge className={getStatusColor(quote.status)}>
                                  {quote.status === "sent" && "Enviada"}
                                  {quote.status === "accepted" && "Aceptada"}
                                  {quote.status === "rejected" && "Rechazada"}
                                  {quote.status === "expired" && "Expirada"}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                  <span className="text-sm text-gray-600">
                                    Precio Unitario:
                                  </span>
                                  <p className="font-bold text-lg">
                                    {formatCurrency(
                                      quote.unitPrice,
                                      quote.currency,
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-600">
                                    Total:
                                  </span>
                                  <p className="font-bold text-lg text-zlc-blue-600">
                                    {formatCurrency(
                                      quote.totalPrice,
                                      quote.currency,
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-600">
                                    Tiempo de Entrega:
                                  </span>
                                  <p className="font-medium">
                                    {quote.leadTime} días
                                  </p>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-600">
                                    Válido hasta:
                                  </span>
                                  <p className="font-medium">
                                    {formatDate(quote.validUntil)}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="text-gray-600">
                                    Términos de Pago:
                                  </span>
                                  <p>{quote.paymentTerms}</p>
                                </div>
                                {quote.specialConditions && (
                                  <div>
                                    <span className="text-gray-600">
                                      Condiciones Especiales:
                                    </span>
                                    <p>{quote.specialConditions}</p>
                                  </div>
                                )}
                              </div>

                              {quote.status === "sent" &&
                                selectedRFQ.status !== "accepted" && (
                                  <div className="flex gap-2 mt-4">
                                    <Button
                                      onClick={() =>
                                        handleAcceptQuote(
                                          selectedRFQ.id,
                                          quote.id,
                                        )
                                      }
                                      className="bg-green-600 hover:bg-green-700"
                                      size="sm"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Aceptar Cotización
                                    </Button>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                          <RefreshCw className="h-4 w-4 mr-2" />
                                          Contraoferta
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>
                                            Crear Contraoferta
                                          </DialogTitle>
                                          <DialogDescription>
                                            Proponga términos alternativos al
                                            proveedor
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                          <div>
                                            <Label htmlFor="counterUnitPrice">
                                              Precio Unitario Propuesto (
                                              {quote.currency})
                                            </Label>
                                            <Input
                                              id="counterUnitPrice"
                                              type="number"
                                              value={counterOfferData.unitPrice}
                                              onChange={(e) =>
                                                setCounterOfferData((prev) => ({
                                                  ...prev,
                                                  unitPrice: e.target.value,
                                                }))
                                              }
                                              placeholder={quote.unitPrice.toString()}
                                            />
                                          </div>
                                          <div>
                                            <Label htmlFor="counterLeadTime">
                                              Tiempo de Entrega (días)
                                            </Label>
                                            <Input
                                              id="counterLeadTime"
                                              type="number"
                                              value={counterOfferData.leadTime}
                                              onChange={(e) =>
                                                setCounterOfferData((prev) => ({
                                                  ...prev,
                                                  leadTime: e.target.value,
                                                }))
                                              }
                                              placeholder={quote.leadTime.toString()}
                                            />
                                          </div>
                                          <div>
                                            <Label htmlFor="counterPaymentTerms">
                                              Términos de Pago
                                            </Label>
                                            <Input
                                              id="counterPaymentTerms"
                                              value={
                                                counterOfferData.paymentTerms
                                              }
                                              onChange={(e) =>
                                                setCounterOfferData((prev) => ({
                                                  ...prev,
                                                  paymentTerms: e.target.value,
                                                }))
                                              }
                                              placeholder={quote.paymentTerms}
                                            />
                                          </div>
                                          <div>
                                            <Label htmlFor="counterSpecialConditions">
                                              Condiciones Especiales
                                            </Label>
                                            <input
                                              id="counterSpecialConditions"
                                              value={
                                                counterOfferData.specialConditions
                                              }
                                              onChange={(e) =>
                                                setCounterOfferData((prev) => ({
                                                  ...prev,
                                                  specialConditions:
                                                    e.target.value,
                                                }))
                                              }
                                              placeholder="Condiciones adicionales..."
                                            />
                                          </div>
                                          <div className="flex justify-end gap-2">
                                            <Button variant="outline">
                                              Cancelar
                                            </Button>
                                            <Button
                                              onClick={() =>
                                                handleCreateCounterOffer(
                                                  selectedRFQ.id,
                                                  quote.id,
                                                )
                                              }
                                            >
                                              Enviar Contraoferta
                                            </Button>
                                          </div>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
