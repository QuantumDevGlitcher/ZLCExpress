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
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Filter,
  MapPin,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageSquare,
  FileText,
  Star,
  Globe,
  Anchor,
  Building2,
  Calendar,
  Phone,
  Mail,
  Camera,
  Paperclip,
  Send,
  Eye,
  ArrowUpDown,
} from "lucide-react";

interface TrackingOrder {
  id: string;
  orderNumber: string;
  buyerCompany: string;
  productTitle: string;
  containerQuantity: number;
  containerType: "20'" | "40'";
  totalAmount: number;
  currency: string;
  status:
    | "shipped"
    | "in_transit"
    | "arrived_destination"
    | "in_customs"
    | "delivered"
    | "completed";
  shippingDetails: {
    containerNumber: string;
    vesselName: string;
    departurePort: string;
    destinationPort: string;
    etd: Date;
    eta: Date;
    actualArrival?: Date;
  };
  openIncidents: number;
  completedAt?: Date;
  customerRating?: number;
  lastUpdate: Date;
}

interface Incident {
  id: string;
  orderNumber: string;
  buyerCompany: string;
  type: "damage" | "missing_items" | "delay" | "quality_issue" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "investigating" | "resolved" | "closed";
  title: string;
  description: string;
  reportedAt: Date;
  reportedBy: string;
  assignedTo?: string;
  messages: IncidentMessage[];
  attachments: string[];
}

interface IncidentMessage {
  id: string;
  sender: "buyer" | "supplier";
  senderName: string;
  message: string;
  timestamp: Date;
  attachments?: string[];
}

const SupplierTracking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"tracking" | "incidents">(
    "tracking",
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null,
  );
  const [newMessage, setNewMessage] = useState("");

  // Mock tracking data
  const trackingOrders: TrackingOrder[] = [
    {
      id: "PO-001",
      orderNumber: "PO-2024-001",
      buyerCompany: "Comercial Los Andes S.A.",
      productTitle: "Camisa de Algodón Premium",
      containerQuantity: 2,
      containerType: "20'",
      totalAmount: 19600,
      currency: "USD",
      status: "in_transit",
      shippingDetails: {
        containerNumber: "MSKU7656433",
        vesselName: "COSCO HOPE",
        departurePort: "Puerto Caldera, Costa Rica",
        destinationPort: "Puerto Cortés, Honduras",
        etd: new Date("2024-02-20"),
        eta: new Date("2024-02-25"),
      },
      openIncidents: 0,
      lastUpdate: new Date("2024-02-22"),
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
      status: "arrived_destination",
      shippingDetails: {
        containerNumber: "EVGU1234567",
        vesselName: "EVER ACE",
        departurePort: "Puerto Caldera, Costa Rica",
        destinationPort: "Puerto Quetzal, Guatemala",
        etd: new Date("2024-02-15"),
        eta: new Date("2024-02-20"),
        actualArrival: new Date("2024-02-20"),
      },
      openIncidents: 1,
      lastUpdate: new Date("2024-02-20"),
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
      status: "completed",
      shippingDetails: {
        containerNumber: "MSCU9876543",
        vesselName: "MSC DIANA",
        departurePort: "Puerto Caldera, Costa Rica",
        destinationPort: "Puerto Santo Tomás, Guatemala",
        etd: new Date("2024-02-05"),
        eta: new Date("2024-02-10"),
        actualArrival: new Date("2024-02-10"),
      },
      openIncidents: 0,
      completedAt: new Date("2024-02-15"),
      customerRating: 5,
      lastUpdate: new Date("2024-02-15"),
    },
  ];

  // Mock incidents data
  const incidents: Incident[] = [
    {
      id: "INC-001",
      orderNumber: "PO-2024-002",
      buyerCompany: "Textiles del Pacífico Ltda.",
      type: "missing_items",
      priority: "high",
      status: "open",
      title: "Faltantes detectados en contenedor",
      description:
        "Se detectaron 50 unidades faltantes en el contenedor EVGU1234567. El inventario muestra discrepancia en 2 cajas completas.",
      reportedAt: new Date("2024-02-20T14:30:00"),
      reportedBy: "Carlos Mendoza",
      messages: [
        {
          id: "msg-1",
          sender: "buyer",
          senderName: "Carlos Mendoza",
          message:
            "Estimados, al realizar el inventario del contenedor encontramos que faltan 50 unidades (2 cajas completas de 25 unidades cada una). Adjunto fotos del inventario realizado.",
          timestamp: new Date("2024-02-20T14:30:00"),
          attachments: ["inventario_foto1.jpg", "inventario_foto2.jpg"],
        },
      ],
      attachments: ["inventario_foto1.jpg", "inventario_foto2.jpg"],
    },
    {
      id: "INC-002",
      orderNumber: "PO-2024-001",
      buyerCompany: "Comercial Los Andes S.A.",
      type: "delay",
      priority: "medium",
      status: "resolved",
      title: "Retraso en llegada estimada",
      description:
        "El buque presenta retraso de 3 días debido a condiciones climáticas adversas.",
      reportedAt: new Date("2024-02-22T09:15:00"),
      reportedBy: "María González",
      messages: [
        {
          id: "msg-2",
          sender: "buyer",
          senderName: "María González",
          message:
            "Hemos recibido notificación de la naviera sobre retraso en la llegada. ¿Pueden confirmar nueva fecha estimada?",
          timestamp: new Date("2024-02-22T09:15:00"),
        },
        {
          id: "msg-3",
          sender: "supplier",
          senderName: "ZLC Textiles S.A.",
          message:
            "Confirmamos el retraso. Nueva ETA: 28 de febrero. La naviera nos informa que fue debido a mal tiempo en el Caribe. Mantendremos seguimiento estrecho.",
          timestamp: new Date("2024-02-22T10:45:00"),
        },
      ],
      attachments: [],
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "shipped":
        return "outline";
      case "in_transit":
        return "default";
      case "arrived_destination":
        return "secondary";
      case "in_customs":
        return "outline";
      case "delivered":
        return "default";
      case "completed":
        return "default";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "shipped":
        return "Embarcado";
      case "in_transit":
        return "En Tránsito";
      case "arrived_destination":
        return "Llegó a Destino";
      case "in_customs":
        return "En Aduana";
      case "delivered":
        return "Entregado";
      case "completed":
        return "Completado";
      default:
        return status;
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

  const getIncidentPriorityVariant = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    toast({
      title: "Estado Actualizado",
      description: `La orden ${orderId} ha sido actualizada a "${getStatusLabel(newStatus)}". El comprador será notificado.`,
    });
  };

  const handleIncidentResponse = () => {
    if (!newMessage.trim() || !selectedIncident) return;

    const response: IncidentMessage = {
      id: `msg-${Date.now()}`,
      sender: "supplier",
      senderName: "ZLC Textiles S.A.",
      message: newMessage,
      timestamp: new Date(),
    };

    selectedIncident.messages.push(response);
    setNewMessage("");

    toast({
      title: "Respuesta Enviada",
      description: "Tu respuesta ha sido enviada al comprador.",
    });
  };

  const filteredOrders = trackingOrders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerCompany.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const openIncidentsCount = incidents.filter(
    (inc) => inc.status === "open",
  ).length;
  const inTransitCount = trackingOrders.filter(
    (order) => order.status === "in_transit",
  ).length;
  const completedCount = trackingOrders.filter(
    (order) => order.status === "completed",
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-14 sm:pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Seguimiento y Soporte
              </h1>
              <Button variant="outline" asChild>
                <Link to="/supplier/dashboard">← Volver al Panel</Link>
              </Button>
            </div>
            <p className="text-gray-600">
              Rastrea envíos en tiempo real y gestiona incidencias
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">En Tránsito</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {inTransitCount}
                    </p>
                  </div>
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Incidencias Abiertas
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {openIncidentsCount}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completadas</p>
                    <p className="text-2xl font-bold text-green-600">
                      {completedCount}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Órdenes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {trackingOrders.length}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tab Navigation */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex space-x-4">
                <Button
                  variant={activeTab === "tracking" ? "default" : "outline"}
                  onClick={() => setActiveTab("tracking")}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Seguimiento de Envíos
                </Button>
                <Button
                  variant={activeTab === "incidents" ? "default" : "outline"}
                  onClick={() => setActiveTab("incidents")}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Gestión de Incidencias
                  {openIncidentsCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="ml-2 h-5 w-5 rounded-full p-0 text-xs"
                    >
                      {openIncidentsCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Tab */}
          {activeTab === "tracking" && (
            <>
              {/* Filters */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Buscar por orden o comprador..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="w-full sm:w-48">
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger>
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los estados</SelectItem>
                          <SelectItem value="shipped">Embarcado</SelectItem>
                          <SelectItem value="in_transit">
                            En Tránsito
                          </SelectItem>
                          <SelectItem value="arrived_destination">
                            Llegó a Destino
                          </SelectItem>
                          <SelectItem value="in_customs">En Aduana</SelectItem>
                          <SelectItem value="delivered">Entregado</SelectItem>
                          <SelectItem value="completed">Completado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tracking Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Seguimiento de Órdenes ({filteredOrders.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Orden</TableHead>
                          <TableHead>Comprador</TableHead>
                          <TableHead>Contenedor</TableHead>
                          <TableHead>Buque</TableHead>
                          <TableHead>Ruta</TableHead>
                          <TableHead>ETA</TableHead>
                          <TableHead>Estado Actual</TableHead>
                          <TableHead>Incidencias</TableHead>
                          <TableHead>Última Act.</TableHead>
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
                                <p className="font-medium">
                                  {order.buyerCompany}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {order.containerQuantity}x
                                  {order.containerType}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-mono text-sm">
                                {order.shippingDetails.containerNumber}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {order.shippingDetails.vesselName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div className="flex items-center gap-1 text-green-600">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="truncate max-w-20">
                                    {order.shippingDetails.departurePort}
                                  </span>
                                </div>
                                <ArrowUpDown className="h-3 w-3 text-gray-400 mx-auto my-1" />
                                <div className="flex items-center gap-1 text-blue-600">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="truncate max-w-20">
                                    {order.shippingDetails.destinationPort}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {order.shippingDetails.actualArrival
                                  ? order.shippingDetails.actualArrival.toLocaleDateString()
                                  : order.shippingDetails.eta.toLocaleDateString()}
                                {order.shippingDetails.actualArrival && (
                                  <div className="text-xs text-green-600">
                                    ✓ Arribó
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusVariant(order.status)}>
                                {getStatusLabel(order.status)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {order.openIncidents > 0 ? (
                                <Badge variant="destructive">
                                  {order.openIncidents} abierta(s)
                                </Badge>
                              ) : (
                                <span className="text-green-600 text-sm">
                                  ✓ Sin incidencias
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-600">
                                {order.lastUpdate.toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Select
                                onValueChange={(value) =>
                                  handleStatusUpdate(order.orderNumber, value)
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Actualizar" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="arrived_destination">
                                    Llegó a Destino
                                  </SelectItem>
                                  <SelectItem value="in_customs">
                                    En Aduana
                                  </SelectItem>
                                  <SelectItem value="delivered">
                                    Entregado
                                  </SelectItem>
                                  <SelectItem value="completed">
                                    Completado
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Incidents Tab */}
          {activeTab === "incidents" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Incidents List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Incidencias ({incidents.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {incidents.map((incident) => (
                        <div
                          key={incident.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedIncident?.id === incident.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedIncident(incident)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={getIncidentPriorityVariant(
                                  incident.priority,
                                )}
                              >
                                {incident.priority.toUpperCase()}
                              </Badge>
                              <Badge variant="outline">
                                {getIncidentTypeLabel(incident.type)}
                              </Badge>
                              {incident.status === "open" && (
                                <Badge variant="secondary">Abierta</Badge>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">
                              {incident.reportedAt.toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="font-medium mb-1">{incident.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            Orden: {incident.orderNumber} •{" "}
                            {incident.buyerCompany}
                          </p>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {incident.description}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-gray-500">
                              {incident.messages.length} mensaje(s)
                            </span>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4 mr-1" />
                              Ver detalles
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Incident Detail */}
              <div>
                {selectedIncident ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Conversación
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                        {selectedIncident.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`p-3 rounded-lg ${
                              message.sender === "supplier"
                                ? "bg-blue-50 ml-4"
                                : "bg-gray-50 mr-4"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">
                                {message.senderName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {message.timestamp.toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              {message.message}
                            </p>
                            {message.attachments &&
                              message.attachments.length > 0 && (
                                <div className="mt-2">
                                  {message.attachments.map((file, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-1 text-xs text-blue-600"
                                    >
                                      <Paperclip className="h-3 w-3" />
                                      {file}
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <Textarea
                          placeholder="Escribe tu respuesta..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={handleIncidentResponse}
                            disabled={!newMessage.trim()}
                            className="flex-1"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Enviar Respuesta
                          </Button>
                          <Button variant="outline" size="icon">
                            <Paperclip className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {selectedIncident.status === "open" && (
                        <Separator className="my-4" />
                      )}

                      {selectedIncident.status === "open" && (
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() =>
                              toast({
                                title: "Responsabilidad Aceptada",
                                description:
                                  "Has aceptado la responsabilidad. Propón una solución al comprador.",
                              })
                            }
                          >
                            Aceptar Responsabilidad
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() =>
                              toast({
                                title: "Incidencia Resuelta",
                                description:
                                  "La incidencia ha sido marcada como resuelta.",
                              })
                            }
                          >
                            Marcar como Resuelta
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Selecciona una incidencia para ver los detalles
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierTracking;
