import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useB2B } from "@/contexts/B2BContext";
import { PricingTier } from "@/types";
import {
  Calculator,
  TrendingDown,
  Package,
  DollarSign,
  Minus,
  Plus,
  CheckCircle,
  Info,
} from "lucide-react";

interface VolumePricingTableProps {
  productId: string;
  onPricingChange?: (calculation: any) => void;
  defaultQuantity?: number;
}

export function VolumePricingTable({
  productId,
  onPricingChange,
  defaultQuantity = 1,
}: VolumePricingTableProps) {
  const { state, loadVolumePricing, calculatePricing } = useB2B();
  const [selectedQuantity, setSelectedQuantity] = useState(defaultQuantity);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await loadVolumePricing(productId);
      setIsLoading(false);
    };
    loadData();
  }, [productId, loadVolumePricing]);

  const pricing = state.selectedPricing;
  const calculation = pricing
    ? calculatePricing(productId, selectedQuantity)
    : null;

  useEffect(() => {
    if (calculation && onPricingChange) {
      onPricingChange(calculation);
    }
  }, [calculation, onPricingChange]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setSelectedQuantity(newQuantity);
    }
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getTierStatus = (tier: PricingTier) => {
    if (
      selectedQuantity >= tier.minQuantity &&
      (tier.maxQuantity === undefined || selectedQuantity <= tier.maxQuantity)
    ) {
      return "active";
    } else if (selectedQuantity < tier.minQuantity) {
      return "future";
    } else {
      return "past";
    }
  };

  const getRowClassName = (tier: PricingTier) => {
    const status = getTierStatus(tier);
    switch (status) {
      case "active":
        return "bg-zlc-blue-50 border-zlc-blue-200 border-2";
      case "future":
        return "hover:bg-gray-50";
      case "past":
        return "opacity-60";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-zlc-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!pricing) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <Calculator className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No hay información de precios disponible</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-zlc-blue-600" />
            Seleccionar Cantidad de Contenedores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(selectedQuantity - 1)}
                disabled={selectedQuantity <= 1}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Label htmlFor="quantity" className="text-sm whitespace-nowrap">
                  Contenedores {pricing.containerType}:
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={selectedQuantity}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value) || 1)
                  }
                  className="w-20 text-center"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(selectedQuantity + 1)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {calculation && calculation.discountPercentage > 0 && (
              <Badge className="bg-green-100 text-green-800">
                <TrendingDown className="h-3 w-3 mr-1" />
                {calculation.discountPercentage}% descuento
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-zlc-blue-600" />
            Precios por Volumen de Contenedores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio por Contenedor</TableHead>
                  <TableHead>Descuento</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Ahorro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricing.tiers.map((tier, index) => {
                  const isActive = getTierStatus(tier) === "active";
                  const tierTotal = tier.pricePerContainer * selectedQuantity;
                  const baseTierTotal = pricing.basePrice * selectedQuantity;
                  const savings = baseTierTotal - tierTotal;

                  return (
                    <TableRow
                      key={index}
                      className={getRowClassName(tier)}
                      onClick={() => {
                        if (selectedQuantity < tier.minQuantity) {
                          handleQuantityChange(tier.minQuantity);
                        }
                      }}
                      style={{
                        cursor:
                          selectedQuantity < tier.minQuantity
                            ? "pointer"
                            : "default",
                      }}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {isActive && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                          <span>
                            {tier.minQuantity}
                            {tier.maxQuantity && ` - ${tier.maxQuantity}`}
                            {!tier.maxQuantity && "+"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-bold">
                            {formatCurrency(
                              tier.pricePerContainer,
                              pricing.currency,
                            )}
                          </span>
                          {tier.discountPercentage > 0 && (
                            <div className="text-xs text-gray-500">
                              Base:{" "}
                              {formatCurrency(
                                pricing.basePrice,
                                pricing.currency,
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {tier.discountPercentage > 0 ? (
                          <Badge className="bg-green-100 text-green-800">
                            -{tier.discountPercentage}%
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-bold">
                          {formatCurrency(tierTotal, pricing.currency)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {savings > 0 ? (
                          <span className="text-green-600 font-medium">
                            {formatCurrency(savings, pricing.currency)}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            * Haga clic en cualquier fila para ajustar automáticamente la
            cantidad mínima
          </div>
        </CardContent>
      </Card>

      {/* Current Calculation Summary */}
      {calculation && (
        <Card className="border-zlc-blue-200 bg-zlc-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zlc-blue-800">
              <Calculator className="h-5 w-5" />
              Resumen de Cotización
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm text-zlc-blue-600">
                  Cantidad Seleccionada
                </Label>
                <p className="font-bold text-lg text-zlc-blue-800">
                  {calculation.quantity} contenedor
                  {calculation.quantity > 1 ? "es" : ""} {pricing.containerType}
                </p>
              </div>
              <div>
                <Label className="text-sm text-zlc-blue-600">
                  Precio Unitario
                </Label>
                <p className="font-bold text-lg text-zlc-blue-800">
                  {formatCurrency(calculation.unitPrice, pricing.currency)}
                </p>
                {calculation.discountPercentage > 0 && (
                  <p className="text-xs text-green-600">
                    Precio base:{" "}
                    {formatCurrency(pricing.basePrice, pricing.currency)}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm text-zlc-blue-600">
                  Total a Pagar
                </Label>
                <p className="font-bold text-xl text-zlc-blue-800">
                  {formatCurrency(calculation.totalPrice, pricing.currency)}
                </p>
              </div>
              <div>
                <Label className="text-sm text-zlc-blue-600">
                  Ahorro Total
                </Label>
                {calculation.discountAmount > 0 ? (
                  <div>
                    <p className="font-bold text-lg text-green-600">
                      {formatCurrency(
                        calculation.discountAmount,
                        pricing.currency,
                      )}
                    </p>
                    <Badge className="text-xs bg-green-100 text-green-800">
                      {calculation.discountPercentage}% de descuento
                    </Badge>
                  </div>
                ) : (
                  <p className="text-gray-500">Sin descuento</p>
                )}
              </div>
            </div>

            {calculation.tier && calculation.tier.discountLabel && (
              <Alert className="mt-4 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>¡Descuento aplicado!</strong>{" "}
                  {calculation.tier.discountLabel}
                </AlertDescription>
              </Alert>
            )}

            {/* Next Tier Hint */}
            {(() => {
              const nextTier = pricing.tiers.find(
                (tier) => tier.minQuantity > calculation.quantity,
              );
              if (nextTier) {
                const quantityNeeded =
                  nextTier.minQuantity - calculation.quantity;
                const potentialSavings =
                  (calculation.unitPrice - nextTier.pricePerContainer) *
                  nextTier.minQuantity;

                return (
                  <Alert className="mt-4 border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Siguiente descuento:</strong> Agregue{" "}
                      {quantityNeeded} contenedor
                      {quantityNeeded > 1 ? "es" : ""} más para obtener{" "}
                      {nextTier.discountPercentage}% de descuento y ahorrar
                      hasta {formatCurrency(potentialSavings, pricing.currency)}
                    </AlertDescription>
                  </Alert>
                );
              }
              return null;
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
