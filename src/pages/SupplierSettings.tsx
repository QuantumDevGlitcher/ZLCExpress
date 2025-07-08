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
  Settings,
  Building2,
  User,
  CreditCard,
  Bell,
  Shield,
  Trash2,
  FileText,
  Upload,
  Download,
  Edit,
  Plus,
  Check,
  X,
  Award,
  Mail,
  Phone,
  Eye,
  EyeOff,
  AlertTriangle,
  Key,
  Smartphone,
  UserX,
  Archive,
  DollarSign,
  Percent,
  Calendar,
  Lock,
  AlertCircle,
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
  lastAccess?: Date;
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
  advancePercentage: number;
  paymentTerms: string;
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

const SupplierSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<
    | "profile"
    | "contacts"
    | "payments"
    | "notifications"
    | "security"
    | "billing"
    | "account"
  >("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [editingContact, setEditingContact] = useState<string | null>(null);
  const [showAddContact, setShowAddContact] = useState(false);

  // Company profile data
  const [companyData, setCompanyData] = useState({
    legalName: "ZLC Textiles S.A.",
    sector: "Textiles y Confección",
    description:
      "Empresa especializada en la producción de textiles de alta calidad para exportación. Ubicada en Zona Franca El Coyol con certificaciones ISO 9001 y licencia ZLC vigente.",
    taxId: "3-102-123456",
    logo: null as File | null,
    website: "www.zlctextiles.com",
    foundedYear: "2018",
    employees: "25-50",
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
      lastAccess: new Date("2024-02-23"),
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
      lastAccess: new Date("2024-02-22"),
    },
    {
      id: "3",
      name: "Ana Vargas",
      email: "ana.vargas@zlctextiles.com",
      phone: "+506 2234-5681",
      position: "Contadora",
      role: "accounting",
      permissions: ["view_reports", "manage_billing"],
      isActive: false,
      createdAt: new Date("2024-02-01"),
    },
  ]);

  // Payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "wire_transfer",
      title: "Cuenta Principal USD",
      isDefault: true,
      advancePercentage: 30,
      paymentTerms: "30% T/T adelanto, 70% contra BL",
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
    {
      id: "2",
      type: "letter_of_credit",
      title: "Carta de Crédito Internacional",
      isDefault: false,
      advancePercentage: 0,
      paymentTerms: "L/C irrevocable a la vista",
      bankData: {
        bankName: "Banco de Costa Rica",
        swift: "BCRCCRSJXXX",
        bic: "BCRCCRSJXXX",
        accountNumber: "BCR-LC-789456",
        accountHolder: "ZLC Textiles S.A.",
        currency: "USD",
        country: "Costa Rica",
      },
    },
  ]);

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    newRFQ: { email: true, sms: false, inApp: true },
    acceptedQuote: { email: true, sms: true, inApp: true },
    paymentReceived: { email: true, sms: true, inApp: true },
    startProduction: { email: true, sms: false, inApp: true },
    incidentOpened: { email: true, sms: true, inApp: true },
    orderCompleted: { email: true, sms: false, inApp: true },
    systemMaintenance: { email: false, sms: false, inApp: true },
    securityAlerts: { email: true, sms: true, inApp: true },
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    sessionTimeout: "30",
    loginNotifications: true,
  });

  // Mock invoices data
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
    {
      id: "INV-003",
      invoiceNumber: "INV-2024-003",
      orderNumber: "PO-2024-003",
      buyerCompany: "Importadora San José",
      amount: 28800,
      currency: "USD",
      issueDate: new Date("2024-02-15"),
      dueDate: new Date("2024-03-15"),
      status: "overdue",
      pdfUrl: "#",
    },
  ];

  const handleSaveProfile = () => {
    toast({
      title: "Perfil Actualizado",
      description: "Los datos de la empresa han sido guardados correctamente.",
    });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCompanyData((prev) => ({ ...prev, logo: file }));
      toast({
        title: "Logo Subido",
        description: "El logo de la empresa ha sido actualizado.",
      });
    }
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

  const handlePasswordChange = () => {
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Contraseña Actualizada",
      description: "Tu contraseña ha sido cambiada exitosamente.",
    });

    setSecuritySettings((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  const handle2FAToggle = () => {
    if (!securitySettings.twoFactorEnabled) {
      setShow2FASetup(true);
    } else {
      setSecuritySettings((prev) => ({ ...prev, twoFactorEnabled: false }));
      toast({
        title: "2FA Desactivado",
        description: "La autenticación en dos pasos ha sido desactivada.",
      });
    }
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

  const handleAccountDeactivation = () => {
    toast({
      title: "Solicitud Enviada",
      description:
        "Tu solicitud de desactivación ha sido enviada para revisión.",
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
              <h1 className="text-2xl font-bold text-gray-900">
                Configuraciones
              </h1>
              <Button variant="outline" asChild>
                <Link to="/supplier/dashboard">← Volver al Panel</Link>
              </Button>
            </div>
            <p className="text-gray-600">
              Administra la información, preferencias y condiciones comerciales
              de tu empresa
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
                  Perfil de Empresa
                </Button>
                <Button
                  variant={activeTab === "contacts" ? "default" : "outline"}
                  onClick={() => setActiveTab("contacts")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Contactos Autorizados
                </Button>
                <Button
                  variant={activeTab === "payments" ? "default" : "outline"}
                  onClick={() => setActiveTab("payments")}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Métodos de Pago
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
                <Button
                  variant={activeTab === "security" ? "default" : "outline"}
                  onClick={() => setActiveTab("security")}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Seguridad
                </Button>
                <Button
                  variant={activeTab === "billing" ? "default" : "outline"}
                  onClick={() => setActiveTab("billing")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Facturaci��n
                </Button>
                <Button
                  variant={activeTab === "account" ? "default" : "outline"}
                  onClick={() => setActiveTab("account")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Gestión de Cuenta
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
                    <Label htmlFor="sector">Sector</Label>
                    <Select
                      value={companyData.sector}
                      onValueChange={(value) =>
                        setCompanyData((prev) => ({ ...prev, sector: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Textiles y Confección">
                          Textiles y Confección
                        </SelectItem>
                        <SelectItem value="Electrónicos">
                          Electrónicos
                        </SelectItem>
                        <SelectItem value="Alimentos">Alimentos</SelectItem>
                        <SelectItem value="Químicos">Químicos</SelectItem>
                        <SelectItem value="Otros">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">
                      Descripción de la Empresa
                    </Label>
                    <Textarea
                      id="description"
                      value={companyData.description}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="founded">Año de Fundación</Label>
                      <Input
                        id="founded"
                        value={companyData.foundedYear}
                        onChange={(e) =>
                          setCompanyData((prev) => ({
                            ...prev,
                            foundedYear: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="employees">Número de Empleados</Label>
                      <Select
                        value={companyData.employees}
                        onValueChange={(value) =>
                          setCompanyData((prev) => ({
                            ...prev,
                            employees: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10</SelectItem>
                          <SelectItem value="11-25">11-25</SelectItem>
                          <SelectItem value="25-50">25-50</SelectItem>
                          <SelectItem value="51-100">51-100</SelectItem>
                          <SelectItem value="100+">100+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="website">Sitio Web</Label>
                    <Input
                      id="website"
                      value={companyData.website}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <Button onClick={handleSaveProfile} className="w-full">
                    Guardar Cambios
                  </Button>
                </CardContent>
              </Card>

              {/* Logo Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Logo de la Empresa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
                      {companyData.logo ? (
                        <img
                          src={URL.createObjectURL(companyData.logo)}
                          alt="Logo"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <Building2 className="h-16 w-16 text-gray-400" />
                      )}
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="logo-upload"
                      onChange={handleLogoUpload}
                    />
                    <Label htmlFor="logo-upload" className="cursor-pointer">
                      <Button variant="outline" asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Subir Logo
                        </span>
                      </Button>
                    </Label>
                    <p className="text-sm text-gray-500 mt-2">
                      Formato: JPG, PNG. Tamaño máximo: 2MB
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Certificates */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Certificados y Licencias
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

          {/* Contacts Tab */}
          {activeTab === "contacts" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contactos Autorizados ({authorizedContacts.length})
                  </div>
                  <Button onClick={() => setShowAddContact(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Contacto
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Cargo</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Último Acceso</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {authorizedContacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell className="font-medium">
                            {contact.name}
                          </TableCell>
                          <TableCell>{contact.email}</TableCell>
                          <TableCell>{contact.phone}</TableCell>
                          <TableCell>{contact.position}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {getRoleLabel(contact.role)}
                            </Badge>
                          </TableCell>
                          <TableCell>
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
                          </TableCell>
                          <TableCell>
                            {contact.lastAccess?.toLocaleDateString() ||
                              "Nunca"}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {showAddContact && (
                  <div className="border-t pt-6 mt-6">
                    <h4 className="font-medium mb-4">Agregar Nuevo Contacto</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact-name">Nombre Completo</Label>
                        <Input
                          id="contact-name"
                          placeholder="Nombre completo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-position">Cargo/Posición</Label>
                        <Input
                          id="contact-position"
                          placeholder="Cargo o posición"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-email">Email</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          placeholder="email@empresa.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-phone">Teléfono</Label>
                        <Input
                          id="contact-phone"
                          placeholder="+506 1234-5678"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="contact-role">Rol de Usuario</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar rol" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">
                              Administrador - Acceso total
                            </SelectItem>
                            <SelectItem value="rfq_manager">
                              Gestor RFQ - Manejo de cotizaciones
                            </SelectItem>
                            <SelectItem value="viewer">
                              Solo Lectura - Ver información
                            </SelectItem>
                            <SelectItem value="accounting">
                              Contabilidad - Facturas y reportes
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleAddContact}>
                        Agregar Contacto
                      </Button>
                      <Button
                        onClick={() => setShowAddContact(false)}
                        variant="outline"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <div className="space-y-6">
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
                        <div className="flex items-center gap-2">
                          {method.isDefault && (
                            <Badge variant="default">Principal</Badge>
                          )}
                          <Badge variant="outline">
                            {method.type === "wire_transfer" ? "T/T" : "L/C"}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <Label className="text-xs text-gray-600">Banco</Label>
                          <p>{method.bankData.bankName}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">SWIFT</Label>
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
                        <div>
                          <Label className="text-xs text-gray-600">
                            % Anticipo
                          </Label>
                          <p className="flex items-center gap-1">
                            <Percent className="h-3 w-3" />
                            {method.advancePercentage}%
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-xs text-gray-600">
                            Términos de Pago
                          </Label>
                          <p>{method.paymentTerms}</p>
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

              {/* Standard Payment Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Condiciones Comerciales Estándar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="default-advance">
                        Porcentaje de Anticipo Estándar
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="default-advance"
                          type="number"
                          placeholder="30"
                          defaultValue="30"
                        />
                        <span className="flex items-center px-3 border rounded text-gray-500">
                          %
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="payment-method">
                        Forma de Pago Preferida
                      </Label>
                      <Select defaultValue="tt">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tt">
                            Transferencia Telegráfica (T/T)
                          </SelectItem>
                          <SelectItem value="lc">
                            Carta de Crédito (L/C)
                          </SelectItem>
                          <SelectItem value="mixed">
                            Mixto (T/T + L/C)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="payment-terms">
                      Términos de Pago Estándar
                    </Label>
                    <Textarea
                      id="payment-terms"
                      placeholder="Ejemplo: 30% T/T como anticipo, 70% contra copia de BL"
                      defaultValue="30% T/T como anticipo dentro de 7 días de la confirmación de orden, 70% T/T contra copia de Bill of Lading"
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleSavePaymentMethod}>
                    Guardar Condiciones
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Preferencias de Notificación
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
                            {key === "systemMaintenance" &&
                              "Mantenimiento del sistema"}
                            {key === "securityAlerts" && "Alertas de seguridad"}
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

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Configuración Avanzada</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            Resumen Diario por Email
                          </p>
                          <p className="text-sm text-gray-600">
                            Recibir un resumen de actividades al final del día
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            Notificaciones Fuera de Horario
                          </p>
                          <p className="text-sm text-gray-600">
                            Recibir notificaciones solo en horario comercial
                            (8AM - 6PM)
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => toast({ title: "Preferencias guardadas" })}
                  >
                    Guardar Preferencias
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Password Change */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Cambiar Contraseña
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Contraseña Actual</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPassword ? "text" : "password"}
                        value={securitySettings.currentPassword}
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            currentPassword: e.target.value,
                          }))
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="new-password">Nueva Contraseña</Label>
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      value={securitySettings.newPassword}
                      onChange={(e) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">
                      Confirmar Nueva Contraseña
                    </Label>
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      value={securitySettings.confirmPassword}
                      onChange={(e) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <Button onClick={handlePasswordChange}>
                    Cambiar Contraseña
                  </Button>
                </CardContent>
              </Card>

              {/* Two-Factor Authentication */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Autenticación en Dos Pasos (2FA)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Activar 2FA</p>
                      <p className="text-sm text-gray-600">
                        Añade una capa extra de seguridad a tu cuenta
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorEnabled}
                      onCheckedChange={handle2FAToggle}
                    />
                  </div>

                  {show2FASetup && (
                    <div className="border rounded-lg p-4 bg-blue-50">
                      <h4 className="font-medium mb-2">Configurar 2FA</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Escanea este código QR con tu aplicación de
                        autenticación (Google Authenticator, Authy, etc.)
                      </p>
                      <div className="bg-white p-4 rounded border-2 border-dashed w-48 h-48 mx-auto flex items-center justify-center mb-3">
                        <div className="text-center text-gray-500">
                          <Smartphone className="h-12 w-12 mx-auto mb-2" />
                          <p className="text-xs">Código QR</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSecuritySettings((prev) => ({
                              ...prev,
                              twoFactorEnabled: true,
                            }));
                            setShow2FASetup(false);
                            toast({
                              title: "2FA Activado",
                              description:
                                "La autenticación en dos pasos ha sido configurada.",
                            });
                          }}
                        >
                          Confirmar Configuración
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShow2FASetup(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Configuración de Seguridad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="session-timeout">
                      Tiempo de Sesión (minutos)
                    </Label>
                    <Select
                      value={securitySettings.sessionTimeout}
                      onValueChange={(value) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          sessionTimeout: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="120">2 horas</SelectItem>
                        <SelectItem value="480">8 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        Notificaciones de Inicio de Sesión
                      </p>
                      <p className="text-sm text-gray-600">
                        Recibir alertas cuando alguien acceda a tu cuenta
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.loginNotifications}
                      onCheckedChange={(value) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          loginNotifications: value,
                        }))
                      }
                    />
                  </div>
                  <Button
                    onClick={() => toast({ title: "Configuración guardada" })}
                  >
                    Guardar Configuración
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
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
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              {invoice.dueDate.toLocaleDateString()}
                            </div>
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

          {/* Account Management Tab */}
          {activeTab === "account" && (
            <div className="space-y-6">
              {/* Account Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Estado de la Cuenta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-medium">Cuenta Verificada</h4>
                      <p className="text-sm text-gray-600">
                        Verificada el 15 Ene 2024
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-medium">ZLC Activa</h4>
                      <p className="text-sm text-gray-600">Licencia vigente</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Calendar className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                      <h4 className="font-medium">Miembro desde</h4>
                      <p className="text-sm text-gray-600">Enero 2024</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserX className="h-5 w-5" />
                    Gestión de Cuenta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Temporary Deactivation */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Archive className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium">Desactivación Temporal</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Suspende temporalmente tu cuenta manteniendo todos los
                          datos. Puedes reactivarla cuando desees.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          onClick={() =>
                            toast({
                              title: "Solicitud de Desactivación",
                              description:
                                "Tu solicitud ha sido enviada para revisión.",
                            })
                          }
                        >
                          Solicitar Desactivación Temporal
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Account Deletion */}
                  <div className="border rounded-lg p-4 border-red-200 bg-red-50">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-red-900">
                          Eliminación Total
                        </h4>
                        <p className="text-sm text-red-800 mt-1">
                          Elimina permanentemente tu cuenta y todos los datos
                          asociados. Esta acción no se puede deshacer y requiere
                          verificación.
                        </p>
                        <div className="mt-3 space-y-2">
                          <p className="text-xs text-red-700">
                            • Se eliminarán todos los datos de la empresa
                          </p>
                          <p className="text-xs text-red-700">
                            • Se cancelarán todas las órdenes pendientes
                          </p>
                          <p className="text-xs text-red-700">
                            • Se notificará a todos los compradores activos
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="mt-3"
                          onClick={() =>
                            toast({
                              title: "Solicitud de Eliminación",
                              description:
                                "Tu solicitud ha sido enviada para verificación manual.",
                            })
                          }
                        >
                          Solicitar Eliminación Total
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Data Export */}
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <div className="flex items-start gap-3">
                      <Download className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-900">
                          Exportar Datos
                        </h4>
                        <p className="text-sm text-blue-800 mt-1">
                          Descarga una copia completa de todos tus datos
                          almacenados en la plataforma.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          onClick={() =>
                            toast({
                              title: "Preparando Exportación",
                              description:
                                "Te enviaremos un link de descarga por email en 24-48 horas.",
                            })
                          }
                        >
                          Solicitar Exportación de Datos
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierSettings;
