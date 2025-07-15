import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  MessageSquare,
  Search,
  Filter,
  Send,
  Paperclip,
  Image,
  FileText,
  Download,
  Clock,
  CheckCircle,
  Circle,
  User,
  Building2,
  Package,
  Tag,
  Phone,
  Mail,
  Calendar,
  Eye,
  MoreHorizontal,
  Star,
  Archive,
  Settings,
} from "lucide-react";

interface ChatMessage {
  id: string;
  conversationId: string;
  sender: "supplier" | "buyer";
  senderName: string;
  message: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  attachments?: MessageAttachment[];
  isImportant?: boolean;
}

interface MessageAttachment {
  id: string;
  fileName: string;
  fileType: "pdf" | "image" | "excel" | "document";
  fileSize: number;
  fileUrl: string;
}

interface Conversation {
  id: string;
  buyerCompany: string;
  buyerContact: string;
  buyerEmail: string;
  relatedType: "lot" | "rfq" | "order";
  relatedId: string;
  relatedTitle: string;
  tag: "in_progress" | "negotiating" | "post_sale_support" | "resolved";
  status: "active" | "archived";
  unreadCount: number;
  lastMessage: ChatMessage;
  participants: string[];
  createdAt: Date;
  lastActivity: Date;
  isPinned: boolean;
  priority: "low" | "medium" | "high";
}

const SupplierMessages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [attachments, setAttachments] = useState<File[]>([]);

  // Mock conversations data
  const conversations: Conversation[] = [
    {
      id: "conv-1",
      buyerCompany: "Comercial Los Andes S.A.",
      buyerContact: "María González",
      buyerEmail: "maria.gonzalez@losandes.com",
      relatedType: "order",
      relatedId: "PO-2024-001",
      relatedTitle: "Camisa de Algodón Premium - 2 contenedores",
      tag: "in_progress",
      status: "active",
      unreadCount: 3,
      participants: ["María González", "ZLC Textiles"],
      createdAt: new Date("2024-01-20"),
      lastActivity: new Date("2024-02-23T14:30:00"),
      isPinned: true,
      priority: "high",
      lastMessage: {
        id: "msg-1",
        conversationId: "conv-1",
        sender: "buyer",
        senderName: "María González",
        message:
          "Necesitamos confirmar la fecha de embarque. ¿Pueden enviar el BL actualizado?",
        timestamp: new Date("2024-02-23T14:30:00"),
        status: "delivered",
        attachments: [
          {
            id: "att-1",
            fileName: "shipping_requirements.pdf",
            fileType: "pdf",
            fileSize: 245760,
            fileUrl: "#",
          },
        ],
        isImportant: true,
      },
    },
    {
      id: "conv-2",
      buyerCompany: "Textiles del Pacífico Ltda.",
      buyerContact: "Carlos Mendoza",
      buyerEmail: "carlos.mendoza@pacifico.com",
      relatedType: "rfq",
      relatedId: "RFQ-2024-002",
      relatedTitle: "Solicitud cotización Polo Deportivo",
      tag: "negotiating",
      status: "active",
      unreadCount: 1,
      participants: ["Carlos Mendoza", "ZLC Textiles"],
      createdAt: new Date("2024-02-15"),
      lastActivity: new Date("2024-02-23T11:15:00"),
      isPinned: false,
      priority: "medium",
      lastMessage: {
        id: "msg-2",
        conversationId: "conv-2",
        sender: "supplier",
        senderName: "ZLC Textiles",
        message:
          "Hemos enviado la cotización actualizada con descuento por volumen. Favor revisar.",
        timestamp: new Date("2024-02-23T11:15:00"),
        status: "read",
      },
    },
    {
      id: "conv-3",
      buyerCompany: "Importadora San José",
      buyerContact: "Ana Rodríguez",
      buyerEmail: "ana.rodriguez@sanjose.com",
      relatedType: "order",
      relatedId: "PO-2024-003",
      relatedTitle: "Camisa de Algodón Premium - 3 contenedores",
      tag: "post_sale_support",
      status: "active",
      unreadCount: 0,
      participants: ["Ana Rodríguez", "ZLC Textiles"],
      createdAt: new Date("2024-01-15"),
      lastActivity: new Date("2024-02-22T16:45:00"),
      isPinned: false,
      priority: "low",
      lastMessage: {
        id: "msg-3",
        conversationId: "conv-3",
        sender: "buyer",
        senderName: "Ana Rodríguez",
        message: "Muchas gracias por el soporte. Orden recibida completa.",
        timestamp: new Date("2024-02-22T16:45:00"),
        status: "read",
      },
    },
  ];

  // Mock messages for active conversation
  const getMessagesForConversation = (
    conversationId: string,
  ): ChatMessage[] => {
    if (conversationId === "conv-1") {
      return [
        {
          id: "msg-1-1",
          conversationId: "conv-1",
          sender: "buyer",
          senderName: "María González",
          message:
            "Hola, quería consultar sobre el estado de nuestra orden PO-2024-001. ¿Cuál es el progreso actual?",
          timestamp: new Date("2024-02-23T10:00:00"),
          status: "read",
        },
        {
          id: "msg-1-2",
          conversationId: "conv-1",
          sender: "supplier",
          senderName: "ZLC Textiles",
          message:
            "Buenos días María. La producción está al 85%. Estimamos tener todo listo para embarque el próximo viernes.",
          timestamp: new Date("2024-02-23T10:15:00"),
          status: "read",
        },
        {
          id: "msg-1-3",
          conversationId: "conv-1",
          sender: "buyer",
          senderName: "María González",
          message:
            "Perfecto. ¿Podrían enviarme fotos del progreso y el packing list actualizado?",
          timestamp: new Date("2024-02-23T10:30:00"),
          status: "read",
          attachments: [
            {
              id: "att-2",
              fileName: "production_photos.zip",
              fileType: "document",
              fileSize: 15728640,
              fileUrl: "#",
            },
          ],
        },
        {
          id: "msg-1-4",
          conversationId: "conv-1",
          sender: "supplier",
          senderName: "ZLC Textiles",
          message:
            "Por supuesto. Adjunto las fotos de la línea de producción y el packing list preliminar.",
          timestamp: new Date("2024-02-23T11:00:00"),
          status: "read",
          attachments: [
            {
              id: "att-3",
              fileName: "progress_photos.jpg",
              fileType: "image",
              fileSize: 2456789,
              fileUrl: "#",
            },
            {
              id: "att-4",
              fileName: "packing_list_preliminary.xlsx",
              fileType: "excel",
              fileSize: 45673,
              fileUrl: "#",
            },
          ],
        },
        {
          id: "msg-1-5",
          conversationId: "conv-1",
          sender: "buyer",
          senderName: "María González",
          message:
            "Necesitamos confirmar la fecha de embarque. ¿Pueden enviar el BL actualizado?",
          timestamp: new Date("2024-02-23T14:30:00"),
          status: "delivered",
          attachments: [
            {
              id: "att-5",
              fileName: "shipping_requirements.pdf",
              fileType: "pdf",
              fileSize: 245760,
              fileUrl: "#",
            },
          ],
          isImportant: true,
        },
      ];
    }
    return [];
  };

  const getTagVariant = (tag: string) => {
    switch (tag) {
      case "in_progress":
        return "default";
      case "negotiating":
        return "secondary";
      case "post_sale_support":
        return "outline";
      case "resolved":
        return "outline";
      default:
        return "outline";
    }
  };

  const getTagLabel = (tag: string) => {
    switch (tag) {
      case "in_progress":
        return "Pedido en Curso";
      case "negotiating":
        return "En Negociación";
      case "post_sale_support":
        return "Soporte Post-Venta";
      case "resolved":
        return "Resuelto";
      default:
        return tag;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-300";
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-600" />;
      case "image":
        return <Image className="h-4 w-4 text-blue-600" />;
      case "excel":
        return <FileText className="h-4 w-4 text-green-600" />;
      case "document":
        return <FileText className="h-4 w-4 text-gray-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() && attachments.length === 0) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversation?.id || "",
      sender: "supplier",
      senderName: "ZLC Textiles",
      message: newMessage,
      timestamp: new Date(),
      status: "sent",
      attachments: attachments.map((file, index) => ({
        id: `att-${Date.now()}-${index}`,
        fileName: file.name,
        fileType: file.type.includes("image")
          ? "image"
          : file.name.endsWith(".pdf")
            ? "pdf"
            : file.name.endsWith(".xlsx") || file.name.endsWith(".xls")
              ? "excel"
              : "document",
        fileSize: file.size,
        fileUrl: "#",
      })),
    };

    setNewMessage("");
    setAttachments([]);

    toast({
      title: "Mensaje Enviado",
      description: "El mensaje ha sido entregado al comprador.",
    });
  };

  const handleFileAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments([...attachments, ...files]);
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.buyerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.relatedTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.relatedId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = filterTag === "all" || conv.tag === filterTag;
    return matchesSearch && matchesTag;
  });

  const totalUnread = conversations.reduce(
    (sum, conv) => sum + conv.unreadCount,
    0,
  );
  const activeChats = conversations.filter(
    (conv) => conv.status === "active",
  ).length;
  const pinnedChats = conversations.filter((conv) => conv.isPinned).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-14 sm:pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Chat y Mensajería
              </h1>
              <Button variant="outline" asChild>
                <Link to="/supplier/dashboard">← Volver al Panel</Link>
              </Button>
            </div>
            <p className="text-gray-600">
              Centraliza la comunicación con tus compradores
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Mensajes No Leídos</p>
                    <p className="text-2xl font-bold text-red-600">
                      {totalUnread}
                    </p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Chats Activos</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {activeChats}
                    </p>
                  </div>
                  <Circle className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Chats Fijados</p>
                    <p className="text-2xl font-bold text-amber-700">
                      {pinnedChats}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Total Conversaciones
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {conversations.length}
                    </p>
                  </div>
                  <Building2 className="h-8 w-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Conversaciones ({filteredConversations.length})
                  </CardTitle>
                  {/* Filters */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar conversaciones..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={filterTag} onValueChange={setFilterTag}>
                      <SelectTrigger>
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filtrar por etiqueta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las etiquetas</SelectItem>
                        <SelectItem value="in_progress">
                          Pedido en Curso
                        </SelectItem>
                        <SelectItem value="negotiating">
                          En Negociación
                        </SelectItem>
                        <SelectItem value="post_sale_support">
                          Soporte Post-Venta
                        </SelectItem>
                        <SelectItem value="resolved">Resuelto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-96 overflow-y-auto">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-4 border-b cursor-pointer transition-colors border-l-4 ${getPriorityColor(
                          conversation.priority,
                        )} ${
                          activeConversation?.id === conversation.id
                            ? "bg-blue-50 border-r-2 border-r-blue-500"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => setActiveConversation(conversation)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium truncate">
                                {conversation.buyerCompany}
                              </h4>
                              {conversation.isPinned && (
                                <Star className="h-3 w-3 text-amber-600 fill-current" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {conversation.buyerContact}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {conversation.unreadCount > 0 && (
                              <Badge
                                variant="destructive"
                                className="h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                              >
                                {conversation.unreadCount}
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              {conversation.lastActivity.toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={getTagVariant(conversation.tag)}>
                            <Tag className="h-3 w-3 mr-1" />
                            {getTagLabel(conversation.tag)}
                          </Badge>
                          {conversation.relatedType === "order" && (
                            <Package className="h-3 w-3 text-blue-600" />
                          )}
                          {conversation.relatedType === "rfq" && (
                            <FileText className="h-3 w-3 text-green-600" />
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-1">
                          {conversation.relatedId} - {conversation.relatedTitle}
                        </p>

                        <p className="text-sm text-gray-700 truncate">
                          {conversation.lastMessage.sender === "supplier"
                            ? "Tú: "
                            : ""}
                          {conversation.lastMessage.message}
                        </p>

                        {conversation.lastMessage.attachments &&
                          conversation.lastMessage.attachments.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Paperclip className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {conversation.lastMessage.attachments.length}{" "}
                                archivo(s)
                              </span>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Window */}
            <div className="lg:col-span-2">
              {activeConversation ? (
                <Card className="h-full max-h-96">
                  {/* Chat Header */}
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {activeConversation.buyerCompany}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {activeConversation.buyerContact} •{" "}
                            {activeConversation.relatedId}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getTagVariant(activeConversation.tag)}>
                          {getTagLabel(activeConversation.tag)}
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <Separator />

                  {/* Messages */}
                  <CardContent className="flex-1 overflow-y-auto p-4 max-h-64">
                    <div className="space-y-4">
                      {getMessagesForConversation(activeConversation.id).map(
                        (message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.sender === "supplier"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.sender === "supplier"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium">
                                  {message.senderName}
                                </span>
                                {message.isImportant && (
                                  <Star className="h-3 w-3 text-amber-600 fill-current" />
                                )}
                              </div>
                              <p className="text-sm">{message.message}</p>

                              {message.attachments &&
                                message.attachments.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    {message.attachments.map((attachment) => (
                                      <div
                                        key={attachment.id}
                                        className="flex items-center gap-2 p-2 bg-white bg-opacity-20 rounded"
                                      >
                                        {getFileIcon(attachment.fileType)}
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-medium truncate">
                                            {attachment.fileName}
                                          </p>
                                          <p className="text-xs opacity-75">
                                            {formatFileSize(
                                              attachment.fileSize,
                                            )}
                                          </p>
                                        </div>
                                        <Button size="sm" variant="ghost">
                                          <Download className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                )}

                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-xs opacity-75">
                                  {message.timestamp.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                {message.sender === "supplier" && (
                                  <>
                                    {message.status === "sent" && (
                                      <Circle className="h-3 w-3 opacity-75" />
                                    )}
                                    {message.status === "delivered" && (
                                      <CheckCircle className="h-3 w-3 opacity-75" />
                                    )}
                                    {message.status === "read" && (
                                      <CheckCircle className="h-3 w-3 text-blue-200" />
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>

                  <Separator />

                  {/* Message Input */}
                  <div className="p-4">
                    {attachments.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded text-sm"
                          >
                            {getFileIcon(
                              file.type.includes("image")
                                ? "image"
                                : file.name.endsWith(".pdf")
                                  ? "pdf"
                                  : "document",
                            )}
                            <span className="truncate max-w-32">
                              {file.name}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                setAttachments(
                                  attachments.filter((_, i) => i !== index),
                                )
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Textarea
                          placeholder="Escribe tu mensaje..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          rows={2}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Input
                          type="file"
                          multiple
                          className="hidden"
                          id="file-attach"
                          onChange={handleFileAttach}
                          accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.jpeg,.png"
                        />
                        <Label htmlFor="file-attach" className="cursor-pointer">
                          <Button variant="outline" size="icon" asChild>
                            <span>
                              <Paperclip className="h-4 w-4" />
                            </span>
                          </Button>
                        </Label>
                        <Button onClick={handleSendMessage} size="icon">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="h-full">
                  <CardContent className="flex items-center justify-center h-full p-8">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-medium text-gray-900 mb-2">
                        Selecciona una conversación
                      </h3>
                      <p className="text-gray-600">
                        Elige una conversación de la lista para comenzar a
                        chatear con el comprador
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-center">
                    <Star className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Marcar Importantes</div>
                    <div className="text-sm opacity-70">
                      Fijar conversaciones prioritarias
                    </div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-center">
                    <Archive className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Archivar Resueltos</div>
                    <div className="text-sm opacity-70">
                      Organizar conversaciones antiguas
                    </div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-center">
                    <Settings className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Configurar Notificaciones</div>
                    <div className="text-sm opacity-70">
                      Gestionar alertas de mensajes
                    </div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-center">
                    <Phone className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Contacto Directo</div>
                    <div className="text-sm opacity-70">
                      Llamar o enviar email
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupplierMessages;
