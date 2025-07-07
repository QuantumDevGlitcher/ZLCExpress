import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [accountStatus, setAccountStatus] = useState<
    "pending" | "verified" | "rejected" | null
  >(null);

  // ============================================
  // HARDCODED DEMO CREDENTIALS - FOR DEVELOPMENT ONLY
  // TODO: REMOVE THIS SECTION BEFORE PRODUCTION
  // ============================================
  const DEMO_CREDENTIALS = {
    // Buyer accounts
    buyer: {
      email: "comprador@demo.com",
      password: "demo123",
      type: "buyer" as const,
      status: "verified" as const,
    },
    buyerPending: {
      email: "comprador.pendiente@demo.com",
      password: "demo123",
      type: "buyer" as const,
      status: "pending" as const,
    },
    // Supplier accounts
    supplier: {
      email: "proveedor@demo.com",
      password: "demo123",
      type: "supplier" as const,
      status: "verified" as const,
    },
    supplierPending: {
      email: "proveedor.pendiente@demo.com",
      password: "demo123",
      type: "supplier" as const,
      status: "pending" as const,
    },
    supplierRejected: {
      email: "proveedor.rechazado@demo.com",
      password: "demo123",
      type: "supplier" as const,
      status: "rejected" as const,
    },
  };
  // ============================================
  // END HARDCODED CREDENTIALS SECTION
  // ============================================

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
    setAccountStatus(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // ============================================
      // HARDCODED DEMO LOGIN VALIDATION - FOR DEVELOPMENT ONLY
      // TODO: REPLACE WITH REAL API AUTHENTICATION
      // ============================================
      const inputEmail = values.email.toLowerCase().trim();
      const inputPassword = values.password.trim();

      // Find matching demo credential
      const matchingCredential = Object.values(DEMO_CREDENTIALS).find(
        (cred) =>
          cred.email.toLowerCase() === inputEmail &&
          cred.password === inputPassword,
      );

      if (matchingCredential) {
        console.log(
          `Demo login successful for ${matchingCredential.type} with status ${matchingCredential.status}`,
        );

        // Handle different account statuses
        if (matchingCredential.status === "verified") {
          // Successful login - redirect to appropriate dashboard
          if (matchingCredential.type === "buyer") {
            console.log("Redirecting to buyer dashboard...");
            navigate("/"); // Redirect to main buyer dashboard/homepage
          } else if (matchingCredential.type === "supplier") {
            console.log("Redirecting to supplier dashboard...");
            navigate("/supplier/dashboard"); // Redirect to supplier dashboard
          }
        } else {
          // Account pending verification or rejected
          setAccountStatus(matchingCredential.status);
        }
      } else {
        // No matching credentials found
        setLoginError("Email o contraseña incorrectos");
        console.log("Demo login failed - invalid credentials");
      }
      // ============================================
      // END HARDCODED LOGIN VALIDATION SECTION
      // ============================================
    } catch (error) {
      setLoginError("Error de conexión. Inténtelo nuevamente.");
      console.error("Login error:", error);
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

          {/* ============================================ */}
          {/* DEMO CREDENTIALS DISPLAY - FOR DEVELOPMENT ONLY */}
          {/* TODO: REMOVE THIS SECTION BEFORE PRODUCTION */}
          {/* ============================================ */}
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-amber-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Credenciales Demo - Solo Desarrollo
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="text-xs text-amber-700">
                  <strong>Credenciales disponibles:</strong>
                </div>

                {/* Quick Login Buttons */}
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 justify-start"
                    onClick={() => {
                      form.setValue("email", DEMO_CREDENTIALS.buyer.email);
                      form.setValue(
                        "password",
                        DEMO_CREDENTIALS.buyer.password,
                      );
                    }}
                  >
                    🛒 Comprador Verificado
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 justify-start"
                    onClick={() => {
                      form.setValue(
                        "email",
                        DEMO_CREDENTIALS.buyerPending.email,
                      );
                      form.setValue(
                        "password",
                        DEMO_CREDENTIALS.buyerPending.password,
                      );
                    }}
                  >
                    ⏳ Comprador Pendiente
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 justify-start"
                    onClick={() => {
                      form.setValue("email", DEMO_CREDENTIALS.supplier.email);
                      form.setValue(
                        "password",
                        DEMO_CREDENTIALS.supplier.password,
                      );
                    }}
                  >
                    🏭 Proveedor Verificado
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 justify-start"
                    onClick={() => {
                      form.setValue(
                        "email",
                        DEMO_CREDENTIALS.supplierPending.email,
                      );
                      form.setValue(
                        "password",
                        DEMO_CREDENTIALS.supplierPending.password,
                      );
                    }}
                  >
                    ⏳ Proveedor Pendiente
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 justify-start"
                    onClick={() => {
                      form.setValue(
                        "email",
                        DEMO_CREDENTIALS.supplierRejected.email,
                      );
                      form.setValue(
                        "password",
                        DEMO_CREDENTIALS.supplierRejected.password,
                      );
                    }}
                  >
                    ❌ Proveedor Rechazado
                  </Button>
                </div>

                <div className="text-xs text-amber-600 mt-2">
                  Haz clic en cualquier botón para auto-completar las
                  credenciales
                </div>
              </div>
            </CardContent>
          </Card>
          {/* ============================================ */}
          {/* END DEMO CREDENTIALS DISPLAY SECTION */}
          {/* ============================================ */}

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
