import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  FileText,
  Upload,
  Download,
  CheckCircle,
  Clock,
  Building2,
  Package,
  DollarSign,
  Calendar,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  FileSpreadsheet,
  Award,
  Receipt,
  X,
} from "lucide-react";

interface DocumentUpload {
  type: "packing_list" | "certificate_of_origin" | "commercial_invoice";
  title: string;
  description: string;
  required: boolean;
  uploaded: boolean;
  fileName?: string;
  uploadedAt?: Date;
  fileUrl?: string;
}

const SupplierOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock order data - in real app, this would be fetched from API
  const orderData = {
    id: "PO-001",
    orderNumber: "PO-2024-001",
    rfqNumber: "RFQ-2024-001",
    buyerCompany: "Comercial Los Andes S.A.",
    buyerContact: "María González",
    buyerEmail: "maria.gonzalez@losandes.com",
    buyerPhone: "+506 2234-5678",
    buyerAddress: {
      street: "Av. Central 123",
      city: "San José",
      state: "San José",
      country: "Costa Rica",
      postalCode: "10101",
    },
    supplierCompany: "ZLC Textiles S.A.",
    productTitle: "Camisa de Algodón Premium",
    productCode: "CAM-ALG-20GP-0500",
    containerQuantity: 2,
    containerType: "20'" as const,
    unitPrice: 9800,
    totalAmount: 19600,
    currency: "USD",
    incoterm: "FOB" as const,
    paymentConditions: "30% T/T + 70% contra BL",
    status: "pending_payment" as const,
    createdAt: new Date("2024-01-20"),
    advancePaymentDue: new Date("2024-02-05"),
    estimatedDelivery: new Date("2024-03-15"),
    advanceAmount: 5880, // 30%
    balanceAmount: 13720, // 70%
    digitalSignature: {
      signed: true,
      signedAt: new Date("2024-01-20T15:30:00"),
      signedBy: "ZLC Textiles S.A.",
    },
    specifications: {
      Material: "100% Algodón Pima",
      Color: "Blanco",
      Tallas: "S, M, L, XL",
      "Unidades por caja": "12 piezas",
      "Cajas por contenedor": "500 cajas",
      "Total unidades": "6,000 piezas",
    },
  };

  const [documents, setDocuments] = useState<DocumentUpload[]>([
    {
      type: "commercial_invoice",
      title: "Factura Comercial Proforma",
      description: "Invoice proforma para mercancía y flete (si aplica)",
      required: true,
      uploaded: true,
      fileName: "Commercial_Invoice_PO-2024-001.pdf",
      uploadedAt: new Date("2024-01-20T16:00:00"),
      fileUrl: "#",
    },
    {
      type: "packing_list",
      title: "Packing List Preliminar",
      description:
        "Desglose de unidades por paleta/caja en formato PDF o Excel",
      required: true,
      uploaded: false,
    },
    {
      type: "certificate_of_origin",
      title: "Certificado de Origen (CO) Provisional",
      description: "Certificado de origen provisional si ya está disponible",
      required: false,
      uploaded: false,
    },
  ]);

  const [uploadingDocument, setUploadingDocument] = useState<string | null>(
    null,
  );
  const [productionProgress, setProductionProgress] = useState(0);
  const [productionStatus, setProductionStatus] = useState(
    "Pago recibido, preparando materia prima",
  );
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending_payment":
        return "secondary";
      case "advance_paid":
        return "default";
      case "in_production":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending_payment":
        return "Pendiente de Pago";
      case "advance_paid":
        return "Anticipo Pagado";
      case "in_production":
        return "En Producción";
      default:
        return status;
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "packing_list":
        return <FileSpreadsheet className="h-5 w-5" />;
      case "certificate_of_origin":
        return <Award className="h-5 w-5" />;
      case "commercial_invoice":
        return <Receipt className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const handleFileUpload = (documentType: string, file: File) => {
    setUploadingDocument(documentType);

    // Simulate file upload
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.type === documentType
            ? {
                ...doc,
                uploaded: true,
                fileName: file.name,
                uploadedAt: new Date(),
                fileUrl: "#",
              }
            : doc,
        ),
      );

      setUploadingDocument(null);

      toast({
        title: "Documento Subido",
        description: `${file.name} se ha subido correctamente.`,
      });
    }, 2000);
  };

  const handleRemoveDocument = (documentType: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.type === documentType
          ? {
              ...doc,
              uploaded: false,
              fileName: undefined,
              uploadedAt: undefined,
              fileUrl: undefined,
            }
          : doc,
      ),
    );

    toast({
      title: "Documento Eliminado",
      description: "El documento ha sido eliminado correctamente.",
    });
  };

  const getDocumentProgress = () => {
    const totalDocs = documents.length;
    const uploadedDocs = documents.filter((doc) => doc.uploaded).length;
    return (uploadedDocs / totalDocs) * 100;
  };

  const allRequiredDocumentsUploaded = () => {
    return documents.filter((doc) => doc.required).every((doc) => doc.uploaded);
  };

  const getProductionStatusByProgress = (progress: number) => {
    if (progress === 0) return "Pago recibido, preparando materia prima";
    if (progress <= 25) return "Corte y confección en marcha";
    if (progress <= 50) return "Embalaje en proceso";
    if (progress <= 75) return "Paletas listas, esperando transporte interno";
    if (progress === 100) return "Listo para embarcar";
    return "En producción";
  };

  const handlePaymentConfirmation = () => {
    setPaymentReceived(true);
    setShowPaymentConfirmation(false);
    toast({
      title: "Pago Confirmado",
      description:
        "El anticipo ha sido marcado como recibido. El comprador será notificado que la producción ha iniciado.",
    });
  };

  const handleProductionUpdate = (newProgress: number) => {
    setProductionProgress(newProgress);
    const newStatus = getProductionStatusByProgress(newProgress);
    setProductionStatus(newStatus);

    toast({
      title: "Producción Actualizada",
      description: `Progreso actualizado a ${newProgress}%. El comprador será notificado automáticamente.`,
    });
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
              onClick={() => navigate("/supplier/orders")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Órdenes
            </Button>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Orden Proforma - {orderData.orderNumber}
              </h1>
              <Button variant="outline" asChild>
                <Link to="/supplier/dashboard">← Volver al Panel</Link>
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={getStatusVariant(orderData.status)}>
                {getStatusLabel(orderData.status)}
              </Badge>
              {orderData.digitalSignature.signed && (
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Firmado Digitalmente
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Detalles de la Orden
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Número de Orden
                      </Label>
                      <p className="font-medium">{orderData.orderNumber}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        RFQ Origen
                      </Label>
                      <Badge variant="outline">{orderData.rfqNumber}</Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Producto
                      </Label>
                      <p className="font-medium">{orderData.productTitle}</p>
                      <p className="text-sm text-gray-600">
                        Código: {orderData.productCode}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Cantidad
                      </Label>
                      <p className="font-medium">
                        {orderData.containerQuantity} contenedores (
                        {orderData.containerType})
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Incoterm
                      </Label>
                      <Badge variant="outline">{orderData.incoterm}</Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Fecha de Creación
                      </Label>
                      <p className="font-medium">
                        {orderData.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium text-gray-600 mb-3 block">
                      Especificaciones del Producto
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.entries(orderData.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between py-1 border-b border-gray-100"
                          >
                            <span className="text-sm text-gray-600">
                              {key}:
                            </span>
                            <span className="text-sm font-medium">{value}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Buyer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Información del Comprador
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Empresa
                      </Label>
                      <p className="font-medium">{orderData.buyerCompany}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Contacto
                      </Label>
                      <p className="font-medium">{orderData.buyerContact}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Email
                      </Label>
                      <p className="font-medium flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {orderData.buyerEmail}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Teléfono
                      </Label>
                      <p className="font-medium flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {orderData.buyerPhone}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Dirección
                    </Label>
                    <p className="font-medium flex items-start gap-1">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <span>
                        {orderData.buyerAddress.street},{" "}
                        {orderData.buyerAddress.city},{" "}
                        {orderData.buyerAddress.state},{" "}
                        {orderData.buyerAddress.country},{" "}
                        {orderData.buyerAddress.postalCode}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Document Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Documentos Iniciales de la Orden
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Progress value={getDocumentProgress()} className="h-2" />
                    </div>
                    <span className="text-sm font-medium">
                      {Math.round(getDocumentProgress())}% completado
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {documents.map((document) => (
                    <div
                      key={document.type}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getDocumentIcon(document.type)}
                          <div>
                            <h4 className="font-medium flex items-center gap-2">
                              {document.title}
                              {document.required && (
                                <Badge variant="secondary" className="text-xs">
                                  Requerido
                                </Badge>
                              )}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {document.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {document.uploaded ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {document.uploaded ? (
                        <div className="bg-green-50 border border-green-200 rounded-md p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">
                                {document.fileName}
                              </span>
                              <span className="text-xs text-green-600">
                                Subido el{" "}
                                {document.uploadedAt?.toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8"
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Descargar
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 text-red-600 hover:text-red-700"
                                onClick={() =>
                                  handleRemoveDocument(document.type)
                                }
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                          <div className="text-center">
                            {uploadingDocument === document.type ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <span className="text-sm text-gray-600">
                                  Subiendo archivo...
                                </span>
                              </div>
                            ) : (
                              <>
                                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600 mb-2">
                                  Arrastra un archivo aquí o haz clic para
                                  seleccionar
                                </p>
                                <Input
                                  type="file"
                                  accept=".pdf,.xlsx,.xls,.doc,.docx"
                                  className="hidden"
                                  id={`file-${document.type}`}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleFileUpload(document.type, file);
                                    }
                                  }}
                                />
                                <Label
                                  htmlFor={`file-${document.type}`}
                                  className="cursor-pointer"
                                >
                                  <Button variant="outline" size="sm" asChild>
                                    <span>Seleccionar Archivo</span>
                                  </Button>
                                </Label>
                                <p className="text-xs text-gray-500 mt-1">
                                  PDF, Excel, Word (máx. 10MB)
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {allRequiredDocumentsUploaded() && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">
                          Todos los documentos requeridos han sido subidos
                        </span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        El comprador ha sido notificado y puede revisar los
                        documentos antes de realizar el anticipo.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Confirmation Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Confirmación de Pago Anticipado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!paymentReceived ? (
                    <div className="space-y-4">
                      <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                        <div className="flex items-center gap-2 text-orange-800 mb-2">
                          <Clock className="h-5 w-5" />
                          <span className="font-medium">
                            Esperando Comprobante de Pago
                          </span>
                        </div>
                        <p className="text-sm text-orange-700 mb-3">
                          El comprador debe subir el comprobante de
                          transferencia del anticipo ($
                          {orderData.advanceAmount.toLocaleString()}) desde su
                          panel "Mis Pagos".
                        </p>
                        <p className="text-xs text-orange-600">
                          Vencimiento:{" "}
                          {orderData.advancePaymentDue.toLocaleDateString()}
                        </p>
                      </div>

                      <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                        <Receipt className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-3">
                          Cuando recibas la confirmación bancaria del anticipo,
                          marca el pago como recibido
                        </p>
                        <Button
                          onClick={() => setShowPaymentConfirmation(true)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marcar Pago Recibido
                        </Button>
                      </div>

                      {showPaymentConfirmation && (
                        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                          <div className="flex items-center gap-2 text-amber-900 mb-2">
                            <AlertCircle className="h-5 w-5" />
                            <span className="font-medium">
                              Confirmar Recepción de Pago
                            </span>
                          </div>
                          <p className="text-sm text-amber-800 mb-3">
                            ¿Confirmas que has recibido la transferencia
                            bancaria del anticipo de $
                            {orderData.advanceAmount.toLocaleString()}{" "}
                            {orderData.currency}?
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handlePaymentConfirmation}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Sí, Confirmar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowPaymentConfirmation(false)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                      <div className="flex items-center gap-2 text-green-800 mb-2">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">
                          Pago Anticipado Confirmado
                        </span>
                      </div>
                      <p className="text-sm text-green-700">
                        Anticipo de ${orderData.advanceAmount.toLocaleString()}{" "}
                        {orderData.currency} confirmado. El comprador ha sido
                        notificado que la producción ha iniciado.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Production Tracking Section */}
              {paymentReceived && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Seguimiento de Producción
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Progreso de Producción
                        </span>
                        <span className="text-2xl font-bold text-blue-600">
                          {productionProgress}%
                        </span>
                      </div>
                      <Progress value={productionProgress} className="h-3" />
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        Estado actual: {productionStatus}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Actualizar Progreso
                      </Label>
                      <div className="grid grid-cols-5 gap-2">
                        {[0, 25, 50, 75, 100].map((progress) => (
                          <Button
                            key={progress}
                            size="sm"
                            variant={
                              productionProgress === progress
                                ? "default"
                                : "outline"
                            }
                            onClick={() => handleProductionUpdate(progress)}
                            className="text-xs"
                          >
                            {progress}%
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Estados de Producción
                      </Label>
                      <div className="space-y-1 text-xs">
                        <div
                          className={`p-2 rounded ${productionProgress >= 0 ? "bg-blue-50 text-blue-800" : "bg-gray-50 text-gray-600"}`}
                        >
                          <span className="font-medium">0%:</span> Pago
                          recibido, preparando materia prima
                        </div>
                        <div
                          className={`p-2 rounded ${productionProgress >= 25 ? "bg-blue-50 text-blue-800" : "bg-gray-50 text-gray-600"}`}
                        >
                          <span className="font-medium">25%:</span> Corte y
                          confección en marcha
                        </div>
                        <div
                          className={`p-2 rounded ${productionProgress >= 50 ? "bg-blue-50 text-blue-800" : "bg-gray-50 text-gray-600"}`}
                        >
                          <span className="font-medium">50%:</span> Embalaje en
                          proceso
                        </div>
                        <div
                          className={`p-2 rounded ${productionProgress >= 75 ? "bg-blue-50 text-blue-800" : "bg-gray-50 text-gray-600"}`}
                        >
                          <span className="font-medium">75%:</span> Paletas
                          listas, esperando transporte interno
                        </div>
                        <div
                          className={`p-2 rounded ${productionProgress === 100 ? "bg-green-50 text-green-800" : "bg-gray-50 text-gray-600"}`}
                        >
                          <span className="font-medium">100%:</span> Listo para
                          embarcar
                        </div>
                      </div>
                    </div>

                    {productionProgress === 100 && (
                      <div className="bg-green-50 border border-green-200 rounded-md p-4">
                        <div className="flex items-center gap-2 text-green-800 mb-2">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">
                            Producción Completada
                          </span>
                        </div>
                        <p className="text-sm text-green-700 mb-3">
                          La producción está lista para embarque. El comprador
                          será notificado.
                        </p>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Proceder a Embarque
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Payment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Resumen Financiero
                  </CardTitle>
                  {paymentReceived && (
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 w-fit"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Anticipo Recibido
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Precio por contenedor:
                    </span>
                    <span className="font-medium">
                      ${orderData.unitPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cantidad:</span>
                    <span className="font-medium">
                      {orderData.containerQuantity} contenedores
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">
                      ${orderData.totalAmount.toLocaleString()}{" "}
                      {orderData.currency}
                    </span>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Anticipo (30%):
                      </span>
                      <span className="font-medium text-orange-600">
                        ${orderData.advanceAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Saldo (70%):
                      </span>
                      <span className="font-medium">
                        ${orderData.balanceAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Vencimiento anticipo:{" "}
                      {orderData.advancePaymentDue.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Package className="h-4 w-4" />
                      Entrega estimada:{" "}
                      {orderData.estimatedDelivery.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    Condiciones: {orderData.paymentConditions}
                  </div>
                </CardContent>
              </Card>

              {/* Digital Signature Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Firma Digital
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orderData.digitalSignature.signed ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Firmado</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>
                          Firmado por: {orderData.digitalSignature.signedBy}
                        </p>
                        <p>
                          Fecha:{" "}
                          {orderData.digitalSignature.signedAt?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-orange-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">Pendiente de firma</span>
                      </div>
                      <Button className="w-full" size="sm">
                        Firmar Digitalmente
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Production Status Summary */}
              {paymentReceived && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Estado de Producción
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {productionProgress}%
                      </div>
                      <Progress
                        value={productionProgress}
                        className="h-2 mb-2"
                      />
                      <p className="text-sm text-gray-600">
                        {productionStatus}
                      </p>
                    </div>

                    {productionProgress === 100 ? (
                      <div className="bg-green-50 border border-green-200 rounded-md p-3 text-center">
                        <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
                        <p className="text-sm font-medium text-green-800">
                          Listo para Embarque
                        </p>
                      </div>
                    ) : (
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-center">
                        <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                        <p className="text-sm font-medium text-blue-800">
                          En Producción
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Descargar Orden PDF
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Contactar Comprador
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate("/supplier/orders")}
                  >
                    Ver Todas las Órdenes
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

export default SupplierOrderDetail;
