import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Separator } from "@/components/ui/separator";
import { Navigation } from "@/components/Navigation";
import { TrackingTimeline } from "@/components/TrackingTimeline";
import { useShipping } from "@/contexts/ShippingContext";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Info,
  RefreshCw,
  Bell,
  DollarSign,
  Calendar,
  Truck,
  Ship,
  Package,
  FileText,
  Phone,
  MessageSquare,
  Star,
  TrendingUp,
} from "lucide-react";

export default function OrderTracking() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    state: shippingState,
    updateBookingStatus,
    createIncident,
    getTrackingHistory,
    getIncidentsByBooking,
  } = useShipping();

  const { bookingNumber, quoteId } = location.state || {};

  // Mock booking data (in real app, this would come from context or API)
  const [currentBooking] = useState({
    id: "booking-12345",
    shippingRequestId: "shipping-12345",
    selectedOptionId: "option-12345",
    bookingNumber: bookingNumber || "ZLC-12345678",
    shippingLine: "Maersk Line",
    vesselName: "Maersk Ventosa",
    cutoffDate: new Date("2024-01-15"),
    etd: new Date("2024-01-17"),
    eta: new Date("2024-01-29"),
    totalCost: 18450,
    platformCommission: 250,
    status: "in_transit" as const,
    createdAt: new Date("2024-01-10"),
    notifications: [],
  });

  const [trackingData] = useState([
    {
      id: "track-1",
      bookingId: "booking-12345",
      status: "confirmed" as const,
      timestamp: new Date("2024-01-10T09:00:00"),
      location: "Zona Libre de Colón, Panamá",
      description:
        "Booking confirmado exitosamente. Documentación generada y proveedor notificado.",
    },
    {
      id: "track-2",
      bookingId: "booking-12345",
      status: "in_production" as const,
      timestamp: new Date("2024-01-12T14:30:00"),
      location: "Fábrica del Proveedor, Zona Libre",
      description:
        "Proveedor ha iniciado la preparación de mercancía. Proceso de producción en marcha.",
      percentage: 75,
    },
    {
      id: "track-3",
      bookingId: "booking-12345",
      status: "ready_to_ship" as const,
      timestamp: new Date("2024-01-15T16:45:00"),
      location: "Puerto de Colón, Terminal Manzanillo",
      description:
        "Carga completada y contenedor sellado. Listo para embarque en fecha programada.",
    },
    {
      id: "track-4",
      bookingId: "booking-12345",
      status: "in_transit" as const,
      timestamp: new Date("2024-01-17T08:00:00"),
      location: "Atlántico Norte, en ruta a Miami",
      description:
        "Contenedor embarcado en M/V Maersk Ventosa. Zarpe exitoso desde Puerto de Colón.",
      documents: ["BL-001", "CERT-002"],
    },
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showIncidentDialog, setShowIncidentDialog] = useState(false);
  const [incidentForm, setIncidentForm] = useState({
    type: "",
    title: "",
    description: "",
    severity: "medium" as const,
  });

  const handleRefreshTracking = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const handleStatusUpdate = (status: any) => {
    updateBookingStatus(currentBooking.id, status);
  };

  const handleReportIncident = () => {
    setShowIncidentDialog(true);
  };

  const handleSubmitIncident = () => {
    if (!incidentForm.type || !incidentForm.title || !incidentForm.description)
      return;

    createIncident({
      bookingId: currentBooking.id,
      type: incidentForm.type as any,
      title: incidentForm.title,
      description: incidentForm.description,
      severity: incidentForm.severity,
      status: "open",
      reportedBy: "buyer-user-id",
    });

    setShowIncidentDialog(false);
    setIncidentForm({
      type: "",
      title: "",
      description: "",
      severity: "medium",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const getDaysRemaining = (targetDate: Date) => {
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
              onClick={() => navigate("/my-quotes")}
              className="text-zlc-blue-600 hover:text-zlc-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Mis Cotizaciones
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                Seguimiento de Pedido en Tiempo Real
              </h1>
              <p className="text-gray-600 mt-1">
                Paso 5 de 5: Monitoree el progreso de su envío hasta la entrega
                final
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleRefreshTracking}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Actualizar
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zlc-blue-600">
                Paso 5
              </span>
              <span className="text-sm text-gray-500">100% completado</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-zlc-blue-600 h-2 rounded-full"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-3">
              {/* Current Status Alert */}
              <Alert className="mb-6 border-blue-200 bg-blue-50">
                <Ship className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <strong>Su envío está en tránsito!</strong>
                  <br />
                  El contenedor {currentBooking.bookingNumber} zarpa
                  exitosamente desde Puerto de Colón en el M/V{" "}
                  {currentBooking.vesselName}. Llegada estimada:{" "}
                  <strong>{formatDate(currentBooking.eta)}</strong>
                </AlertDescription>
              </Alert>

              {/* Tracking Timeline */}
              <TrackingTimeline
                booking={currentBooking}
                trackingHistory={trackingData}
                onUpdateStatus={handleStatusUpdate}
                onReportIncident={handleReportIncident}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-6 w-6 text-zlc-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-zlc-blue-600">
                      {getDaysRemaining(currentBooking.eta)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Días para llegada
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">75%</div>
                    <div className="text-sm text-gray-600">Progreso</div>
                  </CardContent>
                </Card>
              </div>

              {/* Shipping Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detalles del Envío</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-600">Booking:</span>
                      <p className="font-mono font-bold">
                        {currentBooking.bookingNumber}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Naviera:</span>
                      <p className="font-medium">
                        {currentBooking.shippingLine}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Buque:</span>
                      <p className="font-medium">{currentBooking.vesselName}</p>
                    </div>
                    <Separator />
                    <div>
                      <span className="text-gray-600">Zarpe (ETD):</span>
                      <p className="font-medium">
                        {formatDate(currentBooking.etd)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Llegada (ETA):</span>
                      <p className="font-medium">
                        {formatDate(currentBooking.eta)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Resumen de Costos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total del Pedido:</span>
                      <span className="font-medium">
                        {formatCurrency(currentBooking.totalCost)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Comisión Plataforma:</span>
                      <span>
                        {formatCurrency(currentBooking.platformCommission)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total Pagado:</span>
                      <span className="text-zlc-blue-600">
                        {formatCurrency(
                          currentBooking.totalCost +
                            currentBooking.platformCommission,
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notificaciones Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <Ship className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Zarpe Confirmado</p>
                        <p className="text-gray-600">
                          Su contenedor ha zarpado exitosamente
                        </p>
                        <span className="text-xs text-gray-500">
                          Hace 2 horas
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <FileText className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Documentos Listos</p>
                        <p className="text-gray-600">
                          B/L y certificados disponibles
                        </p>
                        <span className="text-xs text-gray-500">
                          Hace 1 día
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                      <Package className="h-4 w-4 text-amber-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium">Carga Completada</p>
                        <p className="text-gray-600">
                          Contenedor sellado y listo
                        </p>
                        <span className="text-xs text-gray-500">
                          Hace 3 días
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => console.log("Downloading documents")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Descargar Documentos
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => console.log("Contacting support")}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contactar Soporte
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => console.log("Calling shipping line")}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Llamar a Naviera
                    </Button>

                    {currentBooking.status === "completed" && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => console.log("Rating experience")}
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Calificar Experiencia
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Help */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>¿Necesita ayuda?</strong>
                  <br />
                  Nuestro equipo de seguimiento está disponible 24/7 para
                  resolver cualquier consulta sobre su envío.
                  <br />
                  <Button
                    variant="link"
                    className="p-0 h-auto mt-2 text-zlc-blue-600"
                  >
                    Soporte de Seguimiento →
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Incident Report Dialog */}
          <Dialog
            open={showIncidentDialog}
            onOpenChange={setShowIncidentDialog}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Reportar Incidencia</DialogTitle>
                <DialogDescription>
                  Reporte cualquier problema o irregularidad con su envío.
                  Nuestro equipo lo atenderá inmediatamente.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="incidentType">Tipo de Incidencia</Label>
                  <Select
                    value={incidentForm.type}
                    onValueChange={(value) =>
                      setIncidentForm((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="damage">Daños en mercancía</SelectItem>
                      <SelectItem value="missing_items">
                        Faltante de productos
                      </SelectItem>
                      <SelectItem value="delay">Retraso en entrega</SelectItem>
                      <SelectItem value="documentation">
                        Problemas de documentación
                      </SelectItem>
                      <SelectItem value="customs">
                        Problemas aduaneros
                      </SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="incidentTitle">Título de la Incidencia</Label>
                  <Input
                    id="incidentTitle"
                    value={incidentForm.title}
                    onChange={(e) =>
                      setIncidentForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Resumen breve del problema"
                  />
                </div>

                <div>
                  <Label htmlFor="incidentDescription">
                    Descripción Detallada
                  </Label>
                  <Textarea
                    id="incidentDescription"
                    value={incidentForm.description}
                    onChange={(e) =>
                      setIncidentForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describa el problema en detalle..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="severity">Severidad</Label>
                  <Select
                    value={incidentForm.severity}
                    onValueChange={(value) =>
                      setIncidentForm((prev) => ({
                        ...prev,
                        severity: value as any,
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
                      <SelectItem value="critical">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowIncidentDialog(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSubmitIncident}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Reportar Incidencia
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
