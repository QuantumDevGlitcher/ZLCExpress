import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  FileText,
  Package,
  Calendar,
  DollarSign,
  Ship,
  MessageSquare,
  Clock,
  Download,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { useB2B } from "@/contexts/B2BContext";

const SupplierRFQResponse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addRFQQuote } = useB2B();

  // Form state
  const [responseType, setResponseType] = useState<
    "quote" | "counter" | "reject"
  >("quote");
  const [containersConfirmed, setContainersConfirmed] = useState<number>(0);
  const [pricePerContainer, setPricePerContainer] = useState<number>(0);
  const [incoterm, setIncoterm] = useState<string>("");
  const [productionTime, setProductionTime] = useState<number>(25);
  const [shippingTime, setShippingTime] = useState<number>(15);
  const [freightCost, setFreightCost] = useState<number>(0);
  const [paymentTerms, setPaymentTerms] = useState<string>(
    "30% advance, 70% before shipment",
  );
  const [specialConditions, setSpecialConditions] = useState<string>("");
  const [rejectionReason, setRejectionReason] = useState<string>("");

  // Mock RFQ data - in real app, this would be fetched from API
  const rfqData = {
    id: "RFQ-001",
    rfqNumber: "RFQ-2024-001",
    buyerCompany: "Comercial Los Andes S.A.",
    buyerContact: "María González",
    buyerEmail: "maria.gonzalez@losandes.com",
    productTitle: "Camisa de Algodón Premium",
    productCode: "CAM-ALG-20GP-0500",
    containerQuantity: 2,
    containerType: "20'" as const,
    incoterm: "FOB" as const,
    requestedDelivery: new Date("2024-03-15"),
    specialRequirements:
      "Empaque premium, etiquetas personalizadas, certificado de calidad incluido",
    logisticsComments:
      "Preferencia por naviera Evergreen o COSCO. Puerto de destino: Puerto Caldera, Costa Rica.",
    receivedAt: new Date("2024-01-15"),
    validUntil: new Date("2024-02-15"),
    basePrice: 9800, // Price per container from product catalog
    status: "pending" as const,
  };

  // Negotiation history
  const negotiationHistory = [
    {
      id: "1",
      type: "initial_request" as const,
      sender: "buyer",
      senderName: "María González",
      timestamp: new Date("2024-01-15T10:30:00"),
      message:
        "Solicito cotización para 2 contenedores de 20' con las especificaciones mencionadas. Necesitamos entrega para mediados de marzo.",
      details: {
        quantity: 2,
        incoterm: "FOB",
        delivery: "2024-03-15",
      },
    },
  ];

  useEffect(() => {
    if (rfqData) {
      setContainersConfirmed(rfqData.containerQuantity);
      setPricePerContainer(rfqData.basePrice);
      setIncoterm(rfqData.incoterm);
    }
  }, []);

  const calculateTotalPrice = () => {
    const subtotal = containersConfirmed * pricePerContainer;
    const freight =
      responseType === "quote" && incoterm.includes("CIF") ? freightCost : 0;
    return subtotal + freight;
  };

  const calculateDeliveryDate = () => {
    const today = new Date();
    const totalDays = productionTime + shippingTime;
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + totalDays);
    return deliveryDate;
  };

  const generateProformaInvoice = () => {
    toast({
      title: "Generando Proforma",
      description: "El documento PDF se está generando...",
    });

    // Simulate document generation
    setTimeout(() => {
      toast({
        title: "Proforma Generada",
        description: "El documento está listo para descargar.",
      });
    }, 2000);
  };

  const handleSubmitResponse = () => {
    if (responseType === "reject") {
      if (!rejectionReason.trim()) {
        toast({
          title: "Error",
          description: "Debe indicar el motivo del rechazo.",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!containersConfirmed || !pricePerContainer || !incoterm) {
        toast({
          title: "Error",
          description: "Complete todos los campos requeridos.",
          variant: "destructive",
        });
        return;
      }
    }

    const newQuote = {
      id: `quote-${Date.now()}`,
      rfqId: rfqData.id,
      supplierId: "supplier-1",
      quoteNumber: `COT-${rfqData.rfqNumber}-001`,
      unitPrice: pricePerContainer,
      totalPrice: calculateTotalPrice(),
      currency: "USD",
      incoterm: incoterm as "FOB" | "CIF" | "CFR" | "EXW",
      leadTime: productionTime + shippingTime,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      paymentTerms,
      specialConditions,
      isCounterOffer: responseType === "counter",
      status: "sent" as const,
      createdAt: new Date(),
    };

    // addRFQQuote(rfqData.id, newQuote);

    let title = "";
    let description = "";

    switch (responseType) {
      case "quote":
        title = "Cotización Enviada";
        description = "Su cotización formal ha sido enviada al comprador.";
        break;
      case "counter":
        title = "Contraoferta Enviada";
        description = "Su contraoferta ha sido enviada al comprador.";
        break;
      case "reject":
        title = "RFQ Rechazada";
        description = "El rechazo ha sido notificado al comprador.";
        break;
    }

    toast({
      title,
      description,
    });

    navigate("/supplier/rfqs");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-14 sm:pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => navigate("/supplier/rfqs")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a RFQs
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              Responder Cotización - {rfqData.rfqNumber}
            </h1>
            <p className="text-gray-600 mt-1">
              Revisar solicitud y enviar respuesta formal
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* RFQ Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Request Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Detalles de la Solicitud
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Comprador
                      </Label>
                      <p className="font-medium">{rfqData.buyerCompany}</p>
                      <p className="text-sm text-gray-600">
                        {rfqData.buyerContact} • {rfqData.buyerEmail}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Producto Solicitado
                      </Label>
                      <p className="font-medium">{rfqData.productTitle}</p>
                      <p className="text-sm text-gray-600">
                        Código: {rfqData.productCode}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Cantidad Solicitada
                      </Label>
                      <p className="font-medium">
                        {rfqData.containerQuantity} contenedores (
                        {rfqData.containerType})
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Incoterm Solicitado
                      </Label>
                      <Badge variant="outline">{rfqData.incoterm}</Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Entrega Solicitada
                      </Label>
                      <p className="font-medium">
                        {rfqData.requestedDelivery.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Válida Hasta
                      </Label>
                      <p className="font-medium text-orange-600">
                        {rfqData.validUntil.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {rfqData.specialRequirements && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Requerimientos Especiales
                      </Label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-md">
                        {rfqData.specialRequirements}
                      </p>
                    </div>
                  )}

                  {rfqData.logisticsComments && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Comentarios de Logística
                      </Label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-md">
                        {rfqData.logisticsComments}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Response Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Tipo de Respuesta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant={responseType === "quote" ? "default" : "outline"}
                      onClick={() => setResponseType("quote")}
                      className="p-6 h-auto"
                    >
                      <div className="text-center">
                        <CheckCircle className="h-6 w-6 mx-auto mb-2" />
                        <div className="font-medium">Cotización Formal</div>
                        <div className="text-sm opacity-70">
                          Aceptar términos y enviar precio
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant={
                        responseType === "counter" ? "default" : "outline"
                      }
                      onClick={() => setResponseType("counter")}
                      className="p-6 h-auto"
                    >
                      <div className="text-center">
                        <MessageSquare className="h-6 w-6 mx-auto mb-2" />
                        <div className="font-medium">Contraoferta</div>
                        <div className="text-sm opacity-70">
                          Proponer términos diferentes
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant={
                        responseType === "reject" ? "destructive" : "outline"
                      }
                      onClick={() => setResponseType("reject")}
                      className="p-6 h-auto"
                    >
                      <div className="text-center">
                        <X className="h-6 w-6 mx-auto mb-2" />
                        <div className="font-medium">Rechazar RFQ</div>
                        <div className="text-sm opacity-70">
                          No puedo cumplir la solicitud
                        </div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quote Form */}
              {responseType !== "reject" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      {responseType === "counter"
                        ? "Detalles de Contraoferta"
                        : "Detalles de Cotización"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="containers">
                          Contenedores Disponibles
                        </Label>
                        <Input
                          id="containers"
                          type="number"
                          value={containersConfirmed}
                          onChange={(e) =>
                            setContainersConfirmed(Number(e.target.value))
                          }
                          min="1"
                          max={rfqData.containerQuantity}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Máximo: {rfqData.containerQuantity} contenedores
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="price">
                          Precio por Contenedor (USD)
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          value={pricePerContainer}
                          onChange={(e) =>
                            setPricePerContainer(Number(e.target.value))
                          }
                          min="0"
                          step="100"
                        />
                      </div>
                      <div>
                        <Label htmlFor="incoterm">Incoterm Ofrecido</Label>
                        <Select value={incoterm} onValueChange={setIncoterm}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar Incoterm" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FOB">
                              FOB - Free On Board
                            </SelectItem>
                            <SelectItem value="CIF">
                              CIF - Cost, Insurance & Freight
                            </SelectItem>
                            <SelectItem value="CFR">
                              CFR - Cost & Freight
                            </SelectItem>
                            <SelectItem value="EXW">EXW - Ex Works</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="production">
                          Tiempo de Producción (días)
                        </Label>
                        <Input
                          id="production"
                          type="number"
                          value={productionTime}
                          onChange={(e) =>
                            setProductionTime(Number(e.target.value))
                          }
                          min="1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="shipping">
                          Tiempo de Embarque (días)
                        </Label>
                        <Input
                          id="shipping"
                          type="number"
                          value={shippingTime}
                          onChange={(e) =>
                            setShippingTime(Number(e.target.value))
                          }
                          min="1"
                        />
                      </div>
                      {incoterm.includes("CIF") && (
                        <div>
                          <Label htmlFor="freight">
                            Costo de Flete Estimado (USD)
                          </Label>
                          <Input
                            id="freight"
                            type="number"
                            value={freightCost}
                            onChange={(e) =>
                              setFreightCost(Number(e.target.value))
                            }
                            min="0"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="payment">Términos de Pago</Label>
                      <Textarea
                        id="payment"
                        value={paymentTerms}
                        onChange={(e) => setPaymentTerms(e.target.value)}
                        placeholder="Ej: 30% adelanto, 70% antes del embarque"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="conditions">
                        Condiciones Especiales (Opcional)
                      </Label>
                      <Textarea
                        id="conditions"
                        value={specialConditions}
                        onChange={(e) => setSpecialConditions(e.target.value)}
                        placeholder="Condiciones adicionales, descuentos, garantías, etc."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Rejection Form */}
              {responseType === "reject" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <X className="h-5 w-5" />
                      Motivo de Rechazo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="rejection">
                        Indique el motivo del rechazo
                      </Label>
                      <Textarea
                        id="rejection"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Ej: No tenemos stock suficiente, fechas de entrega no compatibles, especificaciones no disponibles..."
                        rows={4}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quote Summary */}
              {responseType !== "reject" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Resumen de Cotización
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contenedores:</span>
                      <span className="font-medium">{containersConfirmed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Precio unitario:</span>
                      <span className="font-medium">
                        ${pricePerContainer.toLocaleString()}
                      </span>
                    </div>
                    {incoterm.includes("CIF") && freightCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Flete:</span>
                        <span className="font-medium">
                          ${freightCost.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">
                        ${calculateTotalPrice().toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Entrega estimada:{" "}
                        {calculateDeliveryDate().toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Ship className="h-4 w-4" />
                        Tiempo total: {productionTime + shippingTime} días
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Document Generation */}
              {responseType !== "reject" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Documentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={generateProformaInvoice}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generar Proforma
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Se generará automáticamente el documento PDF con los
                      detalles de la cotización
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Negotiation History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Historial de Negociación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {negotiationHistory.map((item) => (
                      <div
                        key={item.id}
                        className="border-l-2 border-blue-200 pl-3"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{item.senderName}</span>
                          <span className="text-gray-500">
                            {item.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">
                          {item.message}
                        </p>
                        {item.details && (
                          <div className="text-xs text-gray-500 mt-2">
                            Cantidad: {item.details.quantity} •{" "}
                            {item.details.incoterm} • Entrega:{" "}
                            {item.details.delivery}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Button
                      className="w-full"
                      onClick={handleSubmitResponse}
                      disabled={
                        responseType === "reject" && !rejectionReason.trim()
                      }
                    >
                      {responseType === "quote" && "Enviar Cotización"}
                      {responseType === "counter" && "Enviar Contraoferta"}
                      {responseType === "reject" && "Rechazar RFQ"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate("/supplier/rfqs")}
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierRFQResponse;
