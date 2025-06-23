import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Navigation } from "@/components/Navigation";
import { useB2B } from "@/contexts/B2BContext";
import {
  FileText,
  Download,
  Upload,
  Eye,
  FileCheck,
  Shield,
  Building,
  Globe,
  Calendar,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

export default function ContractTemplates() {
  const { state, loadContractTemplates, generateContract } = useB2B();
  const [isLoading, setIsLoading] = useState(true);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    language: "",
    searchTerm: "",
  });
  const [generateForm, setGenerateForm] = useState({
    templateId: "",
    buyerCompany: "",
    supplierCompany: "",
    orderAmount: "",
    currency: "USD",
    incoterm: "FOB",
    deliveryDate: "",
    paymentTerms: "",
    specialConditions: "",
  });
  const [uploadForm, setUploadForm] = useState({
    documentType: "",
    description: "",
    expiryDate: "",
    file: null as File | null,
  });

  useEffect(() => {
    const initializeData = async () => {
      await loadContractTemplates();
      setIsLoading(false);
    };
    initializeData();
  }, [loadContractTemplates]);

  const filteredTemplates = state.contractTemplates.filter((template) => {
    const matchesType = !filters.type || template.type === filters.type;
    const matchesLanguage =
      !filters.language || template.language === filters.language;
    const matchesSearch =
      !filters.searchTerm ||
      template.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      template.description
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());

    return matchesType && matchesLanguage && matchesSearch;
  });

  const handleGenerateContract = async () => {
    if (!generateForm.templateId || !generateForm.buyerCompany) return;

    const contractId = await generateContract(generateForm.templateId, {
      buyerCompanyId: "company-1", // From auth context
      supplierCompanyId: "supplier-1",
      variables: {
        buyerCompany: generateForm.buyerCompany,
        supplierCompany: generateForm.supplierCompany,
        orderAmount: generateForm.orderAmount,
        currency: generateForm.currency,
        incoterm: generateForm.incoterm,
        deliveryDate: generateForm.deliveryDate,
        paymentTerms: generateForm.paymentTerms,
        specialConditions: generateForm.specialConditions,
        generationDate: new Date().toISOString(),
      },
    });

    setShowGenerateDialog(false);
    console.log("Contract generated:", contractId);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadForm((prev) => ({ ...prev, file }));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sales_contract":
        return <FileText className="h-5 w-5 text-blue-600" />;
      case "purchase_agreement":
        return <Building className="h-5 w-5 text-green-600" />;
      case "service_contract":
        return <Shield className="h-5 w-5 text-purple-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "sales_contract":
        return "Contrato de Compraventa";
      case "purchase_agreement":
        return "Acuerdo de Compra";
      case "service_contract":
        return "Contrato de Servicios";
      default:
        return "Otro";
    }
  };

  const getLanguageFlag = (language: string) => {
    switch (language) {
      case "es":
        return "🇪🇸";
      case "en":
        return "🇺🇸";
      case "pt":
        return "🇧🇷";
      default:
        return "🌍";
    }
  };

  const getLanguageLabel = (language: string) => {
    switch (language) {
      case "es":
        return "Español";
      case "en":
        return "English";
      case "pt":
        return "Português";
      default:
        return "Otro";
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Contratos y Plantillas Legales
              </h1>
              <p className="text-gray-600 mt-1">
                Gestione plantillas de contratos y genere documentos legales
              </p>
            </div>
            <div className="flex gap-3">
              <Dialog
                open={showUploadDialog}
                onOpenChange={setShowUploadDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Documento
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Subir Documento Legal</DialogTitle>
                    <DialogDescription>
                      Suba certificados, permisos o documentos requeridos para
                      contratos
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="documentType">Tipo de Documento</Label>
                      <Select
                        value={uploadForm.documentType}
                        onValueChange={(value) =>
                          setUploadForm((prev) => ({
                            ...prev,
                            documentType: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="legal_existence">
                            Certificado de Existencia
                          </SelectItem>
                          <SelectItem value="insurance_policy">
                            Póliza de Seguro
                          </SelectItem>
                          <SelectItem value="import_permit">
                            Permiso de Importación
                          </SelectItem>
                          <SelectItem value="power_of_attorney">
                            Poder Legal
                          </SelectItem>
                          <SelectItem value="other">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="description">Descripción</Label>
                      <Input
                        id="description"
                        value={uploadForm.description}
                        onChange={(e) =>
                          setUploadForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Describa el documento..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiryDate">
                        Fecha de Vencimiento (Opcional)
                      </Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        value={uploadForm.expiryDate}
                        onChange={(e) =>
                          setUploadForm((prev) => ({
                            ...prev,
                            expiryDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="file">Archivo</Label>
                      <input
                        id="file"
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowUploadDialog(false)}
                      >
                        Cancelar
                      </Button>
                      <Button>Subir Documento</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog
                open={showGenerateDialog}
                onOpenChange={setShowGenerateDialog}
              >
                <DialogTrigger asChild>
                  <Button className="bg-zlc-blue-600 hover:bg-zlc-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Generar Contrato
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Generar Contrato</DialogTitle>
                    <DialogDescription>
                      Complete los datos para generar un contrato basado en
                      plantilla
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="templateSelect">Plantilla</Label>
                      <Select
                        value={generateForm.templateId}
                        onValueChange={(value) =>
                          setGenerateForm((prev) => ({
                            ...prev,
                            templateId: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione plantilla" />
                        </SelectTrigger>
                        <SelectContent>
                          {state.contractTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="buyerCompany">Empresa Compradora</Label>
                        <Input
                          id="buyerCompany"
                          value={generateForm.buyerCompany}
                          onChange={(e) =>
                            setGenerateForm((prev) => ({
                              ...prev,
                              buyerCompany: e.target.value,
                            }))
                          }
                          placeholder="Nombre de la empresa"
                        />
                      </div>
                      <div>
                        <Label htmlFor="supplierCompany">
                          Empresa Proveedora
                        </Label>
                        <Input
                          id="supplierCompany"
                          value={generateForm.supplierCompany}
                          onChange={(e) =>
                            setGenerateForm((prev) => ({
                              ...prev,
                              supplierCompany: e.target.value,
                            }))
                          }
                          placeholder="Nombre del proveedor"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="orderAmount">Monto del Pedido</Label>
                        <Input
                          id="orderAmount"
                          type="number"
                          value={generateForm.orderAmount}
                          onChange={(e) =>
                            setGenerateForm((prev) => ({
                              ...prev,
                              orderAmount: e.target.value,
                            }))
                          }
                          placeholder="50000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="currency">Moneda</Label>
                        <Select
                          value={generateForm.currency}
                          onValueChange={(value) =>
                            setGenerateForm((prev) => ({
                              ...prev,
                              currency: value,
                            }))
                          }
                        >
                          <SelectTrigger>
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
                      <div>
                        <Label htmlFor="incoterm">Incoterm</Label>
                        <Select
                          value={generateForm.incoterm}
                          onValueChange={(value) =>
                            setGenerateForm((prev) => ({
                              ...prev,
                              incoterm: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FOB">FOB</SelectItem>
                            <SelectItem value="CIF">CIF</SelectItem>
                            <SelectItem value="CFR">CFR</SelectItem>
                            <SelectItem value="EXW">EXW</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="deliveryDate">Fecha de Entrega</Label>
                        <Input
                          id="deliveryDate"
                          type="date"
                          value={generateForm.deliveryDate}
                          onChange={(e) =>
                            setGenerateForm((prev) => ({
                              ...prev,
                              deliveryDate: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="paymentTerms">Términos de Pago</Label>
                        <Input
                          id="paymentTerms"
                          value={generateForm.paymentTerms}
                          onChange={(e) =>
                            setGenerateForm((prev) => ({
                              ...prev,
                              paymentTerms: e.target.value,
                            }))
                          }
                          placeholder="30% T/T + 70% contra B/L"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="specialConditions">
                        Condiciones Especiales (Opcional)
                      </Label>
                      <textarea
                        id="specialConditions"
                        value={generateForm.specialConditions}
                        onChange={(e) =>
                          setGenerateForm((prev) => ({
                            ...prev,
                            specialConditions: e.target.value,
                          }))
                        }
                        placeholder="Condiciones especiales del contrato..."
                        className="w-full p-2 border rounded-md"
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowGenerateDialog(false)}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleGenerateContract}>
                        Generar Contrato
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="search">Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Título o descripción..."
                      value={filters.searchTerm}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          searchTerm: e.target.value,
                        }))
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="typeFilter">Tipo de Contrato</Label>
                  <Select
                    value={filters.type}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        type: value === "all" ? "" : value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <SelectItem value="sales_contract">
                        Contrato de Compraventa
                      </SelectItem>
                      <SelectItem value="purchase_agreement">
                        Acuerdo de Compra
                      </SelectItem>
                      <SelectItem value="service_contract">
                        Contrato de Servicios
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="languageFilter">Idioma</Label>
                  <Select
                    value={filters.language}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        language: value === "all" ? "" : value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los idiomas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los idiomas</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(template.type)}
                      <div>
                        <CardTitle className="text-lg">
                          {template.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {getTypeLabel(template.type)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {getLanguageFlag(template.language)}
                      </span>
                      <Badge
                        className={
                          template.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {template.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {template.description}
                  </p>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-gray-600">
                        Incoterms soportados:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.incotermSupport.map((incoterm) => (
                          <Badge
                            key={incoterm}
                            variant="outline"
                            className="text-xs"
                          >
                            {incoterm}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Jurisdicción:</span>
                      <span className="ml-1 font-medium">
                        {template.jurisdiction}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Versión:</span>
                      <span className="ml-1 font-medium">
                        {template.version}
                      </span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Vista Previa
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Legal Requirements Alert */}
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Requisitos Legales:</strong>
              <br />
              • Certificado de existencia y representación legal vigente •
              Póliza de seguro de crédito exportador (si aplica) • Permisos de
              importación específicos según país de destino
              <br />
              <Button
                variant="link"
                className="p-0 h-auto mt-2 text-zlc-blue-600"
              >
                Ver lista completa de documentos requeridos →
              </Button>
            </AlertDescription>
          </Alert>

          {/* Recent Contracts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Contratos Generados Recientemente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {state.generatedContracts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No hay contratos generados</p>
                  <p className="text-sm">
                    Los contratos generados aparecerán aquí
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {state.generatedContracts.slice(0, 5).map((contract) => (
                    <div
                      key={contract.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">
                            Contrato #{contract.contractNumber}
                          </p>
                          <p className="text-sm text-gray-600">
                            Generado el{" "}
                            {new Date(contract.createdAt).toLocaleDateString(
                              "es-ES",
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            contract.status === "signed"
                              ? "bg-green-100 text-green-800"
                              : contract.status === "pending_signatures"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {contract.status === "draft" && "Borrador"}
                          {contract.status === "pending_signatures" &&
                            "Pendiente de Firmas"}
                          {contract.status === "signed" && "Firmado"}
                          {contract.status === "executed" && "Ejecutado"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
