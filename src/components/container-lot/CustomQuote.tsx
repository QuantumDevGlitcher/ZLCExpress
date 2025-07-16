import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronUp, ChevronDown, FileText, Calendar } from "lucide-react";

interface CustomQuoteProps {
  availableSizes: string[];
  availableColors: string[];
}

export function CustomQuote({
  availableSizes,
  availableColors,
}: CustomQuoteProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactEmail: "",
    estimatedQuantity: "",
    targetPrice: "",
    preferredSizes: [] as string[],
    preferredColors: [] as string[],
    sizeColorDistribution: "",
    desiredDate: "",
    specialRequirements: "",
  });

  const handleSizeChange = (size: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      preferredSizes: checked
        ? [...prev.preferredSizes, size]
        : prev.preferredSizes.filter((s) => s !== size),
    }));
  };

  const handleColorChange = (color: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      preferredColors: checked
        ? [...prev.preferredColors, color]
        : prev.preferredColors.filter((c) => c !== color),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Custom quote request:", formData);
  };

  if (!isExpanded) {
    return (
      <Card className="mb-8 bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-gray-700" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Cotización Personalizada
                </h3>
                <p className="text-sm text-gray-600">
                  ¿Necesita especificaciones diferentes? Solicite una cotización
                  personalizada con sus requisitos específicos.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsExpanded(true)}
              variant="ghost"
              className="flex items-center gap-1 text-gray-600 hover:text-gray-700"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <FileText className="h-5 w-5 text-gray-700" />
            Cotización Personalizada
          </CardTitle>
          <Button
            onClick={() => setIsExpanded(false)}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-700"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          ¿Necesita especificaciones diferentes? Solicite una cotización
          personalizada con sus requisitos específicos.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <Label
                htmlFor="companyName"
                className="text-sm font-medium text-gray-700"
              >
                Nombre de la Empresa <span className="text-red-500">*</span>
              </Label>
              <Input
                id="companyName"
                placeholder="Ingrese el nombre de su empresa"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    companyName: e.target.value,
                  }))
                }
                className="mt-1 border-gray-300 focus:border-blue-500"
              />
            </div>

            {/* Contact Email */}
            <div>
              <Label
                htmlFor="contactEmail"
                className="text-sm font-medium text-gray-700"
              >
                Email de Contacto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="contacto@empresa.com"
                value={formData.contactEmail}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contactEmail: e.target.value,
                  }))
                }
                className="mt-1 border-gray-300 focus:border-blue-500"
              />
            </div>

            {/* Estimated Quantity */}
            <div>
              <Label
                htmlFor="estimatedQuantity"
                className="text-sm font-medium text-gray-700"
              >
                Cantidad Estimada (unidades){" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="estimatedQuantity"
                placeholder="ej. 50000"
                value={formData.estimatedQuantity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    estimatedQuantity: e.target.value,
                  }))
                }
                className="mt-1 border-gray-300 focus:border-blue-500"
              />
            </div>

            {/* Target Price */}
            <div>
              <Label
                htmlFor="targetPrice"
                className="text-sm font-medium text-gray-700"
              >
                Precio Objetivo (USD por unidad)
              </Label>
              <Input
                id="targetPrice"
                placeholder="ej. 2.50"
                value={formData.targetPrice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    targetPrice: e.target.value,
                  }))
                }
                className="mt-1 border-gray-300 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Preferred Sizes */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
              Tallas Preferidas
            </Label>
            <div className="flex flex-wrap gap-2">
              {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() =>
                    handleSizeChange(
                      size,
                      !formData.preferredSizes.includes(size),
                    )
                  }
                  className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                    formData.preferredSizes.includes(size)
                      ? "bg-gray-100 border-gray-300 text-gray-900"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Colors */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
              Colores Preferidos
            </Label>
            <div className="flex flex-wrap gap-2">
              {["Negro", "Blanco", "Gris", "Azul Marino", "Rojo", "Verde"].map(
                (color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      handleColorChange(
                        color,
                        !formData.preferredColors.includes(color),
                      )
                    }
                    className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                      formData.preferredColors.includes(color)
                        ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {color}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Size/Color Distribution */}
          <div>
            <Label
              htmlFor="distribution"
              className="text-sm font-medium text-gray-700"
            >
              Distribución de Tallas/Colores
            </Label>
            <Textarea
              id="distribution"
              placeholder="ej. 30% talla S, 40% talla M, 30% talla L; Colores: 50% negro, 30% blanco, 20% azul"
              value={formData.sizeColorDistribution}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  sizeColorDistribution: e.target.value,
                }))
              }
              className="mt-1 border-gray-300 focus:border-blue-500"
              rows={2}
            />
          </div>

          {/* Desired Date */}
          <div>
            <Label
              htmlFor="desiredDate"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Fecha Límite Deseada
            </Label>
            <Input
              id="desiredDate"
              type="date"
              placeholder="mm/dd/yyyy"
              value={formData.desiredDate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  desiredDate: e.target.value,
                }))
              }
              className="mt-1 border-gray-300 focus:border-blue-500"
            />
          </div>

          {/* Special Requirements */}
          <div>
            <Label
              htmlFor="specialRequirements"
              className="text-sm font-medium text-gray-700"
            >
              Requisitos Especiales
            </Label>
            <Textarea
              id="specialRequirements"
              placeholder="ej. Etiquetado personalizado, empaque especial, certificaciones requeridas..."
              rows={4}
              value={formData.specialRequirements}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  specialRequirements: e.target.value,
                }))
              }
              className="mt-1 border-gray-300 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white py-4 rounded-lg flex items-center justify-center gap-2 text-base font-medium"
            >
              <FileText className="h-5 w-5" />
              Enviar Solicitud de Cotización
            </Button>
            <p className="text-sm text-gray-500 text-center">
              El proveedor revisará sus requisitos y le enviará una cotización
              personalizada
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
