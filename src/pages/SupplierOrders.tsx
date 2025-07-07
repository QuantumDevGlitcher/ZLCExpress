import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Filter,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  FileText,
  Calendar,
  Building2,
} from "lucide-react";

interface ProformaOrder {
  id: string;
  orderNumber: string;
  rfqNumber: string;
  buyerCompany: string;
  buyerContact: string;
  buyerEmail: string;
  productTitle: string;
  containerQuantity: number;
  containerType: "20'" | "40'";
  unitPrice: number;
  totalAmount: number;
  currency: string;
  incoterm: "FOB" | "CIF" | "CFR" | "EXW";
  paymentConditions: string;
  status:
    | "pending_payment"
    | "advance_paid"
    | "in_production"
    | "ready_for_shipment"
    | "shipped"
    | "completed";
  createdAt: Date;
  advancePaymentDue: Date;
  estimatedDelivery: Date;
  documentsUploaded: {
    packingList: boolean;
    certificateOfOrigin: boolean;
    commercialInvoice: boolean;
  };
  digitalSignature: {
    signed: boolean;
    signedAt?: Date;
    signedBy?: string;
  };
}

const SupplierOrders = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for supplier proforma orders
  const proformaOrders: ProformaOrder[] = [
    {
      id: "PO-001",
      orderNumber: "PO-2024-001",
      rfqNumber: "RFQ-2024-001",
      buyerCompany: "Comercial Los Andes S.A.",
      buyerContact: "María González",
      buyerEmail: "maria.gonzalez@losandes.com",
      productTitle: "Camisa de Algodón Premium",
      containerQuantity: 2,
      containerType: "20'",
      unitPrice: 9800,
      totalAmount: 19600,
      currency: "USD",
      incoterm: "FOB",
      paymentConditions: "30% T/T + 70% contra BL",
      status: "pending_payment",
      createdAt: new Date("2024-01-20"),
      advancePaymentDue: new Date("2024-02-05"),
      estimatedDelivery: new Date("2024-03-15"),
      documentsUploaded: {
        packingList: false,
        certificateOfOrigin: false,
        commercialInvoice: true,
      },
      digitalSignature: {
        signed: true,
        signedAt: new Date("2024-01-20T15:30:00"),
        signedBy: "ZLC Textiles S.A.",
      },
    },
    {
      id: "PO-002",
      orderNumber: "PO-2024-002",
      rfqNumber: "RFQ-2024-002",
      buyerCompany: "Textiles del Pacífico Ltda.",
      buyerContact: "Carlos Mendoza",
      buyerEmail: "carlos.mendoza@pacifico.com",
      productTitle: "Camisa de Algodón Premium",
      containerQuantity: 1,
      containerType: "40'",
      unitPrice: 15800,
      totalAmount: 15800,
      currency: "USD",
      incoterm: "CIF",
      paymentConditions: "30% T/T + 70% contra BL",
      status: "advance_paid",
      createdAt: new Date("2024-01-18"),
      advancePaymentDue: new Date("2024-02-03"),
      estimatedDelivery: new Date("2024-03-10"),
      documentsUploaded: {
        packingList: true,
        certificateOfOrigin: true,
        commercialInvoice: true,
      },
      digitalSignature: {
        signed: true,
        signedAt: new Date("2024-01-18T10:15:00"),
        signedBy: "ZLC Textiles S.A.",
      },
    },
    {
      id: "PO-003",
      orderNumber: "PO-2024-003",
      rfqNumber: "RFQ-2024-003",
      buyerCompany: "Importadora San José",
      buyerContact: "Ana Rodríguez",
      buyerEmail: "ana.rodriguez@sanjose.com",
      productTitle: "Camisa de Algodón Premium",
      containerQuantity: 3,
      containerType: "20'",
      unitPrice: 9600,
      totalAmount: 28800,
      currency: "USD",
      incoterm: "FOB",
      paymentConditions: "30% T/T + 70% contra BL",
      status: "in_production",
      createdAt: new Date("2024-01-15"),
      advancePaymentDue: new Date("2024-01-30"),
      estimatedDelivery: new Date("2024-03-05"),
      documentsUploaded: {
        packingList: true,
        certificateOfOrigin: false,
        commercialInvoice: true,
      },
      digitalSignature: {
        signed: true,
        signedAt: new Date("2024-01-15T14:45:00"),
        signedBy: "ZLC Textiles S.A.",
      },
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending_payment":
        return "secondary";
      case "advance_paid":
        return "default";
      case "in_production":
        return "outline";
      case "ready_for_shipment":
        return "default";
      case "shipped":
        return "outline";
      case "completed":
        return "default";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending_payment":
        return "Pendiente de Pago";
      case "advance_paid":
        return "Anticipo Pagado";
      case "in_production":
        return "En Producción";
      case "ready_for_shipment":
        return "Listo para Embarque";
      case "shipped":
        return "Embarcado";
      case "completed":
        return "Completado";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending_payment":
        return <Clock className="h-4 w-4" />;
      case "advance_paid":
        return <DollarSign className="h-4 w-4" />;
      case "in_production":
        return <Package className="h-4 w-4" />;
      case "ready_for_shipment":
        return <CheckCircle className="h-4 w-4" />;
      case "shipped":
        return <CheckCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredOrders = proformaOrders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.rfqNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingPaymentCount = proformaOrders.filter(
    (order) => order.status === "pending_payment",
  ).length;
  const inProductionCount = proformaOrders.filter(
    (order) => order.status === "in_production",
  ).length;
  const totalValue = proformaOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0,
  );

  const getDocumentCompletionPercentage = (
    docs: ProformaOrder["documentsUploaded"],
  ) => {
    const total = Object.keys(docs).length;
    const completed = Object.values(docs).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-14 sm:pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Órdenes Proforma Aceptadas
              </h1>
              <Button variant="outline" asChild>
                <Link to="/supplier/dashboard">← Volver al Panel</Link>
              </Button>
            </div>
            <p className="text-gray-600">
              Gestiona las órdenes proforma confirmadas por tus compradores
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pendientes Pago</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {pendingPaymentCount}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">En Producción</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {inProductionCount}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Órdenes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {proformaOrders.length}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Valor Total</p>
                    <p className="text-xl font-bold text-green-600">
                      ${totalValue.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por orden, comprador, producto o RFQ..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="pending_payment">
                        Pendiente de Pago
                      </SelectItem>
                      <SelectItem value="advance_paid">
                        Anticipo Pagado
                      </SelectItem>
                      <SelectItem value="in_production">
                        En Producción
                      </SelectItem>
                      <SelectItem value="ready_for_shipment">
                        Listo para Embarque
                      </SelectItem>
                      <SelectItem value="shipped">Embarcado</SelectItem>
                      <SelectItem value="completed">Completado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Lista de Órdenes Proforma ({filteredOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Orden</TableHead>
                      <TableHead>RFQ Origen</TableHead>
                      <TableHead>Comprador</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead># Contenedores</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead>Incoterm</TableHead>
                      <TableHead>Fecha Creación</TableHead>
                      <TableHead>Vencimiento Anticipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Documentos</TableHead>
                      <TableHead>Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-medium">{order.orderNumber}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              {order.digitalSignature.signed && (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              )}
                              {order.digitalSignature.signed
                                ? "Firmado"
                                : "Sin firmar"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.rfqNumber}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.buyerCompany}</p>
                            <p className="text-sm text-gray-600">
                              {order.buyerContact}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {order.productTitle}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">
                              {order.containerQuantity}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({order.containerType})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <span className="font-medium text-green-600">
                              ${order.totalAmount.toLocaleString()}
                            </span>
                            <p className="text-xs text-gray-500">
                              {order.currency}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.incoterm}</Badge>
                        </TableCell>
                        <TableCell>
                          {order.createdAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {order.advancePaymentDue.toLocaleDateString()}
                            {order.advancePaymentDue < new Date() &&
                              order.status === "pending_payment" && (
                                <span className="text-red-500 block">
                                  Vencido
                                </span>
                              )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(order.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {getStatusLabel(order.status)}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="text-sm font-medium">
                              {getDocumentCompletionPercentage(
                                order.documentsUploaded,
                              )}
                              %
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{
                                  width: `${getDocumentCompletionPercentage(order.documentsUploaded)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() =>
                              navigate(`/supplier/orders/${order.id}`)
                            }
                          >
                            Ver Detalles
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredOrders.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-2">
                    No se encontraron órdenes
                  </p>
                  <p className="text-sm text-gray-400">
                    {statusFilter !== "all" || searchTerm
                      ? "Prueba ajustando los filtros de búsqueda"
                      : "Las órdenes proforma aceptadas aparecerán aquí"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupplierOrders;
