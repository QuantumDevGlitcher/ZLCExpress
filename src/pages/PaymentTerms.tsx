import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/Navigation";
import { useB2B } from "@/contexts/B2BContext";
import {
  CreditCard,
  Upload,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Clock,
  Building,
  Shield,
  Plus,
  Download,
  Info,
} from "lucide-react";

export default function PaymentTerms() {
  const { state, loadPaymentTerms, loadCreditLines, requestCreditIncrease } =
    useB2B();

  const [isLoading, setIsLoading] = useState(true);
  const [showCreditRequestDialog, setShowCreditRequestDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [creditRequestForm, setCreditRequestForm] = useState({
    requestedAmount: "",
    justification: "",
    expectedMonthlyVolume: "",
    businessPlan: "",
  });
  const [uploadForm, setUploadForm] = useState({
    documentType: "",
    description: "",
    file: null as File | null,
  });

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([loadPaymentTerms(), loadCreditLines()]);
      setIsLoading(false);
    };
    initializeData();
  }, [loadPaymentTerms, loadCreditLines]);

  const handleCreditRequest = async () => {
    if (!creditRequestForm.requestedAmount || !creditRequestForm.justification)
      return;

    await requestCreditIncrease(
      parseFloat(creditRequestForm.requestedAmount),
      creditRequestForm.justification,
    );

    setShowCreditRequestDialog(false);
    setCreditRequestForm({
      requestedAmount: "",
      justification: "",
      expectedMonthlyVolume: "",
      businessPlan: "",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadForm((prev) => ({ ...prev, file }));
    }
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "tt":
        return <CreditCard className="h-5 w-5 text-blue-600" />;
      case "lc":
        return <Shield className="h-5 w-5 text-green-600" />;
      case "credit":
        return <Calendar className="h-5 w-5 text-purple-600" />;
      default:
        return <DollarSign className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPaymentMethodLabel = (type: string) => {
    switch (type) {
      case "tt":
        return "Transferencia Bancaria (T/T)";
      case "lc":
        return "Carta de Crédito (LC)";
      case "credit":
        return "Términos de Crédito";
      default:
        return "Otro";
    }
  };

  const creditLine = state.creditLines[0]; // Assuming one credit line per company
  const creditUtilization = creditLine
    ? (creditLine.usedLimit / creditLine.totalLimit) * 100
    : 0;

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
                Condiciones de Pago y Crédito
              </h1>
              <p className="text-gray-600 mt-1">
                Gestione sus métodos de pago y líneas de crédito disponibles
              </p>
            </div>
            <div className="flex gap-3">
              <Dialog
                open={showUploadDialog}
                onOpenChange={setShowUploadDialog}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-2 border-zlc-gray-300 text-zlc-gray-700 hover:border-zlc-blue-500 hover:bg-zlc-blue-50 hover:text-zlc-blue-700 transition-all duration-200"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Documento
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white border-2 border-zlc-gray-200 shadow-lg">
                  <DialogHeader>
                    <DialogTitle>Subir Documento de Pago</DialogTitle>
                    <DialogDescription>
                      Suba comprobantes de transferencia, documentos LC u otros
                      relacionados con pagos
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="documentType">Tipo de Documento</Label>
                      <select
                        id="documentType"
                        value={uploadForm.documentType}
                        onChange={(e) =>
                          setUploadForm((prev) => ({
                            ...prev,
                            documentType: e.target.value,
                          }))
                        }
                        className="w-full p-3 border-2 border-zlc-gray-200 rounded-lg bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200"
                      >
                        <option value="">Seleccione tipo</option>
                        <option value="tt_receipt">
                          Comprobante de Transferencia
                        </option>
                        <option value="lc_document">Documento LC</option>
                        <option value="credit_application">
                          Solicitud de Crédito
                        </option>
                        <option value="financial_statement">
                          Estado Financiero
                        </option>
                        <option value="other">Otro</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={uploadForm.description}
                        onChange={(e) =>
                          setUploadForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Describa el documento..."
                        className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg p-3"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="file">Archivo</Label>
                      <input
                        id="file"
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        className="w-full p-3 border-2 border-zlc-gray-200 rounded-lg bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-zlc-blue-50 file:text-zlc-blue-700 hover:file:bg-zlc-blue-100"
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowUploadDialog(false)}
                        className="border-2 border-zlc-gray-300 text-zlc-gray-700 hover:border-zlc-gray-500 hover:bg-zlc-gray-50 transition-all duration-200"
                      >
                        Cancelar
                      </Button>
                      <Button className="bg-zlc-blue-600 hover:bg-zlc-blue-700 border-2 border-zlc-blue-600 hover:border-zlc-blue-700 shadow-md transition-all duration-200">
                        <Upload className="h-4 w-4 mr-2" />
                        Subir Documento
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog
                open={showCreditRequestDialog}
                onOpenChange={setShowCreditRequestDialog}
              >
                <DialogTrigger asChild>
                  <Button className="bg-zlc-blue-600 hover:bg-zlc-blue-700 border-2 border-zlc-blue-600 hover:border-zlc-blue-700 shadow-md transition-all duration-200">
                    <Plus className="h-4 w-4 mr-2" />
                    Solicitar Crédito
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-white border-2 border-zlc-gray-200 shadow-lg">
                  <DialogHeader>
                    <DialogTitle>
                      Solicitar Aumento de Línea de Crédito
                    </DialogTitle>
                    <DialogDescription>
                      Complete la información requerida para evaluar su
                      solicitud de crédito
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="requestedAmount">
                          Monto Solicitado (USD)
                        </Label>
                        <Input
                          id="requestedAmount"
                          type="number"
                          value={creditRequestForm.requestedAmount}
                          onChange={(e) =>
                            setCreditRequestForm((prev) => ({
                              ...prev,
                              requestedAmount: e.target.value,
                            }))
                          }
                          placeholder="50000"
                          className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
                        />
                      </div>
                      <div>
                        <Label htmlFor="expectedMonthlyVolume">
                          Volumen Mensual Esperado (USD)
                        </Label>
                        <Input
                          id="expectedMonthlyVolume"
                          type="number"
                          value={creditRequestForm.expectedMonthlyVolume}
                          onChange={(e) =>
                            setCreditRequestForm((prev) => ({
                              ...prev,
                              expectedMonthlyVolume: e.target.value,
                            }))
                          }
                          placeholder="25000"
                          className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="justification">
                        Justificación de la Solicitud
                      </Label>
                      <Textarea
                        id="justification"
                        value={creditRequestForm.justification}
                        onChange={(e) =>
                          setCreditRequestForm((prev) => ({
                            ...prev,
                            justification: e.target.value,
                          }))
                        }
                        placeholder="Explique por qué necesita el aumento de crédito..."
                        rows={3}
                        className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg p-3"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessPlan">
                        Plan de Negocios (Opcional)
                      </Label>
                      <Textarea
                        id="businessPlan"
                        value={creditRequestForm.businessPlan}
                        onChange={(e) =>
                          setCreditRequestForm((prev) => ({
                            ...prev,
                            businessPlan: e.target.value,
                          }))
                        }
                        placeholder="Describa su plan de expansión o crecimiento..."
                        rows={3}
                        className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg p-3"
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowCreditRequestDialog(false)}
                        className="border-2 border-zlc-gray-300 text-zlc-gray-700 hover:border-zlc-gray-500 hover:bg-zlc-gray-50 transition-all duration-200"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleCreditRequest}
                        className="bg-zlc-blue-600 hover:bg-zlc-blue-700 border-2 border-zlc-blue-600 hover:border-zlc-blue-700 shadow-md transition-all duration-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Enviar Solicitud
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-6">
              {/* Payment Terms */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-zlc-blue-600" />
                    Métodos de Pago Disponibles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {state.paymentTerms.map((term) => (
                      <div
                        key={term.id}
                        className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-start gap-3">
                          {getPaymentMethodIcon(term.type)}
                          <div className="flex-1">
                            <h4 className="font-medium">
                              {getPaymentMethodLabel(term.type)}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {term.description}
                            </p>

                            {term.type === "tt" && term.advancePercentage && (
                              <div className="mt-2 text-sm">
                                <Badge variant="outline" className="mr-2">
                                  {term.advancePercentage}% Anticipo
                                </Badge>
                                <span className="text-gray-600">
                                  {term.balanceTerms}
                                </span>
                              </div>
                            )}

                            {term.type === "credit" && term.creditDays && (
                              <div className="mt-2">
                                <Badge className="bg-purple-100 text-purple-800">
                                  Net {term.creditDays} días
                                </Badge>
                              </div>
                            )}

                            {term.type === "lc" && term.lcRequirements && (
                              <div className="mt-2 space-y-1 text-sm">
                                <div>
                                  <span className="text-gray-600">
                                    Monto mín/máx:
                                  </span>{" "}
                                  {formatCurrency(
                                    term.lcRequirements.minAmount,
                                  )}{" "}
                                  -{" "}
                                  {formatCurrency(
                                    term.lcRequirements.maxAmount,
                                  )}
                                </div>
                                <div>
                                  <span className="text-gray-600">
                                    Documentos requeridos:
                                  </span>{" "}
                                  {term.lcRequirements.requiredDocuments.join(
                                    ", ",
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {term.isActive ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Disponible
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">
                              No disponible
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Credit History */}
              {creditLine && creditLine.creditHistory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-zlc-blue-600" />
                      Historial de Crédito
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {creditLine.creditHistory
                        .slice(0, 5)
                        .map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {transaction.type === "credit_used" && (
                                <TrendingUp className="h-4 w-4 text-red-600" />
                              )}
                              {transaction.type === "payment_received" && (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                              {transaction.type === "credit_adjustment" && (
                                <AlertCircle className="h-4 w-4 text-blue-600" />
                              )}
                              <div>
                                <p className="font-medium">
                                  {transaction.description}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {formatDate(transaction.transactionDate)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p
                                className={`font-medium ${
                                  transaction.type === "credit_used"
                                    ? "text-red-600"
                                    : "text-green-600"
                                }`}
                              >
                                {transaction.type === "credit_used" ? "-" : "+"}
                                {formatCurrency(
                                  transaction.amount,
                                  creditLine.currency,
                                )}
                              </p>
                              <p className="text-sm text-gray-600">
                                Balance:{" "}
                                {formatCurrency(
                                  transaction.balanceAfter,
                                  creditLine.currency,
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Document Templates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-zlc-blue-600" />
                    Plantillas y Documentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto p-4 justify-start border-2 border-zlc-gray-200 hover:border-zlc-blue-300 hover:bg-zlc-blue-50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <Download className="h-5 w-5 text-blue-600" />
                        <div className="text-left">
                          <p className="font-medium">
                            Plantilla de Transferencia T/T
                          </p>
                          <p className="text-sm text-gray-600">
                            Formato estándar para transferencias
                          </p>
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto p-4 justify-start border-2 border-zlc-gray-200 hover:border-zlc-blue-300 hover:bg-zlc-blue-50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <Download className="h-5 w-5 text-green-600" />
                        <div className="text-left">
                          <p className="font-medium">
                            Formato Carta de Crédito
                          </p>
                          <p className="text-sm text-gray-600">
                            Plantilla LC para bancos
                          </p>
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto p-4 justify-start border-2 border-zlc-gray-200 hover:border-zlc-blue-300 hover:bg-zlc-blue-50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <Download className="h-5 w-5 text-purple-600" />
                        <div className="text-left">
                          <p className="font-medium">
                            Solicitud de Línea de Crédito
                          </p>
                          <p className="text-sm text-gray-600">
                            Formato para solicitud de crédito
                          </p>
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto p-4 justify-start border-2 border-zlc-gray-200 hover:border-zlc-blue-300 hover:bg-zlc-blue-50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <Download className="h-5 w-5 text-orange-600" />
                        <div className="text-left">
                          <p className="font-medium">Términos y Condiciones</p>
                          <p className="text-sm text-gray-600">
                            T&C de pagos y crédito
                          </p>
                        </div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Credit Line Summary */}
              {creditLine && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Línea de Crédito Asignada
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Crédito Total</p>
                        <p className="text-2xl font-bold text-zlc-blue-600">
                          {formatCurrency(
                            creditLine.totalLimit,
                            creditLine.currency,
                          )}
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">
                            Utilización de Crédito
                          </span>
                          <span className="text-sm text-gray-600">
                            {creditUtilization.toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={creditUtilization}
                          className={`h-3 ${
                            creditUtilization > 80
                              ? "bg-red-100"
                              : creditUtilization > 60
                                ? "bg-amber-100"
                                : "bg-green-100"
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Disponible:</span>
                          <p className="font-bold text-green-600">
                            {formatCurrency(
                              creditLine.availableLimit,
                              creditLine.currency,
                            )}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Utilizado:</span>
                          <p className="font-bold text-amber-600">
                            {formatCurrency(
                              creditLine.usedLimit,
                              creditLine.currency,
                            )}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Estado:</span>
                          <Badge
                            className={
                              creditLine.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-amber-100 text-amber-800"
                            }
                          >
                            {creditLine.status === "active"
                              ? "Activa"
                              : "Suspendida"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Aprobada:</span>
                          <span className="font-medium">
                            {formatDate(creditLine.approvedDate)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vence:</span>
                          <span className="font-medium">
                            {formatDate(creditLine.expiryDate)}
                          </span>
                        </div>
                        {creditLine.interestRate && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tasa:</span>
                            <span className="font-medium">
                              {creditLine.interestRate}% anual
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Status Alert */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Métodos de Pago Recomendados:</strong>
                  <br />• <strong>T/T:</strong> Para pedidos pequeños y medianos
                  <br />• <strong>LC:</strong> Para pedidos grandes (+$50K)
                  <br />• <strong>Crédito:</strong> Para clientes verificados
                </AlertDescription>
              </Alert>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-2 border-zlc-gray-200 text-zlc-gray-700 hover:border-zlc-blue-300 hover:bg-zlc-blue-50 hover:text-zlc-blue-700 transition-all duration-200"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Comprobante T/T
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-2 border-zlc-gray-200 text-zlc-gray-700 hover:border-zlc-blue-300 hover:bg-zlc-blue-50 hover:text-zlc-blue-700 transition-all duration-200"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generar Solicitud LC
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-2 border-zlc-gray-200 text-zlc-gray-700 hover:border-zlc-blue-300 hover:bg-zlc-blue-50 hover:text-zlc-blue-700 transition-all duration-200"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Consultar Estado de Crédito
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Alert>
                <Building className="h-4 w-4" />
                <AlertDescription>
                  <strong>¿Necesita ayuda con pagos?</strong>
                  <br />
                  Nuestro equipo financiero puede asistirle con configuración de
                  métodos de pago y gestión de crédito.
                  <br />
                  <Button
                    variant="link"
                    className="p-0 h-auto mt-2 text-zlc-blue-600"
                  >
                    Contactar Asesor Financiero →
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
