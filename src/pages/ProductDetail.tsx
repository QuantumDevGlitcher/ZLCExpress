import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Navigation } from "@/components/Navigation";
import { VolumePricingTable } from "@/components/VolumePricingTable";
import { RFQRequestDialog } from "@/components/RFQRequestDialog";
import {
  ArrowLeft,
  Heart,
  Share2,
  ZoomIn,
  Package,
  Truck,
  Clock,
  Star,
  Building,
  MapPin,
  MessageCircle,
  Download,
  Calculator,
  FileText,
  HelpCircle,
  Send,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Users,
  Scale,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock product data
const product = {
  id: "1",
  title: "Camisetas de Algodón Premium - Lote Mixto Hombre/Mujer",
  description:
    "Camisetas de algodón premium fabricadas con estándares de calidad internacional. Perfectas para distribuidores mayoristas con gran demanda.",
  negotiable: true,
  supplier: {
    name: "GlobalTextile Corp",
    legalName: "Global Textile Corporation S.A.",
    country: "Zona Libre de Colón, Panamá",
    verified: true,
    rating: 4.8,
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
  },
  images: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=400&fit=crop",
  ],
  specifications: {
    material: "100% Algodón Peinado 180gsm",
    colors: ["Blanco", "Negro", "Gris", "Azul Marino", "Rojo"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    totalUnits: 5000,
    grossWeight: "2,400 kg",
    netWeight: "2,000 kg",
    containerType: "20' HC Container",
    dimensions: "Dimensiones: 6.058m x 2.438m x 2.591m",
  },
  logistics: {
    incoterm: "FOB ZLC",
    leadTime: {
      production: "14-21 días",
      shipping: "7-10 días",
      total: "21-31 días",
    },
    availableIncoterms: ["FOB ZLC", "CIF Puerto Destino", "EXW Zona Libre"],
  },
  pricing: {
    pricePerContainer: 16500,
    pricePerUnit: 3.3,
    currency: "USD",
    discounts: [
      { quantity: 2, discount: 3, finalPrice: 16005 },
      { quantity: 5, discount: 7, finalPrice: 15345 },
      { quantity: 10, discount: 12, finalPrice: 14520 },
      { quantity: 20, discount: 18, finalPrice: 13530 },
    ],
  },
  customization: {
    allowsSizeColorMix: true,
    customPackaging: true,
    privateLabel: true,
  },
  documentation: {
    commercialInvoice: true,
    packingList: true,
    certificateOfOrigin: true,
    customsDeclaration: true,
  },
};

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState("");
  const [showCustomQuote, setShowCustomQuote] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const calculateTotal = () => {
    const discount = product.pricing.discounts.find(
      (d) => selectedQuantity >= d.quantity,
    );
    const basePrice = product.pricing.pricePerContainer * selectedQuantity;
    if (discount) {
      return basePrice * (1 - discount.discount / 100);
    }
    return basePrice;
  };

  const getAppliedDiscount = () => {
    return product.pricing.discounts.find(
      (d) => selectedQuantity >= d.quantity,
    );
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productTitle: product.title,
      productImage: product.images[0],
      supplier: product.supplier.name,
      supplierId: product.supplier.name,
      containerType: product.specifications.containerType,
      quantity: selectedQuantity,
      pricePerContainer: product.pricing.pricePerContainer,
      currency: product.pricing.currency,
      incoterm: product.logistics.incoterm,
      customPrice: customPrice ? parseFloat(customPrice) : undefined,
      notes: "",
    });
  };

  return (
    <div className="min-h-screen bg-zlc-gray-50">
      <Navigation />

      <main className="pt-14 sm:pt-16 md:pt-20">
        <div className="container-section py-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Link to="/categories" className="hover:text-zlc-blue-600">
              Categorías
            </Link>
            <span>/</span>
            <Link
              to="/categories?category=ropa"
              className="hover:text-zlc-blue-600"
            >
              Ropa y Textiles
            </Link>
            <span>/</span>
            <span className="text-gray-900">Camisetas</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-lg border overflow-hidden group relative">
                <img
                  src={product.images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-4 right-4 opacity-80 hover:opacity-100"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              {/* Image Thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "aspect-square rounded-lg border-2 overflow-hidden transition-all",
                      selectedImage === index
                        ? "border-zlc-blue-600 ring-2 ring-zlc-blue-200"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <img
                      src={image}
                      alt={`Vista ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {product.title}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <Button size="icon" variant="ghost">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {product.negotiable && (
                  <Badge className="bg-orange-100 text-orange-800 mb-4">
                    Precio Negociable
                  </Badge>
                )}

                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Supplier Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.supplier.logo}
                        alt={product.supplier.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">
                            {product.supplier.name}
                          </h3>
                          {product.supplier.verified && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verificado
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{product.supplier.country}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-current text-yellow-400" />
                            <span>{product.supplier.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contactar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold text-zlc-blue-600">
                          ${product.pricing.pricePerContainer.toLocaleString()}
                        </span>
                        <span className="text-gray-600">por contenedor</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        ${product.pricing.pricePerUnit} por unidad •{" "}
                        {product.specifications.totalUnits.toLocaleString()}{" "}
                        unidades
                      </div>
                    </div>

                    <Separator />

                    {/* Quantity Selector */}
                    <div>
                      <Label
                        htmlFor="quantity"
                        className="text-base font-medium"
                      >
                        Cantidad de Contenedores
                      </Label>
                      <div className="flex items-center space-x-3 mt-2">
                        <Select
                          value={selectedQuantity.toString()}
                          onValueChange={(value) =>
                            setSelectedQuantity(parseInt(value))
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 5, 10, 20, 50].map((qty) => (
                              <SelectItem key={qty} value={qty.toString()}>
                                {qty}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {getAppliedDiscount() && (
                          <Badge className="bg-green-100 text-green-800">
                            -{getAppliedDiscount()?.discount}% descuento
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Total Calculation */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total:</span>
                        <span className="text-2xl font-bold text-zlc-blue-600">
                          ${calculateTotal().toLocaleString()}
                        </span>
                      </div>
                      {getAppliedDiscount() && (
                        <div className="text-sm text-green-600 mt-1">
                          Ahorro: $
                          {(
                            product.pricing.pricePerContainer *
                              selectedQuantity -
                            calculateTotal()
                          ).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Button
                      onClick={handleAddToCart}
                      className="w-full btn-professional"
                      size="lg"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Agregar al Carrito
                    </Button>

                    <RFQRequestDialog
                      product={{
                        id: product.id,
                        title: product.title,
                        description: product.description,
                        containerSize:
                          product.specifications.containerType.includes("20")
                            ? "20'"
                            : "40'",
                        moq: product.specifications.totalUnits,
                        priceRange: {
                          min: product.pricing.pricePerContainer,
                          max: product.pricing.pricePerContainer,
                          currency: product.pricing.currency,
                        },
                        images: product.images,
                        specifications: {},
                        supplierId: "supplier-1",
                        availableFrom: new Date(),
                        estimatedDelivery: "21-31 días",
                        status: "available",
                      }}
                      supplierId="supplier-1"
                      supplierName={product.supplier.name}
                      onRFQCreated={(rfqId) => {
                        console.log("RFQ created:", rfqId);
                      }}
                    >
                      <Button
                        variant="outline"
                        className="w-full border-zlc-blue-600 text-zlc-blue-600 hover:bg-zlc-blue-50"
                        size="lg"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Solicitar Cotización (RFQ)
                      </Button>
                    </RFQRequestDialog>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full h-10 mt-3"
                    asChild
                  >
                    <Link to="/cart">
                      <Send className="w-4 h-4 mr-2" />
                      Ver Carrito
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-8">
            {/* Volume Pricing Section */}
            <VolumePricingTable
              productId={product.id}
              onPricingChange={(calculation) => {
                console.log("Pricing changed:", calculation);
              }}
              defaultQuantity={1}
            />

            {/* Information Tabs */}
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="details">Detalles</TabsTrigger>
                    <TabsTrigger value="reviews">Reseñas</TabsTrigger>
                    <TabsTrigger value="qa">Preguntas</TabsTrigger>
                    <TabsTrigger value="return">Devoluciones</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-6">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">
                          Especificaciones del Producto
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-2">Material</h4>
                            <p className="text-gray-600 mb-4">
                              {product.specifications.material}
                            </p>

                            <h4 className="font-semibold mb-2">
                              Colores Disponibles
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {product.specifications.colors.map((color) => (
                                <Badge key={color} variant="outline">
                                  {color}
                                </Badge>
                              ))}
                            </div>

                            <h4 className="font-semibold mb-2 mt-4">
                              Tallas Disponibles
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {product.specifications.sizes.map((size) => (
                                <Badge key={size} variant="outline">
                                  {size}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Cantidad total:
                                </span>
                                <span className="font-medium">
                                  {product.specifications.totalUnits.toLocaleString()}{" "}
                                  unidades
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Peso bruto:
                                </span>
                                <span className="font-medium">
                                  {product.specifications.grossWeight}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Peso neto:
                                </span>
                                <span className="font-medium">
                                  {product.specifications.netWeight}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Contenedor:
                                </span>
                                <span className="font-medium">
                                  {product.specifications.containerType}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="reviews" className="mt-6">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">
                          Reseñas de Compradores
                        </h3>
                        <div className="text-center py-8 text-gray-500">
                          <Star className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <p>Aún no hay reseñas para este producto</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="qa" className="mt-6">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">
                          Preguntas y Respuestas
                        </h3>
                        <div className="text-center py-8 text-gray-500">
                          <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <p>No hay preguntas sobre este producto</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="return" className="mt-6">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">
                          Política de Devoluciones
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              Garantía de Calidad
                            </h4>
                            <ul className="space-y-1">
                              <li>
                                • Garantía de 6 meses contra defectos de
                                manufactura
                              </li>
                              <li>
                                • Reemplazo gratuito por defectos probados
                              </li>
                              <li>• Certificación de calidad incluida</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
