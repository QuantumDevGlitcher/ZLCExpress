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
  MessageSquare,
  Package,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useB2B } from "@/contexts/B2BContext";

const SupplierRFQs = () => {
  const navigate = useNavigate();
  const { rfqs } = useB2B();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for supplier RFQs - in real app, this would come from API
  const supplierRFQs = [
    {
      id: "RFQ-001",
      rfqNumber: "RFQ-2024-001",
      buyerCompany: "Comercial Los Andes S.A.",
      productTitle: "Camisa de Algodón Premium",
      containerQuantity: 2,
      containerType: "20'" as const,
      incoterm: "FOB" as const,
      receivedAt: new Date("2024-01-28"),
      status: "pending" as const,
      estimatedValue: 19600,
      validUntil: new Date("2024-03-15"), // Active - future date
    },
    {
      id: "RFQ-002",
      rfqNumber: "RFQ-2024-002",
      buyerCompany: "Textiles del Pacífico Ltda.",
      productTitle: "Camisa de Algodón Premium",
      containerQuantity: 1,
      containerType: "40'" as const,
      incoterm: "CIF" as const,
      receivedAt: new Date("2024-01-26"),
      status: "quoted" as const,
      estimatedValue: 15800,
      validUntil: new Date("2024-03-10"), // Active - future date
    },
    {
      id: "RFQ-003",
      rfqNumber: "RFQ-2024-003",
      buyerCompany: "Importadora San José",
      productTitle: "Camisa de Algodón Premium",
      containerQuantity: 3,
      containerType: "20'" as const,
      incoterm: "FOB" as const,
      receivedAt: new Date("2024-01-24"),
      status: "counter_offer" as const,
      estimatedValue: 29400,
      validUntil: new Date("2024-03-05"), // Active - future date
    },
    {
      id: "RFQ-007",
      rfqNumber: "RFQ-2024-007",
      buyerCompany: "Mega Distribuciones SA",
      productTitle: "Jeans Denim Premium",
      containerQuantity: 2,
      containerType: "40'" as const,
      incoterm: "FOB" as const,
      receivedAt: new Date("2024-01-29"),
      status: "pending" as const,
      estimatedValue: 25000,
      validUntil: new Date("2024-03-20"), // Active - future date
    },
    {
      id: "RFQ-008",
      rfqNumber: "RFQ-2024-008",
      buyerCompany: "Retail Excellence Ltd",
      productTitle: "Zapatos Deportivos Mixtos",
      containerQuantity: 1,
      containerType: "20'" as const,
      incoterm: "CIF" as const,
      receivedAt: new Date("2024-01-27"),
      status: "pending" as const,
      estimatedValue: 18500,
      validUntil: new Date("2024-03-12"), // Active - future date
    },
    {
      id: "RFQ-009",
      rfqNumber: "RFQ-2024-009",
      buyerCompany: "Fashion Forward Inc",
      productTitle: "Accesorios de Moda Variados",
      containerQuantity: 3,
      containerType: "20'" as const,
      incoterm: "FOB" as const,
      receivedAt: new Date("2024-01-25"),
      status: "quoted" as const,
      estimatedValue: 13500,
      validUntil: new Date("2024-03-08"), // Active - future date
    },
    {
      id: "RFQ-010",
      rfqNumber: "RFQ-2024-010",
      buyerCompany: "Premium Textiles Group",
      productTitle: "Camisa de Algodón Premium",
      containerQuantity: 5,
      containerType: "40'" as const,
      incoterm: "FOB" as const,
      receivedAt: new Date("2024-01-30"),
      status: "pending" as const,
      estimatedValue: 42500,
      validUntil: new Date("2025-10-12"), // Valid until December 10, 2025
    },
    {
      id: "RFQ-004",
      rfqNumber: "RFQ-2024-004",
      buyerCompany: "Global Trading Corp.",
      productTitle: "Camisa de Algodón Premium",
      containerQuantity: 1,
      containerType: "20'" as const,
      incoterm: "EXW" as const,
      receivedAt: new Date("2024-01-05"),
      status: "expired" as const,
      estimatedValue: 9800,
      validUntil: new Date("2024-01-20"), // Expired - past date
    },
    {
      id: "RFQ-005",
      rfqNumber: "RFQ-2024-005",
      buyerCompany: "Distribuidora Central",
      productTitle: "Camisa de Algod��n Premium",
      containerQuantity: 2,
      containerType: "20'" as const,
      incoterm: "FOB" as const,
      receivedAt: new Date("2024-01-03"),
      status: "expired" as const,
      estimatedValue: 19600,
      validUntil: new Date("2024-01-18"), // Expired - past date
    },
    {
      id: "RFQ-006",
      rfqNumber: "RFQ-2024-006",
      buyerCompany: "Fashion Import Co.",
      productTitle: "Camisa de Algodón Premium",
      containerQuantity: 1,
      containerType: "40'" as const,
      incoterm: "CIF" as const,
      receivedAt: new Date("2024-01-02"),
      status: "rejected" as const,
      estimatedValue: 15800,
      validUntil: new Date("2024-01-15"), // Expired but already rejected
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "quoted":
        return "default";
      case "counter_offer":
        return "outline";
      case "rejected":
        return "destructive";
      case "expired":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "quoted":
        return "Cotización Enviada";
      case "counter_offer":
        return "Contraoferta";
      case "rejected":
        return "Rechazado";
      case "expired":
        return "Vencida";
      default:
        return status;
    }
  };

  // Helper function to check if RFQ is expired
  const isRFQExpired = (rfq: any) => {
    return new Date() > new Date(rfq.validUntil);
  };

  // Helper function to get appropriate button text and state
  const getButtonConfig = (rfq: any) => {
    const expired = isRFQExpired(rfq);

    if (expired || rfq.status === "expired") {
      return {
        text: "Ver Detalles",
        disabled: false,
        variant: "outline" as const,
      };
    }

    switch (rfq.status) {
      case "pending":
        return {
          text: "Responder",
          disabled: false,
          variant: "secondary" as const,
        };
      case "quoted":
        return {
          text: "Ver Cotización",
          disabled: false,
          variant: "outline" as const,
        };
      case "counter_offer":
        return {
          text: "Ver Contraoferta",
          disabled: false,
          variant: "outline" as const,
        };
      case "rejected":
        return {
          text: "Ver Detalles",
          disabled: false,
          variant: "outline" as const,
        };
      default:
        return {
          text: "Ver Detalles",
          disabled: false,
          variant: "outline" as const,
        };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "quoted":
        return <MessageSquare className="h-4 w-4" />;
      case "counter_offer":
        return <AlertCircle className="h-4 w-4" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4" />;
      case "expired":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Auto-update expired RFQs based on current date
  const processedRFQs = supplierRFQs.map((rfq) => {
    if (
      isRFQExpired(rfq) &&
      rfq.status !== "rejected" &&
      rfq.status !== "expired"
    ) {
      return { ...rfq, status: "expired" as const };
    }
    return rfq;
  });

  const filteredRFQs = processedRFQs.filter((rfq) => {
    const matchesStatus = statusFilter === "all" || rfq.status === statusFilter;
    const matchesSearch =
      rfq.rfqNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.buyerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.productTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = processedRFQs.filter(
    (rfq) => rfq.status === "pending",
  ).length;
  const quotedCount = processedRFQs.filter(
    (rfq) => rfq.status === "quoted",
  ).length;
  const expiredCount = processedRFQs.filter(
    (rfq) => rfq.status === "expired",
  ).length;
  const totalValue = processedRFQs.reduce(
    (sum, rfq) => sum + rfq.estimatedValue,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-14 sm:pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Cotizaciones (RFQ) Recibidas
              </h1>
              <Button variant="outline" asChild>
                <Link to="/supplier/dashboard">← Volver al Panel</Link>
              </Button>
            </div>
            <p className="text-gray-600">
              Gestiona las solicitudes de cotización de tus compradores
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pendientes</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {pendingCount}
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
                    <p className="text-sm text-gray-600">Cotizadas</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {quotedCount}
                    </p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Vencidas</p>
                    <p className="text-2xl font-bold text-red-600">
                      {expiredCount}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Valor Estimado</p>
                    <p className="text-xl font-bold text-green-600">
                      ${totalValue.toLocaleString()}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-green-600" />
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
                      placeholder="Buscar por RFQ, comprador o producto..."
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
                      <SelectItem value="pending">Pendientes</SelectItem>
                      <SelectItem value="quoted">Cotizadas</SelectItem>
                      <SelectItem value="counter_offer">
                        Contraoferta
                      </SelectItem>
                      <SelectItem value="rejected">Rechazadas</SelectItem>
                      <SelectItem value="expired">Vencidas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RFQ Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Lista de Cotizaciones ({filteredRFQs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID RFQ</TableHead>
                      <TableHead>Comprador</TableHead>
                      <TableHead>Lote Solicitado</TableHead>
                      <TableHead># Contenedores</TableHead>
                      <TableHead>Incoterm</TableHead>
                      <TableHead>Fecha Recepción</TableHead>
                      <TableHead>Validez</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Valor Est.</TableHead>
                      <TableHead>Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRFQs.map((rfq) => (
                      <TableRow key={rfq.id}>
                        <TableCell className="font-medium">
                          {rfq.rfqNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{rfq.buyerCompany}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {rfq.productTitle}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">
                              {rfq.containerQuantity}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({rfq.containerType})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{rfq.incoterm}</Badge>
                        </TableCell>
                        <TableCell>
                          {rfq.receivedAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {rfq.validUntil.toLocaleDateString()}
                            {rfq.validUntil < new Date() && (
                              <span className="text-red-500 block">
                                Vencida
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(rfq.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(rfq.status)}
                              {getStatusLabel(rfq.status)}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-green-600">
                            ${rfq.estimatedValue.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const buttonConfig = getButtonConfig(rfq);
                            return (
                              <Button
                                size="sm"
                                variant={buttonConfig.variant}
                                disabled={buttonConfig.disabled}
                                onClick={() =>
                                  navigate(`/supplier/rfqs/${rfq.id}/respond`)
                                }
                              >
                                {buttonConfig.text}
                              </Button>
                            );
                          })()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredRFQs.length === 0 && (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-2">
                    No se encontraron cotizaciones
                  </p>
                  <p className="text-sm text-gray-400">
                    {statusFilter !== "all" || searchTerm
                      ? "Prueba ajustando los filtros de búsqueda"
                      : "Las nuevas solicitudes de cotización aparecerán aquí"}
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

export default SupplierRFQs;
