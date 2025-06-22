import { useState, useRef } from "react";
import { Link } from "react-router-dom";
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
import { useCart } from "@/contexts/CartContext";
import {
  ArrowLeft,
  Package,
  Building,
  Trash2,
  Upload,
  FileText,
  Calculator,
  Send,
  Truck,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Plus,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Cart() {
  const {
    state,
    removeItem,
    updateQuantity,
    updateCustomPrice,
    clearCart,
    sendQuote,
  } = useCart();
  const [paymentConditions, setPaymentConditions] = useState("");
  const [purchaseOrderFile, setPurchaseOrderFile] = useState<File | null>(null);
  const [freightEstimate, setFreightEstimate] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const platformCommission = 250; // Fixed platform commission
  const subtotal = state.items.reduce((total, item) => {
    const price = item.customPrice || item.pricePerContainer;
    return total + price * item.quantity;
  }, 0);
  const grandTotal = subtotal + freightEstimate + platformCommission;

  const handleQuantityChange = (itemId: string, change: number) => {
    const item = state.items.find((i) => i.id === itemId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCustomPriceChange = (itemId: string, value: string) => {
    const price = parseFloat(value) || 0;
    updateCustomPrice(itemId, price);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPurchaseOrderFile(file);
    }
  };

  const handleSendQuote = async () => {
    if (state.items.length === 0) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    sendQuote({
      totalAmount: grandTotal,
      paymentConditions,
      purchaseOrderFile,
      freightEstimate,
      platformCommission,
      notes,
    });

    setIsSubmitting(false);

    // Reset form
    setPaymentConditions("");
    setPurchaseOrderFile(null);
    setFreightEstimate(0);
    setNotes("");

    // Show success message (you could use a toast here)
    alert("¡Solicitud de cotización enviada exitosamente!");
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-zlc-gray-50">
        <Navigation />
        <main className="pt-14 sm:pt-16 md:pt-20">
          <div className="container-section py-12">
            <div className="max-w-4xl mx-auto text-center">
              <Package className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Tu carrito está vacío
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Explora nuestro catálogo y agrega productos para solicitar
                cotizaciones
              </p>
              <Button asChild className="bg-zlc-blue-600 hover:bg-zlc-blue-700">
                <Link to="/categories">Explorar Productos</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zlc-gray-50">
      <Navigation />

      <main className="pt-14 sm:pt-16 md:pt-20">
        <div className="container-section py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/categories">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continuar Comprando
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Solicitud de Cotización
                </h1>
                <p className="text-gray-600">
                  {state.items.length} producto
                  {state.items.length !== 1 ? "s" : ""} •{" "}
                  {state.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  contenedor
                  {state.items.reduce((sum, item) => sum + item.quantity, 0) !==
                  1
                    ? "es"
                    : ""}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Vaciar Carrito
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2 text-zlc-blue-600" />
                    Productos Seleccionados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex gap-4">
                        <img
                          src={item.productImage}
                          alt={item.productTitle}
                          className="w-20 h-20 object-cover rounded-lg"
                        />

                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {item.productTitle}
                              </h3>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <Building className="h-3 w-3 mr-1" />
                                {item.supplier}
                              </div>
                              <div className="flex items-center space-x-4 mt-2">
                                <Badge variant="outline">
                                  {item.containerType}
                                </Badge>
                                <Badge variant="outline">{item.incoterm}</Badge>
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Quantity */}
                            <div>
                              <Label className="text-sm">Contenedores</Label>
                              <div className="flex items-center space-x-2 mt-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleQuantityChange(item.id, -1)
                                  }
                                  disabled={item.quantity <= 1}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateQuantity(
                                      item.id,
                                      parseInt(e.target.value) || 1,
                                    )
                                  }
                                  className="h-8 w-16 text-center"
                                  min="1"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleQuantityChange(item.id, 1)
                                  }
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Price per Container */}
                            <div>
                              <Label className="text-sm">
                                Precio por Contenedor
                              </Label>
                              <div className="mt-1">
                                <Input
                                  type="number"
                                  placeholder={`${item.pricePerContainer}`}
                                  value={item.customPrice || ""}
                                  onChange={(e) =>
                                    handleCustomPriceChange(
                                      item.id,
                                      e.target.value,
                                    )
                                  }
                                  className="h-8"
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                  Precio base: $
                                  {item.pricePerContainer.toLocaleString()}
                                </div>
                              </div>
                            </div>

                            {/* Subtotal */}
                            <div>
                              <Label className="text-sm">Subtotal</Label>
                              <div className="mt-1">
                                <div className="h-8 flex items-center">
                                  <span className="font-semibold text-lg text-zlc-blue-900">
                                    $
                                    {(
                                      (item.customPrice ||
                                        item.pricePerContainer) * item.quantity
                                    ).toLocaleString()}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {item.currency}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Payment Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-zlc-blue-600" />
                    Condiciones de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="payment">Condiciones Deseadas</Label>
                    <Select
                      value={paymentConditions}
                      onValueChange={setPaymentConditions}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione condiciones de pago" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30-70-bl">
                          30% Anticipo, 70% contra BL
                        </SelectItem>
                        <SelectItem value="50-50-bl">
                          50% Anticipo, 50% contra BL
                        </SelectItem>
                        <SelectItem value="lc-sight">
                          Carta de Crédito a la Vista
                        </SelectItem>
                        <SelectItem value="lc-30">
                          Carta de Crédito 30 días
                        </SelectItem>
                        <SelectItem value="100-advance">
                          100% Anticipo
                        </SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {paymentConditions === "custom" && (
                    <div>
                      <Label htmlFor="customPayment">
                        Condiciones Personalizadas
                      </Label>
                      <Textarea
                        id="customPayment"
                        placeholder="Describa sus condiciones de pago deseadas..."
                        className="min-h-20"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Purchase Order Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-zlc-blue-600" />
                    Orden de Compra (Opcional)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-zlc-blue-400 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {purchaseOrderFile
                          ? `Archivo seleccionado: ${purchaseOrderFile.name}`
                          : "Haga clic para adjuntar su Orden de Compra oficial (PDF, Word)"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Máximo 10MB</p>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {purchaseOrderFile && (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-sm text-green-800">
                            {purchaseOrderFile.name}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPurchaseOrderFile(null)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Notas Adicionales</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Requisitos especiales, comentarios sobre entrega, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-24"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Summary & Actions */}
            <div className="space-y-6">
              {/* Freight Estimate */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-zlc-blue-600" />
                    Estimación de Flete
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="freight">Costo de Flete (USD)</Label>
                    <Input
                      id="freight"
                      type="number"
                      placeholder="0"
                      value={freightEstimate || ""}
                      onChange={(e) =>
                        setFreightEstimate(parseFloat(e.target.value) || 0)
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Ingrese el costo si ya tiene cotización de flete
                    </p>
                  </div>

                  <Button variant="outline" className="w-full">
                    Solicitar Cotización de Flete
                  </Button>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-zlc-blue-600" />
                    Resumen del Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal Productos:</span>
                      <span className="font-medium">
                        ${subtotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Flete Estimado:</span>
                      <span className="font-medium">
                        ${freightEstimate.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Comisión Plataforma:
                      </span>
                      <span className="font-medium">
                        ${platformCommission.toLocaleString()}
                      </span>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">
                        Total Estimado:
                      </span>
                      <span className="text-xl font-bold text-zlc-blue-900">
                        ${grandTotal.toLocaleString()} USD
                      </span>
                    </div>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Este es un estimado. El precio final será confirmado por
                      el proveedor en la cotización oficial.
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={handleSendQuote}
                    disabled={isSubmitting || !paymentConditions}
                    className="w-full bg-zlc-blue-600 hover:bg-zlc-blue-700 h-12"
                  >
                    {isSubmitting ? (
                      "Enviando..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Solicitud de Cotización
                      </>
                    )}
                  </Button>

                  <div className="text-xs text-gray-500 text-center">
                    Al enviar, generaremos una Orden Proforma que será enviada a
                    los proveedores correspondientes.
                  </div>
                </CardContent>
              </Card>

              {/* Security Info */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-green-900 mb-1">
                        Proceso Seguro
                      </p>
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  {/* Shipping Request Button */}
                  <Link
                    to="/shipping-request"
                    state={{ quoteId: `quote-${Date.now()}` }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-zlc-blue-600 text-zlc-blue-600 hover:bg-zlc-blue-50"
                    >
                      <Truck className="mr-2 h-4 w-4" />
                      Solicitar Envío
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
  );
}