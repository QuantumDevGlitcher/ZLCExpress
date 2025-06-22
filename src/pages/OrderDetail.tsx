import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navigation } from "@/components/Navigation";
import { useOrders } from "@/contexts/OrdersContext";
import { PaymentRecord } from "@/types";
import {
  ArrowLeft,
  Package,
  Building,
  Calendar,
  DollarSign,
  FileText,
  Download,
  ExternalLink,
  Upload,
  CheckCircle,
  Clock,
  Ship,
  Truck,
  MessageSquare,
  CreditCard,
  MapPin,
  AlertCircle,
  Container,
  Shield,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    state,
    loadOrderById,
    markOrderAsDelivered,
    addPaymentRecord,
    downloadDocument,
  } = useOrders();

  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    type: "balance" as const,
    amount: "",
    method: "wire_transfer" as const,
    reference: "",
    notes: "",
  });
  const [supportForm, setSupportForm] = useState({
    subject: "",
    priority: "medium" as const,
    description: "",
  });

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        await loadOrderById(id);
      }
      setIsLoading(false);
    };
    loadData();
  }, [id, loadOrderById]);

  const order = state.currentOrder;

  const handleMarkAsDelivered = async () => {
    if (order) {
      await markOrderAsDelivered(order.id);
    }
  };

  const handleAddPayment = async () => {
    if (!order || !paymentForm.amount) return;

    const payment: Omit<PaymentRecord, "id"> = {
      orderId: order.id,
      type: paymentForm.type,
      amount: parseFloat(paymentForm.amount),
      currency: order.currency,
      method: paymentForm.method,
      status: "pending",
      paymentDate: new Date(),
      reference: paymentForm.reference,
      notes: paymentForm.notes,
    };

    await addPaymentRecord(order.id, payment);
    setShowPaymentDialog(false);
    setPaymentForm({
      type: "balance",
      amount: "",
      method: "wire_transfer",
      reference: "",
      notes: "",
    });
  };

  const handleDownload = (documentId: string) => {
    if (order) {
      downloadDocument(order.id, documentId);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in_production":
        return <Package className="h-4 w-4 text-blue-600" />;
      case "in_transit":
        return <Ship className="h-4 w-4 text-purple-600" />;
      case "customs":
        return <FileText className="h-4 w-4 text-orange-600" />;
      case "delivered":
        return <Truck className="h-4 w-4 text-green-600" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-700" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "confirmed":
        return "Confirmado";
      case "in_production":
        return "En Producción";
      case "in_transit":
        return "En Tránsito";
      case "customs":
        return "En Aduana";
      case "delivered":
        return "Entregado";
      case "completed":
        return "Completado";
      default:
        return "Desconocido";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy HH:mm", { locale: es });
  };

  const totalPaid =
    order?.payments
      .filter((p) => p.status === "confirmed")
      .reduce((sum, p) => sum + p.amount, 0) || 0;

  const pendingAmount = (order?.totalAmount || 0) - totalPaid;

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

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 mt-20">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Pedido no encontrado
            </h1>
            <p className="text-gray-600 mb-4">
              El pedido que busca no existe o no tiene permisos para verlo.
            </p>
            <Button onClick={() => navigate("/my-orders")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Mis Pedidos
            </Button>
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
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/my-orders")}
              className="text-zlc-blue-600 hover:text-zlc-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Mis Pedidos
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {order.orderNumber}
              </h1>
              <p className="text-gray-600 mt-1">
                Detalles completos del pedido B2B
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(order.status)}
              <Badge className="text-sm">{getStatusLabel(order.status)}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-6">
              {/* Order Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-zlc-blue-600" />
                    Información del Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label className="text-sm text-gray-600">
                        Número de PO
                      </Label>
                      <p className="font-mono font-bold text-lg">
                        {order.orderNumber}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">
                        Fecha de Creación
                      </Label>
                      <p className="font-medium">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">
                        Estado Actual
                      </Label>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className="font-medium">
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm text-gray-600">Proveedor</Label>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {order.supplierName}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">Incoterm</Label>
                      <Badge variant="outline" className="mt-1">
                        {order.incoterm}
                      </Badge>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm text-gray-600">
                        Condiciones de Pago
                      </Label>
                      <p className="font-medium">{order.paymentConditions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Container Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Container className="h-5 w-5 text-zlc-blue-600" />
                    Desglose de Lotes por Contenedor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Producto</TableHead>
                          <TableHead>Contenedor</TableHead>
                          <TableHead>Cantidad</TableHead>
                          <TableHead>Precio Unitario</TableHead>
                          <TableHead>Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.containers.map((container) => (
                          <TableRow key={container.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {container.productTitle}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {Object.entries(container.specifications)
                                    .slice(0, 2)
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join(" | ")}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {container.containerType}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {container.quantity}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(
                                container.unitPrice,
                                order.currency,
                              )}
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(
                                container.subtotal,
                                order.currency,
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-gray-50">
                          <TableCell colSpan={4} className="font-medium">
                            Total del Pedido
                          </TableCell>
                          <TableCell className="font-bold text-lg">
                            {formatCurrency(order.totalAmount, order.currency)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              {order.shippingData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ship className="h-5 w-5 text-zlc-blue-600" />
                      Datos del Transportista
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm text-gray-600">Naviera</Label>
                        <p className="font-medium">
                          {order.shippingData.shippingLine}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Buque</Label>
                        <p className="font-medium">
                          {order.shippingData.vesselName}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">
                          Nº de Contenedor
                        </Label>
                        <p className="font-mono font-medium">
                          {order.shippingData.containerNumber}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">
                          Número de B/L
                        </Label>
                        <p className="font-mono font-medium">
                          {order.shippingData.blNumber}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">
                          ETD (Zarpe)
                        </Label>
                        <p className="font-medium">
                          {formatDate(order.shippingData.etd)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">
                          ETA (Llegada)
                        </Label>
                        <p className="font-medium">
                          {formatDate(order.shippingData.eta)}
                        </p>
                      </div>
                    </div>

                    {order.shippingData.trackingUrl && (
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              order.shippingData!.trackingUrl,
                              "_blank",
                            )
                          }
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Rastrear Contenedor
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Payment History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-zlc-blue-600" />
                      Historial de Pagos
                    </div>
                    <Dialog
                      open={showPaymentDialog}
                      onOpenChange={setShowPaymentDialog}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Registrar Pago
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Registrar Pago</DialogTitle>
                          <DialogDescription>
                            Registre un nuevo pago para este pedido
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="paymentType">Tipo de Pago</Label>
                              <Select
                                value={paymentForm.type}
                                onValueChange={(value) =>
                                  setPaymentForm((prev) => ({
                                    ...prev,
                                    type: value as any,
                                  }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="advance">
                                    Anticipo
                                  </SelectItem>
                                  <SelectItem value="balance">
                                    Balance
                                  </SelectItem>
                                  <SelectItem value="full">
                                    Pago Total
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="paymentAmount">
                                Monto ({order.currency})
                              </Label>
                              <Input
                                id="paymentAmount"
                                type="number"
                                value={paymentForm.amount}
                                onChange={(e) =>
                                  setPaymentForm((prev) => ({
                                    ...prev,
                                    amount: e.target.value,
                                  }))
                                }
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="paymentMethod">
                              Método de Pago
                            </Label>
                            <Select
                              value={paymentForm.method}
                              onValueChange={(value) =>
                                setPaymentForm((prev) => ({
                                  ...prev,
                                  method: value as any,
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="wire_transfer">
                                  Transferencia Bancaria
                                </SelectItem>
                                <SelectItem value="letter_of_credit">
                                  Carta de Crédito
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="paymentReference">Referencia</Label>
                            <Input
                              id="paymentReference"
                              value={paymentForm.reference}
                              onChange={(e) =>
                                setPaymentForm((prev) => ({
                                  ...prev,
                                  reference: e.target.value,
                                }))
                              }
                              placeholder="Número de referencia del pago"
                            />
                          </div>
                          <div>
                            <Label htmlFor="paymentNotes">
                              Notas (Opcional)
                            </Label>
                            <Textarea
                              id="paymentNotes"
                              value={paymentForm.notes}
                              onChange={(e) =>
                                setPaymentForm((prev) => ({
                                  ...prev,
                                  notes: e.target.value,
                                }))
                              }
                              placeholder="Notas adicionales sobre el pago"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setShowPaymentDialog(false)}
                            >
                              Cancelar
                            </Button>
                            <Button onClick={handleAddPayment}>
                              Registrar Pago
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Payment Summary */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label className="text-sm text-gray-600">
                          Total del Pedido
                        </Label>
                        <p className="font-bold text-lg">
                          {formatCurrency(order.totalAmount, order.currency)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">
                          Total Pagado
                        </Label>
                        <p className="font-bold text-lg text-green-600">
                          {formatCurrency(totalPaid, order.currency)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">
                          Pendiente
                        </Label>
                        <p
                          className={`font-bold text-lg ${
                            pendingAmount > 0
                              ? "text-amber-600"
                              : "text-green-600"
                          }`}
                        >
                          {formatCurrency(pendingAmount, order.currency)}
                        </p>
                      </div>
                    </div>

                    {/* Payment List */}
                    <div className="space-y-3">
                      {order.payments.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="font-medium">
                                {payment.type === "advance" && "Anticipo"}
                                {payment.type === "balance" && "Balance"}
                                {payment.type === "full" && "Pago Total"}
                                {" - "}
                                {formatCurrency(
                                  payment.amount,
                                  payment.currency,
                                )}
                              </div>
                              <div className="text-sm text-gray-600">
                                {formatDate(payment.paymentDate)} • Ref:{" "}
                                {payment.reference}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                payment.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : payment.status === "pending"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {payment.status === "confirmed" && "Confirmado"}
                              {payment.status === "pending" && "Pendiente"}
                              {payment.status === "failed" && "Fallido"}
                            </Badge>
                            {payment.receipt && (
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}

                      {order.payments.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                          No hay pagos registrados para este pedido
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Key Dates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fechas Clave
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    {order.keyDates.proformaIssued && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Proforma Emitida:</span>
                        <span className="font-medium">
                          {format(order.keyDates.proformaIssued, "dd/MM/yyyy")}
                        </span>
                      </div>
                    )}
                    {order.keyDates.paymentConfirmed && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pago Confirmado:</span>
                        <span className="font-medium">
                          {format(
                            order.keyDates.paymentConfirmed,
                            "dd/MM/yyyy",
                          )}
                        </span>
                      </div>
                    )}
                    {order.keyDates.productionStarted && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Producción Iniciada:
                        </span>
                        <span className="font-medium">
                          {format(
                            order.keyDates.productionStarted,
                            "dd/MM/yyyy",
                          )}
                        </span>
                      </div>
                    )}
                    {order.keyDates.departed && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Zarpado:</span>
                        <span className="font-medium">
                          {format(order.keyDates.departed, "dd/MM/yyyy")}
                        </span>
                      </div>
                    )}
                    {order.keyDates.arrived && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Llegada:</span>
                        <span className="font-medium">
                          {format(order.keyDates.arrived, "dd/MM/yyyy")}
                        </span>
                      </div>
                    )}
                    {order.keyDates.delivered && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Entrega Final:</span>
                        <span className="font-medium">
                          {format(order.keyDates.delivered, "dd/MM/yyyy")}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => console.log("Download commercial invoice")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Factura Comercial
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => console.log("Download packing list")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Packing List
                    </Button>
                    {order.shippingData?.blNumber && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => console.log("Download B/L")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Bill of Lading (B/L)
                      </Button>
                    )}

                    {order.documents.map((doc) => (
                      <Button
                        key={doc.id}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleDownload(doc.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {doc.title}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Acciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {order.status === "delivered" && (
                      <Button
                        onClick={handleMarkAsDelivered}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marcar como Entregado
                      </Button>
                    )}

                    <Dialog
                      open={showSupportDialog}
                      onOpenChange={setShowSupportDialog}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Solicitar Soporte
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Solicitar Soporte</DialogTitle>
                          <DialogDescription>
                            Envíe una consulta sobre este pedido a nuestro
                            equipo de soporte
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="subject">Asunto</Label>
                            <Input
                              id="subject"
                              value={supportForm.subject}
                              onChange={(e) =>
                                setSupportForm((prev) => ({
                                  ...prev,
                                  subject: e.target.value,
                                }))
                              }
                              placeholder="Asunto de la consulta"
                            />
                          </div>
                          <div>
                            <Label htmlFor="priority">Prioridad</Label>
                            <Select
                              value={supportForm.priority}
                              onValueChange={(value) =>
                                setSupportForm((prev) => ({
                                  ...prev,
                                  priority: value as any,
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Baja</SelectItem>
                                <SelectItem value="medium">Media</SelectItem>
                                <SelectItem value="high">Alta</SelectItem>
                                <SelectItem value="urgent">Urgente</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                              id="description"
                              value={supportForm.description}
                              onChange={(e) =>
                                setSupportForm((prev) => ({
                                  ...prev,
                                  description: e.target.value,
                                }))
                              }
                              placeholder="Describa su consulta en detalle..."
                              rows={4}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setShowSupportDialog(false)}
                            >
                              Cancelar
                            </Button>
                            <Button
                              onClick={() => {
                                console.log("Support request sent");
                                setShowSupportDialog(false);
                              }}
                            >
                              Enviar Solicitud
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Resumen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Contenedores:</span>
                      <span className="font-medium">
                        {order.containers.reduce(
                          (sum, c) => sum + c.quantity,
                          0,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Incoterm:</span>
                      <span className="font-medium">{order.incoterm}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-medium">
                        {formatCurrency(order.totalAmount, order.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pagado:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(totalPaid, order.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pendiente:</span>
                      <span
                        className={`font-medium ${
                          pendingAmount > 0
                            ? "text-amber-600"
                            : "text-green-600"
                        }`}
                      >
                        {formatCurrency(pendingAmount, order.currency)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
