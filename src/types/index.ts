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

// Module 7: B2B/Wholesale Container Functionalities Types
export interface VolumePricing {
  id: string;
  productId: string;
  containerType: "20'" | "40'";
  tiers: PricingTier[];
  basePrice: number;
  currency: string;
  validFrom: Date;
  validUntil?: Date;
}

export interface PricingTier {
  minQuantity: number;
  maxQuantity?: number;
  pricePerContainer: number;
  discountPercentage: number;
  discountLabel: string; // e.g., "5% off", "Volume discount"
}

export interface RFQ {
  id: string;
  rfqNumber: string;
  productId: string;
  productTitle: string;
  supplierId: string;
  supplierName: string;
  buyerId: string;
  buyerCompany: string;
  containerQuantity: number;
  containerType: "20'" | "40'";
  incoterm: "FOB" | "CIF" | "CFR" | "EXW";
  estimatedDeliveryDate: Date;
  logisticsComments?: string;
  specialRequirements?: string;
  status:
    | "draft"
    | "sent"
    | "pending"
    | "quoted"
    | "counter_offer"
    | "accepted"
    | "rejected"
    | "expired";
  createdAt: Date;
  updatedAt: Date;
  validUntil: Date;
  quotes: RFQQuote[];
  documents: RFQDocument[];
}

export interface RFQQuote {
  id: string;
  rfqId: string;
  supplierId: string;
  quoteNumber: string;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  incoterm: "FOB" | "CIF" | "CFR" | "EXW";
  leadTime: number; // days
  validUntil: Date;
  paymentTerms: string;
  specialConditions?: string;
  isCounterOffer: boolean;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired";
  createdAt: Date;
}

export interface RFQDocument {
  id: string;
  rfqId: string;
  type:
    | "rfq_form"
    | "quote_response"
    | "technical_specs"
    | "certifications"
    | "samples";
  title: string;
  fileName: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface PaymentTerms {
  id: string;
  type: "tt" | "lc" | "credit";
  description: string;
  advancePercentage?: number; // for T/T
  balanceTerms?: string;
  creditDays?: number; // for Net 30, Net 60
  lcRequirements?: LCRequirements;
  isActive: boolean;
}

export interface LCRequirements {
  minAmount: number;
  maxAmount: number;
  requiredDocuments: string[];
  bankRequirements: string[];
  specialConditions?: string[];
}

export interface CreditLine {
  id: string;
  companyId: string;
  totalLimit: number;
  availableLimit: number;
  usedLimit: number;
  currency: string;
  approvedDate: Date;
  expiryDate: Date;
  interestRate?: number;
  status: "active" | "suspended" | "expired" | "pending_approval";
  creditHistory: CreditTransaction[];
}

export interface CreditTransaction {
  id: string;
  creditLineId: string;
  orderId?: string;
  type: "credit_used" | "payment_received" | "credit_adjustment";
  amount: number;
  description: string;
  transactionDate: Date;
  balanceAfter: number;
}

export interface FreightQuote {
  id: string;
  origin: string;
  destination: string;
  containerType: "20'" | "40'";
  quantity: number;
  serviceType: "standard" | "express" | "refrigerated";
  includeInsurance: boolean;
  quotes: FreightOption[];
  requestedAt: Date;
  validUntil: Date;
}

export interface FreightOption {
  id: string;
  providerId: string;
  providerName: string;
  serviceType: string;
  cost: number;
  currency: string;
  transitTime: number; // days
  insuranceCost?: number;
  totalCost: number;
  conditions: string[];
  rating: number;
}

export interface ContainerSpecs {
  type: "20'" | "40'";
  category: "dry" | "refrigerated" | "open_top" | "flat_rack";
  maxGrossWeight: number; // kg
  tareWeight: number; // kg
  maxPayload: number; // kg
  internalLength: number; // meters
  internalWidth: number; // meters
  internalHeight: number; // meters
  volume: number; // cubic meters
  temperatureRange?: {
    min: number;
    max: number;
  };
}

export interface SupplierVerification {
  id: string;
  supplierId: string;
  zlcLicenseNumber?: string;
  zlcLicenseExpiry?: Date;
  verificationStatus: "pending" | "verified" | "rejected" | "expired";
  certifications: SupplierCertification[];
  verificationDate?: Date;
  verifiedBy?: string;
  verificationNotes?: string;
  verificationLevel: "basic" | "standard" | "premium" | "authorized";
}

export interface SupplierCertification {
  id: string;
  type:
    | "ISO_9001"
    | "ISO_14001"
    | "BSCI"
    | "SEDEX"
    | "FSC"
    | "CE"
    | "FDA"
    | "other";
  certificationNumber: string;
  issuedBy: string;
  issuedDate: Date;
  expiryDate: Date;
  documentUrl?: string;
  verified: boolean;
}

export interface ContractTemplate {
  id: string;
  type: "sales_contract" | "purchase_agreement" | "service_contract";
  title: string;
  description: string;
  templateContent: string; // HTML or markdown content
  incotermSupport: string[]; // Supported incoterms
  jurisdiction: string;
  language: "es" | "en" | "pt";
  version: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GeneratedContract {
  id: string;
  contractNumber: string;
  templateId: string;
  rfqId?: string;
  orderId?: string;
  buyerCompanyId: string;
  supplierCompanyId: string;
  contractContent: string;
  variables: Record<string, any>; // Template variables filled
  status: "draft" | "pending_signatures" | "signed" | "executed" | "terminated";
  createdAt: Date;
  signedAt?: Date;
  signedBy: ContractSignature[];
  documents: ContractDocument[];
}

export interface ContractSignature {
  partyType: "buyer" | "supplier";
  signedBy: string;
  signedAt: Date;
  ipAddress?: string;
  digitalSignature?: string;
}

export interface ContractDocument {
  id: string;
  contractId: string;
  type:
    | "legal_existence"
    | "insurance_policy"
    | "import_permit"
    | "power_of_attorney"
    | "other";
  title: string;
  fileName: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: Date;
  verified: boolean;
  expiryDate?: Date;
}

export interface DocumentGenerator {
  generateProformaInvoice: (rfq: RFQ, quote: RFQQuote) => Promise<string>;
  generateCommercialInvoice: (order: Order) => Promise<string>;
  generatePackingList: (order: Order) => Promise<string>;
  generateCertificateOfOrigin: (order: Order) => Promise<string>;
  generateBillOfLading: (order: Order, shipping: any) => Promise<string>;
}

// Module 8: Advanced Communication and Negotiation
export interface ChatMessage {
  id: string;
  rfqId: string;
  senderId: string;
  senderName: string;
  senderRole: "buyer" | "supplier";
  content: string;
  timestamp: Date;
  attachments: ChatAttachment[];
  isRead: boolean;
  messageType: "text" | "file" | "offer" | "system";
}

export interface ChatAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

export interface ChatThread {
  id: string;
  rfqId: string;
  participants: ChatParticipant[];
  messages: ChatMessage[];
  lastActivity: Date;
  isActive: boolean;
  unreadCount: number;
}

export interface ChatParticipant {
  id: string;
  name: string;
  role: "buyer" | "supplier";
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface Notification {
  id: string;
  type:
    | "rfq_update"
    | "stock_alert"
    | "chat_message"
    | "offer_received"
    | "contract_update";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  relatedId?: string; // RFQ ID, Product ID, etc.
  actionUrl?: string;
  actionText?: string;
}

export interface OfferHistoryItem {
  id: string;
  rfqId: string;
  productName: string;
  supplierName: string;
  offerType: "initial" | "counter_offer" | "final";
  status: "pending" | "accepted" | "rejected" | "expired" | "negotiating";
  containerQuantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  validUntil: Date;
  createdAt: Date;
  terms: {
    incoterm: string;
    paymentTerms: string;
    deliveryDate: Date;
    specialConditions?: string;
  };
  documents: RFQDocument[];
  negotiationHistory: NegotiationStep[];
}

export interface NegotiationStep {
  id: string;
  timestamp: Date;
  action:
    | "offer_made"
    | "counter_offer"
    | "price_adjustment"
    | "terms_modified"
    | "accepted"
    | "rejected";
  actor: "buyer" | "supplier";
  actorName: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
    reason?: string;
  }[];
  notes?: string;
}

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  alertType: "back_in_stock" | "low_stock" | "similar_product" | "price_drop";
  isActive: boolean;
  createdAt: Date;
  lastTriggered?: Date;
  criteria: {
    minQuantity?: number;
    maxPrice?: number;
    specifications?: string[];
    region?: string;
  };
  notificationMethod: ("email" | "platform" | "sms")[];
}

export interface StockAlertTrigger {
  id: string;
  alertId: string;
  productId: string;
  triggerType:
    | "stock_available"
    | "quantity_threshold"
    | "price_change"
    | "similar_found";
  message: string;
  timestamp: Date;
  data: {
    availableQuantity?: number;
    currentPrice?: number;
    estimatedAvailability?: Date;
    similarProducts?: string[];
  };
}
