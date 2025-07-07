import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  CalendarDays,
  ArrowLeft,
  Ship,
  Package,
  FileText,
  Download,
  Upload,
  Camera,
  CheckCircle,
  Clock,
  AlertCircle,
  Building2,
  Anchor,
  MapPin,
  Truck,
  Globe,
  User,
  Phone,
  Mail,
  Award,
  Receipt,
  FileSpreadsheet,
  Plane,
} from "lucide-react";

const SupplierShipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for logistics coordination
  const [suggestedShippingLine, setSuggestedShippingLine] = useState("");
  const [logisticsNotes, setLogisticsNotes] = useState("");

  // State for document generation
  const [containerNumber, setContainerNumber] = useState("");
  const [sealNumber, setSealNumber] = useState("");
  const [vesselName, setVesselName] = useState("");
  const [bookingNumber, setBookingNumber] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");

  // State for shipment confirmation
  const [containerPhoto, setContainerPhoto] = useState<File | null>(null);
  const [shipmentConfirmed, setShipmentConfirmed] = useState(false);

  // Mock shipment data
  const shipmentData = {
    id: "PO-001",
    orderNumber: "PO-2024-001",
    buyerCompany: "Comercial Los Andes S.A.",
    buyerContact: "María González",
    buyerEmail: "maria.gonzalez@losandes.com",
    buyerPhone: "+506 2234-5678",
    productTitle: "Camisa de Algodón Premium",
    productCode: "CAM-ALG-20GP-0500",
    containerQuantity: 2,
    containerType: "20'" as const,
    totalAmount: 19600,
    currency: "USD",
    incoterm: "FOB" as const,
    status: "ready_for_shipment" as const,
    productionProgress: 100,
    estimatedDelivery: new Date("2024-03-15"),
    transportData: {
      shippingLine: "",
      selectedByBuyer: false,
      departurePort: "Puerto Caldera, Costa Rica",
      destinationPort: "Puerto Cortés, Honduras",
    },
    documentsGenerated: {
      billOfLading: false,
      commercialInvoice: false,
      packingList: false,
      certificateOfOrigin: false,
    },
  };

  const availableShippingLines = [
    "Evergreen Line",
    "COSCO Shipping",
    "Maersk Line",
    "MSC Mediterranean",
    "CMA CGM",
    "Hapag-Lloyd",
  ];

  const handleLogisticsCoordination = () => {
    toast({
      title: "Logística Coordinada",
      description:
        "La información del transportista ha sido enviada al comprador para aprobación.",
    });
  };

  const handleDocumentGeneration = (documentType: string) => {
    // Simulate document generation
    setTimeout(() => {
      toast({
        title: "Documento Generado",
        description: `${documentType} ha sido generado y firmado electrónicamente.`,
      });
    }, 1500);
  };

  const handleGenerateAllDocuments = () => {
    if (!containerNumber || !vesselName || !bookingNumber || !departureDate) {
      toast({
        title: "Error",
        description:
          "Complete todos los campos requeridos para generar los documentos.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Generando Documentos",
      description: "Se están generando todos los documentos de embarque...",
    });

    // Simulate document generation process
    setTimeout(() => {
      toast({
        title: "Documentos Generados",
        description:
          "Todos los documentos de embarque han sido generados y están disponibles para descarga.",
      });
    }, 3000);
  };

  const handleShipmentConfirmation = () => {
    if (!containerNumber || !departureDate || !departureTime) {
      toast({
        title: "Error",
        description: "Complete la información de embarque antes de confirmar.",
        variant: "destructive",
      });
      return;
    }

    setShipmentConfirmed(true);
    toast({
      title: "Embarque Confirmado",
      description:
        "El contenedor ha sido marcado como embarcado. El comprador será notificado automáticamente.",
    });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setContainerPhoto(file);
      toast({
        title: "Foto Subida",
        description: "La foto del contenedor ha sido adjuntada como evidencia.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-14 sm:pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => navigate("/supplier/shipments")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Envíos
            </Button>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Gestión de Envío - {shipmentData.orderNumber}
              </h1>
              <Button variant="outline" asChild>
                <Link to="/supplier/dashboard">← Volver al Panel</Link>
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="default" className="bg-green-100 text-green-800">
                <Package className="h-4 w-4 mr-1" />
                Producción Completada (100%)
              </Badge>
              {shipmentConfirmed && (
                <Badge variant="default" className="bg-blue-100 text-blue-800">
                  <Ship className="h-4 w-4 mr-1" />
                  Embarcado
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Resumen de la Orden
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Comprador
                      </Label>
                      <p className="font-medium">{shipmentData.buyerCompany}</p>
                      <p className="text-sm text-gray-600">
                        {shipmentData.buyerContact}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Producto
                      </Label>
                      <p className="font-medium">{shipmentData.productTitle}</p>
                      <p className="text-sm text-gray-600">
                        {shipmentData.productCode}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Cantidad
                      </Label>
                      <p className="font-medium">
                        {shipmentData.containerQuantity} contenedores (
                        {shipmentData.containerType})
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Incoterm
                      </Label>
                      <Badge variant="outline">{shipmentData.incoterm}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Logistics Coordination Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Coordinación Logística
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!shipmentData.transportData.selectedByBuyer ? (
                    <div className="space-y-4">
                      <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                        <div className="flex items-center gap-2 text-orange-800 mb-2">
                          <AlertCircle className="h-5 w-5" />
                          <span className="font-medium">
                            Transportista no definido
                          </span>
                        </div>
                        <p className="text-sm text-orange-700">
                          El comprador no ha seleccionado un transportista.
                          Puedes sugerir una naviera.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="shipping-line">
                            Naviera Sugerida
                          </Label>
                          <select
                            id="shipping-line"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                            value={suggestedShippingLine}
                            onChange={(e) =>
                              setSuggestedShippingLine(e.target.value)
                            }
                          >
                            <option value="">Seleccionar naviera...</option>
                            {availableShippingLines.map((line) => (
                              <option key={line} value={line}>
                                {line}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="logistics-notes">
                            Notas Adicionales
                          </Label>
                          <Textarea
                            id="logistics-notes"
                            placeholder="Información adicional sobre el transporte, tiempos estimados, costos, etc."
                            value={logisticsNotes}
                            onChange={(e) => setLogisticsNotes(e.target.value)}
                            rows={3}
                          />
                        </div>

                        <Button
                          onClick={handleLogisticsCoordination}
                          disabled={!suggestedShippingLine}
                        >
                          <Ship className="h-4 w-4 mr-2" />
                          Enviar Sugerencia al Comprador
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                      <div className="flex items-center gap-2 text-green-800 mb-2">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">
                          Transportista Definido
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-green-700">
                          <strong>Naviera:</strong>{" "}
                          {shipmentData.transportData.shippingLine}
                        </p>
                        <p className="text-sm text-green-700">
                          <strong>Puerto Salida:</strong>{" "}
                          {shipmentData.transportData.departurePort}
                        </p>
                        <p className="text-sm text-green-700">
                          <strong>Puerto Destino:</strong>{" "}
                          {shipmentData.transportData.destinationPort}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Shipping Documents Generation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Generar Documentos de Embarque
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Shipping Information Form */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">
                      Información de Embarque
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="container-number">
                          Número de Contenedor *
                        </Label>
                        <Input
                          id="container-number"
                          placeholder="MSKU7656433"
                          value={containerNumber}
                          onChange={(e) => setContainerNumber(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="seal-number">Número de Sello</Label>
                        <Input
                          id="seal-number"
                          placeholder="SL123456"
                          value={sealNumber}
                          onChange={(e) => setSealNumber(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="vessel-name">Nombre del Buque *</Label>
                        <Input
                          id="vessel-name"
                          placeholder="COSCO HOPE"
                          value={vesselName}
                          onChange={(e) => setVesselName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="booking-number">
                          Número de Booking *
                        </Label>
                        <Input
                          id="booking-number"
                          placeholder="COSCO-2024-001"
                          value={bookingNumber}
                          onChange={(e) => setBookingNumber(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="departure-date">Fecha de Zarpe *</Label>
                        <Input
                          id="departure-date"
                          type="date"
                          value={departureDate}
                          onChange={(e) => setDepartureDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="arrival-date">
                          Fecha Estimada de Llegada
                        </Label>
                        <Input
                          id="arrival-date"
                          type="date"
                          value={arrivalDate}
                          onChange={(e) => setArrivalDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Document Generation Buttons */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">
                      Documentos de Embarque
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Ship className="h-5 w-5 text-blue-600" />
                          <div>
                            <h5 className="font-medium">Bill of Lading (BL)</h5>
                            <p className="text-sm text-gray-600">
                              Documento de transporte marítimo
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleDocumentGeneration("Bill of Lading")
                          }
                          className="w-full"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Generar BL
                        </Button>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Receipt className="h-5 w-5 text-green-600" />
                          <div>
                            <h5 className="font-medium">
                              Factura Comercial Final
                            </h5>
                            <p className="text-sm text-gray-600">
                              Incluye mercancía y flete
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleDocumentGeneration("Factura Comercial")
                          }
                          className="w-full"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Generar Factura
                        </Button>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <FileSpreadsheet className="h-5 w-5 text-orange-600" />
                          <div>
                            <h5 className="font-medium">
                              Packing List Definitivo
                            </h5>
                            <p className="text-sm text-gray-600">
                              Detalle por cajas y paletas
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleDocumentGeneration("Packing List")
                          }
                          className="w-full"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Generar Packing List
                        </Button>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Award className="h-5 w-5 text-purple-600" />
                          <div>
                            <h5 className="font-medium">
                              Certificado de Origen
                            </h5>
                            <p className="text-sm text-gray-600">
                              CO definitivo certificado
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleDocumentGeneration("Certificado de Origen")
                          }
                          className="w-full"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Generar CO
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerateAllDocuments}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generar Todos los Documentos
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Shipment Confirmation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Anchor className="h-5 w-5" />
                    Confirmar Embarque
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!shipmentConfirmed ? (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <div className="flex items-center gap-2 text-blue-800 mb-2">
                          <Ship className="h-5 w-5" />
                          <span className="font-medium">
                            Marcar Contenedor Zarpó
                          </span>
                        </div>
                        <p className="text-sm text-blue-700">
                          Complete la información de embarque y confirme que el
                          contenedor ha zarpado.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="departure-time">Hora de Zarpe</Label>
                          <Input
                            id="departure-time"
                            type="time"
                            value={departureTime}
                            onChange={(e) => setDepartureTime(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="container-photo">
                            Foto del Contenedor
                          </Label>
                          <Input
                            id="container-photo"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                          />
                          {containerPhoto && (
                            <p className="text-sm text-green-600 mt-1">
                              ✓ Foto subida: {containerPhoto.name}
                            </p>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={handleShipmentConfirmation}
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={
                          !containerNumber || !departureDate || !departureTime
                        }
                      >
                        <Ship className="h-4 w-4 mr-2" />
                        Confirmar Embarque
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                      <div className="flex items-center gap-2 text-green-800 mb-3">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Embarque Confirmado</span>
                      </div>
                      <div className="space-y-2 text-sm text-green-700">
                        <p>
                          <strong>Contenedor:</strong> {containerNumber}
                        </p>
                        <p>
                          <strong>Fecha y Hora:</strong> {departureDate} a las{" "}
                          {departureTime}
                        </p>
                        <p>
                          <strong>Buque:</strong> {vesselName}
                        </p>
                        <p>
                          <strong>Booking:</strong> {bookingNumber}
                        </p>
                        {containerPhoto && (
                          <p>
                            <strong>Evidencia fotográfica:</strong> ✓ Adjuntada
                          </p>
                        )}
                      </div>
                      <div className="mt-3 p-3 bg-green-100 rounded">
                        <p className="text-sm text-green-800">
                          <strong>Notificación enviada:</strong> "Tu contenedor
                          ha zarpado – ETD: {departureDate}, ETA:{" "}
                          {arrivalDate || "Por confirmar"}"
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Buyer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información del Comprador
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">{shipmentData.buyerCompany}</p>
                    <p className="text-sm text-gray-600">
                      {shipmentData.buyerContact}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{shipmentData.buyerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{shipmentData.buyerPhone}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Route */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Ruta de Embarque
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Puerto de Salida
                    </Label>
                    <p className="font-medium">
                      {shipmentData.transportData.departurePort}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Puerto de Destino
                    </Label>
                    <p className="font-medium">
                      {shipmentData.transportData.destinationPort}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Entrega Estimada
                    </Label>
                    <p className="font-medium">
                      {shipmentData.estimatedDelivery.toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Contactar Comprador
                  </Button>
                  <Button className="w-full" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Ver Orden Completa
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate("/supplier/shipments")}
                  >
                    Ver Todos los Envíos
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierShipmentDetail;
