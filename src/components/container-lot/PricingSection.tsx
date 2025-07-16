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
    <Card className="mb-8 bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-900 text-lg font-semibold">
          <DollarSign className="h-5 w-5 text-gray-700" />
          Precios y Descuentos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Base Pricing */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              Precio por Contenedor
            </h4>
            <div className="text-2xl font-bold text-blue-600">
              USD {pricing.pricePerContainer.toLocaleString()}
            </div>
          </div>

          {/* Unit Price */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              Precio Unitario Estimado
            </h4>
            <div className="text-lg font-semibold text-gray-900">
              USD {pricing.estimatedUnitPrice.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Volume Discounts Toggle */}
        <div>
          <Button
            variant="ghost"
            onClick={() => setShowDiscounts(!showDiscounts)}
            className="flex items-center gap-2 p-0 h-auto text-left font-medium text-gray-900 hover:text-gray-700"
          >
            {showDiscounts ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            Descuentos por Volumen
          </Button>

          {showDiscounts && (
            <div className="mt-4 space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Contenedores
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Descuento
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Precio c/u
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
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
                          className={`hover:bg-gray-50 ${
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
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Resumen del Cálculo
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Contenedores seleccionados:
                    </span>
                    <span className="font-medium text-gray-900">
                      {selectedContainers}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Precio base por contenedor:
                    </span>
                    <span className="font-medium text-gray-900">
                      USD {pricing.pricePerContainer.toLocaleString()}
                    </span>
                  </div>
                  {currentDiscount && (
                    <div className="flex justify-between text-sm text-green-600">
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
                  <div className="border-t border-gray-200 pt-2 mt-3">
                    <div className="flex justify-between">
                      <span className="text-base font-semibold text-gray-900">
                        Total:
                      </span>
                      <span className="text-base font-bold text-blue-600">
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
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
