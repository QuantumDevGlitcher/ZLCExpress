import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navigation } from "@/components/Navigation";
import {
  Package,
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  Plus,
  Minus,
  FileText,
  DollarSign,
  Box,
  Calendar,
  Settings,
  Info,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";

// Form validation schema
const productFormSchema = z.object({
  // Basic Data
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  code: z.string().min(5, "El código debe tener al menos 5 caracteres"),
  category: z.string().min(1, "Seleccione una categoría"),
  description: z
    .string()
    .min(20, "La descripción debe tener al menos 20 caracteres"),

  // Container Specifications
  containerType: z.enum(["20GP", "40HQ", "40HC"]),
  unitsPerContainer: z
    .number()
    .min(1, "Debe especificar unidades por contenedor"),
  grossWeight: z.number().min(1, "Peso bruto requerido"),
  netWeight: z.number().min(1, "Peso neto requerido"),
  volume: z.number().min(0.1, "Volumen requerido"),
  packagingType: z.string().min(1, "Tipo de empaquetado requerido"),

  // Pricing and Incoterms
  pricePerContainer: z.number().min(1, "Precio por contenedor requerido"),
  unitPrice: z.number().min(0.01, "Precio unitario requerido"),
  currency: z.enum(["USD", "EUR"]),
  incoterm: z.enum(["FOB ZLC", "CIF", "EXW"]),
  productionTime: z.number().min(1, "Tiempo de producción requerido"),
  packagingTime: z.number().min(1, "Tiempo de embalaje requerido"),
  moq: z.number().min(1, "MOQ debe ser al menos 1"),
  stockContainers: z.number().min(0, "Stock no puede ser negativo"),

  // Additional Options
  isNegotiable: z.boolean(),
  allowsCustomOrders: z.boolean(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface VolumeDiscount {
  minQuantity: number;
  discountPercentage: number;
}

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: string;
}

export default function SupplierCreateProduct() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File uploads
  const [productImages, setProductImages] = useState<UploadedFile[]>([]);
  const [qualityDocuments, setQualityDocuments] = useState<UploadedFile[]>([]);

  // Volume discounts
  const [volumeDiscounts, setVolumeDiscounts] = useState<VolumeDiscount[]>([
    { minQuantity: 2, discountPercentage: 5 },
  ]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      code: "",
      category: "",
      description: "",
      containerType: "20GP",
      unitsPerContainer: 0,
      grossWeight: 0,
      netWeight: 0,
      volume: 0,
      packagingType: "",
      pricePerContainer: 0,
      unitPrice: 0,
      currency: "USD",
      incoterm: "FOB ZLC",
      productionTime: 15,
      packagingTime: 5,
      moq: 1,
      stockContainers: 0,
      isNegotiable: true,
      allowsCustomOrders: false,
    },
  });

  const steps = [
    { id: 1, title: "Datos Básicos", icon: Package },
    { id: 2, title: "Especificaciones", icon: Box },
    { id: 3, title: "Precios e Incoterms", icon: DollarSign },
    { id: 4, title: "Opciones Adicionales", icon: Settings },
  ];

  const categories = [
    "Ropa",
    "Calzado",
    "Metales",
    "Madera",
    "Electrónicos",
    "Hogar y Jardín",
    "Deportes",
    "Juguetes",
    "Alimentos",
    "Otros",
  ];

  const containerSpecs = {
    "20GP": {
      name: "20' GP (General Purpose)",
      dimensions: "5.9 x 2.35 x 2.39 m",
      volume: "33.2 m³",
      maxWeight: "28,230 kg",
    },
    "40HQ": {
      name: "40' HQ (High Cube)",
      dimensions: "12.03 x 2.35 x 2.70 m",
      volume: "76.3 m³",
      maxWeight: "26,700 kg",
    },
    "40HC": {
      name: "40' HC (High Container)",
      dimensions: "12.03 x 2.35 x 2.39 m",
      volume: "67.7 m³",
      maxWeight: "26,700 kg",
    },
  };

  const progress = (currentStep / steps.length) * 100;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    files.forEach((file) => {
      const newImage: UploadedFile = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
      };
      setProductImages((prev) => [...prev, newImage]);
    });
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    files.forEach((file) => {
      const newDoc: UploadedFile = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
      };
      setQualityDocuments((prev) => [...prev, newDoc]);
    });
  };

  const removeImage = (id: string) => {
    setProductImages((prev) => prev.filter((img) => img.id !== id));
  };

  const removeDocument = (id: string) => {
    setQualityDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const addVolumeDiscount = () => {
    setVolumeDiscounts([
      ...volumeDiscounts,
      { minQuantity: 0, discountPercentage: 0 },
    ]);
  };

  const removeVolumeDiscount = (index: number) => {
    setVolumeDiscounts(volumeDiscounts.filter((_, i) => i !== index));
  };

  const updateVolumeDiscount = (
    index: number,
    field: keyof VolumeDiscount,
    value: number,
  ) => {
    setVolumeDiscounts(
      volumeDiscounts.map((discount, i) =>
        i === index ? { ...discount, [field]: value } : discount,
      ),
    );
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

  const onSubmit = async (values: ProductFormValues, asDraft = false) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const productData = {
        ...values,
        images: productImages,
        qualityDocuments: qualityDocuments,
        volumeDiscounts: volumeDiscounts,
        status: asDraft ? "draft" : "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("Product created:", productData);

      // Navigate back to products list
      navigate("/supplier/products");
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="pt-16">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/supplier/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Mis Lotes
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Crear Nuevo Lote
              </h1>
              <p className="text-gray-600">
                Complete la información de su producto por contenedor
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                        currentStep >= step.id
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300 bg-white text-gray-400"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-1 w-full mx-4 ${
                          currentStep > step.id ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between mt-2">
                {steps.map((step) => (
                  <span
                    key={step.id}
                    className={`text-sm ${
                      currentStep >= step.id
                        ? "text-blue-600 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Form */}
          <Form {...form}>
            <form className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {React.createElement(
                      steps.find((s) => s.id === currentStep)?.icon || Package,
                      { className: "h-5 w-5" },
                    )}
                    {steps.find((s) => s.id === currentStep)?.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Step 1: Basic Data */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre del Lote *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ej: Camisetas 100% Algodón Premium"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Código Interno *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ej: CAM-ALG-20GP-0500"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Código único para identificar este lote
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categoría *</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione una categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
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
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descripción Detallada *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Ej: 5000 camisetas 100% algodón, tallas S-XL, colores mixtos..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Incluya detalles como cantidades, tallas, colores,
                              materiales, etc.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Product Images */}
                      <div>
                        <Label className="text-base font-medium">
                          Fotos del Producto *
                        </Label>
                        <p className="text-sm text-gray-600 mb-3">
                          Mínimo 3 fotos: producto, ejemplo de contenedor,
                          empaquetado
                        </p>

                        <Input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="mb-3"
                        />

                        {productImages.length > 0 && (
                          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                            {productImages.map((image) => (
                              <div key={image.id} className="relative group">
                                <img
                                  src={image.url}
                                  alt={image.name}
                                  className="w-full h-20 object-cover rounded border"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(image.id)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {productImages.length < 3 && (
                          <div className="flex items-center gap-2 mt-2 text-orange-600">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm">
                              Se requieren al menos 3 imágenes
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Container Specifications */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="containerType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Contenedor *</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione tipo de contenedor" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(containerSpecs).map(
                                    ([key, spec]) => (
                                      <SelectItem key={key} value={key}>
                                        <div>
                                          <div className="font-medium">
                                            {spec.name}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            {spec.dimensions} • {spec.volume} •
                                            Max: {spec.maxWeight}
                                          </div>
                                        </div>
                                      </SelectItem>
                                    ),
                                  )}
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
                          name="unitsPerContainer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Unidades por Contenedor (MOQ) *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Ej: 5000"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseInt(e.target.value) || 0,
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="packagingType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de Empaquetado *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ej: Paletas de madera, cajas de cartón"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid gap-6 md:grid-cols-3">
                        <FormField
                          control={form.control}
                          name="grossWeight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Peso Bruto (kg) *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.1"
                                  placeholder="Ej: 15000"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value) || 0,
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="netWeight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Peso Neto (kg) *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.1"
                                  placeholder="Ej: 12500"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value) || 0,
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="volume"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Volumen (m³) *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.1"
                                  placeholder="Ej: 30.5"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value) || 0,
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {form.watch("containerType") && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">
                            Especificaciones del Contenedor Seleccionado
                          </h4>
                          <div className="text-sm text-blue-700">
                            <p>
                              <strong>Tipo:</strong>{" "}
                              {
                                containerSpecs[
                                  form.watch(
                                    "containerType",
                                  ) as keyof typeof containerSpecs
                                ]?.name
                              }
                            </p>
                            <p>
                              <strong>Dimensiones:</strong>{" "}
                              {
                                containerSpecs[
                                  form.watch(
                                    "containerType",
                                  ) as keyof typeof containerSpecs
                                ]?.dimensions
                              }
                            </p>
                            <p>
                              <strong>Volumen máximo:</strong>{" "}
                              {
                                containerSpecs[
                                  form.watch(
                                    "containerType",
                                  ) as keyof typeof containerSpecs
                                ]?.volume
                              }
                            </p>
                            <p>
                              <strong>Peso máximo:</strong>{" "}
                              {
                                containerSpecs[
                                  form.watch(
                                    "containerType",
                                  ) as keyof typeof containerSpecs
                                ]?.maxWeight
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 3: Pricing and Incoterms */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="pricePerContainer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Precio por Contenedor *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="Ej: 12500"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value) || 0,
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="unitPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Precio Unitario Equivalente *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="Ej: 2.50"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value) || 0,
                                    )
                                  }
                                />
                              </FormControl>
                              <FormDescription>
                                Precio por unidad individual como referencia
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="currency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Moneda *</FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccione moneda" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="USD">
                                      USD - Dólar Estadounidense
                                    </SelectItem>
                                    <SelectItem value="EUR">
                                      EUR - Euro
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="incoterm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Incoterm Ofrecido *</FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccione Incoterm" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="FOB ZLC">
                                      FOB ZLC
                                    </SelectItem>
                                    <SelectItem value="CIF">CIF</SelectItem>
                                    <SelectItem value="EXW">EXW</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Production and Packaging Time */}
                      <div className="grid gap-6 md:grid-cols-3">
                        <FormField
                          control={form.control}
                          name="productionTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Tiempo de Producción (días) *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Ej: 20"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseInt(e.target.value) || 0,
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="packagingTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tiempo de Embalaje (días) *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Ej: 5"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseInt(e.target.value) || 0,
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex flex-col">
                          <Label className="text-sm font-medium mb-2">
                            Tiempo Total Estimado
                          </Label>
                          <div className="h-10 bg-gray-50 border rounded-md flex items-center px-3">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm">
                              {(form.watch("productionTime") || 0) +
                                (form.watch("packagingTime") || 0)}{" "}
                              días
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Volume Discounts */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <Label className="text-base font-medium">
                            Descuentos por Volumen
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addVolumeDiscount}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Añadir Descuento
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {volumeDiscounts.map((discount, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 border rounded-lg"
                            >
                              <div className="flex-1 grid grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-xs">
                                    Cantidad Mínima
                                  </Label>
                                  <Input
                                    type="number"
                                    placeholder="Ej: 2"
                                    value={discount.minQuantity || ""}
                                    onChange={(e) =>
                                      updateVolumeDiscount(
                                        index,
                                        "minQuantity",
                                        parseInt(e.target.value) || 0,
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">
                                    Descuento (%)
                                  </Label>
                                  <Input
                                    type="number"
                                    placeholder="Ej: 5"
                                    value={discount.discountPercentage || ""}
                                    onChange={(e) =>
                                      updateVolumeDiscount(
                                        index,
                                        "discountPercentage",
                                        parseFloat(e.target.value) || 0,
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeVolumeDiscount(index)}
                                disabled={volumeDiscounts.length === 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="moq"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>MOQ (Contenedores) *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Ej: 1"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseInt(e.target.value) || 0,
                                    )
                                  }
                                />
                              </FormControl>
                              <FormDescription>
                                Cantidad mínima de contenedores por orden
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="stockContainers"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Stock Disponible (Contenedores) *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Ej: 10"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseInt(e.target.value) || 0,
                                    )
                                  }
                                />
                              </FormControl>
                              <FormDescription>
                                Cantidad disponible inmediatamente
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 4: Additional Options */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="isNegotiable"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Habilitar "Negociable"</FormLabel>
                                <FormDescription>
                                  Permite que los compradores envíen ofertas y
                                  negocien precios
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="allowsCustomOrders"
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
                                  Habilitar "Orden Personalizada"
                                </FormLabel>
                                <FormDescription>
                                  Acepta mezclas de tallas, cambios de
                                  especificación y personalizaciones
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Quality Documentation */}
                      <div>
                        <Label className="text-base font-medium">
                          Documentación de Calidad
                        </Label>
                        <p className="text-sm text-gray-600 mb-3">
                          Adjunte certificados ISO, certificados de origen,
                          fichas técnicas, etc.
                        </p>

                        <Input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleDocumentUpload}
                          className="mb-3"
                        />

                        {qualityDocuments.length > 0 && (
                          <div className="space-y-2">
                            {qualityDocuments.map((doc) => (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between p-3 border rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <FileText className="h-5 w-5 text-gray-500" />
                                  <span className="text-sm font-medium">
                                    {doc.name}
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeDocument(doc.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Summary */}
                      <div className="p-4 bg-gray-50 border rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Resumen del Lote
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Nombre:</span>
                            <span className="ml-2 font-medium">
                              {form.watch("name") || "Sin especificar"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Código:</span>
                            <span className="ml-2 font-medium">
                              {form.watch("code") || "Sin especificar"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Contenedor:</span>
                            <span className="ml-2 font-medium">
                              {containerSpecs[
                                form.watch(
                                  "containerType",
                                ) as keyof typeof containerSpecs
                              ]?.name || "Sin especificar"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Precio:</span>
                            <span className="ml-2 font-medium">
                              $
                              {form
                                .watch("pricePerContainer")
                                ?.toLocaleString() || 0}{" "}
                              {form.watch("currency")} {form.watch("incoterm")}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">
                              Unidades/Contenedor:
                            </span>
                            <span className="ml-2 font-medium">
                              {form
                                .watch("unitsPerContainer")
                                ?.toLocaleString() || 0}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Tiempo Total:</span>
                            <span className="ml-2 font-medium">
                              {(form.watch("productionTime") || 0) +
                                (form.watch("packagingTime") || 0)}{" "}
                              días
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>

                <div className="flex gap-3">
                  {currentStep === steps.length && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onSubmit(form.getValues(), true)}
                      disabled={isSubmitting}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Guardando..." : "Guardar como Borrador"}
                    </Button>
                  )}

                  {currentStep < steps.length ? (
                    <Button type="button" onClick={nextStep}>
                      Siguiente
                      <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => onSubmit(form.getValues(), false)}
                      disabled={isSubmitting || productImages.length < 3}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Publicando..." : "Publicar Lote"}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
