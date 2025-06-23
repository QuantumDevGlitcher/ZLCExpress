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
  | { type: "SET_CONTAINER_SPECS"; payload: ContainerSpecs[] };

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
