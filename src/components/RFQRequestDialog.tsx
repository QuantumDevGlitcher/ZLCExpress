import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useB2B } from "@/contexts/B2BContext";
import { ContainerLot } from "@/types";
import {
  FileText,
  Calendar as CalendarIcon,
  Package,
  Truck,
  CheckCircle,
  Info,
  Send,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface RFQRequestDialogProps {
  product: ContainerLot;
  supplierId: string;
  supplierName: string;
  children: React.ReactNode;
  onRFQCreated?: (rfqId: string) => void;
}

export function RFQRequestDialog({
  product,
  supplierId,
  supplierName,
  children,
  onRFQCreated,
}: RFQRequestDialogProps) {
  const { createRFQ } = useB2B();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    containerQuantity: 1,
    containerType: product.containerSize,
    incoterm: "CIF" as const,
    estimatedDeliveryDate: undefined as Date | undefined,
    logisticsComments: "",
    specialRequirements: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.containerQuantity < 1) {
      newErrors.containerQuantity =
        "La cantidad debe ser al menos 1 contenedor";
    }

    if (!formData.estimatedDeliveryDate) {
      newErrors.estimatedDeliveryDate =
        "Seleccione una fecha tentativa de entrega";
    } else {
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 30); // Minimum 30 days from now

      if (formData.estimatedDeliveryDate < minDate) {
        newErrors.estimatedDeliveryDate =
          "La fecha debe ser al menos 30 días en el futuro";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30); // RFQ valid for 30 days

      const rfqId = await createRFQ({
        productId: product.id,
        productTitle: product.title,
        supplierId,
        supplierName,
        buyerId: "current-user-id", // This would come from auth context
        buyerCompany: "Importadora Central América S.A.", // From company profile
        containerQuantity: formData.containerQuantity,
        containerType: formData.containerType,
        incoterm: formData.incoterm,
        estimatedDeliveryDate: formData.estimatedDeliveryDate!,
        logisticsComments: formData.logisticsComments,
        specialRequirements: formData.specialRequirements,
        status: "sent",
        validUntil,
      });

      setOpen(false);
      setFormData({
        containerQuantity: 1,
        containerType: product.containerSize,
        incoterm: "CIF",
        estimatedDeliveryDate: undefined,
        logisticsComments: "",
        specialRequirements: "",
      });

      if (onRFQCreated) {
        onRFQCreated(rfqId);
      }
    } catch (error) {
      console.error("Error creating RFQ:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIncotermDescription = (incoterm: string) => {
    switch (incoterm) {
      case "FOB":
        return "Free on Board - Vendedor entrega en puerto de origen";
      case "CIF":
        return "Cost, Insurance & Freight - Vendedor paga flete y seguro";
      case "CFR":
        return "Cost & Freight - Vendedor paga flete, comprador asume riesgo";
      case "EXW":
        return "Ex Works - Comprador se hace cargo desde fábrica";
      default:
        return "";
    }
  };

  const estimatedTotal = formData.containerQuantity * product.priceRange.min;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-zlc-blue-600" />
            Solicitar Cotización (RFQ)
          </DialogTitle>
          <DialogDescription>
            Complete los detalles para solicitar una cotización formal al
            proveedor
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{product.title}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {product.description}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline">{product.containerSize}</Badge>
                  <span className="text-sm text-gray-600">
                    MOQ: {product.moq} unidades
                  </span>
                  <span className="text-sm font-medium text-zlc-blue-600">
                    {product.priceRange.min.toLocaleString()} -{" "}
                    {product.priceRange.max.toLocaleString()}{" "}
                    {product.priceRange.currency}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <strong>Proveedor:</strong> {supplierName}
                </div>
              </div>
            </div>
          </div>

          {/* Container Quantity */}
          <div>
            <Label htmlFor="containerQuantity">
              Cantidad de Contenedores Deseados *
            </Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                id="containerQuantity"
                type="number"
                min="1"
                value={formData.containerQuantity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    containerQuantity: parseInt(e.target.value) || 1,
                  }))
                }
                className={`w-24 ${errors.containerQuantity ? "border-red-500" : ""}`}
              />
              <span className="text-sm text-gray-600">
                contenedores {formData.containerType}
              </span>
              {estimatedTotal > 0 && (
                <Badge variant="outline" className="ml-auto">
                  Est. ${estimatedTotal.toLocaleString()}+
                </Badge>
              )}
            </div>
            {errors.containerQuantity && (
              <p className="text-red-500 text-sm mt-1">
                {errors.containerQuantity}
              </p>
            )}
          </div>

          {/* Container Type */}
          <div>
            <Label htmlFor="containerType">Tipo de Contenedor</Label>
            <Select
              value={formData.containerType}
              onValueChange={(value: "20'" | "40'") =>
                setFormData((prev) => ({ ...prev, containerType: value }))
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20'">Contenedor 20' (Estándar)</SelectItem>
                <SelectItem value="40'">Contenedor 40' (High Cube)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Incoterm Selection */}
          <div>
            <Label htmlFor="incoterm">Incoterm Deseado *</Label>
            <Select
              value={formData.incoterm}
              onValueChange={(value: any) =>
                setFormData((prev) => ({ ...prev, incoterm: value }))
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FOB">FOB - Free on Board</SelectItem>
                <SelectItem value="CIF">
                  CIF - Cost, Insurance & Freight
                </SelectItem>
                <SelectItem value="CFR">CFR - Cost & Freight</SelectItem>
                <SelectItem value="EXW">EXW - Ex Works</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-600 mt-1">
              {getIncotermDescription(formData.incoterm)}
            </p>
          </div>

          {/* Estimated Delivery Date */}
          <div>
            <Label htmlFor="estimatedDeliveryDate">
              Fecha Tentativa de Entrega *
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-2",
                    !formData.estimatedDeliveryDate && "text-muted-foreground",
                    errors.estimatedDeliveryDate && "border-red-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.estimatedDeliveryDate ? (
                    format(formData.estimatedDeliveryDate, "PPP", {
                      locale: es,
                    })
                  ) : (
                    <span>Seleccione fecha de entrega</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.estimatedDeliveryDate}
                  onSelect={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      estimatedDeliveryDate: date,
                    }))
                  }
                  disabled={(date) => {
                    const minDate = new Date();
                    minDate.setDate(minDate.getDate() + 30);
                    return date < minDate;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.estimatedDeliveryDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.estimatedDeliveryDate}
              </p>
            )}
          </div>

          {/* Logistics Comments */}
          <div>
            <Label htmlFor="logisticsComments">
              Comentarios Logísticos (Opcional)
            </Label>
            <Textarea
              id="logisticsComments"
              value={formData.logisticsComments}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  logisticsComments: e.target.value,
                }))
              }
              placeholder="Ej: Requiere contenedor refrigerado, manejo especial, etc."
              className="mt-2"
              rows={3}
            />
          </div>

          {/* Special Requirements */}
          <div>
            <Label htmlFor="specialRequirements">
              Requisitos Especiales (Opcional)
            </Label>
            <Textarea
              id="specialRequirements"
              value={formData.specialRequirements}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  specialRequirements: e.target.value,
                }))
              }
              placeholder="Certificaciones específicas, condiciones de calidad, etc."
              className="mt-2"
              rows={3}
            />
          </div>

          {/* Information Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Proceso de RFQ:</strong>
              <br />
              1. Su solicitud será enviada al proveedor
              <br />
              2. El proveedor tiene 5 días hábiles para responder
              <br />
              3. Recibirá notificación cuando la cotización esté lista
              <br />
              4. Podrá revisar y negociar términos antes de aceptar
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-zlc-blue-600 hover:bg-zlc-blue-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando RFQ...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Solicitud de Cotización
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
