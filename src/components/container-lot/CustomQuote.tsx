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
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">
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
              className="flex items-center gap-1 text-gray-600"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Cotización Personalizada
          </CardTitle>
          <Button
            onClick={() => setIsExpanded(false)}
            variant="ghost"
            size="sm"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          ¿Necesita especificaciones diferentes? Solicite una cotización
          personalizada con sus requisitos específicos.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <Label htmlFor="companyName" className="text-sm font-medium">
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
                className="mt-1"
              />
            </div>

            {/* Contact Email */}
            <div>
              <Label htmlFor="contactEmail" className="text-sm font-medium">
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
                className="mt-1"
              />
            </div>

            {/* Estimated Quantity */}
            <div>
              <Label
                htmlFor="estimatedQuantity"
                className="text-sm font-medium"
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
                className="mt-1"
              />
            </div>

            {/* Target Price */}
            <div>
              <Label htmlFor="targetPrice" className="text-sm font-medium">
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
                className="mt-1"
              />
            </div>
          </div>

          {/* Preferred Sizes */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Tallas Preferidas
            </Label>
            <div className="flex flex-wrap gap-3">
              {availableSizes.map((size) => (
                <label key={size} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.preferredSizes.includes(size)}
                    onChange={(e) => handleSizeChange(size, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred Colors */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Colores Preferidos
            </Label>
            <div className="flex flex-wrap gap-3">
              {availableColors.map((color) => (
                <label key={color} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.preferredColors.includes(color)}
                    onChange={(e) => handleColorChange(color, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{color}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size/Color Distribution */}
          <div>
            <Label htmlFor="distribution" className="text-sm font-medium">
              Distribución de Tallas/Colores
            </Label>
            <Input
              id="distribution"
              placeholder="ej. 30% talla S, 40% talla M, 30% talla L; Colores: 50% negro, 30% blanco, 20% azul"
              value={formData.sizeColorDistribution}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  sizeColorDistribution: e.target.value,
                }))
              }
              className="mt-1"
            />
          </div>

          {/* Desired Date */}
          <div>
            <Label htmlFor="desiredDate" className="text-sm font-medium">
              Fecha Límite Deseada
            </Label>
            <Input
              id="desiredDate"
              type="date"
              value={formData.desiredDate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  desiredDate: e.target.value,
                }))
              }
              className="mt-1"
            />
          </div>

          {/* Special Requirements */}
          <div>
            <Label
              htmlFor="specialRequirements"
              className="text-sm font-medium"
            >
              Requisitos Especiales
            </Label>
            <Textarea
              id="specialRequirements"
              placeholder="ej. Etiquetado personalizado, empaque especial, certificaciones requeridas..."
              rows={3}
              value={formData.specialRequirements}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  specialRequirements: e.target.value,
                }))
              }
              className="mt-1"
            />
          </div>

          {/* Submit Button */}
          <div className="bg-gray-800 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span className="font-medium">
                  Enviar Solicitud de Cotización
                </span>
              </div>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Enviar
              </Button>
            </div>
            <p className="text-sm text-gray-300 mt-2">
              El proveedor revisará sus requisitos y le enviará una cotización
              personalizada
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
