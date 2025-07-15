import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, ChevronDown, ChevronUp, Calculator } from "lucide-react";

interface VolumeDiscount {
  containers: number;
  discountPercentage: number;
}

interface Pricing {
  pricePerContainer: number;
  estimatedUnitPrice: number;
  currency: string;
  volumeDiscounts: VolumeDiscount[];
}

interface PricingSectionProps {
  pricing: Pricing;
  selectedContainers: number;
}

export function PricingSection({
  pricing,
  selectedContainers,
}: PricingSectionProps) {
  const [showDiscounts, setShowDiscounts] = useState(false);

  const getCurrentDiscount = () => {
    const applicableDiscounts = pricing.volumeDiscounts.filter(
      (discount) => selectedContainers >= discount.containers,
    );
    return applicableDiscounts.length > 0
      ? applicableDiscounts[applicableDiscounts.length - 1]
      : null;
  };

  const calculateDiscountedPrice = (containers: number, discount: number) => {
    return pricing.pricePerContainer * (1 - discount / 100);
  };

  const currentDiscount = getCurrentDiscount();

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Precios y Descuentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          {/* Base Pricing */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Precio por Contenedor
            </h4>
            <div className="text-3xl font-bold text-blue-600 mb-1">
              USD {pricing.pricePerContainer.toLocaleString()}
            </div>
          </div>

          {/* Unit Price */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Precio Unitario Estimado
            </h4>
            <div className="text-lg font-semibold text-gray-900">
              USD {pricing.estimatedUnitPrice.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Volume Discounts Toggle */}
        <div className="border-t pt-4">
          <Button
            variant="ghost"
            onClick={() => setShowDiscounts(!showDiscounts)}
            className="flex items-center gap-2 p-0 h-auto text-left font-semibold"
          >
            {showDiscounts ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            Descuentos por Volumen
          </Button>

          {showDiscounts && (
            <div className="mt-4">
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Contenedores
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Descuento
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Precio c/u
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pricing.volumeDiscounts.map((discount, index) => {
                      const isActive =
                        selectedContainers >= discount.containers;
                      const isCurrent = currentDiscount === discount;
                      const discountedPrice = calculateDiscountedPrice(
                        1,
                        discount.discountPercentage,
                      );

                      return (
                        <tr
                          key={index}
                          className={`${
                            isCurrent
                              ? "bg-green-50"
                              : isActive
                                ? "bg-blue-50"
                                : ""
                          }`}
                        >
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {discount.containers}+
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-green-600">
                            {discount.discountPercentage}%
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            USD {discountedPrice.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            {isCurrent && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                Aplicado
                              </Badge>
                            )}
                            {isActive && !isCurrent && (
                              <Badge variant="secondary" className="text-xs">
                                Disponible
                              </Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Calculation Summary */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-900">
                    Resumen del Cálculo
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Contenedores seleccionados:
                    </span>
                    <span className="font-medium">{selectedContainers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Precio base por contenedor:
                    </span>
                    <span className="font-medium">
                      USD {pricing.pricePerContainer.toLocaleString()}
                    </span>
                  </div>
                  {currentDiscount && (
                    <div className="flex justify-between text-green-600">
                      <span>
                        Descuento aplicado ({currentDiscount.discountPercentage}
                        %):
                      </span>
                      <span className="font-medium">
                        -USD{" "}
                        {(
                          (pricing.pricePerContainer *
                            currentDiscount.discountPercentage) /
                          100
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-blue-600">
                      USD{" "}
                      {currentDiscount
                        ? (
                            calculateDiscountedPrice(
                              1,
                              currentDiscount.discountPercentage,
                            ) * selectedContainers
                          ).toLocaleString()
                        : (
                            pricing.pricePerContainer * selectedContainers
                          ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
