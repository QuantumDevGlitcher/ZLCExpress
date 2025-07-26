import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Shield,
  Scale,
  Download,
  ExternalLink,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building,
  CheckCircle,
  AlertTriangle,
  Info,
  Globe,
  Users,
  CreditCard,
  Truck,
  Eye,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

const Legal = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const legalDocuments = [
    {
      id: "terms",
      title: "Términos y Condiciones de Uso",
      description: "Condiciones generales para el uso de la plataforma ZLC Express",
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      lastUpdated: "15 de Octubre, 2024",
      type: "Términos",
    },
    {
      id: "privacy",
      title: "Política de Privacidad",
      description: "Cómo manejamos y protegemos tu información personal",
      icon: <Shield className="h-6 w-6 text-green-600" />,
      lastUpdated: "15 de Octubre, 2024",
      type: "Privacidad",
    },
    {
      id: "commercial",
      title: "Términos Comerciales",
      description: "Condiciones específicas para transacciones B2B",
      icon: <Scale className="h-6 w-6 text-purple-600" />,
      lastUpdated: "15 de Octubre, 2024",
      type: "Comercial",
    },
    {
      id: "supplier",
      title: "Acuerdo de Proveedores",
      description: "Términos específicos para proveedores verificados",
      icon: <Building className="h-6 w-6 text-orange-600" />,
      lastUpdated: "15 de Octubre, 2024",
      type: "Proveedores",
    },
    {
      id: "international",
      title: "Marco Legal Internacional",
      description: "Regulaciones de comercio exterior y aduanas",
      icon: <Globe className="h-6 w-6 text-red-600" />,
      lastUpdated: "15 de Octubre, 2024",
      type: "Internacional",
    },
    {
      id: "dispute",
      title: "Resolución de Disputas",
      description: "Procedimientos para resolver conflictos comerciales",
      icon: <Users className="h-6 w-6 text-yellow-600" />,
      lastUpdated: "15 de Octubre, 2024",
      type: "Disputas",
    },
  ];

  const companyInfo = {
    legalName: "ZLC Express S.A.",
    identification: "3-101-789456",
    address: "Zona Franca Metropolitana, Edificio A, Oficina 301, Barreal de Heredia, Costa Rica",
    phone: "+506 2200-3000",
    email: "legal@zlcexpress.com",
    registration: "Registro Mercantil: Tomo 2024, Folio 156, Asiento 789",
    permits: ["Licencia ZF-2024-001", "Permiso COMEX-2024-456", "Registro SUTEL COM-2024-789"],
  };

  const DocumentViewer = ({ documentId }: { documentId: string }) => {
    const getDocumentContent = (id: string) => {
      switch (id) {
        case "terms":
          return (
            <div className="prose max-w-none">
              <h3 className="text-xl font-bold mb-4">Términos y Condiciones de Uso</h3>
              
              <h4 className="text-lg font-semibold mt-6 mb-3">1. Aceptación de Términos</h4>
              <p className="mb-4">
                Al acceder y utilizar la plataforma ZLC Express, usted acepta estar sujeto a estos términos y condiciones, 
                todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de las leyes locales aplicables.
              </p>

              <h4 className="text-lg font-semibold mt-6 mb-3">2. Uso de la Plataforma</h4>
              <p className="mb-4">
                ZLC Express es una plataforma B2B diseñada para facilitar transacciones comerciales entre empresas. 
                El uso está restringido a entidades comerciales legalmente constituidas.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Solo empresas verificadas pueden realizar transacciones</li>
                <li>Toda la información proporcionada debe ser veraz y actualizada</li>
                <li>Los usuarios son responsables de mantener la confidencialidad de sus credenciales</li>
                <li>Está prohibido el uso para actividades ilegales o no autorizadas</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">3. Verificación de Usuarios</h4>
              <p className="mb-4">
                Todos los usuarios deben completar un proceso de verificación que incluye:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Verificación de identidad legal de la empresa</li>
                <li>Validación de documentos comerciales</li>
                <li>Referencias comerciales</li>
                <li>Evaluación de capacidad financiera</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">4. Responsabilidades</h4>
              <p className="mb-4">
                ZLC Express actúa como intermediario y facilitador. Las transacciones se realizan directamente entre compradores y vendedores.
              </p>

              <h4 className="text-lg font-semibold mt-6 mb-3">5. Limitación de Responsabilidad</h4>
              <p className="mb-4">
                ZLC Express no será responsable por daños indirectos, incidentales, especiales o consecuentes 
                que resulten del uso de la plataforma.
              </p>

              <h4 className="text-lg font-semibold mt-6 mb-3">6. Ley Aplicable</h4>
              <p className="mb-4">
                Estos términos se rigen por las leyes de Costa Rica. Cualquier disputa será resuelta en los tribunales de Costa Rica.
              </p>
            </div>
          );

        case "privacy":
          return (
            <div className="prose max-w-none">
              <h3 className="text-xl font-bold mb-4">Política de Privacidad</h3>
              
              <h4 className="text-lg font-semibold mt-6 mb-3">1. Información que Recopilamos</h4>
              <p className="mb-4">Recopilamos información necesaria para operar nuestra plataforma B2B:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Información de la empresa:</strong> Nombre legal, cédula jurídica, dirección, contactos</li>
                <li><strong>Información comercial:</strong> Productos, precios, capacidades, certificaciones</li>
                <li><strong>Información de transacciones:</strong> Pedidos, pagos, envíos</li>
                <li><strong>Información técnica:</strong> Logs de acceso, preferencias, uso de la plataforma</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">2. Uso de la Información</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Facilitar transacciones comerciales</li>
                <li>Verificar la identidad de usuarios</li>
                <li>Mejorar nuestros servicios</li>
                <li>Cumplir con regulaciones legales</li>
                <li>Prevenir fraudes y actividades ilegales</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">3. Compartir Información</h4>
              <p className="mb-4">Solo compartimos información cuando es necesario para:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Completar transacciones entre usuarios verificados</li>
                <li>Cumplir con requerimientos legales</li>
                <li>Proteger nuestros derechos y seguridad</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">4. Protección de Datos</h4>
              <p className="mb-4">Implementamos medidas de seguridad robustas:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Encriptación SSL de 256 bits</li>
                <li>Autenticación de dos factores</li>
                <li>Auditorías de seguridad regulares</li>
                <li>Acceso restringido por roles</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">5. Derechos del Usuario</h4>
              <p className="mb-4">Usted tiene derecho a:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Acceder a su información personal</li>
                <li>Corregir datos inexactos</li>
                <li>Solicitar eliminación de datos</li>
                <li>Restringir el procesamiento</li>
                <li>Portabilidad de datos</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">6. Contacto</h4>
              <p className="mb-4">
                Para consultas sobre privacidad, contacte a: privacy@zlcexpress.com
              </p>
            </div>
          );

        case "commercial":
          return (
            <div className="prose max-w-none">
              <h3 className="text-xl font-bold mb-4">Términos Comerciales</h3>
              
              <h4 className="text-lg font-semibold mt-6 mb-3">1. Transacciones B2B</h4>
              <p className="mb-4">
                Todas las transacciones en ZLC Express son de naturaleza business-to-business (B2B) 
                entre entidades comerciales verificadas.
              </p>

              <h4 className="text-lg font-semibold mt-6 mb-3">2. Proceso de Cotización</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Las cotizaciones son válidas por 30 días salvo indicación contraria</li>
                <li>Los precios pueden incluir diferentes términos de entrega (FOB, CIF, DDP)</li>
                <li>Las especificaciones técnicas son vinculantes una vez aceptadas</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">3. Términos de Pago</h4>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Nuevos clientes:</strong> 50% adelanto, 50% contra documentos</li>
                <li><strong>Clientes verificados:</strong> Términos de 30/60/90 días disponibles</li>
                <li><strong>Grandes volúmenes:</strong> Cartas de crédito aceptadas</li>
                <li><strong>Proyectos especiales:</strong> Términos personalizados</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">4. Garantías de Calidad</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Todos los proveedores deben cumplir estándares de calidad verificados</li>
                <li>Inspecciones pre-embarque disponibles</li>
                <li>Garantías de conformidad según especificaciones</li>
                <li>Proceso de devolución en caso de no conformidad</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">5. Logística y Envíos</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Coordinación completa de logística internacional</li>
                <li>Seguro de carga incluido en envíos CIF</li>
                <li>Tracking en tiempo real</li>
                <li>Gestión de documentación aduanera</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">6. Comisiones y Tarifas</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Compradores: Sin comisión en transacciones</li>
                <li>Proveedores: 2.5% sobre valor FOB en transacciones exitosas</li>
                <li>Servicios adicionales: Según tarifa específica</li>
              </ul>
            </div>
          );

        case "supplier":
          return (
            <div className="prose max-w-none">
              <h3 className="text-xl font-bold mb-4">Acuerdo de Proveedores</h3>
              
              <h4 className="text-lg font-semibold mt-6 mb-3">1. Elegibilidad</h4>
              <p className="mb-4">Para ser proveedor verificado en ZLC Express debe cumplir:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Ser una entidad comercial legalmente constituida</li>
                <li>Mínimo 2 años de experiencia comercial</li>
                <li>Certificaciones de calidad vigentes</li>
                <li>Referencias comerciales verificables</li>
                <li>Capacidad de producción demostrable</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">2. Proceso de Verificación</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Auditoría documental completa</li>
                <li>Inspección de instalaciones (virtual o presencial)</li>
                <li>Verificación de capacidades técnicas</li>
                <li>Evaluación financiera</li>
                <li>Referencias de clientes anteriores</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">3. Obligaciones del Proveedor</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Mantener información actualizada en la plataforma</li>
                <li>Responder a RFQs dentro de 48 horas</li>
                <li>Cumplir con especificaciones acordadas</li>
                <li>Mantener certificaciones vigentes</li>
                <li>Notificar cambios en capacidades o productos</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">4. Estándares de Calidad</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>ISO 9001 o equivalente requerido</li>
                <li>Certificaciones específicas por industria</li>
                <li>Cumplimiento de estándares internacionales</li>
                <li>Programas de mejora continua</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">5. Exclusividad y Competencia</h4>
              <p className="mb-4">
                Los proveedores pueden trabajar con otros canales, pero deben ofrecer 
                precios competitivos y dar prioridad a solicitudes de ZLC Express.
              </p>

              <h4 className="text-lg font-semibold mt-6 mb-3">6. Terminación del Acuerdo</h4>
              <p className="mb-4">
                El acuerdo puede terminarse por incumplimiento de estándares, 
                problemas de calidad recurrentes, o por solicitud de cualquiera de las partes con 30 días de aviso.
              </p>
            </div>
          );

        case "international":
          return (
            <div className="prose max-w-none">
              <h3 className="text-xl font-bold mb-4">Marco Legal Internacional</h3>
              
              <h4 className="text-lg font-semibold mt-6 mb-3">1. Jurisdicción Aplicable</h4>
              <p className="mb-4">
                ZLC Express S.A. opera desde Costa Rica bajo la legislación costarricense 
                y los tratados internacionales de comercio suscritos por Costa Rica.
              </p>

              <h4 className="text-lg font-semibold mt-6 mb-3">2. Regulaciones de Comercio Exterior</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Ley General de Aduanas de Costa Rica</li>
                <li>Código Aduanero Uniforme Centroamericano (CAUCA)</li>
                <li>Tratados de Libre Comercio aplicables</li>
                <li>Regulaciones de la Organización Mundial de Comercio (OMC)</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">3. Cumplimiento Aduanero</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Clasificación arancelaria correcta de productos</li>
                <li>Documentación de origen y certificados requeridos</li>
                <li>Cumplimiento de regulaciones sanitarias y fitosanitarias</li>
                <li>Declaraciones de valor precisas</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">4. Incoterms 2020</h4>
              <p className="mb-4">Reconocemos y aplicamos los Incoterms 2020 de la Cámara de Comercio Internacional:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>FOB:</strong> Free On Board (puerto de embarque)</li>
                <li><strong>CIF:</strong> Cost, Insurance and Freight</li>
                <li><strong>DDP:</strong> Delivered Duty Paid</li>
                <li><strong>EXW:</strong> Ex Works (para pedidos especiales)</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">5. Resolución de Disputas Internacionales</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Mediación inicial a través de ZLC Express</li>
                <li>Arbitraje comercial internacional si es necesario</li>
                <li>Aplicación de la Convención de Viena sobre compraventa internacional</li>
                <li>Reconocimiento de laudos arbitrales internacionales</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">6. Cumplimiento Normativo</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Anti-lavado de dinero y financiamiento al terrorismo</li>
                <li>Regulaciones de control de exportaciones</li>
                <li>Normas internacionales de trabajo</li>
                <li>Regulaciones ambientales aplicables</li>
              </ul>
            </div>
          );

        case "dispute":
          return (
            <div className="prose max-w-none">
              <h3 className="text-xl font-bold mb-4">Resolución de Disputas</h3>
              
              <h4 className="text-lg font-semibold mt-6 mb-3">1. Prevención de Disputas</h4>
              <p className="mb-4">
                ZLC Express implementa múltiples mecanismos para prevenir disputas:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Verificación rigurosa de todos los usuarios</li>
                <li>Especificaciones claras en todas las cotizaciones</li>
                <li>Comunicación documentada en la plataforma</li>
                <li>Inspecciones de calidad pre-embarque</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">2. Proceso de Resolución - Nivel 1</h4>
              <p className="mb-4"><strong>Mediación Directa (0-7 días)</strong></p>
              <ul className="list-disc pl-6 mb-4">
                <li>Las partes intentan resolver directamente</li>
                <li>Comunicación facilitada por la plataforma</li>
                <li>Documentación de todas las comunicaciones</li>
                <li>Soporte técnico de ZLC Express disponible</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">3. Proceso de Resolución - Nivel 2</h4>
              <p className="mb-4"><strong>Mediación Asistida (7-21 días)</strong></p>
              <ul className="list-disc pl-6 mb-4">
                <li>Intervención de mediador certificado de ZLC Express</li>
                <li>Revisión de documentación y evidencias</li>
                <li>Sesiones de mediación virtuales</li>
                <li>Búsqueda de soluciones mutuamente beneficiosas</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">4. Proceso de Resolución - Nivel 3</h4>
              <p className="mb-4"><strong>Arbitraje Vinculante (21+ días)</strong></p>
              <ul className="list-disc pl-6 mb-4">
                <li>Panel de árbitros especializados en comercio internacional</li>
                <li>Proceso formal con presentación de evidencias</li>
                <li>Decisión vinculante para ambas partes</li>
                <li>Ejecución garantizada a través de la plataforma</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">5. Tipos de Disputas Comunes</h4>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Calidad:</strong> Productos no conformes a especificaciones</li>
                <li><strong>Entrega:</strong> Retrasos o incumplimientos de fecha</li>
                <li><strong>Cantidad:</strong> Diferencias en volúmenes entregados</li>
                <li><strong>Pago:</strong> Incumplimientos de términos de pago</li>
                <li><strong>Documentación:</strong> Problemas con certificados o permisos</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">6. Garantías y Compensaciones</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Fondo de garantía para transacciones verificadas</li>
                <li>Seguro de incumplimiento disponible</li>
                <li>Compensación por daños demostrados</li>
                <li>Restitución o reemplazo según el caso</li>
              </ul>

              <h4 className="text-lg font-semibold mt-6 mb-3">7. Costos de Resolución</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Mediación Nivel 1 y 2: Sin costo adicional</li>
                <li>Arbitraje: Costos compartidos entre las partes</li>
                <li>La parte que incumple asume los costos totales</li>
              </ul>
            </div>
          );

        default:
          return <p>Documento no encontrado.</p>;
      }
    };

    return (
      <div className="bg-white p-6 rounded-lg border">
        {getDocumentContent(documentId)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="pt-16 bg-[rgb(12,74,133)]">
        <div className="container mx-auto px-4 py-16 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Marco Legal
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto text-white">
            Documentación legal completa para operaciones comerciales transparentes y seguras
          </p>
        </div>
      </div>

      {/* Company Information */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Información Legal de la Empresa
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ZLC Express S.A. opera bajo la legislación costarricense con todas las autorizaciones requeridas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Building className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="font-semibold">Información Corporativa</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div><strong>Razón Social:</strong> {companyInfo.legalName}</div>
                  <div><strong>Cédula Jurídica:</strong> {companyInfo.identification}</div>
                  <div><strong>Registro:</strong> {companyInfo.registration}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="font-semibold">Ubicación</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div><strong>Dirección:</strong></div>
                  <div>{companyInfo.address}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Phone className="h-6 w-6 text-purple-600 mr-2" />
                  <h3 className="font-semibold">Contacto Legal</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div><strong>Teléfono:</strong> {companyInfo.phone}</div>
                  <div><strong>Email Legal:</strong> {companyInfo.email}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Permits and Licenses */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Licencias y Permisos Vigentes
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {companyInfo.permits.map((permit, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {permit}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legal Documents */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Documentos Legales
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Accede a todos nuestros términos, políticas y acuerdos legales
            </p>
          </div>

          <Tabs defaultValue="documents" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="viewer">Visualizar</TabsTrigger>
            </TabsList>

            <TabsContent value="documents">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {legalDocuments.map((doc) => (
                  <Card key={doc.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {doc.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{doc.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {doc.type}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{doc.description}</p>
                          <div className="flex items-center text-xs text-gray-500 mb-4">
                            <Calendar className="h-3 w-3 mr-1" />
                            Actualizado: {doc.lastUpdated}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedDocument(doc.id)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Ver
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="viewer">
              <div className="space-y-6">
                {!selectedDocument ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Selecciona un Documento
                      </h3>
                      <p className="text-gray-500">
                        Elige un documento de la pestaña anterior para visualizarlo aquí
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedDocument(null)}
                        >
                          ← Volver a la lista
                        </Button>
                        <div>
                          <h3 className="font-semibold">
                            {legalDocuments.find(d => d.id === selectedDocument)?.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {legalDocuments.find(d => d.id === selectedDocument)?.lastUpdated}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Descargar PDF
                      </Button>
                    </div>
                    <DocumentViewer documentId={selectedDocument} />
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Compliance and Certifications */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cumplimiento y Certificaciones
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprometidos con los más altos estándares legales y de calidad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">ISO 27001</h3>
                <p className="text-sm text-gray-600">Seguridad de la Información</p>
                <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                  Certificado
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Scale className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">GDPR</h3>
                <p className="text-sm text-gray-600">Protección de Datos</p>
                <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                  Cumplimiento
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Globe className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">COMEX</h3>
                <p className="text-sm text-gray-600">Comercio Exterior</p>
                <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                  Autorizado
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <CreditCard className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">PCI DSS</h3>
                <p className="text-sm text-gray-600">Seguridad de Pagos</p>
                <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                  Certificado
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Legal Notice */}
      <div className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <Info className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-bold">Aviso Legal</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Este sitio web y la plataforma ZLC Express están protegidos por las leyes de propiedad intelectual. 
              Todos los derechos reservados. El uso no autorizado está prohibido.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <div>© 2024 ZLC Express S.A. - Todos los derechos reservados</div>
              <div className="text-gray-400">|</div>
              <div>Última actualización: 15 de Octubre, 2024</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;
