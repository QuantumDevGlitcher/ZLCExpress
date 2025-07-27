import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useToast } from "@/hooks/use-toast";
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
  Ship,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Cart() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    state,
    removeItem,
    updateQuantity,
    clearCart,
    sendQuote,
    loadCart,
    canSendQuote,
  } = useCart();
  
  const [paymentConditions, setPaymentConditions] = useState("");
  const [purchaseOrderFile, setPurchaseOrderFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const [isClearing, setIsClearing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar el carrito al inicializar
  useEffect(() => {
    loadCart();
  }, []); // Eliminar loadCart de las dependencias para evitar bucle infinito

  // Debug: Log cart items to see what data we're getting
  useEffect(() => {
    console.log('🛒 Cart state.items:', state.items);
    console.log('🚛 Current freight quote:', state.currentFreightQuote);
    state.items.forEach((item, index) => {
      console.log(`Item ${index}:`, {
        id: item.id,
        productTitle: item.productTitle,
        pricePerContainer: item.pricePerContainer,
        customPrice: item.customPrice,
        currency: item.currency,
        quantity: item.quantity
      });
    });
  }, [state.items, state.currentFreightQuote]);

  const platformCommission = 250; // Fixed platform commission
  const subtotal = state.items.reduce((total, item) => {
    return total + item.pricePerContainer * item.quantity;
  }, 0);
  
  // Usar el flete del contexto únicamente (no entrada manual)
  const freightCost = state.currentFreightQuote?.cost || 0;
  const grandTotal = subtotal + freightCost + platformCommission;

  const handleQuantityChange = async (itemId: string, change: number) => {
    const item = state.items.find((i) => i.id === itemId);
    if (!item || loadingItems.has(itemId)) return;
    
    const newQuantity = Math.max(1, item.quantity + change);
    if (newQuantity === item.quantity) return; // No cambiar si es la misma cantidad
    
    console.log('🔄 Starting quantity change:', { itemId, currentQuantity: item.quantity, newQuantity });
    
    // Agregar el item al conjunto de carga
    setLoadingItems(prev => new Set(prev).add(itemId));
    
    try {
      console.log('📡 Calling updateQuantity API...');
      await updateQuantity(itemId, newQuantity);
      console.log('✅ Quantity updated successfully');
      toast({
        title: "Cantidad actualizada",
        description: `Se actualizó la cantidad a ${newQuantity} contenedor${newQuantity > 1 ? 'es' : ''}`,
      });
    } catch (error) {
      console.error('❌ Error updating quantity:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la cantidad",
        variant: "destructive",
      });
    } finally {
      // Remover el item del conjunto de carga
      setLoadingItems(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        console.log('🧹 Removed from loading set:', itemId);
        return next;
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (loadingItems.has(itemId)) return;
    
    // Agregar el item al conjunto de carga
    setLoadingItems(prev => new Set(prev).add(itemId));
    
    try {
      await removeItem(itemId);
      toast({
        title: "Producto eliminado",
        description: "El producto se eliminó del carrito",
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      });
      // Remover del conjunto de carga en caso de error
      setLoadingItems(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
    // No removemos del loadingItems aquí porque el item será eliminado del carrito
  };

  const handleClearCart = async () => {
    if (isClearing) return;
    
    setIsClearing(true);
    try {
      await clearCart();
      toast({
        title: "Carrito vaciado",
        description: "Se eliminaron todos los productos del carrito",
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "No se pudo vaciar el carrito",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
      setLoadingItems(new Set()); // Limpiar el estado de carga
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPurchaseOrderFile(file);
    }
  };

  const handleSendQuote = async () => {
    if (state.items.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agregue productos al carrito antes de solicitar cotización",
        variant: "destructive",
      });
      return;
    }

    if (!paymentConditions) {
      toast({
        title: "Condiciones de pago requeridas",
        description: "Seleccione las condiciones de pago",
        variant: "destructive",
      });
      setShowPaymentOptions(true);
      return;
    }

    setIsSubmitting(true);

    try {
      await sendQuote({
        totalAmount: grandTotal,
        paymentConditions,
        purchaseOrderFile,
        freightEstimate: freightCost,
        freightQuote: state.currentFreightQuote, // Incluir la información completa del flete
        platformCommission,
        notes,
      });

      toast({
        title: "Cotización enviada",
        description: "Su solicitud de cotización ha sido enviada a los proveedores",
      });

      // Redirigir a página de cotizaciones
      navigate('/my-quotes');
    } catch (error) {
      toast({
        title: "Error al enviar cotización",
        description: "No se pudo enviar la solicitud. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFreightQuote = () => {
    // Navegar a página de cotización de flete
    navigate('/shipping-request', { 
      state: { 
        cartItems: state.items,
        totalValue: subtotal 
      } 
    });
  };

  // Empty cart state
  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-zlc-gray-50">
        <Navigation />
        <main className="pt-14 sm:pt-16 md:pt-20">
          <div className="container-section py-16 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Su carrito está vacío
            </h1>
            <p className="text-gray-600 mb-8">
              Explore nuestro catálogo y agregue productos para solicitar
              cotizaciones
            </p>
            <Button asChild className="btn-professional bg-white text-black hover:bg-gray-100">
              <Link to="/categories">
                <Package className="h-4 w-4 mr-2" />
                Explorar Catálogo
              </Link>
            </Button>
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
              onClick={handleClearCart}
              disabled={isClearing || state.isLoading}
              className="bg-white text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50"
            >
              {isClearing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
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
                    <div key={item.id} className="border border-white rounded-lg p-4">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {item.productImage ? (
                            <img
                              src={item.productImage}
                              alt={item.productTitle}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900 line-clamp-2">
                                {item.productTitle}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Building className="h-3 w-3 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {item.supplier}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="text-xs px-1 py-0 border-black"
                                >
                                  {item.containerType}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                              disabled={loadingItems.has(item.id) || state.isLoading}
                            >
                              {loadingItems.has(item.id) ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Quantity */}
                            <div>
                              <Label className="text-xs text-gray-500">
                                Cantidad (Contenedores)
                              </Label>
                              <div className="flex items-center space-x-2 mt-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleQuantityChange(item.id, -1)
                                  }
                                  disabled={item.quantity <= 1 || loadingItems.has(item.id)}
                                  className="h-8 w-8 p-0 bg-white border-white hover:bg-gray-100 hover:border-gray-200 disabled:opacity-50"
                                >
                                  {loadingItems.has(item.id) ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Minus className="h-3 w-3" />
                                  )}
                                </Button>
                                <span className="font-medium w-8 text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleQuantityChange(item.id, 1)
                                  }
                                  disabled={loadingItems.has(item.id)}
                                  className="h-8 w-8 p-0 bg-white border-white hover:bg-gray-100 hover:border-gray-200 disabled:opacity-50"
                                >
                                  {loadingItems.has(item.id) ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Plus className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                            </div>

                            {/* Price per Container */}
                            <div>
                              <Label className="text-xs text-gray-500">
                                Precio por Contenedor ({item.currency})
                              </Label>
                              <Input
                                type="number"
                                value={item.pricePerContainer}
                                readOnly
                                disabled
                                className="h-8 text-sm mt-1 bg-gray-100 border-gray-300 cursor-not-allowed"
                                placeholder="Precio fijo del proveedor"
                              />
                              <p className="text-xs text-gray-400 mt-1">
                                Precio establecido por el proveedor
                              </p>
                            </div>

                            {/* Total */}
                            <div>
                              <Label className="text-xs text-gray-500">
                                Total Línea
                              </Label>
                              <div className="mt-1">
                                <span className="font-bold text-lg text-zlc-blue-600">
                                  $
                                  {(item.pricePerContainer * item.quantity).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-xs text-gray-500">
                            Incoterm: {item.incoterm} | MOQ:{" "}
                            {item.quantity * 20}+ unidades
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Payment Conditions */}
              <Card className={cn(showPaymentOptions && !paymentConditions && "ring-2 ring-red-500")}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-zlc-blue-600" />
                    Condiciones de Pago *
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={paymentConditions}
                    onValueChange={(value) => {
                      setPaymentConditions(value);
                      setShowPaymentOptions(false);
                    }}
                  >
                    <SelectTrigger className={cn(
                      "bg-white border-white",
                      showPaymentOptions && !paymentConditions && "border-red-500"
                    )}>
                      <SelectValue placeholder="Seleccione condiciones de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30-70-bl">
                        <div className="space-y-1">
                          <div className="font-medium">30% Anticipo - 70% contra B/L</div>
                          <div className="text-xs text-gray-500">30% adelantado, 70% al recibir conocimiento de embarque</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="letter-credit">
                        <div className="space-y-1">
                          <div className="font-medium">Carta de Crédito (L/C)</div>
                          <div className="text-xs text-gray-500">Pago seguro mediante carta de crédito irrevocable</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="50-50">
                        <div className="space-y-1">
                          <div className="font-medium">50% Anticipo - 50% contra Embarque</div>
                          <div className="text-xs text-gray-500">50% adelantado, 50% antes del embarque</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="prepaid">
                        <div className="space-y-1">
                          <div className="font-medium">Pago Total Anticipado</div>
                          <div className="text-xs text-gray-500">100% pagado antes de la producción</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="custom">
                        <div className="space-y-1">
                          <div className="font-medium">Condiciones Personalizadas</div>
                          <div className="text-xs text-gray-500">Términos específicos a negociar</div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {showPaymentOptions && !paymentConditions && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      Las condiciones de pago son requeridas
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Las condiciones finales serán negociadas con cada proveedor
                  </p>
                </CardContent>
              </Card>

              {/* Purchase Order Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Orden de Compra (Opcional)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-white border-black"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Orden de Compra
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">
                      Formatos aceptados: PDF, DOC, XLS (máx. 10MB)
                    </p>
                  </div>

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
                    className="min-h-24 bg-white border-black"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Summary & Actions */}
            <div className="space-y-6">
              {/* Freight Estimate */}
              <Card className={cn(
                !state.currentFreightQuote && "border-red-200 bg-red-50"
              )}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-zlc-blue-600" />
                    Estimación de Flete 
                    <span className="text-red-500 ml-1">*</span>
                    <span className="text-xs font-normal text-gray-500 ml-2">(Requerido)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {state.currentFreightQuote ? (
                    <div className="space-y-3">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-green-800">
                              Flete Calculado
                            </h4>
                            <p className="text-sm text-green-600">
                              {state.currentFreightQuote.selectedCarrier?.name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-800">
                              ${state.currentFreightQuote.cost.toLocaleString()} USD
                            </p>
                            <p className="text-xs text-green-600">
                              {state.currentFreightQuote.selectedCarrier?.transitTime} días
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-green-600">
                          <strong>Ruta:</strong> {state.currentFreightQuote.origin} → {state.currentFreightQuote.destination}
                        </div>
                        <div className="text-xs text-green-600">
                          <strong>Contenedor:</strong> {state.currentFreightQuote.containerType}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleFreightQuote}
                        className="w-full"
                        size="sm"
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        Cambiar Cotización de Flete
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                        <h4 className="font-medium text-red-800 mb-1">
                          Cotización de Flete Requerida
                        </h4>
                        <p className="text-sm text-red-600 mb-3">
                          Debe calcular el costo de flete antes de enviar la solicitud de cotización
                        </p>
                        <Button
                          variant="default"
                          onClick={handleFreightQuote}
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Calculator className="h-4 w-4 mr-2" />
                          Calcular Flete Ahora
                        </Button>
                        <p className="text-xs text-red-500 mt-2">
                          Obtenga cotizaciones oficiales de múltiples transportistas
                        </p>
                      </div>
                    </div>
                  )}
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
                      <span className={cn(
                        "text-gray-600 flex items-center",
                        !state.currentFreightQuote && "text-red-600"
                      )}>
                        {state.currentFreightQuote ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                            Flete Calculado:
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 mr-1 text-red-600" />
                            Flete Pendiente:
                          </>
                        )}
                      </span>
                      <span className={cn(
                        "font-medium",
                        !state.currentFreightQuote && "text-red-600"
                      )}>
                        {state.currentFreightQuote ? (
                          `$${freightCost.toLocaleString()}`
                        ) : (
                          "Por calcular"
                        )}
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

                    <div className="flex justify-between text-lg">
                      <span className="font-semibold">Total Estimado:</span>
                      <span className="font-bold text-zlc-blue-600">
                        ${grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Alert className="bg-white border-white">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Los precios finales pueden variar según las condiciones
                      acordadas con cada proveedor
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle>Enviar Solicitud</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <Button
                      variant="outline"
                      onClick={handleClearCart}
                      disabled={isSubmitting || state.isLoading || isClearing}
                      className="text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50"
                    >
                      {isClearing ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Vaciar Carrito
                    </Button>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Estimado</p>
                      <p className="text-xl font-bold text-green-600">
                        ${grandTotal.toLocaleString()} USD
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleSendQuote}
                    disabled={
                      isSubmitting ||
                      state.items.length === 0 ||
                      !paymentConditions ||
                      !state.currentFreightQuote
                    }
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Enviando Solicitud...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Enviar Solicitud de Cotización
                      </>
                    )}
                  </Button>

                  {/* Validation Messages */}
                  {(state.items.length === 0 || !paymentConditions || !state.currentFreightQuote) && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                      <div className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                        <div className="text-sm text-amber-800">
                          <p className="font-medium mb-1">Para enviar la solicitud, complete:</p>
                          <ul className="text-xs space-y-1">
                            {state.items.length === 0 && (
                              <li>• Agregue al menos un producto al carrito</li>
                            )}
                            {!paymentConditions && (
                              <li>• Seleccione las condiciones de pago</li>
                            )}
                            {!state.currentFreightQuote && (
                              <li className="font-medium text-amber-900">• Calcule la cotización de flete (requerido)</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-2">
                      Al enviar, generaremos una Orden Proforma que será enviada a
                      los proveedores correspondientes.
                    </div>
                    <Button
                      variant="link"
                      onClick={() => navigate('/my-quotes')}
                      className="text-xs text-blue-600 h-auto p-0"
                    >
                      Ver mis solicitudes anteriores
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
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
                      <p className="text-green-800">
                        Sus datos están protegidos y solo serán compartidos con
                        proveedores verificados en ZLC.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
