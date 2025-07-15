import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Minus, Plus, Send } from "lucide-react";

interface OrderConfigProps {
  isNegotiable: boolean;
  minContainers: number;
  maxContainers: number;
  containers: number;
  onContainersChange: (containers: number) => void;
}

export function OrderConfig({
  isNegotiable,
  minContainers,
  maxContainers,
  containers,
  onContainersChange,
}: OrderConfigProps) {
  const [counterOfferPrice, setCounterOfferPrice] = useState("");
  const [desiredQuantity, setDesiredQuantity] = useState("");

  const handleQuantityChange = (newQuantity: number) => {
    const clampedQuantity = Math.max(
      minContainers,
      Math.min(maxContainers, newQuantity),
    );
    onContainersChange(clampedQuantity);
  };

  return (
    <Card className="w-full bg-white border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg text-gray-900 font-semibold">
          <ShoppingCart className="h-5 w-5" />
          Configuración de Pedido
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Container Quantity Section */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Número de Contenedores
          </Label>

          {/* Quantity Selector */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(containers - 1)}
                disabled={containers <= minContainers}
                className="h-10 w-10 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                <Minus className="h-4 w-4" />
              </Button>

              <div className="mx-6 min-w-[40px] text-center">
                <span className="text-2xl font-semibold text-gray-900">
                  {containers}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(containers + 1)}
                disabled={containers >= maxContainers}
                className="h-10 w-10 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500">
            Mínimo: {minContainers} • Máximo: {maxContainers} contenedores
          </p>
        </div>

        {/* Counter Offer Section */}
        <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-4 text-base">
            Contraoferta
          </h3>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Precio por Contenedor (USD)
              </Label>
              <Input
                placeholder="Ingrese su oferta..."
                value={counterOfferPrice}
                onChange={(e) => setCounterOfferPrice(e.target.value)}
                className="bg-white border-gray-300"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Cantidad de Producto Deseada (unidades)
              </Label>
              <Input
                placeholder="ej. 25000"
                value={desiredQuantity}
                onChange={(e) => setDesiredQuantity(e.target.value)}
                className="bg-white border-gray-300"
              />
            </div>

            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white h-10">
              <Send className="mr-2 h-4 w-4" />
              Enviar Contraoferta
            </Button>

            <p className="text-xs text-gray-600 text-center leading-tight">
              El proveedor revisará su contraoferta y<br />
              responderá en 24-48 horas.
            </p>
          </div>
        </div>

        {/* Direct Offer Button */}
        <div className="space-y-3">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base">
            <Send className="mr-2 h-4 w-4" />
            Enviar Oferta (1 contenedor)
          </Button>

          <p className="text-sm text-gray-600 text-center leading-tight">
            Su oferta será enviada directamente al proveedor para
            <br />
            revisión
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
