import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  Globe,
  Package,
  Search,
  Shield,
  ShoppingCart,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HowItWorks = () => {
  const buyerSteps = [
    {
      step: "1",
      title: "Registra tu Empresa",
      description: "Crea tu cuenta empresarial y verifica tu información comercial",
      icon: <Users className="h-8 w-8 text-blue-600" />,
      details: ["Datos empresariales", "Verificación fiscal", "Documentos legales"],
    },
    {
      step: "2",
      title: "Explora el Catálogo",
      description: "Navega por miles de productos de proveedores verificados",
      icon: <Search className="h-8 w-8 text-blue-600" />,
      details: ["Categorías especializadas", "Filtros avanzados", "Comparación de precios"],
    },
    {
      step: "3",
      title: "Solicita Cotizaciones",
      description: "Envía RFQs personalizadas con tus especificaciones exactas",
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      details: ["Especificaciones técnicas", "Volúmenes requeridos", "Fechas de entrega"],
    },
    {
      step: "4",
      title: "Negocia y Compra",
      description: "Compara ofertas, negocia términos y realiza tu pedido",
      icon: <ShoppingCart className="h-8 w-8 text-blue-600" />,
      details: ["Comparación de ofertas", "Negociación directa", "Términos flexibles"],
    },
    {
      step: "5",
      title: "Seguimiento Completo",
      description: "Monitorea tu pedido desde producción hasta entrega",
      icon: <Truck className="h-8 w-8 text-blue-600" />,
      details: ["Tracking en tiempo real", "Documentación", "Soporte 24/7"],
    },
  ];

  const supplierSteps = [
    {
      step: "1",
      title: "Registro y Verificación",
      description: "Registra tu empresa y obtén verificación como proveedor",
      icon: <Shield className="h-8 w-8 text-green-600" />,
      details: ["Certificaciones", "Referencias comerciales", "Auditoría"],
    },
    {
      step: "2",
      title: "Cataloga tus Productos",
      description: "Sube tu catálogo completo con especificaciones detalladas",
      icon: <Package className="h-8 w-8 text-green-600" />,
      details: ["Fotos profesionales", "Especificaciones técnicas", "Precios dinámicos"],
    },
    {
      step: "3",
      title: "Recibe Solicitudes",
      description: "Obtén RFQs calificadas de compradores verificados",
      icon: <FileText className="h-8 w-8 text-green-600" />,
      details: ["Lead scoring", "Compradores verificados", "Demanda real"],
    },
    {
      step: "4",
      title: "Envía Cotizaciones",
      description: "Responde con ofertas competitivas y términos claros",
      icon: <Zap className="h-8 w-8 text-green-600" />,
      details: ["Respuesta rápida", "Ofertas personalizadas", "Términos flexibles"],
    },
    {
      step: "5",
      title: "Gestiona Pedidos",
      description: "Administra producción, env��os y pagos de forma eficiente",
      icon: <Globe className="h-8 w-8 text-green-600" />,
      details: ["Panel de control", "Logistics integrada", "Pagos seguros"],
    },
  ];

  const benefits = [
    {
      title: "Proceso Simplificado",
      description: "Elimina intermediarios y conecta directamente con proveedores",
      icon: <ArrowRight className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Transparencia Total",
      description: "Precios claros, términos definidos y tracking completo",
      icon: <CheckCircle className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Ahorro de Tiempo",
      description: "Plataforma digital que acelera todo el proceso comercial",
      icon: <Clock className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Seguridad Garantizada",
      description: "Proveedores verificados y transacciones protegidas",
      icon: <Shield className="h-6 w-6 text-blue-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <div className="pt-16 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        <div className="container mx-auto px-4 py-16 text-center text-white bg-[rgb(12,74,133)]">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            ¿Cómo Funciona ZLC Express?
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto text-white">
            Conectamos compradores y proveedores B2B a través de una plataforma digital
            que simplifica el comercio internacional
          </p>
        </div>
      </div>

      {/* Benefits Overview */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por Qué Elegir ZLC Express?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nuestra plataforma está diseñada para hacer el comercio B2B más eficiente y seguro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Buyer Process */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Para Compradores</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Proceso de Compra en 5 Pasos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Desde el registro hasta la entrega, te acompañamos en todo el proceso
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {buyerSteps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      {step.icon}
                    </div>
                    <div className="text-sm font-bold text-blue-600 mb-2">PASO {step.step}</div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start text-xs text-gray-500">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {index < buyerSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-blue-400" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link to="/register">
                Empezar como Comprador
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Supplier Process */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800">Para Proveedores</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Proceso de Venta en 5 Pasos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conecta con compradores calificados y haz crecer tu negocio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {supplierSteps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="h-full hover:shadow-lg transition-shadow border-green-200">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      {step.icon}
                    </div>
                    <div className="text-sm font-bold text-green-600 mb-2">PASO {step.step}</div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start text-xs text-gray-500">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {index < supplierSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-green-400" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="secondary" className="bg-green-600 text-white hover:bg-green-700" asChild>
              <Link to="/register">
                Registrarse como Proveedor
                <Users className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Technology & Security */}
      <div className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 text-white">
            <h2 className="text-3xl font-bold mb-4 text-white">Tecnología y Seguridad</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto text-white">
              Utilizamos tecnología de punta para garantizar transacciones seguras y eficientes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-white">Seguridad Avanzada</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-white">
                  <li>• Encriptación SSL 256-bit</li>
                  <li>• Verificación de identidad</li>
                  <li>• Auditorías regulares</li>
                  <li>• Cumplimiento GDPR</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <Globe className="h-12 w-12 text-green-400 mb-4" />
                <CardTitle className="text-white">Cobertura Global</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-white">
                  <li>• Red mundial de proveedores</li>
                  <li>• Soporte multiidioma</li>
                  <li>• Múltiples zonas horarias</li>
                  <li>• Logistics internacional</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <Zap className="h-12 w-12 text-yellow-400 mb-4" />
                <CardTitle className="text-white">Automatización</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-white">
                  <li>• IA para matching</li>
                  <li>• Workflows automatizados</li>
                  <li>• Notificaciones inteligentes</li>
                  <li>• Analytics en tiempo real</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-[rgb(12,74,133)]">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4 text-white">¿Listo para Empezar?</h2>
          <p className="text-xl mb-8 opacity-90 text-white">
            Únete a miles de empresas que ya están transformando su comercio B2B
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-black" asChild>
              <Link to="/register">Empezar Ahora</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white bg-white text-black hover:bg-gray-100 hover:text-black" asChild>
              <Link to="/support">Hablar con un Experto</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
