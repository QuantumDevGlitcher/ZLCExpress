import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { CategoryCard } from "@/components/CategoryCard";
import {
  Building2,
  Package,
  Shield,
  Truck,
  Globe,
  Users,
  Search,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import type { Category } from "@/types";

// Mock data for categories
const categories: Category[] = [
  {
    id: "1",
    name: "Ropa al por Mayor",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    moq: "1 Contenedor 40'",
    description:
      "Textil y confección de alta calidad para distribuidores mayoristas",
    containerType: "40'",
  },
  {
    id: "2",
    name: "Calzado por Contenedor",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
    moq: "1 Contenedor 20'",
    description: "Calzado deportivo, formal y casual para todas las edades",
    containerType: "20'",
  },
  {
    id: "3",
    name: "Electrónicos B2B",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
    moq: "1 Contenedor 20'",
    description: "Dispositivos electrónicos y accesorios tecnológicos",
    containerType: "20'",
  },
  {
    id: "4",
    name: "Hogar y Decoración",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    moq: "1 Contenedor 40'",
    description: "Artículos para el hogar, decoración y muebles",
    containerType: "both",
  },
  {
    id: "5",
    name: "Belleza y Cuidado Personal",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
    moq: "1 Contenedor 20'",
    description: "Productos de belleza, cuidado personal y cosméticos",
    containerType: "20'",
  },
  {
    id: "6",
    name: "Deportes y Recreación",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    moq: "1 Contenedor 40'",
    description: "Equipos deportivos, fitness y recreación al aire libre",
    containerType: "40'",
  },
];

const stats = [
  { label: "Empresas Registradas", value: "2,500+", icon: Building2 },
  { label: "Contenedores Vendidos", value: "15,000+", icon: Package },
  { label: "Países Atendidos", value: "18", icon: Globe },
  { label: "Satisfacción Cliente", value: "98%", icon: Star },
];

const features = [
  {
    icon: Shield,
    title: "Zona Libre de Colón",
    description:
      "Operamos bajo el marco legal de la ZLC con beneficios fiscales únicos",
  },
  {
    icon: Package,
    title: "Contenedores Completos",
    description:
      "Compra directa por contenedor con precios mayoristas competitivos",
  },
  {
    icon: Truck,
    title: "Logística Integrada",
    description: "Gestión completa de envío y documentación aduanera",
  },
  {
    icon: Users,
    title: "Solo para Empresas",
    description: "Plataforma exclusiva B2B con verificación empresarial",
  },
];

const testimonials = [
  {
    name: "María González",
    company: "Distribuidora Central",
    country: "Costa Rica",
    content:
      "ZLC Express transformó nuestra cadena de suministro. Los precios y la calidad son excepcionales.",
    rating: 5,
  },
  {
    name: "Carlos Mendoza",
    company: "Importaciones del Norte",
    country: "Guatemala",
    content:
      "La verificación empresarial nos da confianza. Es una plataforma seria para negocios reales.",
    rating: 5,
  },
  {
    name: "Ana Patricia Silva",
    company: "Comercial Andina",
    country: "Colombia",
    content:
      "Excelente servicio al cliente y tiempos de entrega cumplidos al 100%.",
    rating: 5,
  },
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-14 sm:pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-zlc-blue-900 via-zlc-blue-800 to-zlc-blue-700">
          <div
            className={
              'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3Ccircle cx="27" cy="7" r="1"/%3E%3Ccircle cx="47" cy="7" r="1"/%3E%3Ccircle cx="7" cy="27" r="1"/%3E%3Ccircle cx="27" cy="27" r="1"/%3E%3Ccircle cx="47" cy="27" r="1"/%3E%3Ccircle cx="7" cy="47" r="1"/%3E%3Ccircle cx="27" cy="47" r="1"/%3E%3Ccircle cx="47" cy="47" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')]'
            }
          />

          <div className="relative container-section py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <MapPin className="mr-2 h-3 w-3" />
                  Zona Libre de Colón, Panamá
                </Badge>

                <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                  El Marketplace B2B de
                  <span className="block text-transparent bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text">
                    Centroamérica
                  </span>
                </h1>

                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Conectamos empresas mayoristas con productos de calidad
                  directamente desde la Zona Libre de Colón. Contenedores
                  completos con precios competitivos y logística integrada.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button
                    size="lg"
                    asChild
                    className="bg-white text-zlc-blue-900 hover:bg-zlc-gray-100 h-12 px-8"
                  >
                    <Link to="/register">
                      Registrar Empresa
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-black hover:bg-white/20 hover:text-white h-12 px-8"
                  >
                    Ver Catálogo
                  </Button>
                </div>

                <div className="flex items-center space-x-6 text-sm text-blue-200">
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-400" />
                    <span className="text-white">Verificación empresarial</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-400" />
                    <span className="text-white">Pagos seguros</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-400" />
                    <span className="text-white">Soporte 24/7</span>
                  </div>
                </div>
              </div>

              <div className="lg:text-right">
                <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Búsqueda Rápida
                    </h3>
                    <p className="text-blue-200 text-sm">
                      Encuentre productos por categoría
                    </p>
                  </div>

                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zlc-gray-400" />
                    <Input
                      placeholder="Ej: ropa, calzado, electrónicos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/90 border-white/30 h-12"
                    />
                  </div>

                  <Button className="w-full bg-zlc-blue-600 hover:bg-zlc-blue-700 h-12">
                    Buscar Productos
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-zlc-gray-50 border-t border-zlc-gray-200">
          <div className="container-section">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-xl bg-zlc-blue-100 flex items-center justify-center mb-4">
                    <stat.icon className="h-6 w-6 text-zlc-blue-600" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-zlc-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-zlc-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20">
          <div className="container-section">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-zlc-blue-100 text-zlc-blue-800">
                Categorías Principales
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-zlc-gray-900 mb-4">
                Productos por Contenedor
              </h2>
              <p className="text-lg text-zlc-gray-600 max-w-2xl mx-auto">
                Explore nuestras categorías principales, todas con cantidades
                mínimas de orden diseñadas para distribuidores mayoristas.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={() =>
                    console.log(`Navigate to category: ${category.id}`)
                  }
                />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                variant="outline"
                className="border-zlc-blue-200 text-zlc-blue-700 hover:bg-zlc-blue-50"
              >
                Ver Todas las Categorías
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-zlc-gray-50">
          <div className="container-section">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-zlc-blue-100 text-zlc-blue-800">
                ¿Por qué ZLC Express?
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-zlc-gray-900 mb-4">
                La ventaja de la Zona Libre
              </h2>
              <p className="text-lg text-zlc-gray-600 max-w-2xl mx-auto">
                Aprovechamos los beneficios únicos de la Zona Libre de Colón
                para ofrecerle precios competitivos y procesos simplificados.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center card-professional">
                  <CardContent className="pt-6">
                    <div className="mx-auto h-14 w-14 rounded-xl bg-zlc-blue-100 flex items-center justify-center mb-4">
                      <feature.icon className="h-7 w-7 text-zlc-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-zlc-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-zlc-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="container-section">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-zlc-blue-100 text-zlc-blue-800">
                Proceso Simple
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-zlc-gray-900 mb-4">
                Cómo Funciona
              </h2>
              <p className="text-lg text-zlc-gray-600 max-w-2xl mx-auto">
                En solo 4 pasos puede estar comprando productos al por mayor
                desde la Zona Libre de Colón.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Registro Empresarial",
                  description:
                    "Complete el formulario de registro con los datos de su empresa",
                  icon: Building2,
                },
                {
                  step: "02",
                  title: "Verificación",
                  description:
                    "Nuestro equipo verifica su empresa y licencias comerciales",
                  icon: Shield,
                },
                {
                  step: "03",
                  title: "Explorar Catálogo",
                  description:
                    "Acceda a productos exclusivos con precios mayoristas",
                  icon: Package,
                },
                {
                  step: "04",
                  title: "Realizar Pedido",
                  description:
                    "Ordene contenedores completos con logística incluida",
                  icon: Truck,
                },
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="text-center">
                    <div className="relative mx-auto h-16 w-16 rounded-full bg-zlc-blue-600 flex items-center justify-center mb-4">
                      <step.icon className="h-8 w-8 text-white" />
                      <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-zlc-blue-800 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {step.step}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-zlc-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-zlc-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-zlc-gray-300 transform translate-x-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-zlc-gray-50">
          <div className="container-section">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-zlc-blue-100 text-zlc-blue-800">
                Testimonios
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-zlc-gray-900 mb-4">
                Empresas que Confían en Nosotros
              </h2>
              <p className="text-lg text-zlc-gray-600 max-w-2xl mx-auto">
                Más de 2,500 empresas en toda Centroamérica y el Caribe nos
                prefieren.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="card-professional">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-amber-500 text-amber-500"
                        />
                      ))}
                    </div>
                    <p className="text-zlc-gray-700 mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="border-t pt-4">
                      <p className="font-semibold text-zlc-gray-900">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-zlc-gray-600">
                        {testimonial.company}
                      </p>
                      <p className="text-xs text-zlc-gray-500">
                        {testimonial.country}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-zlc-blue-900 to-zlc-blue-800">
          <div className="container-section text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              ¿Listo para Empezar?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Registre su empresa hoy y acceda a precios mayoristas exclusivos
              desde la Zona Libre de Colón.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="lg"
                asChild
                className="bg-white text-zlc-blue-900 hover:bg-zlc-gray-100 h-12 px-8"
              >
                <Link to="/register">
                  Registrar Empresa Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-black hover:bg-white/10 hover:text-black h-12 px-8"
              >
                <Phone className="mr-2 h-4 w-4" />
                Hablar con un Asesor
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-blue-200 text-sm">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>Verificación en 1-3 días</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                <span>Sin costo de registro</span>
              </div>
              <div className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                <span>100% seguro y verificado</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-zlc-gray-900 text-white py-16">
          <div className="container-section">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-zlc-blue-600 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-zlc-gray-400">
                      ZLC Express
                    </div>
                    <div className="text-xs text-zlc-gray-400">
                      B2B Marketplace
                    </div>
                  </div>
                </div>
                <p className="text-zlc-gray-400 text-sm mb-4">
                  El marketplace B2B líder en Centroamérica para productos desde
                  la Zona Libre de Colón.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-zlc-gray-400">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span className="text-zlc-gray-400">
                      Zona Libre de Colón, Panamá
                    </span>
                  </div>
                  <div className="flex items-center text-zlc-gray-400 ">
                    <Phone className="mr-2 h-4 w-4" />
                    <span className="text-zlc-gray-400">+507 430-1234</span>
                  </div>
                  <div className="flex items-center text-zlc-gray-400">
                    <Mail className="mr-2 h-4 w-4" />
                    <span className="text-zlc-gray-400">
                      contacto@zlcexpress.com
                    </span>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h4 className="font-semibold mb-4 text-zlc-gray-400">
                  Productos
                </h4>
                <ul className="space-y-2 text-sm text-zlc-gray-400">
                  <li>
                    <Link
                      to="/categories/textiles"
                      className="hover:text-white"
                    >
                      Textiles y Confección
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/categories/footwear"
                      className="hover:text-white"
                    >
                      Calzado
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/categories/electronics"
                      className="hover:text-white"
                    >
                      Electrónicos
                    </Link>
                  </li>
                  <li>
                    <Link to="/categories/home" className="hover:text-white">
                      Hogar y Decoración
                    </Link>
                  </li>
                  <li>
                    <Link to="/categories/beauty" className="hover:text-white">
                      Belleza
                    </Link>
                  </li>
                  <li>
                    <Link to="/categories/sports" className="hover:text-white">
                      Deportes
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-semibold mb-4 text-zlc-gray-400">
                  Empresa
                </h4>
                <ul className="space-y-2 text-sm text-zlc-gray-400">
                  <li>
                    <Link to="/about" className="hover:text-white">
                      Acerca de
                    </Link>
                  </li>
                  <li>
                    <Link to="/how-it-works" className="hover:text-white">
                      Cómo Funciona
                    </Link>
                  </li>
                  <li>
                    <Link to="/zone-benefits" className="hover:text-white">
                      Beneficios ZLC
                    </Link>
                  </li>
                  <li>
                    <Link to="/success-stories" className="hover:text-white">
                      Casos de Éxito
                    </Link>
                  </li>
                  <li>
                    <Link to="/careers" className="hover:text-white">
                      Trabajar con Nosotros
                    </Link>
                  </li>
                  <li>
                    <Link to="/press" className="hover:text-white">
                      Prensa
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-semibold mb-4 text-zlc-gray-400">
                  Soporte
                </h4>
                <ul className="space-y-2 text-sm text-zlc-gray-400">
                  <li>
                    <Link to="/support" className="hover:text-white">
                      Centro de Ayuda
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-white">
                      Contactanos
                    </Link>
                  </li>
                  <li>
                    <Link to="/legal" className="hover:text-white">
                      Marco Legal
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="hover:text-white">
                      Términos y Condiciones
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="hover:text-white">
                      Política de Privacidad
                    </Link>
                  </li>
                  <li>
                    <Link to="/security" className="hover:text-white">
                      Seguridad
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-zlc-gray-800 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-sm text-zlc-gray-400">
                  © 2024 ZLC Express. Todos los derechos reservados.
                </div>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <Badge
                    variant="secondary"
                    className="bg-green-900/20 text-green-400 border-green-800"
                  >
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Plataforma Verificada
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-blue-900/20 text-blue-400 border-blue-800"
                  >
                    <Shield className="mr-1 h-3 w-3" />
                    Zona Libre Certificada
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
