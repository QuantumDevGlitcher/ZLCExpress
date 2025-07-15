import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  ThumbsUp,
  Building,
  Calendar,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface DetailedSpecs {
  materials: string[];
  manufacturing: string;
  quality: string[];
  certifications: string[];
  packaging: string;
}

interface Review {
  id: string;
  company: string;
  rating: number;
  comment: string;
  date: Date;
  verifiedPurchase: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  helpful: number;
}

interface ReturnPolicy {
  timeframe: string;
  conditions: string[];
  process: string;
}

interface InfoTabsProps {
  detailedSpecs: DetailedSpecs;
  reviews: Review[];
  faqs: FAQ[];
  returnPolicy: ReturnPolicy;
}

export function InfoTabs({
  detailedSpecs,
  reviews,
  faqs,
  returnPolicy,
}: InfoTabsProps) {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "fill-amber-500 text-amber-500"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-0">
        <Tabs defaultValue="specs" className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
            <TabsTrigger value="specs">Especificaciones</TabsTrigger>
            <TabsTrigger value="reviews">
              Reseñas ({reviews.length})
            </TabsTrigger>
            <TabsTrigger value="faq">FAQ ({faqs.length})</TabsTrigger>
            <TabsTrigger value="returns">Devoluciones</TabsTrigger>
          </TabsList>

          {/* Detailed Specifications */}
          <TabsContent value="specs" className="mt-0">
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Especificaciones Detalladas
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Materiales
                    </h4>
                    <ul className="space-y-2">
                      {detailedSpecs.materials.map((material, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            {material}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Control de Calidad
                    </h4>
                    <ul className="space-y-2">
                      {detailedSpecs.quality.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Proceso de Manufactura
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {detailedSpecs.manufacturing}
                  </p>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Certificaciones
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {detailedSpecs.certifications.map((cert, index) => (
                        <Badge
                          key={index}
                          className="bg-blue-100 text-blue-800"
                        >
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Empaque y Logística
                    </h4>
                    <p className="text-sm text-gray-700">
                      {detailedSpecs.packaging}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews" className="mt-0">
            <div className="p-6">
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {/* Rating Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">
                          {averageRating.toFixed(1)}
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          {renderStars(Math.round(averageRating))}
                        </div>
                        <div className="text-sm text-gray-600">
                          {reviews.length} reseña{reviews.length > 1 ? "s" : ""}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          Calificación promedio basada en compras verificadas
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b pb-4 last:border-b-0"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Building className="h-4 w-4 text-gray-500" />
                              <span className="font-medium text-gray-900">
                                {review.company}
                              </span>
                              {review.verifiedPurchase && (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  Compra verificada
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-gray-500">
                                {review.date.toLocaleDateString("es-ES")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay reseñas aún
                  </h3>
                  <p className="text-gray-600">
                    Sea el primero en dejar una reseña de este producto
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq" className="mt-0">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Preguntas Frecuentes
              </h3>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="border border-gray-200 rounded-lg"
                  >
                    <button
                      onClick={() =>
                        setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                      }
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                    >
                      <div className="flex items-start gap-3">
                        <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="font-medium text-gray-900">
                          {faq.question}
                        </span>
                      </div>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-4 pb-4">
                        <div className="pl-8">
                          <p className="text-gray-700 mb-3">{faq.answer}</p>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              Útil ({faq.helpful})
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Return Policy */}
          <TabsContent value="returns" className="mt-0">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Política de Devoluciones
              </h3>

              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <RotateCcw className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">
                      Plazo de Devolución: {returnPolicy.timeframe}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800">
                    Contado a partir de la fecha de recepción de la mercancía
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Condiciones para Devolución
                  </h4>
                  <ul className="space-y-2">
                    {returnPolicy.conditions.map((condition, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">
                          {condition}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Proceso de Devolución
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {returnPolicy.process}
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2">
                    Importante
                  </h4>
                  <p className="text-sm text-orange-800">
                    Las devoluciones por cambio de especificaciones o
                    preferencias del comprador pueden estar sujetas a costos
                    adicionales. Recomendamos contactar con el proveedor antes
                    de solicitar una devolución.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
