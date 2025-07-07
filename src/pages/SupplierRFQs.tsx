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
      receivedAt: new Date("2024-01-15"),
      status: "pending" as const,
      estimatedValue: 19600,
      validUntil: new Date("2024-02-15"),
    },
    {
      id: "RFQ-002",
      rfqNumber: "RFQ-2024-002",
      buyerCompany: "Textiles del Pacífico Ltda.",
      productTitle: "Camisa de Algodón Premium",
      containerQuantity: 1,
      containerType: "40'" as const,
      incoterm: "CIF" as const,
      receivedAt: new Date("2024-01-12"),
      status: "quoted" as const,
      estimatedValue: 15800,
      validUntil: new Date("2024-02-12"),
    },
    {
      id: "RFQ-003",
      rfqNumber: "RFQ-2024-003",
      buyerCompany: "Importadora San José",
      productTitle: "Camisa de Algodón Premium",
      containerQuantity: 3,
      containerType: "20'" as const,
      incoterm: "FOB" as const,
      receivedAt: new Date("2024-01-10"),
      status: "counter_offer" as const,
      estimatedValue: 29400,
      validUntil: new Date("2024-02-10"),
    },
    {
      id: "RFQ-004",
      rfqNumber: "RFQ-2024-004",
      buyerCompany: "Global Trading Corp.",
      productTitle: "Camisa de Algodón Premium",
      containerQuantity: 1,
      containerType: "20'" as const,
      incoterm: "EXW" as const,
      receivedAt: new Date("2024-01-08"),
      status: "rejected" as const,
      estimatedValue: 9800,
      validUntil: new Date("2024-02-08"),
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
      default:
        return status;
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
      default:
        return null;
    }
  };

  const filteredRFQs = supplierRFQs.filter((rfq) => {
    const matchesStatus = statusFilter === "all" || rfq.status === statusFilter;
    const matchesSearch =
      rfq.rfqNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.buyerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.productTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = supplierRFQs.filter(
    (rfq) => rfq.status === "pending",
  ).length;
  const quotedCount = supplierRFQs.filter(
    (rfq) => rfq.status === "quoted",
  ).length;
  const totalValue = supplierRFQs.reduce(
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
                    <p className="text-sm text-gray-600">Total RFQs</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {supplierRFQs.length}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-gray-600" />
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
                          <Button
                            size="sm"
                            onClick={() =>
                              navigate(`/supplier/rfqs/${rfq.id}/respond`)
                            }
                            disabled={rfq.validUntil < new Date()}
                          >
                            Responder
                          </Button>
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
