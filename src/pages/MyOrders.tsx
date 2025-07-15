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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Navigation } from "@/components/Navigation";
import { useOrders } from "@/contexts/OrdersContext";
import { Order } from "@/types";
import {
  Package,
  Search,
  Filter,
  Download,
  Eye,
  Calendar as CalendarIcon,
  Building,
  Container,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  Ship,
  FileText,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function MyOrders() {
  const navigate = useNavigate();
  const {
    state,
    loadOrders,
    updateFilters,
    getFilteredOrders,
    exportOrderHistory,
  } = useOrders();

  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      await loadOrders();
      setIsLoading(false);
    };
    initializeData();
  }, [loadOrders]);

  const filteredOrders = getFilteredOrders();

  const handleStatusFilter = (status: string) => {
    updateFilters({ status: status === "all" ? "" : status });
  };

  const handleSearchChange = (searchTerm: string) => {
    updateFilters({ searchTerm });
  };

  const handleDateRangeChange = () => {
    updateFilters({
      dateRange: {
        from: dateFrom,
        to: dateTo,
      },
    });
  };

  const handleClearFilters = () => {
    updateFilters({
      status: "",
      searchTerm: "",
      dateRange: {},
    });
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in_production":
        return <Package className="h-4 w-4 text-blue-600" />;
      case "shipped":
      case "in_transit":
        return <Ship className="h-4 w-4 text-purple-600" />;
      case "customs":
        return <FileText className="h-4 w-4 text-orange-600" />;
      case "delivered":
        return <Truck className="h-4 w-4 text-green-600" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-700" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "confirmed":
        return "Confirmado";
      case "in_production":
        return "En Producción";
      case "shipped":
        return "Enviado";
      case "in_transit":
        return "En Tránsito";
      case "customs":
        return "En Aduana";
      case "delivered":
        return "Entregado";
      case "completed":
        return "Completado";
      case "cancelled":
        return "Cancelado";
      default:
        return "Desconocido";
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "in_production":
        return "bg-blue-100 text-blue-800";
      case "shipped":
      case "in_transit":
        return "bg-purple-100 text-purple-800";
      case "customs":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-green-100 text-green-900";
      case "cancelled":
        return "bg-red-100 text-red-800";
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

  // Calculate statistics
  const stats = {
    total: filteredOrders.length,
    active: filteredOrders.filter((o) =>
      [
        "confirmed",
        "in_production",
        "shipped",
        "in_transit",
        "customs",
      ].includes(o.status),
    ).length,
    completed: filteredOrders.filter((o) => o.status === "completed").length,
    totalValue: filteredOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    ),
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
              <h1 className="text-3xl font-bold text-gray-900">Mis Pedidos</h1>
              <p className="text-gray-600 mt-1">
                Gestione todas sus cotizaciones y órdenes de compra
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => exportOrderHistory("csv")}
                className="border-2 border-zlc-gray-300 text-zlc-gray-700 hover:border-zlc-blue-500 hover:bg-zlc-blue-50 hover:text-zlc-blue-700 transition-all duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
              <Button
                variant="outline"
                onClick={() => exportOrderHistory("xlsx")}
                className="border-2 border-zlc-gray-300 text-zlc-gray-700 hover:border-zlc-blue-500 hover:bg-zlc-blue-50 hover:text-zlc-blue-700 transition-all duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Excel
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Pedidos
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.total}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-zlc-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      En Progreso
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.active}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Completados
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.completed}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Valor Total
                    </p>
                    <p className="text-2xl font-bold text-zlc-blue-600">
                      ${stats.totalValue.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-zlc-blue-600" />
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <Label htmlFor="search">Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zlc-gray-500" />
                    <Input
                      id="search"
                      placeholder="Nº de pedido o proveedor..."
                      value={state.filters.searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10 h-11 border-2 border-zlc-gray-200 bg-white rounded-lg focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 text-zlc-gray-900"
                    />
                    {state.filters.searchTerm && (
                      <button
                        onClick={() => handleSearchChange("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zlc-gray-400 hover:text-zlc-gray-600 transition-colors"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={state.filters.status || "all"}
                    onValueChange={handleStatusFilter}
                  >
                    <SelectTrigger className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 rounded-lg h-11">
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="confirmed">Confirmado</SelectItem>
                      <SelectItem value="in_production">
                        En Producción
                      </SelectItem>
                      <SelectItem value="in_transit">En Tránsito</SelectItem>
                      <SelectItem value="customs">En Aduana</SelectItem>
                      <SelectItem value="delivered">Entregado</SelectItem>
                      <SelectItem value="completed">Completado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date From */}
                <div>
                  <Label>Fecha Desde</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-11 border-2 border-zlc-gray-200 bg-white hover:bg-zlc-gray-50 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 rounded-lg",
                          !dateFrom ? "text-zlc-gray-400" : "text-zlc-gray-900",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-zlc-gray-500" />
                        {dateFrom ? (
                          format(dateFrom, "PP", { locale: es })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border-2 border-zlc-gray-200 shadow-lg rounded-lg">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                        className="p-3"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Date To */}
                <div>
                  <Label>Fecha Hasta</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-11 border-2 border-zlc-gray-200 bg-white hover:bg-zlc-gray-50 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 rounded-lg",
                          !dateTo ? "text-zlc-gray-400" : "text-zlc-gray-900",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-zlc-gray-500" />
                        {dateTo ? (
                          format(dateTo, "PP", { locale: es })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border-2 border-zlc-gray-200 shadow-lg rounded-lg">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                        className="p-3"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDateRangeChange}
                  className="border-2 border-zlc-blue-300 text-zlc-blue-700 hover:border-zlc-blue-500 hover:bg-zlc-blue-50 transition-all duration-200"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Aplicar Filtros de Fecha
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-zlc-gray-600 hover:text-zlc-gray-800 hover:bg-zlc-gray-100 transition-all duration-200"
                >
                  Limpiar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Lista de Pedidos ({filteredOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No se encontraron pedidos
                  </h3>
                  <p className="text-gray-600">
                    {state.filters.status || state.filters.searchTerm
                      ? "Intente ajustar los filtros de búsqueda"
                      : "Aún no tiene pedidos registrados"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nº de Pedido</TableHead>
                        <TableHead>Proveedor</TableHead>
                        <TableHead>Contenedores</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <div>
                              <div className="font-mono font-medium">
                                {order.orderNumber}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.orderType === "quote"
                                  ? "Cotización"
                                  : "Orden de Compra"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">
                                {order.supplierName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Container className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">
                                {order.containers.reduce(
                                  (sum, c) => sum + c.quantity,
                                  0,
                                )}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={cn(
                                "flex items-center gap-1",
                                getStatusColor(order.status),
                              )}
                            >
                              {getStatusIcon(order.status)}
                              {getStatusLabel(order.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {formatCurrency(
                                order.totalAmount,
                                order.currency,
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.incoterm}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {format(order.createdAt, "dd/MM/yyyy")}
                            </div>
                            {order.estimatedDelivery && (
                              <div className="text-xs text-gray-500">
                                Est:{" "}
                                {format(order.estimatedDelivery, "dd/MM/yyyy")}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/order/${order.id}`)}
                              className="border-2 border-zlc-gray-300 text-zlc-gray-700 hover:border-zlc-blue-500 hover:bg-zlc-blue-50 hover:text-zlc-blue-700 transition-all duration-200"
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
        </div>
      </div>
    </div>
  );
}
