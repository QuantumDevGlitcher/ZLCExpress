import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navigation } from "@/components/Navigation";
import { useShipping } from "@/contexts/ShippingContext";
import { useCart } from "@/contexts/CartContext";
import {
  ArrowLeft,
  Package,
  MapPin,
  Calendar,
  Truck,
  Ship,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";

const PORTS = [
  { code: "PAC", name: "Puerto de Colón (Panamá)", country: "Panamá" },
  { code: "MIA", name: "Puerto de Miami (EEUU)", country: "Estados Unidos" },
  {
    code: "LAX",
    name: "Puerto de Los Ángeles (EEUU)",
    country: "Estados Unidos",
  },
  { code: "CRI", name: "Puerto Caldera (Costa Rica)", country: "Costa Rica" },
  { code: "GTM", name: "Puerto Quetzal (Guatemala)", country: "Guatemala" },
  { code: "COL", name: "Puerto de Cartagena (Colombia)", country: "Colombia" },
  { code: "ECU", name: "Puerto de Guayaquil (Ecuador)", country: "Ecuador" },
  {
    code: "VEN",
    name: "Puerto de La Guaira (Venezuela)",
    country: "Venezuela",
  },
  { code: "BRA", name: "Puerto de Santos (Brasil)", country: "Brasil" },
  {
    code: "ARG",
    name: "Puerto de Buenos Aires (Argentina)",
    country: "Argentina",
  },
  { code: "CHI", name: "Puerto de Valparaíso (Chile)", country: "Chile" },
  { code: "PER", name: "Puerto del Callao (Perú)", country: "Perú" },
];

export default function ShippingRequest() {
  const navigate = useNavigate();
  const location = useLocation();
  const { createShippingRequest, requestTransportOptions } = useShipping();
  const { state: cartState } = useCart();

  // Get quote ID from navigation state or URL params
  const quoteId = location.state?.quoteId || "current-quote";
  const cartItems = cartState.items;

  const [formData, setFormData] = useState({
    containerType: "" as "20'" | "40'",
    originPort: "PAC", // Default to Colón
    destinationPort: "",
    estimatedDate: "",
    specialRequirements: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.containerType) {
      newErrors.containerType = "Seleccione el tipo de contenedor";
    }
    if (!formData.destinationPort) {
      newErrors.destinationPort = "Seleccione el puerto de destino";
    }
    if (!formData.estimatedDate) {
      newErrors.estimatedDate = "Seleccione la fecha estimada de envío";
    } else {
      const selectedDate = new Date(formData.estimatedDate);
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 7); // Minimum 7 days from now

      if (selectedDate < minDate) {
        newErrors.estimatedDate =
          "La fecha debe ser al menos 7 días en el futuro";
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
      // Create shipping request
      createShippingRequest({
        quoteId,
        containerType: formData.containerType,
        originPort: formData.originPort,
        destinationPort: formData.destinationPort,
        estimatedDate: new Date(formData.estimatedDate),
        status: "pending",
      });

      // Request transport options from logistics partners
      await requestTransportOptions(`shipping-${Date.now()}`);

      // Navigate to transport options page
      navigate("/transport-options", {
        state: {
          quoteId,
          shippingData: formData,
        },
      });
    } catch (error) {
      console.error("Error creating shipping request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDestinationPort = PORTS.find(
    (p) => p.code === formData.destinationPort,
  );
  const estimatedTransitTime = selectedDestinationPort ? "12-18 días" : "";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-zlc-blue-600 hover:text-zlc-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Solicitud de Envío y Cotización de Transporte
              </h1>
              <p className="text-gray-600 mt-1">
                Paso 1 de 5: Configure los detalles de su envío
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zlc-blue-600">
                Paso 1
              </span>
              <span className="text-sm text-gray-500">20% completado</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-zlc-blue-600 h-2 rounded-full"
                style={{ width: "20%" }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ship className="h-5 w-5 text-zlc-blue-600" />
                    Datos de Envío
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Container Type */}
                    <div>
                      <Label
                        htmlFor="containerType"
                        className="text-base font-medium"
                      >
                        Tipo de Contenedor *
                      </Label>
                      <Select
                        value={formData.containerType}
                        onValueChange={(value: "20'" | "40'") =>
                          setFormData((prev) => ({
                            ...prev,
                            containerType: value,
                          }))
                        }
                      >
                        <SelectTrigger
                          className={`mt-2 ${errors.containerType ? "border-red-500" : ""}`}
                        >
                          <SelectValue placeholder="Seleccione el tipo de contenedor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="20'">
                            <div className="flex items-center justify-between w-full">
                              <span>Contenedor 20'</span>
                              <Badge variant="outline" className="ml-2">
                                Standard
                              </Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="40'">
                            <div className="flex items-center justify-between w-full">
                              <span>Contenedor 40'</span>
                              <Badge variant="outline" className="ml-2">
                                High Cube
                              </Badge>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.containerType && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.containerType}
                        </p>
                      )}
                    </div>

                    {/* Origin Port */}
                    <div>
                      <Label
                        htmlFor="originPort"
                        className="text-base font-medium"
                      >
                        Puerto de Origen
                      </Label>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-zlc-blue-600" />
                          <span className="font-medium">
                            Puerto de Colón, Panamá
                          </span>
                          <Badge variant="secondary">Zona Libre</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Puerto de origen fijo para todos los envíos desde ZLC
                        </p>
                      </div>
                    </div>

                    {/* Destination Port */}
                    <div>
                      <Label
                        htmlFor="destinationPort"
                        className="text-base font-medium"
                      >
                        Puerto de Destino *
                      </Label>
                      <Select
                        value={formData.destinationPort}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            destinationPort: value,
                          }))
                        }
                      >
                        <SelectTrigger
                          className={`mt-2 ${errors.destinationPort ? "border-red-500" : ""}`}
                        >
                          <SelectValue placeholder="Seleccione el puerto de destino" />
                        </SelectTrigger>
                        <SelectContent>
                          {PORTS.filter((port) => port.code !== "PAC").map(
                            (port) => (
                              <SelectItem key={port.code} value={port.code}>
                                <div className="flex flex-col">
                                  <span>{port.name}</span>
                                  <span className="text-sm text-gray-500">
                                    {port.country}
                                  </span>
                                </div>
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      {errors.destinationPort && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.destinationPort}
                        </p>
                      )}
                    </div>

                    {/* Estimated Shipping Date */}
                    <div>
                      <Label
                        htmlFor="estimatedDate"
                        className="text-base font-medium"
                      >
                        Fecha Estimada de Envío *
                      </Label>
                      <Input
                        type="date"
                        id="estimatedDate"
                        value={formData.estimatedDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            estimatedDate: e.target.value,
                          }))
                        }
                        className={`mt-2 ${errors.estimatedDate ? "border-red-500" : ""}`}
                        min={
                          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                            .toISOString()
                            .split("T")[0]
                        }
                      />
                      {errors.estimatedDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.estimatedDate}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        Fecha mínima: 7 días hábiles desde hoy
                      </p>
                    </div>

                    {/* Special Requirements */}
                    <div>
                      <Label
                        htmlFor="specialRequirements"
                        className="text-base font-medium"
                      >
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
                        placeholder="Ej: Temperatura controlada, manejo especial, seguro adicional..."
                        className="mt-2"
                        rows={3}
                      />
                    </div>

                    <Separator />

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-zlc-blue-600 hover:bg-zlc-blue-700 text-white px-8"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Enviando Solicitud...
                          </>
                        ) : (
                          <>
                            Solicitar Cotizaciones de Transporte
                            <Truck className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Route Information */}
              {selectedDestinationPort && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Información de Ruta
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Origen</p>
                          <p className="text-sm text-gray-600">
                            Puerto de Colón, Panamá
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Destino</p>
                          <p className="text-sm text-gray-600">
                            {selectedDestinationPort.name}
                          </p>
                        </div>
                      </div>
                      {estimatedTransitTime && (
                        <div className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 text-zlc-blue-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Tiempo Estimado</p>
                            <p className="text-sm text-gray-600">
                              {estimatedTransitTime}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Cart Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Resumen de Productos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cartItems.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">
                            {item.productTitle}
                          </p>
                          <p className="text-xs text-gray-600">
                            {item.quantity} contenedor
                            {item.quantity > 1 ? "es" : ""} {item.containerType}
                          </p>
                        </div>
                      </div>
                    ))}
                    {cartItems.length > 2 && (
                      <p className="text-sm text-gray-600">
                        +{cartItems.length - 2} producto
                        {cartItems.length - 2 > 1 ? "s" : ""} más
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Process Information */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Próximos pasos:</strong>
                  <br />
                  1. Revisión de solicitud
                  <br />
                  2. Cotizaciones de transportistas
                  <br />
                  3. Comparación y selección
                  <br />
                  4. Confirmación de booking
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
