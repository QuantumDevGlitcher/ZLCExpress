import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useToast } from "@/hooks/use-toast";
import {
  BarChart3,
  TrendingUp,
  Clock,
  AlertTriangle,
  Download,
  Calendar,
  Package,
  DollarSign,
  FileSpreadsheet,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Truck,
  Ship,
  Timer,
} from "lucide-react";

interface SalesData {
  month: string;
  containersVendidos: number;
  ingresos: number;
  ordenes: number;
}

interface ProductSales {
  productName: string;
  containersSold: number;
  revenue: number;
  avgPrice: number;
  quarter: string;
}

interface CycleTimeMetrics {
  metric: string;
  avgDays: number;
  minDays: number;
  maxDays: number;
  lastMonth: number;
  trend: "up" | "down" | "stable";
}

interface IncidentData {
  id: string;
  date: Date;
  orderNumber: string;
  type: "damage" | "missing_items" | "delay" | "quality_issue" | "other";
  status: "open" | "investigating" | "resolved" | "closed";
  description: string;
  resolution?: string;
  daysToResolve?: number;
}

const SupplierReports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("2024");
  const [selectedQuarter, setSelectedQuarter] = useState("Q1-2024");
  const [incidentFilter, setIncidentFilter] = useState("all");

  // Mock sales data
  const salesData: SalesData[] = [
    {
      month: "Enero 2024",
      containersVendidos: 8,
      ingresos: 156800,
      ordenes: 4,
    },
    {
      month: "Febrero 2024",
      containersVendidos: 12,
      ingresos: 235200,
      ordenes: 6,
    },
    {
      month: "Marzo 2024",
      containersVendidos: 15,
      ingresos: 294000,
      ordenes: 7,
    },
    {
      month: "Abril 2024",
      containersVendidos: 18,
      ingresos: 352800,
      ordenes: 9,
    },
    {
      month: "Mayo 2024",
      containersVendidos: 22,
      ingresos: 431200,
      ordenes: 11,
    },
    {
      month: "Junio 2024",
      containersVendidos: 19,
      ingresos: 372400,
      ordenes: 8,
    },
  ];

  // Mock product sales data
  const productSales: ProductSales[] = [
    {
      productName: "Camisa de Algodón Premium",
      containersSold: 35,
      revenue: 685800,
      avgPrice: 19594,
      quarter: "Q1-2024",
    },
    {
      productName: "Polo Deportivo",
      containersSold: 28,
      revenue: 448000,
      avgPrice: 16000,
      quarter: "Q1-2024",
    },
    {
      productName: "Camisa Casual",
      containersSold: 22,
      revenue: 330000,
      avgPrice: 15000,
      quarter: "Q1-2024",
    },
    {
      productName: "Blusa Elegante",
      containersSold: 19,
      revenue: 380000,
      avgPrice: 20000,
      quarter: "Q1-2024",
    },
  ];

  // Mock cycle time metrics
  const cycleTimeMetrics: CycleTimeMetrics[] = [
    {
      metric: "RFQ Aceptada → Pago Recibido",
      avgDays: 8.5,
      minDays: 3,
      maxDays: 15,
      lastMonth: 7.2,
      trend: "down",
    },
    {
      metric: "Pago → Producción Completada",
      avgDays: 25.3,
      minDays: 18,
      maxDays: 35,
      lastMonth: 26.1,
      trend: "up",
    },
    {
      metric: "Embarque → Llegada (Tránsito)",
      avgDays: 12.8,
      minDays: 8,
      maxDays: 18,
      lastMonth: 11.9,
      trend: "down",
    },
    {
      metric: "RFQ → Orden Completada (Total)",
      avgDays: 46.6,
      minDays: 32,
      maxDays: 65,
      lastMonth: 45.2,
      trend: "down",
    },
  ];

  // Mock incidents data
  const incidents: IncidentData[] = [
    {
      id: "INC-001",
      date: new Date("2024-02-20"),
      orderNumber: "PO-2024-002",
      type: "missing_items",
      status: "resolved",
      description: "50 unidades faltantes en contenedor",
      resolution: "Reposición en siguiente embarque",
      daysToResolve: 5,
    },
    {
      id: "INC-002",
      date: new Date("2024-02-22"),
      orderNumber: "PO-2024-001",
      type: "delay",
      status: "resolved",
      description: "Retraso de 3 días por clima adverso",
      resolution: "Naviera confirmó nueva ETA",
      daysToResolve: 2,
    },
    {
      id: "INC-003",
      date: new Date("2024-01-15"),
      orderNumber: "PO-2024-003",
      type: "damage",
      status: "closed",
      description: "Daños menores en 2 cajas",
      resolution: "Descuento aplicado según acuerdo",
      daysToResolve: 7,
    },
    {
      id: "INC-004",
      date: new Date("2024-03-01"),
      orderNumber: "PO-2024-005",
      type: "quality_issue",
      status: "investigating",
      description: "Reclamo sobre calidad de acabados",
      daysToResolve: undefined,
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "down":
        return <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-red-600";
      case "down":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getIncidentTypeLabel = (type: string) => {
    switch (type) {
      case "damage":
        return "Daños";
      case "missing_items":
        return "Faltantes";
      case "delay":
        return "Retraso";
      case "quality_issue":
        return "Calidad";
      case "other":
        return "Otro";
      default:
        return type;
    }
  };

  const getIncidentStatusVariant = (status: string) => {
    switch (status) {
      case "open":
        return "destructive";
      case "investigating":
        return "secondary";
      case "resolved":
        return "default";
      case "closed":
        return "outline";
      default:
        return "outline";
    }
  };

  const getIncidentStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Abierto";
      case "investigating":
        return "En Proceso";
      case "resolved":
        return "Resuelto";
      case "closed":
        return "Cerrado";
      default:
        return status;
    }
  };

  const handleExportData = (type: string) => {
    toast({
      title: "Exportando Datos",
      description: `Generando archivo ${type.toUpperCase()} con los reportes solicitados...`,
    });

    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Exportación Completada",
        description: `El archivo ${type.toUpperCase()} ha sido descargado correctamente.`,
      });
    }, 2000);
  };

  const filteredIncidents = incidents.filter((incident) => {
    if (incidentFilter === "all") return true;
    return incident.status === incidentFilter;
  });

  // Calculate totals
  const totalContainers = salesData.reduce(
    (sum, data) => sum + data.containersVendidos,
    0,
  );
  const totalRevenue = salesData.reduce((sum, data) => sum + data.ingresos, 0);
  const totalOrders = salesData.reduce((sum, data) => sum + data.ordenes, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  const openIncidents = incidents.filter((inc) => inc.status === "open").length;
  const resolvedIncidents = incidents.filter(
    (inc) => inc.status === "resolved" || inc.status === "closed",
  ).length;
  const avgResolutionTime =
    incidents
      .filter((inc) => inc.daysToResolve)
      .reduce((sum, inc) => sum + (inc.daysToResolve || 0), 0) /
    incidents.filter((inc) => inc.daysToResolve).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-14 sm:pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Reportes y Métricas
              </h1>
              <Button variant="outline" asChild>
                <Link to="/supplier/dashboard">← Volver al Panel</Link>
              </Button>
            </div>
            <p className="text-gray-600">
              Analiza el rendimiento de tu negocio y exporta reportes detallados
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Contenedores Vendidos
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {totalContainers}
                    </p>
                    <p className="text-xs text-gray-500">En 6 meses</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ingresos Totales</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Sin flete ni comisiones
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Valor Promedio</p>
                    <p className="text-2xl font-bold text-purple-600">
                      ${Math.round(avgOrderValue).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Por orden</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Órdenes Totales</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {totalOrders}
                    </p>
                    <p className="text-xs text-gray-500">Completadas</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Sales by Month */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Ventas por Mes
                  </div>
                  <Select
                    value={selectedPeriod}
                    onValueChange={setSelectedPeriod}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.map((data, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {data.month}
                        </span>
                        <div className="text-right">
                          <p className="text-sm font-bold">
                            {data.containersVendidos} contenedores
                          </p>
                          <p className="text-xs text-gray-600">
                            ${data.ingresos.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(data.containersVendidos / 25) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Lotes Más Vendidos
                  </div>
                  <Select
                    value={selectedQuarter}
                    onValueChange={setSelectedQuarter}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Q1-2024">Q1 2024</SelectItem>
                      <SelectItem value="Q4-2023">Q4 2023</SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productSales.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{product.productName}</h4>
                        <p className="text-sm text-gray-600">
                          {product.containersSold} contenedores • $
                          {product.avgPrice.toLocaleString()} promedio
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          ${product.revenue.toLocaleString()}
                        </p>
                        <Badge variant="outline">#{index + 1}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cycle Times */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Tiempos de Ciclo (Lead Times)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Métrica</TableHead>
                      <TableHead>Promedio</TableHead>
                      <TableHead>Mínimo</TableHead>
                      <TableHead>Máximo</TableHead>
                      <TableHead>Mes Anterior</TableHead>
                      <TableHead>Tendencia</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cycleTimeMetrics.map((metric, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {metric.metric}
                        </TableCell>
                        <TableCell>
                          <span className="font-bold">{metric.avgDays}</span>{" "}
                          días
                        </TableCell>
                        <TableCell>{metric.minDays} días</TableCell>
                        <TableCell>{metric.maxDays} días</TableCell>
                        <TableCell>{metric.lastMonth} días</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(metric.trend)}
                            <span className={getTrendColor(metric.trend)}>
                              {metric.trend === "up" && "Aumentó"}
                              {metric.trend === "down" && "Mejoró"}
                              {metric.trend === "stable" && "Estable"}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Timer className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">
                      Interpretación de Métricas
                    </h4>
                    <p className="text-sm text-blue-800 mt-1">
                      • <strong>Tendencia "Mejoró"</strong>: Los tiempos están
                      disminuyendo (mejor eficiencia)
                    </p>
                    <p className="text-sm text-blue-800">
                      • <strong>Tendencia "Aumentó"</strong>: Los tiempos están
                      aumentando (requiere atención)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Incidents History */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Historial de Incidencias
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span>Abiertas:</span>
                    <Badge variant="destructive">{openIncidents}</Badge>
                    <span>Resueltas:</span>
                    <Badge variant="default">{resolvedIncidents}</Badge>
                    <span>Tiempo Prom.:</span>
                    <Badge variant="outline">
                      {Math.round(avgResolutionTime)} días
                    </Badge>
                  </div>
                  <Select
                    value={incidentFilter}
                    onValueChange={setIncidentFilter}
                  >
                    <SelectTrigger className="w-32">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="open">Abiertas</SelectItem>
                      <SelectItem value="investigating">En Proceso</SelectItem>
                      <SelectItem value="resolved">Resueltas</SelectItem>
                      <SelectItem value="closed">Cerradas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Orden</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Resolución</TableHead>
                      <TableHead>Días para Resolver</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIncidents.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell>
                          {incident.date.toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {incident.orderNumber}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getIncidentTypeLabel(incident.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {incident.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getIncidentStatusVariant(incident.status)}
                          >
                            {getIncidentStatusLabel(incident.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {incident.resolution || "—"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {incident.daysToResolve ? (
                            <span className="font-medium">
                              {incident.daysToResolve} días
                            </span>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Export Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Exportación de Datos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <FileSpreadsheet className="h-8 w-8 text-green-600" />
                    <div>
                      <h4 className="font-medium">Reporte de Ventas</h4>
                      <p className="text-sm text-gray-600">
                        Ventas totales por año/trimestre
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleExportData("csv")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar CSV
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleExportData("xlsx")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Excel
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Package className="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Órdenes Proforma</h4>
                      <p className="text-sm text-gray-600">
                        Historial completo con montos
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleExportData("csv")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar CSV
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleExportData("xlsx")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Excel
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                    <div>
                      <h4 className="font-medium">Historial RFQs</h4>
                      <p className="text-sm text-gray-600">
                        RFQs recibidas y cotizadas
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleExportData("csv")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar CSV
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleExportData("xlsx")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Excel
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Exportación Completa</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Descarga todos los reportes en un archivo único con múltiples
                  hojas
                </p>
                <Button
                  onClick={() => handleExportData("xlsx")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Todos los Reportes (Excel)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupplierReports;
