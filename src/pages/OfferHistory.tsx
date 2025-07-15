import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { OfferHistoryItem, NegotiationStep } from "@/types";
import { useB2B } from "@/contexts/B2BContext";
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  DollarSign,
  Calendar,
  Building2,
  Package,
  Eye,
  Download,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { es } from "date-fns/locale";
import { Navigation } from "@/components/Navigation";

function OfferHistory() {
  const { offerHistory } = useB2B();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOffer, setSelectedOffer] = useState<OfferHistoryItem | null>(
    null,
  );

  const getStatusIcon = (status: OfferHistoryItem["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "expired":
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      case "negotiating":
        return <RotateCcw className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: OfferHistoryItem["status"]) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "accepted":
        return "Aceptada";
      case "rejected":
        return "Rechazada";
      case "expired":
        return "Expirada";
      case "negotiating":
        return "Negociando";
      default:
        return "Desconocido";
    }
  };

  const getOfferTypeIcon = (type: OfferHistoryItem["offerType"]) => {
    switch (type) {
      case "initial":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "counter_offer":
        return <RotateCcw className="h-4 w-4 text-orange-500" />;
      case "final":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getOfferTypeLabel = (type: OfferHistoryItem["offerType"]) => {
    switch (type) {
      case "initial":
        return "Oferta Inicial";
      case "counter_offer":
        return "Contraoferta";
      case "final":
        return "Oferta Final";
      default:
        return "Oferta";
    }
  };

  const getNegotiationActionIcon = (action: NegotiationStep["action"]) => {
    switch (action) {
      case "offer_made":
        return <TrendingUp className="h-3 w-3 text-blue-500 " />;
      case "counter_offer":
        return <RotateCcw className="h-3 w-3 text-orange-500" />;
      case "price_adjustment":
        return <DollarSign className="h-3 w-3 text-purple-500" />;
      case "terms_modified":
        return <FileText className="h-3 w-3 text-indigo-500" />;
      case "accepted":
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case "rejected":
        return <XCircle className="h-3 w-3 text-red-500" />;
      default:
        return <Clock className="h-3 w-3 text-gray-500 " />;
    }
  };

  const getNegotiationActionLabel = (action: NegotiationStep["action"]) => {
    switch (action) {
      case "offer_made":
        return "Oferta Realizada";
      case "counter_offer":
        return "Contraoferta";
      case "price_adjustment":
        return "Ajuste de Precio";
      case "terms_modified":
        return "Términos Modificados";
      case "accepted":
        return "Aceptada";
      case "rejected":
        return "Rechazada";
      default:
        return "Acción";
    }
  };

  const filteredOffers = offerHistory.filter((offer) => {
    const matchesSearch =
      offer.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.rfqId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || offer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: offerHistory.length,
    pending: offerHistory.filter((o) => o.status === "pending").length,
    accepted: offerHistory.filter((o) => o.status === "accepted").length,
    rejected: offerHistory.filter((o) => o.status === "rejected").length,
    negotiating: offerHistory.filter((o) => o.status === "negotiating").length,
    expired: offerHistory.filter((o) => o.status === "expired").length,
  };

  const totalValue = offerHistory
    .filter((o) => o.status === "accepted")
    .reduce((sum, offer) => sum + offer.totalPrice, 0);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-14 sm:pt-16 md:pt-20">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Historial de Ofertas
              </h1>
              <p className="text-gray-600 mt-1">
                Seguimiento completo de ofertas y contrapartes en tus RFQs
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Ofertas
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {offerHistory.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Aceptadas
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statusCounts.accepted}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Negociando
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statusCounts.negotiating}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Valor Total
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${totalValue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6 ">
              <div className="flex flex-col md:flex-row gap-4 ">
                <div className="flex-1">
                  <div className="relative " >
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 " />
                    <Input
                      placeholder="Buscar por producto, proveedor o RFQ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 focus:border-blue-500 focus:ring-blue-500 border border-black bg-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2 ">
                  {[
                    { key: "all", label: "Todas", count: statusCounts.all },
                    {
                      key: "pending",
                      label: "Pendientes",
                      count: statusCounts.pending,
                    },
                    {
                      key: "negotiating",
                      label: "Negociando",
                      count: statusCounts.negotiating,
                    },
                    {
                      key: "accepted",
                      label: "Aceptadas",
                      count: statusCounts.accepted,
                    },
                    {
                      key: "rejected",
                      label: "Rechazadas",
                      count: statusCounts.rejected,
                    },
                    {
                      key: "expired",
                      label: "Expiradas",
                      count: statusCounts.expired,
                    },
                  ].map((filter) => (
                    <Button
                      key={filter.key}
                      size="sm"
                      onClick={() => setStatusFilter(filter.key)}
                      className={`whitespace-nowrap px-3 py-1 rounded-md font-medium ${statusFilter === filter.key
                        ? "bg-[#003566] text-white"
                        : "bg-white text-black border border-gray-300 hover:bg-gray-100"
                        }`}

                    >

                      {filter.label}
                      <Badge
                        className={`ml-2 text-xs rounded-full px-2 py-0.5 ${statusFilter === filter.key
                            ? "bg-white text-black border border-black"
                            : "bg-[#e0e0e0] text-gray-700"
                          }`}
                      >
                        {filter.count}
                      </Badge>

                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Offers List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Offers */}
            <Card>
              <CardHeader>
                <CardTitle>Ofertas ({filteredOffers.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[800px] overflow-y-auto">
                  {filteredOffers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">No hay ofertas</p>
                      <p className="text-sm">
                        No se encontraron ofertas con los filtros seleccionados
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredOffers.map((offer) => (
                        <div
                          key={offer.id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedOffer?.id === offer.id ? "bg-blue-50" : ""
                            }`}
                          onClick={() => setSelectedOffer(offer)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {getOfferTypeIcon(offer.offerType)}
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {offer.productName}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {offer.supplierName}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(offer.status)}
                              <Badge
                                variant={
                                  offer.status === "accepted"
                                    ? "default"
                                    : offer.status === "rejected"
                                      ? "destructive"
                                      : "secondary"
                                }
                                className="text-xs"
                              >
                                {getStatusLabel(offer.status)}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-500">Cantidad</p>
                              <p className="font-medium">
                                {offer.containerQuantity} contenedores
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                Precio Total
                              </p>
                              <p className="font-medium">
                                ${offer.totalPrice.toLocaleString()}{" "}
                                {offer.currency}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Badge variant="outline" className="text-xs">
                                {getOfferTypeLabel(offer.offerType)}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {offer.terms.incoterm}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {formatDistanceToNow(offer.createdAt, {
                                addSuffix: true,
                                locale: es,
                              })}
                            </div>
                          </div>

                          {offer.negotiationHistory.length > 0 && (
                            <div className="mt-2 pt-2 border-t">
                              <p className="text-xs text-gray-500">
                                {offer.negotiationHistory.length} pasos de
                                negociación
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Offer Details */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedOffer
                    ? "Detalles de la Oferta"
                    : "Selecciona una Oferta"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedOffer ? (
                  <div className="text-center py-8 text-gray-500">
                    <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">Vista Detallada</p>
                    <p className="text-sm">
                      Selecciona una oferta de la lista para ver sus detalles
                      completos
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Offer Header */}
                    <div className="border-b pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">
                          {selectedOffer.productName}
                        </h3>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(selectedOffer.status)}
                          <Badge
                            variant={
                              selectedOffer.status === "accepted"
                                ? "default"
                                : selectedOffer.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {getStatusLabel(selectedOffer.status)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="h-4 w-4" />
                        <span>{selectedOffer.supplierName}</span>
                        <span>•</span>
                        <span>RFQ #{selectedOffer.rfqId}</span>
                      </div>
                    </div>

                    {/* Offer Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Tipo de Oferta
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {getOfferTypeIcon(selectedOffer.offerType)}
                          <span>
                            {getOfferTypeLabel(selectedOffer.offerType)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Contenedores
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Package className="h-4 w-4 text-gray-500" />
                          <span>{selectedOffer.containerQuantity}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Precio Unitario
                        </p>
                        <p className="mt-1 font-medium">
                          ${selectedOffer.unitPrice.toLocaleString()}{" "}
                          {selectedOffer.currency}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Precio Total
                        </p>
                        <p className="mt-1 font-medium text-lg">
                          ${selectedOffer.totalPrice.toLocaleString()}{" "}
                          {selectedOffer.currency}
                        </p>
                      </div>
                    </div>

                    {/* Terms */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Términos Comerciales
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Incoterm
                          </p>
                          <p className="mt-1">{selectedOffer.terms.incoterm}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Términos de Pago
                          </p>
                          <p className="mt-1">
                            {selectedOffer.terms.paymentTerms}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Fecha de Entrega
                          </p>
                          <p className="mt-1">
                            {format(
                              selectedOffer.terms.deliveryDate,
                              "dd/MM/yyyy",
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Válida Hasta
                          </p>
                          <p className="mt-1">
                            {format(
                              selectedOffer.validUntil,
                              "dd/MM/yyyy HH:mm",
                            )}
                          </p>
                        </div>
                      </div>
                      {selectedOffer.terms.specialConditions && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-600">
                            Condiciones Especiales
                          </p>
                          <p className="mt-1 text-sm bg-gray-50 p-3 rounded">
                            {selectedOffer.terms.specialConditions}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Negotiation History */}
                    {selectedOffer.negotiationHistory.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          Historial de Negociación
                        </h4>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {selectedOffer.negotiationHistory.map((step) => (
                            <div
                              key={step.id}
                              className="flex items-start gap-3 p-3 bg-gray-50 rounded"
                            >
                              <div className="flex-shrink-0 mt-1">
                                {getNegotiationActionIcon(step.action)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">
                                    {getNegotiationActionLabel(step.action)}
                                  </span>
                                  <Badge
                                    variant={
                                      step.actor === "buyer"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {step.actor === "buyer"
                                      ? "Comprador"
                                      : "Proveedor"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {step.actorName}
                                </p>
                                {step.changes.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    {step.changes.map((change, index) => (
                                      <div
                                        key={index}
                                        className="text-xs text-gray-500"
                                      >
                                        <span className="font-medium">
                                          {change.field}:
                                        </span>{" "}
                                        {change.oldValue}{" "}
                                        <ArrowRight className="h-3 w-3 inline mx-1" />{" "}
                                        {change.newValue}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {step.notes && (
                                  <p className="text-xs text-gray-600 mt-1 italic">
                                    "{step.notes}"
                                  </p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">
                                  {formatDistanceToNow(step.timestamp, {
                                    addSuffix: true,
                                    locale: es,
                                  })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Documents */}
                    {selectedOffer.documents.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          Documentos
                        </h4>
                        <div className="space-y-2">
                          {selectedOffer.documents.map((document) => (
                            <div
                              key={document.id}
                              className="flex items-center justify-between p-3 border rounded"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="font-medium text-sm">
                                    {document.title}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {document.fileName}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(document.fileUrl, "_blank")
                                }
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OfferHistory;
