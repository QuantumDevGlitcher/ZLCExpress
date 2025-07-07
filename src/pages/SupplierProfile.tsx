import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Building2,
  User,
  CreditCard,
  Bell,
  FileText,
  Upload,
  Download,
  Edit,
  Trash2,
  Plus,
  Check,
  X,
  Award,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  AlertCircle,
  Settings,
} from "lucide-react";

interface AuthorizedContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  role: "admin" | "rfq_manager" | "viewer" | "accounting";
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
}

interface PaymentMethod {
  id: string;
  type: "wire_transfer" | "letter_of_credit";
  title: string;
  isDefault: boolean;
  bankData: {
    bankName: string;
    swift: string;
    bic: string;
    accountNumber: string;
    accountHolder: string;
    currency: string;
    country: string;
  };
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  buyerCompany: string;
  amount: number;
  currency: string;
  issueDate: Date;
  dueDate: Date;
  status: "draft" | "sent" | "paid" | "overdue";
  pdfUrl: string;
}

const SupplierProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<
    "profile" | "payments" | "invoices" | "notifications"
  >("profile");
  const [editingContact, setEditingContact] = useState<string | null>(null);
  const [showAddContact, setShowAddContact] = useState(false);

  // Company profile data
  const [companyData, setCompanyData] = useState({
    legalName: "ZLC Textiles S.A.",
    taxId: "3-102-123456",
    zlcLocation: "Zona Franca El Coyol, Alajuela",
    address: {
      street: "Edificio 25, Oficina 201",
      city: "Alajuela",
      state: "Alajuela",
      country: "Costa Rica",
      postalCode: "20101",
    },
    contactInfo: {
      phone: "+506 2234-5678",
      email: "info@zlctextiles.com",
      website: "www.zlctextiles.com",
    },
    verificationStatus: "verified" as const,
  });

  // Authorized contacts
  const [authorizedContacts, setAuthorizedContacts] = useState<
    AuthorizedContact[]
  >([
    {
      id: "1",
      name: "María Rodríguez",
      email: "maria.rodriguez@zlctextiles.com",
      phone: "+506 2234-5679",
      position: "Gerente Comercial",
      role: "admin",
      permissions: ["manage_rfqs", "manage_orders", "view_reports", "settings"],
      isActive: true,
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "Carlos Jiménez",
      email: "carlos.jimenez@zlctextiles.com",
      phone: "+506 2234-5680",
      position: "Coordinador de Ventas",
      role: "rfq_manager",
      permissions: ["manage_rfqs", "view_orders"],
      isActive: true,
      createdAt: new Date("2024-01-20"),
    },
  ]);

  // Payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "wire_transfer",
      title: "Cuenta Principal USD",
      isDefault: true,
      bankData: {
        bankName: "Banco Nacional de Costa Rica",
        swift: "BNCRCRSJ",
        bic: "BNCRCRSJ",
        accountNumber: "100-01-000-123456",
        accountHolder: "ZLC Textiles S.A.",
        currency: "USD",
        country: "Costa Rica",
      },
    },
  ]);

  // Invoices data
  const invoices: Invoice[] = [
    {
      id: "INV-001",
      invoiceNumber: "INV-2024-001",
      orderNumber: "PO-2024-001",
      buyerCompany: "Comercial Los Andes S.A.",
      amount: 19600,
      currency: "USD",
      issueDate: new Date("2024-01-25"),
      dueDate: new Date("2024-02-25"),
      status: "paid",
      pdfUrl: "#",
    },
    {
      id: "INV-002",
      invoiceNumber: "INV-2024-002",
      orderNumber: "PO-2024-002",
      buyerCompany: "Textiles del Pacífico Ltda.",
      amount: 15800,
      currency: "USD",
      issueDate: new Date("2024-02-01"),
      dueDate: new Date("2024-03-01"),
      status: "sent",
      pdfUrl: "#",
    },
  ];

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    newRFQ: { email: true, sms: false, inApp: true },
    acceptedQuote: { email: true, sms: true, inApp: true },
    paymentReceived: { email: true, sms: true, inApp: true },
    startProduction: { email: true, sms: false, inApp: true },
    incidentOpened: { email: true, sms: true, inApp: true },
    orderCompleted: { email: true, sms: false, inApp: true },
    systemUpdates: { email: false, sms: false, inApp: true },
  });

  const handleSaveProfile = () => {
    toast({
      title: "Perfil Actualizado",
      description: "Los datos de la empresa han sido guardados correctamente.",
    });
  };

  const handleAddContact = () => {
    toast({
      title: "Contacto Agregado",
      description: "El nuevo contacto autorizado ha sido agregado al sistema.",
    });
    setShowAddContact(false);
  };

  const handleSavePaymentMethod = () => {
    toast({
      title: "Método de Pago Guardado",
      description: "Los datos bancarios han sido actualizados correctamente.",
    });
  };

  const handleNotificationChange = (
    setting: string,
    type: "email" | "sms" | "inApp",
    value: boolean,
  ) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: {
        ...prev[setting as keyof typeof prev],
        [type]: value,
      },
    }));
  };

  const saveNotificationSettings = () => {
    toast({
      title: "Configuración Guardada",
      description: "Las preferencias de notificación han sido actualizadas.",
    });
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "rfq_manager":
        return "Gestor RFQ";
      case "viewer":
        return "Solo Lectura";
      case "accounting":
        return "Contabilidad";
      default:
        return role;
    }
  };

  const getInvoiceStatusVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "sent":
        return "secondary";
      case "draft":
        return "outline";
      case "overdue":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getInvoiceStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Pagada";
      case "sent":
        return "Enviada";
      case "draft":
        return "Borrador";
      case "overdue":
        return "Vencida";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-14 sm:pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
              <Button variant="outline" asChild>
                <Link to="/supplier/dashboard">← Volver al Panel</Link>
              </Button>
            </div>
            <p className="text-gray-600">
              Gestiona los datos de tu empresa y configuraciones
            </p>
          </div>

          {/* Tab Navigation */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activeTab === "profile" ? "default" : "outline"}
                  onClick={() => setActiveTab("profile")}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Datos de Empresa
                </Button>
                <Button
                  variant={activeTab === "payments" ? "default" : "outline"}
                  onClick={() => setActiveTab("payments")}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Métodos de Pago
                </Button>
                <Button
                  variant={activeTab === "invoices" ? "default" : "outline"}
                  onClick={() => setActiveTab("invoices")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Mis Facturas
                </Button>
                <Button
                  variant={
                    activeTab === "notifications" ? "default" : "outline"
                  }
                  onClick={() => setActiveTab("notifications")}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notificaciones
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Company Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Información de la Empresa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="legal-name">Razón Social</Label>
                    <Input
                      id="legal-name"
                      value={companyData.legalName}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          legalName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="tax-id">Cédula Jurídica / NIT</Label>
                    <Input
                      id="tax-id"
                      value={companyData.taxId}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          taxId: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="zlc-location">Ubicación en ZLC</Label>
                    <Input
                      id="zlc-location"
                      value={companyData.zlcLocation}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          zlcLocation: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Dirección Fiscal</Label>
                    <Textarea
                      id="address"
                      value={`${companyData.address.street}, ${companyData.address.city}, ${companyData.address.state}, ${companyData.address.country}, ${companyData.address.postalCode}`}
                      rows={3}
                      onChange={(e) => {
                        // Handle address update logic here
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={companyData.contactInfo.phone}
                        onChange={(e) =>
                          setCompanyData((prev) => ({
                            ...prev,
                            contactInfo: {
                              ...prev.contactInfo,
                              phone: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Corporativo</Label>
                      <Input
                        id="email"
                        value={companyData.contactInfo.email}
                        onChange={(e) =>
                          setCompanyData((prev) => ({
                            ...prev,
                            contactInfo: {
                              ...prev.contactInfo,
                              email: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="website">Sitio Web (Opcional)</Label>
                    <Input
                      id="website"
                      value={companyData.contactInfo.website}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          contactInfo: {
                            ...prev.contactInfo,
                            website: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <Button onClick={handleSaveProfile} className="w-full">
                    Guardar Cambios
                  </Button>
                </CardContent>
              </Card>

              {/* Authorized Contacts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Contactos Autorizados
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setShowAddContact(true)}
                      className="h-8"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {authorizedContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="border rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{contact.name}</h4>
                            <p className="text-sm text-gray-600">
                              {contact.position}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {getRoleLabel(contact.role)}
                            </Badge>
                            {contact.isActive ? (
                              <Badge
                                variant="default"
                                className="bg-green-100 text-green-800"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Activo
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <X className="h-3 w-3 mr-1" />
                                Inactivo
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {contact.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {contact.phone}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingContact(contact.id)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {showAddContact && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-medium mb-3">
                        Agregar Nuevo Contacto
                      </h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input placeholder="Nombre completo" />
                          <Input placeholder="Cargo/Posición" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input placeholder="Email" type="email" />
                          <Input placeholder="Teléfono" />
                        </div>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar rol" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="rfq_manager">
                              Gestor RFQ
                            </SelectItem>
                            <SelectItem value="viewer">Solo Lectura</SelectItem>
                            <SelectItem value="accounting">
                              Contabilidad
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                          <Button onClick={handleAddContact} size="sm">
                            Agregar Contacto
                          </Button>
                          <Button
                            onClick={() => setShowAddContact(false)}
                            size="sm"
                            variant="outline"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Certificates */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Certificados Vigentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 text-center">
                      <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-medium">Licencia ZLC</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Vigente hasta: Dic 2024
                      </p>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        Activo
                      </Badge>
                      <div className="mt-3 space-y-2">
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="h-3 w-3 mr-1" />
                          Descargar
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          <Upload className="h-3 w-3 mr-1" />
                          Renovar
                        </Button>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-medium">ISO 9001:2015</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Vigente hasta: Jun 2024
                      </p>
                      <Badge
                        variant="default"
                        className="bg-blue-100 text-blue-800"
                      >
                        Activo
                      </Badge>
                      <div className="mt-3 space-y-2">
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="h-3 w-3 mr-1" />
                          Descargar
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          <Upload className="h-3 w-3 mr-1" />
                          Renovar
                        </Button>
                      </div>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-600">
                        Subir Certificado
                      </h4>
                      <p className="text-sm text-gray-500 mb-3">
                        Agregar nuevo certificado
                      </p>
                      <Button size="sm" variant="outline">
                        Seleccionar Archivo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Métodos de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{method.title}</h4>
                        {method.isDefault && (
                          <Badge variant="default">Principal</Badge>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-gray-600">
                              Banco
                            </Label>
                            <p>{method.bankData.bankName}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600">
                              Moneda
                            </Label>
                            <p>{method.bankData.currency}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-gray-600">
                              SWIFT
                            </Label>
                            <p className="font-mono">{method.bankData.swift}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-600">
                              Cuenta
                            </Label>
                            <p className="font-mono">
                              {method.bankData.accountNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        {!method.isDefault && (
                          <Button size="sm" variant="outline">
                            Marcar Principal
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full border-dashed"
                    onClick={() => toast({ title: "Agregar método de pago" })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Método de Pago
                  </Button>
                </CardContent>
              </Card>

              {/* Billing Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Configuración de Facturación
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="tariff-code">
                      Partida Arancelaria Principal
                    </Label>
                    <Input
                      id="tariff-code"
                      placeholder="6109.10.00"
                      defaultValue="6109.10.00"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Código para productos textiles
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="invoice-terms">
                      Términos de Facturación
                    </Label>
                    <Textarea
                      id="invoice-terms"
                      placeholder="Términos y condiciones..."
                      defaultValue="Precios en USD FOB Puerto Caldera. Validez 30 días."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tax-info">
                      Información Fiscal Obligatoria
                    </Label>
                    <Textarea
                      id="tax-info"
                      placeholder="Datos fiscales adicionales..."
                      defaultValue="Empresa ubicada en Zona Franca. Exenta de impuestos de exportación según Ley 7210."
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleSavePaymentMethod} className="w-full">
                    Guardar Configuración
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Invoices Tab */}
          {activeTab === "invoices" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Mis Facturas Emitidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Factura</TableHead>
                        <TableHead>Orden</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Fecha Emisión</TableHead>
                        <TableHead>Vencimiento</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">
                            {invoice.invoiceNumber}
                          </TableCell>
                          <TableCell>{invoice.orderNumber}</TableCell>
                          <TableCell>{invoice.buyerCompany}</TableCell>
                          <TableCell>
                            <span className="font-medium">
                              ${invoice.amount.toLocaleString()}{" "}
                              {invoice.currency}
                            </span>
                          </TableCell>
                          <TableCell>
                            {invoice.issueDate.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {invoice.dueDate.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getInvoiceStatusVariant(invoice.status)}
                            >
                              {getInvoiceStatusLabel(invoice.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Download className="h-3 w-3 mr-1" />
                                PDF
                              </Button>
                              <Button size="sm" variant="outline">
                                <Mail className="h-3 w-3 mr-1" />
                                Reenviar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Configuración de Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4 text-center font-medium text-sm border-b pb-2">
                    <div>Evento</div>
                    <div>Email</div>
                    <div>SMS</div>
                    <div>En Plataforma</div>
                  </div>

                  {Object.entries(notificationSettings).map(
                    ([key, settings]) => (
                      <div
                        key={key}
                        className="grid grid-cols-4 gap-4 items-center py-2"
                      >
                        <div className="text-sm">
                          <p className="font-medium">
                            {key === "newRFQ" && "Nueva RFQ recibida"}
                            {key === "acceptedQuote" &&
                              "Comprador acepta cotización"}
                            {key === "paymentReceived" && "Pago recibido"}
                            {key === "startProduction" && "Iniciar producción"}
                            {key === "incidentOpened" &&
                              "Ticket de incidencia abierto"}
                            {key === "orderCompleted" && "Orden completada"}
                            {key === "systemUpdates" &&
                              "Actualizaciones del sistema"}
                          </p>
                        </div>
                        <div className="text-center">
                          <Switch
                            checked={settings.email}
                            onCheckedChange={(value) =>
                              handleNotificationChange(key, "email", value)
                            }
                          />
                        </div>
                        <div className="text-center">
                          <Switch
                            checked={settings.sms}
                            onCheckedChange={(value) =>
                              handleNotificationChange(key, "sms", value)
                            }
                          />
                        </div>
                        <div className="text-center">
                          <Switch
                            checked={settings.inApp}
                            onCheckedChange={(value) =>
                              handleNotificationChange(key, "inApp", value)
                            }
                          />
                        </div>
                      </div>
                    ),
                  )}

                  <Separator />

                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">
                        Silenciar Notificaciones No Críticas
                      </h4>
                      <p className="text-sm text-gray-600">
                        Recibir solo notificaciones de alta prioridad (pagos,
                        incidencias urgentes)
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <Button onClick={saveNotificationSettings} className="w-full">
                    Guardar Configuración
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierProfile;
