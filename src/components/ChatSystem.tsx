import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage, ChatThread, ChatAttachment } from "@/types";
import {
  Send,
  Paperclip,
  Download,
  FileText,
  Image,
  File,
  Clock,
  CheckCheck,
  User,
  Building2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface ChatSystemProps {
  thread: ChatThread;
  currentUserId: string;
  currentUserRole: "buyer" | "supplier";
  onSendMessage: (content: string, attachments: File[]) => void;
  onMarkAsRead: (messageId: string) => void;
}

export function ChatSystem({
  thread,
  currentUserId,
  currentUserRole,
  onSendMessage,
  onMarkAsRead,
}: ChatSystemProps) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [thread.messages]);

  const handleSendMessage = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message, attachments);
      setMessage("");
      setAttachments([]);
    }
  };

  const handleFileAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
      return <Image className="h-4 w-4" />;
    } else if (["pdf"].includes(extension || "")) {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else if (["xlsx", "xls", "csv"].includes(extension || "")) {
      return <FileText className="h-4 w-4 text-green-500" />;
    }
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getMessageTypeIcon = (messageType: ChatMessage["messageType"]) => {
    switch (messageType) {
      case "offer":
        return <Building2 className="h-3 w-3 text-blue-500" />;
      case "system":
        return <Clock className="h-3 w-3 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <span>Chat - RFQ #{thread.rfqId}</span>
            {thread.unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {thread.unreadCount} no leídos
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {thread.participants.map((participant) => (
              <div key={participant.id} className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${participant.isOnline ? "bg-green-500" : "bg-gray-300"}`}
                />
                <span className="text-sm text-gray-600">
                  {participant.name}
                </span>
              </div>
            ))}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {thread.messages.map((msg) => {
            const isOwn = msg.senderId === currentUserId;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
              >
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src={`/api/avatar/${msg.senderId}`} />
                  <AvatarFallback className="text-xs">
                    {msg.senderName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={`flex-1 max-w-[80%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {msg.senderName}
                    </span>
                    <Badge
                      variant={
                        msg.senderRole === "supplier" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {msg.senderRole === "supplier"
                        ? "Proveedor"
                        : "Comprador"}
                    </Badge>
                    {getMessageTypeIcon(msg.messageType)}
                  </div>

                  <div
                    className={`p-3 rounded-lg max-w-full ${
                      isOwn
                        ? "bg-blue-600 text-white"
                        : msg.messageType === "system"
                          ? "bg-gray-100 text-gray-700 border border-gray-200"
                          : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {msg.content && (
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                    )}

                    {msg.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {msg.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className={`flex items-center gap-2 p-2 rounded border ${
                              isOwn
                                ? "border-blue-400 bg-blue-500"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {getFileIcon(attachment.name)}
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-xs font-medium truncate ${isOwn ? "text-white" : "text-gray-900"}`}
                              >
                                {attachment.name}
                              </p>
                              <p
                                className={`text-xs ${isOwn ? "text-blue-100" : "text-gray-500"}`}
                              >
                                {formatFileSize(attachment.size)}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant={isOwn ? "secondary" : "outline"}
                              className="h-6 w-6 p-0"
                              onClick={() =>
                                window.open(attachment.url, "_blank")
                              }
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(msg.timestamp, {
                        addSuffix: true,
                        locale: es,
                      })}
                    </span>
                    {isOwn && (
                      <CheckCheck
                        className={`h-3 w-3 ${msg.isRead ? "text-blue-500" : "text-gray-400"}`}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Typing Indicator */}
        {isTyping && (
          <div className="px-4 py-2 text-sm text-gray-500 italic">
            El proveedor está escribiendo...
          </div>
        )}

        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="px-4 py-2 border-t bg-gray-50">
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white p-2 rounded border"
                >
                  {getFileIcon(file.name)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 p-0 text-red-500 hover:text-red-700"
                    onClick={() => removeAttachment(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <div className="flex-1">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribir mensaje..."
                className="min-h-[40px] max-h-[120px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-10 w-10 p-0"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() && attachments.length === 0}
                className="h-10 w-10 p-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.xlsx,.xls,.doc,.docx,.jpg,.jpeg,.png,.gif"
            onChange={handleFileAttach}
            className="hidden"
          />

          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>
              Archivos permitidos: PDF, Excel, Word, Imágenes (máx. 10MB)
            </span>
            <span>
              Presiona Enter para enviar, Shift+Enter para nueva línea
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
