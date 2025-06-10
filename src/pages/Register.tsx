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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableCountrySelect } from "@/components/SearchableCountrySelect";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/Navigation";
import {
  Building2,
  User,
  MapPin,
  Shield,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

// Form validation schema
const formSchema = z
  .object({
    companyName: z
      .string()
      .min(2, "El nombre de la empresa debe tener al menos 2 caracteres"),
    taxId: z.string().min(5, "El número de registro fiscal es requerido"),
    country: z.string().min(1, "Seleccione un país"),
    sector: z.string().min(1, "Seleccione un sector"),
    contactName: z.string().min(2, "El nombre de contacto es requerido"),
    contactPosition: z.string().min(2, "El cargo es requerido"),
    email: z.string().email("Ingrese un email válido"),
    phone: z.string().min(8, "Ingrese un número de teléfono v��lido"),
    street: z.string().min(5, "La dirección es requerida"),
    city: z.string().min(2, "La ciudad es requerida"),
    state: z.string().min(2, "El estado/provincia es requerido"),
    postalCode: z.string().min(3, "El código postal es requerido"),
    fiscalCountry: z.string().min(1, "Seleccione un país"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, "Debe aceptar los términos y condiciones"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

const countriesByRegion = {
  "América Central": [
    "Belice",
    "Costa Rica",
    "El Salvador",
    "Guatemala",
    "Honduras",
    "Nicaragua",
    "Panamá",
  ],
  Caribe: [
    "Antigua y Barbuda",
    "Bahamas",
    "Barbados",
    "Cuba",
    "Dominica",
    "Granada",
    "Haití",
    "Jamaica",
    "República Dominicana",
    "San Cristóbal y Nieves",
    "Santa Lucía",
    "San Vicente y las Granadinas",
    "Trinidad y Tobago",
  ],
  "América del Sur": [
    "Argentina",
    "Bolivia",
    "Brasil",
    "Chile",
    "Colombia",
    "Ecuador",
    "Guyana",
    "Paraguay",
    "Perú",
    "Suriname",
    "Uruguay",
    "Venezuela",
  ],
};

const sectors = [
  "Textil y Confección",
  "Calzado y Cuero",
  "Electrónicos",
  "Hogar y Decoración",
  "Belleza y Cuidado Personal",
  "Deportes y Recreación",
  "Automotriz",
  "Herramientas e Industriales",
  "Alimentos Procesados",
  "Farmacéutico",
  "Juguetes",
  "Muebles",
  "Metales y Minerales",
  "Otros",
];

const steps = [
  { id: 1, title: "Información de la Empresa", icon: Building2 },
  { id: 2, title: "Contacto Principal", icon: User },
  { id: 3, title: "Dirección Fiscal", icon: MapPin },
  { id: 4, title: "Seguridad y Términos", icon: Shield },
];

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      taxId: "",
      country: "",
      sector: "",
      contactName: "",
      contactPosition: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      fiscalCountry: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const progress = (currentStep / steps.length) * 100;

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form submitted:", values);
    setIsSubmitting(false);
    // Here you would typically redirect to a success page or dashboard
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    return fieldsToValidate.every((field) => {
      const value = form.getValues(field as keyof FormValues);
      return value && value !== "";
    });
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return ["companyName", "taxId", "country", "sector"];
      case 2:
        return ["contactName", "contactPosition", "email", "phone"];
      case 3:
        return ["street", "city", "state", "postalCode", "fiscalCountry"];
      case 4:
        return ["password", "confirmPassword", "acceptTerms"];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-zlc-gray-50">
      <Navigation />

      <div className="container-section py-12">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-zlc-gray-900">
              Registro de Empresa
            </h1>
            <p className="text-lg text-zlc-gray-600 mt-2">
              Únase a ZLC Express y acceda a productos al por mayor
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      currentStep >= step.id
                        ? "border-zlc-blue-600 bg-zlc-blue-600 text-white"
                        : "border-zlc-gray-300 bg-white text-zlc-gray-400"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="ml-2 mr-2 h-px flex-1 bg-zlc-gray-300" />
                  )}
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-2" />
            <div className="mt-2 text-center">
              <span className="text-sm text-zlc-gray-600">
                Paso {currentStep} de {steps.length}:{" "}
                {steps[currentStep - 1].title}
              </span>
            </div>
          </div>

          {/* Form */}
          <Card className="shadow-soft-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                {(() => {
                  const StepIcon = steps[currentStep - 1].icon;
                  return (
                    <StepIcon className="mr-2 h-6 w-6 text-zlc-blue-600" />
                  );
                })()}
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Información básica de su empresa"}
                {currentStep === 2 &&
                  "Datos de la persona de contacto principal"}
                {currentStep === 3 && "Dirección fiscal de la empresa"}
                {currentStep === 4 &&
                  "Configure su contraseña y acepte los términos"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Step 1: Company Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre de la Empresa *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ej: Importadora del Caribe S.A."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="taxId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Número de Registro Fiscal (NIT/RUC) *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ej: 3-101-123456"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Ingrese el número de identificación tributaria de
                              su empresa
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>País de Operación *</FormLabel>
                              <FormControl>
                                <SearchableCountrySelect
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  placeholder="Seleccione un país"
                                  countriesByRegion={countriesByRegion}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="sector"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sector o Industria *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccione un sector" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {sectors.map((sector) => (
                                    <SelectItem key={sector} value={sector}>
                                      {sector}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Contact Information */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="contactName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre Completo *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ej: Juan Carlos Pérez"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="contactPosition"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cargo *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ej: Gerente de Compras"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Corporativo *</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="juan.perez@empresa.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Use el email corporativo de su empresa
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Teléfono *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="+506 2234-5678"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Fiscal Address */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dirección *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Ej: Calle 15, Avenida 3-5, Edificio Corporativo, Oficina 502"
                                className="resize-none"
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-6 md:grid-cols-3">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ciudad *</FormLabel>
                              <FormControl>
                                <Input placeholder="Ej: San José" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estado/Provincia *</FormLabel>
                              <FormControl>
                                <Input placeholder="Ej: San José" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Código Postal *</FormLabel>
                              <FormControl>
                                <Input placeholder="Ej: 10101" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="fiscalCountry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>País *</FormLabel>
                            <FormControl>
                              <SearchableCountrySelect
                                value={field.value}
                                onValueChange={field.onChange}
                                placeholder="Seleccione un país"
                                countriesByRegion={countriesByRegion}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 4: Security and Terms */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contraseña *</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Mínimo 8 caracteres"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Use una contraseña segura con al menos 8
                                caracteres
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirmar Contraseña *</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Repita la contraseña"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="rounded-lg bg-zlc-blue-50 p-4">
                          <div className="flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-zlc-blue-600 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium text-zlc-blue-900 mb-1">
                                Proceso de Verificación
                              </p>
                              <p className="text-zlc-blue-700">
                                Su empresa será verificada manualmente antes de
                                obtener acceso completo a la plataforma. Este
                                proceso puede tomar de 1-3 días hábiles.
                              </p>
                            </div>
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="acceptTerms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm">
                                  Acepto los{" "}
                                  <Link
                                    to="/terms"
                                    className="text-zlc-blue-600 underline hover:text-zlc-blue-800"
                                  >
                                    Términos y Condiciones
                                  </Link>{" "}
                                  y la{" "}
                                  <Link
                                    to="/privacy"
                                    className="text-zlc-blue-600 underline hover:text-zlc-blue-800"
                                  >
                                    Política de Privacidad
                                  </Link>
                                  , incluyendo las cláusulas específicas sobre
                                  la Zona Libre de Colón.
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t">
                    <div className="flex items-center space-x-4">
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Anterior
                        </Button>
                      )}

                      <Link
                        to="/login"
                        className="text-sm text-zlc-gray-600 hover:text-zlc-blue-600"
                      >
                        ¿Ya tiene una cuenta? Iniciar sesión
                      </Link>
                    </div>

                    <div>
                      {currentStep < steps.length ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          disabled={!canProceed()}
                          className="bg-zlc-blue-800 hover:bg-zlc-blue-900"
                        >
                          Siguiente
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={isSubmitting || !form.formState.isValid}
                          className="bg-zlc-blue-800 hover:bg-zlc-blue-900"
                        >
                          {isSubmitting
                            ? "Registrando..."
                            : "Registrar Empresa"}
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
