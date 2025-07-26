import { useState, useEffect } from "react";
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
  DollarSign,
  Minus,
  Plus,
  Eye,
  ShoppingCart,
} from "lucide-react";
import { getProductById, Product } from "@/services/api";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem, state: { isLoading: cartLoading } } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [rfqOpen, setRfqOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);
      const response = await getProductById(productId);
      if (response.success && response.product) {
        setProduct(response.product);
      } else {
        setError(response.message || "Error loading product");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (product) {
      try {
        await addItem(
          product.id,
          quantity,
          product.containerType,
          product.incoterm
        );
      } catch (error) {
        console.error('Error adding item to cart:', error);
        // You could show a toast notification here
      }
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < (product.stockContainers || 99)) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Cargando producto...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
            <p className="text-gray-600 mb-8">{error || "El producto solicitado no existe."}</p>
            <Link to="/categories">
              <Button>Volver a Categorías</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb mejorado */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link 
            to="/categories" 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Categorías
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Sección de imágenes */}
          <div className="space-y-6">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-8">
            {/* Header mejorado */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge 
                  variant="secondary" 
                  className="bg-blue-100 text-blue-800 border-blue-200"
                >
                  {product.category?.name || "Sin categoría"}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className="bg-amber-100 text-amber-800 border-amber-200"
                >
                  ⭐ Destacado
                </Badge>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Sección de precio mejorada con gradientes */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 lg:p-8 rounded-2xl border border-blue-200 shadow-lg">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-2">
                  <div className="text-sm text-blue-600 font-medium uppercase tracking-wide">
                    Precio por Contenedor {product.containerType}
                  </div>
                  <div className="text-4xl lg:text-5xl font-bold text-blue-900">
                    ${product.pricePerContainer.toLocaleString()}
                    <span className="text-xl text-blue-700 ml-2">{product.currency}</span>
                  </div>
                  <div className="text-sm text-blue-600">
                    MOQ: {product.moq} contenedor{product.moq > 1 ? 'es' : ''} mínimo
                  </div>
                </div>
                
                <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-xl p-4 border border-blue-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">
                      {product.stockContainers > 0 ? '✓' : '⚠️'}
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      {product.stockContainers > 0 ? 'Disponible' : 'Consultar stock'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controles de cantidad MEJORADOS - MAS VISIBLES */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200 shadow-md">
              <Label className="text-lg font-semibold text-gray-900 mb-4 block">
                Cantidad de Contenedores
              </Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white rounded-xl border-2 border-gray-300 shadow-sm">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="h-14 w-14 text-lg font-bold text-gray-700 hover:bg-gray-100 rounded-l-xl border-r"
                  >
                    <Minus className="h-6 w-6" />
                  </Button>
                  <div className="h-14 w-20 flex items-center justify-center bg-white text-xl font-bold text-gray-900">
                    {quantity}
                  </div>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={incrementQuantity}
                    disabled={product.stockContainers && quantity >= product.stockContainers}
                    className="h-14 w-14 text-lg font-bold text-gray-700 hover:bg-gray-100 rounded-r-xl border-l"
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                </div>
                <div className="text-sm text-gray-600 flex-1">
                  Total: <span className="font-bold text-lg text-gray-900">
                    ${(product.pricePerContainer * quantity).toLocaleString()} {product.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Botones de acción MEJORADOS - MAS PROMINENTES */}
            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                className="w-full h-16 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg transform transition-all hover:scale-105"
                disabled={product.stockContainers === 0 || cartLoading}
              >
                <ShoppingCart className="h-6 w-6 mr-3" />
                {cartLoading ? 'Agregando...' : `Agregar al Carrito (${quantity} contenedor${quantity > 1 ? 'es' : ''})`}
              </Button>
              
              <RFQRequestDialog
                product={{
                  id: product.id,
                  categoryId: product.categoryId,
                  title: product.name,
                  description: product.description,
                  containerSize: product.containerType as "20'" | "40'",
                  moq: product.moq,
                  priceRange: {
                    min: product.pricePerContainer,
                    max: product.pricePerContainer,
                    currency: product.currency,
                  },
                  images: product.images,
                  specifications: {},
                  supplierId: product.supplierId,
                  availableFrom: new Date(),
                  estimatedDelivery: `${product.productionTime + product.packagingTime} días`,
                  status: "available" as const,
                }}
                supplierId={product.supplierId}
                supplierName={product.supplier?.companyName || "Proveedor"}
              >
                <Button
                  variant="outline"
                  className="w-full h-14 text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 shadow-md"
                >
                  <MessageCircle className="h-5 w-5 mr-3" />
                  Solicitar Cotización
                </Button>
              </RFQRequestDialog>
            </div>

            {/* Estadísticas mejoradas */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl text-center border border-green-200">
                <div className="text-2xl font-bold text-green-700">{product.productionTime}</div>
                <div className="text-sm text-green-600 font-medium">Días producción</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl text-center border border-orange-200">
                <div className="text-2xl font-bold text-orange-700">{product.packagingTime}</div>
                <div className="text-sm text-orange-600 font-medium">Días empaque</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl text-center border border-purple-200">
                <div className="text-2xl font-bold text-purple-700">{product.moq}</div>
                <div className="text-sm text-purple-600 font-medium">MOQ mínimo</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs mejoradas con iconos y diseño responsivo */}
        <Tabs defaultValue="description" className="w-full mt-8">
          <TabsList className="grid w-full grid-cols-4 h-auto p-2 bg-white shadow-lg rounded-xl border border-gray-200">
            <TabsTrigger 
              value="description" 
              className="flex items-center gap-2 h-14 text-sm font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Descripción</span>
            </TabsTrigger>
            <TabsTrigger 
              value="specifications" 
              className="flex items-center gap-2 h-14 text-sm font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg"
            >
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Especificaciones</span>
            </TabsTrigger>
            <TabsTrigger 
              value="pricing" 
              className="flex items-center gap-2 h-14 text-sm font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg"
            >
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Precios</span>
            </TabsTrigger>
            <TabsTrigger 
              value="shipping" 
              className="flex items-center gap-2 h-14 text-sm font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg"
            >
              <Truck className="h-4 w-4" />
              <span className="hidden sm:inline">Envío</span>
            </TabsTrigger>
          </TabsList>

          {/* Descripción mejorada */}
          <TabsContent value="description" className="mt-6">
            <Card className="border-2 border-gray-100 shadow-lg">
              <CardContent className="p-6 lg:p-8">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FileText className="h-6 w-6 mr-3 text-blue-600" />
                  Descripción Detallada
                </h3>
                
                <div className="prose max-w-none text-gray-700 text-base leading-relaxed mb-8">
                  <p className="text-lg mb-6">{product.description}</p>
                  
                  {/* Características destacadas */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-6">
                    <h4 className="font-bold text-lg text-blue-900 mb-4 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
                      Características Destacadas
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="flex items-center bg-white bg-opacity-60 rounded-lg p-3">
                        <span className="text-green-500 mr-3">✓</span>
                        <span className="text-blue-800 font-medium">Calidad certificada internacional</span>
                      </div>
                      <div className="flex items-center bg-white bg-opacity-60 rounded-lg p-3">
                        <span className="text-green-500 mr-3">✓</span>
                        <span className="text-blue-800 font-medium">Empaque seguro para transporte</span>
                      </div>
                      <div className="flex items-center bg-white bg-opacity-60 rounded-lg p-3">
                        <span className="text-green-500 mr-3">✓</span>
                        <span className="text-blue-800 font-medium">Inspección pre-embarque incluida</span>
                      </div>
                      <div className="flex items-center bg-white bg-opacity-60 rounded-lg p-3">
                        <span className="text-green-500 mr-3">✓</span>
                        <span className="text-blue-800 font-medium">Soporte técnico especializado</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Especificaciones mejoradas */}
          <TabsContent value="specifications" className="mt-6">
            <Card className="border-2 border-gray-100 shadow-lg">
              <CardContent className="p-6 lg:p-8">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Package className="h-6 w-6 mr-3 text-green-600" />
                  Especificaciones Técnicas
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h4 className="font-bold text-lg text-green-900 mb-4">
                      📦 Información del Contenedor
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-white bg-opacity-60 rounded-lg p-3 flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Tipo:</span>
                        <Badge className="bg-green-600 text-white">{product.containerType}</Badge>
                      </div>
                      <div className="bg-white bg-opacity-60 rounded-lg p-3 flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Capacidad:</span>
                        <span className="font-bold text-green-800">
                          {product.containerType.includes("20") ? "28-33 CBM" : "58-68 CBM"}
                        </span>
                      </div>
                      <div className="bg-white bg-opacity-60 rounded-lg p-3 flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Peso máximo:</span>
                        <span className="font-bold text-green-800">
                          {product.containerType.includes("20") ? "28,230 kg" : "30,480 kg"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="font-bold text-lg text-blue-900 mb-4">
                      🏭 Información del Producto
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-white bg-opacity-60 rounded-lg p-3 flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Categoría:</span>
                        <span className="font-bold text-blue-800">{product.category?.name || "Sin categoría"}</span>
                      </div>
                      <div className="bg-white bg-opacity-60 rounded-lg p-3 flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Stock disponible:</span>
                        <span className="font-bold text-blue-800">{product.stockContainers} contenedores</span>
                      </div>
                      <div className="bg-white bg-opacity-60 rounded-lg p-3 flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Origen:</span>
                        <span className="font-bold text-blue-800">Zhongshan, China</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Precios mejorados */}
          <TabsContent value="pricing" className="mt-6">
            <Card className="border-2 border-gray-100 shadow-lg">
              <CardContent className="p-6 lg:p-8">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <DollarSign className="h-6 w-6 mr-3 text-green-600" />
                  Descuentos por Volumen
                </h3>
                
                {product.volumeDiscounts && product.volumeDiscounts.length > 0 ? (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                      <VolumePricingTable productId={product.id} />
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                      <h4 className="font-bold text-lg text-blue-900 mb-4 flex items-center">
                        <Calculator className="h-5 w-5 mr-2" />
                        Calculadora de Ahorros
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="bg-white bg-opacity-60 rounded-lg p-4 text-center">
                          <div className="text-lg font-bold text-blue-800">5%</div>
                          <div className="text-sm text-blue-600">Ahorro en 2+ contenedores</div>
                        </div>
                        <div className="bg-white bg-opacity-60 rounded-lg p-4 text-center">
                          <div className="text-lg font-bold text-blue-800">10%</div>
                          <div className="text-sm text-blue-600">Ahorro en 5+ contenedores</div>
                        </div>
                        <div className="bg-white bg-opacity-60 rounded-lg p-4 text-center">
                          <div className="text-lg font-bold text-blue-800">15%</div>
                          <div className="text-sm text-blue-600">Ahorro en 10+ contenedores</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">Sin descuentos por volumen</h4>
                    <p className="text-gray-500">Este producto mantiene precio fijo independiente de la cantidad</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Envío mejorado */}
          <TabsContent value="shipping" className="mt-6">
            <Card className="border-2 border-gray-100 shadow-lg">
              <CardContent className="p-6 lg:p-8">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Truck className="h-6 w-6 mr-3 text-orange-600" />
                  Información de Envío y Logística
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                    <h4 className="font-bold text-lg text-orange-900 mb-4 flex items-center">
                      <span className="text-orange-600 mr-2">📋</span>
                      Condiciones de Venta
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-white bg-opacity-60 rounded-lg p-3 flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Incoterm:</span>
                        <Badge className="bg-orange-600 text-white">{product.incoterm}</Badge>
                      </div>
                      <div className="bg-white bg-opacity-60 rounded-lg p-3 flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Puerto de origen:</span>
                        <span className="font-bold text-orange-800">Zhongshan, China</span>
                      </div>
                      <div className="bg-white bg-opacity-60 rounded-lg p-3 flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Moneda:</span>
                        <span className="font-bold text-orange-800">USD</span>
                      </div>
                      <div className="bg-white bg-opacity-60 rounded-lg p-3 flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Método de pago:</span>
                        <span className="font-bold text-orange-800">T/T, L/C</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="font-bold text-lg text-blue-900 mb-4 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-blue-600" />
                      Tiempos y Procesos
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-white bg-opacity-60 rounded-lg p-3 flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Producción:</span>
                        <span className="font-bold text-blue-800">{product.productionTime} días</span>
                      </div>
                      <div className="bg-white bg-opacity-60 rounded-lg p-3 flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Empaque:</span>
                        <span className="font-bold text-blue-800">{product.packagingTime} días</span>
                      </div>
                      <div className="bg-white bg-opacity-60 rounded-lg p-3 flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Total estimado:</span>
                        <span className="font-bold text-blue-800">{product.productionTime + product.packagingTime} días</span>
                      </div>
                      <div className="bg-white bg-opacity-60 rounded-lg p-3 flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Tránsito marítimo:</span>
                        <span className="font-bold text-blue-800">15-25 días</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline del proceso */}
                <div className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <h4 className="font-bold text-lg text-purple-900 mb-6 flex items-center">
                    <span className="text-purple-600 mr-2">⏱️</span>
                    Timeline del Proceso de Pedido
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="bg-purple-200 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-purple-800 font-bold">1</span>
                      </div>
                      <h5 className="font-semibold text-purple-800 mb-1">Confirmación</h5>
                      <p className="text-sm text-purple-600">1-2 días</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-purple-200 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-purple-800 font-bold">2</span>
                      </div>
                      <h5 className="font-semibold text-purple-800 mb-1">Producción</h5>
                      <p className="text-sm text-purple-600">{product.productionTime} días</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-purple-200 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-purple-800 font-bold">3</span>
                      </div>
                      <h5 className="font-semibold text-purple-800 mb-1">Embarque</h5>
                      <p className="text-sm text-purple-600">3-5 días</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-purple-200 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-purple-800 font-bold">4</span>
                      </div>
                      <h5 className="font-semibold text-purple-800 mb-1">Entrega</h5>
                      <p className="text-sm text-purple-600">15-25 días</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
