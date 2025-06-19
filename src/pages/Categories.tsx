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
    icon: "minus",
    subcategories: [
      { id: "ropa-hombre", name: "Ropa de Hombre", count: 8, icon: "plus" },
      {
        id: "ropa-mujer",
        name: "Ropa de Mujer",
        count: 6,
        icon: "minus",
        expanded: true,
      },
    ],
    subSubcategories: [
      { id: "blusas", name: "Blusas", checked: true },
      { id: "faldas", name: "Faldas", checked: false },
      { id: "vestidos", name: "Vestidos", checked: false },
      { id: "blusas-2", name: "Blusas", checked: false },
      { id: "leggings", name: "Leggings", checked: false },
      { id: "ropa-interior", name: "Ropa Interior", checked: false },
    ],
  },
  {
    id: "calzado",
    name: "Calzado",
    count: 6,
    expanded: false,
    icon: "minus",
    subcategories: [
      { id: "caballero", name: "Caballero", checked: false },
      { id: "dama", name: "Dama", checked: false },
      { id: "deportes", name: "Deportes", checked: false },
      { id: "nino", name: "Niño", checked: false },
      { id: "nina", name: "Niña", checked: false },
      { id: "hogar", name: "Hogar", checked: false },
    ],
  },
  {
    id: "automotriz",
    name: "Automotriz",
    count: 10,
    expanded: false,
    icon: "plus",
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
  const [selectedSupplierStatuses, setSelectedSupplierStatuses] = useState<
    string[]
  >(["verificado"]);
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
    if (selectedSupplierStatuses.length > 0) {
      filtered = filtered.filter((lot) => {
        if (
          selectedSupplierStatuses.includes("verificado") &&
          selectedSupplierStatuses.includes("no-verificado")
        ) {
          return true; // Show all if both are selected
        } else if (selectedSupplierStatuses.includes("verificado")) {
          return lot.supplierVerified;
        } else if (selectedSupplierStatuses.includes("no-verificado")) {
          return !lot.supplierVerified;
        }
        return false;
      });
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
    selectedSupplierStatuses,
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
              subSubcategories:
                cat.subSubcategories?.map((sub) =>
                  sub.id === subcategoryId
                    ? { ...sub, checked: !sub.checked }
                    : sub,
                ) || [],
            }
          : cat,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-14 sm:pt-16 md:pt-20">
        <div className="flex">
          {/* Left Sidebar - Categories */}
          <aside className="w-64 bg-gray-100 border-r border-gray-300 min-h-screen">
            <div className="p-3 space-y-1">
              {/* Categories Header */}
              <div className="flex items-center justify-between py-2 px-2 bg-white border border-gray-300 rounded">
                <span className="font-medium text-sm text-gray-900">
                  Categorías (Producto)
                </span>
                <Minus className="h-4 w-4 text-gray-600" />
              </div>

              {/* Categories List */}
              <div className="space-y-1">
                {categories.map((category) => (
                  <div key={category.id} className="space-y-1">
                    <div className="flex items-center justify-between py-1 px-2 hover:bg-gray-200 rounded cursor-pointer">
                      <span className="text-sm font-medium text-gray-900">
                        {category.name} ({category.count})
                      </span>
                      <div className="flex items-center space-x-1">
                        {category.icon === "plus" ? (
                          <Plus className="h-3 w-3 text-gray-600" />
                        ) : (
                          <Minus className="h-3 w-3 text-gray-600" />
                        )}
                      </div>
                    </div>

                    {/* Subcategories */}
                    {category.subcategories && category.expanded && (
                      <div className="ml-4 space-y-1">
                        {category.subcategories.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between py-1 px-2 hover:bg-gray-200 rounded cursor-pointer"
                          >
                            <span className="text-sm text-gray-800">
                              {sub.name} ({sub.count})
                            </span>
                            {sub.icon && (
                              <div className="flex items-center">
                                {sub.icon === "plus" ? (
                                  <Plus className="h-3 w-3 text-gray-600" />
                                ) : (
                                  <Minus className="h-3 w-3 text-gray-600" />
                                )}
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Sub-subcategories with checkboxes */}
                        {category.subSubcategories && (
                          <div className="ml-4 space-y-1">
                            {category.subSubcategories.map((subSub) => (
                              <div
                                key={subSub.id}
                                className="flex items-center space-x-2 py-1 px-2"
                              >
                                <Checkbox
                                  id={subSub.id}
                                  checked={subSub.checked}
                                  onCheckedChange={() =>
                                    toggleSubcategory(category.id, subSub.id)
                                  }
                                  className="h-3 w-3 border-zlc-blue-800 data-[state=checked]:bg-zlc-blue-800 data-[state=checked]:border-zlc-blue-800"
                                />
                                <label
                                  htmlFor={subSub.id}
                                  className="text-sm text-gray-700 cursor-pointer"
                                >
                                  {subSub.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Calzado subcategories */}
                    {category.id === "calzado" && category.expanded && (
                      <div className="ml-4 space-y-1">
                        {category.subcategories.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex items-center space-x-2 py-1 px-2"
                          >
                            <Checkbox
                              id={sub.id}
                              checked={sub.checked}
                              className="h-3 w-3 border-zlc-blue-800 data-[state=checked]:bg-zlc-blue-800 data-[state=checked]:border-zlc-blue-800"
                            />
                            <label
                              htmlFor={sub.id}
                              className="text-sm text-gray-700 cursor-pointer"
                            >
                              {sub.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Price Range */}
              <div className="pt-4 space-y-3">
                <div className="w-full h-px bg-gray-300"></div>
                <div className="px-2">
                  <div className="text-xs text-gray-600 mb-2">
                    Precio: ${priceRange[0]}-
                    {priceRange[1] >= 10000 ? "10000" : priceRange[1]}
                  </div>
                  <div className="relative">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={10000}
                      min={100}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">$100</span>
                      <span className="text-xs text-gray-500">$10000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suppliers */}
              <div className="pt-3">
                <div className="w-full h-px bg-gray-300 mb-3"></div>
                <div className="flex items-center justify-between py-1 px-2 hover:bg-gray-200 rounded cursor-pointer">
                  <span className="text-sm font-medium text-gray-900">
                    Proveedores
                  </span>
                  <Plus className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex">
            {/* Center Content Area */}
            <div className="flex-1 p-6 bg-gray-50">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative max-w-2xl">
                  <Input
                    placeholder="Buscar"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-12 h-10 bg-white border border-gray-300"
                  />
                  <Button
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-gray-200 hover:bg-gray-300 border border-gray-300"
                    variant="ghost"
                  >
                    <Search className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
              </div>

              {/* Product List */}
              <div className="space-y-4">
                {filteredLots.map((lot) => (
                  <div
                    key={lot.id}
                    className={cn(
                      "bg-white border rounded-lg p-6 hover:shadow-md transition-shadow",
                      lot.highlighted && "border-2 border-blue-500",
                    )}
                  >
                    <div className="flex gap-6">
                      <div className="w-48 h-32 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">Imagen</span>
                        </div>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            {lot.title}
                          </h3>
                          <p className="text-sm text-gray-700 mb-1">
                            Colores disponibles: {lot.colors.join(", ")}.
                          </p>
                          <p className="text-sm text-gray-700">
                            Tamaños: {lot.sizes.join(", ")}.
                          </p>
                        </div>

                        <div className="flex items-end justify-between pt-4">
                          <div className="space-y-1">
                            <div className="text-sm font-semibold text-gray-900">
                              Precio por contenedor: XXX$
                            </div>
                            <div className="text-sm text-gray-700">
                              Precio unitario: XX$
                            </div>
                          </div>

                          <Button
                            asChild
                            className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-2 rounded"
                          >
                            <Link to={`/product/${lot.id}`}>
                              Ver detalles →
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Sidebar - Filters */}
            <aside className="w-80 bg-gray-100 border-l border-gray-300 p-4 min-h-screen">
              <div className="space-y-6">
                {/* Filter Header */}
                <div className="bg-gray-300 px-4 py-2 rounded text-center font-medium text-sm">
                  Filtro (Proveedor)
                </div>

                {/* Container Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">
                    Tipo de contenedor:
                  </label>
                  <Select
                    value={selectedContainerType}
                    onValueChange={setSelectedContainerType}
                  >
                    <SelectTrigger className="w-full bg-white border border-gray-300">
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
                  <label className="text-sm font-medium text-gray-900">
                    # de Contenedores:
                  </label>
                  <Select
                    value={containerCount}
                    onValueChange={setContainerCount}
                  >
                    <SelectTrigger className="w-full bg-white border border-gray-300">
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
                  <label className="text-sm font-medium text-gray-900">
                    Estado del Proveedor:
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="verificado"
                        checked={selectedSupplierStatuses.includes(
                          "verificado",
                        )}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedSupplierStatuses([
                              ...selectedSupplierStatuses,
                              "verificado",
                            ]);
                          } else {
                            setSelectedSupplierStatuses(
                              selectedSupplierStatuses.filter(
                                (status) => status !== "verificado",
                              ),
                            );
                          }
                        }}
                        className="border-zlc-blue-800 data-[state=checked]:bg-zlc-blue-800 data-[state=checked]:border-zlc-blue-800"
                      />
                      <Label
                        htmlFor="verificado"
                        className="text-sm text-gray-700"
                      >
                        Verificado
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="no-verificado"
                        checked={selectedSupplierStatuses.includes(
                          "no-verificado",
                        )}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedSupplierStatuses([
                              ...selectedSupplierStatuses,
                              "no-verificado",
                            ]);
                          } else {
                            setSelectedSupplierStatuses(
                              selectedSupplierStatuses.filter(
                                (status) => status !== "no-verificado",
                              ),
                            );
                          }
                        }}
                        className="border-zlc-blue-800 data-[state=checked]:bg-zlc-blue-800 data-[state=checked]:border-zlc-blue-800"
                      />
                      <Label
                        htmlFor="no-verificado"
                        className="text-sm text-gray-700"
                      >
                        No Verificado
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Lead Time */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-900">
                    Lead Time: {leadTimeRange[0]}-{leadTimeRange[1]} días
                  </div>
                  <div className="relative">
                    <Slider
                      value={leadTimeRange}
                      onValueChange={setLeadTimeRange}
                      max={60}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">5</span>
                      <span className="text-xs text-gray-500">60</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
