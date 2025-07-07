import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Navigation } from "@/components/Navigation";
import {
  Package,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Power,
  PowerOff,
  RefreshCw,
  Filter,
  FileImage,
  DollarSign,
  Box,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

interface ProductLot {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  status: "active" | "draft" | "sold_out" | "inactive";
  containerType: "20GP" | "40HQ" | "40HC";
  moq: number; // Minimum Order Quantity (containers)
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
  productionTime: number; // days
  packagingTime: number; // days
  isNegotiable: boolean;
  allowsCustomOrders: boolean;
}

interface VolumeDiscount {
  minQuantity: number;
  discountPercentage: number;
}

export default function SupplierProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductLot | null>(
    null,
  );
  const [restockQuantity, setRestockQuantity] = useState("");

  // Mock data for supplier's product lots
  const [productLots, setProductLots] = useState<ProductLot[]>([
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
        "/images/tshirts-1.jpg",
        "/images/tshirts-2.jpg",
        "/images/container-tshirts.jpg",
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
        "/images/jeans-1.jpg",
        "/images/jeans-2.jpg",
        "/images/container-jeans.jpg",
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
    {
      id: "lot-3",
      name: "Zapatos Deportivos Mixtos",
      code: "ZAP-DEP-40HC-0250",
      category: "Calzado",
      description:
        "2500 pares zapatos deportivos, tallas 35-45, colores variados",
      status: "sold_out",
      containerType: "40HC",
      moq: 1,
      unitPrice: 15.0,
      pricePerContainer: 37500,
      currency: "USD",
      incoterm: "FOB ZLC",
      stockContainers: 0,
      unitsPerContainer: 2500,
      images: [
        "/images/shoes-1.jpg",
        "/images/shoes-2.jpg",
        "/images/container-shoes.jpg",
      ],
      createdAt: new Date("2024-01-05"),
      updatedAt: new Date("2024-01-22"),
      totalViews: 320,
      totalInquiries: 15,
      volumeDiscounts: [
        { minQuantity: 2, discountPercentage: 8 },
        { minQuantity: 3, discountPercentage: 15 },
      ],
      productionTime: 30,
      packagingTime: 7,
      isNegotiable: false,
      allowsCustomOrders: true,
    },
    {
      id: "lot-4",
      name: "Accesorios de Moda Variados",
      code: "ACC-MOD-20GP-1000",
      category: "Ropa",
      description:
        "Lote mixto: bolsos, carteras, cinturones, bufandas (1000 unidades)",
      status: "draft",
      containerType: "20GP",
      moq: 2,
      unitPrice: 4.5,
      pricePerContainer: 4500,
      currency: "USD",
      incoterm: "FOB ZLC",
      stockContainers: 12,
      unitsPerContainer: 1000,
      images: ["/images/accessories-1.jpg"],
      createdAt: new Date("2024-01-25"),
      updatedAt: new Date("2024-01-25"),
      totalViews: 0,
      totalInquiries: 0,
      volumeDiscounts: [
        { minQuantity: 3, discountPercentage: 10 },
        { minQuantity: 6, discountPercentage: 18 },
      ],
      productionTime: 15,
      packagingTime: 3,
      isNegotiable: true,
      allowsCustomOrders: true,
    },
  ]);

  const getStatusBadge = (status: ProductLot["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Activo
          </Badge>
        );
      case "draft":
        return (
          <Badge
            variant="outline"
            className="text-orange-600 border-orange-300"
          >
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
            <PowerOff className="h-3 w-3 mr-1" />
            Inactivo
          </Badge>
        );
      default:
        return null;
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

  const filteredProducts = productLots.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (
    productId: string,
    newStatus: ProductLot["status"],
  ) => {
    setProductLots((prevLots) =>
      prevLots.map((lot) =>
        lot.id === productId
          ? { ...lot, status: newStatus, updatedAt: new Date() }
          : lot,
      ),
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProductLots((prevLots) =>
      prevLots.filter((lot) => lot.id !== productId),
    );
  };

  const handleRestockSubmit = () => {
    if (selectedProduct && restockQuantity) {
      const quantity = parseInt(restockQuantity);
      setProductLots((prevLots) =>
        prevLots.map((lot) =>
          lot.id === selectedProduct.id
            ? {
                ...lot,
                stockContainers: lot.stockContainers + quantity,
                status: lot.status === "sold_out" ? "active" : lot.status,
                updatedAt: new Date(),
              }
            : lot,
        ),
      );
      setRestockDialogOpen(false);
      setSelectedProduct(null);
      setRestockQuantity("");
    }
  };

  const statusCounts = {
    all: productLots.length,
    active: productLots.filter((p) => p.status === "active").length,
    draft: productLots.filter((p) => p.status === "draft").length,
    sold_out: productLots.filter((p) => p.status === "sold_out").length,
    inactive: productLots.filter((p) => p.status === "inactive").length,
  };

  const totalValue = productLots
    .filter((p) => p.status === "active")
    .reduce(
      (sum, product) =>
        sum + product.pricePerContainer * product.stockContainers,
      0,
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="pt-16">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="h-8 w-8 text-blue-600" />
                Mis Lotes / Productos
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona tus lotes por contenedor y mantén actualizado tu
                inventario
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to="/supplier/dashboard">← Volver al Panel</Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/supplier/products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Nuevo Lote
                </Link>
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Lotes
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {productLots.length}
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
                    <p className="text-sm font-medium text-gray-600">Activos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statusCounts.active}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Box className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Contenedores Stock
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {productLots
                        .filter((p) => p.status === "active")
                        .reduce((sum, p) => sum + p.stockContainers, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Valor Inventario
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${totalValue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por nombre, código o categoría..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {[
                    { key: "all", label: "Todos", count: statusCounts.all },
                    {
                      key: "active",
                      label: "Activos",
                      count: statusCounts.active,
                    },
                    {
                      key: "draft",
                      label: "Borradores",
                      count: statusCounts.draft,
                    },
                    {
                      key: "sold_out",
                      label: "Agotados",
                      count: statusCounts.sold_out,
                    },
                    {
                      key: "inactive",
                      label: "Inactivos",
                      count: statusCounts.inactive,
                    },
                  ].map((filter) => (
                    <Button
                      key={filter.key}
                      variant={
                        statusFilter === filter.key ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setStatusFilter(filter.key)}
                      className="whitespace-nowrap"
                    >
                      {filter.label}
                      <Badge
                        variant={
                          statusFilter === filter.key ? "secondary" : "outline"
                        }
                        className="ml-2"
                      >
                        {filter.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                Listado de Lotes ({filteredProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredProducts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No hay lotes</p>
                  <p className="text-sm">
                    {searchTerm || statusFilter !== "all"
                      ? "No se encontraron lotes con los filtros seleccionados"
                      : "Aún no has creado ningún lote"}
                  </p>
                  {!searchTerm && statusFilter === "all" && (
                    <Button asChild className="mt-4">
                      <Link to="/supplier/products/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Primer Lote
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Contenedor</TableHead>
                      <TableHead>Precio FOB</TableHead>
                      <TableHead>MOQ</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Vistas</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              {product.images.length > 0 ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                              ) : (
                                <FileImage className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {product.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {product.code}
                              </p>
                              <p className="text-xs text-gray-500">
                                {product.category}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>{getStatusBadge(product.status)}</TableCell>

                        <TableCell>
                          <span className="font-medium">
                            {getContainerTypeDisplay(product.containerType)}
                          </span>
                        </TableCell>

                        <TableCell>
                          <div>
                            <span className="font-medium">
                              ${product.pricePerContainer.toLocaleString()}{" "}
                              {product.currency}
                            </span>
                            <p className="text-xs text-gray-500">
                              ${product.unitPrice}/unidad
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.incoterm}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="font-medium">{product.moq}</span>
                          <p className="text-xs text-gray-500">contenedores</p>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-medium ${
                                product.stockContainers === 0
                                  ? "text-red-600"
                                  : product.stockContainers <= 2
                                    ? "text-orange-600"
                                    : "text-gray-900"
                              }`}
                            >
                              {product.stockContainers}
                            </span>
                            {product.status === "sold_out" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 text-xs"
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setRestockDialogOpen(true);
                                }}
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Reabastecer
                              </Button>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div>
                            <span className="font-medium">
                              {product.totalViews}
                            </span>
                            <p className="text-xs text-gray-500">
                              {product.totalInquiries} consultas
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/supplier/products/${product.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver Detalles
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  to={`/supplier/products/${product.id}/edit`}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />

                              {product.status === "active" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(product.id, "inactive")
                                  }
                                >
                                  <PowerOff className="mr-2 h-4 w-4" />
                                  Desactivar
                                </DropdownMenuItem>
                              )}

                              {product.status === "inactive" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(product.id, "active")
                                  }
                                >
                                  <Power className="mr-2 h-4 w-4" />
                                  Activar
                                </DropdownMenuItem>
                              )}

                              {product.status === "draft" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(product.id, "active")
                                  }
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Publicar
                                </DropdownMenuItem>
                              )}

                              {product.status === "sold_out" && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setRestockDialogOpen(true);
                                  }}
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Reabastecer Stock
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      ¿Eliminar lote?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción no se puede deshacer. El lote
                                      "{product.name}" será eliminado
                                      permanentemente.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteProduct(product.id)
                                      }
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Eliminar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Restock Dialog */}
          <AlertDialog
            open={restockDialogOpen}
            onOpenChange={setRestockDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reabastecer Stock</AlertDialogTitle>
                <AlertDialogDescription>
                  {selectedProduct && (
                    <>
                      Añadir contenedores al lote "{selectedProduct.name}".
                      <br />
                      Stock actual: {selectedProduct.stockContainers}{" "}
                      contenedores
                    </>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <Input
                  type="number"
                  placeholder="Cantidad de contenedores a añadir"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(e.target.value)}
                  min="1"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setRestockQuantity("")}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRestockSubmit}
                  disabled={!restockQuantity || parseInt(restockQuantity) <= 0}
                >
                  Reabastecer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
    </div>
  );
}
