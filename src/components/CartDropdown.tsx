import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Package, Building, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function CartDropdown() {
  const { state, getTotalItems, getTotalAmount, removeItem } = useCart();
  const totalItems = getTotalItems();
  const totalAmount = getTotalAmount();

  // Get the last added item for quick preview
  const lastAddedItem =
    state.items.length > 0
      ? state.items.reduce((latest, item) =>
          item.addedAt > latest.addedAt ? item : latest,
        )
      : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-zlc-blue-600">
              {totalItems}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">
              Carrito de Cotización
            </h3>
            <Badge variant="secondary">
              {totalItems} contenedor{totalItems !== 1 ? "es" : ""}
            </Badge>
          </div>

          {state.items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                Tu carrito de cotización está vacío
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Agrega productos para solicitar cotizaciones
              </p>
            </div>
          ) : (
            <>
              {/* Last Added Item Preview */}
              {lastAddedItem && (
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-2">
                    Último agregado:
                  </div>
                  <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={lastAddedItem.productImage}
                      alt={lastAddedItem.productTitle}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {lastAddedItem.productTitle}
                      </h4>
                      <div className="flex items-center text-xs text-gray-600 mt-1">
                        <Building className="h-3 w-3 mr-1" />
                        {lastAddedItem.supplier}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-xs text-gray-600">
                          <Package className="h-3 w-3 mr-1" />
                          {lastAddedItem.quantity} contenedor
                          {lastAddedItem.quantity !== 1 ? "es" : ""}
                        </div>
                        <div className="text-sm font-medium text-zlc-blue-900">
                          $
                          {(
                            lastAddedItem.customPrice ||
                            lastAddedItem.pricePerContainer
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(lastAddedItem.id)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Items Summary */}
              {state.items.length > 1 && (
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-2">
                    Resumen ({state.items.length} productos):
                  </div>
                  <div className="space-y-2">
                    {state.items.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex-1 truncate">
                          <span className="text-gray-700">
                            {item.productTitle}
                          </span>
                          <span className="text-gray-500 ml-2">
                            x{item.quantity}
                          </span>
                        </div>
                        <span className="text-gray-900 font-medium ml-2">
                          $
                          {(
                            (item.customPrice || item.pricePerContainer) *
                            item.quantity
                          ).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {state.items.length > 3 && (
                      <div className="text-xs text-gray-500 text-center py-1">
                        +{state.items.length - 3} productos más
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Separator className="mb-4" />

              {/* Total */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-gray-900">
                  Total Estimado:
                </span>
                <span className="font-bold text-lg text-zlc-blue-900">
                  ${totalAmount.toLocaleString()} USD
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  asChild
                  className="w-full bg-zlc-blue-600 hover:bg-zlc-blue-700"
                >
                  <Link to="/cart">Ver Carrito Completo</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-zlc-blue-200 text-zlc-blue-700 hover:bg-zlc-blue-50"
                >
                  <Link to="/cart">Solicitar Cotización</Link>
                </Button>
              </div>

              <div className="mt-3 text-xs text-gray-500 text-center">
                Los precios son estimados. La cotización final puede variar.
              </div>
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
