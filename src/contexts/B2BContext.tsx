import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  VolumePricing,
  PricingTier,
  RFQ,
  RFQQuote,
  PaymentTerms,
  CreditLine,
  FreightQuote,
  SupplierVerification,
  ContractTemplate,
  GeneratedContract,
  ContainerSpecs,
  ChatThread,
  ChatMessage,
  ChatParticipant,
  Notification,
  OfferHistoryItem,
  StockAlert,
  StockAlertTrigger,
} from "@/types";

interface B2BState {
  volumePricing: VolumePricing[];
  rfqs: RFQ[];
  currentRFQ?: RFQ;
  paymentTerms: PaymentTerms[];
  creditLines: CreditLine[];
  freightQuotes: FreightQuote[];
  supplierVerifications: SupplierVerification[];
  contractTemplates: ContractTemplate[];
  generatedContracts: GeneratedContract[];
  containerSpecs: ContainerSpecs[];
  selectedPricing?: VolumePricing;

  // Module 8: Advanced Communication and Negotiation
  chatThreads: ChatThread[];
  notifications: Notification[];
  offerHistory: OfferHistoryItem[];
  stockAlerts: StockAlert[];
  stockAlertTriggers: StockAlertTrigger[];
}

type B2BAction =
  | { type: "SET_VOLUME_PRICING"; payload: VolumePricing[] }
  | { type: "ADD_VOLUME_PRICING"; payload: VolumePricing }
  | {
      type: "UPDATE_VOLUME_PRICING";
      payload: { id: string; updates: Partial<VolumePricing> };
    }
  | { type: "SET_SELECTED_PRICING"; payload: VolumePricing }
  | { type: "SET_RFQS"; payload: RFQ[] }
  | { type: "ADD_RFQ"; payload: RFQ }
  | { type: "UPDATE_RFQ"; payload: { id: string; updates: Partial<RFQ> } }
  | { type: "SET_CURRENT_RFQ"; payload: RFQ }
  | { type: "ADD_RFQ_QUOTE"; payload: { rfqId: string; quote: RFQQuote } }
  | { type: "SET_PAYMENT_TERMS"; payload: PaymentTerms[] }
  | { type: "SET_CREDIT_LINES"; payload: CreditLine[] }
  | {
      type: "UPDATE_CREDIT_LINE";
      payload: { id: string; updates: Partial<CreditLine> };
    }
  | { type: "SET_FREIGHT_QUOTES"; payload: FreightQuote[] }
  | { type: "ADD_FREIGHT_QUOTE"; payload: FreightQuote }
  | { type: "SET_SUPPLIER_VERIFICATIONS"; payload: SupplierVerification[] }
  | {
      type: "UPDATE_SUPPLIER_VERIFICATION";
      payload: { id: string; updates: Partial<SupplierVerification> };
    }
  | { type: "SET_CONTRACT_TEMPLATES"; payload: ContractTemplate[] }
  | { type: "SET_GENERATED_CONTRACTS"; payload: GeneratedContract[] }
  | { type: "ADD_GENERATED_CONTRACT"; payload: GeneratedContract }
  | { type: "SET_CONTAINER_SPECS"; payload: ContainerSpecs[] }
  | { type: "SET_CHAT_THREADS"; payload: ChatThread[] }
  | {
      type: "ADD_CHAT_MESSAGE";
      payload: { threadId: string; message: ChatMessage };
    }
  | { type: "MARK_MESSAGE_READ"; payload: string }
  | { type: "SET_NOTIFICATIONS"; payload: Notification[] }
  | { type: "MARK_NOTIFICATION_READ"; payload: string }
  | { type: "MARK_ALL_NOTIFICATIONS_READ" }
  | { type: "DELETE_NOTIFICATION"; payload: string }
  | { type: "SET_OFFER_HISTORY"; payload: OfferHistoryItem[] }
  | { type: "SET_STOCK_ALERTS"; payload: StockAlert[] }
  | { type: "ADD_STOCK_ALERT"; payload: StockAlert }
  | {
      type: "UPDATE_STOCK_ALERT";
      payload: { id: string; updates: Partial<StockAlert> };
    }
  | { type: "DELETE_STOCK_ALERT"; payload: string }
  | { type: "SET_STOCK_ALERT_TRIGGERS"; payload: StockAlertTrigger[] };

const initialState: B2BState = {
  volumePricing: [],
  rfqs: [],
  paymentTerms: [],
  creditLines: [],
  freightQuotes: [],
  supplierVerifications: [],
  contractTemplates: [],
  generatedContracts: [],
  containerSpecs: [],
  chatThreads: [],
  notifications: [],
  offerHistory: [],
  stockAlerts: [],
  stockAlertTriggers: [],
};

function b2bReducer(state: B2BState, action: B2BAction): B2BState {
  switch (action.type) {
    case "SET_VOLUME_PRICING":
      return { ...state, volumePricing: action.payload };

    case "ADD_VOLUME_PRICING":
      return {
        ...state,
        volumePricing: [...state.volumePricing, action.payload],
      };

    case "UPDATE_VOLUME_PRICING":
      return {
        ...state,
        volumePricing: state.volumePricing.map((pricing) =>
          pricing.id === action.payload.id
            ? { ...pricing, ...action.payload.updates }
            : pricing,
        ),
      };

    case "SET_SELECTED_PRICING":
      return { ...state, selectedPricing: action.payload };

    case "SET_RFQS":
      return { ...state, rfqs: action.payload };

    case "ADD_RFQ":
      return { ...state, rfqs: [...state.rfqs, action.payload] };

    case "UPDATE_RFQ":
      return {
        ...state,
        rfqs: state.rfqs.map((rfq) =>
          rfq.id === action.payload.id
            ? { ...rfq, ...action.payload.updates }
            : rfq,
        ),
        currentRFQ:
          state.currentRFQ?.id === action.payload.id
            ? { ...state.currentRFQ, ...action.payload.updates }
            : state.currentRFQ,
      };

    case "SET_CURRENT_RFQ":
      return { ...state, currentRFQ: action.payload };

    case "ADD_RFQ_QUOTE":
      return {
        ...state,
        rfqs: state.rfqs.map((rfq) =>
          rfq.id === action.payload.rfqId
            ? { ...rfq, quotes: [...rfq.quotes, action.payload.quote] }
            : rfq,
        ),
      };

    case "SET_PAYMENT_TERMS":
      return { ...state, paymentTerms: action.payload };

    case "SET_CREDIT_LINES":
      return { ...state, creditLines: action.payload };

    case "UPDATE_CREDIT_LINE":
      return {
        ...state,
        creditLines: state.creditLines.map((line) =>
          line.id === action.payload.id
            ? { ...line, ...action.payload.updates }
            : line,
        ),
      };

    case "SET_FREIGHT_QUOTES":
      return { ...state, freightQuotes: action.payload };

    case "ADD_FREIGHT_QUOTE":
      return {
        ...state,
        freightQuotes: [...state.freightQuotes, action.payload],
      };

    case "SET_SUPPLIER_VERIFICATIONS":
      return { ...state, supplierVerifications: action.payload };

    case "UPDATE_SUPPLIER_VERIFICATION":
      return {
        ...state,
        supplierVerifications: state.supplierVerifications.map(
          (verification) =>
            verification.id === action.payload.id
              ? { ...verification, ...action.payload.updates }
              : verification,
        ),
      };

    case "SET_CONTRACT_TEMPLATES":
      return { ...state, contractTemplates: action.payload };

    case "SET_GENERATED_CONTRACTS":
      return { ...state, generatedContracts: action.payload };

    case "ADD_GENERATED_CONTRACT":
      return {
        ...state,
        generatedContracts: [...state.generatedContracts, action.payload],
      };

    case "SET_CONTAINER_SPECS":
      return { ...state, containerSpecs: action.payload };

    case "SET_CHAT_THREADS":
      return { ...state, chatThreads: action.payload };

    case "ADD_CHAT_MESSAGE":
      return {
        ...state,
        chatThreads: state.chatThreads.map((thread) =>
          thread.id === action.payload.threadId
            ? {
                ...thread,
                messages: [...thread.messages, action.payload.message],
                lastActivity: action.payload.message.timestamp,
              }
            : thread,
        ),
      };

    case "MARK_MESSAGE_READ":
      return {
        ...state,
        chatThreads: state.chatThreads.map((thread) => ({
          ...thread,
          messages: thread.messages.map((message) =>
            message.id === action.payload
              ? { ...message, isRead: true }
              : message,
          ),
          unreadCount: thread.messages.filter(
            (m) => !m.isRead && m.id !== action.payload,
          ).length,
        })),
      };

    case "SET_NOTIFICATIONS":
      return { ...state, notifications: action.payload };

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification,
        ),
      };

    case "MARK_ALL_NOTIFICATIONS_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      };

    case "DELETE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload,
        ),
      };

    case "SET_OFFER_HISTORY":
      return { ...state, offerHistory: action.payload };

    case "SET_STOCK_ALERTS":
      return { ...state, stockAlerts: action.payload };

    case "ADD_STOCK_ALERT":
      return {
        ...state,
        stockAlerts: [...state.stockAlerts, action.payload],
      };

    case "UPDATE_STOCK_ALERT":
      return {
        ...state,
        stockAlerts: state.stockAlerts.map((alert) =>
          alert.id === action.payload.id
            ? { ...alert, ...action.payload.updates }
            : alert,
        ),
      };

    case "DELETE_STOCK_ALERT":
      return {
        ...state,
        stockAlerts: state.stockAlerts.filter(
          (alert) => alert.id !== action.payload,
        ),
      };

    case "SET_STOCK_ALERT_TRIGGERS":
      return { ...state, stockAlertTriggers: action.payload };

    default:
      return state;
  }
}

interface B2BContextType {
  state: B2BState;

  // Volume Pricing
  loadVolumePricing: (productId: string) => Promise<void>;
  calculatePricing: (productId: string, quantity: number) => PricingCalculation;

  // RFQ Management
  createRFQ: (
    rfqData: Omit<
      RFQ,
      "id" | "rfqNumber" | "createdAt" | "updatedAt" | "quotes" | "documents"
    >,
  ) => Promise<string>;
  loadRFQs: () => Promise<void>;
  loadRFQById: (id: string) => Promise<void>;
  updateRFQStatus: (id: string, status: RFQ["status"]) => Promise<void>;
  addQuoteToRFQ: (
    rfqId: string,
    quote: Omit<RFQQuote, "id" | "createdAt">,
  ) => Promise<void>;
  acceptQuote: (rfqId: string, quoteId: string) => Promise<void>;
  createCounterOffer: (
    rfqId: string,
    quoteId: string,
    counterData: Partial<RFQQuote>,
  ) => Promise<void>;

  // Payment Terms
  loadPaymentTerms: () => Promise<void>;
  loadCreditLines: () => Promise<void>;
  requestCreditIncrease: (
    amount: number,
    justification: string,
  ) => Promise<void>;

  // Freight & Logistics
  requestFreightQuote: (params: FreightQuoteParams) => Promise<void>;
  calculateInsurance: (value: number, route: string) => Promise<number>;
  verifyContainerSpecs: (
    type: string,
    weight: number,
    volume: number,
  ) => ContainerValidation;

  // Supplier Verification
  loadSupplierVerifications: () => Promise<void>;
  requestSupplierVerification: (supplierId: string) => Promise<void>;
  updateVerificationStatus: (
    id: string,
    status: SupplierVerification["verificationStatus"],
  ) => Promise<void>;

  // Contract Management
  loadContractTemplates: () => Promise<void>;
  generateContract: (templateId: string, data: ContractData) => Promise<string>;
  loadGeneratedContracts: () => Promise<void>;
  signContract: (contractId: string, signature: any) => Promise<void>;

  // Document Generation
  generateProformaInvoice: (rfqId: string, quoteId: string) => Promise<string>;
  generateCommercialInvoice: (orderId: string) => Promise<string>;
  generatePackingList: (orderId: string) => Promise<string>;
  generateCertificateOfOrigin: (orderId: string) => Promise<string>;
  generateBillOfLading: (orderId: string) => Promise<string>;

  // Module 8: Advanced Communication and Negotiation
  chatThreads: ChatThread[];
  notifications: Notification[];
  offerHistory: OfferHistoryItem[];
  stockAlerts: StockAlert[];
  stockAlertTriggers: StockAlertTrigger[];

  // Chat Functions
  sendChatMessage: (
    threadId: string,
    content: string,
    attachments: File[],
  ) => void;
  markChatMessageAsRead: (messageId: string) => void;
  createChatThread: (rfqId: string, participants: ChatParticipant[]) => void;

  // Notification Functions
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  handleNotificationAction: (notification: Notification) => void;

  // Stock Alert Functions
  createStockAlert: (alertData: Partial<StockAlert>) => void;
  updateStockAlert: (alertId: string, alertData: Partial<StockAlert>) => void;
  deleteStockAlert: (alertId: string) => void;
  testStockAlert: (alertId: string) => void;
}

interface PricingCalculation {
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discountPercentage: number;
  discountAmount: number;
  tier: PricingTier | null;
}

interface FreightQuoteParams {
  origin: string;
  destination: string;
  containerType: "20'" | "40'";
  quantity: number;
  includeInsurance: boolean;
  serviceType?: string;
}

interface ContainerValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

interface ContractData {
  rfqId?: string;
  orderId?: string;
  buyerCompanyId: string;
  supplierCompanyId: string;
  variables: Record<string, any>;
}

const B2BContext = createContext<B2BContextType | undefined>(undefined);

export function B2BProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(b2bReducer, initialState);

  // Volume Pricing Functions
  const loadVolumePricing = async (productId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockPricing: VolumePricing = {
      id: `pricing-${productId}`,
      productId,
      containerType: "40'",
      basePrice: 8500,
      currency: "USD",
      validFrom: new Date(),
      tiers: [
        {
          minQuantity: 1,
          maxQuantity: 1,
          pricePerContainer: 8500,
          discountPercentage: 0,
          discountLabel: "Precio base",
        },
        {
          minQuantity: 2,
          maxQuantity: 4,
          pricePerContainer: 8075,
          discountPercentage: 5,
          discountLabel: "5% descuento por volumen",
        },
        {
          minQuantity: 5,
          maxQuantity: 9,
          pricePerContainer: 7650,
          discountPercentage: 10,
          discountLabel: "10% descuento por volumen",
        },
        {
          minQuantity: 10,
          pricePerContainer: 7225,
          discountPercentage: 15,
          discountLabel: "15% descuento mayorista",
        },
      ],
    };

    dispatch({ type: "SET_VOLUME_PRICING", payload: [mockPricing] });
    dispatch({ type: "SET_SELECTED_PRICING", payload: mockPricing });
  };

  const calculatePricing = (
    productId: string,
    quantity: number,
  ): PricingCalculation => {
    const pricing = state.volumePricing.find((p) => p.productId === productId);
    if (!pricing) {
      return {
        quantity,
        unitPrice: 0,
        totalPrice: 0,
        discountPercentage: 0,
        discountAmount: 0,
        tier: null,
      };
    }

    const tier = pricing.tiers
      .reverse()
      .find(
        (t) =>
          quantity >= t.minQuantity &&
          (t.maxQuantity === undefined || quantity <= t.maxQuantity),
      );

    if (!tier) {
      return {
        quantity,
        unitPrice: pricing.basePrice,
        totalPrice: pricing.basePrice * quantity,
        discountPercentage: 0,
        discountAmount: 0,
        tier: null,
      };
    }

    const totalPrice = tier.pricePerContainer * quantity;
    const discountAmount =
      (pricing.basePrice - tier.pricePerContainer) * quantity;

    return {
      quantity,
      unitPrice: tier.pricePerContainer,
      totalPrice,
      discountPercentage: tier.discountPercentage,
      discountAmount,
      tier,
    };
  };

  // RFQ Functions
  const createRFQ = async (
    rfqData: Omit<
      RFQ,
      "id" | "rfqNumber" | "createdAt" | "updatedAt" | "quotes" | "documents"
    >,
  ): Promise<string> => {
    const rfqNumber = `RFQ-${Date.now().toString().slice(-8)}`;
    const newRFQ: RFQ = {
      ...rfqData,
      id: `rfq-${Date.now()}`,
      rfqNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
      quotes: [],
      documents: [],
    };

    dispatch({ type: "ADD_RFQ", payload: newRFQ });
    return newRFQ.id;
  };

  const loadRFQs = async () => {
    // Simulate API call with mock data
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockRFQs: RFQ[] = [
      {
        id: "rfq-1",
        rfqNumber: "RFQ-20240001",
        productId: "product-1",
        productTitle: "Camisas Polo Premium - Lote Mixto",
        supplierId: "supplier-1",
        supplierName: "Textiles Modernos S.A.",
        buyerId: "buyer-1",
        buyerCompany: "Importadora Central América S.A.",
        containerQuantity: 3,
        containerType: "40'",
        incoterm: "CIF",
        estimatedDeliveryDate: new Date("2024-03-15"),
        logisticsComments:
          "Requiere contenedor refrigerado para productos sensibles",
        status: "quoted",
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-12"),
        validUntil: new Date("2024-02-10"),
        quotes: [
          {
            id: "quote-1",
            rfqId: "rfq-1",
            supplierId: "supplier-1",
            quoteNumber: "QUO-20240001",
            unitPrice: 7650,
            totalPrice: 22950,
            currency: "USD",
            incoterm: "CIF",
            leadTime: 21,
            validUntil: new Date("2024-02-10"),
            paymentTerms: "30% T/T advance, 70% against B/L",
            specialConditions: "Incluye certificación de calidad",
            isCounterOffer: false,
            status: "sent",
            createdAt: new Date("2024-01-12"),
          },
        ],
        documents: [],
      },
    ];

    dispatch({ type: "SET_RFQS", payload: mockRFQs });
  };

  const loadRFQById = async (id: string) => {
    const rfq = state.rfqs.find((r) => r.id === id);
    if (rfq) {
      dispatch({ type: "SET_CURRENT_RFQ", payload: rfq });
    }
  };

  const updateRFQStatus = async (id: string, status: RFQ["status"]) => {
    dispatch({
      type: "UPDATE_RFQ",
      payload: { id, updates: { status, updatedAt: new Date() } },
    });
  };

  const addQuoteToRFQ = async (
    rfqId: string,
    quote: Omit<RFQQuote, "id" | "createdAt">,
  ) => {
    const newQuote: RFQQuote = {
      ...quote,
      id: `quote-${Date.now()}`,
      createdAt: new Date(),
    };

    dispatch({ type: "ADD_RFQ_QUOTE", payload: { rfqId, quote: newQuote } });
  };

  const acceptQuote = async (rfqId: string, quoteId: string) => {
    dispatch({
      type: "UPDATE_RFQ",
      payload: {
        id: rfqId,
        updates: { status: "accepted", updatedAt: new Date() },
      },
    });
  };

  const createCounterOffer = async (
    rfqId: string,
    quoteId: string,
    counterData: Partial<RFQQuote>,
  ) => {
    const originalQuote = state.rfqs
      .find((r) => r.id === rfqId)
      ?.quotes.find((q) => q.id === quoteId);

    if (originalQuote) {
      const counterOffer: RFQQuote = {
        ...originalQuote,
        ...counterData,
        id: `quote-${Date.now()}`,
        isCounterOffer: true,
        status: "sent",
        createdAt: new Date(),
      };

      dispatch({
        type: "ADD_RFQ_QUOTE",
        payload: { rfqId, quote: counterOffer },
      });
    }
  };

  // Payment Terms Functions
  const loadPaymentTerms = async () => {
    const mockTerms: PaymentTerms[] = [
      {
        id: "terms-1",
        type: "tt",
        description: "30% T/T Advance + 70% against B/L",
        advancePercentage: 30,
        balanceTerms: "70% against Bill of Lading",
        isActive: true,
      },
      {
        id: "terms-2",
        type: "lc",
        description: "Irrevocable Letter of Credit at sight",
        lcRequirements: {
          minAmount: 10000,
          maxAmount: 500000,
          requiredDocuments: [
            "Commercial Invoice",
            "Packing List",
            "B/L",
            "Certificate of Origin",
          ],
          bankRequirements: ["Top 50 international bank"],
        },
        isActive: true,
      },
      {
        id: "terms-3",
        type: "credit",
        description: "Net 30 days credit terms",
        creditDays: 30,
        isActive: true,
      },
    ];

    dispatch({ type: "SET_PAYMENT_TERMS", payload: mockTerms });
  };

  const loadCreditLines = async () => {
    const mockCreditLines: CreditLine[] = [
      {
        id: "credit-1",
        companyId: "company-1",
        totalLimit: 50000,
        availableLimit: 35000,
        usedLimit: 15000,
        currency: "USD",
        approvedDate: new Date("2023-06-01"),
        expiryDate: new Date("2024-06-01"),
        status: "active",
        creditHistory: [],
      },
    ];

    dispatch({ type: "SET_CREDIT_LINES", payload: mockCreditLines });
  };

  const requestCreditIncrease = async (
    amount: number,
    justification: string,
  ) => {
    // Simulate credit increase request
    console.log(`Requesting credit increase: $${amount.toLocaleString()}`);
    console.log(`Justification: ${justification}`);
  };

  // Freight & Logistics Functions
  const requestFreightQuote = async (params: FreightQuoteParams) => {
    // Simulate API call to freight providers
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockQuote: FreightQuote = {
      id: `freight-${Date.now()}`,
      origin: params.origin,
      destination: params.destination,
      containerType: params.containerType,
      quantity: params.quantity,
      serviceType: params.serviceType || "standard",
      includeInsurance: params.includeInsurance,
      requestedAt: new Date(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      quotes: [
        {
          id: "freight-option-1",
          providerId: "maersk",
          providerName: "Maersk Line",
          serviceType: "Standard FCL",
          cost: 2450,
          currency: "USD",
          transitTime: 14,
          insuranceCost: params.includeInsurance ? 125 : 0,
          totalCost: 2450 + (params.includeInsurance ? 125 : 0),
          conditions: ["Port to Port", "Equipment included"],
          rating: 4.8,
        },
        {
          id: "freight-option-2",
          providerId: "msc",
          providerName: "MSC Mediterranean",
          serviceType: "Express FCL",
          cost: 2890,
          currency: "USD",
          transitTime: 10,
          insuranceCost: params.includeInsurance ? 145 : 0,
          totalCost: 2890 + (params.includeInsurance ? 145 : 0),
          conditions: ["Port to Port", "Priority handling"],
          rating: 4.6,
        },
      ],
    };

    dispatch({ type: "ADD_FREIGHT_QUOTE", payload: mockQuote });
  };

  const calculateInsurance = async (
    value: number,
    route: string,
  ): Promise<number> => {
    // Simulate insurance calculation based on value and route risk
    const baseRate = 0.002; // 0.2%
    const routeMultiplier = route.includes("Atlantic") ? 1.0 : 1.2;
    return Math.round(value * baseRate * routeMultiplier);
  };

  const verifyContainerSpecs = (
    type: string,
    weight: number,
    volume: number,
  ): ContainerValidation => {
    const specs = state.containerSpecs.find((s) => s.type === type);
    const validation: ContainerValidation = {
      isValid: true,
      errors: [],
      warnings: [],
      recommendations: [],
    };

    if (!specs) {
      validation.isValid = false;
      validation.errors.push("Container type not found");
      return validation;
    }

    if (weight > specs.maxPayload) {
      validation.isValid = false;
      validation.errors.push(
        `Weight exceeds maximum payload of ${specs.maxPayload}kg`,
      );
    } else if (weight > specs.maxPayload * 0.9) {
      validation.warnings.push("Weight is near maximum capacity");
    }

    if (volume > specs.volume) {
      validation.isValid = false;
      validation.errors.push(
        `Volume exceeds container capacity of ${specs.volume}m³`,
      );
    }

    return validation;
  };

  // Supplier Verification Functions
  const loadSupplierVerifications = async () => {
    const mockVerifications: SupplierVerification[] = [
      {
        id: "verification-1",
        supplierId: "supplier-1",
        zlcLicenseNumber: "ZLC-2023-001234",
        zlcLicenseExpiry: new Date("2024-12-31"),
        verificationStatus: "verified",
        verificationLevel: "authorized",
        certifications: [
          {
            id: "cert-1",
            type: "ISO_9001",
            certificationNumber: "ISO-9001-2023-001",
            issuedBy: "SGS International",
            issuedDate: new Date("2023-01-15"),
            expiryDate: new Date("2026-01-15"),
            verified: true,
          },
        ],
        verificationDate: new Date("2023-06-15"),
        verifiedBy: "ZLC Verification Team",
      },
    ];

    dispatch({
      type: "SET_SUPPLIER_VERIFICATIONS",
      payload: mockVerifications,
    });
  };

  const requestSupplierVerification = async (supplierId: string) => {
    // Simulate verification request
    console.log(`Requesting verification for supplier: ${supplierId}`);
  };

  const updateVerificationStatus = async (
    id: string,
    status: SupplierVerification["verificationStatus"],
  ) => {
    dispatch({
      type: "UPDATE_SUPPLIER_VERIFICATION",
      payload: {
        id,
        updates: { verificationStatus: status, verificationDate: new Date() },
      },
    });
  };

  // Contract Management Functions
  const loadContractTemplates = async () => {
    const mockTemplates: ContractTemplate[] = [
      {
        id: "template-1",
        type: "sales_contract",
        title: "International Sales Contract - FOB Terms",
        description: "Standard international sales contract with FOB Incoterm",
        templateContent: "Contract template content...",
        incotermSupport: ["FOB", "EXW"],
        jurisdiction: "Panama",
        language: "es",
        version: "1.0",
        isActive: true,
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
      },
    ];

    dispatch({ type: "SET_CONTRACT_TEMPLATES", payload: mockTemplates });
  };

  const generateContract = async (
    templateId: string,
    data: ContractData,
  ): Promise<string> => {
    // Simulate contract generation
    const contractNumber = `CON-${Date.now().toString().slice(-8)}`;
    const newContract: GeneratedContract = {
      id: `contract-${Date.now()}`,
      contractNumber,
      templateId,
      rfqId: data.rfqId,
      orderId: data.orderId,
      buyerCompanyId: data.buyerCompanyId,
      supplierCompanyId: data.supplierCompanyId,
      contractContent: "Generated contract content...",
      variables: data.variables,
      status: "draft",
      createdAt: new Date(),
      signedBy: [],
      documents: [],
    };

    dispatch({ type: "ADD_GENERATED_CONTRACT", payload: newContract });
    return newContract.id;
  };

  const loadGeneratedContracts = async () => {
    // Load generated contracts
    dispatch({ type: "SET_GENERATED_CONTRACTS", payload: [] });
  };

  const signContract = async (contractId: string, signature: any) => {
    // Simulate contract signing
    console.log(`Signing contract: ${contractId}`);
  };

  // Document Generation Functions
  const generateProformaInvoice = async (
    rfqId: string,
    quoteId: string,
  ): Promise<string> => {
    // Simulate document generation
    return `/documents/proforma-${rfqId}-${quoteId}.pdf`;
  };

  const generateCommercialInvoice = async (
    orderId: string,
  ): Promise<string> => {
    return `/documents/commercial-invoice-${orderId}.pdf`;
  };

  const generatePackingList = async (orderId: string): Promise<string> => {
    return `/documents/packing-list-${orderId}.pdf`;
  };

  const generateCertificateOfOrigin = async (
    orderId: string,
  ): Promise<string> => {
    return `/documents/certificate-origin-${orderId}.pdf`;
  };

  const generateBillOfLading = async (orderId: string): Promise<string> => {
    return `/documents/bill-lading-${orderId}.pdf`;
  };

  // Module 8: Advanced Communication and Negotiation Functions
  const sendChatMessage = (
    threadId: string,
    content: string,
    attachments: File[],
  ) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      rfqId: threadId.replace("thread-", "rfq-"),
      senderId: "user_123", // Current user ID
      senderName: "Usuario Actual",
      senderRole: "buyer",
      content,
      timestamp: new Date(),
      attachments: attachments.map((file, index) => ({
        id: `att-${Date.now()}-${index}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        uploadedAt: new Date(),
      })),
      isRead: false,
      messageType: "text",
    };

    dispatch({
      type: "ADD_CHAT_MESSAGE",
      payload: { threadId, message: newMessage },
    });
  };

  const markChatMessageAsRead = (messageId: string) => {
    dispatch({ type: "MARK_MESSAGE_READ", payload: messageId });
  };

  const createChatThread = (rfqId: string, participants: ChatParticipant[]) => {
    const newThread: ChatThread = {
      id: `thread-${Date.now()}`,
      rfqId,
      participants,
      messages: [],
      lastActivity: new Date(),
      isActive: true,
      unreadCount: 0,
    };

    dispatch({
      type: "SET_CHAT_THREADS",
      payload: [...state.chatThreads, newThread],
    });
  };

  const markNotificationAsRead = (notificationId: string) => {
    dispatch({ type: "MARK_NOTIFICATION_READ", payload: notificationId });
  };

  const markAllNotificationsAsRead = () => {
    dispatch({ type: "MARK_ALL_NOTIFICATIONS_READ" });
  };

  const deleteNotification = (notificationId: string) => {
    dispatch({ type: "DELETE_NOTIFICATION", payload: notificationId });
  };

  const handleNotificationAction = (notification: Notification) => {
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    markNotificationAsRead(notification.id);
  };

  const createStockAlert = (alertData: Partial<StockAlert>) => {
    const newAlert: StockAlert = {
      id: `alert-${Date.now()}`,
      productId: alertData.productId || `product-${Date.now()}`,
      productName: alertData.productName || "Producto",
      alertType: alertData.alertType || "back_in_stock",
      isActive: true,
      createdAt: new Date(),
      criteria: alertData.criteria || {},
      notificationMethod: alertData.notificationMethod || ["platform"],
      ...alertData,
    };

    dispatch({ type: "ADD_STOCK_ALERT", payload: newAlert });
  };

  const updateStockAlert = (
    alertId: string,
    alertData: Partial<StockAlert>,
  ) => {
    dispatch({
      type: "UPDATE_STOCK_ALERT",
      payload: { id: alertId, updates: alertData },
    });
  };

  const deleteStockAlert = (alertId: string) => {
    dispatch({ type: "DELETE_STOCK_ALERT", payload: alertId });
  };

  const testStockAlert = (alertId: string) => {
    const alert = state.stockAlerts.find((a) => a.id === alertId);
    if (alert) {
      const testTrigger: StockAlertTrigger = {
        id: `trigger-${Date.now()}`,
        alertId,
        productId: alert.productId,
        triggerType: "stock_available",
        message: `Alerta de prueba para ${alert.productName}`,
        timestamp: new Date(),
        data: {
          availableQuantity: 10,
          currentPrice: 5000,
        },
      };

      dispatch({
        type: "SET_STOCK_ALERT_TRIGGERS",
        payload: [...state.stockAlertTriggers, testTrigger],
      });

      // Create notification
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        type: "stock_alert",
        title: "Alerta de Stock Activada",
        message: testTrigger.message,
        timestamp: new Date(),
        isRead: false,
        priority: "medium",
        relatedId: alert.productId,
      };

      dispatch({
        type: "SET_NOTIFICATIONS",
        payload: [...state.notifications, notification],
      });
    }
  };

  // Initialize mock data for Module 8
  React.useEffect(() => {
    // Mock chat threads
    const mockChatThreads: ChatThread[] = [
      {
        id: "thread-1",
        rfqId: "rfq-1",
        participants: [
          {
            id: "user_123",
            name: "Juan Pérez",
            role: "buyer",
            isOnline: true,
            lastSeen: new Date(),
          },
          {
            id: "supplier_456",
            name: "Carlos Mendoza",
            role: "supplier",
            isOnline: false,
            lastSeen: new Date(Date.now() - 3600000),
          },
        ],
        messages: [
          {
            id: "msg-1",
            rfqId: "rfq-1",
            senderId: "supplier_456",
            senderName: "Carlos Mendoza",
            senderRole: "supplier",
            content:
              "Hola, hemos revisado su RFQ y tenemos algunas preguntas sobre las especificaciones.",
            timestamp: new Date(Date.now() - 7200000),
            attachments: [],
            isRead: false,
            messageType: "text",
          },
        ],
        lastActivity: new Date(Date.now() - 7200000),
        isActive: true,
        unreadCount: 1,
      },
    ];

    // Mock notifications
    const mockNotifications: Notification[] = [
      {
        id: "notif-1",
        type: "rfq_update",
        title: "Nueva cotización recibida",
        message:
          "Textiles Modernos S.A. ha enviado una cotización para su RFQ #20240001",
        timestamp: new Date(Date.now() - 1800000),
        isRead: false,
        priority: "high",
        relatedId: "rfq-1",
        actionUrl: "/my-rfqs",
        actionText: "Ver cotización",
      },
      {
        id: "notif-2",
        type: "stock_alert",
        title: "Producto disponible",
        message: 'El lote "Café Premium Colombia" está nuevamente disponible',
        timestamp: new Date(Date.now() - 3600000),
        isRead: false,
        priority: "medium",
        relatedId: "product-coffee",
      },
    ];

    // Mock offer history
    const mockOfferHistory: OfferHistoryItem[] = [
      {
        id: "offer-1",
        rfqId: "rfq-1",
        productName: "Camisas Polo Premium - Lote Mixto",
        supplierName: "Textiles Modernos S.A.",
        offerType: "initial",
        status: "negotiating",
        containerQuantity: 3,
        unitPrice: 7650,
        totalPrice: 22950,
        currency: "USD",
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        terms: {
          incoterm: "CIF",
          paymentTerms: "T/T 30% adelanto, 70% contra B/L",
          deliveryDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          specialConditions: "Contenedor refrigerado requerido",
        },
        documents: [],
        negotiationHistory: [
          {
            id: "nego-1",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            action: "offer_made",
            actor: "supplier",
            actorName: "Carlos Mendoza",
            changes: [
              {
                field: "precio_unitario",
                oldValue: 8000,
                newValue: 7650,
                reason: "Descuento por volumen",
              },
            ],
            notes: "Oferta inicial con descuento por 3 contenedores",
          },
        ],
      },
    ];

    // Mock stock alerts
    const mockStockAlerts: StockAlert[] = [
      {
        id: "alert-1",
        productId: "product-coffee",
        productName: "Café Premium Colombia 20'",
        alertType: "back_in_stock",
        isActive: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        criteria: {
          minQuantity: 5,
        },
        notificationMethod: ["email", "platform"],
      },
    ];

    dispatch({ type: "SET_CHAT_THREADS", payload: mockChatThreads });
    dispatch({ type: "SET_NOTIFICATIONS", payload: mockNotifications });
    dispatch({ type: "SET_OFFER_HISTORY", payload: mockOfferHistory });
    dispatch({ type: "SET_STOCK_ALERTS", payload: mockStockAlerts });
    dispatch({ type: "SET_STOCK_ALERT_TRIGGERS", payload: [] });
  }, []);

  return (
    <B2BContext.Provider
      value={{
        state,
        loadVolumePricing,
        calculatePricing,
        createRFQ,
        loadRFQs,
        loadRFQById,
        updateRFQStatus,
        addQuoteToRFQ,
        acceptQuote,
        createCounterOffer,
        loadPaymentTerms,
        loadCreditLines,
        requestCreditIncrease,
        requestFreightQuote,
        calculateInsurance,
        verifyContainerSpecs,
        loadSupplierVerifications,
        requestSupplierVerification,
        updateVerificationStatus,
        loadContractTemplates,
        generateContract,
        loadGeneratedContracts,
        signContract,
        generateProformaInvoice,
        generateCommercialInvoice,
        generatePackingList,
        generateCertificateOfOrigin,
        generateBillOfLading,

        // Module 8: Advanced Communication and Negotiation
        chatThreads: state.chatThreads,
        notifications: state.notifications,
        offerHistory: state.offerHistory,
        stockAlerts: state.stockAlerts,
        stockAlertTriggers: state.stockAlertTriggers,

        // Chat Functions
        sendChatMessage,
        markChatMessageAsRead,
        createChatThread,

        // Notification Functions
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        handleNotificationAction,

        // Stock Alert Functions
        createStockAlert,
        updateStockAlert,
        deleteStockAlert,
        testStockAlert,
      }}
    >
      {children}
    </B2BContext.Provider>
  );
}

export function useB2B() {
  const context = useContext(B2BContext);
  if (context === undefined) {
    throw new Error("useB2B must be used within a B2BProvider");
  }
  return context;
}
