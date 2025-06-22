import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  ShippingRequest,
  TransportOption,
  TransportBooking,
  CustomsDocument,
  OrderTracking,
  Incident,
} from "@/types";

interface ShippingState {
  shippingRequests: ShippingRequest[];
  transportOptions: TransportOption[];
  bookings: TransportBooking[];
  customsDocuments: CustomsDocument[];
  trackingHistory: OrderTracking[];
  incidents: Incident[];
  selectedShippingRequest?: ShippingRequest;
  selectedTransportOption?: TransportOption;
  currentBooking?: TransportBooking;
}

type ShippingAction =
  | { type: "CREATE_SHIPPING_REQUEST"; payload: ShippingRequest }
  | { type: "SET_TRANSPORT_OPTIONS"; payload: TransportOption[] }
  | { type: "SELECT_TRANSPORT_OPTION"; payload: TransportOption }
  | { type: "CREATE_BOOKING"; payload: TransportBooking }
  | {
      type: "UPDATE_BOOKING_STATUS";
      payload: {
        id: string;
        status: TransportBooking["status"];
        tracking?: OrderTracking;
      };
    }
  | { type: "ADD_CUSTOMS_DOCUMENT"; payload: CustomsDocument }
  | { type: "ADD_TRACKING_UPDATE"; payload: OrderTracking }
  | { type: "CREATE_INCIDENT"; payload: Incident }
  | {
      type: "UPDATE_INCIDENT";
      payload: { id: string; updates: Partial<Incident> };
    }
  | { type: "SET_SELECTED_SHIPPING_REQUEST"; payload: ShippingRequest }
  | { type: "SET_CURRENT_BOOKING"; payload: TransportBooking };

const initialState: ShippingState = {
  shippingRequests: [],
  transportOptions: [],
  bookings: [],
  customsDocuments: [],
  trackingHistory: [],
  incidents: [],
};

function shippingReducer(
  state: ShippingState,
  action: ShippingAction,
): ShippingState {
  switch (action.type) {
    case "CREATE_SHIPPING_REQUEST":
      return {
        ...state,
        shippingRequests: [...state.shippingRequests, action.payload],
        selectedShippingRequest: action.payload,
      };

    case "SET_TRANSPORT_OPTIONS":
      return {
        ...state,
        transportOptions: action.payload,
      };

    case "SELECT_TRANSPORT_OPTION":
      return {
        ...state,
        selectedTransportOption: action.payload,
      };

    case "CREATE_BOOKING":
      return {
        ...state,
        bookings: [...state.bookings, action.payload],
        currentBooking: action.payload,
      };

    case "UPDATE_BOOKING_STATUS":
      const updatedBookings = state.bookings.map((booking) =>
        booking.id === action.payload.id
          ? { ...booking, status: action.payload.status }
          : booking,
      );

      const newTracking = action.payload.tracking
        ? [...state.trackingHistory, action.payload.tracking]
        : state.trackingHistory;

      return {
        ...state,
        bookings: updatedBookings,
        trackingHistory: newTracking,
        currentBooking:
          state.currentBooking?.id === action.payload.id
            ? { ...state.currentBooking, status: action.payload.status }
            : state.currentBooking,
      };

    case "ADD_CUSTOMS_DOCUMENT":
      return {
        ...state,
        customsDocuments: [...state.customsDocuments, action.payload],
      };

    case "ADD_TRACKING_UPDATE":
      return {
        ...state,
        trackingHistory: [...state.trackingHistory, action.payload],
      };

    case "CREATE_INCIDENT":
      return {
        ...state,
        incidents: [...state.incidents, action.payload],
      };

    case "UPDATE_INCIDENT":
      return {
        ...state,
        incidents: state.incidents.map((incident) =>
          incident.id === action.payload.id
            ? { ...incident, ...action.payload.updates }
            : incident,
        ),
      };

    case "SET_SELECTED_SHIPPING_REQUEST":
      return {
        ...state,
        selectedShippingRequest: action.payload,
      };

    case "SET_CURRENT_BOOKING":
      return {
        ...state,
        currentBooking: action.payload,
      };

    default:
      return state;
  }
}

interface ShippingContextType {
  state: ShippingState;
  createShippingRequest: (
    request: Omit<ShippingRequest, "id" | "createdAt">,
  ) => void;
  requestTransportOptions: (shippingRequestId: string) => Promise<void>;
  selectTransportOption: (option: TransportOption) => void;
  confirmBooking: (
    bookingData: Omit<TransportBooking, "id" | "createdAt" | "notifications">,
  ) => void;
  updateBookingStatus: (
    id: string,
    status: TransportBooking["status"],
    tracking?: Omit<OrderTracking, "id">,
  ) => void;
  generateCustomsDocuments: (bookingId: string) => void;
  createIncident: (incident: Omit<Incident, "id" | "reportedAt">) => void;
  getBookingById: (id: string) => TransportBooking | undefined;
  getTrackingHistory: (bookingId: string) => OrderTracking[];
  getIncidentsByBooking: (bookingId: string) => Incident[];
}

const ShippingContext = createContext<ShippingContextType | undefined>(
  undefined,
);

export function ShippingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(shippingReducer, initialState);

  const createShippingRequest = (
    request: Omit<ShippingRequest, "id" | "createdAt">,
  ) => {
    const newRequest: ShippingRequest = {
      ...request,
      id: `shipping-${Date.now()}`,
      createdAt: new Date(),
    };
    dispatch({ type: "CREATE_SHIPPING_REQUEST", payload: newRequest });
  };

  const requestTransportOptions = async (shippingRequestId: string) => {
    // Simulate API call to get transport options from logistics partners
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockOptions: TransportOption[] = [
      {
        id: `option-${Date.now()}-1`,
        shippingRequestId,
        operatorName: "Maersk Line",
        operatorId: "maersk-001",
        incoterm: "CIF",
        cost: 2450,
        currency: "USD",
        transitTime: 12,
        conditions: {
          insurance: true,
          customs: true,
          documentation: true,
          specialHandling: ["Container sealing", "GPS tracking"],
        },
        availability: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        rating: 4.8,
        verified: true,
      },
      {
        id: `option-${Date.now()}-2`,
        shippingRequestId,
        operatorName: "MSC Logistics",
        operatorId: "msc-002",
        incoterm: "FOB",
        cost: 1890,
        currency: "USD",
        transitTime: 15,
        conditions: {
          insurance: false,
          customs: false,
          documentation: true,
        },
        availability: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        validUntil: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        rating: 4.5,
        verified: true,
      },
      {
        id: `option-${Date.now()}-3`,
        shippingRequestId,
        operatorName: "CMA CGM",
        operatorId: "cma-003",
        incoterm: "CFR",
        cost: 2180,
        currency: "USD",
        transitTime: 14,
        conditions: {
          insurance: false,
          customs: true,
          documentation: true,
          specialHandling: ["Temperature control", "Container monitoring"],
        },
        availability: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        validUntil: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        rating: 4.6,
        verified: true,
      },
    ];

    dispatch({ type: "SET_TRANSPORT_OPTIONS", payload: mockOptions });
  };

  const selectTransportOption = (option: TransportOption) => {
    dispatch({ type: "SELECT_TRANSPORT_OPTION", payload: option });
  };

  const confirmBooking = (
    bookingData: Omit<TransportBooking, "id" | "createdAt" | "notifications">,
  ) => {
    const newBooking: TransportBooking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      createdAt: new Date(),
      notifications: [],
    };
    dispatch({ type: "CREATE_BOOKING", payload: newBooking });

    // Generate initial customs documents
    generateCustomsDocuments(newBooking.id);
  };

  const updateBookingStatus = (
    id: string,
    status: TransportBooking["status"],
    tracking?: Omit<OrderTracking, "id">,
  ) => {
    const trackingUpdate = tracking
      ? {
          ...tracking,
          id: `tracking-${Date.now()}`,
        }
      : undefined;

    dispatch({
      type: "UPDATE_BOOKING_STATUS",
      payload: { id, status, tracking: trackingUpdate },
    });
  };

  const generateCustomsDocuments = (bookingId: string) => {
    const documents: CustomsDocument[] = [
      {
        id: `doc-${Date.now()}-1`,
        bookingId,
        type: "commercial_invoice",
        title: "Factura Comercial Final",
        description:
          "Factura comercial con desglose de mercancía, flete y comisión",
        status: "ready",
        generatedAt: new Date(),
      },
      {
        id: `doc-${Date.now()}-2`,
        bookingId,
        type: "packing_list",
        title: "Packing List Definitivo",
        description: "Lista detallada del contenido del contenedor",
        status: "ready",
        generatedAt: new Date(),
      },
      {
        id: `doc-${Date.now()}-3`,
        bookingId,
        type: "customs_data",
        title: "Datos Aduaneros Básicos",
        description:
          "Código HS, valor FOB, Incoterm y clasificación arancelaria",
        status: "ready",
        generatedAt: new Date(),
      },
      {
        id: `doc-${Date.now()}-4`,
        bookingId,
        type: "zlc_checklist",
        title: "Checklist ZLC",
        description: "Documentos requeridos en Zona Libre de Colón",
        status: "ready",
        generatedAt: new Date(),
      },
      {
        id: `doc-${Date.now()}-5`,
        bookingId,
        type: "destination_checklist",
        title: "Checklist Destino",
        description: "Documentos requeridos en puerto de destino",
        status: "ready",
        generatedAt: new Date(),
      },
    ];

    documents.forEach((doc) => {
      dispatch({ type: "ADD_CUSTOMS_DOCUMENT", payload: doc });
    });
  };

  const createIncident = (incident: Omit<Incident, "id" | "reportedAt">) => {
    const newIncident: Incident = {
      ...incident,
      id: `incident-${Date.now()}`,
      reportedAt: new Date(),
    };
    dispatch({ type: "CREATE_INCIDENT", payload: newIncident });
  };

  const getBookingById = (id: string) => {
    return state.bookings.find((booking) => booking.id === id);
  };

  const getTrackingHistory = (bookingId: string) => {
    return state.trackingHistory.filter(
      (tracking) => tracking.bookingId === bookingId,
    );
  };

  const getIncidentsByBooking = (bookingId: string) => {
    return state.incidents.filter(
      (incident) => incident.bookingId === bookingId,
    );
  };

  return (
    <ShippingContext.Provider
      value={{
        state,
        createShippingRequest,
        requestTransportOptions,
        selectTransportOption,
        confirmBooking,
        updateBookingStatus,
        generateCustomsDocuments,
        createIncident,
        getBookingById,
        getTrackingHistory,
        getIncidentsByBooking,
      }}
    >
      {children}
    </ShippingContext.Provider>
  );
}

export function useShipping() {
  const context = useContext(ShippingContext);
  if (context === undefined) {
    throw new Error("useShipping must be used within a ShippingProvider");
  }
  return context;
}
