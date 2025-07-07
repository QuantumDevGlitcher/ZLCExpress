import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Filter,
  Ship,
  Package,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Upload,
  Camera,
  Anchor,
  MapPin,
  Building2,
  Truck,
  Plane,
  Globe,
} from "lucide-react";

interface ShipmentOrder {
  id: string;
  orderNumber: string;
  buyerCompany: string;
  productTitle: string;
  containerQuantity: number;
  containerType: "20'" | "40'";
  totalAmount: number;
  currency: string;
  incoterm: "FOB" | "CIF" | "CFR" | "EXW";
  productionProgress: number;
  status:
    | "ready_for_shipment"
    | "logistics_coordination"
    | "documents_generated"
    | "shipped"
    | "in_transit"
    | "delivered";
  estimatedDelivery: Date;
  transportData?: {
    shippingLine: string;
    selectedByBuyer: boolean;
    bookingNumber?: string;
    vesselName?: string;
    departurePort: string;
    destinationPort: string;
    etd?: Date;
    eta?: Date;
  };
  documentsGenerated: {
    billOfLading: boolean;
    commercialInvoice: boolean;
    packingList: boolean;
    certificateOfOrigin: boolean;
  };
  shipmentDetails?: {
    containerNumber: string;
    sealNumber: string;
    departureDate: Date;
    photoEvidence?: string;
  };
}

const SupplierShipments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for shipment orders
  const shipmentOrders: ShipmentOrder[] = [
    {
      id: "PO-001",
      orderNumber: "PO-2024-001",
      buyerCompany: "Comercial Los Andes S.A.",
      productTitle: "Camisa de Algodón Premium",
      containerQuantity: 2,
      containerType: "20'",
      totalAmount: 19600,
      currency: "USD",
      incoterm: "FOB",
      productionProgress: 100,
      status: "ready_for_shipment",
      estimatedDelivery: new Date("2024-03-15"),
    },
    {
      id: "PO-002",
      orderNumber: "PO-2024-002",
      buyerCompany: "Textiles del Pacífico Ltda.",
      productTitle: "Camisa de Algodón Premium",
      containerQuantity: 1,
      containerType: "40'",
      totalAmount: 15800,
      currency: "USD",
      incoterm: "CIF",
      productionProgress: 100,
      status: "logistics_coordination",
      estimatedDelivery: new Date("2024-03-10"),
      transportData: {
        shippingLine: "Evergreen Line",
        selectedByBuyer: true,
        departurePort: "Puerto Caldera, Costa Rica",
        destinationPort: "Puerto Cortés, Honduras",
      },
    },
    {
      id: "PO-003",
      orderNumber: "PO-2024-003",
      buyerCompany: "Importadora San José",
      productTitle: "Camisa de Algodón Premium",
      containerQuantity: 3,
      containerType: "20'",
      totalAmount: 28800,
      currency: "USD",
      incoterm: "FOB",
      productionProgress: 100,
      status: "documents_generated",
      estimatedDelivery: new Date("2024-03-05"),
      transportData: {
        shippingLine: "COSCO Shipping",
        selectedByBuyer: false,
        bookingNumber: "COSCO-2024-001",
        vesselName: "COSCO HOPE",
        departurePort: "Puerto Caldera, Costa Rica",
        destinationPort: "Puerto Quetzal, Guatemala",
        etd: new Date("2024-02-20"),
        eta: new Date("2024-02-25"),
      },
      documentsGenerated: {
        billOfLading: true,
        commercialInvoice: true,
        packingList: true,
        certificateOfOrigin: true,
      },
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ready_for_shipment":
        return "secondary";
      case "logistics_coordination":
        return "outline";
      case "documents_generated":
        return "default";
      case "shipped":
        return "default";
      case "in_transit":
        return "outline";
      case "delivered":
        return "default";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ready_for_shipment":
        return "Listo para Embarque";
      case "logistics_coordination":
        return "Coordinando Logística";
      case "documents_generated":
        return "Documentos Generados";
      case "shipped":
        return "Embarcado";
      case "in_transit":
        return "En Tránsito";
      case "delivered":
        return "Entregado";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready_for_shipment":
        return <Package className="h-4 w-4" />;
      case "logistics_coordination":
        return <Truck className="h-4 w-4" />;
      case "documents_generated":
        return <FileText className="h-4 w-4" />;
      case "shipped":
        return <Ship className="h-4 w-4" />;
      case "in_transit":
        return <Globe className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredOrders = shipmentOrders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const readyForShipmentCount = shipmentOrders.filter(
    (order) => order.status === "ready_for_shipment",
  ).length;
  const inTransitCount = shipmentOrders.filter(
    (order) => order.status === "in_transit",
  ).length;
  const totalValue = shipmentOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0,
  );

  const getDocumentCompletionPercentage = (
    docs: ShipmentOrder["documentsGenerated"],
  ) => {
    if (!docs) return 0;
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
                Envíos y Logística
              </h1>
              <Button variant="outline" asChild>
                <Link to="/supplier/dashboard">← Volver al Panel</Link>
              </Button>
            </div>
            <p className="text-gray-600">
              Coordina el transporte y gestiona los envíos de tus órdenes
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Listos p/ Embarque</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {readyForShipmentCount}
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
                    <p className="text-sm text-gray-600">En Tránsito</p>
                    <p className="text-2xl font-bold text-green-600">
                      {inTransitCount}
                    </p>
                  </div>
                  <Ship className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Envíos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {shipmentOrders.length}
                    </p>
                  </div>
                  <Truck className="h-8 w-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Valor Total</p>
                    <p className="text-xl font-bold text-purple-600">
                      ${totalValue.toLocaleString()}
                    </p>
                  </div>
                  <Globe className="h-8 w-8 text-purple-600" />
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
                      placeholder="Buscar por orden, comprador o producto..."
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
                      <SelectItem value="ready_for_shipment">
                        Listo para Embarque
                      </SelectItem>
                      <SelectItem value="logistics_coordination">
                        Coordinando Logística
                      </SelectItem>
                      <SelectItem value="documents_generated">
                        Documentos Generados
                      </SelectItem>
                      <SelectItem value="shipped">Embarcado</SelectItem>
                      <SelectItem value="in_transit">En Tránsito</SelectItem>
                      <SelectItem value="delivered">Entregado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipments Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ship className="h-5 w-5" />
                Lista de Envíos ({filteredOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Orden</TableHead>
                      <TableHead>Comprador</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead># Contenedores</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Incoterm</TableHead>
                      <TableHead>Naviera</TableHead>
                      <TableHead>Entrega Est.</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Documentos</TableHead>
                      <TableHead>Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.buyerCompany}</p>
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
                          <span className="font-medium text-green-600">
                            ${order.totalAmount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.incoterm}</Badge>
                        </TableCell>
                        <TableCell>
                          {order.transportData ? (
                            <div>
                              <p className="font-medium text-sm">
                                {order.transportData.shippingLine}
                              </p>
                              {order.transportData.selectedByBuyer && (
                                <Badge variant="secondary" className="text-xs">
                                  Elegida por comprador
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">
                              Por definir
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {order.estimatedDelivery.toLocaleDateString()}
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
                                order.documentsGenerated,
                              )}
                              %
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{
                                  width: `${getDocumentCompletionPercentage(order.documentsGenerated)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() =>
                              navigate(`/supplier/shipments/${order.id}`)
                            }
                          >
                            Gestionar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredOrders.length === 0 && (
                <div className="text-center py-8">
                  <Ship className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-2">No se encontraron envíos</p>
                  <p className="text-sm text-gray-400">
                    {statusFilter !== "all" || searchTerm
                      ? "Prueba ajustando los filtros de búsqueda"
                      : "Los envíos listos para embarque aparecerán aquí"}
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

export default SupplierShipments;
