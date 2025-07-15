import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navigation } from "@/components/Navigation";
import { useOrders } from "@/contexts/OrdersContext";
import { AuthorizedContact, PaymentMethod } from "@/types";
import {
  Building,
  Edit,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Users,
  Bell,
  Download,
  FileText,
  Shield,
  Mail,
  Phone,
  MapPin,
  Globe,
  Settings,
  Briefcase,
  DollarSign,
} from "lucide-react";

export default function CompanyProfile() {
  const {
    state,
    loadCompanyProfile,
    updateCompanyProfile,
    loadAuthorizedContacts,
    addAuthorizedContact,
    updateAuthorizedContact,
    removeAuthorizedContact,
    loadPaymentMethods,
    addPaymentMethod,
    removePaymentMethod,
    loadNotificationSettings,
    updateNotificationSettings,
    exportOrderHistory,
    downloadGroupedInvoices,
  } = useOrders();

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [editingContact, setEditingContact] = useState<string | null>(null);

  const [profileForm, setProfileForm] = useState({
    legalName: "",
    taxId: "",
    phone: "",
    email: "",
    website: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    role: "buyer" as const,
    permissions: [] as string[],
  });

  const [paymentForm, setPaymentForm] = useState({
    type: "wire_transfer" as const,
    title: "",
    bankName: "",
    swift: "",
    bic: "",
    accountNumber: "",
    accountHolder: "",
    currency: "USD",
  });

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        loadCompanyProfile(),
        loadAuthorizedContacts(),
        loadPaymentMethods(),
        loadNotificationSettings(),
      ]);
      setIsLoading(false);
    };
    loadData();
  }, [
    loadCompanyProfile,
    loadAuthorizedContacts,
    loadPaymentMethods,
    loadNotificationSettings,
  ]);

  useEffect(() => {
    if (state.companyProfile) {
      setProfileForm({
        legalName: state.companyProfile.legalName,
        taxId: state.companyProfile.taxId,
        phone: state.companyProfile.contactInfo.phone,
        email: state.companyProfile.contactInfo.email,
        website: state.companyProfile.contactInfo.website || "",
        street: state.companyProfile.fiscalAddress.street,
        city: state.companyProfile.fiscalAddress.city,
        state: state.companyProfile.fiscalAddress.state,
        postalCode: state.companyProfile.fiscalAddress.postalCode,
        country: state.companyProfile.fiscalAddress.country,
      });
    }
  }, [state.companyProfile]);

  const handleSaveProfile = async () => {
    if (state.companyProfile) {
      await updateCompanyProfile({
        legalName: profileForm.legalName,
        taxId: profileForm.taxId,
        contactInfo: {
          phone: profileForm.phone,
          email: profileForm.email,
          website: profileForm.website,
        },
        fiscalAddress: {
          street: profileForm.street,
          city: profileForm.city,
          state: profileForm.state,
          postalCode: profileForm.postalCode,
          country: profileForm.country,
        },
      });
      setIsEditing(false);
    }
  };

  const handleAddContact = async () => {
    if (!contactForm.name || !contactForm.email) return;

    await addAuthorizedContact({
      companyId: state.companyProfile?.id || "",
      name: contactForm.name,
      email: contactForm.email,
      phone: contactForm.phone,
      position: contactForm.position,
      role: contactForm.role,
      permissions: contactForm.permissions,
      isActive: true,
    });

    setShowContactDialog(false);
    setContactForm({
      name: "",
      email: "",
      phone: "",
      position: "",
      role: "buyer",
      permissions: [],
    });
  };

  const handleEditContact = (contact: AuthorizedContact) => {
    setContactForm({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      position: contact.position,
      role: contact.role,
      permissions: contact.permissions,
    });
    setEditingContact(contact.id);
    setShowContactDialog(true);
  };

  const handleUpdateContact = async () => {
    if (!editingContact) return;

    await updateAuthorizedContact(editingContact, {
      name: contactForm.name,
      email: contactForm.email,
      phone: contactForm.phone,
      position: contactForm.position,
      role: contactForm.role,
      permissions: contactForm.permissions,
    });

    setShowContactDialog(false);
    setEditingContact(null);
    setContactForm({
      name: "",
      email: "",
      phone: "",
      position: "",
      role: "buyer",
      permissions: [],
    });
  };

  const handleAddPaymentMethod = async () => {
    if (!paymentForm.title || !paymentForm.bankName) return;

    await addPaymentMethod({
      companyId: state.companyProfile?.id || "",
      type: paymentForm.type,
      title: paymentForm.title,
      isDefault: state.paymentMethods.length === 0,
      bankData: {
        bankName: paymentForm.bankName,
        swift: paymentForm.swift,
        bic: paymentForm.bic,
        accountNumber: paymentForm.accountNumber,
        accountHolder: paymentForm.accountHolder,
        currency: paymentForm.currency,
      },
    });

    setShowPaymentDialog(false);
    setPaymentForm({
      type: "wire_transfer",
      title: "",
      bankName: "",
      swift: "",
      bic: "",
      accountNumber: "",
      accountHolder: "",
      currency: "USD",
    });
  };

  const handleNotificationChange = (
    type: keyof typeof state.notificationSettings,
    channel: "email" | "sms",
    value: boolean,
  ) => {
    if (state.notificationSettings) {
      const updated = {
        ...state.notificationSettings,
        [type]: {
          ...state.notificationSettings[type],
          [channel]: value,
        },
      };
      updateNotificationSettings(updated);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "buyer":
        return "Comprador";
      case "approver":
        return "Aprobador";
      case "accounting":
        return "Contabilidad";
      case "admin":
        return "Administrador";
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "buyer":
        return "bg-blue-100 text-blue-800";
      case "approver":
        return "bg-green-100 text-green-800";
      case "accounting":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 mt-20">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zlc-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Perfil de Empresa
              </h1>
              <p className="text-gray-600 mt-1">
                Gestione la información de su empresa y configuraciones
              </p>
            </div>
            <div className="flex items-center gap-2">
              {state.companyProfile?.verificationStatus === "verified" && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verificada
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-6">
              {/* Company Data */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-zlc-blue-600" />
                      Datos de la Empresa
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (isEditing) {
                          handleSaveProfile();
                        } else {
                          setIsEditing(true);
                        }
                      }}
                      className="border-2 border-zlc-gray-300 text-zlc-gray-700 hover:border-zlc-blue-500 hover:bg-zlc-blue-50 hover:text-zlc-blue-700 transition-all duration-200"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? "Guardar" : "Editar"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="legalName">Nombre Legal</Label>
                        <Input
                          id="legalName"
                          value={profileForm.legalName}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              legalName: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className={`border-2 bg-white text-zlc-gray-900 transition-all duration-200 ${
                            isEditing
                              ? "border-zlc-gray-200 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200"
                              : "border-zlc-gray-100 bg-zlc-gray-50"
                          }`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="taxId">NIT/RUC</Label>
                        <Input
                          id="taxId"
                          value={profileForm.taxId}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              taxId: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className={`border-2 bg-white text-zlc-gray-900 transition-all duration-200 ${
                            isEditing
                              ? "border-zlc-gray-200 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200"
                              : "border-zlc-gray-100 bg-zlc-gray-50"
                          }`}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          value={profileForm.phone}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className={`border-2 bg-white text-zlc-gray-900 transition-all duration-200 ${
                            isEditing
                              ? "border-zlc-gray-200 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200"
                              : "border-zlc-gray-100 bg-zlc-gray-50"
                          }`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileForm.email}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className={`border-2 bg-white text-zlc-gray-900 transition-all duration-200 ${
                            isEditing
                              ? "border-zlc-gray-200 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200"
                              : "border-zlc-gray-100 bg-zlc-gray-50"
                          }`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Sitio Web (Opcional)</Label>
                        <Input
                          id="website"
                          value={profileForm.website}
                          onChange={(e) =>
                            setProfileForm((prev) => ({
                              ...prev,
                              website: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          className={`border-2 bg-white text-zlc-gray-900 transition-all duration-200 ${
                            isEditing
                              ? "border-zlc-gray-200 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200"
                              : "border-zlc-gray-100 bg-zlc-gray-50"
                          }`}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-base font-medium">
                        Dirección Fiscal
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="md:col-span-2">
                          <Label htmlFor="street">Dirección</Label>
                          <Input
                            id="street"
                            value={profileForm.street}
                            onChange={(e) =>
                              setProfileForm((prev) => ({
                                ...prev,
                                street: e.target.value,
                              }))
                            }
                            disabled={!isEditing}
                            className={`border-2 bg-white text-zlc-gray-900 transition-all duration-200 ${
                              isEditing
                                ? "border-zlc-gray-200 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200"
                                : "border-zlc-gray-100 bg-zlc-gray-50"
                            }`}
                          />
                        </div>
                        <div>
                          <Label htmlFor="city">Ciudad</Label>
                          <Input
                            id="city"
                            value={profileForm.city}
                            onChange={(e) =>
                              setProfileForm((prev) => ({
                                ...prev,
                                city: e.target.value,
                              }))
                            }
                            disabled={!isEditing}
                            className={`border-2 bg-white text-zlc-gray-900 transition-all duration-200 ${
                              isEditing
                                ? "border-zlc-gray-200 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200"
                                : "border-zlc-gray-100 bg-zlc-gray-50"
                            }`}
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">Estado/Provincia</Label>
                          <Input
                            id="state"
                            value={profileForm.state}
                            onChange={(e) =>
                              setProfileForm((prev) => ({
                                ...prev,
                                state: e.target.value,
                              }))
                            }
                            disabled={!isEditing}
                            className={`border-2 bg-white text-zlc-gray-900 transition-all duration-200 ${
                              isEditing
                                ? "border-zlc-gray-200 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200"
                                : "border-zlc-gray-100 bg-zlc-gray-50"
                            }`}
                          />
                        </div>
                        <div>
                          <Label htmlFor="postalCode">Código Postal</Label>
                          <Input
                            id="postalCode"
                            value={profileForm.postalCode}
                            onChange={(e) =>
                              setProfileForm((prev) => ({
                                ...prev,
                                postalCode: e.target.value,
                              }))
                            }
                            disabled={!isEditing}
                            className={`border-2 bg-white text-zlc-gray-900 transition-all duration-200 ${
                              isEditing
                                ? "border-zlc-gray-200 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200"
                                : "border-zlc-gray-100 bg-zlc-gray-50"
                            }`}
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">País</Label>
                          <Input
                            id="country"
                            value={profileForm.country}
                            onChange={(e) =>
                              setProfileForm((prev) => ({
                                ...prev,
                                country: e.target.value,
                              }))
                            }
                            disabled={!isEditing}
                            className={`border-2 bg-white text-zlc-gray-900 transition-all duration-200 ${
                              isEditing
                                ? "border-zlc-gray-200 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200"
                                : "border-zlc-gray-100 bg-zlc-gray-50"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="border-2 border-zlc-gray-300 text-zlc-gray-700 hover:border-zlc-gray-500 hover:bg-zlc-gray-50 transition-all duration-200"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleSaveProfile}
                          className="bg-zlc-blue-600 hover:bg-zlc-blue-700 border-2 border-zlc-blue-600 hover:border-zlc-blue-700 shadow-md transition-all duration-200"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Guardar Cambios
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Authorized Contacts */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-zlc-blue-600" />
                      Contactos Autorizados ({state.authorizedContacts.length})
                    </CardTitle>
                    <Dialog
                      open={showContactDialog}
                      onOpenChange={setShowContactDialog}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="bg-zlc-blue-600 hover:bg-zlc-blue-700 border-2 border-zlc-blue-600 hover:border-zlc-blue-700 shadow-md transition-all duration-200"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Contacto
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white border-2 border-zlc-gray-200 shadow-lg">
                        <DialogHeader>
                          <DialogTitle>
                            {editingContact
                              ? "Editar Contacto"
                              : "Agregar Contacto Autorizado"}
                          </DialogTitle>
                          <DialogDescription>
                            Configure los datos y permisos del contacto
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="contactName">Nombre</Label>
                              <Input
                                id="contactName"
                                value={contactForm.name}
                                onChange={(e) =>
                                  setContactForm((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
                                className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
                              />
                            </div>
                            <div>
                              <Label htmlFor="contactPosition">Cargo</Label>
                              <Input
                                id="contactPosition"
                                value={contactForm.position}
                                onChange={(e) =>
                                  setContactForm((prev) => ({
                                    ...prev,
                                    position: e.target.value,
                                  }))
                                }
                                className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="contactEmail">Email</Label>
                              <Input
                                id="contactEmail"
                                type="email"
                                value={contactForm.email}
                                onChange={(e) =>
                                  setContactForm((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                  }))
                                }
                                className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
                              />
                            </div>
                            <div>
                              <Label htmlFor="contactPhone">Teléfono</Label>
                              <Input
                                id="contactPhone"
                                value={contactForm.phone}
                                onChange={(e) =>
                                  setContactForm((prev) => ({
                                    ...prev,
                                    phone: e.target.value,
                                  }))
                                }
                                className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="contactRole">Rol</Label>
                            <Select
                              value={contactForm.role}
                              onValueChange={(value) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  role: value as any,
                                }))
                              }
                            >
                              <SelectTrigger className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 rounded-lg h-11">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="buyer">Comprador</SelectItem>
                                <SelectItem value="approver">
                                  Aprobador
                                </SelectItem>
                                <SelectItem value="accounting">
                                  Contabilidad
                                </SelectItem>
                                <SelectItem value="admin">
                                  Administrador
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowContactDialog(false);
                                setEditingContact(null);
                              }}
                              className="border-2 border-zlc-gray-300 text-zlc-gray-700 hover:border-zlc-gray-500 hover:bg-zlc-gray-50 transition-all duration-200"
                            >
                              Cancelar
                            </Button>
                            <Button
                              onClick={
                                editingContact
                                  ? handleUpdateContact
                                  : handleAddContact
                              }
                              className="bg-zlc-blue-600 hover:bg-zlc-blue-700 border-2 border-zlc-blue-600 hover:border-zlc-blue-700 shadow-md transition-all duration-200"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              {editingContact ? "Actualizar" : "Agregar"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Contacto</TableHead>
                          <TableHead>Rol</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {state.authorizedContacts.map((contact) => (
                          <TableRow key={contact.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {contact.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {contact.position}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {contact.email} • {contact.phone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getRoleColor(contact.role)}>
                                {getRoleLabel(contact.role)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  contact.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }
                              >
                                {contact.isActive ? "Activo" : "Inactivo"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditContact(contact)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    removeAuthorizedContact(contact.id)
                                  }
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
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

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-zlc-blue-600" />
                      Métodos de Pago Guardados ({state.paymentMethods.length})
                    </CardTitle>
                    <Dialog
                      open={showPaymentDialog}
                      onOpenChange={setShowPaymentDialog}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="bg-zlc-blue-600 hover:bg-zlc-blue-700 border-2 border-zlc-blue-600 hover:border-zlc-blue-700 shadow-md transition-all duration-200"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Método
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl bg-white border-2 border-zlc-gray-200 shadow-lg">
                        <DialogHeader>
                          <DialogTitle>Agregar Método de Pago</DialogTitle>
                          <DialogDescription>
                            Configure un nuevo método de pago para sus
                            transacciones
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="paymentType">Tipo</Label>
                              <Select
                                value={paymentForm.type}
                                onValueChange={(value) =>
                                  setPaymentForm((prev) => ({
                                    ...prev,
                                    type: value as any,
                                  }))
                                }
                              >
                                <SelectTrigger className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 rounded-lg h-11">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="wire_transfer">
                                    Transferencia Bancaria
                                  </SelectItem>
                                  <SelectItem value="letter_of_credit">
                                    Carta de Crédito
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="paymentTitle">
                                Título/Descripción
                              </Label>
                              <Input
                                id="paymentTitle"
                                value={paymentForm.title}
                                onChange={(e) =>
                                  setPaymentForm((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                  }))
                                }
                                placeholder="Ej: Cuenta USD Principal"
                                className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
                              />
                            </div>
                          </div>

                          {paymentForm.type === "wire_transfer" && (
                            <>
                              <Separator />
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="bankName">
                                      Nombre del Banco
                                    </Label>
                                    <Input
                                      id="bankName"
                                      value={paymentForm.bankName}
                                      onChange={(e) =>
                                        setPaymentForm((prev) => ({
                                          ...prev,
                                          bankName: e.target.value,
                                        }))
                                      }
                                      className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="currency">Moneda</Label>
                                    <Select
                                      value={paymentForm.currency}
                                      onValueChange={(value) =>
                                        setPaymentForm((prev) => ({
                                          ...prev,
                                          currency: value,
                                        }))
                                      }
                                    >
                                      <SelectTrigger className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 rounded-lg h-11">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                        <SelectItem value="CRC">CRC</SelectItem>
                                        <SelectItem value="PAB">PAB</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="swift">Código SWIFT</Label>
                                    <Input
                                      id="swift"
                                      value={paymentForm.swift}
                                      onChange={(e) =>
                                        setPaymentForm((prev) => ({
                                          ...prev,
                                          swift: e.target.value,
                                        }))
                                      }
                                      className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="bic">Código BIC</Label>
                                    <Input
                                      id="bic"
                                      value={paymentForm.bic}
                                      onChange={(e) =>
                                        setPaymentForm((prev) => ({
                                          ...prev,
                                          bic: e.target.value,
                                        }))
                                      }
                                      className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="accountNumber">
                                    Número de Cuenta
                                  </Label>
                                  <Input
                                    id="accountNumber"
                                    value={paymentForm.accountNumber}
                                    onChange={(e) =>
                                      setPaymentForm((prev) => ({
                                        ...prev,
                                        accountNumber: e.target.value,
                                      }))
                                    }
                                    className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="accountHolder">
                                    Titular de la Cuenta
                                  </Label>
                                  <Input
                                    id="accountHolder"
                                    value={paymentForm.accountHolder}
                                    onChange={(e) =>
                                      setPaymentForm((prev) => ({
                                        ...prev,
                                        accountHolder: e.target.value,
                                      }))
                                    }
                                    className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
                                  />
                                </div>
                              </div>
                            </>
                          )}

                          <div className="flex justify-end gap-3">
                            <Button
                              variant="outline"
                              onClick={() => setShowPaymentDialog(false)}
                              className="border-2 border-zlc-gray-300 text-zlc-gray-700 hover:border-zlc-gray-500 hover:bg-zlc-gray-50 transition-all duration-200"
                            >
                              Cancelar
                            </Button>
                            <Button
                              onClick={handleAddPaymentMethod}
                              className="bg-zlc-blue-600 hover:bg-zlc-blue-700 border-2 border-zlc-blue-600 hover:border-zlc-blue-700 shadow-md transition-all duration-200"
                            >
                              <CreditCard className="h-4 w-4 mr-2" />
                              Agregar Método
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {state.paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {method.title}
                              </span>
                              {method.isDefault && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-zlc-blue-50 text-zlc-blue-700"
                                >
                                  Predeterminado
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              {method.type === "wire_transfer"
                                ? "Transferencia Bancaria"
                                : "Carta de Crédito"}
                              {method.bankData && (
                                <>
                                  {" • "}
                                  {method.bankData.bankName} •{" "}
                                  {method.bankData.currency}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePaymentMethod(method.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {state.paymentMethods.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>No hay métodos de pago configurados</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Configuración de Notificaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {state.notificationSettings && (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">
                          Producción Completada
                        </Label>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">Email</span>
                          </div>
                          <Switch
                            checked={
                              state.notificationSettings.productionCompleted
                                .email
                            }
                            onCheckedChange={(checked) =>
                              handleNotificationChange(
                                "productionCompleted",
                                "email",
                                checked,
                              )
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">SMS</span>
                          </div>
                          <Switch
                            checked={
                              state.notificationSettings.productionCompleted.sms
                            }
                            onCheckedChange={(checked) =>
                              handleNotificationChange(
                                "productionCompleted",
                                "sms",
                                checked,
                              )
                            }
                          />
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <Label className="text-sm font-medium">
                          Zarpe de Contenedor
                        </Label>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">Email</span>
                          </div>
                          <Switch
                            checked={
                              state.notificationSettings.shipmentDeparted.email
                            }
                            onCheckedChange={(checked) =>
                              handleNotificationChange(
                                "shipmentDeparted",
                                "email",
                                checked,
                              )
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">SMS</span>
                          </div>
                          <Switch
                            checked={
                              state.notificationSettings.shipmentDeparted.sms
                            }
                            onCheckedChange={(checked) =>
                              handleNotificationChange(
                                "shipmentDeparted",
                                "sms",
                                checked,
                              )
                            }
                          />
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <Label className="text-sm font-medium">
                          Llegada a Puerto
                        </Label>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">Email</span>
                          </div>
                          <Switch
                            checked={
                              state.notificationSettings.portArrival.email
                            }
                            onCheckedChange={(checked) =>
                              handleNotificationChange(
                                "portArrival",
                                "email",
                                checked,
                              )
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">SMS</span>
                          </div>
                          <Switch
                            checked={state.notificationSettings.portArrival.sms}
                            onCheckedChange={(checked) =>
                              handleNotificationChange(
                                "portArrival",
                                "sms",
                                checked,
                              )
                            }
                          />
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <Label className="text-sm font-medium">
                          Pendiente de Pago
                        </Label>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">Email</span>
                          </div>
                          <Switch
                            checked={
                              state.notificationSettings.paymentPending.email
                            }
                            onCheckedChange={(checked) =>
                              handleNotificationChange(
                                "paymentPending",
                                "email",
                                checked,
                              )
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">SMS</span>
                          </div>
                          <Switch
                            checked={
                              state.notificationSettings.paymentPending.sms
                            }
                            onCheckedChange={(checked) =>
                              handleNotificationChange(
                                "paymentPending",
                                "sms",
                                checked,
                              )
                            }
                          />
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <Label className="text-sm font-medium">
                          Incidencia Abierta
                        </Label>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">Email</span>
                          </div>
                          <Switch
                            checked={
                              state.notificationSettings.incidentOpened.email
                            }
                            onCheckedChange={(checked) =>
                              handleNotificationChange(
                                "incidentOpened",
                                "email",
                                checked,
                              )
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">SMS</span>
                          </div>
                          <Switch
                            checked={
                              state.notificationSettings.incidentOpened.sms
                            }
                            onCheckedChange={(checked) =>
                              handleNotificationChange(
                                "incidentOpened",
                                "sms",
                                checked,
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Reports and Downloads */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Reportes y Descargas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-2 border-zlc-gray-200 text-zlc-gray-700 hover:border-zlc-blue-300 hover:bg-zlc-blue-50 hover:text-zlc-blue-700 transition-all duration-200"
                      onClick={() => exportOrderHistory("csv")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Historial de Pedidos (CSV)
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-2 border-zlc-gray-200 text-zlc-gray-700 hover:border-zlc-blue-300 hover:bg-zlc-blue-50 hover:text-zlc-blue-700 transition-all duration-200"
                      onClick={() => exportOrderHistory("xlsx")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Historial de Pedidos (Excel)
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-2 border-zlc-gray-200 text-zlc-gray-700 hover:border-zlc-blue-300 hover:bg-zlc-blue-50 hover:text-zlc-blue-700 transition-all duration-200"
                      onClick={downloadGroupedInvoices}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Facturas Agrupadas (ZIP)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Company Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Estado de Verificación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Estado:</span>
                      <Badge
                        className={
                          state.companyProfile?.verificationStatus ===
                          "verified"
                            ? "bg-green-100 text-green-800"
                            : state.companyProfile?.verificationStatus ===
                                "pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {state.companyProfile?.verificationStatus ===
                          "verified" && "Verificada"}
                        {state.companyProfile?.verificationStatus ===
                          "pending" && "Pendiente"}
                        {state.companyProfile?.verificationStatus ===
                          "rejected" && "Rechazada"}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {state.companyProfile?.verificationStatus ===
                        "verified" &&
                        "Su empresa ha sido verificada exitosamente."}
                      {state.companyProfile?.verificationStatus === "pending" &&
                        "Su verificación está siendo procesada."}
                      {state.companyProfile?.verificationStatus ===
                        "rejected" &&
                        "Su verificación fue rechazada. Contacte soporte."}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
