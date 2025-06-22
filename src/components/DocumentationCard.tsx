import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomsDocument } from "@/types";
import {
  FileText,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

interface DocumentationCardProps {
  document: CustomsDocument;
  onDownload?: (documentId: string) => void;
  onPreview?: (documentId: string) => void;
}

export function DocumentationCard({
  document,
  onDownload,
  onPreview,
}: DocumentationCardProps) {
  const getDocumentIcon = (type: CustomsDocument["type"]) => {
    switch (type) {
      case "commercial_invoice":
        return "🧾";
      case "packing_list":
        return "📦";
      case "customs_data":
        return "🏛️";
      case "zlc_checklist":
        return "✅";
      case "destination_checklist":
        return "🎯";
      default:
        return "📄";
    }
  };

  const getStatusIcon = (status: CustomsDocument["status"]) => {
    switch (status) {
      case "ready":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: CustomsDocument["status"]) => {
    switch (status) {
      case "ready":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Listo
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            Pendiente
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            No disponible
          </Badge>
        );
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

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getDocumentIcon(document.type)}</div>
            <div>
              <CardTitle className="text-base">{document.title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {document.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(document.status)}
            {getStatusBadge(document.status)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Document Info */}
          {document.generatedAt && (
            <div className="text-xs text-gray-500">
              Generado: {formatDate(document.generatedAt)}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {document.status === "ready" && onPreview && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPreview(document.id)}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                Vista Previa
              </Button>
            )}

            {document.status === "ready" && onDownload && (
              <Button
                size="sm"
                onClick={() => onDownload(document.id)}
                className="flex-1 bg-zlc-blue-600 hover:bg-zlc-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
            )}

            {document.status === "pending" && (
              <Button variant="ghost" size="sm" disabled className="flex-1">
                <Clock className="h-4 w-4 mr-2" />
                Generando...
              </Button>
            )}
          </div>

          {/* Document Type Badge */}
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="text-xs">
              {document.type === "commercial_invoice" && "Factura Comercial"}
              {document.type === "packing_list" && "Lista de Empaque"}
              {document.type === "customs_data" && "Datos Aduaneros"}
              {document.type === "zlc_checklist" && "Checklist ZLC"}
              {document.type === "destination_checklist" && "Checklist Destino"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
