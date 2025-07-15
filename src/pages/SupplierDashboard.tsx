import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navigation } from "@/components/Navigation";
import {
  Building2,
  Package,
  FileText,
  ShoppingCart,
  MessageSquare,
  Shield,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Users,
  Truck,
  BarChart3,
  Settings,
  Bell,
  Plus,
  Eye,
  Download,
  ArrowRight,
  Edit,
  Star,
  Award,
} from "lucide-react";

interface DashboardMetric {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  color: string;
}

interface RecentActivity {
  id: string;
  type: "rfq" | "order" | "message" | "shipment";
  title: string;
  description: string;
  timestamp: Date;
  status?: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
}

export default function SupplierDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for dashboard metrics
  const metrics: DashboardMetric[] = [
    {
      title: "Lotes Activos",
      value: "3",
      subtitle: "2 pendientes modificación",
      icon: Package,
      trend: "+1 este mes",
      color: "text-blue-600",
    },
    {
      title: "Cotizaciones Recibidas",
      value: "4",
      subtitle: "RFQs sin responder",
      icon: FileText,
      trend: "2 nuevas hoy",
      color: "text-orange-600",
    },
    {
      title: "Órdenes Confirmadas",
      value: "2",
      subtitle: "Contenedores en producción",
      icon: ShoppingCart,
      trend: "1 lista para envío",
      color: "text-green-600",
    },
    {
      title: "Mensajes Nuevos",
      value: "8",
      subtitle: "Consultas de compradores",
      icon: MessageSquare,
      trend: "3 sin leer",
      color: "text-purple-600",
    },
  ];

  // Mock recent activity data
  const recentActivity: RecentActivity[] = [
    {
      id: "1",
      type: "rfq",
      title: "Nueva cotización recibida",
      description: "Importadora Central - Textiles Premium 40'",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "pending",
    },
    {
      id: "2",
      type: "order",
      title: "Orden confirmada",
      description: "Orden #ZLC-2024-001 - 2 contenedores café",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: "confirmed",
    },
    {
      id: "3",
      type: "message",
      title: "Mensaje de comprador",
      description: "Consulta sobre especificaciones técnicas",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: "unread",
    },
    {
      id: "4",
      type: "shipment",
      title: "Contenedor despachado",
      description: "ZLCU-2024-0012 en tránsito a Costa Rica",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: "shipped",
    },
  ];

  // Main navigation menu items
  const menuItems: QuickAction[] = [
    {
      title: "Mi Perfil",
      description: "Datos empresa, contactos, certificados",
      icon: Building2,
      href: "/supplier/profile",
      color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    },
    {
      title: "Mis Lotes / Productos",
      description: "Gestionar lotes por contenedor",
      icon: Package,
      href: "/supplier/products",
      color: "bg-green-50 text-green-600 hover:bg-green-100",
    },
    {
      title: "Cotizaciones (RFQ)",
      description: "Solicitudes de compradores",
      icon: FileText,
      href: "/supplier/rfqs",
      color: "bg-orange-50 text-orange-600 hover:bg-orange-100",
    },
    {
      title: "Órdenes Proforma",
      description: "Pedidos confirmados",
      icon: ShoppingCart,
      href: "/supplier/orders",
      color: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    },
    {
      title: "Envíos y Logística",
      description: "Gestión de transportes",
      icon: Truck,
      href: "/supplier/shipments",
      color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
    },
    {
      title: "Chat y Mensajería",
      description: "Conversaciones con compradores",
      icon: MessageSquare,
      href: "/supplier/messages",
      color: "bg-pink-50 text-pink-600 hover:bg-pink-100",
    },
    {
      title: "Reportes y Ventas",
      description: "Estadísticas e ingresos",
      icon: BarChart3,
      href: "/supplier/reports",
      color: "bg-cyan-50 text-cyan-600 hover:bg-cyan-100",
    },
    {
      title: "Aduana y Documentos",
      description: "Documentos aduaneros",
      icon: Shield,
      href: "/supplier/customs",
      color: "bg-red-50 text-red-600 hover:bg-red-100",
    },
    {
      title: "Configuraciones",
      description: "Notificaciones y métodos pago",
      icon: Settings,
      href: "/supplier/settings",
      color: "bg-gray-50 text-gray-600 hover:bg-gray-100",
    },
  ];

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "rfq":
        return <FileText className="h-4 w-4 text-orange-500" />;
      case "order":
        return <ShoppingCart className="h-4 w-4 text-green-500" />;
      case "message":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "shipment":
        return <Truck className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-orange-600">
            Pendiente
          </Badge>
        );
      case "confirmed":
        return (
          <Badge variant="default" className="bg-green-600">
            Confirmado
          </Badge>
        );
      case "unread":
        return <Badge variant="destructive">No leído</Badge>;
      case "shipped":
        return <Badge variant="secondary">Enviado</Badge>;
      default:
        return null;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays > 0) {
      return `Hace ${diffInDays} día${diffInDays > 1 ? "s" : ""}`;
    } else if (diffInHours > 0) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`;
    } else {
      return "Hace menos de 1 hora";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="pt-16">
        <div className="container mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mi Panel de Proveedor
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona tus productos, cotizaciones y órdenes en ZLC Express
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/supplier/products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Lote
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/supplier/messages">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Mensajes
                  <Badge variant="destructive" className="ml-2 text-xs">
                    3
                  </Badge>
                </Link>
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric) => (
              <Card
                key={metric.title}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gray-100`}>
                        <metric.icon className={`h-6 w-6 ${metric.color}`} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-600">
                          {metric.title}
                        </h3>
                        <p className="text-2xl font-bold text-gray-900">
                          {metric.value}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">{metric.subtitle}</p>
                    {metric.trend && (
                      <p className="text-xs text-green-600 mt-1">
                        {metric.trend}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Customs Verification Status */}
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-amber-200 rounded-lg">
                  <Shield className="h-6 w-6 text-amber-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-800 mb-2">
                    Estado de Verificación Aduanera
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-amber-700">
                        Licencia ZLC
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-amber-700 border-amber-300"
                        >
                          Vence en 15 días
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-xs"
                        >
                          Renovar
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-amber-700">
                        Certificado ISO 9001
                      </span>
                      <Badge variant="default" className="bg-green-600">
                        Vigente
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-amber-700">
                        Registro Legal
                      </span>
                      <Badge variant="default" className="bg-green-600">
                        Verificado
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Menu Navigation */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    Menú Principal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {menuItems.map((item) => (
                      <Link
                        key={item.title}
                        to={item.href}
                        className="block p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors group"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${item.color}`}>
                            <item.icon className="h-5 w-5" />
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Quick Stats */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-600" />
                      Actividad Reciente
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/supplier/activity">
                        Ver todo
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {recentActivity.slice(0, 4).map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {activity.title}
                            </h4>
                            {activity.status && getStatusBadge(activity.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatTimeAgo(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Estadísticas Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Tasa de respuesta
                    </span>
                    <div className="flex items-center gap-2">
                      <Progress value={92} className="w-16 h-2" />
                      <span className="text-sm font-medium">92%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Órdenes completadas
                    </span>
                    <span className="text-sm font-medium">24/26</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Calificación promedio
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500 fill-current" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Ingresos este mes
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      $45,230
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Verification Badge */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-200 rounded-full">
                      <Award className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-green-800">
                        Proveedor Verificado ZLC
                      </h3>
                      <p className="text-sm text-green-600">
                        Empresa autorizada y certificada
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
