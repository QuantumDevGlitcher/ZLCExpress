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

// Shipping and Transport Workflow Types
export interface ShippingRequest {
  id: string;
  quoteId: string;
  containerType: "20'" | "40'";
  originPort: string;
  destinationPort: string;
  estimatedDate: Date;
  status: "pending" | "quoted" | "booked" | "confirmed";
  createdAt: Date;
}

export interface TransportOption {
  id: string;
  shippingRequestId: string;
  operatorName: string;
  operatorId: string;
  incoterm: "FOB" | "CIF" | "CFR" | "EXW";
  cost: number;
  currency: string;
  transitTime: number; // days
  conditions: {
    insurance: boolean;
    customs: boolean;
    documentation: boolean;
    specialHandling?: string[];
  };
  availability: Date;
  validUntil: Date;
  rating: number;
  verified: boolean;
}

export interface TransportBooking {
  id: string;
  shippingRequestId: string;
  selectedOptionId: string;
  bookingNumber: string;
  shippingLine: string;
  vesselName?: string;
  cutoffDate: Date;
  etd: Date; // Estimated Time of Departure
  eta: Date; // Estimated Time of Arrival
  totalCost: number;
  platformCommission: number;
  status:
    | "confirmed"
    | "in_production"
    | "ready_to_ship"
    | "in_transit"
    | "arrived"
    | "delivered"
    | "completed";
  createdAt: Date;
  notifications: TransportNotification[];
}

export interface TransportNotification {
  id: string;
  bookingId: string;
  type: "status_update" | "delay" | "arrival" | "document_ready" | "issue";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface CustomsDocument {
  id: string;
  bookingId: string;
  type:
    | "commercial_invoice"
    | "packing_list"
    | "customs_data"
    | "zlc_checklist"
    | "destination_checklist";
  title: string;
  description: string;
  fileUrl?: string;
  status: "pending" | "ready" | "downloaded";
  generatedAt?: Date;
}

export interface OrderTracking {
  id: string;
  bookingId: string;
  status: TransportBooking["status"];
  timestamp: Date;
  location?: string;
  description: string;
  percentage?: number; // for production progress
  documents?: string[]; // document IDs
}

export interface Incident {
  id: string;
  bookingId: string;
  type:
    | "damage"
    | "missing_items"
    | "delay"
    | "documentation"
    | "customs"
    | "other";
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "investigating" | "resolved" | "closed";
  reportedBy: string;
  reportedAt: Date;
  assignedTo?: string;
  resolution?: string;
  resolvedAt?: Date;
  attachments?: File[];
}
