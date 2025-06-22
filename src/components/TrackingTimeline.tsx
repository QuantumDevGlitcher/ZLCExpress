import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { OrderTracking, TransportBooking } from "@/types";
import {
  Package,
  Truck,
  Ship,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Building,
  FileText,
  Star,
  MessageSquare,
} from "lucide-react";

interface TrackingTimelineProps {
  booking: TransportBooking;
  trackingHistory: OrderTracking[];
  onUpdateStatus?: (status: TransportBooking["status"]) => void;
  onReportIncident?: () => void;
}

export function TrackingTimeline({
  booking,
  trackingHistory,
  onUpdateStatus,
  onReportIncident,
}: TrackingTimelineProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const getStatusIcon = (status: TransportBooking["status"]) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in_production":
        return <Package className="h-5 w-5 text-amber-600" />;
      case "ready_to_ship":
        return <Truck className="h-5 w-5 text-blue-600" />;
      case "in_transit":
        return <Ship className="h-5 w-5 text-purple-600" />;
      case "arrived":
        return <MapPin className="h-5 w-5 text-orange-600" />;
      case "delivered":
        return <Building className="h-5 w-5 text-green-600" />;
      case "completed":
        return <Star className="h-5 w-5 text-green-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: TransportBooking["status"]) => {
    switch (status) {
      case "confirmed":
        return "Booking Confirmado";
      case "in_production":
        return "En Producción";
      case "ready_to_ship":
        return "Listo para Embarque";
      case "in_transit":
        return "En Tránsito";
      case "arrived":
        return "Llegada a Puerto Destino";
      case "delivered":
        return "Entregado a Almacén";
      case "completed":
        return "Pedido Completado";
      default:
        return "Estado Desconocido";
    }
  };

  const getStatusColor = (status: TransportBooking["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "in_production":
        return "bg-amber-100 text-amber-800";
      case "ready_to_ship":
        return "bg-blue-100 text-blue-800";
      case "in_transit":
        return "bg-purple-100 text-purple-800";
      case "arrived":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressPercentage = (status: TransportBooking["status"]) => {
    switch (status) {
      case "confirmed":
        return 15;
      case "in_production":
        return 30;
      case "ready_to_ship":
        return 50;
      case "in_transit":
        return 75;
      case "arrived":
        return 90;
      case "delivered":
        return 95;
      case "completed":
        return 100;
      default:
        return 0;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const isCurrentStatus = (status: TransportBooking["status"]) => {
    return booking.status === status;
  };

  const statusOrder: TransportBooking["status"][] = [
    "confirmed",
    "in_production",
    "ready_to_ship",
    "in_transit",
    "arrived",
    "delivered",
    "completed",
  ];

  const getCurrentStepIndex = () => {
    return statusOrder.indexOf(booking.status);
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Progreso del Envío</span>
            <Badge className={getStatusColor(booking.status)}>
              {getStatusLabel(booking.status)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progreso del pedido</span>
                <span className="text-sm text-gray-600">
                  {getProgressPercentage(booking.status)}% completado
                </span>
              </div>
              <Progress
                value={getProgressPercentage(booking.status)}
                className="h-3"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Booking:</span>
                <p className="font-mono font-bold">{booking.bookingNumber}</p>
              </div>
              <div>
                <span className="text-gray-600">Naviera:</span>
                <p className="font-medium">{booking.shippingLine}</p>
              </div>
              <div>
                <span className="text-gray-600">ETD:</span>
                <p className="font-medium">
                  {new Date(booking.etd).toLocaleDateString("es-ES")}
                </p>
              </div>
              <div>
                <span className="text-gray-600">ETA:</span>
                <p className="font-medium">
                  {new Date(booking.eta).toLocaleDateString("es-ES")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Línea de Tiempo del Envío</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {statusOrder.map((status, index) => {
              const isActive = getCurrentStepIndex() >= index;
              const isCurrent = isCurrentStatus(status);
              const trackingItem = trackingHistory.find(
                (item) => item.status === status,
              );

              return (
                <div key={status} className="relative">
                  {/* Timeline Line */}
                  {index < statusOrder.length - 1 && (
                    <div
                      className={`absolute left-6 top-12 w-0.5 h-16 ${
                        isActive ? "bg-zlc-blue-600" : "bg-gray-200"
                      }`}
                    />
                  )}

                  {/* Timeline Item */}
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                        isActive
                          ? "bg-zlc-blue-100 border-2 border-zlc-blue-600"
                          : "bg-gray-100 border-2 border-gray-300"
                      } ${isCurrent ? "ring-4 ring-zlc-blue-200" : ""}`}
                    >
                      {getStatusIcon(status)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4
                          className={`font-medium ${
                            isActive ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {getStatusLabel(status)}
                        </h4>
                        {trackingItem && (
                          <span className="text-sm text-gray-500">
                            {formatDate(trackingItem.timestamp)}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p
                        className={`text-sm ${
                          isActive ? "text-gray-600" : "text-gray-400"
                        } mb-2`}
                      >
                        {trackingItem?.description ||
                          getStatusDescription(status)}
                      </p>

                      {/* Progress for production status */}
                      {status === "in_production" &&
                        isCurrent &&
                        trackingItem?.percentage && (
                          <div className="mb-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-gray-500">
                                Progreso de producción
                              </span>
                              <span className="text-xs text-gray-500">
                                {trackingItem.percentage}%
                              </span>
                            </div>
                            <Progress
                              value={trackingItem.percentage}
                              className="h-2"
                            />
                          </div>
                        )}

                      {/* Location */}
                      {trackingItem?.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                          <MapPin className="h-3 w-3" />
                          {trackingItem.location}
                        </div>
                      )}

                      {/* Documents */}
                      {trackingItem?.documents &&
                        trackingItem.documents.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-zlc-blue-600 mb-2">
                            <FileText className="h-3 w-3" />
                            {trackingItem.documents.length} documento
                            {trackingItem.documents.length > 1 ? "s" : ""}{" "}
                            disponible
                            {trackingItem.documents.length > 1 ? "s" : ""}
                          </div>
                        )}

                      {/* Expand/Collapse for more details */}
                      {trackingItem && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs text-zlc-blue-600"
                          onClick={() =>
                            setExpandedItem(
                              expandedItem === trackingItem.id
                                ? null
                                : trackingItem.id,
                            )
                          }
                        >
                          {expandedItem === trackingItem.id
                            ? "Ver menos"
                            : "Ver detalles"}
                        </Button>
                      )}

                      {/* Expanded Details */}
                      {expandedItem === trackingItem?.id && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                          <div className="space-y-2">
                            <div>
                              <span className="font-medium">
                                Actualización completa:
                              </span>
                              <p className="mt-1">{trackingItem.description}</p>
                            </div>
                            {trackingItem.location && (
                              <div>
                                <span className="font-medium">Ubicación:</span>
                                <p>{trackingItem.location}</p>
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Fecha y hora:</span>
                              <p>{formatDate(trackingItem.timestamp)}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {booking.status === "delivered" && (
          <Button
            onClick={() => onUpdateStatus?.("completed")}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirmar Recepción
          </Button>
        )}

        <Button
          variant="outline"
          onClick={onReportIncident}
          className="border-red-300 text-red-600 hover:bg-red-50"
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          Reportar Incidencia
        </Button>

        <Button variant="outline">
          <MessageSquare className="h-4 w-4 mr-2" />
          Contactar Soporte
        </Button>
      </div>
    </div>
  );
}

// Helper function to get status descriptions
function getStatusDescription(status: TransportBooking["status"]): string {
  switch (status) {
    case "confirmed":
      return "Booking confirmado y documentación generada. Proveedor notificado.";
    case "in_production":
      return "Proveedor iniciando producción y preparación de mercancía.";
    case "ready_to_ship":
      return "Carga lista para embarque. Esperando fecha de corte.";
    case "in_transit":
      return "Contenedor embarcado y en tránsito hacia puerto de destino.";
    case "arrived":
      return "Llegada a puerto de destino. Inicio de gestiones aduaneras.";
    case "delivered":
      return "Entregado en almacén del comprador. Pendiente confirmación.";
    case "completed":
      return "Pedido completado exitosamente. Proceso finalizado.";
    default:
      return "Estado pendiente de actualización.";
  }
}
