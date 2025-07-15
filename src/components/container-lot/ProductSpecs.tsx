import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, Clock, Info, Box, Scale, Weight } from "lucide-react";

interface Specifications {
  material: string;
  sizes: string[];
  colors: string[];
  category: string;
}

interface Logistics {
  totalUnits: number;
  grossWeight: string;
  netWeight: string;
  containerDimensions: {
    length: string;
    width: string;
    height: string;
    type: string;
  };
  incoterm: string;
  conditions: string;
  leadTime: {
    production: string;
    shipping: string;
  };
}

interface ProductSpecsProps {
  description: string;
  specifications: Specifications;
  logistics: Logistics;
}

export function ProductSpecs({
  description,
  specifications,
  logistics,
}: ProductSpecsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Left Column - Product Description */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
            <Info className="h-5 w-5" />
            Descripción del Producto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Descripción Detallada
            </h4>
            <p className="text-gray-700 leading-relaxed text-sm mb-4">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Material</h4>
              <p className="text-gray-700 text-sm">{specifications.material}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Categoría</h4>
              <p className="text-gray-700 text-sm">{specifications.category}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Tallas Disponibles
            </h4>
            <div className="flex flex-wrap gap-2">
              {specifications.sizes.map((size) => (
                <span
                  key={size}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Colores Disponibles
            </h4>
            <div className="flex flex-wrap gap-2">
              {specifications.colors.map((color) => (
                <span
                  key={color}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right Column - Logistics Data */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
            <Package className="h-5 w-5" />
            Datos Logísticos del Lote
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Total Units and Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Total Unidades</p>
                <p className="font-semibold text-gray-900">
                  {logistics.totalUnits.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded">
                <Weight className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Peso Bruto</p>
                <p className="font-semibold text-gray-900">
                  {logistics.grossWeight}
                </p>
              </div>
            </div>
          </div>

          {/* Container Dimensions */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Box className="h-4 w-4" />
              Dimensiones del Contenedor
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Tipo:</span>
                <span className="font-medium text-sm">
                  {logistics.containerDimensions.type}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Dimensiones:</span>
                <span className="font-medium text-sm">
                  {logistics.containerDimensions.length} ×{" "}
                  {logistics.containerDimensions.width} ×{" "}
                  {logistics.containerDimensions.height}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Peso Neto:</span>
                <span className="font-medium text-sm">
                  {logistics.netWeight}
                </span>
              </div>
            </div>
          </div>

          {/* Commercial Conditions */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Condiciones Comerciales
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Incoterm:</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                  {logistics.incoterm}
                </span>
              </div>
              <p className="text-sm text-gray-600">{logistics.conditions}</p>
            </div>
          </div>

          {/* Delivery Time */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Tiempo de Entrega
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600 mb-1">Producción</p>
                <p className="font-semibold text-sm">
                  {logistics.leadTime.production}
                </p>
              </div>
              <div className="text-center bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-600 mb-1">Envío</p>
                <p className="font-semibold text-sm">
                  {logistics.leadTime.shipping}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
