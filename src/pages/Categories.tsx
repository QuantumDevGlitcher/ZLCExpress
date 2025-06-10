import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navigation } from "@/components/Navigation";
import {
  Search,
  Grid3X3,
  List,
  Filter,
  Package,
  MapPin,
  Clock,
  Star,
  Building,
  Truck,
  DollarSign,
  ArrowUpDown,
  ChevronDown,
  Eye,
  Heart,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for container lots
const containerLots = [
  {
    id: "1",
    title: "Blusa de manga larga casual",
    description: "5000 camisetas algodón - 20' GP",
    category: "ropa",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    pricePerContainer: 15000,
    unitPrice: 3.0,
    currency: "USD",
    moq: 1,
    containerType: "20'",
    supplier: "Textiles del Pacífico S.A.",
    supplierVerified: true,
    location: "Zona Libre de Colón",
    leadTime: "15-20 días",
    incoterm: "FOB",
    negotiable: true,
    colors: ["Blanco", "Negro", "Rosa", "Gris"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.8,
    orders: 124,
  },
  {
    id: "2",
    title: "Calzado deportivo premium",
    description: "2000 pares zapatillas - 20' GP",
    category: "calzado",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
    pricePerContainer: 28000,
    unitPrice: 14.0,
    currency: "USD",
    moq: 1,
    containerType: "20'",
    supplier: "Calzados Industriales ZLC",
    supplierVerified: true,
    location: "Zona Libre de Colón",
    leadTime: "25-30 días",
    incoterm: "CIF",
    negotiable: false,
    colors: ["Negro", "Blanco", "Azul"],
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43"],
    rating: 4.9,
    orders: 89,
  },
  {
    id: "3",
    title: "Electrónicos para hogar",
    description: "1000 unidades dispositivos - 40' HQ",
    category: "electronicos",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
    pricePerContainer: 85000,
    unitPrice: 85.0,
    currency: "USD",
    moq: 1,
    containerType: "40'",
    supplier: "Electronics ZLC Corp",
    supplierVerified: true,
    location: "Zona Libre de Colón",
    leadTime: "35-45 días",
    incoterm: "EXW",
    negotiable: true,
    colors: ["Negro", "Plata"],
    sizes: ["Estándar"],
    rating: 4.7,
    orders: 67,
  },
  {
    id: "4",
    title: "Artículos para el hogar",
    description: "3000 piezas decoración - 40' HC",
    category: "hogar",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    pricePerContainer: 22000,
    unitPrice: 7.33,
    currency: "USD",
    moq: 2,
    containerType: "40'",
    supplier: "Decoraciones del Caribe",
    supplierVerified: true,
    location: "Zona Libre de Colón",
    leadTime: "20-25 días",
    incoterm: "FOB",
    negotiable: true,
    colors: ["Varios"],
    sizes: ["Mixto"],
    rating: 4.6,
    orders: 156,
  },
  {
    id: "5",
    title: "Productos de belleza premium",
    description: "4000 unidades cosméticos - 20' GP",
    category: "belleza",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
    pricePerContainer: 32000,
    unitPrice: 8.0,
    currency: "USD",
    moq: 1,
    containerType: "20'",
    supplier: "Beauty Supply ZLC",
    supplierVerified: true,
    location: "Zona Libre de Colón",
    leadTime: "18-22 días",
    incoterm: "CIF",
    negotiable: false,
    colors: ["Varios"],
    sizes: ["50ml", "100ml", "200ml"],
    rating: 4.8,
    orders: 203,
  },
  {
    id: "6",
    title: "Equipos deportivos",
    description: "1500 artículos deportivos - 40' HQ",
    category: "deportes",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    pricePerContainer: 45000,
    unitPrice: 30.0,
    currency: "USD",
    moq: 1,
    containerType: "40'",
    supplier: "Sports Equipment ZLC",
    supplierVerified: true,
    location: "Zona Libre de Colón",
    leadTime: "30-35 días",
    incoterm: "FOB",
    negotiable: true,
    colors: ["Negro", "Azul", "Rojo"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.7,
    orders: 91,
  },
];

const categories = [
  { id: "todos", name: "Todos los productos", count: containerLots.length },
  { id: "ropa", name: "Ropa al por Mayor", count: 1 },
  { id: "calzado", name: "Calzado", count: 1 },
  { id: "electronicos", name: "Electrónicos", count: 1 },
  { id: "hogar", name: "Hogar y Decoración", count: 1 },
  { id: "belleza", name: "Belleza y Cuidado", count: 1 },
  { id: "deportes", name: "Deportes", count: 1 },
];

const containerTypes = ["20'", "40'", "40' HQ", "40' HC"];
const incoterms = ["FOB", "CIF", "EXW", "DAP", "DDP"];
const origins = [
  "Zona Libre de Colón",
  "China",
  "India",
  "Vietnam",
  "Tailandia",
];

export default function Categories() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "todos",
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(true);

  // Filter states
  const [containerRange, setContainerRange] = useState([1, 5]);
  const [selectedContainerTypes, setSelectedContainerTypes] = useState<
    string[]
  >([]);
  const [selectedIncoterms, setSelectedIncoterms] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [negotiableOnly, setNegotiableOnly] = useState(false);

  // Filter and search logic
  const filteredLots = useMemo(() => {
    let filtered = containerLots;

    // Category filter
    if (selectedCategory !== "todos") {
      filtered = filtered.filter((lot) => lot.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lot) =>
          lot.title.toLowerCase().includes(query) ||
          lot.description.toLowerCase().includes(query) ||
          lot.supplier.toLowerCase().includes(query),
      );
    }

    // Container type filter
    if (selectedContainerTypes.length > 0) {
      filtered = filtered.filter((lot) =>
        selectedContainerTypes.includes(lot.containerType),
      );
    }

    // Incoterm filter
    if (selectedIncoterms.length > 0) {
      filtered = filtered.filter((lot) =>
        selectedIncoterms.includes(lot.incoterm),
      );
    }

    // Origin filter
    if (selectedOrigins.length > 0) {
      filtered = filtered.filter((lot) =>
        selectedOrigins.includes(lot.location),
      );
    }

    // Price filter
    filtered = filtered.filter(
      (lot) =>
        lot.pricePerContainer >= priceRange[0] &&
        lot.pricePerContainer <= priceRange[1],
    );

    // Verified filter
    if (verifiedOnly) {
      filtered = filtered.filter((lot) => lot.supplierVerified);
    }

    // Negotiable filter
    if (negotiableOnly) {
      filtered = filtered.filter((lot) => lot.negotiable);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.pricePerContainer - b.pricePerContainer);
        break;
      case "price-high":
        filtered.sort((a, b) => b.pricePerContainer - a.pricePerContainer);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        filtered.sort((a, b) => b.orders - a.orders);
        break;
    }

    return filtered;
  }, [
    selectedCategory,
    searchQuery,
    selectedContainerTypes,
    selectedIncoterms,
    selectedOrigins,
    priceRange,
    verifiedOnly,
    negotiableOnly,
    sortBy,
  ]);

  const handleContainerTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedContainerTypes([...selectedContainerTypes, type]);
    } else {
      setSelectedContainerTypes(
        selectedContainerTypes.filter((t) => t !== type),
      );
    }
  };

  const handleIncotermChange = (term: string, checked: boolean) => {
    if (checked) {
      setSelectedIncoterms([...selectedIncoterms, term]);
    } else {
      setSelectedIncoterms(selectedIncoterms.filter((t) => t !== term));
    }
  };

  const handleOriginChange = (origin: string, checked: boolean) => {
    if (checked) {
      setSelectedOrigins([...selectedOrigins, origin]);
    } else {
      setSelectedOrigins(selectedOrigins.filter((o) => o !== origin));
    }
  };

  const clearAllFilters = () => {
    setSelectedContainerTypes([]);
    setSelectedIncoterms([]);
    setSelectedOrigins([]);
    setPriceRange([0, 100000]);
    setVerifiedOnly(false);
    setNegotiableOnly(false);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-zlc-gray-50">
      <Navigation />

      <main style={{ paddingTop: "80px" }}>
        <div className="container-section py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-zlc-gray-900 mb-2">
              Catálogo B2B - Productos por Contenedor
            </h1>
            <p className="text-zlc-gray-600">
              Explore productos al por mayor disponibles en contenedores
              completos desde la Zona Libre de Colón
            </p>
          </div>

          {/* Search and Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zlc-gray-400" />
                <Input
                  placeholder="Buscar productos, marcas, códigos HS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-10"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-10"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevancia</SelectItem>
                  <SelectItem value="price-low">
                    Precio: Menor a Mayor
                  </SelectItem>
                  <SelectItem value="price-high">
                    Precio: Mayor a Menor
                  </SelectItem>
                  <SelectItem value="rating">Mejor Calificación</SelectItem>
                  <SelectItem value="popular">Más Populares</SelectItem>
                </SelectContent>
              </Select>

              {/* Filter Toggle Mobile */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden h-10"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Categories Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="h-8"
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count and Active Filters */}
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="text-sm text-zlc-gray-600">
              Mostrando {filteredLots.length} productos
              {selectedCategory !== "todos" && (
                <span>
                  {" "}
                  en {categories.find((c) => c.id === selectedCategory)?.name}
                </span>
              )}
            </div>

            {/* Active Filters */}
            {(selectedContainerTypes.length > 0 ||
              selectedIncoterms.length > 0 ||
              selectedOrigins.length > 0 ||
              verifiedOnly ||
              negotiableOnly) && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-zlc-gray-600">
                  Filtros activos:
                </span>
                {selectedContainerTypes.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type}
                  </Badge>
                ))}
                {selectedIncoterms.map((term) => (
                  <Badge key={term} variant="secondary" className="text-xs">
                    {term}
                  </Badge>
                ))}
                {selectedOrigins.map((origin) => (
                  <Badge key={origin} variant="secondary" className="text-xs">
                    {origin}
                  </Badge>
                ))}
                {verifiedOnly && (
                  <Badge variant="secondary" className="text-xs">
                    Verificado ZLC
                  </Badge>
                )}
                {negotiableOnly && (
                  <Badge variant="secondary" className="text-xs">
                    Negociable
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs h-6"
                >
                  Limpiar todo
                </Button>
              </div>
            )}
          </div>

          <div className="flex gap-6">
            {/* Filters Sidebar */}
            <aside
              className={cn(
                "w-80 space-y-6",
                showFilters ? "block" : "hidden lg:block",
              )}
            >
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros Especializados B2B
                </h3>

                <Accordion
                  type="multiple"
                  defaultValue={[
                    "containers",
                    "logistics",
                    "supplier",
                    "price",
                  ]}
                  className="space-y-2"
                >
                  {/* Container Filters */}
                  <AccordionItem value="containers">
                    <AccordionTrigger className="text-sm font-medium">
                      Contenedores
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          # de Contenedores: {containerRange[0]} -{" "}
                          {containerRange[1]}
                        </label>
                        <Slider
                          value={containerRange}
                          onValueChange={setContainerRange}
                          max={10}
                          min={1}
                          step={1}
                          className="mb-2"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Tipo de Contenedor
                        </label>
                        <div className="space-y-2">
                          {containerTypes.map((type) => (
                            <div
                              key={type}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={type}
                                checked={selectedContainerTypes.includes(type)}
                                onCheckedChange={(checked) =>
                                  handleContainerTypeChange(type, !!checked)
                                }
                              />
                              <label htmlFor={type} className="text-sm">
                                {type}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Logistics */}
                  <AccordionItem value="logistics">
                    <AccordionTrigger className="text-sm font-medium">
                      Logística
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Incoterm
                        </label>
                        <div className="space-y-2">
                          {incoterms.map((term) => (
                            <div
                              key={term}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={term}
                                checked={selectedIncoterms.includes(term)}
                                onCheckedChange={(checked) =>
                                  handleIncotermChange(term, !!checked)
                                }
                              />
                              <label htmlFor={term} className="text-sm">
                                {term}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Origen
                        </label>
                        <div className="space-y-2">
                          {origins.map((origin) => (
                            <div
                              key={origin}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={origin}
                                checked={selectedOrigins.includes(origin)}
                                onCheckedChange={(checked) =>
                                  handleOriginChange(origin, !!checked)
                                }
                              />
                              <label htmlFor={origin} className="text-sm">
                                {origin}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Supplier */}
                  <AccordionItem value="supplier">
                    <AccordionTrigger className="text-sm font-medium">
                      Proveedor
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="verified"
                          checked={verifiedOnly}
                          onCheckedChange={setVerifiedOnly}
                        />
                        <label htmlFor="verified" className="text-sm">
                          Solo Verificados ZLC
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="negotiable"
                          checked={negotiableOnly}
                          onCheckedChange={setNegotiableOnly}
                        />
                        <label htmlFor="negotiable" className="text-sm">
                          Solo Negociables
                        </label>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Price */}
                  <AccordionItem value="price">
                    <AccordionTrigger className="text-sm font-medium">
                      Precio
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Precio por Contenedor: $
                          {priceRange[0].toLocaleString()} - $
                          {priceRange[1].toLocaleString()}
                        </label>
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={100000}
                          min={0}
                          step={1000}
                          className="mb-2"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {filteredLots.length === 0 ? (
                <Card className="p-12 text-center">
                  <Package className="h-12 w-12 text-zlc-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-zlc-gray-900 mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-zlc-gray-600 mb-4">
                    Pruebe ajustando los filtros o buscando otros términos
                  </p>
                  <Button onClick={clearAllFilters}>Limpiar Filtros</Button>
                </Card>
              ) : (
                <div
                  className={cn(
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-4",
                  )}
                >
                  {filteredLots.map((lot) => (
                    <LotCard key={lot.id} lot={lot} viewMode={viewMode} />
                  ))}
                </div>
              )}

              {/* Pagination placeholder */}
              {filteredLots.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <p className="text-sm text-zlc-gray-600">
                    Mostrando {filteredLots.length} de {filteredLots.length}{" "}
                    productos
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Lot Card Component
interface LotCardProps {
  lot: (typeof containerLots)[0];
  viewMode: "grid" | "list";
}

function LotCard({ lot, viewMode }: LotCardProps) {
  if (viewMode === "list") {
    return (
      <Card className="p-6 hover:shadow-soft-lg transition-shadow">
        <div className="flex gap-6">
          <div className="w-48 h-32 flex-shrink-0">
            <img
              src={lot.image}
              alt={lot.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-zlc-gray-900 mb-1">
                  {lot.title}
                </h3>
                <p className="text-sm text-zlc-gray-600">{lot.description}</p>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center text-zlc-gray-600">
                <Building className="mr-1 h-3 w-3" />
                <span>{lot.supplier}</span>
                {lot.supplierVerified && (
                  <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                    Verificado
                  </Badge>
                )}
              </div>

              <div className="flex items-center text-zlc-gray-600">
                <MapPin className="mr-1 h-3 w-3" />
                <span>{lot.location}</span>
              </div>

              <div className="flex items-center text-zlc-gray-600">
                <Clock className="mr-1 h-3 w-3" />
                <span>{lot.leadTime}</span>
              </div>

              <div className="flex items-center text-zlc-gray-600">
                <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>
                  {lot.rating} ({lot.orders} pedidos)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-zlc-blue-900">
                  ${lot.pricePerContainer.toLocaleString()} {lot.currency}
                </div>
                <div className="text-sm text-zlc-gray-600">
                  ${lot.unitPrice} por unidad · MOQ: {lot.moq} contenedor
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{lot.containerType}</Badge>
                  <Badge variant="outline">{lot.incoterm}</Badge>
                  {lot.negotiable && (
                    <Badge className="bg-blue-100 text-blue-800">
                      Negociable
                    </Badge>
                  )}
                </div>
              </div>

              <Button className="bg-zlc-blue-800 hover:bg-zlc-blue-900">
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles del lote
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden hover:shadow-soft-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={lot.image}
            alt={lot.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="absolute top-3 left-3">
          <Badge className="bg-zlc-blue-800 text-white">
            <Package className="mr-1 h-3 w-3" />
            {lot.containerType}
          </Badge>
        </div>

        <div className="absolute top-3 right-3 flex space-x-1">
          {lot.negotiable && (
            <Badge className="bg-blue-100 text-blue-800 text-xs">
              Negociable
            </Badge>
          )}
          <Button
            variant="secondary"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-zlc-gray-900 group-hover:text-zlc-blue-800 transition-colors mb-1">
            {lot.title}
          </h3>
          <p className="text-sm text-zlc-gray-600 line-clamp-2">
            {lot.description}
          </p>
        </div>

        <div className="space-y-2 text-xs text-zlc-gray-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building className="mr-1 h-3 w-3" />
              <span>{lot.supplier}</span>
              {lot.supplierVerified && (
                <Badge className="ml-1 bg-green-100 text-green-800 text-xs">
                  ✓
                </Badge>
              )}
            </div>
            <div className="flex items-center">
              <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{lot.rating}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="mr-1 h-3 w-3" />
              <span>{lot.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              <span>{lot.leadTime}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-zlc-blue-900">
              ${lot.pricePerContainer.toLocaleString()}
            </div>
            <Badge variant="outline">{lot.incoterm}</Badge>
          </div>

          <div className="text-xs text-zlc-gray-600">
            ${lot.unitPrice} por unidad · MOQ: {lot.moq} contenedor
          </div>

          <Button className="w-full bg-zlc-blue-800 hover:bg-zlc-blue-900 group-hover:bg-zlc-blue-700">
            <Eye className="mr-2 h-4 w-4" />
            Ver detalles del lote
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
