import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  FileText,
  HelpCircle,
  Users,
  Package,
  Truck,
  CreditCard,
  Shield,
  Globe,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Support = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    category: "",
    subject: "",
    message: "",
    priority: "medium",
  });

  const categories = [
    { id: "all", name: "Todos", icon: <HelpCircle className="h-5 w-5" /> },
    { id: "account", name: "Cuenta", icon: <Users className="h-5 w-5" /> },
    { id: "orders", name: "Pedidos", icon: <Package className="h-5 w-5" /> },
    { id: "shipping", name: "Envíos", icon: <Truck className="h-5 w-5" /> },
    { id: "payments", name: "Pagos", icon: <CreditCard className="h-5 w-5" /> },
    { id: "security", name: "Seguridad", icon: <Shield className="h-5 w-5" /> },
    { id: "international", name: "Comercio Internacional", icon: <Globe className="h-5 w-5" /> },
  ];

  const contactOptions = [
    {
      title: "Chat en Vivo",
      description: "Soporte inmediato de 9:00 AM a 6:00 PM (GMT-6)",
      icon: <MessageCircle className="h-8 w-8 text-blue-600" />,
      available: true,
      action: "Iniciar Chat",
    },
    {
      title: "Teléfono",
      description: "+506 2200-3000 | Lunes a Viernes 8:00 AM - 6:00 PM",
      icon: <Phone className="h-8 w-8 text-green-600" />,
      available: true,
      action: "Llamar Ahora",
    },
    {
      title: "Email",
      description: "soporte@zlcexpress.com | Respuesta en 24 horas",
      icon: <Mail className="h-8 w-8 text-purple-600" />,
      available: true,
      action: "Enviar Email",
    },
    {
      title: "Soporte Especializado",
      description: "Para grandes volúmenes y proyectos especiales",
      icon: <Users className="h-8 w-8 text-orange-600" />,
      available: true,
      action: "Solicitar Cita",
    },
  ];

  const faqs = [
    {
      category: "account",
      question: "¿Cómo registro mi empresa en ZLC Express?",
      answer: "Para registrar tu empresa, haz clic en 'Registrar Empresa' y completa el formulario con la información comercial. Necesitarás tu cédula jurídica, certificaciones y referencias comerciales. El proceso de verificación toma 1-2 días hábiles.",
    },
    {
      category: "account",
      question: "¿Qué documentos necesito para verificar mi cuenta?",
      answer: "Necesitas: Cédula jurídica vigente, certificación de personería jurídica, estados financieros recientes, referencias comerciales, y certificados de calidad si aplican.",
    },
    {
      category: "orders",
      question: "¿Cómo envío una solicitud de cotización (RFQ)?",
      answer: "Busca el producto deseado, haz clic en 'Solicitar Cotización', completa las especificaciones técnicas, volúmenes requeridos y fechas de entrega. Los proveedores verificados responderán en 24-48 horas.",
    },
    {
      category: "orders",
      question: "¿Puedo modificar mi pedido después de confirmarlo?",
      answer: "Las modificaciones dependen del estado del pedido. Si está en 'Confirmado' puedes hacer cambios menores. Una vez en 'Producción' solo se permiten cambios críticos con aprobación del proveedor.",
    },
    {
      category: "shipping",
      question: "¿Qué opciones de envío están disponibles?",
      answer: "Ofrecemos FCL (contenedor completo), LCL (carga consolidada), aéreo y express. Manejamos FOB, CIF, DDP según tus necesidades. Incluimos seguros y tracking en tiempo real.",
    },
    {
      category: "shipping",
      question: "¿Cómo puedo rastrear mi envío?",
      answer: "En tu panel, sección 'Mis Pedidos', encontrarás el tracking number y mapa en tiempo real. Recibirás notificaciones automáticas en cada etapa del envío.",
    },
    {
      category: "payments",
      question: "¿Qué métodos de pago aceptan?",
      answer: "Transferencia bancaria, carta de crédito, PayPal Business, y financiamiento a través de nuestros socios bancarios. Todos los pagos están protegidos por nuestro sistema de garantías.",
    },
    {
      category: "payments",
      question: "¿Ofrecen términos de pago flexibles?",
      answer: "Sí, manejamos 30/60/90 días según tu historial crediticio. Para nuevos clientes ofrecemos 50% adelanto, 50% contra documentos. Clientes verificados pueden acceder a líneas de crédito.",
    },
    {
      category: "security",
      question: "¿Cómo verifican a los proveedores?",
      answer: "Proceso riguroso: verificación legal, auditoría de instalaciones, certificaciones de calidad, referencias comerciales, y evaluación financiera. Solo el 15% de aplicantes son aprobados.",
    },
    {
      category: "international",
      question: "¿Manejan los trámites aduaneros?",
      answer: "Sí, nuestro equipo de comercio exterior maneja toda la documentación: permisos, certificados de origen, facturas comerciales, y coordinación con agentes aduaneros.",
    },
  ];

  const resources = [
    {
      title: "Guía de Inicio Rápido",
      description: "Todo lo que necesitas saber para empezar",
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      link: "/how-it-works",
    },
    {
      title: "Términos Comerciales",
      description: "Incoterms, FOB, CIF y más",
      icon: <Globe className="h-6 w-6 text-green-600" />,
      link: "#",
    },
    {
      title: "Centro de Descargas",
      description: "Contratos, formularios y plantillas",
      icon: <FileText className="h-6 w-6 text-purple-600" />,
      link: "/contract-templates",
    },
    {
      title: "Videos Tutoriales",
      description: "Aprende visualmente paso a paso",
      icon: <Users className="h-6 w-6 text-orange-600" />,
      link: "#",
    },
  ];

  const filteredFaqs = selectedCategory === "all" 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs.filter(faq => 
        faq.category === selectedCategory &&
        (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", contactForm);
    // Here you would typically send the form data to your backend
    alert("Mensaje enviado correctamente. Te contactaremos pronto.");
    setContactForm({
      name: "",
      email: "",
      company: "",
      phone: "",
      category: "",
      subject: "",
      message: "",
      priority: "medium",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="pt-16 bg-[rgb(12,74,133)]">
        <div className="container mx-auto px-4 py-16 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Centro de Ayuda
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto text-white">
            Estamos aquí para ayudarte a aprovechar al máximo ZLC Express
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="¿En qué podemos ayudarte?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 h-12 text-lg bg-white border-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Options */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Contacta con Nosotros
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Múltiples canales para brindarte el mejor soporte
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactOptions.map((option, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    {option.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                  <div className="flex items-center justify-center mb-3">
                    {option.available ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Disponible
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Fuera de horario
                      </Badge>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant={option.available ? "default" : "secondary"}
                    className="w-full"
                  >
                    {option.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="faq" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="faq">Preguntas Frecuentes</TabsTrigger>
              <TabsTrigger value="contact">Enviar Consulta</TabsTrigger>
              <TabsTrigger value="resources">Recursos</TabsTrigger>
            </TabsList>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-6">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    {category.icon}
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* FAQ List */}
              <Card>
                <CardContent className="p-6">
                  {filteredFaqs.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFaqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        No se encontraron preguntas que coincidan con tu búsqueda.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Form Tab */}
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Enviar Consulta</CardTitle>
                  <p className="text-gray-600">
                    Completa el formulario y nuestro equipo te contactará pronto
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nombre Completo *</Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company">Empresa</Label>
                        <Input
                          id="company"
                          value={contactForm.company}
                          onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Categoría *</Label>
                        <Select 
                          value={contactForm.category} 
                          onValueChange={(value) => setContactForm({...contactForm, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="account">Cuenta y Registro</SelectItem>
                            <SelectItem value="orders">Pedidos y Cotizaciones</SelectItem>
                            <SelectItem value="shipping">Envíos y Logística</SelectItem>
                            <SelectItem value="payments">Pagos y Facturación</SelectItem>
                            <SelectItem value="technical">Soporte Técnico</SelectItem>
                            <SelectItem value="other">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="priority">Prioridad</Label>
                        <Select 
                          value={contactForm.priority} 
                          onValueChange={(value) => setContactForm({...contactForm, priority: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Baja</SelectItem>
                            <SelectItem value="medium">Media</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                            <SelectItem value="urgent">Urgente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Asunto *</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Mensaje *</Label>
                      <Textarea
                        id="message"
                        rows={5}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        placeholder="Describe tu consulta detalladamente..."
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Enviar Consulta
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resources.map((resource, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {resource.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                          <p className="text-gray-600 mb-4">{resource.description}</p>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={resource.link} className="flex items-center gap-2">
                              Ver más
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Additional Resources */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Recursos Adicionales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-medium mb-1">Horarios de Atención</h4>
                      <p className="text-sm text-gray-600">Lun-Vie: 8:00-18:00</p>
                      <p className="text-sm text-gray-600">Sáb: 9:00-13:00</p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <Globe className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-medium mb-1">Soporte Multiidioma</h4>
                      <p className="text-sm text-gray-600">Español, Inglés</p>
                      <p className="text-sm text-gray-600">Mandarín, Portugués</p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-medium mb-1">Garantía de Servicio</h4>
                      <p className="text-sm text-gray-600">Respuesta garantizada</p>
                      <p className="text-sm text-gray-600">en 24 horas máximo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="py-12 bg-red-50 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-600 mr-2" />
              <h3 className="text-xl font-bold text-red-800">Soporte de Emergencia</h3>
            </div>
            <p className="text-red-700 mb-4">
              Para problemas críticos que afecten envíos activos o transacciones en proceso
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="destructive" size="lg">
                <Phone className="mr-2 h-4 w-4" />
                +506 2200-3000 (Ext. 911)
              </Button>
              <Button variant="outline" size="lg" className="border-red-300 text-red-700">
                <Mail className="mr-2 h-4 w-4" />
                emergencia@zlcexpress.com
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
