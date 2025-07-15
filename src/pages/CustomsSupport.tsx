import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FileText,
  Download,
  CheckCircle,
  Clock,
  Shield,
  Users,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  AlertCircle,
  Info,
  Truck,
  Package,
  FileCheck,
  Globe,
  DollarSign,
  Calendar,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Star,
  Award,
  Building2,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  type: "word" | "excel" | "pdf";
  downloadUrl: string;
  category: "instructions" | "authorization" | "checklist";
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "deadlines" | "procedures" | "documentation" | "costs";
  isExpanded?: boolean;
}

interface IrisConsultation {
  name: string;
  company: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  urgency: "low" | "medium" | "high";
}

function CustomsSupport() {
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [consultation, setConsultation] = useState<IrisConsultation>({
    name: "",
    company: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    urgency: "medium",
  });
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: "1",
      question: "¿Qué hago si mi contenedor supera los 60 días en ZLC?",
      answer:
        "Si su contenedor supera el plazo de 60 días en la Zona Libre de Colón, debe contactar inmediatamente a su operador logístico para evaluar las opciones disponibles. Las alternativas incluyen: 1) Solicitar extensión del plazo (sujeto a aprobación y costos adicionales), 2) Proceder con la reexportación inmediata, o 3) Iniciar el proceso de nacionalización si cumple con los requisitos. Es importante actuar rápidamente para evitar multas y recargos por almacenamiento prolongado.",
      category: "deadlines",
    },
    {
      id: "2",
      question:
        "¿Cómo demuestro que la mercancía no se destinará a consumo local?",
      answer:
        "Para demostrar que la mercancía no se destinará a consumo local en Panamá, debe presentar: 1) Declaración jurada de reexportación, 2) Factura comercial que indique claramente el destino final, 3) Conocimiento de embarque (B/L) con destino específico, 4) Carta de instrucciones al transportista especificando el destino final, y 5) En algunos casos, garantía bancaria o fianza que respalde la reexportación dentro del plazo establecido.",
      category: "procedures",
    },
    {
      id: "3",
      question: "¿Diferencia entre reexportar y nacionalizar en destino?",
      answer:
        "REEXPORTAR: La mercancía sale de ZLC hacia el país de destino sin pagar aranceles en Panamá, manteniendo su condición de tránsito. En destino, se pagan los aranceles locales según las tarifas del país receptor. NACIONALIZAR: La mercancía se considera importada definitivamente en Panamá, pagando aranceles panameños, y luego se exporta como producto panameño (puede tener beneficios arancelarios según tratados comerciales).",
      category: "procedures",
    },
    {
      id: "4",
      question: "¿Qué certificados de calidad son obligatorios?",
      answer:
        "Los certificados obligatorios dependen del tipo de producto y país de destino: ALIMENTOS: Certificado sanitario, HACCP, FDA (si va a USA). TEXTILES: Certificado de origen, etiquetado de composición. ELECTRÓNICOS: CE, FCC, certificados de conformidad. QUÍMICOS: Hojas de seguridad (MSDS), certificados de pureza. MEDICAMENTOS: Certificados farmacéuticos, registro sanitario. Consulte con Iris para requisitos específicos de su producto y destino.",
      category: "documentation",
    },
    {
      id: "5",
      question: "¿Cuáles son los costos adicionales en ZLC?",
      answer:
        "Los costos adicionales en ZLC incluyen: ALMACENAJE: $15-25 por contenedor por día después de los primeros 5 días gratuitos. MANIPULACIÓN: $150-250 por contenedor para carga/descarga. DOCUMENTACIÓN: $50-100 por trámite documental. INSPECCIÓN: $200-400 si requiere inspección especial. DEMORAS: $25-50 por día por demoras en documentación. SERVICIOS ESPECIALES: Custodia ($100/día), refrigeración ($50-100/día), consolidación ($300-500).",
      category: "costs",
    },
    {
      id: "6",
      question: "¿Cómo verifico el status de mi contenedor en ZLC?",
      answer:
        "Para verificar el status de su contenedor: 1) Use el sistema de tracking de ZLC Express con su número de contenedor, 2) Contacte a su operador logístico asignado, 3) Acceda al portal web de la Zona Libre con sus credenciales, 4) Solicite reporte de status a través del formulario de consulta a Iris, o 5) Llame al centro de atención al cliente al +507 430-7000 ext. 2800. El tracking incluye: ubicación exacta, documentos pendientes, costos acumulados y fecha límite de estadía.",
      category: "procedures",
    },
  ]);

  const documentTemplates: DocumentTemplate[] = [
    {
      id: "1",
      name: "Carta de Instrucciones al Transportista",
      description:
        "Formato estándar para dar instrucciones específicas al operador logístico en ZLC",
      type: "word",
      downloadUrl: "/templates/carta_instrucciones_transportista.docx",
      category: "instructions",
    },
    {
      id: "2",
      name: "Autorización para Retiro de Contenedor",
      description:
        "Formato oficial para autorizar el retiro de contenedores de ZLC",
      type: "word",
      downloadUrl: "/templates/autorizacion_retiro_contenedor.docx",
      category: "authorization",
    },
    {
      id: "3",
      name: "Checklist Documentos de Importación",
      description:
        "Lista completa de documentos necesarios para importación desde ZLC",
      type: "excel",
      downloadUrl: "/templates/checklist_documentos_importacion.xlsx",
      category: "checklist",
    },
    {
      id: "4",
      name: "Declaración de Reexportación",
      description: "Formato para declarar que la mercancía será reexportada",
      type: "word",
      downloadUrl: "/templates/declaracion_reexportacion.docx",
      category: "instructions",
    },
    {
      id: "5",
      name: "Formulario de Extensión de Plazo",
      description: "Solicitud formal para extender el tiempo de estadía en ZLC",
      type: "word",
      downloadUrl: "/templates/extension_plazo_zlc.docx",
      category: "authorization",
    },
  ];

  const importSteps = [
    {
      id: 1,
      title: "Preparar Carga en ZLC",
      description: "Coordinación con operador logístico",
      details: [
        "Verificar llegada del contenedor a ZLC",
        "Coordinar descarga con operador logístico asignado",
        "Inspeccionar estado físico del contenedor",
        "Verificar documentos de transporte (B/L, manifesto)",
        "Confirmar ubicación de almacenaje en ZLC",
        "Establecer cronograma de manipulación de carga",
      ],
      documents: ["Bill of Lading", "Manifiesto de Carga", "Orden de Descarga"],
      estimatedTime: "1-2 días",
    },
    {
      id: 2,
      title: "Revisar Documentos con Iris",
      description: "Validación documental especializada",
      details: [
        "Revisión de factura comercial (proforma y final)",
        "Verificación de certificados de origen",
        "Validación de packing list detallado",
        "Confirmación de certificados de calidad",
        "Revisión de documentos del importador",
        "Identificación de documentos faltantes",
      ],
      documents: [
        "Factura Comercial",
        "Certificado de Origen",
        "Packing List",
        "Certificados de Calidad",
      ],
      estimatedTime: "2-4 horas",
    },
    {
      id: 3,
      title: "Retiro del Contenedor en ZLC",
      description: "Trámites y formularios necesarios",
      details: [
        "Presentar autorización de retiro firmada",
        "Entregar carta de instrucciones al transportista",
        "Coordinar transporte hacia destino final",
        "Obtener sello de salida de ZLC",
        "Confirmar documentos de tránsito",
        "Programar seguimiento de ruta",
      ],
      documents: [
        "Autorización de Retiro",
        "Carta de Instrucciones",
        "Documentos de Tránsito",
      ],
      estimatedTime: "4-6 horas",
    },
    {
      id: 4,
      title: "Trámite en Destino",
      description: "Reexportar vs. nacionalizar, aranceles",
      details: [
        "Decidir entre reexportación o nacionalización",
        "Calcular aranceles del país destino",
        "Presentar documentos en aduana de destino",
        "Pagar impuestos y aranceles correspondientes",
        "Obtener liberación de mercancía",
        "Coordinar entrega final al cliente",
      ],
      documents: [
        "Declaración Aduanera",
        "Comprobantes de Pago",
        "Documentos de Liberación",
      ],
      estimatedTime: "1-3 días",
    },
  ];

  const requiredDocuments = [
    {
      name: "Factura Comercial (Proforma y Final)",
      description:
        "Documento que detalla los productos, cantidades, precios y términos comerciales",
      mandatory: true,
      deadline: "Antes del despacho",
    },
    {
      name: "Packing List (Lista de Empaque)",
      description:
        "Detalle específico del contenido, peso y dimensiones de cada bulto",
      mandatory: true,
      deadline: "Antes del despacho",
    },
    {
      name: "Certificado de Origen (CO)",
      description: "Documento que certifica el país de origen de la mercancía",
      mandatory: true,
      deadline: "Antes del despacho",
    },
    {
      name: "Certificados de Calidad (ISO, FDA, etc.)",
      description:
        "Certificaciones específicas según el tipo de producto y destino",
      mandatory: false,
      deadline: "Según regulaciones del destino",
    },
    {
      name: "Bill of Lading (Conocimiento de Embarque)",
      description:
        "Documento de transporte que prueba la recepción de la mercancía",
      mandatory: true,
      deadline: "Al momento del transporte",
    },
    {
      name: "Registro de Importador en País Destino",
      description: "Documentos que acrediten la capacidad legal para importar",
      mandatory: true,
      deadline: "Antes de llegada a destino",
    },
  ];

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate email generation
    alert(
      `Consulta enviada a Iris!\n\nResumen:\nEmpresa: ${consultation.company}\nAsunto: ${consultation.subject}\nUrgencia: ${consultation.urgency}\n\nIris te contactará en las próximas 2-4 horas.`,
    );
    setConsultation({
      name: "",
      company: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      urgency: "medium",
    });
  };

  const toggleFAQ = (id: string) => {
    setFaqs((prev) =>
      prev.map((faq) =>
        faq.id === id ? { ...faq, isExpanded: !faq.isExpanded } : faq,
      ),
    );
  };

  const getFileIcon = (type: DocumentTemplate["type"]) => {
    switch (type) {
      case "word":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "excel":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: FAQ["category"]) => {
    switch (category) {
      case "deadlines":
        return "bg-red-100 text-red-800";
      case "procedures":
        return "bg-blue-100 text-blue-800";
      case "documentation":
        return "bg-green-100 text-green-800";
      case "costs":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-14 sm:pt-16 md:pt-20">
        <div className="container mx-auto p-6 space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Aduana ZLC</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Centro de apoyo especializado para trámites aduaneros y
              documentación en la Zona Libre de Colón
            </p>
          </div>

          {/* ZLC Advantages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-amber-600" />
                Ventajas de la Zona Libre de Colón
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    Exención de Impuestos
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Mercancías en tránsito libres de aranceles y impuestos
                    durante su estadía en ZLC
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    Plazos Flexibles
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Hasta 60 días de almacenaje sin reexportar, extensible bajo
                    condiciones especiales
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Globe className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Hub Logístico</h3>
                  <p className="text-gray-600 text-sm">
                    Posición estratégica para distribución hacia toda América
                    Latina y el Caribe
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-700 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-900">
                      Plazo Máximo Importante
                    </h4>
                    <p className="text-sm text-amber-800">
                      Las mercancías pueden permanecer hasta{" "}
                      <strong>60 días en ZLC sin reexportar</strong>. Después de
                      este período, se requiere extensión especial o
                      nacionalización inmediata para evitar multas y recargos.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meet Iris */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-500" />
                Conoce a Iris - Tu Asesora Aduanera
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-shrink-0">
                  <Avatar className="w-32 h-32">
                    <AvatarImage
                      src="/images/iris-advisor.jpg"
                      alt="Iris Morales"
                    />
                    <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      IM
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Iris Morales
                  </h3>
                  <p className="text-lg text-blue-600 mb-3">
                    Asesora Aduanera Senior • 12 años de experiencia
                  </p>
                  <p className="text-gray-600 mb-4">
                    Especialista en comercio internacional con amplia
                    experiencia en trámites aduaneros de la Zona Libre de Colón.
                    Iris te ayudará a navegar los procesos de
                    importación/exportación, garantizando el cumplimiento de
                    todas las regulaciones y optimizando los tiempos de
                    despacho.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">
                      Certificada en Comercio Internacional
                    </Badge>
                    <Badge variant="secondary">
                      Experta en Documentación Aduanera
                    </Badge>
                    <Badge variant="secondary">Especialista ZLC</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>+507 430-7000 ext. 2850</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>iris.morales@zlcexpress.com</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-600" />
                      <span>4.9/5 Calificación Cliente</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Required Documents Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-6 w-6 text-green-500" />
                  Checklist de Documentos Necesarios
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PDF
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requiredDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 border rounded-lg"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {doc.mandatory ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Info className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {doc.name}
                        </h4>
                        <Badge
                          variant={doc.mandatory ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {doc.mandatory ? "Obligatorio" : "Opcional"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {doc.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>Plazo: {doc.deadline}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Step-by-Step Import Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-6 w-6 text-blue-500" />
                Guía Paso a Paso de Importación desde ZLC
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Steps Navigation */}
                <div className="lg:w-1/3">
                  <div className="space-y-2">
                    {importSteps.map((step) => (
                      <button
                        key={step.id}
                        onClick={() => setSelectedStep(step.id)}
                        className={`w-full text-left p-4 rounded-lg border transition-colors ${
                          selectedStep === step.id
                            ? "bg-blue-50 border-blue-200"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              selectedStep === step.id
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {step.id}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {step.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step Details */}
                <div className="lg:w-2/3">
                  {selectedStep && (
                    <div className="space-y-6">
                      {(() => {
                        const step = importSteps.find(
                          (s) => s.id === selectedStep,
                        );
                        if (!step) return null;

                        return (
                          <>
                            <div>
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                  {step.id}
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900">
                                    {step.title}
                                  </h3>
                                  <p className="text-gray-600">
                                    {step.description}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 mb-6">
                                <Badge
                                  variant="outline"
                                  className="flex items-center gap-1"
                                >
                                  <Clock className="h-3 w-3" />
                                  {step.estimatedTime}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="flex items-center gap-1"
                                >
                                  <FileText className="h-3 w-3" />
                                  {step.documents.length} documentos
                                </Badge>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">
                                Actividades Detalladas:
                              </h4>
                              <div className="space-y-2">
                                {step.details.map((detail, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">
                                      {detail}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">
                                Documentos Requeridos:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {step.documents.map((doc, index) => (
                                  <Badge key={index} variant="secondary">
                                    {doc}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {step.id === 2 && (
                              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                  <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                                  <div>
                                    <h4 className="font-medium text-blue-800">
                                      Consulta con Iris
                                    </h4>
                                    <p className="text-sm text-blue-700">
                                      Este paso incluye una revisión
                                      personalizada con nuestra asesora
                                      aduanera. Iris verificará todos los
                                      documentos y te guiará en los próximos
                                      pasos.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Templates and Consultation Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Downloadable Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-6 w-6 text-green-500" />
                  Plantillas Descargables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documentTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(template.type)}
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {template.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {template.description}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(template.downloadUrl, "_blank")
                        }
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Iris Consultation Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-blue-500" />
                  Enviar Consulta a Iris
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleConsultationSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre Completo *</Label>
                      <Input
                        id="name"
                        value={consultation.name}
                        onChange={(e) =>
                          setConsultation((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Empresa *</Label>
                      <Input
                        id="company"
                        value={consultation.company}
                        onChange={(e) =>
                          setConsultation((prev) => ({
                            ...prev,
                            company: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={consultation.email}
                        onChange={(e) =>
                          setConsultation((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={consultation.phone}
                        onChange={(e) =>
                          setConsultation((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Asunto *</Label>
                    <Input
                      id="subject"
                      value={consultation.subject}
                      onChange={(e) =>
                        setConsultation((prev) => ({
                          ...prev,
                          subject: e.target.value,
                        }))
                      }
                      placeholder="Ej: Consulta sobre documentos para importación de café"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="urgency">Urgencia</Label>
                    <select
                      id="urgency"
                      value={consultation.urgency}
                      onChange={(e) =>
                        setConsultation((prev) => ({
                          ...prev,
                          urgency: e.target
                            .value as IrisConsultation["urgency"],
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="low">Baja (respuesta en 24 hrs)</option>
                      <option value="medium">Media (respuesta en 4 hrs)</option>
                      <option value="high">Alta (respuesta en 2 hrs)</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message">Mensaje *</Label>
                    <Textarea
                      id="message"
                      value={consultation.message}
                      onChange={(e) =>
                        setConsultation((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      placeholder="Describe tu consulta en detalle..."
                      rows={4}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      !consultation.name ||
                      !consultation.company ||
                      !consultation.email ||
                      !consultation.subject ||
                      !consultation.message
                    }
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar Consulta a Iris
                  </Button>
                </form>

                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div className="text-sm text-green-700">
                      <strong>Tiempo de respuesta garantizado:</strong> Iris
                      responderá tu consulta según la urgencia seleccionada.
                      Todas las consultas incluyen seguimiento personalizado.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-purple-500" />
                Preguntas Frecuentes Aduaneras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.id} className="border rounded-lg">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge
                            className={`text-xs ${getCategoryColor(faq.category)}`}
                          >
                            {faq.category}
                          </Badge>
                          <h4 className="font-medium text-gray-900">
                            {faq.question}
                          </h4>
                        </div>
                        {faq.isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </button>
                    {faq.isExpanded && (
                      <div className="px-4 pb-4">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-3">
                  ¿No encuentras la respuesta que buscas?
                </p>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Consultar con Iris
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-blue-500" />
                Contacto y Horarios de Atención
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Phone className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Centro de Atenci��n</h3>
                  <p className="text-sm text-gray-600">+507 430-7000</p>
                  <p className="text-sm text-gray-600">Ext. 2800 (General)</p>
                  <p className="text-sm text-gray-600">Ext. 2850 (Iris)</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-sm text-gray-600">aduana@zlcexpress.com</p>
                  <p className="text-sm text-gray-600">
                    iris.morales@zlcexpress.com
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Horarios</h3>
                  <p className="text-sm text-gray-600">
                    Lun - Vie: 7:00 AM - 6:00 PM
                  </p>
                  <p className="text-sm text-gray-600">
                    Sáb: 8:00 AM - 2:00 PM
                  </p>
                  <p className="text-sm text-gray-600">Emergencias: 24/7</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default CustomsSupport;
