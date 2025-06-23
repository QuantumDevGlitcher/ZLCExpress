import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Notification } from "@/types";
import {
  Bell,
  BellRing,
  CheckCheck,
  MessageSquare,
  ShoppingCart,
  AlertTriangle,
  FileText,
  Package,
  Clock,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (notificationId: string) => void;
  onNotificationAction: (notification: Notification) => void;
}

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onNotificationAction,
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<
    "all" | "unread" | "rfq" | "stock" | "chat"
  >("all");

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "rfq_update":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "stock_alert":
        return <Package className="h-4 w-4 text-orange-500" />;
      case "chat_message":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case "offer_received":
        return <ShoppingCart className="h-4 w-4 text-purple-500" />;
      case "contract_update":
        return <FileText className="h-4 w-4 text-indigo-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "secondary";
      case "medium":
        return "outline";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getPriorityLabel = (priority: Notification["priority"]) => {
    switch (priority) {
      case "urgent":
        return "Urgente";
      case "high":
        return "Alta";
      case "medium":
        return "Media";
      case "low":
        return "Baja";
      default:
        return "Normal";
    }
  };

  const getTypeLabel = (type: Notification["type"]) => {
    switch (type) {
      case "rfq_update":
        return "Actualización RFQ";
      case "stock_alert":
        return "Alerta de Stock";
      case "chat_message":
        return "Mensaje de Chat";
      case "offer_received":
        return "Oferta Recibida";
      case "contract_update":
        return "Actualización Contrato";
      default:
        return "Notificación";
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.isRead;
    if (filter === "rfq")
      return (
        notification.type === "rfq_update" ||
        notification.type === "offer_received"
      );
    if (filter === "stock") return notification.type === "stock_alert";
    if (filter === "chat") return notification.type === "chat_message";
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {unreadCount > 0 ? (
              <BellRing className="h-5 w-5 text-blue-600" />
            ) : (
              <Bell className="h-5 w-5 text-gray-500" />
            )}
            <span>Centro de Notificaciones</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} no leídas
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Marcar todas como leídas
            </Button>
          </div>
        </CardTitle>

        {/* Filter Tabs */}
        <div className="flex gap-1 mt-4">
          {[
            { key: "all", label: "Todas", count: notifications.length },
            { key: "unread", label: "No leídas", count: unreadCount },
            {
              key: "rfq",
              label: "RFQs",
              count: notifications.filter(
                (n) => n.type === "rfq_update" || n.type === "offer_received",
              ).length,
            },
            {
              key: "stock",
              label: "Stock",
              count: notifications.filter((n) => n.type === "stock_alert")
                .length,
            },
            {
              key: "chat",
              label: "Chat",
              count: notifications.filter((n) => n.type === "chat_message")
                .length,
            },
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={filter === tab.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(tab.key as any)}
              className="text-xs"
            >
              {tab.label}
              {tab.count > 0 && (
                <Badge
                  variant={filter === tab.key ? "secondary" : "outline"}
                  className="ml-1 text-xs"
                >
                  {tab.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No hay notificaciones</p>
              <p className="text-sm">
                {filter === "unread"
                  ? "No tienes notificaciones sin leer"
                  : "No tienes notificaciones en este momento"}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.isRead
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        <Badge
                          variant={getPriorityColor(notification.priority)}
                          className="text-xs"
                        >
                          {getPriorityLabel(notification.priority)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(notification.type)}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(notification.timestamp, {
                              addSuffix: true,
                              locale: es,
                            })}
                          </span>
                          {notification.relatedId && (
                            <span className="font-mono text-gray-400">
                              #{notification.relatedId.slice(-6).toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onMarkAsRead(notification.id)}
                              className="h-6 w-6 p-0"
                              title="Marcar como leída"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          )}

                          {notification.actionUrl &&
                            notification.actionText && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  onNotificationAction(notification)
                                }
                                className="text-xs h-6"
                              >
                                {notification.actionText}
                              </Button>
                            )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              onDeleteNotification(notification.id)
                            }
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            title="Eliminar notificación"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {!notification.isRead && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
