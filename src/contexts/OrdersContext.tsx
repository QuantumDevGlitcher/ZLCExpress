import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  Order,
  OrderContainer,
  OrderDocument,
  PaymentRecord,
  CompanyProfile,
  AuthorizedContact,
  PaymentMethod,
  NotificationSettings,
} from "@/types";

interface OrdersState {
  orders: Order[];
  currentOrder?: Order;
  companyProfile?: CompanyProfile;
  authorizedContacts: AuthorizedContact[];
  paymentMethods: PaymentMethod[];
  notificationSettings?: NotificationSettings;
  filters: {
    status: string;
    dateRange: {
      from?: Date;
      to?: Date;
    };
    searchTerm: string;
  };
}

type OrdersAction =
  | { type: "SET_ORDERS"; payload: Order[] }
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "UPDATE_ORDER"; payload: { id: string; updates: Partial<Order> } }
  | { type: "SET_CURRENT_ORDER"; payload: Order }
  | { type: "SET_COMPANY_PROFILE"; payload: CompanyProfile }
  | { type: "UPDATE_COMPANY_PROFILE"; payload: Partial<CompanyProfile> }
  | { type: "SET_AUTHORIZED_CONTACTS"; payload: AuthorizedContact[] }
  | { type: "ADD_AUTHORIZED_CONTACT"; payload: AuthorizedContact }
  | {
      type: "UPDATE_AUTHORIZED_CONTACT";
      payload: { id: string; updates: Partial<AuthorizedContact> };
    }
  | { type: "REMOVE_AUTHORIZED_CONTACT"; payload: string }
  | { type: "SET_PAYMENT_METHODS"; payload: PaymentMethod[] }
  | { type: "ADD_PAYMENT_METHOD"; payload: PaymentMethod }
  | { type: "REMOVE_PAYMENT_METHOD"; payload: string }
  | { type: "SET_NOTIFICATION_SETTINGS"; payload: NotificationSettings }
  | {
      type: "ADD_PAYMENT_RECORD";
      payload: { orderId: string; payment: PaymentRecord };
    }
  | {
      type: "ADD_ORDER_DOCUMENT";
      payload: { orderId: string; document: OrderDocument };
    }
  | { type: "UPDATE_FILTERS"; payload: Partial<OrdersState["filters"]> };

const initialState: OrdersState = {
  orders: [],
  authorizedContacts: [],
  paymentMethods: [],
  filters: {
    status: "",
    dateRange: {},
    searchTerm: "",
  },
};

function ordersReducer(state: OrdersState, action: OrdersAction): OrdersState {
  switch (action.type) {
    case "SET_ORDERS":
      return { ...state, orders: action.payload };

    case "ADD_ORDER":
      return { ...state, orders: [...state.orders, action.payload] };

    case "UPDATE_ORDER":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.id
            ? { ...order, ...action.payload.updates }
            : order,
        ),
        currentOrder:
          state.currentOrder?.id === action.payload.id
            ? { ...state.currentOrder, ...action.payload.updates }
            : state.currentOrder,
      };

    case "SET_CURRENT_ORDER":
      return { ...state, currentOrder: action.payload };

    case "SET_COMPANY_PROFILE":
      return { ...state, companyProfile: action.payload };

    case "UPDATE_COMPANY_PROFILE":
      return {
        ...state,
        companyProfile: state.companyProfile
          ? { ...state.companyProfile, ...action.payload }
          : undefined,
      };

    case "SET_AUTHORIZED_CONTACTS":
      return { ...state, authorizedContacts: action.payload };

    case "ADD_AUTHORIZED_CONTACT":
      return {
        ...state,
        authorizedContacts: [...state.authorizedContacts, action.payload],
      };

    case "UPDATE_AUTHORIZED_CONTACT":
      return {
        ...state,
        authorizedContacts: state.authorizedContacts.map((contact) =>
          contact.id === action.payload.id
            ? { ...contact, ...action.payload.updates }
            : contact,
        ),
      };

    case "REMOVE_AUTHORIZED_CONTACT":
      return {
        ...state,
        authorizedContacts: state.authorizedContacts.filter(
          (contact) => contact.id !== action.payload,
        ),
      };

    case "SET_PAYMENT_METHODS":
      return { ...state, paymentMethods: action.payload };

    case "ADD_PAYMENT_METHOD":
      return {
        ...state,
        paymentMethods: [...state.paymentMethods, action.payload],
      };

    case "REMOVE_PAYMENT_METHOD":
      return {
        ...state,
        paymentMethods: state.paymentMethods.filter(
          (method) => method.id !== action.payload,
        ),
      };

    case "SET_NOTIFICATION_SETTINGS":
      return { ...state, notificationSettings: action.payload };

    case "ADD_PAYMENT_RECORD":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.orderId
            ? {
                ...order,
                payments: [...order.payments, action.payload.payment],
              }
            : order,
        ),
      };

    case "ADD_ORDER_DOCUMENT":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.orderId
            ? {
                ...order,
                documents: [...order.documents, action.payload.document],
              }
            : order,
        ),
      };

    case "UPDATE_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    default:
      return state;
  }
}

interface OrdersContextType {
  state: OrdersState;
  loadOrders: () => Promise<void>;
  loadOrderById: (id: string) => Promise<void>;
  updateOrderStatus: (
    id: string,
    status: Order["status"],
    updates?: Partial<Order>,
  ) => Promise<void>;
  markOrderAsDelivered: (id: string) => Promise<void>;
  addPaymentRecord: (
    orderId: string,
    payment: Omit<PaymentRecord, "id">,
  ) => Promise<void>;
  downloadDocument: (orderId: string, documentId: string) => Promise<void>;
  loadCompanyProfile: () => Promise<void>;
  updateCompanyProfile: (updates: Partial<CompanyProfile>) => Promise<void>;
  loadAuthorizedContacts: () => Promise<void>;
  addAuthorizedContact: (
    contact: Omit<AuthorizedContact, "id" | "createdAt">,
  ) => Promise<void>;
  updateAuthorizedContact: (
    id: string,
    updates: Partial<AuthorizedContact>,
  ) => Promise<void>;
  removeAuthorizedContact: (id: string) => Promise<void>;
  loadPaymentMethods: () => Promise<void>;
  addPaymentMethod: (
    method: Omit<PaymentMethod, "id" | "createdAt">,
  ) => Promise<void>;
  removePaymentMethod: (id: string) => Promise<void>;
  loadNotificationSettings: () => Promise<void>;
  updateNotificationSettings: (settings: NotificationSettings) => Promise<void>;
  updateFilters: (filters: Partial<OrdersState["filters"]>) => void;
  exportOrderHistory: (format: "csv" | "xlsx") => Promise<void>;
  downloadGroupedInvoices: () => Promise<void>;
  getFilteredOrders: () => Order[];
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ordersReducer, initialState);

  const loadOrders = async () => {
    // Simulate API call with mock data
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockOrders: Order[] = [
      {
        id: "order-1",
        orderNumber: "ZLC-PO-2024-001",
        quoteId: "quote-123",
        supplierId: "supplier-1",
        supplierName: "Textiles Modernos S.A.",
        companyId: "company-1",
        status: "in_transit",
        orderType: "purchase_order",
        containers: [
          {
            id: "container-1",
            orderId: "order-1",
            productId: "product-1",
            productTitle: "Camisas Polo Premium - Lote Mixto",
            containerType: "40'",
            quantity: 2,
            unitPrice: 7500,
            subtotal: 15000,
            specifications: {
              Colores: "Blanco, Azul, Negro",
              Tallas: "S, M, L, XL",
              Material: "100% Algodón Pima",
              "Unidades por contenedor": "2,400",
            },
          },
        ],
        totalAmount: 18250,
        currency: "USD",
        incoterm: "CIF",
        paymentConditions: "30% T/T + 70% contra B/L",
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-20"),
        estimatedDelivery: new Date("2024-02-15"),
        shippingData: {
          shippingLine: "Maersk Line",
          containerNumber: "MSKU-789456",
          blNumber: "MAEUSK-BL-2024-0156",
          vesselName: "Maersk Ventosa",
          etd: new Date("2024-01-17"),
          eta: new Date("2024-01-29"),
          trackingUrl: "https://www.maersk.com/tracking/MSKU-789456",
        },
        keyDates: {
          proformaIssued: new Date("2024-01-10"),
          paymentConfirmed: new Date("2024-01-12"),
          productionStarted: new Date("2024-01-13"),
          departed: new Date("2024-01-17"),
        },
        documents: [
          {
            id: "doc-1",
            orderId: "order-1",
            type: "commercial_invoice",
            title: "Factura Comercial Final",
            fileName: "commercial-invoice-ZLC-PO-2024-001.pdf",
            fileUrl: "/documents/commercial-invoice-001.pdf",
            uploadedAt: new Date("2024-01-12"),
            uploadedBy: "system",
          },
          {
            id: "doc-2",
            orderId: "order-1",
            type: "packing_list",
            title: "Lista de Empaque",
            fileName: "packing-list-ZLC-PO-2024-001.pdf",
            fileUrl: "/documents/packing-list-001.pdf",
            uploadedAt: new Date("2024-01-15"),
            uploadedBy: "supplier",
          },
        ],
        payments: [
          {
            id: "payment-1",
            orderId: "order-1",
            type: "advance",
            amount: 5475,
            currency: "USD",
            method: "wire_transfer",
            status: "confirmed",
            paymentDate: new Date("2024-01-12"),
            reference: "TRF-2024-001-ADV",
            receipt: "/receipts/receipt-001.pdf",
          },
        ],
      },
      {
        id: "order-2",
        orderNumber: "ZLC-PO-2024-002",
        supplierId: "supplier-2",
        supplierName: "Electrodomésticos del Caribe",
        companyId: "company-1",
        status: "confirmed",
        orderType: "purchase_order",
        containers: [
          {
            id: "container-2",
            orderId: "order-2",
            productId: "product-2",
            productTitle: "Licuadoras Industriales 1200W",
            containerType: "20'",
            quantity: 1,
            unitPrice: 12800,
            subtotal: 12800,
            specifications: {
              Modelo: "LI-1200-PRO",
              Voltaje: "110V/220V",
              Capacidad: "2.5L",
              "Unidades por contenedor": "480",
            },
          },
        ],
        totalAmount: 13300,
        currency: "USD",
        incoterm: "FOB",
        paymentConditions: "50% Anticipo - 50% contra Embarque",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-16"),
        estimatedDelivery: new Date("2024-02-28"),
        keyDates: {
          proformaIssued: new Date("2024-01-15"),
          paymentConfirmed: new Date("2024-01-16"),
        },
        documents: [],
        payments: [
          {
            id: "payment-2",
            orderId: "order-2",
            type: "advance",
            amount: 6650,
            currency: "USD",
            method: "wire_transfer",
            status: "confirmed",
            paymentDate: new Date("2024-01-16"),
            reference: "TRF-2024-002-ADV",
          },
        ],
      },
    ];

    dispatch({ type: "SET_ORDERS", payload: mockOrders });
  };

  const loadOrderById = async (id: string) => {
    const order = state.orders.find((o) => o.id === id);
    if (order) {
      dispatch({ type: "SET_CURRENT_ORDER", payload: order });
    }
  };

  const updateOrderStatus = async (
    id: string,
    status: Order["status"],
    updates?: Partial<Order>,
  ) => {
    dispatch({
      type: "UPDATE_ORDER",
      payload: { id, updates: { status, ...updates, updatedAt: new Date() } },
    });
  };

  const markOrderAsDelivered = async (id: string) => {
    const deliveryDate = new Date();
    dispatch({
      type: "UPDATE_ORDER",
      payload: {
        id,
        updates: {
          status: "delivered",
          actualDelivery: deliveryDate,
          keyDates: {
            ...state.orders.find((o) => o.id === id)?.keyDates,
            delivered: deliveryDate,
          },
          updatedAt: deliveryDate,
        },
      },
    });
  };

  const addPaymentRecord = async (
    orderId: string,
    payment: Omit<PaymentRecord, "id">,
  ) => {
    const newPayment: PaymentRecord = {
      ...payment,
      id: `payment-${Date.now()}`,
    };
    dispatch({
      type: "ADD_PAYMENT_RECORD",
      payload: { orderId, payment: newPayment },
    });
  };

  const downloadDocument = async (orderId: string, documentId: string) => {
    // Simulate document download
    console.log(`Downloading document ${documentId} for order ${orderId}`);
  };

  const loadCompanyProfile = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockProfile: CompanyProfile = {
      id: "company-1",
      legalName: "Importadora Central América S.A.",
      taxId: "RUC-123456789-01",
      fiscalAddress: {
        street: "Avenida Central 123",
        city: "San José",
        state: "San José",
        postalCode: "10001",
        country: "Costa Rica",
      },
      contactInfo: {
        phone: "+506 2234-5678",
        email: "contacto@importadoraca.com",
        website: "www.importadoraca.com",
      },
      verificationStatus: "verified",
      createdAt: new Date("2023-06-15"),
      updatedAt: new Date("2024-01-10"),
    };

    dispatch({ type: "SET_COMPANY_PROFILE", payload: mockProfile });
  };

  const updateCompanyProfile = async (updates: Partial<CompanyProfile>) => {
    dispatch({
      type: "UPDATE_COMPANY_PROFILE",
      payload: { ...updates, updatedAt: new Date() },
    });
  };

  const loadAuthorizedContacts = async () => {
    const mockContacts: AuthorizedContact[] = [
      {
        id: "contact-1",
        companyId: "company-1",
        name: "María González",
        email: "maria.gonzalez@importadoraca.com",
        phone: "+506 2234-5678",
        position: "Gerente de Compras",
        role: "buyer",
        permissions: ["create_orders", "approve_payments"],
        isActive: true,
        createdAt: new Date("2023-06-15"),
      },
      {
        id: "contact-2",
        companyId: "company-1",
        name: "Carlos Rodríguez",
        email: "carlos.rodriguez@importadoraca.com",
        phone: "+506 2234-5679",
        position: "Director Financiero",
        role: "approver",
        permissions: ["approve_orders", "approve_payments", "view_reports"],
        isActive: true,
        createdAt: new Date("2023-07-01"),
      },
    ];

    dispatch({ type: "SET_AUTHORIZED_CONTACTS", payload: mockContacts });
  };

  const addAuthorizedContact = async (
    contact: Omit<AuthorizedContact, "id" | "createdAt">,
  ) => {
    const newContact: AuthorizedContact = {
      ...contact,
      id: `contact-${Date.now()}`,
      createdAt: new Date(),
    };
    dispatch({ type: "ADD_AUTHORIZED_CONTACT", payload: newContact });
  };

  const updateAuthorizedContact = async (
    id: string,
    updates: Partial<AuthorizedContact>,
  ) => {
    dispatch({ type: "UPDATE_AUTHORIZED_CONTACT", payload: { id, updates } });
  };

  const removeAuthorizedContact = async (id: string) => {
    dispatch({ type: "REMOVE_AUTHORIZED_CONTACT", payload: id });
  };

  const loadPaymentMethods = async () => {
    const mockMethods: PaymentMethod[] = [
      {
        id: "payment-method-1",
        companyId: "company-1",
        type: "wire_transfer",
        title: "Cuenta USD Principal",
        isDefault: true,
        bankData: {
          bankName: "Banco Nacional de Costa Rica",
          swift: "BNCRCRSJ",
          bic: "BNCRCRSJ",
          accountNumber: "1234567890",
          accountHolder: "Importadora Central América S.A.",
          currency: "USD",
        },
        createdAt: new Date("2023-06-15"),
      },
    ];

    dispatch({ type: "SET_PAYMENT_METHODS", payload: mockMethods });
  };

  const addPaymentMethod = async (
    method: Omit<PaymentMethod, "id" | "createdAt">,
  ) => {
    const newMethod: PaymentMethod = {
      ...method,
      id: `method-${Date.now()}`,
      createdAt: new Date(),
    };
    dispatch({ type: "ADD_PAYMENT_METHOD", payload: newMethod });
  };

  const removePaymentMethod = async (id: string) => {
    dispatch({ type: "REMOVE_PAYMENT_METHOD", payload: id });
  };

  const loadNotificationSettings = async () => {
    const mockSettings: NotificationSettings = {
      companyId: "company-1",
      productionCompleted: { email: true, sms: false },
      shipmentDeparted: { email: true, sms: true },
      portArrival: { email: true, sms: false },
      paymentPending: { email: true, sms: true },
      incidentOpened: { email: true, sms: true },
    };

    dispatch({ type: "SET_NOTIFICATION_SETTINGS", payload: mockSettings });
  };

  const updateNotificationSettings = async (settings: NotificationSettings) => {
    dispatch({ type: "SET_NOTIFICATION_SETTINGS", payload: settings });
  };

  const updateFilters = (filters: Partial<OrdersState["filters"]>) => {
    dispatch({ type: "UPDATE_FILTERS", payload: filters });
  };

  const exportOrderHistory = async (format: "csv" | "xlsx") => {
    // Simulate export
    console.log(`Exporting order history as ${format}`);
  };

  const downloadGroupedInvoices = async () => {
    // Simulate download
    console.log("Downloading grouped invoices as ZIP");
  };

  const getFilteredOrders = () => {
    let filtered = state.orders;

    // Filter by status
    if (state.filters.status) {
      filtered = filtered.filter(
        (order) => order.status === state.filters.status,
      );
    }

    // Filter by search term
    if (state.filters.searchTerm) {
      const searchTerm = state.filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm) ||
          order.supplierName.toLowerCase().includes(searchTerm),
      );
    }

    // Filter by date range
    if (state.filters.dateRange.from) {
      filtered = filtered.filter(
        (order) => order.createdAt >= state.filters.dateRange.from!,
      );
    }
    if (state.filters.dateRange.to) {
      filtered = filtered.filter(
        (order) => order.createdAt <= state.filters.dateRange.to!,
      );
    }

    return filtered;
  };

  return (
    <OrdersContext.Provider
      value={{
        state,
        loadOrders,
        loadOrderById,
        updateOrderStatus,
        markOrderAsDelivered,
        addPaymentRecord,
        downloadDocument,
        loadCompanyProfile,
        updateCompanyProfile,
        loadAuthorizedContacts,
        addAuthorizedContact,
        updateAuthorizedContact,
        removeAuthorizedContact,
        loadPaymentMethods,
        addPaymentMethod,
        removePaymentMethod,
        loadNotificationSettings,
        updateNotificationSettings,
        updateFilters,
        exportOrderHistory,
        downloadGroupedInvoices,
        getFilteredOrders,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}
