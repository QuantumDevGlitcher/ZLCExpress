import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Truck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
  className?: string;
  onClick?: () => void;
}

export function CategoryCard({
  category,
  className,
  onClick,
}: CategoryCardProps) {
  return (
    <Card
      className={cn(
        "group cursor-pointer overflow-hidden border-0 bg-white shadow-soft hover:shadow-soft-lg transition-all duration-300 transform hover:-translate-y-1",
        className,
      )}
      onClick={onClick}
    >
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-zlc-gray-100 to-zlc-gray-200">
          <img
            src={category.image}
            alt={category.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Fallback for broken images
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.parentElement!.innerHTML = `
                <div class="flex h-full items-center justify-center bg-gradient-to-br from-zlc-gray-100 to-zlc-gray-200">
                  <div class="flex flex-col items-center text-zlc-gray-500">
                    <svg class="h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                    <span class="text-sm font-medium">${category.name}</span>
                  </div>
                </div>
              `;
            }}
          />
        </div>

        {/* Container type badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className="bg-white/90 text-zlc-blue-800 font-medium"
          >
            <Package className="mr-1 h-3 w-3" />
            {category.containerType === "both"
              ? "20'/40'"
              : category.containerType}
          </Badge>
        </div>

        {/* MOQ badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-zlc-blue-800 text-white font-medium">
            MOQ: {category.moq}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Category name */}
          <div>
            <h3 className="text-lg font-semibold text-zlc-gray-900 group-hover:text-zlc-blue-800 transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-zlc-gray-600 mt-1 line-clamp-2">
              {category.description}
            </p>
          </div>

          {/* Features */}
          <div className="flex items-center space-x-4 text-xs text-zlc-gray-500">
            <div className="flex items-center">
              <Truck className="mr-1 h-3 w-3" />
              <span>Envío Directo</span>
            </div>
            <div className="flex items-center">
              <Package className="mr-1 h-3 w-3" />
              <span>Contenedor Completo</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            variant="ghost"
            className="w-full justify-between group-hover:bg-zlc-blue-50 group-hover:text-zlc-blue-800 transition-colors"
          >
            <span>Ver Productos</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton component for loading states
export function CategoryCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="aspect-[4/3] bg-zlc-gray-200 animate-pulse" />
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-6 bg-zlc-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-zlc-gray-200 rounded w-3/4 animate-pulse" />
        </div>
        <div className="flex space-x-4">
          <div className="h-4 bg-zlc-gray-200 rounded w-20 animate-pulse" />
          <div className="h-4 bg-zlc-gray-200 rounded w-24 animate-pulse" />
        </div>
        <div className="h-10 bg-zlc-gray-200 rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}
