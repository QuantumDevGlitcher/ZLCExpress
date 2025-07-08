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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Upload,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Award,
  Ship,
  Package,
  Calendar,
  Eye,
  Plus,
  RefreshCw,
  AlertCircle,
  FileCheck,
  FilePlus,
  History,
  Shield,
} from "lucide-react";

interface CustomsDocument {
  id: string;
  type:
    | "zlc_license"
    | "certificate_origin"
    | "commercial_invoice_proforma"
    | "commercial_invoice_final"
    | "packing_list_preliminary"
    | "packing_list_final"
    | "bill_of_lading";
  title: string;
  description: string;
  required: boolean;
  status: "missing" | "under_review" | "approved" | "rejected";
  fileName?: string;
  uploadedAt?: Date;
  approvedAt?: Date;
  expiresAt?: Date;
  inspectorComments?: string;
  version: number;
  fileUrl?: string;
  isGenerated?: boolean;
  orderId?: string;
}

interface DocumentHistory {
  id: string;
  documentId: string;
  version: number;
  fileName: string;
  uploadedAt: Date;
  status: string;
  comments?: string;
  uploadedBy: string;
}

interface PreShipmentItem {
  document: string;
  required: boolean;
  status: "complete" | "pending" | "missing";
  lastUpdate?: Date;
}

const SupplierCustoms = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<
    "documents" | "generate" | "checklist" | "history"
  >("documents");
  const [selectedDocument, setSelectedDocument] =
    useState<CustomsDocument | null>(null);
  const [uploadingDocument, setUploadingDocument] = useState<string | null>(
    null,
  );

  // Mock customs documents data
  const [customsDocuments, setCustomsDocuments] = useState<CustomsDocument[]>([
    {
      id: "doc-1",
      type: "zlc_license",
      title: "Licencia ZLC",
      description: "Licencia de operación en Zona Franca",
      required: true,
      status: "approved",
      fileName: "Licencia_ZLC_2024.pdf",
      uploadedAt: new Date("2024-01-15"),
      approvedAt: new Date("2024-01-16"),
      expiresAt: new Date("2024-12-31"),
      version: 1,
      fileUrl: "#",
    },
    {
      id: "doc-2",
      type: "certificate_origin",
      title: "Certificado de Origen",
      description: "Certificado de origen para productos textiles",
      required: true,
      status: "approved",
      fileName: "CO_Textiles_2024.pdf",
      uploadedAt: new Date("2024-02-01"),
      approvedAt: new Date("2024-02-02"),
      expiresAt: new Date("2024-08-01"),
      version: 2,
      fileUrl: "#",
    },
    {
      id: "doc-3",
      type: "commercial_invoice_proforma",
      title: "Factura Comercial Proforma",
      description: "Factura proforma para orden PO-2024-001",
      required: true,
      status: "under_review",
      fileName: "Proforma_PO-2024-001.pdf",
      uploadedAt: new Date("2024-02-20"),
      version: 1,
      orderId: "PO-2024-001",
      isGenerated: true,
    },
    {
      id: "doc-4",
      type: "packing_list_preliminary",
      title: "Packing List Preliminar",
      description: "Lista de empaque preliminar",
      required: true,
      status: "rejected",
      fileName: "PackingList_Preliminar.xlsx",
      uploadedAt: new Date("2024-02-18"),
      inspectorComments:
        "Falta especificar peso neto por caja. Revisar unidades en paleta 3.",
      version: 1,
      orderId: "PO-2024-001",
    },
    {
      id: "doc-5",
      type: "bill_of_lading",
      title: "Bill of Lading",
      description: "Conocimiento de embarque",
      required: true,
      status: "missing",
      version: 0,
    },
  ]);

  // Mock document history
  const documentHistory: DocumentHistory[] = [
    {
      id: "hist-1",
      documentId: "doc-2",
      version: 1,
      fileName: "CO_Textiles_2023.pdf",
      uploadedAt: new Date("2023-08-01"),
      status: "approved",
      uploadedBy: "María Rodríguez",
    },
    {
      id: "hist-2",
      documentId: "doc-2",
      version: 2,
      fileName: "CO_Textiles_2024.pdf",
      uploadedAt: new Date("2024-02-01"),
      status: "approved",
      comments: "Actualización por nuevo período",
      uploadedBy: "María Rodríguez",
    },
    {
      id: "hist-3",
      documentId: "doc-4",
      version: 1,
      fileName: "PackingList_Preliminar.xlsx",
      uploadedAt: new Date("2024-02-18"),
      status: "rejected",
      comments:
        "Falta especificar peso neto por caja. Revisar unidades en paleta 3.",
      uploadedBy: "Carlos Jiménez",
    },
  ];

  // Mock pre-shipment checklist
  const preShipmentChecklist: PreShipmentItem[] = [
    {
      document: "Licencia ZLC Vigente",
      required: true,
      status: "complete",
      lastUpdate: new Date("2024-01-16"),
    },
    {
      document: "Certificado de Origen",
      required: true,
      status: "complete",
      lastUpdate: new Date("2024-02-02"),
    },
    {
      document: "Factura Comercial Final",
      required: true,
      status: "pending",
    },
    {
      document: "Packing List Final",
      required: true,
      status: "missing",
    },
    {
      document: "Bill of Lading",
      required: true,
      status: "missing",
    },
    {
      document: "Certificado de Calidad",
      required: false,
      status: "complete",
      lastUpdate: new Date("2024-02-10"),
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "under_review":
        return "secondary";
      case "rejected":
        return "destructive";
      case "missing":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "Aprobado";
      case "under_review":
        return "En Revisión";
      case "rejected":
        return "Rechazado";
      case "missing":
        return "Faltante";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "under_review":
        return <Clock className="h-4 w-4" />;
      case "rejected":
        return <X className="h-4 w-4" />;
      case "missing":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case "zlc_license":
        return <Shield className="h-5 w-5" />;
      case "certificate_origin":
        return <Award className="h-5 w-5" />;
      case "commercial_invoice_proforma":
      case "commercial_invoice_final":
        return <FileText className="h-5 w-5" />;
      case "packing_list_preliminary":
      case "packing_list_final":
        return <Package className="h-5 w-5" />;
      case "bill_of_lading":
        return <Ship className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const handleFileUpload = (documentId: string, file: File) => {
    setUploadingDocument(documentId);

    // Simulate file upload
    setTimeout(() => {
      setCustomsDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId
            ? {
                ...doc,
                status: "under_review",
                fileName: file.name,
                uploadedAt: new Date(),
                version: doc.version + 1,
                fileUrl: "#",
              }
            : doc,
        ),
      );

      setUploadingDocument(null);

      toast({
        title: "Documento Subido",
        description: `${file.name} se ha subido correctamente y está en revisión.`,
      });
    }, 2000);
  };

  const handleGenerateDocument = (documentType: string, orderId?: string) => {
    toast({
      title: "Generando Documento",
      description: `Generando ${documentType} automáticamente...`,
    });

    // Simulate document generation
    setTimeout(() => {
      const newDoc: CustomsDocument = {
        id: `generated-${Date.now()}`,
        type: documentType as any,
        title: `${documentType} - ${orderId || "Auto"}`,
        description: `Documento generado automáticamente`,
        required: true,
        status: "under_review",
        fileName: `${documentType}_${orderId || "generated"}.pdf`,
        uploadedAt: new Date(),
        version: 1,
        isGenerated: true,
        orderId,
        fileUrl: "#",
      };

      setCustomsDocuments((prev) => [...prev, newDoc]);

      toast({
        title: "Documento Generado",
        description: `${documentType} ha sido generado y subido para revisión.`,
      });
    }, 2500);
  };

  const getCompletionPercentage = () => {
    const total = customsDocuments.filter((doc) => doc.required).length;
    const approved = customsDocuments.filter(
      (doc) => doc.required && doc.status === "approved",
    ).length;
    return total > 0 ? Math.round((approved / total) * 100) : 0;
  };

  const getExpiringDocuments = () => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return customsDocuments.filter(
      (doc) =>
        doc.expiresAt &&
        doc.expiresAt <= thirtyDaysFromNow &&
        doc.status === "approved",
    );
  };

  const getPreShipmentCompletionPercentage = () => {
    const required = preShipmentChecklist.filter((item) => item.required);
    const complete = required.filter((item) => item.status === "complete");
    return required.length > 0
      ? Math.round((complete.length / required.length) * 100)
      : 0;
  };

  const approvedDocs = customsDocuments.filter(
    (doc) => doc.status === "approved",
  ).length;
  const pendingDocs = customsDocuments.filter(
    (doc) => doc.status === "under_review",
  ).length;
  const rejectedDocs = customsDocuments.filter(
    (doc) => doc.status === "rejected",
  ).length;
  const expiringDocs = getExpiringDocuments().length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-14 sm:pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Aduana y Documentos
              </h1>
              <Button variant="outline" asChild>
                <Link to="/supplier/dashboard">← Volver al Panel</Link>
              </Button>
            </div>
            <p className="text-gray-600">
              Gestiona todos los documentos requeridos para validación aduanera
              y exportaciones
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Aprobados</p>
                    <p className="text-2xl font-bold text-green-600">
                      {approvedDocs}
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
                    <p className="text-sm text-gray-600">En Revisión</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {pendingDocs}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Rechazados</p>
                    <p className="text-2xl font-bold text-red-600">
                      {rejectedDocs}
                    </p>
                  </div>
                  <X className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Por Vencer</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {expiringDocs}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Card */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Progreso de Documentación</h3>
                <span className="text-sm font-medium">
                  {getCompletionPercentage()}% completo
                </span>
              </div>
              <Progress value={getCompletionPercentage()} className="h-2" />
              <p className="text-sm text-gray-600 mt-2">
                {approvedDocs} de{" "}
                {customsDocuments.filter((doc) => doc.required).length}{" "}
                documentos obligatorios aprobados
              </p>
            </CardContent>
          </Card>

          {/* Notifications */}
          {expiringDocs > 0 && (
            <Card className="mb-6 border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-900">
                      Documentos Próximos a Vencer
                    </h4>
                    <p className="text-sm text-orange-800 mt-1">
                      {expiringDocs} documento(s) vencen en los próximos 30
                      días. Renueva antes del vencimiento para evitar
                      interrupciones.
                    </p>
                    <div className="mt-2">
                      {getExpiringDocuments().map((doc) => (
                        <p key={doc.id} className="text-xs text-orange-700">
                          • {doc.title} - Vence:{" "}
                          {doc.expiresAt?.toLocaleDateString()}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab Navigation */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activeTab === "documents" ? "default" : "outline"}
                  onClick={() => setActiveTab("documents")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Mis Documentos
                </Button>
                <Button
                  variant={activeTab === "generate" ? "default" : "outline"}
                  onClick={() => setActiveTab("generate")}
                >
                  <FilePlus className="h-4 w-4 mr-2" />
                  Generar Documentos
                </Button>
                <Button
                  variant={activeTab === "checklist" ? "default" : "outline"}
                  onClick={() => setActiveTab("checklist")}
                >
                  <FileCheck className="h-4 w-4 mr-2" />
                  Checklist Pre-Embarque
                </Button>
                <Button
                  variant={activeTab === "history" ? "default" : "outline"}
                  onClick={() => setActiveTab("history")}
                >
                  <History className="h-4 w-4 mr-2" />
                  Historial
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Documents List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Documentos Aduaneros ({customsDocuments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {customsDocuments.map((document) => (
                        <div
                          key={document.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedDocument?.id === document.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedDocument(document)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              {getDocumentTypeIcon(document.type)}
                              <div>
                                <h4 className="font-medium">
                                  {document.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {document.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {document.required && (
                                <Badge variant="secondary" className="text-xs">
                                  Obligatorio
                                </Badge>
                              )}
                              <Badge
                                variant={getStatusVariant(document.status)}
                              >
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(document.status)}
                                  {getStatusLabel(document.status)}
                                </div>
                              </Badge>
                            </div>
                          </div>

                          {document.fileName && (
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2 text-sm">
                                <FileText className="h-4 w-4 text-gray-400" />
                                <span>{document.fileName}</span>
                                <span className="text-gray-500">
                                  v{document.version}
                                </span>
                                {document.isGenerated && (
                                  <Badge variant="outline" className="text-xs">
                                    Generado
                                  </Badge>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Ver
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Download className="h-3 w-3 mr-1" />
                                  Descargar
                                </Button>
                              </div>
                            </div>
                          )}

                          {document.status === "missing" && (
                            <div className="mt-3 border-2 border-dashed border-gray-300 rounded-md p-3">
                              <div className="text-center">
                                {uploadingDocument === document.id ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                    <span className="text-sm text-gray-600">
                                      Subiendo archivo...
                                    </span>
                                  </div>
                                ) : (
                                  <>
                                    <Upload className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                                    <Input
                                      type="file"
                                      accept=".pdf,.doc,.docx,.xlsx,.xls"
                                      className="hidden"
                                      id={`file-${document.id}`}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          handleFileUpload(document.id, file);
                                        }
                                      }}
                                    />
                                    <Label
                                      htmlFor={`file-${document.id}`}
                                      className="cursor-pointer"
                                    >
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                      >
                                        <span>Subir Documento</span>
                                      </Button>
                                    </Label>
                                  </>
                                )}
                              </div>
                            </div>
                          )}

                          {document.status === "rejected" &&
                            document.inspectorComments && (
                              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                                <div className="flex items-start gap-2">
                                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium text-red-900">
                                      Comentarios del Inspector
                                    </p>
                                    <p className="text-sm text-red-800 mt-1">
                                      {document.inspectorComments}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  className="mt-2 bg-red-600 hover:bg-red-700"
                                >
                                  <Upload className="h-3 w-3 mr-1" />
                                  Subir Corrección
                                </Button>
                              </div>
                            )}

                          {document.expiresAt &&
                            document.status === "approved" && (
                              <div className="mt-3 flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">
                                  Válido hasta:{" "}
                                  {document.expiresAt.toLocaleDateString()}
                                </span>
                                {document.expiresAt <=
                                  new Date(
                                    Date.now() + 30 * 24 * 60 * 60 * 1000,
                                  ) && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    Próximo a vencer
                                  </Badge>
                                )}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Document Details Sidebar */}
              <div>
                {selectedDocument ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {getDocumentTypeIcon(selectedDocument.type)}
                        Detalles del Documento
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Documento
                        </Label>
                        <p className="font-medium">{selectedDocument.title}</p>
                        <p className="text-sm text-gray-600">
                          {selectedDocument.description}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Estado
                        </Label>
                        <div className="mt-1">
                          <Badge
                            variant={getStatusVariant(selectedDocument.status)}
                          >
                            <div className="flex items-center gap-1">
                              {getStatusIcon(selectedDocument.status)}
                              {getStatusLabel(selectedDocument.status)}
                            </div>
                          </Badge>
                        </div>
                      </div>

                      {selectedDocument.fileName && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600">
                            Archivo Actual
                          </Label>
                          <p className="font-medium">
                            {selectedDocument.fileName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Versión {selectedDocument.version}
                          </p>
                        </div>
                      )}

                      {selectedDocument.uploadedAt && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600">
                            Fecha de Subida
                          </Label>
                          <p className="font-medium">
                            {selectedDocument.uploadedAt.toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {selectedDocument.approvedAt && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600">
                            Fecha de Aprobación
                          </Label>
                          <p className="font-medium">
                            {selectedDocument.approvedAt.toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {selectedDocument.expiresAt && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600">
                            Fecha de Vencimiento
                          </Label>
                          <p className="font-medium">
                            {selectedDocument.expiresAt.toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {selectedDocument.orderId && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600">
                            Orden Asociada
                          </Label>
                          <p className="font-medium">
                            {selectedDocument.orderId}
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Button className="w-full" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Descargar PDF
                        </Button>
                        {selectedDocument.status === "rejected" && (
                          <Button className="w-full">
                            <Upload className="h-4 w-4 mr-2" />
                            Subir Corrección
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Selecciona un documento para ver los detalles
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Generate Documents Tab */}
          {activeTab === "generate" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FilePlus className="h-5 w-5" />
                  Generación Automática de Documentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Ship className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Bill of Lading (BL)</h4>
                        <p className="text-sm text-gray-600">
                          Generar conocimiento de embarque
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="bl-order">Orden Proforma</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar orden" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PO-2024-001">
                              PO-2024-001 - Comercial Los Andes
                            </SelectItem>
                            <SelectItem value="PO-2024-002">
                              PO-2024-002 - Textiles del Pacífico
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() =>
                          handleGenerateDocument(
                            "bill_of_lading",
                            "PO-2024-001",
                          )
                        }
                      >
                        <FilePlus className="h-4 w-4 mr-2" />
                        Generar BL
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Package className="h-8 w-8 text-green-600" />
                      <div>
                        <h4 className="font-medium">Packing List Final</h4>
                        <p className="text-sm text-gray-600">
                          Lista de empaque definitiva
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="pl-order">Orden Proforma</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar orden" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PO-2024-001">
                              PO-2024-001 - Comercial Los Andes
                            </SelectItem>
                            <SelectItem value="PO-2024-002">
                              PO-2024-002 - Textiles del Pacífico
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() =>
                          handleGenerateDocument(
                            "packing_list_final",
                            "PO-2024-001",
                          )
                        }
                      >
                        <FilePlus className="h-4 w-4 mr-2" />
                        Generar Packing List
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="h-8 w-8 text-purple-600" />
                      <div>
                        <h4 className="font-medium">Factura Comercial Final</h4>
                        <p className="text-sm text-gray-600">
                          Factura comercial definitiva
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="invoice-order">Orden Proforma</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar orden" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PO-2024-001">
                              PO-2024-001 - Comercial Los Andes
                            </SelectItem>
                            <SelectItem value="PO-2024-002">
                              PO-2024-002 - Textiles del Pacífico
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() =>
                          handleGenerateDocument(
                            "commercial_invoice_final",
                            "PO-2024-001",
                          )
                        }
                      >
                        <FilePlus className="h-4 w-4 mr-2" />
                        Generar Factura
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Award className="h-8 w-8 text-orange-600" />
                      <div>
                        <h4 className="font-medium">Certificado de Origen</h4>
                        <p className="text-sm text-gray-600">
                          CO a partir de datos de la orden
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="co-order">Orden Proforma</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar orden" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PO-2024-001">
                              PO-2024-001 - Comercial Los Andes
                            </SelectItem>
                            <SelectItem value="PO-2024-002">
                              PO-2024-002 - Textiles del Pacífico
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() =>
                          handleGenerateDocument(
                            "certificate_origin",
                            "PO-2024-001",
                          )
                        }
                      >
                        <FilePlus className="h-4 w-4 mr-2" />
                        Generar CO
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <RefreshCw className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">
                        Generación Automática
                      </h4>
                      <p className="text-sm text-blue-800 mt-1">
                        Los documentos se generan automáticamente utilizando los
                        datos de las órdenes proforma. Una vez generados, se
                        envían automáticamente para revisión aduanera.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pre-shipment Checklist Tab */}
          {activeTab === "checklist" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5" />
                    Checklist Pre-Embarque
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {getPreShipmentCompletionPercentage()}% completo
                    </span>
                    <Progress
                      value={getPreShipmentCompletionPercentage()}
                      className="w-24 h-2"
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {preShipmentChecklist.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {item.status === "complete" && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {item.status === "pending" && (
                          <Clock className="h-5 w-5 text-orange-600" />
                        )}
                        {item.status === "missing" && (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        )}
                        <div>
                          <h4 className="font-medium">{item.document}</h4>
                          {item.lastUpdate && (
                            <p className="text-sm text-gray-600">
                              Actualizado:{" "}
                              {item.lastUpdate.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.required && (
                          <Badge variant="secondary" className="text-xs">
                            Obligatorio
                          </Badge>
                        )}
                        <Badge
                          variant={
                            item.status === "complete"
                              ? "default"
                              : item.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {item.status === "complete" && "Completo"}
                          {item.status === "pending" && "Pendiente"}
                          {item.status === "missing" && "Faltante"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">
                    Requisitos por Tipo de Producto
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium text-gray-900">Textiles</h5>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Certificado de Origen</li>
                        <li>• Factura Comercial</li>
                        <li>• Packing List detallado</li>
                        <li>• Certificado de calidad (opcional)</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">
                        Todos los Productos
                      </h5>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Licencia ZLC vigente</li>
                        <li>• Bill of Lading</li>
                        <li>• Documentos de embarque</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Historial Documental
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Documento</TableHead>
                        <TableHead>Versión</TableHead>
                        <TableHead>Archivo</TableHead>
                        <TableHead>Fecha Subida</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Subido por</TableHead>
                        <TableHead>Comentarios</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documentHistory.map((history) => {
                        const document = customsDocuments.find(
                          (doc) => doc.id === history.documentId,
                        );
                        return (
                          <TableRow key={history.id}>
                            <TableCell className="font-medium">
                              {document?.title || "Documento eliminado"}
                            </TableCell>
                            <TableCell>v{history.version}</TableCell>
                            <TableCell>{history.fileName}</TableCell>
                            <TableCell>
                              {history.uploadedAt.toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusVariant(history.status)}>
                                {getStatusLabel(history.status)}
                              </Badge>
                            </TableCell>
                            <TableCell>{history.uploadedBy}</TableCell>
                            <TableCell>
                              <div className="max-w-xs truncate">
                                {history.comments || "—"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline">
                                <Download className="h-3 w-3 mr-1" />
                                Descargar
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierCustoms;
