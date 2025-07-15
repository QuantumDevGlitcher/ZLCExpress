import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Star,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Supplier {
  name: string;
  legalName: string;
  country: string;
  logo: string;
  rating: number;
  verified: boolean;
}

interface ProductHeaderProps {
  productTitle: string;
  isNegotiable: boolean;
  supplier: Supplier;
}

export function ProductHeader({
  productTitle,
  isNegotiable,
  supplier,
}: ProductHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-700 p-0"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver
        </Button>
        <span>/</span>
        <span>Categorías</span>
        <span>/</span>
        <span>Textiles</span>
        <span>/</span>
        <span className="text-gray-900">Camisetas</span>
      </div>

      {/* Product Title and Actions */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            {productTitle}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            {isNegotiable && (
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                Precio Negociable
              </Badge>
            )}
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              Lote Contenedor
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="h-10 w-10 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
            style={{
              backgroundColor: "white",
              borderColor: "#d1d5db",
              color: "#4b5563",
            }}
          >
            <Heart className="h-5 w-5" />
          </button>
          <button
            className="h-10 w-10 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
            style={{
              backgroundColor: "white",
              borderColor: "#d1d5db",
              color: "#4b5563",
            }}
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Supplier Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={supplier.logo}
              alt={supplier.name}
              className="w-16 h-16 rounded-lg object-cover border border-gray-200"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {supplier.name}
                </h3>
                {supplier.verified && (
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verificado
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{supplier.legalName}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{supplier.country}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current text-amber-500" />
                  <span className="font-medium">{supplier.rating}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contactar
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Ver Perfil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
