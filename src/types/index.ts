export interface Category {
  id: string;
  name: string;
  image: string;
  moq: string;
  description: string;
  containerType: "20'" | "40'" | "both";
}

export interface Company {
  id: string;
  name: string;
  taxId: string; // NIT/RUC
  country: string;
  sector: string;
  contactPerson: {
    name: string;
    position: string;
    email: string;
    phone: string;
  };
  fiscalAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  verificationStatus: "pending" | "verified" | "rejected";
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  companyId: string;
  role: "admin" | "buyer" | "viewer";
  isActive: boolean;
}

export interface MenuItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface ContainerLot {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  containerSize: "20'" | "40'";
  moq: number;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  images: string[];
  specifications: Record<string, string>;
  supplierId: string;
  availableFrom: Date;
  estimatedDelivery: string;
  status: "available" | "reserved" | "sold";
}

export interface FormData {
  companyName: string;
  taxId: string;
  country: string;
  sector: string;
  contactName: string;
  contactPosition: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  fiscalCountry: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}
