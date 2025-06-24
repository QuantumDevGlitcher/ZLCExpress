import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ChatSystem } from "@/components/ChatSystem";
import { NotificationCenter } from "@/components/NotificationCenter";
import { useB2B } from "@/contexts/B2BContext";
import {
  MessageSquare,
  Bell,
  BellRing,
  Search,
  Filter,
  Users,
  Clock,
  CheckCheck,
  Plus,
  Settings,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Navigation } from "@/components/Navigation";

function Communications() {
  const {
    chatThreads,
    notifications,
    sendChatMessage,
    markChatMessageAsRead,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    handleNotificationAction,
  } = useB2B();

  const [activeTab, setActiveTab] = useState<"chat" | "notifications">("chat");
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock current user data
  const currentUser = {
    id: "user_123",
    role: "buyer" as const,
  };

  const filteredThreads = chatThreads.filter(
    (thread) =>
      thread.rfqId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.participants.some((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const unreadMessagesCount = chatThreads.reduce(
    (sum, thread) => sum + thread.unreadCount,
    0,
  );
  const unreadNotificationsCount = notifications.filter(
    (n) => !n.isRead,
  ).length;

  const activeThread = selectedThread
    ? chatThreads.find((t) => t.id === selectedThread)
    : null;

  const handleSendMessage = (content: string, attachments: File[]) => {
    if (selectedThread) {
      sendChatMessage(selectedThread, content, attachments);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-14 sm:pt-16 md:pt-20">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Comunicaciones
              </h1>
              <p className="text-gray-600 mt-1">
                Centro de comunicación empresarial y notificaciones
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Chats Activos
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {chatThreads.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <BellRing className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Mensajes No Leídos
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {unreadMessagesCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Bell className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Notificaciones
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {unreadNotificationsCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Proveedores Activos
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {
                        new Set(
                          chatThreads.flatMap((t) =>
                            t.participants
                              .filter((p) => p.role === "supplier")
                              .map((p) => p.id),
                          ),
                        ).size
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Communication Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Conversaciones
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Search */}
                  <div className="p-4 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar conversaciones..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Threads List */}
                  <div className="max-h-[600px] overflow-y-auto">
                    {filteredThreads.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium mb-2">
                          No hay conversaciones
                        </p>
                        <p className="text-sm">
                          {searchTerm
                            ? "No se encontraron conversaciones"
                            : "Inicia un RFQ para comenzar a comunicarte con proveedores"}
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {filteredThreads.map((thread) => {
                          const supplier = thread.participants.find(
                            (p) => p.role === "supplier",
                          );
                          const lastMessage =
                            thread.messages[thread.messages.length - 1];

                          return (
                            <div
                              key={thread.id}
                              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                                selectedThread === thread.id ? "bg-blue-50" : ""
                              }`}
                              onClick={() => setSelectedThread(thread.id)}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-gray-900 truncate">
                                    RFQ #{thread.rfqId}
                                  </h4>
                                  <p className="text-sm text-gray-600 truncate">
                                    {supplier?.name || "Proveedor"}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {thread.unreadCount > 0 && (
                                    <Badge
                                      variant="destructive"
                                      className="text-xs"
                                    >
                                      {thread.unreadCount}
                                    </Badge>
                                  )}
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      supplier?.isOnline
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                    }`}
                                  />
                                </div>
                              </div>

                              {lastMessage && (
                                <div className="space-y-1">
                                  <p className="text-sm text-gray-600 truncate">
                                    {lastMessage.senderRole === "buyer"
                                      ? "Tú: "
                                      : ""}
                                    {lastMessage.content ||
                                      (lastMessage.attachments.length > 0
                                        ? `📎 ${lastMessage.attachments.length} archivo(s)`
                                        : "Mensaje del sistema")}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {formatDistanceToNow(
                                      lastMessage.timestamp,
                                      {
                                        addSuffix: true,
                                        locale: es,
                                      },
                                    )}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Tab Navigation */}
              <div className="flex gap-1 mb-6">
                <Button
                  variant={activeTab === "chat" ? "default" : "outline"}
                  onClick={() => setActiveTab("chat")}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat
                  {unreadMessagesCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {unreadMessagesCount}
                    </Badge>
                  )}
                </Button>
                <Button
                  variant={
                    activeTab === "notifications" ? "default" : "outline"
                  }
                  onClick={() => setActiveTab("notifications")}
                  className="flex items-center gap-2"
                >
                  <Bell className="h-4 w-4" />
                  Notificaciones
                  {unreadNotificationsCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {unreadNotificationsCount}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Content */}
              {activeTab === "chat" ? (
                activeThread ? (
                  <ChatSystem
                    thread={activeThread}
                    currentUserId={currentUser.id}
                    currentUserRole={currentUser.role}
                    onSendMessage={handleSendMessage}
                    onMarkAsRead={markChatMessageAsRead}
                  />
                ) : (
                  <Card className="h-[600px] flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-xl font-medium mb-2">
                        Selecciona una Conversación
                      </p>
                      <p className="text-gray-400">
                        Elige un chat de la lista para comenzar a comunicarte
                      </p>
                    </div>
                  </Card>
                )
              ) : (
                <NotificationCenter
                  notifications={notifications}
                  onMarkAsRead={markNotificationAsRead}
                  onMarkAllAsRead={markAllNotificationsAsRead}
                  onDeleteNotification={deleteNotification}
                  onNotificationAction={handleNotificationAction}
                />
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de Comunicación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">
                      Tiempo de Respuesta Promedio
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">2.5 hrs</p>
                  <p className="text-sm text-gray-500">
                    En las últimas 24 horas
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCheck className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Mensajes Respondidos</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      chatThreads
                        .flatMap((t) => t.messages)
                        .filter((m) => m.isRead).length
                    }
                  </p>
                  <p className="text-sm text-gray-500">Total mensajes leídos</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-purple-500" />
                    <span className="font-medium">Proveedores Contactados</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      new Set(
                        chatThreads.flatMap((t) =>
                          t.participants
                            .filter((p) => p.role === "supplier")
                            .map((p) => p.id),
                        ),
                      ).size
                    }
                  </p>
                  <p className="text-sm text-gray-500">Este mes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default Communications;
