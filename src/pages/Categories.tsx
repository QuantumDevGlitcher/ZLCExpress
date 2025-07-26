import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Navigation } from "@/components/Navigation";
import { useCart } from "@/contexts/CartContext";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Package,
  MapPin,
  Clock,
  Building,
  Truck,
  DollarSign,
  ArrowUpDown,
  Eye,
  Heart,
  Share2,
  Filter,
  Grid3X3,
  List,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  getCategories, 
  getProducts, 
  Category, 
  Product, 
  ProductFilters 
} from "@/services/api";

export default function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addItem, state: { isLoading: cartLoading } } = useCart();
  
  // Estados para datos del backend
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedContainerType, setSelectedContainerType] = useState<string>("");
  const [selectedIncoterm, setSelectedIncoterm] = useState<string>("");
  const [onlyNegotiable, setOnlyNegotiable] = useState(false);
  const [onlyCustomOrders, setOnlyCustomOrders] = useState(false);
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Estados para UI
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 20;

  // Cargar categorías al montar el componente
  useEffect(() => {
    loadCategories();
  }, []);

  // Cargar productos cuando cambien los filtros
  useEffect(() => {
    loadProducts();
  }, [
    selectedCategory,
    searchTerm,
    priceRange,
    selectedContainerType,
    selectedIncoterm,
    onlyNegotiable,
    onlyCustomOrders,
    sortBy,
    sortOrder,
    currentPage
  ]);

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      if (response.success) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const filters: ProductFilters = {
        page: currentPage,
        limit: itemsPerPage,
        sortBy: sortBy as any,
        sortOrder,
      };

      if (selectedCategory) filters.category = selectedCategory;
      if (searchTerm) filters.search = searchTerm;
      if (priceRange[0] > 0) filters.priceMin = priceRange[0];
      if (priceRange[1] < 50000) filters.priceMax = priceRange[1];
      if (selectedContainerType) filters.containerType = selectedContainerType;
      if (selectedIncoterm) filters.incoterm = selectedIncoterm;
      if (onlyNegotiable) filters.isNegotiable = true;
      if (onlyCustomOrders) filters.allowsCustomOrders = true;

      const response = await getProducts(filters);
      if (response.success) {
        setProducts(response.products);
        setTotalProducts(response.total);
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setProductsLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const newOpenCategories = new Set(openCategories);
    if (newOpenCategories.has(categoryId)) {
      newOpenCategories.delete(categoryId);
    } else {
      newOpenCategories.add(categoryId);
    }
    setOpenCategories(newOpenCategories);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? "" : categoryId);
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedCategory("");
    setSearchTerm("");
    setPriceRange([0, 50000]);
    setSelectedContainerType("");
    setSelectedIncoterm("");
    setOnlyNegotiable(false);
    setOnlyCustomOrders(false);
    setSortBy("name");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  // Función para navegar a la página de detalles del producto
  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  // Función para agregar productos al carrito
  const addToCart = async (product: Product) => {
    try {
      await addItem(
        product.id,
        1, // Cantidad mínima
        product.containerType,
        product.incoterm
      );
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const renderCategoryTree = (categoryList: Category[], level: number = 0) => {
    const parentCategories = categoryList.filter(cat => cat.level === level);
    
    return parentCategories.map((category) => {
      const subcategories = categoryList.filter(cat => cat.parentId === category.id);
      const hasSubcategories = subcategories.length > 0;
      const isOpen = openCategories.has(category.id);
      const isSelected = selectedCategory === category.id;

      return (
        <div key={category.id} className="space-y-1">
          <div className={cn(
            "flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors",
            isSelected && "bg-blue-50 border border-blue-200"
          )}>
            {hasSubcategories && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => toggleCategory(category.id)}
              >
                {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </Button>
            )}
            {!hasSubcategories && <div className="w-4" />}
            
            <div 
              className="flex-1 flex items-center justify-between"
              onClick={() => handleCategorySelect(category.id)}
            >
              <span className={cn(
                "text-sm font-medium",
                level > 0 && "text-gray-600",
                isSelected && "text-blue-600"
              )}>
                {category.name}
              </span>
              <Badge variant="secondary" className="text-xs">
                {category.productCount}
              </Badge>
            </div>
          </div>

          {hasSubcategories && isOpen && (
            <div className="ml-4 space-y-1">
              {renderCategoryTree(subcategories, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="text-green-600 border-green-200">Disponible</Badge>;
      case 'sold_out':
        return <Badge variant="outline" className="text-red-600 border-red-200">Agotado</Badge>;
      default:
        return <Badge variant="outline">Inactivo</Badge>;
    }
  };

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando categorías...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-4 lg:py-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Catálogo de Productos
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">
            Descubre miles de productos disponibles en contenedores completos
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar de Filtros */}
          <div className={cn(
            "w-full lg:w-80 lg:flex-shrink-0",
            showFilters ? "block" : "hidden lg:block"
          )}>
            <div className="lg:sticky lg:top-4 space-y-4 lg:space-y-6 bg-white lg:bg-transparent border lg:border-0 rounded-lg lg:rounded-none p-4 lg:p-0">
              {/* Búsqueda */}
              <div>
                <Label className="text-sm font-semibold mb-2 block">Buscar Productos</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por nombre, código..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Categorías */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Categorías</Label>
                <div className="max-h-96 overflow-y-auto border rounded-lg p-2">
                  {renderCategoryTree(categories)}
                </div>
              </div>

              {/* Rango de Precios */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">
                  Precio por Contenedor: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </Label>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  max={50000}
                  min={0}
                  step={500}
                  className="mt-2"
                />
              </div>

              {/* Tipo de Contenedor */}
              <div>
                <Label className="text-sm font-semibold mb-2 block">Tipo de Contenedor</Label>
                <Select value={selectedContainerType || "all"} onValueChange={(value) => setSelectedContainerType(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" key="container-all">Todos los tipos</SelectItem>
                    <SelectItem value="20GP" key="container-20gp">20GP</SelectItem>
                    <SelectItem value="40GP" key="container-40gp">40GP</SelectItem>
                    <SelectItem value="40HC" key="container-40hc">40HC</SelectItem>
                    <SelectItem value="45HC" key="container-45hc">45HC</SelectItem>
                    <SelectItem value="LCL" key="container-lcl">LCL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Incoterm */}
              <div>
                <Label className="text-sm font-semibold mb-2 block">Incoterm</Label>
                <Select value={selectedIncoterm || "all"} onValueChange={(value) => setSelectedIncoterm(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los términos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" key="incoterm-all">Todos los términos</SelectItem>
                    <SelectItem value="FOB ZLC" key="incoterm-fob">FOB ZLC</SelectItem>
                    <SelectItem value="CIF" key="incoterm-cif">CIF</SelectItem>
                    <SelectItem value="EXW" key="incoterm-exw">EXW</SelectItem>
                    <SelectItem value="DDP" key="incoterm-ddp">DDP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtros adicionales */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold block">Opciones Especiales</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="negotiable"
                    checked={onlyNegotiable}
                    onCheckedChange={(checked) => setOnlyNegotiable(checked === true)}
                  />
                  <Label htmlFor="negotiable" className="text-sm">Precio negociable</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="custom"
                    checked={onlyCustomOrders}
                    onCheckedChange={(checked) => setOnlyCustomOrders(checked === true)}
                  />
                  <Label htmlFor="custom" className="text-sm">Órdenes personalizadas</Label>
                </div>
              </div>

              <Button onClick={resetFilters} variant="outline" className="w-full">
                Limpiar Filtros
              </Button>
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 lg:mb-6 bg-gray-50 p-3 lg:p-4 rounded-lg gap-3 lg:gap-0">
              <div className="flex items-center space-x-2 lg:space-x-4">
                <span className="text-xs lg:text-sm text-gray-600">
                  {totalProducts} productos encontrados
                  {selectedCategory && categories.find(c => c.id === selectedCategory) && (
                    <span className="ml-1 lg:ml-2 block lg:inline">
                      en <strong>{categories.find(c => c.id === selectedCategory)?.name}</strong>
                    </span>
                  )}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-4">
                {/* Ordenamiento */}
                <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                  const [field, order] = value.split('-');
                  setSortBy(field);
                  setSortOrder(order as "asc" | "desc");
                }}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Ordenar por..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc" key="sort-name-asc">Nombre A-Z</SelectItem>
                    <SelectItem value="name-desc" key="sort-name-desc">Nombre Z-A</SelectItem>
                    <SelectItem value="pricePerContainer-asc" key="sort-price-asc">Precio menor a mayor</SelectItem>
                    <SelectItem value="pricePerContainer-desc" key="sort-price-desc">Precio mayor a menor</SelectItem>
                    <SelectItem value="createdAt-desc" key="sort-date-desc">Más recientes</SelectItem>
                    <SelectItem value="totalViews-desc" key="sort-views-desc">Más vistos</SelectItem>
                  </SelectContent>
                </Select>

                {/* Vista */}
                <div className="hidden sm:flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Lista de Productos */}
            {productsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando productos...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
                <p className="text-gray-600 mb-4">Intenta ajustar los filtros de búsqueda</p>
                <Button onClick={resetFilters} variant="outline">
                  Limpiar filtros
                </Button>
              </div>
            ) : (
              <div className={cn(
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6" 
                  : "space-y-3 lg:space-y-4"
              )}>
                {products.map((product) => (
                  <Card 
                    key={product.id} 
                    className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <CardContent className="p-0">
                      <div className={cn(
                        "relative",
                        viewMode === "list" && "flex flex-col sm:flex-row"
                      )}>
                        {/* Imagen */}
                        <div className={cn(
                          "relative overflow-hidden",
                          viewMode === "grid" ? "h-40 sm:h-48" : "h-40 sm:w-48 sm:h-32 flex-shrink-0"
                        )}>
                          <img
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute top-2 left-2">
                            {getStatusBadge(product.status)}
                          </div>
                          <div className="absolute top-2 right-2 flex space-x-1">
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Lógica para favoritos
                              }}
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Lógica para compartir
                              }}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Contenido */}
                        <div className="p-3 lg:p-4 flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1 text-sm lg:text-base">
                              {product.name}
                            </h3>
                          </div>

                          <p className="text-xs lg:text-sm text-gray-600 mb-3 line-clamp-2">
                            {product.description}
                          </p>

                          <div className="space-y-1 lg:space-y-2 mb-3 lg:mb-4">
                            <div className="flex items-center text-xs lg:text-sm text-gray-600">
                              <Package className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 text-blue-600 flex-shrink-0" />
                              <span className="truncate">{product.containerType} - {product.unitsPerContainer.toLocaleString()} unidades</span>
                            </div>
                            
                            <div className="flex items-center text-xs lg:text-sm text-gray-600">
                              <Building className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 text-green-600 flex-shrink-0" />
                              <span className="truncate">{product.supplier?.companyName}</span>
                              {product.supplier?.isVerified && (
                                <Badge variant="outline" className="ml-2 text-xs">Verificado</Badge>
                              )}
                            </div>

                            <div className="flex items-center text-xs lg:text-sm text-gray-600">
                              <Truck className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 text-orange-600 flex-shrink-0" />
                              <span className="truncate">{product.incoterm}</span>
                            </div>

                            <div className="flex items-center text-xs lg:text-sm text-gray-600">
                              <Clock className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 text-purple-600 flex-shrink-0" />
                              <span className="truncate">Producción: {product.productionTime} días</span>
                            </div>

                            <div className="flex items-center text-xs lg:text-sm text-gray-600">
                              <Eye className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 text-gray-500 flex-shrink-0" />
                              <span className="truncate">{product.totalViews} vistas</span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 lg:mb-4 gap-2">
                            <div>
                              <div className="text-xl lg:text-2xl font-bold text-gray-900">
                                {formatPrice(product.pricePerContainer)}
                              </div>
                              <div className="text-xs lg:text-sm text-gray-600">
                                ${product.unitPrice}/unidad
                              </div>
                            </div>
                            {product.isNegotiable && (
                              <Badge variant="outline" className="text-green-600 border-green-200 self-start sm:self-center text-xs">
                                Negociable
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProductClick(product);
                              }}
                              variant="outline"
                              size="sm"
                              className="flex-1 h-8 lg:h-9 text-xs lg:text-sm"
                            >
                              <Eye className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                              Ver detalles
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product);
                              }}
                              size="sm"
                              className="h-8 lg:h-9 text-xs lg:text-sm px-2 lg:px-3 sm:w-auto w-full"
                              disabled={cartLoading}
                            >
                              <ShoppingCart className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                              {cartLoading ? 'Agregando...' : 'Agregar'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 sm:space-x-2 mt-6 lg:mt-8 px-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  size="sm"
                  className="w-full sm:w-auto text-xs lg:text-sm"
                >
                  Anterior
                </Button>
                
                <div className="flex space-x-1 sm:space-x-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 lg:w-10 lg:h-10 text-xs lg:text-sm p-0"
                        size="sm"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  size="sm"
                  className="w-full sm:w-auto text-xs lg:text-sm"
                >
                  Siguiente
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
