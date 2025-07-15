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
import { Label } from "@/components/ui/label";
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
    phone: z.string().min(8, "Ingrese un número de teléfono válido"),
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

// Supplier-specific form schema
const supplierFormSchema = z
  .object({
    nombreEmpresa: z
      .string()
      .min(2, "El nombre de la empresa debe tener al menos 2 caracteres"),
    ruc: z.string().min(5, "El número de RUC es requerido"),
    sectorIndustria: z.string().min(1, "Seleccione un sector"),
    certificaciones: z.array(z.string()).optional(),
    nombreContacto: z.string().min(2, "El nombre de contacto es requerido"),
    cargo: z.string().min(2, "El cargo es requerido"),
    emailCorporativo: z.string().email("Ingrese un email válido"),
    telefonoContacto: z.string().min(8, "Ingrese un número de teléfono válido"),
    direccion: z.string().min(5, "La dirección es requerida"),
    provincia: z.string().min(2, "La provincia es requerida"),
    ciudad: z.string().min(2, "La ciudad es requerida"),
    codigoPostal: z.string().optional(),
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

type SupplierFormValues = z.infer<typeof supplierFormSchema>;

// Supplier-specific data
const sectoresIndustria = [
  "Textiles y Confección",
  "Calzado y Marroquinería",
  "Metalurgia y Metalmecánica",
  "Alimentos y Bebidas",
  "Productos Químicos",
  "Electrónicos y Tecnología",
  "Muebles y Decoración",
  "Juguetes y Entretenimiento",
  "Cosméticos y Cuidado Personal",
  "Artesanías y Manualidades",
  "Otros",
];

const certificacionesDisponibles = [
  "ISO 9001 - Gestión de Calidad",
  "ISO 14001 - Gestión Ambiental",
  "BSCI - Business Social Compliance Initiative",
  "SEDEX - Supplier Ethical Data Exchange",
  "Licencia ZLC - Zona Libre de Colón",
  "FDA - Administración de Alimentos y Medicamentos",
  "CE - Conformidad Europea",
  "FSC - Forest Stewardship Council",
];

const provinciasPanel = [
  "Panamá",
  "Colón",
  "Chiriquí",
  "Coclé",
  "Darién",
  "Herrera",
  "Los Santos",
  "Veraguas",
];

type FormValues = z.infer<typeof formSchema>;

// Geographic data structure for cascading dropdowns
const geographicData = {
  "Costa Rica": {
    states: {
      "San José": [
        "San José",
        "Escazú",
        "Desamparados",
        "Puriscal",
        "Tarrazú",
        "Aserrí",
        "Mora",
        "Goicoechea",
        "Santa Ana",
        "Alajuelita",
      ],
      Alajuela: [
        "Alajuela",
        "San Ramón",
        "Grecia",
        "San Mateo",
        "Atenas",
        "Naranjo",
        "Palmares",
        "Poás",
        "Orotina",
        "San Carlos",
      ],
      Cartago: [
        "Cartago",
        "Paraíso",
        "La Unión",
        "Jiménez",
        "Turrialba",
        "Alvarado",
        "Oreamuno",
        "El Guarco",
      ],
      Heredia: [
        "Heredia",
        "Barva",
        "Santo Domingo",
        "Santa Bárbara",
        "San Rafael",
        "San Isidro",
        "Belén",
        "Flores",
        "San Pablo",
        "Sarapiquí",
      ],
      Guanacaste: [
        "Liberia",
        "Nicoya",
        "Santa Cruz",
        "Bagaces",
        "Carrillo",
        "Cañas",
        "Abangares",
        "Tilarán",
        "Nandayure",
        "La Cruz",
        "Hojancha",
      ],
      Puntarenas: [
        "Puntarenas",
        "Esparza",
        "Buenos Aires",
        "Montes de Oro",
        "Osa",
        "Aguirre",
        "Golfito",
        "Coto Brus",
        "Parrita",
        "Corredores",
        "Garabito",
      ],
      Limón: ["Limón", "Pococí", "Siquirres", "Talamanca", "Matina", "Guácimo"],
    },
  },
  Panamá: {
    states: {
      Panamá: [
        "Panamá",
        "San Miguelito",
        "Chepo",
        "Chimán",
        "Taboga",
        "Balboa",
      ],
      Coclé: ["Penonomé", "Aguadulce", "Antón", "La Pintada", "Natá", "Olá"],
      Colón: ["Colón", "Chagres", "Donoso", "Portobelo", "Santa Isabel"],
      Chiriquí: [
        "David",
        "Alanje",
        "Barú",
        "Boquerón",
        "Boquete",
        "Bugaba",
        "Dolega",
        "Gualaca",
        "Remedios",
        "Renacimiento",
        "San Félix",
        "San Lorenzo",
        "Tierras Altas",
        "Tolé",
      ],
      Darién: ["La Palma", "Chepigana", "Pinogana"],
      Herrera: [
        "Chitré",
        "Las Minas",
        "Los Pozos",
        "Ocú",
        "Parita",
        "Pesé",
        "Santa María",
      ],
      "Los Santos": [
        "Las Tablas",
        "Guararé",
        "Los Santos",
        "Macaracas",
        "Pedasí",
        "Pocrí",
        "Tonosí",
      ],
      Veraguas: [
        "Santiago",
        "Atalaya",
        "Calobre",
        "Cañazas",
        "La Mesa",
        "Las Palmas",
        "Mariato",
        "Montijo",
        "Río de Jesús",
        "San Francisco",
        "Santa Fé",
        "Soná",
      ],
    },
  },
  Guatemala: {
    states: {
      Guatemala: [
        "Guatemala",
        "Santa Catarina Pinula",
        "San José Pinula",
        "San José del Golfo",
        "Palencia",
        "Chinautla",
        "San Pedro Ayampuc",
        "Mixco",
        "San Pedro Sacatepéquez",
        "San Juan Sacatepéquez",
        "San Raymundo",
        "Chuarrancho",
        "Fraijanes",
        "Amatitlán",
        "Villa Nueva",
        "Villa Canales",
        "Petapa",
      ],
      Sacatepéquez: [
        "Antigua Guatemala",
        "Jocotenango",
        "Pastores",
        "Sumpango",
        "Santo Domingo Xenacoj",
        "Santiago Sacatepéquez",
        "San Bartolomé Milpas Altas",
        "San Lucas Sacatepéquez",
        "Santa Lucía Milpas Altas",
        "Magdalena Milpas Altas",
        "Santa María de Jesús",
        "Ciudad Vieja",
        "San Miguel Dueñas",
        "Alotenango",
        "San Antonio Aguas Calientes",
        "Santa Catarina Barahona",
      ],
      Chimaltenango: [
        "Chimaltenango",
        "San José Poaquil",
        "San Martín Jilotepeque",
        "Comalapa",
        "Santa Apolonia",
        "Tecpán",
        "Patzún",
        "Pochuta",
        "Patzicía",
        "Santa Cruz Balanyá",
        "Acatenango",
        "Yepocapa",
        "San Andrés Itzapa",
        "Parramos",
        "Zaragoza",
        "El Tejar",
      ],
      Escuintla: [
        "Escuintla",
        "Santa Lucía Cotzumalguapa",
        "La Democracia",
        "Siquinalá",
        "Masagua",
        "Tiquisate",
        "La Gomera",
        "Guanagazapa",
        "San José",
        "Iztapa",
        "Palín",
        "San Vicente Pacaya",
        "Nueva Concepción",
      ],
      Quetzaltenango: [
        "Quetzaltenango",
        "Salcajá",
        "Olintepeque",
        "San Carlos Sija",
        "Sibilia",
        "Cabricán",
        "Cajolá",
        "San Miguel Sigüilá",
        "Ostuncalco",
        "San Mateo",
        "Concepción Chiquirichapa",
        "San Martín Sacatepéquez",
        "Almolonga",
        "Cantel",
        "Huitán",
        "Zunil",
        "Colomba Costa Cuca",
        "San Francisco La Unión",
        "El Palmar",
        "Coatepeque",
        "Génova",
        "Flores Costa Cuca",
        "La Esperanza",
        "Palestina de Los Altos",
      ],
    },
  },
};

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
  { id: 1, title: "Informaci��n de la Empresa", icon: Building2 },
  { id: 2, title: "Contacto Principal", icon: User },
  { id: 3, title: "Dirección Fiscal", icon: MapPin },
  { id: 4, title: "Seguridad y Términos", icon: Shield },
];

export default function Register() {
  const [userType, setUserType] = useState<"buyer" | "supplier" | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Geographic cascade state
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Email validation warning state
  const [emailWarning, setEmailWarning] = useState(false);

  // Supplier-specific state
  const [selectedCertifications, setSelectedCertifications] = useState<
    string[]
  >([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);

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

  const supplierForm = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      nombreEmpresa: "",
      ruc: "",
      sectorIndustria: "",
      certificaciones: [],
      nombreContacto: "",
      cargo: "",
      emailCorporativo: "",
      telefonoContacto: "",
      direccion: "",
      provincia: "",
      ciudad: "",
      codigoPostal: "",
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
    console.log("Buyer form submitted:", values);
    setIsSubmitting(false);
    // Here you would typically redirect to a success page or dashboard
  };

  const onSupplierSubmit = async (values: SupplierFormValues) => {
    setIsSubmitting(true);
    // Simulate API call with supplier data
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Supplier form submitted:", {
      ...values,
      paisOperacion: "Panamá", // Hidden field
      paisDireccion: "Panamá", // Hidden field
      documentosAdjuntos: uploadedDocuments,
    });
    setIsSubmitting(false);
    // Redirect to verification pending page
  };

  const nextStep = () => {
    // Special validation for step 2 (email field)
    if (currentStep === 2) {
      const emailValue =
        userType === "supplier"
          ? supplierForm.getValues("emailCorporativo")
          : form.getValues("email");
      if (!emailValue || !emailValue.includes("@")) {
        setEmailWarning(true);
        // Auto-hide warning after 3 seconds
        setTimeout(() => {
          setEmailWarning(false);
        }, 3000);
        return; // Don't advance to next step
      }
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Geographic cascade functions
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedState("");
    setAvailableCities([]);
    form.setValue("fiscalCountry", country);
    form.setValue("state", "");
    form.setValue("city", "");

    if (geographicData[country as keyof typeof geographicData]) {
      setAvailableStates(
        Object.keys(
          geographicData[country as keyof typeof geographicData].states,
        ),
      );
    } else {
      setAvailableStates([]);
    }
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    form.setValue("state", state);
    form.setValue("city", "");

    if (
      selectedCountry &&
      geographicData[selectedCountry as keyof typeof geographicData]
    ) {
      const countryData =
        geographicData[selectedCountry as keyof typeof geographicData];
      setAvailableCities(countryData.states[state] || []);
    } else {
      setAvailableCities([]);
    }
  };

  const handleCityChange = (city: string) => {
    form.setValue("city", city);
  };

  // Supplier-specific functions
  const handleCertificationChange = (
    certification: string,
    checked: boolean,
  ) => {
    if (checked) {
      setSelectedCertifications([...selectedCertifications, certification]);
    } else {
      setSelectedCertifications(
        selectedCertifications.filter((c) => c !== certification),
      );
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      setUploadedDocuments([...uploadedDocuments, ...Array.from(files)]);
    }
  };

  const removeDocument = (index: number) => {
    setUploadedDocuments(uploadedDocuments.filter((_, i) => i !== index));
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

      <div className="container-section pt-20 pb-12">
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

          {/* User Type Selection */}
          {!userType && (
            <div className="mb-8">
              <Card className="bg-white border border-zlc-gray-200 shadow-sm rounded-xl">
                <CardHeader>
                  <CardTitle className="text-center">
                    ¿Qué tipo de usuario es usted?
                  </CardTitle>
                  <CardDescription className="text-center">
                    Seleccione el tipo de cuenta que desea crear
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 ">
                    <Button
                      variant="outline"
                      className="h-24 p-6 border-2 hover:border-zlc-blue-600 hover:bg-zlc-blue-50 "
                      onClick={() => setUserType("buyer")}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <User className="h-8 w-8 text-zlc-blue-600" />
                        <div>
                          <h3 className="font-semibold">Soy Comprador</h3>
                          <p className="text-sm text-gray-600">
                            Busco productos al por mayor
                          </p>
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 p-6 border-2 hover:border-zlc-blue-600 hover:bg-zlc-blue-50"
                      onClick={() => setUserType("supplier")}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Building2 className="h-8 w-8 text-zlc-blue-600" />
                        <div>
                          <h3 className="font-semibold">Soy Proveedor</h3>
                          <p className="text-sm text-gray-600">
                            Vendo productos desde ZLC
                          </p>
                        </div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Registration Forms */}
          {userType && (
            <>
              {/* Back to User Selection */}
              <div className="mb-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setUserType(null);
                    setCurrentStep(1);
                  }}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Cambiar tipo de usuario
                </Button>
              </div>

              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4 ">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center ">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300  ${
                          currentStep >= step.id
                            ? "border-gray-300 bg-blue-600 text-white"
                            : "border-gray-300 bg-blue-600 text-white"
                        }`}
                      >
                        {currentStep > step.id ? (
                          <CheckCircle className="h-5 w-5 " />
                        ) : (
                          <step.icon className="h-5 w-5 " />
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div className="ml-2 mr-2 h-px flex-1 bg-gray-300" />
                      )}
                    </div>
                  ))}
                </div>

                <Progress value={progress} className="h-2 bg-blue-600 " />
                <div className="mt-2 text-center ">
                  <span className="text-sm text-gray-600  ">
                    Paso {currentStep} de {steps.length}:{" "}
                    {steps[currentStep - 1].title}
                  </span>
                </div>
              </div>

              {/* Form */}
              <Card className="bg-white border border-gray-200 shadow-md rounded-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    {(() => {
                      const StepIcon = steps[currentStep - 1].icon;
                      return (
                        <StepIcon className="mr-2 h-6 w-6 text-gray-800" />
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
                  {/* Buyer Form */}
                  {userType === "buyer" && (
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
                                      className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
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
                                      className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
                                      placeholder="Ej: 3-101-123456"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Ingrese el número de identificación
                                    tributaria de su empresa
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid gap-6 md:grid-cols-2 ">
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
                                        className="h-12 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zlc-blue-500"
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
                                        <SelectTrigger className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 rounded-lg h-11">
                                          <SelectValue placeholder="Seleccione un sector" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {sectors.map((sector) => (
                                          <SelectItem
                                            key={sector}
                                            value={sector}
                                          >
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
                                        className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
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
                                        className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
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
                                        className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
                                        type="email"
                                        placeholder="nombre@empresa.com"
                                        {...field}
                                        required
                                        onChange={(e) => {
                                          field.onChange(e);
                                          // Hide warning when user starts typing
                                          if (emailWarning) {
                                            setEmailWarning(false);
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Debe incluir "@" - Use el email
                                      corporativo de su empresa
                                    </FormDescription>
                                    <FormMessage />

                                    {/* Email validation warning */}
                                    {emailWarning && (
                                      <div className="relative">
                                        <div className="absolute top-2 left-0 right-0 z-10">
                                          <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg border border-red-600 relative animate-in fade-in duration-300">
                                            <div className="flex items-center gap-2">
                                              <AlertCircle className="h-4 w-4" />
                                              <span className="text-sm font-medium">
                                                Por favor ingrese un email
                                                válido que contenga "@"
                                              </span>
                                            </div>
                                            {/* Arrow pointing up to the input */}
                                            <div className="absolute -top-2 left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-red-500"></div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
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
                                        className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
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
                                      className="resize-none border border-black"
                                      rows={3}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* País - Estado - Ciudad in correct order */}
                            <FormField
                              control={form.control}
                              name="fiscalCountry"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>País *</FormLabel>
                                  <FormControl>
                                    <Select
                                      value={field.value}
                                      onValueChange={(value) => {
                                        field.onChange(value);
                                        handleCountryChange(value);
                                      }}
                                    >
                                      <SelectTrigger className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 rounded-lg h-11">
                                        <SelectValue placeholder="Seleccione un país" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Object.keys(geographicData).map(
                                          (country) => (
                                            <SelectItem
                                              key={country}
                                              value={country}
                                            >
                                              {country}
                                            </SelectItem>
                                          ),
                                        )}
                                        {/* Add other Central American countries without full data */}
                                        <SelectItem value="El Salvador">
                                          El Salvador
                                        </SelectItem>
                                        <SelectItem value="Honduras">
                                          Honduras
                                        </SelectItem>
                                        <SelectItem value="Nicaragua">
                                          Nicaragua
                                        </SelectItem>
                                        <SelectItem value="Belice">
                                          Belice
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid gap-6 md:grid-cols-2">
                              <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Estado/Provincia *</FormLabel>
                                    <FormControl>
                                      <Select
                                        value={field.value}
                                        onValueChange={(value) => {
                                          field.onChange(value);
                                          handleStateChange(value);
                                        }}
                                        disabled={
                                          !selectedCountry ||
                                          availableStates.length === 0
                                        }
                                      >
                                        <SelectTrigger className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 rounded-lg h-11">
                                          <SelectValue
                                            placeholder={
                                              !selectedCountry
                                                ? "Primero seleccione un país"
                                                : availableStates.length === 0
                                                  ? "No hay datos disponibles"
                                                  : "Seleccione estado/provincia"
                                            }
                                          />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {availableStates.map((state) => (
                                            <SelectItem
                                              key={state}
                                              value={state}
                                            >
                                              {state}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Ciudad *</FormLabel>
                                    <FormControl>
                                      <Select
                                        value={field.value}
                                        onValueChange={(value) => {
                                          field.onChange(value);
                                          handleCityChange(value);
                                        }}
                                        disabled={
                                          !selectedState ||
                                          availableCities.length === 0
                                        }
                                      >
                                        <SelectTrigger className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 rounded-lg h-11">
                                          <SelectValue
                                            placeholder={
                                              !selectedState
                                                ? "Primero seleccione estado/provincia"
                                                : availableCities.length === 0
                                                  ? "No hay datos disponibles"
                                                  : "Seleccione ciudad"
                                            }
                                          />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {availableCities.map((city) => (
                                            <SelectItem key={city} value={city}>
                                              {city}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="postalCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Código Postal *</FormLabel>
                                  <FormControl>
                                    <Input
                                      className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
                                      placeholder="Ej: 10101"
                                      {...field}
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
                                        className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
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
                                    <FormLabel>
                                      Confirmar Contraseña *
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
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
                                      Su empresa será verificada manualmente
                                      antes de obtener acceso completo a la
                                      plataforma. Este proceso puede tomar de
                                      1-3 días hábiles.
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
                                        , incluyendo las cláusulas espec��ficas
                                        sobre la Zona Libre de Colón.
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
                                className="border-2 border-zlc-gray-300 text-zlc-gray-700 hover:border-zlc-blue-500 hover:bg-zlc-blue-50 hover:text-zlc-blue-700 transition-all duration-200"
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
                                className="bg-zlc-blue-600 hover:bg-zlc-blue-700 border-2 border-zlc-blue-600 hover:border-zlc-blue-700 shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Siguiente
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                type="submit"
                                disabled={
                                  isSubmitting || !form.formState.isValid
                                }
                                className="bg-zlc-blue-600 hover:bg-zlc-blue-700 border-2 border-zlc-blue-600 hover:border-zlc-blue-700 shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  )}

                  {/* Supplier Form */}
                  {userType === "supplier" && (
                    <Form {...supplierForm}>
                      <form
                        onSubmit={supplierForm.handleSubmit(onSupplierSubmit)}
                        className="space-y-6"
                      >
                        {/* Step 1: Company Information */}
                        {currentStep === 1 && (
                          <div className="space-y-6">
                            <FormField
                              control={supplierForm.control}
                              name="nombreEmpresa"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Nombre Legal de la Empresa *
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
                                      placeholder="Ej: Textiles Modernos S.A."
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid gap-6 md:grid-cols-2">
                              <FormField
                                control={supplierForm.control}
                                name="ruc"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Número de RUC *</FormLabel>
                                    <FormControl>
                                      <Input
                                        className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
                                        placeholder="Ej: 8-123-12345"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={supplierForm.control}
                                name="sectorIndustria"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Sector Industrial *</FormLabel>
                                    <FormControl>
                                      <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                      >
                                        <SelectTrigger className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 rounded-lg h-11">
                                          <SelectValue placeholder="Seleccione un sector" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {sectoresIndustria.map((sector) => (
                                            <SelectItem
                                              key={sector}
                                              value={sector}
                                            >
                                              {sector}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            {/* Certifications */}
                            <div>
                              <Label className="text-base font-medium">
                                Certificaciones (Opcional)
                              </Label>
                              <p className="text-sm text-gray-600 mb-3">
                                Seleccione las certificaciones que posee su
                                empresa
                              </p>
                              <div className="grid gap-3 md:grid-cols-2">
                                {certificacionesDisponibles.map((cert) => (
                                  <div
                                    key={cert}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={cert}
                                      checked={selectedCertifications.includes(
                                        cert,
                                      )}
                                      onCheckedChange={(checked) =>
                                        handleCertificationChange(
                                          cert,
                                          checked as boolean,
                                        )
                                      }
                                    />
                                    <Label htmlFor={cert} className="text-sm">
                                      {cert}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Document Upload */}
                            <div>
                              <Label className="text-base font-medium">
                                Documentos Requeridos
                              </Label>
                              <p className="text-sm text-gray-600 mb-3">
                                Adjunte los documentos necesarios para la
                                verificación
                              </p>
                              <Input
                                type="file"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) =>
                                  handleFileUpload(e.target.files)
                                }
                                className="mb-3 border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-zlc-blue-50 file:text-zlc-blue-700 hover:file:bg-zlc-blue-100"
                              />
                              {uploadedDocuments.length > 0 && (
                                <div className="space-y-2">
                                  <p className="text-sm font-medium">
                                    Documentos adjuntos:
                                  </p>
                                  {uploadedDocuments.map((doc, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                    >
                                      <span className="text-sm">
                                        {doc.name}
                                      </span>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeDocument(index)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                                      >
                                        <AlertCircle className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div className="mt-2 text-xs text-gray-500">
                                <p>Documentos requeridos:</p>
                                <ul className="list-disc list-inside mt-1">
                                  <li>Licencia ZLC (obligatorio)</li>
                                  <li>Certificados ISO (si aplica)</li>
                                  <li>Registro del representante legal</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step 2: Main Contact */}
                        {currentStep === 2 && (
                          <div className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                              <FormField
                                control={supplierForm.control}
                                name="nombreContacto"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nombre Completo *</FormLabel>
                                    <FormControl>
                                      <Input
                                        className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
                                        placeholder="Ej: Juan Carlos Pérez"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={supplierForm.control}
                                name="cargo"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Cargo *</FormLabel>
                                    <FormControl>
                                      <Input
                                        className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
                                        placeholder="Ej: Gerente de Ventas"
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
                                control={supplierForm.control}
                                name="emailCorporativo"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email Corporativo *</FormLabel>
                                    <FormControl>
                                      <Input
                                        className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
                                        type="email"
                                        placeholder="nombre@empresa.com"
                                        {...field}
                                        required
                                        onChange={(e) => {
                                          field.onChange(e);
                                          if (emailWarning) {
                                            setEmailWarning(false);
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Debe incluir "@" - Use el email
                                      corporativo de su empresa
                                    </FormDescription>
                                    <FormMessage />

                                    {/* Email validation warning */}
                                    {emailWarning && (
                                      <div className="relative">
                                        <div className="absolute top-2 left-0 right-0 z-10">
                                          <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg border border-red-600 relative animate-in fade-in duration-300">
                                            <div className="flex items-center gap-2">
                                              <AlertCircle className="h-4 w-4" />
                                              <span className="text-sm font-medium">
                                                Por favor ingrese un email
                                                válido que contenga "@"
                                              </span>
                                            </div>
                                            <div className="absolute -top-2 left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-red-500"></div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={supplierForm.control}
                                name="telefonoContacto"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      Teléfono de Contacto *
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
                                        placeholder="Ej: +507 6234-5678"
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
                              control={supplierForm.control}
                              name="direccion"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Dirección Física *</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Ej: Zona Libre de Colón, Sector Norte, Edificio 123, Oficina 456"
                                      className="resize-none"
                                      rows={3}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid gap-6 md:grid-cols-2">
                              <FormField
                                control={supplierForm.control}
                                name="provincia"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Provincia *</FormLabel>
                                    <FormControl>
                                      <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                      >
                                        <SelectTrigger className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 rounded-lg h-11">
                                          <SelectValue placeholder="Seleccione provincia" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {provinciasPanel.map((provincia) => (
                                            <SelectItem
                                              key={provincia}
                                              value={provincia}
                                            >
                                              {provincia}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={supplierForm.control}
                                name="ciudad"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Ciudad *</FormLabel>
                                    <FormControl>
                                      <Input
                                        className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
                                        placeholder="Ej: Colón"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={supplierForm.control}
                              name="codigoPostal"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Código Postal (Opcional)
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      className="border-2 border-zlc-gray-200 bg-white text-zlc-gray-900 focus:border-zlc-blue-500 focus:ring-2 focus:ring-zlc-blue-200 transition-all duration-200 placeholder:text-zlc-gray-400 rounded-lg h-11"
                                      placeholder="Ej: 50000"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <strong>Nota:</strong> Su empresa debe estar
                                registrada en Panamá para operar en la Zona
                                Libre de Colón.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Step 4: Security and Terms */}
                        {currentStep === 4 && (
                          <div className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                              <FormField
                                control={supplierForm.control}
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
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={supplierForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      Confirmar Contraseña *
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="password"
                                        placeholder="Repita su contraseña"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={supplierForm.control}
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
                                    <FormLabel>
                                      Acepto los{" "}
                                      <Link
                                        to="/terms"
                                        className="text-zlc-blue-600 hover:underline"
                                      >
                                        Términos y Condiciones
                                      </Link>{" "}
                                      y las{" "}
                                      <Link
                                        to="/privacy"
                                        className="text-zlc-blue-600 hover:underline"
                                      >
                                        Políticas de Privacidad
                                      </Link>
                                    </FormLabel>
                                    <FormDescription>
                                      Incluye políticas logísticas y aduaneras
                                      de ZLC
                                    </FormDescription>
                                    <FormMessage />
                                  </div>
                                </FormItem>
                              )}
                            />

                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                              <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-amber-700 mt-0.5" />
                                <div>
                                  <h4 className="font-medium text-amber-900">
                                    Proceso de Verificación
                                  </h4>
                                  <p className="text-sm text-amber-800 mt-1">
                                    Su empresa será verificada manualmente. El
                                    proceso puede tardar de{" "}
                                    <strong>1 a 3 días hábiles</strong>.
                                    Recibirá una notificación por correo
                                    electrónico con el resultado de la
                                    verificación.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="border-2 border-zlc-gray-300 text-zlc-gray-700 hover:border-zlc-blue-500 hover:bg-zlc-blue-50 hover:text-zlc-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Anterior
                          </Button>

                          {currentStep < steps.length ? (
                            <Button
                              type="button"
                              onClick={nextStep}
                              className="bg-zlc-blue-600 hover:bg-zlc-blue-700 border-2 border-zlc-blue-600 hover:border-zlc-blue-700 shadow-md transition-all duration-200"
                            >
                              Siguiente
                              <ArrowRight className="ml-2 h-4 w-4 " />
                            </Button>
                          ) : (
                            <Button
                              type="submit"
                              disabled={
                                isSubmitting || !supplierForm.formState.isValid
                              }
                              className="bg-zlc-blue-600 hover:bg-zlc-blue-700 border-2 border-zlc-blue-600 hover:border-zlc-blue-700 shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSubmitting
                                ? "Registrando..."
                                : "Enviar Solicitud"}
                            </Button>
                          )}
                        </div>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
