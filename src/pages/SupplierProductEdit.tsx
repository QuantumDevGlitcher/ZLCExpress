import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Navigation } from "@/components/Navigation";
import {
  ArrowLeft,
  Save,
  Package,
  DollarSign,
  Truck,
  Clock,
  Settings,
  ImagePlus,
  X,
  Plus,
  Minus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function SupplierProductEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<ProductLot>>({
    name: "",
    code: "",
    category: "",
    description: "",
    status: "draft",
    containerType: "20GP",
    moq: 1,
    unitPrice: 0,
    pricePerContainer: 0,
    currency: "USD",
    incoterm: "FOB",
    stockContainers: 0,
    unitsPerContainer: 0,
    images: [],
    volumeDiscounts: [{ minQuantity: 2, discountPercentage: 5 }],
    productionTime: 15,
    packagingTime: 3,
    isNegotiable: false,
    allowsCustomOrders: false,
  });

  const [newImageUrl, setNewImageUrl] = useState("");

  // Mock data - in real app, this would come from an API
  const mockProductLots: ProductLot[] = [
    {
      id: "lot-1",
      name: "Camisetas 100% Algodón Premium",
      code: "CAM-ALG-20GP-0500",
      category: "Ropa",
      description: "5000 camisetas 100% algodón, tallas S-XL, colores mixtos",
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
        "3000 jeans denim premium, tallas 28-42, cortes clásicos y modernos",
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

  // Load product data
  useEffect(() => {
    if (id) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const product = mockProductLots.find((p) => p.id === id);
        if (product) {
          setFormData(product);
        }
        setLoading(false);
      }, 500);
    }
  }, [id]);

  // Calculate price per container when unit price or units per container change
  useEffect(() => {
    if (formData.unitPrice && formData.unitsPerContainer) {
      setFormData((prev) => ({
        ...prev,
        pricePerContainer: prev.unitPrice! * prev.unitsPerContainer!,
      }));
    }
  }, [formData.unitPrice, formData.unitsPerContainer]);

  const handleInputChange = (field: keyof ProductLot, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addVolumeDiscount = () => {
    setFormData((prev) => ({
      ...prev,
      volumeDiscounts: [
        ...(prev.volumeDiscounts || []),
        { minQuantity: 1, discountPercentage: 0 },
      ],
    }));
  };

  const removeVolumeDiscount = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      volumeDiscounts: prev.volumeDiscounts?.filter((_, i) => i !== index),
    }));
  };

  const updateVolumeDiscount = (
    index: number,
    field: keyof VolumeDiscount,
    value: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      volumeDiscounts: prev.volumeDiscounts?.map((discount, i) =>
        i === index ? { ...discount, [field]: value } : discount,
      ),
    }));
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), newImageUrl.trim()],
      }));
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Lote actualizado",
        description: "Los cambios han sido guardados exitosamente.",
      });

      navigate("/supplier/products");
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: ProductLot["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">Activo</Badge>;
      case "draft":
        return <Badge variant="outline" className="text-orange-600">Borrador</Badge>;
      case "sold_out":
        return <Badge variant="destructive">Agotado</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactivo</Badge>;
    }
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
              <div className="space-y-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
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
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="h-8 w-8 text-blue-600" />
                Editar Lote
              </h1>
              <p className="text-gray-600 mt-1">
                Modifica la información de tu lote/producto
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to="/supplier/products">Cancelar</Link>
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Información Básica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre del Producto *</Label>
                      <Input
                        id="name"
                        value={formData.name || ""}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Ej: Camisetas 100% Algodón Premium"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="code">Código del Lote *</Label>
                      <Input
                        id="code"
                        value={formData.code || ""}
                        onChange={(e) => handleInputChange("code", e.target.value)}
                        placeholder="Ej: CAM-ALG-20GP-0500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <Select
                      value={formData.category || ""}
                      onValueChange={(value) => handleInputChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ropa">Ropa</SelectItem>
                        <SelectItem value="Calzado">Calzado</SelectItem>
                        <SelectItem value="Accesorios">Accesorios</SelectItem>
                        <SelectItem value="Hogar">Hogar</SelectItem>
                        <SelectItem value="Electrónicos">Electrónicos</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ""}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe el contenido del lote, tallas, colores, etc."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Estado</Label>
                      <Select
                        value={formData.status || "draft"}
                        onValueChange={(value) => handleInputChange("status", value as ProductLot["status"])}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Borrador</SelectItem>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="inactive">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="containerType">Tipo de Contenedor *</Label>
                      <Select
                        value={formData.containerType || "20GP"}
                        onValueChange={(value) => handleInputChange("containerType", value as ProductLot["containerType"])}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="20GP">20' GP</SelectItem>
                          <SelectItem value="40HQ">40' HQ</SelectItem>
                          <SelectItem value="40HC">40' HC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Información de Precios
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="unitPrice">Precio por Unidad *</Label>
                      <Input
                        id="unitPrice"
                        type="number"
                        step="0.01"
                        value={formData.unitPrice || ""}
                        onChange={(e) => handleInputChange("unitPrice", parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unitsPerContainer">Unidades por Contenedor *</Label>
                      <Input
                        id="unitsPerContainer"
                        type="number"
                        value={formData.unitsPerContainer || ""}
                        onChange={(e) => handleInputChange("unitsPerContainer", parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pricePerContainer">Precio por Contenedor</Label>
                      <Input
                        id="pricePerContainer"
                        type="number"
                        step="0.01"
                        value={formData.pricePerContainer || ""}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Moneda</Label>
                      <Select
                        value={formData.currency || "USD"}
                        onValueChange={(value) => handleInputChange("currency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="CNY">CNY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="incoterm">Incoterm</Label>
                      <Select
                        value={formData.incoterm || "FOB"}
                        onValueChange={(value) => handleInputChange("incoterm", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FOB">FOB</SelectItem>
                          <SelectItem value="CIF">CIF</SelectItem>
                          <SelectItem value="EXW">EXW</SelectItem>
                          <SelectItem value="FCA">FCA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="moq">MOQ (Contenedores) *</Label>
                      <Input
                        id="moq"
                        type="number"
                        value={formData.moq || ""}
                        onChange={(e) => handleInputChange("moq", parseInt(e.target.value) || 1)}
                        placeholder="1"
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Descuentos por Volumen</Label>
                    {formData.volumeDiscounts?.map((discount, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Cantidad Mínima</Label>
                            <Input
                              type="number"
                              value={discount.minQuantity}
                              onChange={(e) =>
                                updateVolumeDiscount(index, "minQuantity", parseInt(e.target.value) || 0)
                              }
                              min="1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Descuento (%)</Label>
                            <Input
                              type="number"
                              value={discount.discountPercentage}
                              onChange={(e) =>
                                updateVolumeDiscount(index, "discountPercentage", parseFloat(e.target.value) || 0)
                              }
                              min="0"
                              max="50"
                              step="0.1"
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVolumeDiscount(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addVolumeDiscount}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Descuento
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Inventory & Logistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Inventario y Logística
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stockContainers">Stock (Contenedores) *</Label>
                      <Input
                        id="stockContainers"
                        type="number"
                        value={formData.stockContainers || ""}
                        onChange={(e) => handleInputChange("stockContainers", parseInt(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productionTime">Tiempo de Producción (días)</Label>
                      <Input
                        id="productionTime"
                        type="number"
                        value={formData.productionTime || ""}
                        onChange={(e) => handleInputChange("productionTime", parseInt(e.target.value) || 0)}
                        placeholder="15"
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="packagingTime">Tiempo de Empaque (días)</Label>
                      <Input
                        id="packagingTime"
                        type="number"
                        value={formData.packagingTime || ""}
                        onChange={(e) => handleInputChange("packagingTime", parseInt(e.target.value) || 0)}
                        placeholder="3"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isNegotiable"
                        checked={formData.isNegotiable || false}
                        onCheckedChange={(checked) => handleInputChange("isNegotiable", checked)}
                      />
                      <Label htmlFor="isNegotiable">Precio negociable</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allowsCustomOrders"
                        checked={formData.allowsCustomOrders || false}
                        onCheckedChange={(checked) => handleInputChange("allowsCustomOrders", checked)}
                      />
                      <Label htmlFor="allowsCustomOrders">Acepta pedidos personalizados</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImagePlus className="h-5 w-5" />
                    Imágenes del Producto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images?.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Producto ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="URL de la imagen"
                      className="flex-1"
                    />
                    <Button onClick={addImage} disabled={!newImageUrl.trim()}>
                      Agregar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Estado del Lote
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Estado Actual:</span>
                    {getStatusBadge(formData.status!)}
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vistas totales:</span>
                      <span className="font-medium">{formData.totalViews || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Consultas:</span>
                      <span className="font-medium">{formData.totalInquiries || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Creado:</span>
                      <span className="font-medium">
                        {formData.createdAt ? new Date(formData.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Actualizado:</span>
                      <span className="font-medium">
                        {formData.updatedAt ? new Date(formData.updatedAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumen Rápido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Valor por contenedor:</span>
                    <span className="font-bold text-green-600">
                      ${(formData.pricePerContainer || 0).toLocaleString()} {formData.currency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Valor total stock:</span>
                    <span className="font-bold text-blue-600">
                      ${((formData.pricePerContainer || 0) * (formData.stockContainers || 0)).toLocaleString()} {formData.currency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Unidades totales:</span>
                    <span className="font-medium">
                      {((formData.unitsPerContainer || 0) * (formData.stockContainers || 0)).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
