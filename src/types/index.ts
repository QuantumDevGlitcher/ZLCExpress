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

// Module 6: Order Management and Company Profile Types
export interface Order {
  id: string;
  orderNumber: string;
  quoteId?: string;
  supplierId: string;
  supplierName: string;
  companyId: string;
  status:
    | "pending"
    | "confirmed"
    | "in_production"
    | "shipped"
    | "in_transit"
    | "customs"
    | "delivered"
    | "completed"
    | "cancelled";
  orderType: "quote" | "purchase_order";
  containers: OrderContainer[];
  totalAmount: number;
  currency: string;
  incoterm: "FOB" | "CIF" | "CFR" | "EXW";
  paymentConditions: string;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  shippingData?: {
    shippingLine: string;
    containerNumber: string;
    blNumber: string;
    vesselName: string;
    etd: Date;
    eta: Date;
    trackingUrl?: string;
  };
  keyDates: {
    proformaIssued?: Date;
    paymentConfirmed?: Date;
    productionStarted?: Date;
    departed?: Date;
    arrived?: Date;
    delivered?: Date;
  };
  documents: OrderDocument[];
  payments: PaymentRecord[];
}

export interface OrderContainer {
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  containerType: "20'" | "40'";
  quantity: number;
  unitPrice: number;
  subtotal: number;
  specifications: Record<string, string>;
}

export interface OrderDocument {
  id: string;
  orderId: string;
  type:
    | "commercial_invoice"
    | "packing_list"
    | "bill_of_lading"
    | "certificate"
    | "customs_declaration"
    | "payment_receipt";
  title: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  type: "advance" | "balance" | "full";
  amount: number;
  currency: string;
  method: "wire_transfer" | "letter_of_credit" | "cash" | "check";
  status: "pending" | "confirmed" | "failed";
  paymentDate: Date;
  reference: string;
  receipt?: string; // file URL
  notes?: string;
}

export interface CompanyProfile {
  id: string;
  legalName: string;
  taxId: string; // NIT/RUC
  fiscalAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  verificationStatus: "pending" | "verified" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthorizedContact {
  id: string;
  companyId: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  role: "buyer" | "approver" | "accounting" | "admin";
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface PaymentMethod {
  id: string;
  companyId: string;
  type: "wire_transfer" | "letter_of_credit";
  title: string;
  isDefault: boolean;
  bankData?: {
    bankName: string;
    swift: string;
    bic: string;
    accountNumber: string;
    accountHolder: string;
    currency: string;
  };
  lcTemplate?: string; // file URL for LC template
  createdAt: Date;
}

export interface NotificationSettings {
  companyId: string;
  productionCompleted: {
    email: boolean;
    sms: boolean;
  };
  shipmentDeparted: {
    email: boolean;
    sms: boolean;
  };
  portArrival: {
    email: boolean;
    sms: boolean;
  };
  paymentPending: {
    email: boolean;
    sms: boolean;
  };
  incidentOpened: {
    email: boolean;
    sms: boolean;
  };
}

export interface OrderHistoryReport {
  orderId: string;
  orderNumber: string;
  supplier: string;
  containers: number;
  amount: number;
  currency: string;
  date: Date;
  status: string;
}
