import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Navigation } from "@/components/Navigation";
import { TransportComparisonTable } from "@/components/TransportComparisonTable";
import { useShipping } from "@/contexts/ShippingContext";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  Info,
  DollarSign,
  Truck,
} from "lucide-react";

export default function TransportOptions() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: shippingState, selectTransportOption } = useShipping();

  const [selectedOption, setSelectedOption] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const shippingData = location.state?.shippingData;
  const quoteId = location.state?.quoteId;

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleSelectOption = (option: any) => {
    setSelectedOption(option.id);
    selectTransportOption(option);
  };

  const handleProceedToBooking = () => {
    if (!selectedOption) return;

    const option = shippingState.transportOptions.find(
      (o) => o.id === selectedOption,
    );
    if (option) {
      navigate("/booking-confirmation", {
        state: {
          quoteId,
          shippingData,
          selectedOption: option,
        },
      });
    }
  };

  const handleRefreshOptions = async () => {
    setIsLoading(true);
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const selectedTransportOption = shippingState.transportOptions.find(
    (o) => o.id === selectedOption,
  );

  // Calculate estimated totals
  const productTotal = 15750; // This would come from cart context
  const selectedCost = selectedTransportOption?.cost || 0;
  const platformCommission = 250;
  const estimatedTotal = productTotal + selectedCost + platformCommission;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-7xl mx-auto">
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
                Opciones de Transporte Disponibles
              </h1>
              <p className="text-gray-600 mt-1">
                Paso 2 de 5: Compare y seleccione su operador logístico
                preferido
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zlc-blue-600">
                Paso 2
              </span>
              <span className="text-sm text-gray-500">40% completado</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-zlc-blue-600 h-2 rounded-full"
                style={{ width: "40%" }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-3">
              {/* Status Alert */}
              <Alert className="mb-6">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Solicitud procesada exitosamente.</strong>
                  <br />
                  Hemos recibido {shippingState.transportOptions.length}{" "}
                  cotizaciones de nuestros operadores logísticos asociados. Las
                  opciones están ordenadas por mejor valor y tiempo de tránsito.
                </AlertDescription>
              </Alert>

              {/* Shipping Summary */}
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Detalles de Envío Solicitado</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefreshOptions}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Actualizar Cotizaciones
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Contenedor</span>
                      <p className="font-medium">
                        {shippingData?.containerType}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Origen</span>
                      <p className="font-medium">Puerto de Colón</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Destino</span>
                      <p className="font-medium">
                        {shippingData?.destinationPort === "MIA" &&
                          "Puerto de Miami"}
                        {shippingData?.destinationPort === "CRI" &&
                          "Puerto Caldera"}
                        {shippingData?.destinationPort === "COL" &&
                          "Puerto de Cartagena"}
                        {shippingData?.destinationPort === "BRA" &&
                          "Puerto de Santos"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">
                        Fecha Estimada
                      </span>
                      <p className="font-medium">
                        {shippingData?.estimatedDate &&
                          new Date(
                            shippingData.estimatedDate,
                          ).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transport Options Table */}
              {shippingState.transportOptions.length > 0 ? (
                <TransportComparisonTable
                  options={shippingState.transportOptions}
                  onSelectOption={handleSelectOption}
                  selectedOptionId={selectedOption}
                />
              ) : (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Buscando Opciones de Transporte
                      </h3>
                      <p className="text-gray-600">
                        Estamos consultando con nuestros operadores logísticos
                        asociados. Esto puede tomar unos minutos...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              {selectedOption && (
                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={handleProceedToBooking}
                    className="bg-zlc-blue-600 hover:bg-zlc-blue-700 text-white px-8"
                    size="lg"
                  >
                    Proceder al Booking
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Selection Summary */}
              {selectedTransportOption && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Opción Seleccionada
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Truck className="h-4 w-4 text-zlc-blue-600" />
                          <span className="font-medium">
                            {selectedTransportOption.operatorName}
                          </span>
                        </div>
                        <Badge className="mb-2">
                          {selectedTransportOption.incoterm}
                        </Badge>
                      </div>

                      <Separator />

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Costo de Transporte:</span>
                          <span className="font-medium">
                            ${selectedTransportOption.cost.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tiempo de Tránsito:</span>
                          <span className="font-medium">
                            {selectedTransportOption.transitTime} días
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Disponibilidad:</span>
                          <span className="font-medium">
                            {new Date(
                              selectedTransportOption.availability,
                            ).toLocaleDateString("es-ES")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Cost Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Estimación de Costos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Valor de Mercancía:</span>
                      <span>${productTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Costo de Flete:</span>
                      <span
                        className={
                          selectedCost > 0 ? "font-medium" : "text-gray-400"
                        }
                      >
                        {selectedCost > 0
                          ? `$${selectedCost.toLocaleString()}`
                          : "Por determinar"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Comisión Plataforma:</span>
                      <span>${platformCommission.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium text-base">
                      <span>Total Estimado:</span>
                      <span
                        className={
                          selectedCost > 0
                            ? "text-zlc-blue-600"
                            : "text-gray-400"
                        }
                      >
                        {selectedCost > 0
                          ? `$${estimatedTotal.toLocaleString()}`
                          : "Por calcular"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Help Information */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>¿Necesita ayuda?</strong>
                  <br />
                  Nuestros asesores pueden ayudarle a evaluar las mejores
                  opciones según sus necesidades específicas.
                  <br />
                  <Button
                    variant="link"
                    className="p-0 h-auto mt-2 text-zlc-blue-600"
                  >
                    Contactar Asesor →
                  </Button>
                </AlertDescription>
              </Alert>

              {/* Incoterms Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Guía de Incoterms</CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2">
                  <div>
                    <span className="font-medium">FOB:</span> Vendedor se hace
                    cargo hasta puerto de origen
                  </div>
                  <div>
                    <span className="font-medium">CFR:</span> Vendedor paga
                    flete, comprador asume riesgo
                  </div>
                  <div>
                    <span className="font-medium">CIF:</span> Vendedor paga
                    flete y seguro hasta destino
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
