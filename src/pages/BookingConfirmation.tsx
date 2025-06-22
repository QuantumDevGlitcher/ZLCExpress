import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Navigation } from "@/components/Navigation";
import { useShipping } from "@/contexts/ShippingContext";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Ship,
  Calendar,
  MapPin,
  DollarSign,
  FileText,
  AlertTriangle,
  Info,
  Clock,
  Truck,
  Shield,
  Building,
} from "lucide-react";

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { confirmBooking } = useShipping();

  const { quoteId, shippingData, selectedOption } = location.state || {};

  const [formData, setFormData] = useState({
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    specialInstructions: "",
    acceptTerms: false,
    acceptLiability: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Generate booking details
  const bookingNumber = `ZLC-${Date.now().toString().slice(-8)}`;
  const cutoffDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // 5 days from now
  const etd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  const eta = new Date(
    etd.getTime() + selectedOption?.transitTime * 24 * 60 * 60 * 1000,
  ); // ETD + transit time

  // Cost calculations
  const productTotal = 15750;
  const freightCost = selectedOption?.cost || 0;
  const platformCommission = 250;
  const totalCost = productTotal + freightCost + platformCommission;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = "Nombre de contacto es requerido";
    }
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = "Teléfono de contacto es requerido";
    }
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Email de contacto es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Formato de email inválido";
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Debe aceptar los términos y condiciones";
    }
    if (!formData.acceptLiability) {
      newErrors.acceptLiability =
        "Debe aceptar la limitación de responsabilidad";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Create booking
      confirmBooking({
        shippingRequestId: `shipping-${Date.now()}`,
        selectedOptionId: selectedOption.id,
        bookingNumber,
        shippingLine: selectedOption.operatorName,
        cutoffDate,
        etd,
        eta,
        totalCost,
        platformCommission,
        status: "confirmed",
      });

      // Navigate to documentation page
      navigate("/documentation", {
        state: {
          bookingNumber,
          quoteId,
        },
      });
    } catch (error) {
      console.error("Error confirming booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-5xl mx-auto">
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
                Confirmación de Booking de Transporte
              </h1>
              <p className="text-gray-600 mt-1">
                Paso 3 de 5: Confirme los detalles finales de su reserva de
                transporte
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zlc-blue-600">
                Paso 3
              </span>
              <span className="text-sm text-gray-500">60% completado</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-zlc-blue-600 h-2 rounded-full"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Booking Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ship className="h-5 w-5 text-zlc-blue-600" />
                    Detalles del Booking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-gray-600">
                          Número de Booking
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono font-bold text-lg">
                            {bookingNumber}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            Generado
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600">
                          Operador Logístico
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">
                            {selectedOption?.operatorName}
                          </span>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600">
                          Tipo de Contenedor
                        </Label>
                        <p className="font-medium mt-1">
                          {shippingData?.containerType}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-gray-600">
                          Fecha de Corte en Puerto
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-amber-600" />
                          <span className="font-medium">
                            {formatDate(cutoffDate)}
                          </span>
                        </div>
                        <p className="text-xs text-amber-600 mt-1">
                          Su carga debe estar lista antes de esta fecha
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600">
                          Fecha Estimada de Zarpe (ETD)
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Ship className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{formatDate(etd)}</span>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600">
                          Fecha Estimada de Llegada (ETA)
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{formatDate(eta)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transport Option Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Opción de Transporte Seleccionada</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Incoterm</Label>
                      <Badge className="mt-1">{selectedOption?.incoterm}</Badge>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">
                        Tiempo de Tránsito
                      </Label>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {selectedOption?.transitTime} días
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-600">
                        Servicios Incluidos
                      </Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedOption?.conditions.insurance && (
                          <Badge variant="outline" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Seguro
                          </Badge>
                        )}
                        {selectedOption?.conditions.customs && (
                          <Badge variant="outline" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            Aduanas
                          </Badge>
                        )}
                        {selectedOption?.conditions.documentation && (
                          <Badge variant="outline" className="text-xs">
                            Documentación
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Información de Contacto para el Envío</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactPerson">
                          Persona de Contacto *
                        </Label>
                        <Input
                          id="contactPerson"
                          value={formData.contactPerson}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              contactPerson: e.target.value,
                            }))
                          }
                          className={
                            errors.contactPerson ? "border-red-500" : ""
                          }
                          placeholder="Nombre completo"
                        />
                        {errors.contactPerson && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.contactPerson}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="contactPhone">
                          Teléfono de Contacto *
                        </Label>
                        <Input
                          id="contactPhone"
                          value={formData.contactPhone}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              contactPhone: e.target.value,
                            }))
                          }
                          className={
                            errors.contactPhone ? "border-red-500" : ""
                          }
                          placeholder="+507 1234-5678"
                        />
                        {errors.contactPhone && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.contactPhone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="contactEmail">Email de Contacto *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            contactEmail: e.target.value,
                          }))
                        }
                        className={errors.contactEmail ? "border-red-500" : ""}
                        placeholder="contacto@empresa.com"
                      />
                      {errors.contactEmail && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.contactEmail}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="specialInstructions">
                        Instrucciones Especiales (Opcional)
                      </Label>
                      <Textarea
                        id="specialInstructions"
                        value={formData.specialInstructions}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            specialInstructions: e.target.value,
                          }))
                        }
                        placeholder="Cualquier instrucción especial para el manejo de la carga..."
                        rows={3}
                      />
                    </div>

                    <Separator />

                    {/* Terms and Conditions */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="acceptTerms"
                          checked={formData.acceptTerms}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              acceptTerms: checked as boolean,
                            }))
                          }
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="acceptTerms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Acepto los términos y condiciones del transporte *
                          </label>
                          <p className="text-xs text-muted-foreground">
                            Incluye condiciones de entrega, responsabilidades y
                            limitaciones del operador logístico.
                          </p>
                        </div>
                      </div>
                      {errors.acceptTerms && (
                        <p className="text-red-500 text-sm">
                          {errors.acceptTerms}
                        </p>
                      )}

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="acceptLiability"
                          checked={formData.acceptLiability}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              acceptLiability: checked as boolean,
                            }))
                          }
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="acceptLiability"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Acepto las limitaciones de responsabilidad *
                          </label>
                          <p className="text-xs text-muted-foreground">
                            Entiendo las limitaciones de responsabilidad del
                            transportista según Incoterm{" "}
                            {selectedOption?.incoterm}.
                          </p>
                        </div>
                      </div>
                      {errors.acceptLiability && (
                        <p className="text-red-500 text-sm">
                          {errors.acceptLiability}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-zlc-blue-600 hover:bg-zlc-blue-700 text-white px-8"
                        size="lg"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Confirmando Booking...
                          </>
                        ) : (
                          <>
                            Confirmar Booking de Transporte
                            <ArrowRight className="ml-2 h-4 w-4" />
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
              {/* Cost Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Resumen de Costos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Valor de Mercancía:</span>
                      <span>{formatCurrency(productTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Costo de Flete:</span>
                      <span className="font-medium">
                        {formatCurrency(freightCost)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Comisión Plataforma:</span>
                      <span>{formatCurrency(platformCommission)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium text-base">
                      <span>Total Final:</span>
                      <span className="text-zlc-blue-600">
                        {formatCurrency(totalCost)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Important Notes */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Importante:</strong>
                  <br />• Su carga debe estar lista para embarque el{" "}
                  {formatDate(cutoffDate)}
                  <br />
                  • Una vez confirmado el booking, no se pueden hacer cambios
                  <br />• Se generarán automáticamente los documentos aduaneros
                </AlertDescription>
              </Alert>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Próximos Pasos</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-zlc-blue-600 rounded-full"></div>
                    <span>Confirmación de booking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span>Generación de documentos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span>Notificación a proveedor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span>Seguimiento en tiempo real</span>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>¿Necesita ayuda?</strong>
                  <br />
                  Nuestro equipo de soporte está disponible 24/7 para asistirle
                  con su booking.
                  <br />
                  <Button
                    variant="link"
                    className="p-0 h-auto mt-2 text-zlc-blue-600"
                  >
                    Contactar Soporte →
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
