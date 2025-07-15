import { useState } from "react";
import { ProductHeader } from "@/components/container-lot/ProductHeader";
import { ImageGallery } from "@/components/container-lot/ImageGallery";
import { ProductSpecs } from "@/components/container-lot/ProductSpecs";
import { PricingSection } from "@/components/container-lot/PricingSection";
import { OrderConfig } from "@/components/container-lot/OrderConfig";
import { CustomQuote } from "@/components/container-lot/CustomQuote";
import { ChatWidget } from "@/components/container-lot/ChatWidget";
import { DocumentDownloads } from "@/components/container-lot/DocumentDownloads";
import { InfoTabs } from "@/components/container-lot/InfoTabs";

const Index = () => {
  const [selectedContainers, setSelectedContainers] = useState(1);

  // Sample data - in a real app this would come from an API
  const productData = {
    title: "Camisetas de Algodón Premium - Lote Mixto Hombre/Mujer",
    isNegotiable: true,
    supplier: {
      name: "GlobalTextile Corp",
      legalName: "GlobalTextile Corporation S.A.",
      country: "Zona Libre de Colón, Panamá",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&h=64&fit=crop&crop=center",
      rating: 4.8,
      verified: true,
    },
    images: [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop",
        alt: "Camisetas premium en display",
        type: "product" as const,
      },
      {
        id: "2",
        url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=600&fit=crop",
        alt: "Vista del contenedor cargado",
        type: "container" as const,
      },
      {
        id: "3",
        url: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&h=600&fit=crop",
        alt: "Empaque y etiquetado",
        type: "packaging" as const,
      },
      {
        id: "4",
        url: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=600&fit=crop",
        alt: "Variedad de colores disponibles",
        type: "product" as const,
      },
    ],
    specifications: {
      material: "100% Algodón Peinado 180gsm",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["Negro", "Blanco", "Gris", "Azul Marino", "Rojo", "Verde"],
      category: "Textiles - Ropa Casual",
    },
    logistics: {
      totalUnits: 24000,
      grossWeight: "2,850 kg",
      netWeight: "2,400 kg",
      containerDimensions: {
        length: "12.19m",
        width: "2.44m",
        height: "2.59m",
        type: "40' HC Container",
      },
      incoterm: "FOB ZLC",
      conditions:
        "Incluye carga en contenedor y documentación básica. Flete marítimo no incluido.",
      leadTime: {
        production: "14-21 días",
        shipping: "7-10 días",
      },
    },
    pricing: {
      pricePerContainer: 18500,
      estimatedUnitPrice: 0.77,
      currency: "USD",
      volumeDiscounts: [
        { containers: 2, discountPercentage: 3 },
        { containers: 5, discountPercentage: 7 },
        { containers: 10, discountPercentage: 12 },
        { containers: 20, discountPercentage: 18 },
      ],
    },
    detailedSpecs: {
      materials: [
        "Algodón 100% peinado de fibra larga",
        "Cuello reforzado con costuras dobles",
        "Mangas con dobladillo tubular",
        "Etiquetas de marca extraíbles",
      ],
      manufacturing:
        "Producidas en instalaciones certificadas ISO 9001:2015 con estrictos controles de calidad. Proceso de pre-encogido para estabilidad dimensional. Tinturado reactivo para colores duraderos.",
      quality: [
        "Inspección de calidad por lotes",
        "Test de encogimiento <3%",
        "Control de peso por metro cuadrado",
        "Verificación de medidas estándar",
        "Test de solidez del color",
        "Inspección visual 100%",
      ],
      certifications: [
        "OEKO-TEX Standard 100",
        "GOTS Certified",
        "ISO 9001:2015",
        "WRAP Approved",
      ],
      packaging:
        "Cada camiseta empacada individualmente en bolsa de polietileno reciclable. Cajas de cartón de 12 unidades con código de barras. Embalaje en contenedor con sistema de separadores para protección durante transporte.",
    },
    reviews: [
      {
        id: "1",
        company: "Fashion Retail Group",
        rating: 5,
        comment:
          "Excelente calidad de algodón y acabados. La distribución de tallas fue perfecta para nuestro mercado. Entrega puntual y documentación completa.",
        date: new Date("2024-01-15"),
        verifiedPurchase: true,
      },
      {
        id: "2",
        company: "MegaStore Distribution",
        rating: 4,
        comment:
          "Muy buena relación calidad-precio. Los colores son vibrantes y la consistencia entre lotes es excelente. Servicio al cliente muy profesional.",
        date: new Date("2024-01-08"),
        verifiedPurchase: true,
      },
      {
        id: "3",
        company: "Central America Imports",
        rating: 5,
        comment:
          "Llevamos 2 años trabajando con GlobalTextile y siempre cumplen. Recomendamos especialmente para mercados latinoamericanos.",
        date: new Date("2023-12-20"),
        verifiedPurchase: true,
      },
    ],
    faqs: [
      {
        id: "1",
        question: "¿Cuál es el MOQ (cantidad mínima de pedido)?",
        answer:
          "El MOQ es de 1 contenedor (24,000 unidades). Para cantidades menores, consulte nuestras opciones de consolidación.",
        helpful: 28,
      },
      {
        id: "2",
        question: "¿Pueden personalizar la distribución de tallas?",
        answer:
          "Sí, ofrecemos distribución personalizada de tallas sin costo adicional. Tiempo de producción puede extenderse 5-7 días adicionales.",
        helpful: 19,
      },
      {
        id: "3",
        question: "¿Incluye etiquetado personalizado?",
        answer:
          "El etiquetado personalizado está disponible con pedido mínimo de 5 contenedores. Costo adicional de $0.15 por unidad.",
        helpful: 15,
      },
    ],
    returnPolicy: {
      timeframe: "30 días calendario",
      conditions: [
        "Productos sin usar, en empaque original",
        "Defectos de fábrica documentados con fotografías",
        "Discrepancias significativas en especificaciones",
        "Notificación por escrito dentro del plazo establecido",
        "Costos de devolución a cargo del comprador (excepto defectos de fábrica)",
      ],
      process:
        "1) Contactar al proveedor vía email o chat. 2) Enviar documentación fotográfica del problema. 3) Obtener autorización de devolución (RMA). 4) Coordinar logística de devolución. 5) Inspección y verificación. 6) Procesamiento de reembolso o reemplazo en 15 días hábiles.",
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Product Header */}
        <ProductHeader
          productTitle={productData.title}
          isNegotiable={productData.isNegotiable}
          supplier={productData.supplier}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <ImageGallery images={productData.images} />
          </div>

          {/* Right Column - Order Configuration */}
          <div className="space-y-6">
            <OrderConfig
              isNegotiable={productData.isNegotiable}
              minContainers={1}
              maxContainers={50}
              containers={selectedContainers}
              onContainersChange={setSelectedContainers}
            />
          </div>
        </div>

        {/* Product Specifications */}
        <ProductSpecs
          description="Camisetas de algodón premium diseñadas para el mercado latinoamericano. Fabricadas con algodón 100% peinado de fibra larga que garantiza suavidad, durabilidad y excelente caída. Ideales para distribución mayorista en tiendas de ropa casual, uniformes corporativos y merchandising. Disponibles en 6 tallas estándar y 6 colores básicos con alta rotación en el mercado."
          specifications={productData.specifications}
          logistics={productData.logistics}
        />

        {/* Pricing Section */}
        <PricingSection
          pricing={productData.pricing}
          selectedContainers={selectedContainers}
        />

        {/* Custom Quote */}
        <CustomQuote
          availableSizes={productData.specifications.sizes}
          availableColors={productData.specifications.colors}
        />

        {/* Document Downloads */}
        <DocumentDownloads lotId="CT-2024-GLB-001" />

        {/* Information Tabs */}
        <InfoTabs
          detailedSpecs={productData.detailedSpecs}
          reviews={productData.reviews}
          faqs={productData.faqs}
          returnPolicy={productData.returnPolicy}
        />
      </div>

      {/* Chat Widget */}
      <ChatWidget supplierName={productData.supplier.name} />
    </div>
  );
};

export default Index;
