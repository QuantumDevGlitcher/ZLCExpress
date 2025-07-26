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
import { SimpleDatePicker } from "@/components/ui/simple-date-picker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  DollarSign,
  Globe,
  Clock,
  AlertCircle,
  Star,
  Zap,
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

// Tipos para la nueva API
interface RFQCreatePayload {
  productId: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone?: string;
  companyName?: string;
  containerQuantity: number;
  containerType: '20GP' | '40GP' | '40HC' | '45HC';
  incoterm: 'EXW' | 'FOB' | 'CIF' | 'CFR' | 'DDP' | 'DAP';
  tentativeDeliveryDate: string;
  logisticsComments?: string;
  specialRequirements?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
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
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    requesterName: "Juan Pérez", // En producción vendría del contexto de auth
    requesterEmail: "juan.perez@empresa.com",
    requesterPhone: "+57 300 123 4567",
    companyName: "Mi Empresa S.A.S.",
    containerQuantity: 1,
    containerType: "20GP" as '20GP' | '40GP' | '40HC' | '45HC',
    incoterm: "CIF" as 'EXW' | 'FOB' | 'CIF' | 'CFR' | 'DDP' | 'DAP',
    estimatedDeliveryDate: undefined as Date | undefined,
    logisticsComments: "",
    specialRequirements: "",
    priority: "medium" as 'low' | 'medium' | 'high' | 'urgent',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Función para crear RFQ usando la nueva API
  const createRFQAPI = async (payload: RFQCreatePayload) => {
    try {
      const response = await fetch('http://localhost:3000/api/rfq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP ${response.status}: Error al crear la RFQ`);
      }

      return responseData;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Fallback para cuando el backend no esté disponible (modo desarrollo)
        console.warn('Backend no disponible, usando simulación local');
        return {
          success: true,
          message: 'RFQ creada exitosamente (modo simulación)',
          data: {
            id: `rfq_${Date.now()}`,
            status: 'pending',
            ...payload
          }
        };
      }
      throw error;
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validación del nombre
    if (!formData.requesterName.trim()) {
      newErrors.requesterName = "El nombre es requerido";
    } else if (formData.requesterName.trim().length < 2) {
      newErrors.requesterName = "El nombre debe tener al menos 2 caracteres";
    }

    // Validación del email
    if (!formData.requesterEmail.trim()) {
      newErrors.requesterEmail = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.requesterEmail)) {
      newErrors.requesterEmail = "El email debe tener un formato válido";
    }

    // Validación de la cantidad de contenedores
    if (formData.containerQuantity < 1) {
      newErrors.containerQuantity = "La cantidad debe ser al menos 1 contenedor";
    } else if (formData.containerQuantity > 100) {
      newErrors.containerQuantity = "La cantidad máxima es 100 contenedores";
    }

    // Validación de fecha
    if (!formData.estimatedDeliveryDate) {
      newErrors.estimatedDeliveryDate = "Seleccione una fecha tentativa de entrega";
    } else {
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 7); // Minimum 7 days from now
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 2); // Maximum 2 years from now

      if (formData.estimatedDeliveryDate < minDate) {
        newErrors.estimatedDeliveryDate = "La fecha debe ser al menos 7 días en el futuro";
      } else if (formData.estimatedDeliveryDate > maxDate) {
        newErrors.estimatedDeliveryDate = "La fecha no puede ser más de 2 años en el futuro";
      }
    }

    // Validación de teléfono si está presente
    if (formData.requesterPhone && formData.requesterPhone.length > 0) {
      const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,}$/;
      if (!phoneRegex.test(formData.requesterPhone)) {
        newErrors.requesterPhone = "Formato de teléfono inválido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorElement = document.querySelector('.border-red-500');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setErrors({}); // Clear any previous errors

    try {
      const payload: RFQCreatePayload = {
        productId: product.id,
        requesterName: formData.requesterName.trim(),
        requesterEmail: formData.requesterEmail.trim(),
        requesterPhone: formData.requesterPhone?.trim() || undefined,
        companyName: formData.companyName?.trim() || undefined,
        containerQuantity: formData.containerQuantity,
        containerType: formData.containerType,
        incoterm: formData.incoterm,
        tentativeDeliveryDate: formData.estimatedDeliveryDate!.toISOString().split('T')[0],
        logisticsComments: formData.logisticsComments?.trim() || undefined,
        specialRequirements: formData.specialRequirements?.trim() || undefined,
        priority: formData.priority,
      };

      const response = await createRFQAPI(payload);
      
      setSubmitSuccess(true);
      
      // Mostrar success por 2.5 segundos antes de cerrar
      setTimeout(() => {
        setOpen(false);
        setSubmitSuccess(false);
        setCurrentStep(1);
        // Reset form to initial state
        setFormData({
          requesterName: "Juan Pérez",
          requesterEmail: "juan.perez@empresa.com", 
          requesterPhone: "+57 300 123 4567",
          companyName: "Mi Empresa S.A.S.",
          containerQuantity: 1,
          containerType: "20GP",
          incoterm: "CIF",
          estimatedDeliveryDate: undefined,
          logisticsComments: "",
          specialRequirements: "",
          priority: "medium",
        });
        setErrors({});

        if (onRFQCreated && response.data?.id) {
          onRFQCreated(response.data.id);
        }
      }, 2500);

    } catch (error) {
      console.error("Error creating RFQ:", error);
      setErrors({ 
        submit: error instanceof Error ? error.message : "Error al enviar la solicitud. Por favor intente nuevamente." 
      });
      
      // Scroll to top to show error
      const dialogContent = document.querySelector('[role="dialog"]');
      if (dialogContent) {
        dialogContent.scrollTop = 0;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIncotermDescription = (incoterm: string) => {
    switch (incoterm) {
      case "EXW":
        return "Ex Works - El vendedor entrega cuando pone la mercancía a disposición del comprador en sus instalaciones";
      case "FOB":
        return "Free on Board - El vendedor entrega la mercancía a bordo del buque designado por el comprador";
      case "CIF":
        return "Cost, Insurance & Freight - El vendedor paga flete y seguro hasta el puerto de destino";
      case "CFR":
        return "Cost and Freight - El vendedor paga el flete hasta el puerto de destino";
      case "DDP":
        return "Delivered Duty Paid - El vendedor entrega la mercancía en el lugar convenido, con todos los gastos pagados";
      case "DAP":
        return "Delivered at Place - El vendedor entrega cuando la mercancía se pone a disposición en el lugar convenido";
      default:
        return "";
    }
  };

  const getContainerTypeDescription = (type: string) => {
    switch (type) {
      case "20GP":
        return "20' Dry Container (Estándar) - 33.2 m³";
      case "40GP":
        return "40' Dry Container - 67.7 m³";
      case "40HC":
        return "40' High Cube - 76.3 m³";
      case "45HC":
        return "45' High Cube - 86.0 m³";
      default:
        return type;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-50 text-green-700 border-green-200";
      case "medium":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "high":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "urgent":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const estimatedTotal = formData.containerQuantity * product.priceRange.min;

  // Si está enviando exitosamente, mostrar pantalla de éxito
  if (submitSuccess) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="w-full max-w-md mx-4 sm:mx-8">
          <div className="text-center py-6 sm:py-8">
            <div className="mx-auto flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-7 w-7 sm:h-8 sm:w-8 text-green-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              ¡RFQ Enviada Exitosamente!
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed px-2">
              Su solicitud de cotización ha sido enviada al proveedor. 
              Recibirá una notificación cuando respondan.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span>Tiempo de respuesta estimado: 2-5 días hábiles</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full max-w-6xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 mx-4 sm:mx-8">
        <div className="sticky top-0 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 -mx-6 -mt-6 px-4 sm:px-6 py-4 mb-6 z-10">
          <DialogHeader>
            <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-white">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="flex-1">
                <span className="block text-lg sm:text-xl font-semibold">Solicitar Cotización (RFQ)</span>
                <span className="text-xs sm:text-sm font-normal opacity-90 leading-tight">
                  Complete los detalles para solicitar una cotización formal al proveedor
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Error de envío */}
          {errors.submit && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-700">
                <strong>Error:</strong> {errors.submit}
              </AlertDescription>
            </Alert>
          )}

          {/* Product Summary Card con gradiente mejorado */}
          <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-100 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg flex-shrink-0">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex-1 w-full">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 break-words">{product.title}</h4>
                  <p className="text-sm sm:text-base text-gray-700 mb-3 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm">
                      {product.containerSize}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 bg-white px-2 sm:px-3 py-1 rounded-full">
                      <Package className="h-3 w-3" />
                      <span>MOQ: {product.moq} unidades</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-green-700 bg-green-100 px-2 sm:px-3 py-1 rounded-full">
                      <DollarSign className="h-3 w-3" />
                      <span>
                        {product.priceRange.min.toLocaleString()} - {product.priceRange.max.toLocaleString()} {product.priceRange.currency}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
                      <span><strong>Proveedor:</strong> <span className="break-words">{supplierName}</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Información del Solicitante */}
            <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-100 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex-shrink-0">
                    <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Información del Solicitante</h3>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <Label htmlFor="requesterName" className="text-sm sm:text-base text-gray-700 font-medium">
                      Nombre Completo *
                    </Label>
                    <Input
                      id="requesterName"
                      value={formData.requesterName}
                      onChange={(e) => setFormData(prev => ({ ...prev, requesterName: e.target.value }))}
                      className={`mt-1 bg-white/70 border-gray-200 focus:border-green-500 focus:ring-green-500 text-sm sm:text-base ${errors.requesterName ? "border-red-500" : ""}`}
                      placeholder="Su nombre completo"
                    />
                    {errors.requesterName && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 flex-shrink-0" />
                        <span>{errors.requesterName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="requesterEmail" className="text-sm sm:text-base text-gray-700 font-medium">
                      Email Corporativo *
                    </Label>
                    <Input
                      id="requesterEmail"
                      type="email"
                      value={formData.requesterEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, requesterEmail: e.target.value }))}
                      className={`mt-1 bg-white/70 border-gray-200 focus:border-green-500 focus:ring-green-500 text-sm sm:text-base ${errors.requesterEmail ? "border-red-500" : ""}`}
                      placeholder="nombre@empresa.com"
                    />
                    {errors.requesterEmail && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 flex-shrink-0" />
                        <span>{errors.requesterEmail}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="companyName" className="text-sm sm:text-base text-gray-700 font-medium">
                      Empresa
                    </Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                      className="mt-1 bg-white/70 border-gray-200 focus:border-green-500 focus:ring-green-500 text-sm sm:text-base"
                      placeholder="Nombre de su empresa"
                    />
                  </div>

                  <div>
                    <Label htmlFor="requesterPhone" className="text-sm sm:text-base text-gray-700 font-medium">
                      Teléfono
                    </Label>
                    <Input
                      id="requesterPhone"
                      type="tel"
                      value={formData.requesterPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, requesterPhone: e.target.value }))}
                      className={`mt-1 bg-white/70 border-gray-200 focus:border-green-500 focus:ring-green-500 text-sm sm:text-base ${errors.requesterPhone ? "border-red-500" : ""}`}
                      placeholder="+57 300 123 4567"
                    />
                    {errors.requesterPhone && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 flex-shrink-0" />
                        <span>{errors.requesterPhone}</span>
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detalles de la Cotización */}
            <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-100 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex-shrink-0">
                    <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Detalles de la Cotización</h3>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {/* Container Quantity con diseño mejorado y responsive */}
                  <div>
                    <Label htmlFor="containerQuantity" className="text-sm sm:text-base text-gray-700 font-medium">
                      Cantidad de Contenedores Deseados *
                    </Label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-2">
                      <Input
                        id="containerQuantity"
                        type="number"
                        min="1"
                        value={formData.containerQuantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, containerQuantity: parseInt(e.target.value) || 1 }))}
                        className={`w-full sm:w-24 bg-white/70 border-gray-200 focus:border-purple-500 focus:ring-purple-500 text-sm sm:text-base ${errors.containerQuantity ? "border-red-500" : ""}`}
                      />
                      <span className="text-xs sm:text-sm text-gray-600 font-medium">
                        contenedores {formData.containerType}
                      </span>
                      {estimatedTotal > 0 && (
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm">
                          <DollarSign className="h-3 w-3 mr-1" />
                          Est. ${estimatedTotal.toLocaleString()}+
                        </Badge>
                      )}
                    </div>
                    {errors.containerQuantity && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 flex-shrink-0" />
                        <span>{errors.containerQuantity}</span>
                      </p>
                    )}
                  </div>

                  {/* Container Type con descripciones */}
                  <div>
                    <Label htmlFor="containerType" className="text-sm sm:text-base text-gray-700 font-medium">Tipo de Contenedor</Label>
                    <Select
                      value={formData.containerType}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, containerType: value }))}
                    >
                      <SelectTrigger className="mt-2 bg-white/70 border-gray-200 focus:border-purple-500 focus:ring-purple-500 text-sm sm:text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20GP">20' Dry Container (Estándar) - 33.2 m³</SelectItem>
                        <SelectItem value="40GP">40' Dry Container - 67.7 m³</SelectItem>
                        <SelectItem value="40HC">40' High Cube - 76.3 m³</SelectItem>
                        <SelectItem value="45HC">45' High Cube - 86.0 m³</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-600 mt-1 leading-tight">
                      {getContainerTypeDescription(formData.containerType)}
                    </p>
                  </div>

                  {/* Priority Selection */}
                  <div>
                    <Label htmlFor="priority" className="text-sm sm:text-base text-gray-700 font-medium">Prioridad de la Solicitud</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger className="mt-2 bg-white/70 border-gray-200 focus:border-purple-500 focus:ring-purple-500 text-sm sm:text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">🟢 Baja - Sin prisa</SelectItem>
                        <SelectItem value="medium">🔵 Media - Estándar</SelectItem>
                        <SelectItem value="high">🟠 Alta - Importante</SelectItem>
                        <SelectItem value="urgent">🔴 Urgente - Prioritario</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge className={`mt-2 text-xs sm:text-sm ${getPriorityColor(formData.priority)}`}>
                      Prioridad: {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Incoterm Selection con diseño mejorado */}
          <Card className="border-0 bg-gradient-to-br from-orange-50 to-red-100 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex-shrink-0">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Términos Comerciales</h3>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="incoterm" className="text-sm sm:text-base text-gray-700 font-medium">Incoterm Deseado *</Label>
                  <Select
                    value={formData.incoterm}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, incoterm: value }))}
                  >
                    <SelectTrigger className="mt-2 bg-white/70 border-gray-200 focus:border-orange-500 focus:ring-orange-500 text-sm sm:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EXW">EXW - Ex Works</SelectItem>
                      <SelectItem value="FOB">FOB - Free on Board</SelectItem>
                      <SelectItem value="CIF">CIF - Cost, Insurance & Freight</SelectItem>
                      <SelectItem value="CFR">CFR - Cost & Freight</SelectItem>
                      <SelectItem value="DDP">DDP - Delivered Duty Paid</SelectItem>
                      <SelectItem value="DAP">DAP - Delivered at Place</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-2 p-3 bg-white/50 rounded-lg border border-orange-200">
                    <p className="text-xs leading-relaxed text-gray-700">
                      <strong>{formData.incoterm}:</strong> {getIncotermDescription(formData.incoterm)}
                    </p>
                  </div>
                </div>

                {/* Estimated Delivery Date con calendario mejorado */}
                <div>
                  <Label htmlFor="estimatedDeliveryDate" className="text-sm sm:text-base text-gray-700 font-medium">
                    Fecha Tentativa de Entrega *
                  </Label>
                  <div className="mt-2">
                    <SimpleDatePicker
                      id="estimatedDeliveryDate"
                      date={formData.estimatedDeliveryDate}
                      onSelect={(date) => {
                        setFormData(prev => ({ ...prev, estimatedDeliveryDate: date }));
                        // Clear the error when a date is selected
                        if (date && errors.estimatedDeliveryDate) {
                          setErrors(prev => ({ ...prev, estimatedDeliveryDate: "" }));
                        }
                      }}
                      placeholder="Seleccione fecha de entrega"
                      minDate={(() => {
                        const minDate = new Date();
                        minDate.setDate(minDate.getDate() + 7);
                        return minDate;
                      })()}
                      error={!!errors.estimatedDeliveryDate}
                      className="bg-white/70 border-gray-200 focus:border-orange-500 focus:ring-orange-500 text-sm sm:text-base h-10"
                    />
                  </div>
                  {errors.estimatedDeliveryDate && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 flex-shrink-0" />
                      <span>{errors.estimatedDeliveryDate}</span>
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    📅 Fecha mínima: {format((() => {
                      const minDate = new Date();
                      minDate.setDate(minDate.getDate() + 7);
                      return minDate;
                    })(), "PPP", { locale: es })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comentarios y Requisitos */}
          <Card className="border-0 bg-gradient-to-br from-teal-50 to-cyan-100 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex-shrink-0">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Comentarios Adicionales</h3>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="logisticsComments" className="text-sm sm:text-base text-gray-700 font-medium">
                    Comentarios Logísticos (Opcional)
                  </Label>
                  <Textarea
                    id="logisticsComments"
                    value={formData.logisticsComments}
                    onChange={(e) => setFormData(prev => ({ ...prev, logisticsComments: e.target.value }))}
                    placeholder="Ej: Requiere contenedor refrigerado, manejo especial, etc."
                    className="mt-2 bg-white/70 border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-sm sm:text-base resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="specialRequirements" className="text-sm sm:text-base text-gray-700 font-medium">
                    Requisitos Especiales (Opcional)
                  </Label>
                  <Textarea
                    id="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialRequirements: e.target.value }))}
                    placeholder="Certificaciones específicas, condiciones de calidad, etc."
                    className="mt-2 bg-white/70 border-gray-200 focus:border-teal-500 focus:ring-teal-500 text-sm sm:text-base resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Alert mejorado */}
          <Alert className="border-0 bg-gradient-to-r from-blue-50 to-indigo-100 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex-shrink-0">
                <Info className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <AlertDescription className="text-gray-700 flex-1">
                <div className="mb-2">
                  <strong className="text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                    <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 flex-shrink-0" />
                    Proceso de RFQ:
                  </strong>
                </div>
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">1</span>
                    <span>Su solicitud será enviada al proveedor</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">2</span>
                    <span>El proveedor tiene 5 días hábiles para responder</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">3</span>
                    <span>Recibirá notificación cuando la cotización esté lista</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">4</span>
                    <span>Podrá revisar y negociar términos antes de aceptar</span>
                  </div>
                </div>
              </AlertDescription>
            </div>
          </Alert>

          {/* Action Buttons mejorados y responsive */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="px-4 sm:px-6 py-2 border-gray-300 hover:bg-gray-50 text-sm sm:text-base order-2 sm:order-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6 sm:px-8 py-2 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-600 hover:via-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base order-1 sm:order-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2 flex-shrink-0"></div>
                  <span className="hidden sm:inline">Enviando RFQ...</span>
                  <span className="sm:hidden">Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline">Enviar Solicitud de Cotización</span>
                  <span className="sm:hidden">Enviar RFQ</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
