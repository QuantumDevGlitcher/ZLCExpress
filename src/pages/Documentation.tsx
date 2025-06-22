import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/Navigation";
import { DocumentationCard } from "@/components/DocumentationCard";
import { useShipping } from "@/contexts/ShippingContext";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  FileText,
  Download,
  User,
  Phone,
  MessageCircle,
  Info,
  AlertCircle,
  Truck,
  Calendar,
  Building,
} from "lucide-react";

export default function Documentation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: shippingState } = useShipping();

  const { bookingNumber, quoteId } = location.state || {};
  const [documentsReady, setDocumentsReady] = useState(0);
  const [totalDocuments] = useState(5);

  useEffect(() => {
    // Simulate document generation progress
    const timer = setInterval(() => {
      setDocumentsReady((prev) => {
        if (prev < totalDocuments) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [totalDocuments]);

  const handleDownloadDocument = (documentId: string) => {
    // Simulate document download
    console.log(`Downloading document: ${documentId}`);
    // In a real implementation, this would trigger the actual download
  };

  const handlePreviewDocument = (documentId: string) => {
    // Simulate document preview
    console.log(`Previewing document: ${documentId}`);
    // In a real implementation, this would open a preview modal
  };

  const handleContactIris = () => {
    // Simulate contacting customs advisor
    console.log("Contacting Iris - Customs Advisor");
    // In a real implementation, this would open a chat or contact form
  };

  const handleProceedToTracking = () => {
    navigate("/order-tracking", {
      state: {
        bookingNumber,
        quoteId,
      },
    });
  };

  const progressPercentage = (documentsReady / totalDocuments) * 100;

  const mockDocuments = [
    {
      id: "doc-1",
      bookingId: bookingNumber,
      type: "commercial_invoice" as const,
      title: "Factura Comercial Final",
      description:
        "Factura comercial con desglose de mercancía, flete y comisión de la plataforma",
      status: documentsReady >= 1 ? ("ready" as const) : ("pending" as const),
      generatedAt: documentsReady >= 1 ? new Date() : undefined,
    },
    {
      id: "doc-2",
      bookingId: bookingNumber,
      type: "packing_list" as const,
      title: "Packing List Definitivo",
      description:
        "Lista detallada del contenido del contenedor y especificaciones",
      status: documentsReady >= 2 ? ("ready" as const) : ("pending" as const),
      generatedAt: documentsReady >= 2 ? new Date() : undefined,
    },
    {
      id: "doc-3",
      bookingId: bookingNumber,
      type: "customs_data" as const,
      title: "Datos Aduaneros Básicos",
      description:
        "Código HS, valor FOB, Incoterm y clasificación arancelaria completa",
      status: documentsReady >= 3 ? ("ready" as const) : ("pending" as const),
      generatedAt: documentsReady >= 3 ? new Date() : undefined,
    },
    {
      id: "doc-4",
      bookingId: bookingNumber,
      type: "zlc_checklist" as const,
      title: "Checklist Zona Libre de Colón",
      description: "Documentos y requisitos específicos para ZLC Panamá",
      status: documentsReady >= 4 ? ("ready" as const) : ("pending" as const),
      generatedAt: documentsReady >= 4 ? new Date() : undefined,
    },
    {
      id: "doc-5",
      bookingId: bookingNumber,
      type: "destination_checklist" as const,
      title: "Checklist Puerto de Destino",
      description: "Requisitos aduaneros específicos del país de destino",
      status: documentsReady >= 5 ? ("ready" as const) : ("pending" as const),
      generatedAt: documentsReady >= 5 ? new Date() : undefined,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-zlc-blue-600 hover:text-zlc-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Documentación y Apoyo Aduanero
              </h1>
              <p className="text-gray-600 mt-1">
                Paso 4 de 5: Acceda a sus documentos comerciales y soporte
                aduanero simplificado
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zlc-blue-600">
                Paso 4
              </span>
              <span className="text-sm text-gray-500">80% completado</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-zlc-blue-600 h-2 rounded-full"
                style={{ width: "80%" }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-6">
              {/* Status Alert */}
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <strong>Booking confirmado exitosamente!</strong>
                  <br />
                  Su reserva de transporte {bookingNumber} ha sido procesada.
                  Los documentos comerciales y aduaneros se están generando
                  automáticamente.
                </AlertDescription>
              </Alert>

              {/* Document Generation Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-zlc-blue-600" />
                    Generación de Documentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Progreso de generación
                        </span>
                        <span className="text-sm text-gray-600">
                          {documentsReady} de {totalDocuments} documentos listos
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>

                    {documentsReady < totalDocuments && (
                      <div className="flex items-center gap-2 text-sm text-amber-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                        Generando documentos automáticamente...
                      </div>
                    )}

                    {documentsReady === totalDocuments && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        Todos los documentos han sido generados exitosamente
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Documents Grid */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Paquete Aduanero Completo
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockDocuments.map((document) => (
                      <DocumentationCard
                        key={document.id}
                        document={document}
                        onDownload={handleDownloadDocument}
                        onPreview={handlePreviewDocument}
                      />
                    ))}
                  </div>
                </div>

                {/* Bulk Actions */}
                {documentsReady === totalDocuments && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() =>
                            console.log("Downloading all documents as ZIP")
                          }
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Descargar Todo (ZIP)
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() =>
                            console.log("Sending documents by email")
                          }
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Enviar por Email
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Iris Customs Advisor */}
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <User className="h-5 w-5" />
                    Iris - Asesora Aduanera Especializada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-purple-800 mb-2">
                        ¿Tiene consultas específicas sobre sus documentos
                        aduaneros?
                      </h4>
                      <p className="text-sm text-purple-700 mb-4">
                        Iris es nuestra especialista en aduanas con 15+ años de
                        experiencia en ZLC. Puede ayudarle con clasificaciones
                        arancelarias, requisitos específicos por país, y
                        optimización de procesos aduaneros.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={handleContactIris}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contactar a Iris
                        </Button>
                        <Button variant="outline" className="border-purple-300">
                          <Phone className="h-4 w-4 mr-2" />
                          Agendar Llamada
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Continue Button */}
              {documentsReady === totalDocuments && (
                <div className="flex justify-end">
                  <Button
                    onClick={handleProceedToTracking}
                    className="bg-zlc-blue-600 hover:bg-zlc-blue-700 text-white px-8"
                    size="lg"
                  >
                    Continuar al Seguimiento
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumen del Booking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-600">Número de Booking:</span>
                      <p className="font-mono font-bold">{bookingNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Estado:</span>
                      <p className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">
                          Confirmado
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Operador:</span>
                      <p className="font-medium">Maersk Line</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Contenedor:</span>
                      <p className="font-medium">40' High Cube</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Important Dates */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fechas Importantes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Fecha de Corte</p>
                        <p className="text-gray-600">15 de enero, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Fecha de Zarpe (ETD)</p>
                        <p className="text-gray-600">17 de enero, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Fecha de Llegada (ETA)</p>
                        <p className="text-gray-600">29 de enero, 2024</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Supplier Notification */}
              <Alert>
                <Building className="h-4 w-4" />
                <AlertDescription>
                  <strong>Proveedor notificado</strong>
                  <br />
                  Su proveedor ha sido informado de las fechas de corte y envío.
                  Ellos deben tener la carga lista para el 15 de enero.
                </AlertDescription>
              </Alert>

              {/* Document Help */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Ayuda con Documentos
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2">
                  <div>
                    <span className="font-medium">Factura Comercial:</span>{" "}
                    Documento oficial para aduanas con valores reales
                  </div>
                  <div>
                    <span className="font-medium">Packing List:</span> Detalle
                    físico del contenido del contenedor
                  </div>
                  <div>
                    <span className="font-medium">Datos Aduaneros:</span>{" "}
                    Clasificación arancelaria e información fiscal
                  </div>
                  <div>
                    <span className="font-medium">Checklists:</span> Requisitos
                    específicos por jurisdicción
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Próximos pasos:</strong>
                  <br />
                  1. Descarga de documentos completa
                  <br />
                  2. Notificación a transportista
                  <br />
                  3. Inicio de seguimiento en tiempo real
                  <br />
                  4. Actualización de estado a "En Producción"
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
