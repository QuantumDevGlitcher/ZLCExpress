import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { TransportOption } from "@/types";
import {
  Truck,
  Clock,
  DollarSign,
  Shield,
  FileText,
  Star,
  CheckCircle,
  AlertCircle,
  Package,
} from "lucide-react";

interface TransportComparisonTableProps {
  options: TransportOption[];
  onSelectOption: (option: TransportOption) => void;
  selectedOptionId?: string;
}

export function TransportComparisonTable({
  options,
  onSelectOption,
  selectedOptionId,
}: TransportComparisonTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const getIncotermColor = (incoterm: string) => {
    switch (incoterm) {
      case "CIF":
        return "bg-green-100 text-green-800";
      case "FOB":
        return "bg-blue-100 text-blue-800";
      case "CFR":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-zlc-blue-600" />
              Comparativo de Opciones de Transporte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Operador Logístico</TableHead>
                  <TableHead>Incoterm</TableHead>
                  <TableHead>Costo</TableHead>
                  <TableHead>Tiempo de Tránsito</TableHead>
                  <TableHead>Condiciones</TableHead>
                  <TableHead>Disponibilidad</TableHead>
                  <TableHead className="text-center">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {options.map((option) => (
                  <TableRow
                    key={option.id}
                    className={`cursor-pointer transition-colors ${
                      selectedOptionId === option.id
                        ? "bg-zlc-blue-50 border-zlc-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      setExpandedRow(
                        expandedRow === option.id ? null : option.id,
                      )
                    }
                  >
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {option.operatorName}
                          </span>
                          {option.verified && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {getRatingStars(option.rating)}
                          <span className="text-sm text-gray-600 ml-1">
                            ({option.rating})
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getIncotermColor(option.incoterm)}>
                        {option.incoterm}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-lg">
                        {formatCurrency(option.cost, option.currency)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{option.transitTime} días</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-1">
                          {option.conditions.insurance && (
                            <Badge variant="outline" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Seguro
                            </Badge>
                          )}
                          {option.conditions.customs && (
                            <Badge variant="outline" className="text-xs">
                              <FileText className="h-3 w-3 mr-1" />
                              Aduanas
                            </Badge>
                          )}
                          {option.conditions.documentation && (
                            <Badge variant="outline" className="text-xs">
                              Documentación
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {formatDate(option.availability)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOption(option);
                        }}
                        variant={
                          selectedOptionId === option.id ? "default" : "outline"
                        }
                        size="sm"
                        className={
                          selectedOptionId === option.id
                            ? "bg-zlc-blue-600 hover:bg-zlc-blue-700"
                            : ""
                        }
                      >
                        {selectedOptionId === option.id
                          ? "Seleccionado"
                          : "Seleccionar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Expanded Row Details */}
            {expandedRow && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                {(() => {
                  const option = options.find((o) => o.id === expandedRow);
                  if (!option) return null;

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">
                          Servicios Incluidos
                        </h4>
                        <ul className="space-y-1 text-sm">
                          {option.conditions.insurance && (
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              Seguro de carga incluido
                            </li>
                          )}
                          {option.conditions.customs && (
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              Gestión aduanera incluida
                            </li>
                          )}
                          {option.conditions.documentation && (
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              Documentación completa
                            </li>
                          )}
                          {!option.conditions.insurance && (
                            <li className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                              Seguro no incluido
                            </li>
                          )}
                          {!option.conditions.customs && (
                            <li className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                              Gestión aduanera no incluida
                            </li>
                          )}
                        </ul>
                      </div>

                      {option.conditions.specialHandling && (
                        <div>
                          <h4 className="font-medium mb-2">
                            Servicios Especiales
                          </h4>
                          <ul className="space-y-1 text-sm">
                            {option.conditions.specialHandling.map(
                              (service, index) => (
                                <li
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <Package className="h-4 w-4 text-zlc-blue-600" />
                                  {service}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                      <div className="md:col-span-2">
                        <h4 className="font-medium mb-2">
                          Información Adicional
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Válido hasta:</span>
                            <br />
                            <span className="font-medium">
                              {formatDate(option.validUntil)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Operador ID:</span>
                            <br />
                            <span className="font-medium">
                              {option.operatorId}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {options.map((option) => (
          <Card
            key={option.id}
            className={`cursor-pointer transition-all ${
              selectedOptionId === option.id
                ? "ring-2 ring-zlc-blue-600 bg-zlc-blue-50"
                : "hover:shadow-md"
            }`}
            onClick={() =>
              setExpandedRow(expandedRow === option.id ? null : option.id)
            }
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{option.operatorName}</span>
                      {option.verified && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {getRatingStars(option.rating)}
                      <span className="text-sm text-gray-600 ml-1">
                        ({option.rating})
                      </span>
                    </div>
                  </div>
                  <Badge className={getIncotermColor(option.incoterm)}>
                    {option.incoterm}
                  </Badge>
                </div>

                {/* Price and Transit */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold">
                      {formatCurrency(option.cost, option.currency)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{option.transitTime} días</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      Disponible: {formatDate(option.availability)}
                    </span>
                  </div>
                </div>

                {/* Conditions */}
                <div className="flex flex-wrap gap-1">
                  {option.conditions.insurance && (
                    <Badge variant="outline" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Seguro
                    </Badge>
                  )}
                  {option.conditions.customs && (
                    <Badge variant="outline" className="text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      Aduanas
                    </Badge>
                  )}
                  {option.conditions.documentation && (
                    <Badge variant="outline" className="text-xs">
                      Documentación
                    </Badge>
                  )}
                </div>

                {/* Expanded Details */}
                {expandedRow === option.id && (
                  <div className="pt-3 border-t space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Servicios Incluidos</h4>
                      <div className="space-y-1 text-sm">
                        {option.conditions.insurance && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Seguro de carga incluido
                          </div>
                        )}
                        {option.conditions.customs && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Gestión aduanera incluida
                          </div>
                        )}
                        {option.conditions.documentation && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Documentación completa
                          </div>
                        )}
                      </div>
                    </div>

                    {option.conditions.specialHandling && (
                      <div>
                        <h4 className="font-medium mb-2">
                          Servicios Especiales
                        </h4>
                        <div className="space-y-1 text-sm">
                          {option.conditions.specialHandling.map(
                            (service, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <Package className="h-4 w-4 text-zlc-blue-600" />
                                {service}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectOption(option);
                  }}
                  variant={
                    selectedOptionId === option.id ? "default" : "outline"
                  }
                  className={`w-full ${
                    selectedOptionId === option.id
                      ? "bg-zlc-blue-600 hover:bg-zlc-blue-700"
                      : ""
                  }`}
                >
                  {selectedOptionId === option.id
                    ? "Seleccionado"
                    : "Seleccionar Operador"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
