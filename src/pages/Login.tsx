import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navigation } from "@/components/Navigation";
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Ingrese un email válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [accountStatus, setAccountStatus] = useState<
    "pending" | "verified" | "rejected" | null
  >(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setLoginError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate different account states for demo
      const demoEmail = values.email.toLowerCase();
      if (demoEmail.includes("pending")) {
        setAccountStatus("pending");
      } else if (demoEmail.includes("rejected")) {
        setAccountStatus("rejected");
      } else if (demoEmail.includes("admin")) {
        setAccountStatus("verified");
        // Would redirect to dashboard
        console.log("Login successful - redirect to dashboard");
      } else {
        setLoginError("Email o contraseña incorrectos");
      }
    } catch (error) {
      setLoginError("Error de conexión. Inténtelo nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusAlert = () => {
    switch (accountStatus) {
      case "pending":
        return (
          <Alert className="border-amber-200 bg-amber-50">
            <Clock className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Cuenta en proceso de verificación:</strong> Su empresa
              está siendo revisada por nuestro equipo. Este proceso puede tomar
              de 1-3 días hábiles. Le notificaremos por email una vez completada
              la verificación.
            </AlertDescription>
          </Alert>
        );
      case "rejected":
        return (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Verificación rechazada:</strong> Su solicitud no pudo ser
              aprobada. Por favor{" "}
              <Link to="/support" className="underline hover:text-red-900">
                contáctenos
              </Link>{" "}
              para más información o para enviar documentación adicional.
            </AlertDescription>
          </Alert>
        );
      case "verified":
        return (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>¡Bienvenido!</strong> Su empresa está verificada.
              Redirigiendo al dashboard...
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zlc-gray-50">
      <Navigation />

      <div className="container-section py-12">
        <div className="mx-auto max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 rounded-full bg-zlc-blue-100 flex items-center justify-center mb-4">
              <Building2 className="h-8 w-8 text-zlc-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-zlc-gray-900">
              Iniciar Sesión
            </h1>
            <p className="text-zlc-gray-600 mt-2">
              Acceda a su cuenta empresarial
            </p>
          </div>

          {/* Status Alert */}
          {accountStatus && <div className="mb-6">{getStatusAlert()}</div>}

          {/* Login Form */}
          <Card className="shadow-soft-lg">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">ZLC Express</CardTitle>
              <CardDescription>
                Ingrese sus credenciales corporativas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Login Error */}
                  {loginError && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        {loginError}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Corporativo</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zlc-gray-400" />
                            <Input
                              type="email"
                              placeholder="usuario@empresa.com"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zlc-gray-400" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Ingrese su contraseña"
                              className="pl-10 pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zlc-gray-400 hover:text-zlc-gray-600"
                            >
                              {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-zlc-blue-600 hover:text-zlc-blue-800 hover:underline"
                    >
                      ¿Olvidó su contraseña?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-zlc-blue-800 hover:bg-zlc-blue-900 h-11"
                  >
                    {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>

                  {/* Demo Credentials */}
                  <div className="mt-6 p-4 bg-zlc-gray-50 rounded-lg">
                    <p className="text-xs text-zlc-gray-600 mb-2 font-medium">
                      Cuentas de demostración:
                    </p>
                    <div className="space-y-1 text-xs text-zlc-gray-500">
                      <p>
                        • <strong>pending@demo.com</strong> - Cuenta pendiente
                        de verificación
                      </p>
                      <p>
                        • <strong>rejected@demo.com</strong> - Cuenta rechazada
                      </p>
                      <p>
                        • <strong>admin@demo.com</strong> - Cuenta verificada
                      </p>
                      <p className="mt-1 text-zlc-gray-400">
                        Contraseña: cualquier valor
                      </p>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-zlc-gray-600">
              ¿No tiene una cuenta?{" "}
              <Link
                to="/register"
                className="font-medium text-zlc-blue-600 hover:text-zlc-blue-800 hover:underline"
              >
                Registrar empresa
              </Link>
            </p>
          </div>

          {/* Support Link */}
          <div className="text-center mt-4">
            <p className="text-xs text-zlc-gray-500">
              ¿Problemas para acceder?{" "}
              <Link
                to="/support"
                className="text-zlc-blue-600 hover:text-zlc-blue-800 hover:underline"
              >
                Contactar soporte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
