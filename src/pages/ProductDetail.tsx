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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Navigation } from "@/components/Navigation";
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
    customsData: true,
    contractTemplates: true,
    hsCode: "6109.10.00",
    customsValue: "USD 14,500",
  },
};

// Fixed Chat Component
function FixedChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-zlc-blue-600 hover:bg-zlc-blue-700 shadow-soft-xl"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-xl shadow-soft-xl border">
          <div className="p-4 bg-zlc-blue-600 text-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Building className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">GlobalTextile Corp</h4>
                  <p className="text-xs text-blue-100">En línea</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          </div>

          <div className="h-64 overflow-y-auto p-4 space-y-3">
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-2 max-w-xs">
                <p className="text-sm">
                  ¡Hola! ¿En qué puedo ayudarte con este lote?
                </p>
                <span className="text-xs text-gray-500">10:30 AM</span>
              </div>
            </div>
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                placeholder="Escribe tu mensaje..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button
                size="sm"
                className="bg-zlc-blue-600 hover:bg-zlc-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

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
      supplierId: product.supplier.name, // In a real app, this would be a proper ID
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
              Ropa
            </Link>
            <span>/</span>
            <span className="text-gray-900">Camisetas de Algodón</span>
          </div>

          {/* Header */}
          <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {product.title}
                  </h1>
                  {product.negotiable && (
                    <Badge className="bg-blue-100 text-blue-800">
                      Negociable
                    </Badge>
                  )}
                </div>

                {/* Supplier Info */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <img
                      src={product.supplier.logo}
                      alt={product.supplier.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.supplier.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {product.supplier.country}
                      </p>
                    </div>
                    {product.supplier.verified && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verificado
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {product.supplier.rating}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </Button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={product.images[selectedImage]}
                        alt={product.title}
                        className="w-full h-96 object-cover rounded-lg"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-4 right-4 bg-white/90"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={cn(
                            "relative rounded-lg overflow-hidden border-2 transition-colors",
                            selectedImage === index
                              ? "border-zlc-blue-600"
                              : "border-gray-200",
                          )}
                        >
                          <img
                            src={image}
                            alt={`${product.title} ${index + 1}`}
                            className="w-full h-20 object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2 text-zlc-blue-600" />
                    Descripción del Producto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{product.description}</p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Material</h4>
                      <p className="text-gray-600">
                        {product.specifications.material}
                      </p>

                      <h4 className="font-semibold mb-2 mt-4">
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
                          <span className="text-gray-600">Cantidad total:</span>
                          <span className="font-medium">
                            {product.specifications.totalUnits.toLocaleString()}{" "}
                            unidades
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Peso bruto:</span>
                          <span className="font-medium">
                            {product.specifications.grossWeight}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Peso neto:</span>
                          <span className="font-medium">
                            {product.specifications.netWeight}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Contenedor:</span>
                          <span className="font-medium">
                            {product.specifications.containerType}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Logistics Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-zlc-blue-600" />
                    Datos Logísticos del Lote
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Incoterm:</span>
                          <Badge className="bg-zlc-blue-100 text-zlc-blue-800">
                            {product.logistics.incoterm}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Dimensiones del Contenedor:
                          </span>
                          <span className="font-medium text-sm">
                            {product.specifications.dimensions}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Tiempo de Entrega
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Producción:</span>
                          <span>{product.logistics.leadTime.production}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Embarque:</span>
                          <span>{product.logistics.leadTime.shipping}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Total:</span>
                          <span>{product.logistics.leadTime.total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Pricing & Actions */}
            <div className="space-y-6">
              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="w-5 h-5 mr-2 text-zlc-blue-600" />
                    Precios y Descuentos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-zlc-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-zlc-blue-900">
                      USD {product.pricing.pricePerContainer.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Precio por Contenedor
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      USD {product.pricing.pricePerUnit} por unidad
                    </div>
                  </div>

                  {/* Volume Discounts */}
                  <div>
                    <h4 className="font-semibold mb-2">
                      Descuentos por Volumen
                    </h4>
                    <div className="space-y-2">
                      {product.pricing.discounts.map((discount) => (
                        <div
                          key={discount.quantity}
                          className="flex justify-between items-center text-sm"
                        >
                          <span>{discount.quantity}+ contenedores</span>
                          <div className="text-right">
                            <span className="font-medium text-green-600">
                              -{discount.discount}%
                            </span>
                            <div className="text-xs text-gray-500">
                              USD {discount.finalPrice.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2 text-zlc-blue-600" />
                    Configuración de Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="quantity">Número de Contenedores</Label>
                    <Select
                      value={selectedQuantity.toString()}
                      onValueChange={(value) =>
                        setSelectedQuantity(parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 10, 15, 20, 25, 30].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} contenedor{num > 1 ? "es" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {product.negotiable && (
                    <div>
                      <Label htmlFor="customPrice">
                        Ofrecer Precio por Contenedor (USD)
                      </Label>
                      <Input
                        id="customPrice"
                        placeholder="Ej: 15,000"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>
                        USD{" "}
                        {(
                          product.pricing.pricePerContainer * selectedQuantity
                        ).toLocaleString()}
                      </span>
                    </div>
                    {getAppliedDiscount() && (
                      <div className="flex justify-between text-green-600">
                        <span>
                          Descuento ({getAppliedDiscount()?.discount}%):
                        </span>
                        <span>
                          -USD{" "}
                          {(
                            product.pricing.pricePerContainer *
                              selectedQuantity -
                            calculateTotal()
                          ).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>USD {calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={handleAddToCart}
                      className="w-full bg-zlc-blue-600 hover:bg-zlc-blue-700 h-12"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Agregar al Carrito
                    </Button>
                    <Button variant="outline" className="w-full h-10" asChild>
                      <Link to="/cart">
                        <Send className="w-4 h-4 mr-2" />
                        Ver Carrito
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Custom Quote */}
              <Card>
                <CardHeader>
                  <CardTitle
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setShowCustomQuote(!showCustomQuote)}
                  >
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-zlc-blue-600" />
                      Cotización Personalizada
                    </div>
                    {showCustomQuote ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </CardTitle>
                </CardHeader>
                {showCustomQuote && (
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Mix de Tallas/Colores Deseado</Label>
                      <Textarea placeholder="Ej: 40% M-L en blanco, 30% XL en negro..." />
                    </div>
                    <div>
                      <Label>Plazo Deseado</Label>
                      <Input placeholder="Ej: 30 días máximo" />
                    </div>
                    <div>
                      <Label>Requisitos Adicionales</Label>
                      <Textarea placeholder="Empaque personalizado, etiquetas, etc." />
                    </div>
                    <Button variant="outline" className="w-full">
                      Enviar Solicitud
                    </Button>
                  </CardContent>
                )}
              </Card>

              {/* Documentation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="w-5 h-5 mr-2 text-zlc-blue-600" />
                    Documentación B2B
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-between">
                    <span>Factura Comercial Proforma</span>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span>Packing List de Ejemplo</span>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span>Datos Aduaneros</span>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span>Plantillas de Contratos</span>
                    <Download className="w-4 h-4" />
                  </Button>

                  <div className="pt-3 border-t">
                    <Button
                      variant="link"
                      className="w-full text-zlc-blue-600 p-0"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Consultar a Iris (Asesora Aduanera)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Information Tabs */}
          <div className="mt-8">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Detalles</TabsTrigger>
                <TabsTrigger value="reviews">Reseñas</TabsTrigger>
                <TabsTrigger value="qa">Preguntas</TabsTrigger>
                <TabsTrigger value="policy">Política</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Especificaciones Extendidas
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">
                          Materiales y Composición
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Algodón 100% peinado de fibra larga</li>
                          <li>• Gramaje: 180gsm (+/- 5%)</li>
                          <li>• Mangla con elastano incluido</li>
                          <li>• Etiquetas de cuidado incluidas</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">
                          Proceso de Manufactura
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Preencogido por vapor controlado</li>
                          <li>• Tintura reactiva para solidez</li>
                          <li>• Control de calidad ISO 9001:2015</li>
                          <li>• Proceso libre de químicos nocivos</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">
                        Reseñas de Empresas
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">4.8</span>
                        <span className="text-gray-500">(24 reseñas)</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          company: "Distribuidora Central",
                          country: "Costa Rica",
                          rating: 5,
                          comment:
                            "Excelente calidad y tiempos de entrega cumplidos. Recomendamos al 100%.",
                          date: "2 semanas atrás",
                        },
                        {
                          company: "Textiles del Norte",
                          country: "Guatemala",
                          rating: 5,
                          comment:
                            "La calidad superó nuestras expectativas. Cliente satisfecho.",
                          date: "1 mes atrás",
                        },
                      ].map((review, index) => (
                        <div key={index} className="border-b pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-medium">
                                {review.company}
                              </span>
                              <span className="text-gray-500 text-sm ml-2">
                                ({review.country})
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm">
                            {review.comment}
                          </p>
                          <span className="text-xs text-gray-500">
                            {review.date}
                          </span>
                        </div>
                      ))}
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
                    <div className="space-y-4">
                      {[
                        {
                          question:
                            "¿Qué documentación incluyen para importación?",
                          answer:
                            "Incluimos factura comercial, packing list, certificado de origen y todos los documentos aduaneros necesarios.",
                          date: "3 días atrás",
                        },
                        {
                          question:
                            "¿Es posible modificar la mezcla de colores?",
                          answer:
                            "Sí, podemos ajustar la distribución de colores según sus necesidades específicas.",
                          date: "1 semana atrás",
                        },
                      ].map((qa, index) => (
                        <div key={index} className="border-b pb-4">
                          <div className="flex items-start space-x-2 mb-2">
                            <HelpCircle className="w-5 h-5 text-zlc-blue-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium">{qa.question}</p>
                              <p className="text-gray-700 mt-1">{qa.answer}</p>
                              <span className="text-xs text-gray-500">
                                {qa.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t">
                      <Button variant="outline" className="w-full">
                        Hacer una Pregunta
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="policy" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Política de Devolución B2B
                    </h3>
                    <div className="space-y-4 text-sm text-gray-700">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Condiciones de Devolución
                        </h4>
                        <ul className="space-y-1">
                          <li>• Devoluciones aceptadas dentro de 30 días</li>
                          <li>• Producto debe estar en condición original</li>
                          <li>
                            • Gastos de envío de devolución a cargo del
                            comprador
                          </li>
                          <li>• Inspección requerida antes del reembolso</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Garantía de Calidad
                        </h4>
                        <ul className="space-y-1">
                          <li>
                            • Garantía de 6 meses contra defectos de manufactura
                          </li>
                          <li>• Reemplazo gratuito por defectos probados</li>
                          <li>• Certificación de calidad incluida</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Fixed Chat Component */}
      <FixedChat />
    </div>
  );
}
