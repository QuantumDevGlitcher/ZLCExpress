import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Navigation } from "@/components/Navigation";
import {
  ArrowLeft,
  Edit,
  Copy,
  Eye,
  MessageCircle,
  Share2,
  Download,
  Package,
  DollarSign,
  Truck,
  Clock,
  Target,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  Settings,
  BarChart3,
  FileText,
  Zap,
  Globe,
  Shield,
} from "lucide-react";

interface ProductLot {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  status: "active" | "draft" | "sold_out" | "inactive";
  containerType: "20GP" | "40HQ" | "40HC";
  moq: number;
  unitPrice: number;
  pricePerContainer: number;
  currency: string;
  incoterm: string;
  stockContainers: number;
  unitsPerContainer: number;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  totalViews: number;
  totalInquiries: number;
  volumeDiscounts: VolumeDiscount[];
  productionTime: number;
  packagingTime: number;
  isNegotiable: boolean;
  allowsCustomOrders: boolean;
}

interface VolumeDiscount {
  minQuantity: number;
  discountPercentage: number;
}

interface Inquiry {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  message: string;
  requestedQuantity: number;
  date: Date;
  status: "pending" | "responded" | "converted";
}

interface ViewHistory {
  date: string;
  views: number;
  inquiries: number;
}

export default function SupplierProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductLot | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock data - in real app, this would come from an API
  const mockProductLots: ProductLot[] = [
    {
      id: "lot-1",
      name: "Camisetas 100% Algodón Premium",
      code: "CAM-ALG-20GP-0500",
      category: "Ropa",
      description:
        "Lote premium de 5000 camisetas 100% algodón de alta calidad. Incluye una mezcla cuidadosamente seleccionada de tallas desde S hasta XL en una variedad de colores modernos y atemporales. Perfect para distribuidores que buscan productos de calidad superior con excelente relación precio-valor. Fabricadas con algodón certificado y procesos eco-friendly.",
      status: "active",
      containerType: "20GP",
      moq: 1,
      unitPrice: 2.5,
      pricePerContainer: 12500,
      currency: "USD",
      incoterm: "FOB ZLC",
      stockContainers: 8,
      unitsPerContainer: 5000,
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1556821840-3a9fbc0cd7b3?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=400&fit=crop",
      ],
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-20"),
      totalViews: 245,
      totalInquiries: 12,
      volumeDiscounts: [
        { minQuantity: 2, discountPercentage: 5 },
        { minQuantity: 5, discountPercentage: 10 },
        { minQuantity: 10, discountPercentage: 15 },
      ],
      productionTime: 20,
      packagingTime: 5,
      isNegotiable: true,
      allowsCustomOrders: true,
    },
    {
      id: "lot-2",
      name: "Jeans Denim Calidad Premium",
      code: "JEA-DEN-40HQ-0300",
      category: "Ropa",
      description:
        "Lote exclusivo de 3000 jeans denim premium con cortes clásicos y modernos. Tallas de 28 a 42, perfectos para el mercado mayorista.",
      status: "active",
      containerType: "40HQ",
      moq: 1,
      unitPrice: 8.75,
      pricePerContainer: 26250,
      currency: "USD",
      incoterm: "FOB ZLC",
      stockContainers: 5,
      unitsPerContainer: 3000,
      images: [
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=400&fit=crop",
      ],
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-18"),
      totalViews: 189,
      totalInquiries: 8,
      volumeDiscounts: [
        { minQuantity: 2, discountPercentage: 7 },
        { minQuantity: 4, discountPercentage: 12 },
      ],
      productionTime: 25,
      packagingTime: 3,
      isNegotiable: true,
      allowsCustomOrders: false,
    },
  ];

  // Mock inquiries data
  const mockInquiries: Inquiry[] = [
    {
      id: "inq-1",
      companyName: "Distribuidora Central S.A.",
      contactName: "María González",
      email: "maria@distribuidora.com",
      message:
        "Estamos interesados en este lote. ¿Pueden enviar muestras antes de hacer el pedido?",
      requestedQuantity: 3,
      date: new Date("2024-01-22"),
      status: "pending",
    },
    {
      id: "inq-2",
      companyName: "Retail Plus Ltd.",
      contactName: "Carlos Mendoza",
      email: "carlos@retailplus.com",
      message:
        "Necesitamos 5 contenedores. ¿Cuál sería el precio con descuento por volumen?",
      requestedQuantity: 5,
      date: new Date("2024-01-20"),
      status: "responded",
    },
    {
      id: "inq-3",
      companyName: "Fashion World Inc.",
      contactName: "Ana Torres",
      email: "ana@fashionworld.com",
      message:
        "¿Tienen disponibilidad para entrega inmediata? Necesitamos 2 contenedores.",
      requestedQuantity: 2,
      date: new Date("2024-01-18"),
      status: "converted",
    },
  ];

  // Mock view history data
  const mockViewHistory: ViewHistory[] = [
    { date: "2024-01-22", views: 15, inquiries: 2 },
    { date: "2024-01-21", views: 12, inquiries: 1 },
    { date: "2024-01-20", views: 18, inquiries: 3 },
    { date: "2024-01-19", views: 8, inquiries: 0 },
    { date: "2024-01-18", views: 22, inquiries: 1 },
    { date: "2024-01-17", views: 11, inquiries: 2 },
    { date: "2024-01-16", views: 14, inquiries: 0 },
  ];

  useEffect(() => {
    if (id) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const foundProduct = mockProductLots.find((p) => p.id === id);
        setProduct(foundProduct || null);
        setLoading(false);
      }, 500);
    }
  }, [id]);

  const getStatusBadge = (status: ProductLot["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Activo
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline" className="text-orange-600">
            <Clock className="h-3 w-3 mr-1" />
            Borrador
          </Badge>
        );
      case "sold_out":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Agotado
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="secondary">
            <Settings className="h-3 w-3 mr-1" />
            Inactivo
          </Badge>
        );
    }
  };

  const getContainerTypeDisplay = (type: string) => {
    switch (type) {
      case "20GP":
        return "20' GP";
      case "40HQ":
        return "40' HQ";
      case "40HC":
        return "40' HC";
      default:
        return type;
    }
  };

  const getInquiryStatusBadge = (status: Inquiry["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-orange-600">
            Pendiente
          </Badge>
        );
      case "responded":
        return (
          <Badge variant="outline" className="text-blue-600">
            Respondida
          </Badge>
        );
      case "converted":
        return <Badge className="bg-green-600">Convertida</Badge>;
    }
  };

  const calculateDiscountedPrice = (quantity: number, basePrice: number) => {
    if (!product) return basePrice;

    let applicableDiscount = 0;
    product.volumeDiscounts.forEach((discount) => {
      if (quantity >= discount.minQuantity) {
        applicableDiscount = Math.max(
          applicableDiscount,
          discount.discountPercentage,
        );
      }
    });

    return basePrice * (1 - applicableDiscount / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="pt-16">
          <div className="container mx-auto p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-96 bg-gray-200 rounded"></div>
                <div className="space-y-4">
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="pt-16">
          <div className="container mx-auto p-6">
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Lote no encontrado
              </h2>
              <p className="text-gray-600 mb-4">
                El lote que buscas no existe o ha sido eliminado.
              </p>
              <Button asChild>
                <Link to="/supplier/products">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Mis Lotes
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="pt-16">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/supplier/products">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a Mis Lotes
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                {getStatusBadge(product.status)}
              </div>
              <p className="text-gray-600">
                Código: {product.code} • Categoría: {product.category}
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Duplicar
              </Button>
              <Button asChild>
                <Link to={`/supplier/products/${product.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={product.images[currentImageIndex]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {product.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {product.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                              index === currentImageIndex
                                ? "border-blue-500"
                                : "border-transparent"
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
                </CardContent>
              </Card>

              {/* Detailed Information Tabs */}
              <Card>
                <CardContent className="p-6">
                  <Tabs defaultValue="details" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="details">Detalles</TabsTrigger>
                      <TabsTrigger value="pricing">Precios</TabsTrigger>
                      <TabsTrigger value="inquiries">Consultas</TabsTrigger>
                      <TabsTrigger value="analytics">Estadísticas</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          Descripción del Producto
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Especificaciones
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Tipo de Contenedor:
                              </span>
                              <span className="font-medium">
                                {getContainerTypeDisplay(product.containerType)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Unidades por Contenedor:
                              </span>
                              <span className="font-medium">
                                {product.unitsPerContainer.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">MOQ:</span>
                              <span className="font-medium">
                                {product.moq} contenedores
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Stock Disponible:
                              </span>
                              <span className="font-medium">
                                {product.stockContainers} contenedores
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Tiempos de Entrega
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Tiempo de Producción:
                              </span>
                              <span className="font-medium">
                                {product.productionTime} días
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Tiempo de Empaque:
                              </span>
                              <span className="font-medium">
                                {product.packagingTime} días
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Tiempo Total:
                              </span>
                              <span className="font-medium text-blue-600">
                                {product.productionTime + product.packagingTime}{" "}
                                días
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Opciones Comerciales
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {product.isNegotiable && (
                            <Badge variant="outline" className="text-green-600">
                              <DollarSign className="h-3 w-3 mr-1" />
                              Precio Negociable
                            </Badge>
                          )}
                          {product.allowsCustomOrders && (
                            <Badge variant="outline" className="text-blue-600">
                              <Zap className="h-3 w-3 mr-1" />
                              Pedidos Personalizados
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-purple-600">
                            <Globe className="h-3 w-3 mr-1" />
                            {product.incoterm}
                          </Badge>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="pricing" className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          Estructura de Precios
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-3">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                              <p className="text-sm text-gray-600">
                                Precio por Unidad
                              </p>
                              <p className="text-2xl font-bold text-blue-600">
                                ${product.unitPrice} {product.currency}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                              <p className="text-sm text-gray-600">
                                Precio por Contenedor
                              </p>
                              <p className="text-2xl font-bold text-green-600">
                                ${product.pricePerContainer.toLocaleString()}{" "}
                                {product.currency}
                              </p>
                            </div>
                          </div>
                        </div>

                        <h4 className="font-semibold mb-3">
                          Descuentos por Volumen
                        </h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Cantidad Mínima</TableHead>
                              <TableHead>Descuento</TableHead>
                              <TableHead>Precio c/Descuento</TableHead>
                              <TableHead>Ahorro</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {product.volumeDiscounts.map((discount, index) => {
                              const discountedPrice = calculateDiscountedPrice(
                                discount.minQuantity,
                                product.pricePerContainer,
                              );
                              const savings =
                                product.pricePerContainer - discountedPrice;

                              return (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">
                                    {discount.minQuantity}+ contenedores
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className="text-green-600"
                                    >
                                      {discount.discountPercentage}%
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    ${discountedPrice.toLocaleString()}{" "}
                                    {product.currency}
                                  </TableCell>
                                  <TableCell className="text-green-600 font-medium">
                                    ${savings.toLocaleString()}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>

                    <TabsContent value="inquiries" className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">
                          Consultas Recibidas
                        </h3>
                        <Badge variant="outline">
                          {mockInquiries.length} total
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        {mockInquiries.map((inquiry) => (
                          <div
                            key={inquiry.id}
                            className="border rounded-lg p-4 space-y-3"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">
                                  {inquiry.companyName}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {inquiry.contactName} • {inquiry.email}
                                </p>
                              </div>
                              <div className="text-right">
                                {getInquiryStatusBadge(inquiry.status)}
                                <p className="text-xs text-gray-500 mt-1">
                                  {inquiry.date.toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <p className="text-gray-700">{inquiry.message}</p>

                            <div className="flex justify-between items-center pt-2 border-t">
                              <span className="text-sm font-medium">
                                Cantidad solicitada: {inquiry.requestedQuantity}{" "}
                                contenedores
                              </span>
                              <Button size="sm" variant="outline">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Responder
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Rendimiento del Lote
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <Eye className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                          <p className="text-2xl font-bold text-blue-600">
                            {product.totalViews}
                          </p>
                          <p className="text-sm text-gray-600">
                            Vistas Totales
                          </p>
                        </div>

                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <MessageCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                          <p className="text-2xl font-bold text-green-600">
                            {product.totalInquiries}
                          </p>
                          <p className="text-sm text-gray-600">Consultas</p>
                        </div>

                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                          <p className="text-2xl font-bold text-purple-600">
                            {(
                              (product.totalInquiries / product.totalViews) *
                              100
                            ).toFixed(1)}
                            %
                          </p>
                          <p className="text-sm text-gray-600">
                            Tasa de Conversión
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">
                          Historial de Vistas (Últimos 7 días)
                        </h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Fecha</TableHead>
                              <TableHead>Vistas</TableHead>
                              <TableHead>Consultas</TableHead>
                              <TableHead>Conversión</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mockViewHistory.map((day, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  {new Date(day.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {day.views}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {day.inquiries}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="text-blue-600"
                                  >
                                    {day.views > 0
                                      ? (
                                          (day.inquiries / day.views) *
                                          100
                                        ).toFixed(1)
                                      : "0"}
                                    %
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Acciones Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full">
                    <Link to={`/supplier/products/${product.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Lote
                    </Link>
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar Lote
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Datos
                  </Button>

                  <Button variant="outline" className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Ver Reportes
                  </Button>
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Métricas Clave</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Valor Total Stock:
                      </span>
                      <span className="font-bold text-green-600">
                        $
                        {(
                          product.pricePerContainer * product.stockContainers
                        ).toLocaleString()}{" "}
                        {product.currency}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Unidades Totales:
                      </span>
                      <span className="font-medium">
                        {(
                          product.unitsPerContainer * product.stockContainers
                        ).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Valor por Unidad:
                      </span>
                      <span className="font-medium">
                        ${product.unitPrice} {product.currency}
                      </span>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Creado:</span>
                      <span className="font-medium text-xs">
                        {product.createdAt.toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Actualizado:
                      </span>
                      <span className="font-medium text-xs">
                        {product.updatedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Rendimiento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {product.totalViews}
                      </div>
                      <div className="text-sm text-gray-600">
                        Vistas totales
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {product.totalInquiries}
                      </div>
                      <div className="text-sm text-gray-600">
                        Consultas recibidas
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {(
                          (product.totalInquiries / product.totalViews) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                      <div className="text-sm text-gray-600">
                        Tasa de conversión
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stock Alert */}
              {product.stockContainers <= 2 && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-orange-700">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">Stock Bajo</span>
                    </div>
                    <p className="text-sm text-orange-600 mt-1">
                      Solo quedan {product.stockContainers} contenedores en
                      stock.
                    </p>
                    <Button size="sm" className="mt-3 w-full">
                      Reabastecer Stock
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
