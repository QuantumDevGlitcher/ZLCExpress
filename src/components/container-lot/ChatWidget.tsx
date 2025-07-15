import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  Send,
  X,
  User,
  Bot,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface ChatWidgetProps {
  supplierName: string;
}

interface Message {
  id: string;
  type: "user" | "supplier" | "system";
  content: string;
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
}

export function ChatWidget({ supplierName }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "system",
      content: `Conectado con ${supplierName}. Un representante estará con usted en breve.`,
      timestamp: new Date(),
    },
    {
      id: "2",
      type: "supplier",
      content:
        "¡Hola! Soy María González, representante de ventas. ¿En qué puedo ayudarle con este lote de camisetas?",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      status: "read",
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // Simulate supplier response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        type: "supplier",
        content:
          "Gracias por su mensaje. Estoy revisando su consulta y le responderé en unos momentos.",
        timestamp: new Date(),
        status: "delivered",
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "sent":
        return <Clock className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <CheckCircle2 className="h-3 w-3 text-gray-400" />;
      case "read":
        return <CheckCircle2 className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-xl z-50 border-2 border-blue-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            Chat con {supplierName}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-600">Respuesta promedio: 2-5 minutos</p>
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-full">
        {/* Messages Area */}
        <ScrollArea className="flex-1 px-4 pb-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.type === "system" && (
                  <div className="text-center">
                    <div className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                      {msg.content}
                    </div>
                  </div>
                )}

                {msg.type === "supplier" && (
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-xs">
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-gray-500">
                          {formatTime(msg.timestamp)}
                        </span>
                        {getStatusIcon(msg.status)}
                      </div>
                    </div>
                  </div>
                )}

                {msg.type === "user" && (
                  <div className="flex gap-2 justify-end">
                    <div className="flex-1">
                      <div className="bg-blue-600 text-white rounded-lg px-3 py-2 max-w-xs ml-auto">
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 justify-end">
                        <span className="text-xs text-gray-500">
                          {formatTime(msg.timestamp)}
                        </span>
                        {getStatusIcon(msg.status)}
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escriba su mensaje..."
              className="flex-1"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            María González está escribiendo...
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
