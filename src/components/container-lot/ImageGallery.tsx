import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ZoomIn, Package, Layers, Box } from "lucide-react";
import { cn } from "@/lib/utils";

interface Image {
  id: string;
  url: string;
  alt: string;
  type: "product" | "container" | "packaging";
}

interface ImageGalleryProps {
  images: Image[];
}

const typeIcons = {
  product: Package,
  container: Box,
  packaging: Layers,
};

const typeLabels = {
  product: "Producto",
  container: "Contenedor",
  packaging: "Empaque",
};

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [filter, setFilter] = useState<
    "all" | "product" | "container" | "packaging"
  >("all");

  const filteredImages =
    filter === "all" ? images : images.filter((img) => img.type === filter);

  const displayImages = filteredImages.length > 0 ? filteredImages : images;

  return (
    <div className="space-y-6">
      {/* Main Image Display */}
      <div className="aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden group relative">
        <img
          src={displayImages[selectedImage]?.url || images[0]?.url}
          alt={displayImages[selectedImage]?.alt || images[0]?.alt}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-4 right-4 opacity-80 hover:opacity-100 bg-white/90 hover:bg-white"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        {/* Image Type Badge */}
        <div className="absolute bottom-4 left-4">
          <Badge variant="secondary" className="bg-white/90 text-gray-700">
            {typeLabels[displayImages[selectedImage]?.type || images[0]?.type]}
          </Badge>
        </div>
      </div>

      {/* Image Type Filters */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className="text-xs"
        >
          Todas ({images.length})
        </Button>
        {Object.entries(typeLabels).map(([type, label]) => {
          const count = images.filter((img) => img.type === type).length;
          if (count === 0) return null;

          const Icon = typeIcons[type as keyof typeof typeIcons];

          return (
            <Button
              key={type}
              variant={filter === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(type as any)}
              className="text-xs"
            >
              <Icon className="w-3 h-3 mr-1" />
              {label} ({count})
            </Button>
          );
        })}
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-4 lg:grid-cols-6 gap-3">
        {displayImages.map((image, index) => {
          const Icon = typeIcons[image.type];

          return (
            <button
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={cn(
                "aspect-square rounded-lg border-2 overflow-hidden transition-all relative group",
                selectedImage === index
                  ? "border-blue-600 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300",
              )}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />

              {/* Type Icon Overlay */}
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/90 rounded-full p-1">
                  <Icon className="w-3 h-3 text-gray-600" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Image Counter */}
      <div className="text-center text-sm text-gray-500">
        {selectedImage + 1} de {displayImages.length} imágenes
      </div>
    </div>
  );
}
