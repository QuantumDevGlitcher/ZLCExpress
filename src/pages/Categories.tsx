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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Navigation } from "@/components/Navigation";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Package,
  MapPin,
  Clock,
  Star,
  Building,
  Truck,
  DollarSign,
  ArrowUpDown,
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
    category: "ropa-mujer",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
    pricePerContainer: 15000,
    unitPrice: 3.0,
    currency: "USD",
    moq: 1,
    containerType: "20'",
    supplier: "Textiles del Pacífico S.A.",
    supplierVerified: true,
    location: "Zona Libre de Colón",
    leadTime: 15,
    incoterm: "FOB",
    negotiable: true,
    colors: ["Blanco", "Negro", "Rosa", "Gris"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.8,
    orders: 124,
    highlighted: true,
  },
  {
    id: "2",
    title: "Blusa de manga larga casual",
    description: "4500 blusas algodón premium - 20' GP",
    category: "ropa-mujer",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
    pricePerContainer: 18000,
    unitPrice: 4.0,
    currency: "USD",
    moq: 1,
    containerType: "20'",
    supplier: "Fashion Export ZLC",
    supplierVerified: true,
    location: "Zona Libre de Colón",
    leadTime: 18,
    incoterm: "CIF",
    negotiable: false,
    colors: ["Blanco", "Negro", "Rosa", "Gris"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.6,
    orders: 89,
    highlighted: false,
  },
  {
    id: "3",
    title: "Blusa de manga larga casual",
    description: "6000 blusas diseño exclusivo - 40' HQ",
    category: "ropa-mujer",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
    pricePerContainer: 22000,
    unitPrice: 3.67,
    currency: "USD",
    moq: 1,
    containerType: "40'",
    supplier: "Premium Textiles ZLC",
    supplierVerified: false,
    location: "Zona Libre de Colón",
    leadTime: 25,
    incoterm: "FOB",
    negotiable: true,
    colors: ["Blanco", "Negro", "Rosa", "Gris"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.4,
    orders: 67,
    highlighted: false,
  },
];

// Category hierarchy
const categoryHierarchy = [
  {
    id: "prendas",
    name: "Prendas",
    count: 4,
    expanded: true,
    subcategories: [
      { id: "ropa-hombre", name: "Ropa de Hombre", count: 8 },
      { id: "ropa-mujer", name: "Ropa de Mujer", count: 6 },
      { id: "blusas", name: "Blusas", count: 0, checked: true },
      { id: "faldas", name: "Faldas", count: 0, checked: false },
      { id: "vestidos", name: "Vestidos", count: 0, checked: false },
      { id: "blusas-work", name: "Blusas", count: 0, checked: false },
      { id: "leggings", name: "Leggings", count: 0, checked: false },
      { id: "ropa-interior", name: "Ropa Interior", count: 0, checked: false },
    ],
  },
  {
    id: "calzado",
    name: "Calzado",
    count: 6,
    expanded: false,
    subcategories: [
      { id: "caballero", name: "Caballero", count: 0, checked: false },
      { id: "dama", name: "Dama", count: 0, checked: false },
      { id: "deportes", name: "Deportes", count: 0, checked: false },
      { id: "nino", name: "Niño", count: 0, checked: false },
      { id: "nina", name: "Niña", count: 0, checked: false },
      { id: "hogar", name: "Hogar", count: 0, checked: false },
    ],
  },
  {
    id: "automotriz",
    name: "Automotriz",
    count: 10,
    expanded: false,
    subcategories: [],
  },
];

const containerTypes = ["20'", "40'", "40' HQ", "40' HC"];

export default function Categories() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "ropa-mujer",
  );

  // Left sidebar states
  const [categories, setCategories] = useState(categoryHierarchy);
  const [priceRange, setPriceRange] = useState([100, 10000]);

  // Right sidebar states
  const [selectedContainerType, setSelectedContainerType] = useState("20'");
  const [containerCount, setContainerCount] = useState("2");
  const [supplierStatus, setSupplierStatus] = useState("verificado");
  const [leadTimeRange, setLeadTimeRange] = useState([5, 30]);

  // Filter and search logic
  const filteredLots = useMemo(() => {
    let filtered = containerLots;

    // Category filter
    if (selectedCategory) {
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
    if (selectedContainerType) {
      filtered = filtered.filter(
        (lot) => lot.containerType === selectedContainerType,
      );
    }

    // Supplier status filter
    if (supplierStatus === "verificado") {
      filtered = filtered.filter((lot) => lot.supplierVerified);
    } else if (supplierStatus === "no-verificado") {
      filtered = filtered.filter((lot) => !lot.supplierVerified);
    }

    // Lead time filter
    filtered = filtered.filter(
      (lot) =>
        lot.leadTime >= leadTimeRange[0] && lot.leadTime <= leadTimeRange[1],
    );

    // Price filter
    filtered = filtered.filter(
      (lot) =>
        lot.pricePerContainer >= priceRange[0] * 10 &&
        lot.pricePerContainer <= priceRange[1] * 10,
    );

    return filtered;
  }, [
    selectedCategory,
    searchQuery,
    selectedContainerType,
    supplierStatus,
    leadTimeRange,
    priceRange,
  ]);

  const toggleCategory = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat,
      ),
    );
  };

  const toggleSubcategory = (parentId: string, subcategoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === parentId
          ? {
              ...cat,
              subcategories: cat.subcategories.map((sub) =>
                sub.id === subcategoryId
                  ? { ...sub, checked: !sub.checked }
                  : sub,
              ),
            }
          : cat,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main style={{ paddingTop: "80px" }}>
        <div className="flex">
          {/* Left Sidebar - Categories */}
          <aside className="w-64 bg-gray-50 border-r p-4 min-h-screen">
            <div className="space-y-4">
              {/* Categories Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  Categorías (Producto)
                </h3>
                <Minus className="h-4 w-4 text-gray-500" />
              </div>

              {/* Categories List */}
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id}>
                    <Collapsible open={category.expanded}>
                      <CollapsibleTrigger
                        onClick={() => toggleCategory(category.id)}
                        className="flex items-center justify-between w-full text-left py-1 hover:bg-gray-100 rounded px-2"
                      >
                        <span className="font-medium text-sm">
                          {category.name} ({category.count})
                        </span>
                        <div className="flex items-center space-x-1">
                          <Plus className="h-3 w-3 text-gray-500" />
                          {category.expanded ? (
                            <ChevronDown className="h-3 w-3 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-3 w-3 text-gray-500" />
                          )}
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="ml-4 space-y-1 mt-2">
                        {category.subcategories.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex items-center space-x-2 py-1"
                          >
                            <Checkbox
                              id={sub.id}
                              checked={sub.checked}
                              onCheckedChange={() =>
                                toggleSubcategory(category.id, sub.id)
                              }
                              className="h-3 w-3"
                            />
                            <label
                              htmlFor={sub.id}
                              className="text-sm text-gray-700 cursor-pointer flex-1"
                            >
                              {sub.name} {sub.count > 0 && `(${sub.count})`}
                            </label>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Price Range */}
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  Precio: ${priceRange[0]}-
                  {priceRange[1] >= 10000 ? "10000+" : priceRange[1]}
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={10000}
                  min={100}
                  step={100}
                  className="w-full"
                />
              </div>

              <Separator />

              {/* Suppliers */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Proveedores</span>
                <Plus className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex">
            {/* Center Content Area */}
            <div className="flex-1 p-6">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10"
                  />
                  <Button
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Product List */}
              <div className="space-y-4">
                {filteredLots.map((lot) => (
                  <Card
                    key={lot.id}
                    className={cn(
                      "p-6 hover:shadow-lg transition-shadow",
                      lot.highlighted && "border-2 border-blue-500",
                    )}
                  >
                    <div className="flex gap-6">
                      <div className="w-48 h-32 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={lot.image}
                          alt={lot.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {lot.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Colores disponibles: {lot.colors.join(", ")}.
                          </p>
                          <p className="text-sm text-gray-600">
                            Tamaños: {lot.sizes.join(", ")}.
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="text-sm font-semibold">
                              Precio por contenedor: XXX$
                            </div>
                            <div className="text-sm text-gray-600">
                              Precio unitario: XX$
                            </div>
                          </div>

                          <Button className="bg-blue-900 hover:bg-blue-800 text-white px-6">
                            Ver detalles →
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Sidebar - Filters */}
            <aside className="w-80 bg-gray-50 border-l p-4 min-h-screen">
              <div className="space-y-6">
                {/* Filter Header */}
                <div className="bg-gray-200 px-4 py-2 rounded text-center font-medium">
                  Filtro (Proveedor)
                </div>

                {/* Container Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Tipo de contenedor:
                  </label>
                  <Select
                    value={selectedContainerType}
                    onValueChange={setSelectedContainerType}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {containerTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Container Count */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    # de Contenedores:
                  </label>
                  <Select
                    value={containerCount}
                    onValueChange={setContainerCount}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Supplier Status */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Estado del Proveedor:
                  </label>
                  <RadioGroup
                    value={supplierStatus}
                    onValueChange={setSupplierStatus}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="verificado" id="verificado" />
                      <Label htmlFor="verificado" className="text-sm">
                        Verificado
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="no-verificado"
                        id="no-verificado"
                      />
                      <Label htmlFor="no-verificado" className="text-sm">
                        No Verificado
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Lead Time */}
                <div className="space-y-3">
                  <div className="text-sm font-medium">
                    Lead Time: {leadTimeRange[0]}-{leadTimeRange[1]} días
                  </div>
                  <Slider
                    value={leadTimeRange}
                    onValueChange={setLeadTimeRange}
                    max={60}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
