import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { StockAlert, StockAlertTrigger } from "@/types";
import {
  Bell,
  BellRing,
  Package,
  AlertTriangle,
  TrendingDown,
  Search,
  Plus,
  Settings,
  Trash2,
  Clock,
  Mail,
  Smartphone,
  Monitor,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface StockAlertManagerProps {
  alerts: StockAlert[];
  triggers: StockAlertTrigger[];
  onCreateAlert: (alertData: Partial<StockAlert>) => void;
  onUpdateAlert: (alertId: string, alertData: Partial<StockAlert>) => void;
  onDeleteAlert: (alertId: string) => void;
  onTestAlert: (alertId: string) => void;
}

export function StockAlertManager({
  alerts,
  triggers,
  onCreateAlert,
  onUpdateAlert,
  onDeleteAlert,
  onTestAlert,
}: StockAlertManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    alertType: "back_in_stock" as StockAlert["alertType"],
    minQuantity: "",
    maxPrice: "",
    specifications: "",
    region: "",
    notificationMethod: ["platform"] as ("email" | "platform" | "sms")[],
  });

  const getAlertTypeIcon = (type: StockAlert["alertType"]) => {
    switch (type) {
      case "back_in_stock":
        return <Package className="h-4 w-4 text-green-500" />;
      case "low_stock":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "similar_product":
        return <Search className="h-4 w-4 text-blue-500" />;
      case "price_drop":
        return <TrendingDown className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAlertTypeLabel = (type: StockAlert["alertType"]) => {
    switch (type) {
      case "back_in_stock":
        return "Producto Disponible";
      case "low_stock":
        return "Stock Bajo";
      case "similar_product":
        return "Producto Similar";
      case "price_drop":
        return "Bajada de Precio";
      default:
        return "Alerta";
    }
  };

  const getNotificationMethodIcon = (method: string) => {
    switch (method) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "platform":
        return <Monitor className="h-4 w-4" />;
      case "sms":
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const handleCreateAlert = () => {
    const alertData: Partial<StockAlert> = {
      productId: formData.productId || `product_${Date.now()}`,
      productName: formData.productName,
      alertType: formData.alertType,
      isActive: true,
      criteria: {
        minQuantity: formData.minQuantity
          ? parseInt(formData.minQuantity)
          : undefined,
        maxPrice: formData.maxPrice ? parseFloat(formData.maxPrice) : undefined,
        specifications: formData.specifications
          ? formData.specifications.split(",").map((s) => s.trim())
          : undefined,
        region: formData.region || undefined,
      },
      notificationMethod: formData.notificationMethod,
    };

    onCreateAlert(alertData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      productId: "",
      productName: "",
      alertType: "back_in_stock",
      minQuantity: "",
      maxPrice: "",
      specifications: "",
      region: "",
      notificationMethod: ["platform"],
    });
    setShowCreateForm(false);
    setEditingAlert(null);
  };

  const handleNotificationMethodChange = (
    method: "email" | "platform" | "sms",
    checked: boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      notificationMethod: checked
        ? [...prev.notificationMethod, method]
        : prev.notificationMethod.filter((m) => m !== method),
    }));
  };

  const activeAlerts = alerts.filter((alert) => alert.isActive);
  const recentTriggers = triggers.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Alertas Activas
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeAlerts.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Activadas Hoy
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    triggers.filter(
                      (t) =>
                        new Date(t.timestamp).toDateString() ===
                        new Date().toDateString(),
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Stock Disponible
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    triggers.filter((t) => t.triggerType === "stock_available")
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Precios Bajaron
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    triggers.filter((t) => t.triggerType === "price_change")
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Mis Alertas de Stock</span>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Alerta
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeAlerts.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-600 mb-2">
                No tienes alertas activas
              </p>
              <p className="text-gray-500 mb-4">
                Crea alertas para recibir notificaciones sobre disponibilidad de
                productos
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear primera alerta
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    {getAlertTypeIcon(alert.alertType)}
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {alert.productName}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {getAlertTypeLabel(alert.alertType)}
                        </Badge>
                        {alert.criteria.minQuantity && (
                          <Badge variant="secondary" className="text-xs">
                            Min: {alert.criteria.minQuantity}
                          </Badge>
                        )}
                        {alert.criteria.maxPrice && (
                          <Badge variant="secondary" className="text-xs">
                            Max: ${alert.criteria.maxPrice}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {alert.notificationMethod.map((method) => (
                          <div
                            key={method}
                            className="flex items-center gap-1 text-xs text-gray-500"
                          >
                            {getNotificationMethodIcon(method)}
                            <span className="capitalize">{method}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {alert.lastTriggered && (
                      <div className="text-xs text-gray-500 text-right">
                        <p>Última activación:</p>
                        <p>
                          {formatDistanceToNow(alert.lastTriggered, {
                            addSuffix: true,
                            locale: es,
                          })}
                        </p>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTestAlert(alert.id)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteAlert(alert.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Triggers */}
      {recentTriggers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Activaciones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTriggers.map((trigger) => {
                const alert = alerts.find((a) => a.id === trigger.alertId);
                return (
                  <div
                    key={trigger.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-blue-50"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {trigger.message}
                        </p>
                        <p className="text-sm text-gray-600">
                          {alert?.productName || "Producto desconocido"}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {formatDistanceToNow(trigger.timestamp, {
                        addSuffix: true,
                        locale: es,
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Alert Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nueva Alerta de Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Nombre del Producto *</Label>
                <Input
                  id="productName"
                  value={formData.productName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      productName: e.target.value,
                    }))
                  }
                  placeholder="Ej: Café Premium Colombia 20'"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alertType">Tipo de Alerta *</Label>
                <select
                  id="alertType"
                  value={formData.alertType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      alertType: e.target.value as StockAlert["alertType"],
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="back_in_stock">Producto Disponible</option>
                  <option value="low_stock">Stock Bajo</option>
                  <option value="similar_product">Producto Similar</option>
                  <option value="price_drop">Bajada de Precio</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minQuantity">Cantidad Mínima</Label>
                <Input
                  id="minQuantity"
                  type="number"
                  value={formData.minQuantity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      minQuantity: e.target.value,
                    }))
                  }
                  placeholder="Ej: 5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxPrice">Precio Máximo (USD)</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  value={formData.maxPrice}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxPrice: e.target.value,
                    }))
                  }
                  placeholder="Ej: 15000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Región</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, region: e.target.value }))
                  }
                  placeholder="Ej: Centroamérica"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specifications">
                  Especificaciones (separadas por coma)
                </Label>
                <Textarea
                  id="specifications"
                  value={formData.specifications}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      specifications: e.target.value,
                    }))
                  }
                  placeholder="Ej: Orgánico, Certificado, Grano entero"
                  rows={2}
                />
              </div>
            </div>

            <div className="mt-4">
              <Label>Métodos de Notificación *</Label>
              <div className="flex gap-4 mt-2">
                {(["platform", "email", "sms"] as const).map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox
                      id={method}
                      checked={formData.notificationMethod.includes(method)}
                      onCheckedChange={(checked) =>
                        handleNotificationMethodChange(
                          method,
                          checked as boolean,
                        )
                      }
                    />
                    <label
                      htmlFor={method}
                      className="flex items-center gap-1 text-sm"
                    >
                      {getNotificationMethodIcon(method)}
                      <span className="capitalize">
                        {method === "platform" ? "Plataforma" : method}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={handleCreateAlert}
                disabled={
                  !formData.productName ||
                  formData.notificationMethod.length === 0
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Alerta
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
