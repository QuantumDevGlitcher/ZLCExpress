import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileText,
  Package,
  FileSpreadsheet,
  FileCheck,
  Info,
  BookOpen,
  Calculator,
} from "lucide-react";

interface DocumentDownloadsProps {
  lotId: string;
}

const documents = [
  {
    id: "commercial-invoice",
    name: "Factura Comercial Proforma",
    description: "Documento proforma para evaluación de costos",
    icon: FileText,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
  },
  {
    id: "packing-list",
    name: "Packing List de Ejemplo",
    description: "Lista detallada del contenido del contenedor",
    icon: Package,
    iconColor: "text-green-600",
    iconBg: "bg-green-100",
  },
  {
    id: "customs-data",
    name: "Datos Aduaneros Esenciales",
    description: "Código HS, descripción y uso declarado",
    icon: FileSpreadsheet,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-100",
  },
  {
    id: "contract-templates",
    name: "Plantillas de Contratos",
    description: "Documentos estándar para diferentes Incoterms",
    icon: FileCheck,
    iconColor: "text-gray-600",
    iconBg: "bg-gray-100",
  },
];

const additionalResources = [
  {
    id: "import-guide",
    name: "Guía de Importación ZLC",
    description: "Proceso completo paso a paso",
    icon: BookOpen,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
  },
  {
    id: "tariff-calculator",
    name: "Calculadora de Aranceles",
    description: "Estimación de costos totales",
    icon: Calculator,
    iconColor: "text-green-600",
    iconBg: "bg-green-100",
  },
];

export function DocumentDownloads({ lotId }: DocumentDownloadsProps) {
  const handleDownload = (documentId: string) => {
    console.log(`Downloading document: ${documentId} for lot: ${lotId}`);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Documentación B2B
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Main Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {documents.map((doc) => {
            const IconComponent = doc.icon;

            return (
              <div
                key={doc.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${doc.iconBg}`}>
                    <IconComponent className={`h-5 w-5 ${doc.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {doc.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {doc.description}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(doc.id)}
                      className="w-full"
                    >
                      <Download className="h-3 w-3 mr-2" />
                      Descargar
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Customs Advisory Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-2">
                ¿Necesita Asesoría Aduanera Especializada?
              </h4>
              <p className="text-sm text-blue-800 mb-3">
                Ito, nuestra asesora aduanera certificada puede ayudarle con:
              </p>
              <ul className="text-sm text-blue-800 space-y-1 mb-4">
                <li>• Clasificación arancelaria correcta (Código HS)</li>
                <li>• Optimización de aranceles e impuestos</li>
                <li>• Documentación requerida para importación</li>
                <li>• Procedimientos de la Zona Libre de Colón</li>
              </ul>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Consultar a Ito - Asesora Aduanera
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">
            Recursos Adicionales
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalResources.map((resource) => {
              const IconComponent = resource.icon;

              return (
                <div
                  key={resource.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleDownload(resource.id)}
                >
                  <div className={`p-2 rounded-lg ${resource.iconBg}`}>
                    <IconComponent
                      className={`h-4 w-4 ${resource.iconColor}`}
                    />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 text-sm">
                      {resource.name}
                    </h5>
                    <p className="text-xs text-gray-600">
                      {resource.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
