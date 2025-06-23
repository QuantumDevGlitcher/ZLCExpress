import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SupplierVerification } from "@/types";
import {
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Award,
} from "lucide-react";

interface SupplierVerificationBadgeProps {
  verification?: SupplierVerification;
  showLevel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "minimal" | "detailed";
}

export function SupplierVerificationBadge({
  verification,
  showLevel = false,
  size = "md",
  variant = "minimal",
}: SupplierVerificationBadgeProps) {
  if (!verification) {
    return null;
  }

  const getStatusIcon = () => {
    switch (verification.verificationStatus) {
      case "verified":
        return <CheckCircle className="h-3 w-3" />;
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "rejected":
        return <AlertCircle className="h-3 w-3" />;
      case "expired":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Shield className="h-3 w-3" />;
    }
  };

  const getStatusColor = () => {
    switch (verification.verificationStatus) {
      case "verified":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "expired":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = () => {
    switch (verification.verificationStatus) {
      case "verified":
        return "Verificado";
      case "pending":
        return "Pendiente";
      case "rejected":
        return "Rechazado";
      case "expired":
        return "Expirado";
      default:
        return "No verificado";
    }
  };

  const getLevelIcon = () => {
    switch (verification.verificationLevel) {
      case "authorized":
        return <Star className="h-3 w-3" />;
      case "premium":
        return <Award className="h-3 w-3" />;
      case "standard":
        return <Shield className="h-3 w-3" />;
      case "basic":
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Shield className="h-3 w-3" />;
    }
  };

  const getLevelLabel = () => {
    switch (verification.verificationLevel) {
      case "authorized":
        return "Proveedor Autorizado ZLC";
      case "premium":
        return "Proveedor Premium";
      case "standard":
        return "Proveedor Estándar";
      case "basic":
        return "Proveedor Básico";
      default:
        return "Sin verificar";
    }
  };

  const getLevelColor = () => {
    switch (verification.verificationLevel) {
      case "authorized":
        return "bg-zlc-blue-100 text-zlc-blue-800 border-zlc-blue-200";
      case "premium":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "standard":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "basic":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const getTooltipContent = () => {
    return (
      <div className="space-y-2 text-xs">
        <div>
          <strong>Estado:</strong> {getStatusLabel()}
        </div>
        {verification.verificationDate && (
          <div>
            <strong>Verificado:</strong>{" "}
            {formatDate(verification.verificationDate)}
          </div>
        )}
        {verification.zlcLicenseNumber && (
          <div>
            <strong>Licencia ZLC:</strong> {verification.zlcLicenseNumber}
          </div>
        )}
        {verification.certifications.length > 0 && (
          <div>
            <strong>Certificaciones:</strong>{" "}
            {verification.certifications
              .map((cert) => cert.type.replace("_", " "))
              .join(", ")}
          </div>
        )}
        {verification.verificationNotes && (
          <div>
            <strong>Notas:</strong> {verification.verificationNotes}
          </div>
        )}
      </div>
    );
  };

  if (variant === "detailed") {
    return (
      <TooltipProvider>
        <div className="space-y-2">
          {/* Main verification status */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                className={`${getStatusColor()} flex items-center gap-1 cursor-help`}
              >
                {getStatusIcon()}
                {getStatusLabel()}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>{getTooltipContent()}</TooltipContent>
          </Tooltip>

          {/* Level badge if requested and authorized */}
          {showLevel &&
            verification.verificationLevel === "authorized" &&
            verification.verificationStatus === "verified" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    className={`${getLevelColor()} flex items-center gap-1 cursor-help`}
                  >
                    {getLevelIcon()}
                    {getLevelLabel()}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    Este proveedor ha sido autorizado por la Zona Libre de Colón
                    y cumple con todos los requisitos de verificación.
                  </div>
                </TooltipContent>
              </Tooltip>
            )}

          {/* Certifications */}
          {verification.certifications.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {verification.certifications.slice(0, 3).map((cert) => (
                <Tooltip key={cert.id}>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="text-xs cursor-help border-green-200 text-green-700"
                    >
                      {cert.type.replace("_", " ")}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs space-y-1">
                      <div>
                        <strong>Certificación:</strong> {cert.type}
                      </div>
                      <div>
                        <strong>Número:</strong> {cert.certificationNumber}
                      </div>
                      <div>
                        <strong>Emisor:</strong> {cert.issuedBy}
                      </div>
                      <div>
                        <strong>Vence:</strong> {formatDate(cert.expiryDate)}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
              {verification.certifications.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{verification.certifications.length - 3} más
                </Badge>
              )}
            </div>
          )}
        </div>
      </TooltipProvider>
    );
  }

  // Minimal variant
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Badge
              className={`${getStatusColor()} flex items-center gap-1 cursor-help text-xs`}
            >
              {getStatusIcon()}
              {verification.verificationStatus === "verified" &&
              verification.verificationLevel === "authorized"
                ? "Autorizado ZLC"
                : getStatusLabel()}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>{getTooltipContent()}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Helper function to get verification level for display
export function getVerificationLevel(verification?: SupplierVerification) {
  if (!verification || verification.verificationStatus !== "verified") {
    return null;
  }

  return {
    level: verification.verificationLevel,
    label: (() => {
      switch (verification.verificationLevel) {
        case "authorized":
          return "Proveedor Autorizado ZLC";
        case "premium":
          return "Proveedor Premium";
        case "standard":
          return "Proveedor Estándar";
        case "basic":
          return "Proveedor Básico";
        default:
          return "Verificado";
      }
    })(),
    color: (() => {
      switch (verification.verificationLevel) {
        case "authorized":
          return "text-zlc-blue-600";
        case "premium":
          return "text-purple-600";
        case "standard":
          return "text-blue-600";
        case "basic":
          return "text-gray-600";
        default:
          return "text-green-600";
      }
    })(),
  };
}
